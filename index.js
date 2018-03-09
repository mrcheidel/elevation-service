#!/usr/bin/env node

const hgt     = require('node-hgt');
const express = require('express');
const config  = require(__dirname + '/config.js');
const mkdirp  = require('mkdirp');
const fs      = require('fs');
const mapzen  = require('./mapzen');

if (!fs.existsSync(config.tiles.folder)) {
	mkdirp(config.tiles.folder, function (err) {
		if (err) console.error(err);
	});
}

var tileset = new hgt.TileSet(config.tiles.folder, {'downloader':new mapzen(config.tiles.folder)});
var app = express();

app.route('/ele')
  .get(getElevation);
  
// http://localhost:3001/elecomp/?d=morjnAme%60eB%3F%60A%5C%60%40f%40%60A%5C%60%40d%40bB%5CbBbAbBbB%5EbB%60%40~B%3FhC%3F%60C%60%40bA%60A%3FdCcAbBaC%3FgDeCaBiGcBiFcBeDgCcBgD%3FaCbBcAbB%3F%60A%60B%60AhC%60%40bB%3FbA%60%40%5C%5E%5DbAkB%5EaB_%40aCcAkGaAaB%60%40e%40%5E%5DbA%5C%3Fd%40%5E%3F%60%40%5C%60%40%3F%5Ed%40%3F%3F_%40%5CcA%5E_%40d%40%3F%5C%5EbA%3F%7C%40%3FbA%3Fd%40%3F%5E%3F%3F%60%40%5C%60%40%3F%5E%3F%60%40%3F%60%40
app.route('/elecomp')
  .get(getElevationCompressed);
  

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

function getElevationCompressed(req, res, next) {
    var encoded = req.query.d;
	var alatlng = decompress(encoded,6);
	var apromises = [];
	
	for(var i=0; i< alatlng.length; i+=2) {
		var p = new Promise((resolve, reject) => {
					var ll = [];
					ll.push (parseFloat(alatlng[i]));
					ll.push (parseFloat(alatlng[i+1]));
					tileset.getElevation(ll, function(err, elevation) {
						if (err) {
							reject('getElevation failed: ' + err.message);
						} else {
							resolve(
								{
								'lat': ll[0],
								'lng': ll[1],
								'ele': parseInt(elevation)
								}
							);
						}
					});
				});
		  
		apromises.push(p);
	}

	Promise.all(apromises).then(values => { 
	  return res.json(values);
	}, reason => {
	  console.log(reason)
	});
	
}


function handle404(req, res, next) {
  res.status(404).end('not found');
}

function decompress(encoded, precision) {
	try {
	    var p = precision;
		precision = Math.pow(10, -precision);
		var len = encoded.length,
			index = 0,
			lat = 0,
			lng = 0,
			array = [];
		while (index < len) {
			var b, shift = 0,
				result = 0;
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
			var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lat += dlat;
			shift = 0;
			result = 0;
			do {
				b = encoded.charCodeAt(index++) - 63;
				result |= (b & 0x1f) << shift;
				shift += 5;
			} while (b >= 0x20);
			var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
			lng += dlng;

			array.push((lat * precision).toFixed(p));
			array.push((lng * precision).toFixed(p));
		}
		return array;
	} catch (err) {
		msg(err);
	}
}

function compress(points, precision) {
	try {
		var oldLat = 0,
			oldLng = 0,
			len = points.length,
			index = 0;
		var encoded = '';
		precision = Math.pow(10, precision);
		while (index < len) {
			//  Round to N decimal places
			var lat = Math.round(points[index++] * precision);
			var lng = Math.round(points[index++] * precision);

			//  Encode the differences between the points
			encoded += encodeNumber(lat - oldLat);
			encoded += encodeNumber(lng - oldLng);

			oldLat = lat;
			oldLng = lng;
		}
		return encoded;
	} catch (err) {
		msg(err);
	}
}


app.listen(config.express.port);
console.log('App is listening on port ' + config.express.port);






