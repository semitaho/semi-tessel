var five = require("johnny-five");
var Tessel = require("tessel-io");
var moment = require('moment-timezone');
var board = new five.Board({
  io: new Tessel()
});

moment.locale('fi');
board.on("ready", () => {
  var lcd = new five.LCD({
    pins: ["a2", "a3", "a4", "a5", "a6", "a7"]
  });
  var snapshots = ["", ""];

  board.loop(100, () => {
    var updates = [
      moment().format("DD.M.YYYY"),
      moment().tz('Europe/Helsinki').format("HH:mm:ss")
    ];
    updates.forEach((update, index) => {
      if (snapshots[index] !== update) {
        snapshots[index] = update;
        lcd.cursor(index, 0).print(update);
      }
    });
  });
});