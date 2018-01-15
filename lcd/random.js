var five = require("johnny-five");
var Tessel = require("tessel-io");
var moment = require('moment-timezone');
const {readOsakkeet} = require('./osake.js');
var board = new five.Board({
  io: new Tessel()
});

moment.locale('fi');
board.on("ready", () => {
  var lcd = new five.LCD({
    pins: ["a2", "a3", "a4", "a5", "a6", "a7"]
  });
  console.log('tee jotain');
  readOsakkeet(osakkeet => {

    let osakeIndex = 0;
    setInterval(() => {
      printOsake(lcd, osakkeet[osakeIndex]);
      osakeIndex += 1;
    }, 3000);
  });

  var cleared = false;

});

function printOsake(lcd, osake) {
  lcd.noBlink().noAutoscroll().cursor(0, 0).print(osake.nimi);
  fillRestCursors(lcd, 0, osake.nimi.length);
  lcd.noBlink().noAutoscroll().cursor(1, 0).print(osake.viimeisin);
  fillRestCursors(lcd, 1, osake.viimeisin.length);

}

function fillRestCursors(lcd, row, textlength) {
  for (let col = textlength; col <= 16; col++) {
    lcd.cursor(row, col).print(' ');
  }

}

function writeToRow(lcd, rowIndex, text) {

}

