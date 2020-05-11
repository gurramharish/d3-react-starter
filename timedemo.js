function timeByZone(zone) {
  switch (zone) {
    case 'PST':
      console.log('PST');
      generateHours(6, 5);
      break;
    default:
      console.log('EST');
  }
}

function generateHours(start, end) {
  var i = 12;
  while (start <= i) {
    console.log(start + ' AM');
    start++;
  }
  start = 1;
  i = end;
  while (start <= end) {
    var c = start + ' PM';
    console.log(c.length);
    console.log(start + ' PM');
    start++;
  }
}

timeByZone('PST');
