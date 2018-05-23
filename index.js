#!/usr/bin/env node

var program = require('commander');
const fs = require ('fs');

 program
  .arguments('<file>')
  .action(function(file) {
    if (fs.existsSync(file)) {
        const contents = fs.readFileSync(file).toString();
        const lines = contents.split('\n');

        var stats = {
            mean: undefined,
            median: undefined,
            range: undefined
        }

        stats.mean = calcMean(lines);
        console.log (getHigh(lines.map (x => x.length)))
        stats.range = getHigh(lines.map (x => x.length)) - getLow(lines.map(x => x.length))

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
        x += i.length;
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