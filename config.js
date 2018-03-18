module.exports = {
  express: {
     port: 80,
     sslport:443
  },
  tiles: {
  	folder: 'data/'
  },
  server_options: {
	key  : 'private/certificates/private.key',
	ca   : 'private/certificates/ca_bundle.crt',
	cert : 'private/certificates/certificate.crt'
  },
  api_keys: [
	{'key':'secret_key', 'ref':'*'},
	{'key':'elevation_api_key', 'ref':'node.loctome.com'},
	{'key':'elevation_api_key', 'ref':'loctome.com'},
	{'key':'elevation_api_key', 'ref':'editor.swagger.io'}
	]
};

