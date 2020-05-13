var moment = require('moment');
function getRandomTime() {
    var today = new Date();
    var randomHour = Math.floor((Math.random() * (21 - 12 + 1)) + 12);
    var randomMinute = Math.floor((Math.random() * 59) + 1);
    var randomSecond = Math.floor((Math.random() * 59) + 1);;
    var time = String(randomHour).padStart(2, '0') + ":" + String(randomMinute).padStart(2, '0') + ":" + String(randomSecond).padStart(2, '0');
    var d = String(today.getDate()).padStart(2, '0');
    var m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var y = String(today.getFullYear());
    var day = y + '-' + m + '-' + d + "T";
    return day + time + "Z";
}

// for (var i = 1; i <= 15; i++) {
//     //console.log(Math.floor(Math.random() * (12 - 9 + 1) + 9));
//     console.log(getRandomTime());
// }

const dateObj = new Date();
console.log("ISO String :: ", dateObj.toISOString());
const dateStr = dateObj.toISOString().split('T').shift();
console.log("Date STR:: ", dateStr);
const d1 = new Date(dateStr + "T" + "12:00:00.000Z");
const d2 = new Date(dateStr + "T" + "22:00:00.000Z");
const minTime = moment(d1).utcOffset("0500").toDate();
const maxTime = moment(d2).utcOffset("0500").toDate();

console.log('Min Time ::::::::: ', minTime);
console.log('Max Time :::          ', maxTime);

const d3 = new Date('2020-05-12T15:30:00.000Z');
const d4 = moment(d3).utcOffset("0500").toDate();
console.log('D4 is ::: ', d4);