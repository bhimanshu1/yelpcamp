function toggleSearch() {
  document.getElementById('spotlight').classList.toggle('visible');
  document.getElementById('overlay').classList.toggle('visible');
  if (document.getElementById('spotlight').classList.contains('visible')) {
    setTimeout(() => document.querySelector('#spotlight input').focus(), 50);
  }
}
