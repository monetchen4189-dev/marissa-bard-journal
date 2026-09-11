(() => {
  const rows = [...document.querySelectorAll('.library-row')];
  const buttons = [...document.querySelectorAll('[data-category]')];
  const count = document.getElementById('result-count');
  const more = document.getElementById('load-more');
  const empty = document.getElementById('empty-state');
  if (!count) return;
  const pageSize = 12;
  let limit = pageSize;
  const requested = new URL(location.href).searchParams.get('category');
  let selected = buttons.some(b => b.dataset.category === requested) ? requested : '全部';
  function render() {
    const matches = rows.filter(row => selected === '全部' || JSON.parse(row.dataset.categories).includes(selected));
    const visible = new Set(matches.slice(0, limit));
    rows.forEach(row => { row.hidden = !visible.has(row); });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === selected)));
    count.textContent = `${selected} · ${matches.length} 篇`;
    more.hidden = matches.length <= limit;
    empty.hidden = matches.length !== 0;
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    selected = button.dataset.category;
    limit = pageSize;
    const url = new URL(location.href);
    if (selected === '全部') url.searchParams.delete('category');
    else url.searchParams.set('category', selected);
    history.replaceState(null, '', url);
    render();
  }));
  more.addEventListener('click', () => { limit += pageSize; render(); });
  render();
})();
