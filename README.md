## node.js-RestAPI-TypeScript

Node.js App written in TypeScript. This app provides a little Rest API for a Blog.
You can sign up with a Username and Password. After Sign in you can get all Posts, get one by Id, add One or delete one when your User have created it. The Database for this Project is a MongoDB.

# Get Started

1.  clone project `git clone https://github.com/SlimFreddy/node.js-RestAPI-TypeScript.git`
2.  install MongoDB on your computer https://www.mongodb.com/try/download/community
3.  create a database for example "blog" and create the collection "posts" and "users" in it.
4.  create .env file in the main-folder of the project and set following values
    - MONGO_URL= "mongodb://username:password@host:port/database?options..."
    - SERVER_PORT= "3000"
    - JWT_TOKEN_SECRET= "SOME STRING"
5.  run 'npm install' and 'npm start' or 'yarn install' and 'yarn start' in main folder

# Insomnia file

In ./API-Insomnia is file for testing the running API. Install "Insomnia Core" https://insomnia.rest/download/ and import this ./API-Insomnia/RestApi.json. Now you are abled to test the Rest-API. Header musst be change to your token ;)
