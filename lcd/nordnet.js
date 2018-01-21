const Nordnet = require('nordnet');

const nordnet = new Nordnet();

nordnet.authenticate({
}).then((f) => {
  nordnet.on('public', data => console.log('Public feed:', data));
  nordnet.subscribe('trades', {i: '1869', m: 24});
}, err => {
  console.log('err', err.message);
});
