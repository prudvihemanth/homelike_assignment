**Assignment** - To build Api using Node 

**Technology stack used:** (Node.js, Mongo Db)

**How to run the project:**

**With docker:**
Go to the root of the project and run the command: “docker-compose up”

**Without docker:**
Ensure the latest stable versions of Node, Npm and Mongo are Installed.

Go to the root of the project and run the command: “npm install”

From root of the project run the command “npm run start:dev”

**Features Implemente:**
Hapi Js withTypescript 
Authentication (jwt)
Authorization (TENANT & USER roles)
Payload Validation at server side
Convert Address to Coordinates Using Google Geocoding Api (used while creating apartment)
Swagger Documentation
Typescript Documentation
Logger with Winston
Tslint and Husky (Githooks)
Docker-compose to run project with a single command
Unit test cases using Mocha, Chai and Sinon. Code coverage with Istanbul
Deployed backend app in Aws EC2
CI and CD done using Jenkins
Domain name (jsassignment.in) was mapped to the deployed code.


**References:**
Register, Login - Reference taken from Homelike website

Create Apartment: (Took reference from here: https://support.thehomelike.com/hc/en-us/articles/115001338109-How-do-I-list-an-apartment-on-Homelike-)


Github:  https://github.com/prudvihemanth/homelike_assignment

Swagger Documentation: (Refer to payload model before making api call through swagger)

Typescript Docs:

Code Coverage: