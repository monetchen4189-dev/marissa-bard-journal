(() => {
  const rows = [...document.querySelectorAll('.library-row')];
  const filters = [...document.querySelectorAll('[data-category]')];
  const count = document.getElementById('result-count');
  const pagination = document.getElementById('pagination');
  const empty = document.getElementById('empty-state');
  if (!count || !pagination) return;
  const pageSize = 6;
  const params = new URL(location.href).searchParams;
  let selected = filters.some(b => b.dataset.category === params.get('category')) ? params.get('category') : '全部';
  let page = Math.max(1, Number.parseInt(params.get('page'), 10) || 1);
  function render() {
    const matches = rows.filter(row => selected === '全部' || JSON.parse(row.dataset.categories).includes(selected));
    const pages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, pages);
    const start = (page - 1) * pageSize;
    const visible = new Set(matches.slice(start, start + pageSize));
    rows.forEach(row => { row.hidden = !visible.has(row); });
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === selected)));
    count.textContent = `${selected} · ${matches.length} 篇`;
    empty.hidden = matches.length !== 0;
    pagination.replaceChildren();
    pagination.hidden = pages <= 1;
    function button(label, target, disabled = false, current = false) {
      const element = document.createElement('button');
      element.type = 'button'; element.textContent = label;
      element.dataset.page = String(target); element.disabled = disabled;
      if (current) element.setAttribute('aria-current', 'page');
      pagination.append(element);
    }
    button('上一页', page - 1, page === 1);
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || Math.abs(i - page) <= 1) button(String(i), i, false, i === page);
      else if (i === page - 2 || i === page + 2) {
        const dots = document.createElement('span'); dots.textContent = '…'; pagination.append(dots);
      }
    }
    button('下一页', page + 1, page === pages);
    const url = new URL(location.href);
    selected === '全部' ? url.searchParams.delete('category') : url.searchParams.set('category', selected);
    page === 1 ? url.searchParams.delete('page') : url.searchParams.set('page', String(page));
    history.replaceState(null, '', url);
  }
  filters.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.category; page = 1; render();
  }));
  pagination.addEventListener('click', event => {
    const button = event.target.closest('button[data-page]');
    if (!button || button.disabled) return;
    page = Number(button.dataset.page); render();
    document.getElementById('articles').scrollIntoView({block: 'start'});
    pagination.querySelector('[aria-current="page"]')?.focus({preventScroll: true});
  });
  render();
})();
