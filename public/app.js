(() => {
  const menu = document.querySelector('[data-mobile-menu]');
  const menuButton = document.querySelector('[data-menu-open]');
  menuButton?.addEventListener('click', () => menu?.classList.toggle('is-open'));
  const modal = document.querySelector('[data-search-modal]');
  const input = document.querySelector('[data-search-input]');
  const results = document.querySelector('[data-search-results]');
  const pages = [
    ['机场推荐与选择指南', '/airport-recommendation/', '预算、线路、流量与使用场景'],
    ['光年梯机场测评', '/posts/guangnianti-review/', '18 元 / 120GB / IEPL / GNT80'],
    ['瞬云机场测评', '/posts/shunyun-review/', '18 元 / 100GB / IPLC / 20OFF'],
    ['云图机场测评', '/posts/yuntu-review/', '18 元 / 100GB / IEPL / yt88'],
    ['鲲鹏加速测评', '/posts/kunpeng-review/', '12 元 / 直连 / 暂无优惠码'],
    ['机场订阅链接怎么用', '/posts/subscription-import/', 'Clash、Shadowrocket、v2rayN、sing-box'],
    ['IPLC、IEPL 与中转区别', '/posts/iplc-iepl-transit/', '线路原理与测试方法'],
    ['晚高峰变慢怎么办', '/posts/peak-hour-slow/', '延迟、丢包和本地网络排查'],
    ['机场优惠码汇总', '/posts/coupons-pricing/', '月付、套餐与购买前检查'],
    ['品牌库与横向对比', '/compare/', '价格、流量、线路与优惠码']
  ];
  const open = () => { if (!modal) return; modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); input?.focus(); render(''); };
  const close = () => { modal?.classList.remove('is-open'); modal?.setAttribute('aria-hidden', 'true'); };
  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', open));
  document.querySelector('[data-search-close]')?.addEventListener('click', close);
  modal?.addEventListener('click', (event) => { if (event.target === modal) close(); });
  document.addEventListener('keydown', (event) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); open(); } if (event.key === 'Escape') close(); });
  function render(query) {
    if (!results) return;
    const q = query.trim().toLowerCase();
    const matches = pages.filter(([title, , summary]) => !q || `${title} ${summary}`.toLowerCase().includes(q)).slice(0, 7);
    results.innerHTML = matches.map(([title, href, summary]) => `<a class="search-result" href="${href}"><strong>${title}</strong><small>${summary}</small></a>`).join('') || '<p class="muted">没有找到匹配内容，试试“专线”或“Clash”。</p>';
  }
  input?.addEventListener('input', (event) => render(event.target.value));
  document.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => { const text = button.dataset.copy || ''; if (text === '暂无优惠码') return; try { await navigator.clipboard.writeText(text); button.innerHTML = `${text} <span>已复制</span>`; setTimeout(() => { button.innerHTML = `${text} <span>复制</span>`; }, 1500); } catch { button.innerHTML = `${text} <span>请手动复制</span>`; } }));
  const fields = [...document.querySelectorAll('[data-traffic-web], [data-traffic-video], [data-traffic-download]')];
  const total = document.querySelector('[data-traffic-result]');
  const updateTraffic = () => { if (!total) return; total.textContent = `${fields.reduce((sum, field) => sum + (Number(field.value) || 0), 0)}GB`; };
  fields.forEach((field) => field.addEventListener('input', updateTraffic));
})();
