const Browser = require('zombie');
const browser = new Browser();

browser.visit('https://www.nordnet.fi/mux/login/start.html?cmpi=start-loggain&state=signin', done => {
  console.log('jee', browser.query('input') );

});