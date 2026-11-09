(() => {
  const root = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme === 'dark' || (!root.dataset.theme && systemDark.matches);
  const updateThemeButton = () => {
    if (!toggle) return;
    const label = isDark() ? '切换到浅色模式' : '切换到深色模式';
    toggle.setAttribute('aria-label', label);
    toggle.title = label;
    toggle.querySelector('.theme-symbol').innerHTML = isDark()
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 14a8 8 0 0 1-10-10 8.5 8.5 0 1 0 10 10Z"/></svg>';
  };
  toggle?.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('sh-theme', root.dataset.theme); } catch {}
    updateThemeButton();
  });
  systemDark.addEventListener?.('change', updateThemeButton);
  updateThemeButton();

  const search = document.querySelector('#search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-post]')];
  let category = '全部';
  function filterPosts() {
    const query = (search?.value || '').trim().toLocaleLowerCase();
    let count = 0;
    cards.forEach(card => {
      const show = (category === '全部' || card.dataset.category === category) && card.dataset.search.toLocaleLowerCase().includes(query);
      card.hidden = !show;
      if (show) count++;
    });
    document.querySelector('#empty-state').hidden = count > 0;
    document.querySelector('#search-status').textContent = query || category !== '全部' ? `找到 ${count} 篇文章` : '';
  }
  filters.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.filter;
    filters.forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    filterPosts();
  }));
  search?.addEventListener('input', filterPosts);
  document.querySelector('#reset-search')?.addEventListener('click', () => {
    search.value = '';
    filters[0].click();
    search.focus();
  });
  document.querySelectorAll('.copy-code').forEach(button => button.addEventListener('click', async () => {
    const block = button.closest('.code-block');
    try {
      await navigator.clipboard.writeText(block.querySelector('code').textContent);
      button.textContent = '已复制';
      block.querySelector('.copy-status').textContent = '代码已复制到剪贴板';
    } catch {
      button.textContent = '请手动选择代码';
      block.querySelector('.copy-status').textContent = '浏览器不支持自动复制，请手动选择代码';
    }
    window.setTimeout(() => { button.textContent = '复制代码'; }, 2200);
  }));
  const progress = document.querySelector('.reading-progress');
  if (progress) {
    let scheduled = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = `${max > 0 ? Math.max(0, Math.min(100, window.scrollY / max * 100)) : 100}%`;
      scheduled = false;
    };
    window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
