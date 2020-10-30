#!/usr/bin/env node

var program = require('commander')
const fs = require('fs')

const { getFileLines, getDirectoryLines } = require('./utils/getLines')
const { getAllStats } = require('./utils/stats')

program
  .arguments('<file/directory>')
  .option('-R, --recursive', 'recursively generate stats for all of the files in a directory', false)
  .action(function (file) {
    if (program.recursive && fs.lstatSync(file).isFile()) {
      console.log(file + ' is a file. Recursive argument ignored.\n')
      program.recursive = false
    }

    var stats = {}

    var values = []

    if (!program.recursive) {
      if (fs.lstatSync(file).isDirectory()) {
        for (var i of fs.readdirSync(file)) {
          const path = file + '/' + i

          if (!fs.lstatSync(path).isFile()) continue

          for (var x of getFileLines(path)) {
            values.push(x)
          }
        }
      } else {
        for (var x of getFileLines(file)) {
          values.push(x)
        }
      }
    } else {
      for (var dir of fs.readdirSync(file)) {
        if (fs.lstatSync(file + '/' + dir).isDirectory()) {
          values = values.concat(getDirectoryLines(file + '/' + dir))
        } else {
          values = values.concat(getFileLines(file + '/' + dir))
        }
      }
    }

    values.sort((x, y) => x - y)

    stats = getAllStats(values)

    console.log({ ...stats, totalCount: values.reduce((p, c) => p + c, 0) })
  })
  .parse(process.argv)
