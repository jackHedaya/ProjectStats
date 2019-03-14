#!/usr/bin/env node

var program = require('commander');
const fs = require('fs');

program
    .arguments('<file/directory>')
    .option('-R, --recursive', 'recursively generate stats for all of the files in a directory', false)
    .action(function (file) {
        if (program.recursive && fs.lstatSync(file).isFile()) { console.log (file + ' is a file. Recursive argument ignored.\n'); program.recursive = false; }

        var stats = {};

        var values = [];

        if (!program.recursive) {
            if (fs.lstatSync(file).isDirectory()) {
                for (var i of fs.readdirSync(file)) {
                    const path = file + '/' + i;
    
                    if (!fs.lstatSync(path).isFile()) continue;
                    
                    for (var x of getDocumentLines(path)) {
                        values.push(x);
                    }
                }
            } else {
                for (var x of getDocumentLines(file)) {
                    values.push(x);
                }
            }
        } else {
            for (var dir of fs.readdirSync(file)) {
                if (fs.lstatSync(file + '/' + dir).isDirectory()) {
                    values = values.concat(getDirectoryLines (file + '/' + dir));
                } else {
                    values = values.concat(getDocumentLines (file + '/' + dir));
                }
            }
        }
        
        values.sort((x, y) => x - y);

        stats = calcStats (values);

        console.log (stats);
        
    })
    .parse(process.argv);


function calcStats(arr) {

    var stats = {
        mean: 0,
        median: 0,
        range: 0,
        variance: 0,
        standardDeviation: 0
    };

    stats.mean = calcMean(arr);
    stats.range = getHigh(arr) - getLow(arr);
    stats.median = calcMedian(arr);

    stats.variance = calcVariance(arr);
    stats.standardDeviation = Math.sqrt(stats.variance);

    return stats;
}

function getDirectoryLines (path) {
    var fPath = path;
    var lines = [];

    for (var dir of fs.readdirSync(fPath)) {
        if (fs.lstatSync(fPath + '/' + dir).isDirectory()) {

            lines = lines.concat(getDirectoryLines (fPath + '/' + dir));
        } else {
            lines = lines.concat(getDocumentLines (fPath + '/' + dir));
        }
    }

    return lines;
}

function getDocumentLines (path) {
    if (fs.existsSync (path)) {
        return fs.readFileSync (path).toString().split('\n').map(x => x.length);
    } else {
        throw 'Failed: ' + path + ' is not a file.';
    }
}

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

function calcMedian(arr) {
    if (arr.length % 2 !== 0)
        return arr[parseInt(arr.length / 2)];

    return calcMean([arr[parseInt(arr.length  / 2 - 1)], arr[parseInt(arr.length / 2)]]);
}

function calcVariance(arr) {
    if (arr.length < 2) return 0;

    var total = 0;
    const average = calcMean(arr);

    for (var a of arr) {
        total += Math.pow(a - average, 2);
    }

    return total / arr.length - 1;
}

function addObjects (obj1, obj2) {
    for (var i in obj1) {
        obj1[i] += obj2[i];
    }
}