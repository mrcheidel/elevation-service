# elevation-service
Elevation API Service using Mapzen on AWS tiles 
https://aws.amazon.com/es/public-datasets/terrain/


Install NPM packages:

	npm install

Run:

	./index.js

You can now access at 
 
# With Shapes 

	http://localhost/height?json={"shape":[{"lat":40.712431,"lng":-76.504916},{"lat":40.712275,"lng":-76.605259}]}

# With Encoded 

	http://localhost/height?json={"encoded":"morjnAme`eB?`A\\`@f@`A\\`@d@bB\\bBbAbBbB^bB`@~B?hC?`C`@bA`A?dCcAbBaC?gDeCaBiGcBiFcBeDgCcBgD?aCbBcAbB?`A`B`AhC`@bB?bA`@\\^]bAkB^aB_@aCcAkGaAaB`@e@^]bA\\?d@^?`@\\`@?^d@??_@\\cA^_@d@?\\^bA?|@?bA?d@?^??`@\\`@?^?`@?`@\""}

	
![Example](result.png?raw=true "Example")

Todo:
Add multi-coordinate request
Add Security Headers (JWT) and origin checker
