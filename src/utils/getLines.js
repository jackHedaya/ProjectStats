const fs = require('fs')

function getFileLines(path) {
  if (fs.existsSync(path)) {
    return fs
      .readFileSync(path)
      .toString()
      .split('\n')
      .map((x) => x.length)
  } else {
    throw 'Failed: ' + path + ' is not a file.'
  }
}

function getDirectoryLines(path) {
  var fPath = path
  var lines = []

  for (var dir of fs.readdirSync(fPath)) {
    if (fs.lstatSync(fPath + '/' + dir).isDirectory()) {
      lines = lines.concat(getDirectoryLines(fPath + '/' + dir))
    } else {
      lines = lines.concat(getFileLines(fPath + '/' + dir))
    }
  }

  return lines
}

module.exports = { getFileLines, getDirectoryLines }
