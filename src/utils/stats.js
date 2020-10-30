function getAllStats(arr) {
  var stats = {
    mean: 0,
    median: 0,
    range: 0,
    variance: 0,
    standardDeviation: 0,
  }

  stats.mean = mean(arr)
  stats.range = getHighest(arr) - getLowest(arr)
  stats.median = median(arr)

  stats.variance = variance(arr)
  stats.standardDeviation = Math.sqrt(stats.variance)

  return stats
}

function mean(arr) {
  let x = 0

  for (var i of arr) {
    x += i
  }

  return x / arr.length
}

function getHighest(arr) {
  var h = 0

  for (var i of arr) {
    if (i > h) h = i
  }

  return h
}

function getLowest(arr) {
  var l = 0

  for (var i of arr) {
    if (i < l) l = i
  }

  return l
}

function median(arr) {
  if (arr.length % 2 !== 0) return arr[parseInt(arr.length / 2)]

  return mean([arr[parseInt(arr.length / 2 - 1)], arr[parseInt(arr.length / 2)]])
}

function variance(arr) {
  if (arr.length < 2) return 0

  var total = 0
  const average = mean(arr)

  for (var a of arr) {
    total += Math.pow(a - average, 2)
  }

  return total / arr.length - 1
}

module.exports = { getAllStats, mean, median, variance, getLowest, getHighest }
