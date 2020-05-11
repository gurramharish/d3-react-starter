function getRandomTime() {
    var today = new Date();
    var randomHour = Math.floor((Math.random() * (11 - 9 + 1)) + 9);
    var randomMinute = Math.floor((Math.random() * 59) + 1);
    var randomSecond = Math.floor((Math.random() * 59) + 1);;
    var time = String(randomHour).padStart(2, '0') + ":" + String(randomMinute).padStart(2, '0') + ":" + String(randomSecond).padStart(2, '0');
    var d = String(today.getDate()).padStart(2, '0');
    var m = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var y = String(today.getFullYear());
    var day = y + '-' + m + '-' + d + "T";
    return day + time + "Z";
}

for (var i = 1; i <= 15; i++) {
    //console.log(Math.floor(Math.random() * (12 - 9 + 1) + 9));
    console.log(getRandomTime());
}