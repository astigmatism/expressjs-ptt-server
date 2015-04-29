# expressjs-ptt-server
Pure Triple Triad ExpressJS Server

These instruction were written for OSX. I both develop and serve apps with it :) At the time of writing Version 10.10, Yosemite.

1) Install brew. run brew doctor and brew update.

2) Install NodeJS. Use homebrew: brew install nodejs

3) Install Memcache. Use homebrew again: brew install memcached. Follow the instructions to have it run on startup.

4) Install MongoDB: http://mongodb.org/. I used Homebrew: brew install mongodb. Follow instructions at end of brew but note that if you want to run mongo automatically at start ignore the instructions to do so because we're going to write our own specific for Myst (see step 12)

When buliding app for the first time, do these then skip to step 9.. if cloning, skip to step 8

5) run: npm install -g express-generator. "As of Express 4.0, you'll need to install the express "generator" as well. This is following a trend in the node industry of breaking out core functionality from site-scaffolding utility"

6) In parent folder run: express expressjs-ptt-server. This installs the expressjs skeleton framework.

7) cd expressjs-ptt-server. step in and then run: npm install

When cloning, do these:

8) Create a folder for the application to reside in. Clone repo into it :)

9) Run the app: DEBUG=expressjs-ptt-server ./bin/www

npm install:

npm install --save jade
npm install --save node-cache
npm install --save mongodb
npm install --save monk
npm install --save type-of-is
npm install --save async
npm install -g node-inspector
npm install --save express-session
npm install --save mongoose

npm install --save passport
//npm install --save passport-facebook
//npm install --save passport-twitter
//npm install --save passport-google
npm install --save passport-local
npm install --save passport-local-mongoose
npm install --save connect-mongo

Unit testing stuff, not used yet.

npm install mocha --save
npm install chai --save
npm install should --save

Auth:

I got most of my info from (http://mherman.org/blog/2013/11/11/user-authentication-with-passport-dot-js/#.VT_mUq1Vikr)
Auth was build around the Passport plugin and was implemented mainly by following the tutorial. Very little of the code is my own work.
Session details are stored in a cookie (with auth) thanks to express-session, passport and mongostore.

Tools useful for development:

NodeJs Debugging:
with: npm install -g node-inspector
to start: node-debug app.js

Sublime Packges: 

Open Package Control: Preferences -> Package Control
Select Package Control: Install Package

- DocBlockr


