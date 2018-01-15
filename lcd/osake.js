let https = require('https');

const cheerio = require('cheerio');


function readOsakkeet(cb) {
  let osakeArray = [];
  https.get({
    hostname: 'www.kauppalehti.fi',
    headers: {
      'Content-Type': 'application/html'
    },
    path: '/5/i/porssi/porssikurssit/lista.jsp?reverse=false&order=alpha&markets=XHEL&volume=cur&psize=50&listIds=kaikki&rdc=160f4cd3c8f&gics=0&refresh=60&currency=euro#1515936063944'
  }, res => {
    res.setEncoding('binary');
    let str = '';
    res.on('data', (chunk) => {
      str += chunk;

    });
    res.on('end', function () {
      const $ = cheerio.load(str);
      // your code here if you want to use the results !
      $('.table_stockexchange tr:not(.strong):not(:first-child)').each((index, elem) => {
        const elems = elem.children;
        const nimi = $(elems[1]).text();
        const viimeisin = $(elems[3]).text();
        osakeArray.push({nimi, viimeisin});
      });
      osakeArray.sort((a, b) => a.nimi.localeCompare(b.nimi));
      cb(osakeArray);
    });

  });
}

module.exports.readOsakkeet = readOsakkeet;