var Firebase = require('firebase')
var fixtures = require('../src/fixtures')

var dataRef = new Firebase('https://entries.firebaseIO.com/data/')
var count = 0

Object.keys(fixtures).forEach(function (key) {
	var ref = dataRef.child(key)
	fixtures[key].forEach(function (entry) {
		count++
		delete entry.id
		ref.push(entry, function (err) {
			if (err) console.err(err)
			if (--count <= 0) {
				process.exit()
			}
		})
	})
})
