const sass = require("sass");

const times = [];

for (let i = 0; i < 10; i++) {
  const start = new Date();
  const result = sass.compile("./test/app.scss");
  const end = new Date();
  const time = start - end;

  console.log(`run ${i + 1}: ${showTime(time)}`);
  times.push(time);
}

// console.log(result.css);

function showTime(time) {
  return `${(Math.round(time / 10) * -1) / 100}s`;
}

let average = times.reduce((s, t) => s + t, 0);
console.log("---------------");
console.log(`avg:  ${showTime(average / times.length)}`);
