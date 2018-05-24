#!/usr/bin/env node

var program = require('commander');
const fs = require ('fs');

 program
  .arguments('<file>')
  .option('-R --recursive', 'recursively generate stats for all of the files in a directory', false)
  .action(function(file) {
    if (fs.existsSync(file)) {
        const contents = fs.readFileSync(file).toString();
        const lines = contents.split('\n');
        const lineCounts = lines.map(x => x.length).sort((x, y) => x - y);

        var stats = {
            mean: undefined,
            median: undefined,
            range: undefined,
            variance: undefined,
            standardDeviation: undefined
        };

        stats.mean = calcMean(lineCounts);
        stats.range = getHigh(lineCounts) - getLow(lineCounts);
        stats.median = calcMedian (lineCounts);

        stats.variance = calcVariance(lineCounts);
        stats.standardDeviation = Math.sqrt(stats.variance);
        console.log(stats);
        
    } else {
        console.error('Failed: ' + file + ' is not a file.');
        process.exit();
    }
        
    
  })
  .parse(process.argv);

  function calcMean(arr) {
    let x = 0;

    for (var i of arr) {
        x += i;
    }

    return x / arr.length;
  }

  function getHigh(arr) {
    var h = 0;

    for (var i of arr) {
        if (i > h) h = i;
    }

    return h;
  }

  function getLow(arr) {
    var l = 0;

    for (var i of arr) {
        if (i < l) l = i;
    }

    return l;
  }

  function calcMedian (arr) {
    if (arr.length % 2 === 0) return arr[arr.length / 2];

    return calcMean([arr[(arr.length + 1) / 2], arr.length / 2])
  }

  function calcVariance(arr) {
    if (arr.length < 2) return 0;
    console.log (arr);
    var total = 0;
    const average = calcMean(arr);

    console.log (arr);
    for (var a of arr) {
        total += Math.pow(a - average, 2);
    }
    
    return total / arr.length - 1;
  } 