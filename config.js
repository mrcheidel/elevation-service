module.exports = {
  express: {
     port: 80,
     sslport:443
  },
  tiles: {
  	folder: 'data/'
  },
  server_options: {
	key  : require('fs').readFileSync('private/certificates/' + 'private.key', 'utf8'),
	ca   : require('fs').readFileSync('private/certificates/' + 'ca_bundle.crt', 'utf8'),
	cert : require('fs').readFileSync('private/certificates/' + 'certificate.crt', 'utf8')
  }
};

