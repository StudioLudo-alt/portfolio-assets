// Each mechanism owns one figure. Its position follows the reading order on small screens.
const campaignLayout = window.matchMedia('(min-width: 761px)');
document.querySelectorAll('.air-mechanisms').forEach(panel => {
  const mediaColumn = panel.querySelector('.air-media-side');
  const items = [...panel.querySelectorAll('details')].map(drawer => ({
    drawer,
    body: drawer.querySelector('.air-drawer-body'),
    figure: drawer.querySelector('.air-mechanism-visual'),
  }));

  function updateLayout() {
    for (const item of items) {
      const target = campaignLayout.matches && item.drawer.open ? mediaColumn : item.body;
      if (item.figure.parentNode !== target) target.append(item.figure);
    }
  }

  for (const item of items) {
    item.drawer.addEventListener('toggle', updateLayout);
    item.drawer.querySelector('summary').addEventListener('click', event => {
      if (item.drawer.open) event.preventDefault();
      else items.forEach(other => { if (other !== item) other.drawer.open = false; });
    });
  }
  campaignLayout.addEventListener('change', updateLayout);
  panel.classList.add('air-enhanced');
  updateLayout();
});
