#!/usr/bin/env node

const hgt     = require('node-hgt');
const express = require('express');
const config  = require(__dirname + '/config.js');
const mkdirp  = require('mkdirp');
const fs      = require('fs')

if (!fs.existsSync(config.tiles.folder)) {
	mkdirp(config.tiles.folder, function (err) {
		if (err) console.error(err);
	});
}

var tileset = new hgt.TileSet(config.tiles.folder);
var app = express();

app.route('/ele')
  .get(getElevation);
  
app.use(handle404);

function getElevation(req, res, next) {
    var latlng = req.query.d.split(',');
    latlng[0] = parseFloat(latlng[0]);
    latlng[1] = parseFloat(latlng[1]);

    
	tileset.getElevation(latlng, function(err, elevation) {
		if (err) {
			console.log('getElevation failed: ' + err.message);
			return res.json({'error': 'bad request'});
		} else {
			return res.json(
			{
			'lat': latlng[0],
			'lng': latlng[1],
			'ele': parseInt(elevation)
			}
			);
		}
	});
}

function handle404(req, res, next) {
  res.status(404).end('not found');
}

app.listen(config.express.port);
console.log('App is listening on port ' + config.express.port);






