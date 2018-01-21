let Client = require('coinbase').Client;
let client = new Client({'apiKey': process.env.COIN_APIKEY, 'apiSecret': process.env.COIN_APISECRET, version: '2018-01-18'});

let buyQueue = [];
const LIMIT = 100;


client.getAccount('869f48d5-1a5f-5c59-b574-d03670f65378', (err, account) => {
  buyPromiseFn(client, account);
});

client.getAccount('869f48d5-1a5f-5c59-b574-d03670f65378', (err, account) => {
  sellPromiseFn(client, account)

});

function parseKlo(aika) {
  if (aika >= 10) {
    return aika;
  }
  return '0' + aika;
}

const AVERAGE_LIMIT = 7;
const BUY_LIMIT = 3;

function buyPromiseFn(client, account) {
  setTimeout(() =>
      Promise.all([getTransaction(account), getBuyPrice(client, {currencyPair: 'ETH-EUR'})])
        .then(promises => {
          console.log('osto');
          const [txn, price] = promises;
          checkBuyPrice(parseFloat(price.data.amount));

          if ('completed' === txn.status && txn.sell) {
            console.log('aktiivinen');
            if (buyQueue.length >= AVERAGE_LIMIT) {
              const smaLong = average(buyQueue.slice(buyQueue.length - AVERAGE_LIMIT, buyQueue.length));
              const buyAverage = average(buyQueue.slice(buyQueue.length - BUY_LIMIT, buyQueue.length));
              console.log('average', smaLong);
              console.log('buy', buyAverage);
              console.log('raja', smaLong - buyAverage);
              if (smaLong - buyAverage > 3) {
                return buy(account, txn.amount.amount, 'EUR');
              }
              return true;
            }
          }
          return true;


        })
        .then(success => {
          console.log(" ");
          buyPromiseFn(client, account);
        }).catch(err => {
        console.log('err', err);
        buyPromiseFn(client, account);
      })
    , 2500);

}

function average(arr) {
  return arr.reduce((p, c) => p + c, 0) / arr.length;
}

function checkBuyPrice(amount) {

  let lastElem = buyQueue[buyQueue.length - 1];
  if (lastElem !== amount) {
    if (buyQueue.length > 100) {
      buyQueue.shift();
    }
    buyQueue.push(amount)
  }
  console.log('queue', buyQueue.slice(buyQueue.length - 10, buyQueue.length));

}

function sellPromiseFn(client, account) {

  setTimeout(() =>
      Promise.all([getTransaction(account), getSellPrice(client, {currencyPair: 'ETH-EUR'})])
        .then(promises => {
          const date = new Date();
          const [txn, success] = promises;
          console.log('myynti');
          if ('completed' === txn.status && txn.buy) {
            console.log('aktiivinen');

            const ostohyoty = (success.data.amount * txn.amount.amount) - txn.native_amount.amount;
            console.log('ostettu', txn.native_amount.amount);
            console.log('myyntihinta', success.data.amount);
            console.log('ETH myynti',txn.amount.amount);
            console.log('erotus:' + ostohyoty);
            if (ostohyoty > 3) {
              console.log('voidaan myydä: ' + txn.amount.amount);
              return sell(account, txn.amount.amount, 'ETH')
                .then(success => {
                  console.log('myyty', success);
                  return true;
                });

            }
          }
          return true;
        })
        .then((success) => {
          console.log(" ");
          sellPromiseFn(client, account);

        }).catch(err => {
        console.log('err', err);
        sellPromiseFn(client, account);

      })

    , 2500);

}

function getTransaction(account) {
  return new Promise((resolve, reject) => {
    account.getTransactions(null, (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success[0]);
      }

    });

  });
}

function getBuyPrice(client, opts) {
  return new Promise((resolve, reject) => {
    client.getBuyPrice(opts, (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }

    });

  });
}

function getSellPrice(client, opts) {
  return new Promise((resolve, reject) => {
    client.getSellPrice(opts, (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }

    });

  });
}

function buy(account, amount, currency) {
  return new Promise((resolve, reject) => {
    account.buy({
      amount,
      currency,
      payment_method: 'a01761d2-ed46-5d65-9694-504ca45450f5'
    }, (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }
    });
  });

}

function sell(account, amount, currency) {
  return new Promise((resolve, reject) => {
    account.sell({
      amount,
      currency
    }, (err, success) => {
      if (err) {
        reject(err);
      } else {
        resolve(success);
      }
    });
  });

}




