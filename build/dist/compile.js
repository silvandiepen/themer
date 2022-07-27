"use strict";
const sass = require("sass");
const { blockLine, blockMid, blockFooter, blockHeader, bold, blue, clear, blockStepLoader, } = require("cli-block");
blockHeader("Test Runs");
const showTime = (time) => {
    return `${(Math.round(time / 10) * -1) / 100}s`;
};
const testRun = (file, runs) => {
    blockMid(file);
    const times = [];
    blockLine(`${runs} Runs`);
    for (let i = 0; i < runs; i++) {
        const start = new Date().getSeconds();
        const result = sass.compile(file);
        const end = new Date().getSeconds();
        const time = start - end;
        blockStepLoader({
            message: `Run [step] [loader] [percentage]`,
            width: "50%",
            start: 0,
            end: runs - 1,
            step: i,
        });
        times.push(time);
    }
    clear();
    blockLine();
    for (let i = 0; i < times.length; i++) {
        blockLine(`run ${i + 1}: ${showTime(times[i])}`);
    }
    let average = times.reduce((s, t) => s + t, 0);
    blockLine();
    blockLine(bold(`average: ${blue(showTime(average / times.length))}`));
};
testRun("./test/variables.scss", 10);
testRun("./test/app.scss", 10);
testRun("./test/style.scss", 10);
blockFooter();
//# sourceMappingURL=compile.js.map