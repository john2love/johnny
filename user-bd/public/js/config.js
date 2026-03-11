window.API_BASE_URL = (() => {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }
  return `${location.protocol}//${location.host}`;
})();
