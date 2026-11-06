(() => {
  const basePath = document.querySelector('script[data-base-path]')?.dataset.basePath || '';
  const menu = document.querySelector('[data-mobile-menu]');
  const menuButton = document.querySelector('[data-menu-open]');
  menuButton?.addEventListener('click', () => { const open = menu?.classList.toggle('is-open'); menuButton.setAttribute('aria-expanded', String(Boolean(open))); });
  const themeButton = document.querySelector('[data-theme-toggle]');
  const syncTheme = () => themeButton?.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
  syncTheme();
  themeButton?.addEventListener('click', () => { const dark = document.documentElement.dataset.theme !== 'dark'; document.documentElement.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('xjichang-theme', dark ? 'dark' : 'light'); } catch {} syncTheme(); });
  const modal = document.querySelector('[data-search-modal]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  let pages = [], returnFocus, loading;
  async function loadSearch() {
    if (!loading) loading = fetch(`${basePath}/search-index.json`).then((response) => { if (!response.ok) throw new Error('search unavailable'); return response.json(); }).then((data) => { pages = data; });
    try { await loading; render(input?.value || ''); } catch { if (results) results.textContent = '暂时无法加载搜索，请进入文章库查阅。'; loading = null; }
  }
  const open = () => { if (!modal) return; returnFocus = document.activeElement; modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden'; input?.focus(); if (results) results.textContent = '正在加载文章索引…'; loadSearch(); };
  const close = () => { modal?.classList.remove('is-open'); modal?.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; returnFocus?.focus(); };
  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', open));
  document.querySelector('[data-search-close]')?.addEventListener('click', close);
  modal?.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); }
    if (event.key === 'Escape' && modal?.classList.contains('is-open')) close();
    if (event.key === 'Tab' && modal?.classList.contains('is-open')) {
      const focusable = [...modal.querySelectorAll('button, input, a')];
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus(); }
    }
  });
  function render(query) {
    if (!results) return;
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = pages.map((page) => { const title = `${page.title} ${page.tags.join(' ')}`.toLowerCase(); const text = `${title} ${page.description} ${page.text}`.toLowerCase(); return { ...page, score: words.every((word) => text.includes(word)) ? words.reduce((sum, word) => sum + (title.includes(word) ? 3 : 1), 1) : 0 }; }).filter((page) => page.score).sort((a, b) => b.score - a.score).slice(0, 8);
    results.replaceChildren();
    for (const page of matches) { const link = document.createElement('a'); link.className = 'search-result'; link.href = page.url; const title = document.createElement('strong'); title.textContent = page.title; const detail = document.createElement('small'); detail.textContent = page.description; link.append(title, detail); results.append(link); }
    if (!matches.length) results.textContent = '没有找到匹配内容，试试“IPLC”“Clash”或“光年梯”。';
  }
  input?.addEventListener('input', (event) => render(event.target.value));
  document.querySelectorAll('[data-copy]').forEach((button) => { if (button.dataset.copy === '暂无优惠码') { button.disabled = true; button.textContent = '暂无'; return; } button.addEventListener('click', async () => { const value = button.dataset.copy; try { await navigator.clipboard.writeText(value); button.textContent = `${value} 已复制`; } catch { button.textContent = `${value} 请手动复制`; } setTimeout(() => { button.textContent = `${value} 复制`; }, 1800); }); });
  const fields = [...document.querySelectorAll('[data-traffic-web], [data-traffic-video], [data-traffic-download]')];
  const total = document.querySelector('[data-traffic-result]');
  const multiplier = document.querySelector('[data-traffic-multiplier]');
  const capacity = document.querySelector('[data-traffic-capacity]');
  const allowance = document.querySelector('[data-traffic-allowance]');
  const valid = (field, fallback = 0) => Number.isFinite(Number(field?.value)) ? Math.max(0, Number(field.value)) : fallback;
  const updateTraffic = () => { if (!total) return; const usage = fields.reduce((sum, field) => sum + valid(field), 0) * valid(multiplier, 1); total.textContent = `${Number(usage.toFixed(2))}GB`; if (allowance) allowance.textContent = usage <= valid(capacity) ? `按 ${valid(capacity)}GB 额度估算，剩余约 ${Number((valid(capacity) - usage).toFixed(2))}GB。` : `按 ${valid(capacity)}GB 额度估算，预计超出 ${Number((usage - valid(capacity)).toFixed(2))}GB。`; };
  [...fields, multiplier, capacity].filter(Boolean).forEach((field) => field.addEventListener('input', updateTraffic));
  updateTraffic();
  const compareSearch = document.querySelector('[data-compare-search]');
  compareSearch?.addEventListener('input', () => { const value = compareSearch.value.trim().toLowerCase(); let visible = 0; document.querySelectorAll('.compare-table tbody tr').forEach((row) => { row.hidden = !row.textContent.toLowerCase().includes(value); if (!row.hidden) visible++; }); const status = document.querySelector('[data-compare-status]'); if (status) status.textContent = `${visible} 个匹配品牌`; });
})();
