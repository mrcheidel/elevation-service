# elevation-service
Elevation API Service using Mapzen on AWS tiles 
https://aws.amazon.com/es/public-datasets/terrain/


Install NPM packages:

	npm install

Run:

	./index.js

You can now access at 
 
	http://localhost:3001/ele?d=40.8501011,-3.9649810
	
	
![Example](result.png?raw=true "Example")

Todo:
Add multi-coordinate request
Add Security Headers (JWT) and origin checker
