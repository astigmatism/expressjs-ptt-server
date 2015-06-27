/**
 * ExpressJs Pure Triple Triad Server
 * 
 * Hello there! The goal of this project is to provide a RESTFUL service which maintains user and game states for Pure Triple Triad across any client platform.
 */

Getting up and running on a new machine:

These instruction were written for OSX. I both develop and serve apps with it :) At the time of writing Version 10.10, Yosemite.

1) Install brew. run brew doctor and brew update.

2) Install NodeJS. Use homebrew: brew install nodejs

3) Install Memcache. Use homebrew again: brew install memcached. Follow the instructions to have it run on startup.

4) Install MongoDB: http://mongodb.org/. I used Homebrew: brew install mongodb. 

5) Run Mongo: After installing mongo you have two options: 1) To load it now (launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist) or without launchctrl (mongod --config /usr/local/etc/mongod.conf)

6) Create a folder for the application to reside in.

7) Clone repo

8) Run the app: DEBUG=expressjs-ptt-server ./bin/www



For development, consider these additional steps after step 4 from above:

5) run: npm install -g express-generator. "As of Express 4.0, you'll need to install the express "generator" as well. This is following a trend in the node industry of breaking out core functionality from site-scaffolding utility"

6) In parent folder run: express expressjs-ptt-server. This installs the expressjs skeleton framework.

7) cd expressjs-ptt-server. step in and then run: npm install

8) Create a folder for the application to reside in. Clone repo into it :)

9) Run the app: DEBUG=expressjs-ptt-server ./bin/www


Consistancy in response rules:

- POST everything as "x-www-form-urlencoded"
- All unsupported api's return 404
- All supported api's return 200
- All responses in json format
- All response objects include a boolean property called "success"



List of API's:


POST 	account/new	  	 		[username, password]		-- no auth needed, creates a user given a username and password
POST 	account/password		[password]					-- change your password
GET 	account/											-- returns something about the logged in user (used for testing mainly so far)
DELETE	account/											-- deletes your account
GET 	cards/												-- returns all user cards
GET 	cards/hand 											-- returns all user cards currently in hand
GET 	cards/deck 											-- returns all user cards current NOT in hand (in deck)
POST 	cards/move 				[hand, deck]				-- moves cards from user's hand to deck or vise-versa. takes comma delimited list of _ids
POST 	cards/move/hand 		[cardids]					-- given comma delimited array of cardids, moves them into hand

These API's are all consumable from the standpoint of a logged in user. Avoid open endpoints which grant things or cheats.
I've been using POSTMAN for Google Chrome the most during development but you can also try using CURL from the command line:
curl -u username:password -X GET localhost:3000/user




npm install list (for dev)

npm install --save jade
npm install --save node-cache
npm install --save mongodb
npm install --save monk
npm install --save type-of-is
npm install --save async
npm install -g node-inspector
npm install --save express-session
npm install --save mongoose
//npm install merge --save					//for merging objects

npm install --save passport
//npm install --save passport-facebook
//npm install --save passport-twitter
//npm install --save passport-google
//npm install --save passport-local
npm install --save passport-http
//npm install --save passport-local-mongoose
npm install --save connect-mongo
npm install --save bcrypt-nodejs


Unit testing stuff, not used yet.

npm install mocha --save
npm install chai --save
npm install should --save


Ideas to implement:

- Campaign mode (1p)
- Quick Game - maybe just put the user into a game quickly with a set of cards they wont own?
- Multiplayer - seems like this type should use random cards the users don't actually own, otherwise it could be terribly off-balance. maybe a handicap modifier to make give others stronger decks?
- 3 or more player on larger grid??

- Campaign mode - divided into "rule worlds" each ending with a "boss" of sorts with a strong deck. A minimum number of game need to be played in that world until the boss is reach but the player can continue to randomly play matches to earn better cards before the boss fight
- World 1: Basic Rule only. First handful (5?) of games have no win rule then introduce take one.
- WOrld 2: Same Rule, maybe also same wall at some point?
- World 3: Plus Rule. Perhaps the bosses can include all previous rules??
- WOrld 4: Combo
- World 5: Elemental
- World 6: Closed
- World 7: Take Difference
- World 8: Take All - this should be pretty damn intimidating!!! :)

- 8 worlds is very mario-esc, I like it

Auth:

Since this project is meant to be a restful server, I got most of my info from (http://scottksmith.com/blog/2014/05/29/beer-locker-building-a-restful-api-with-node-passport/)



Tools useful for development:

NodeJs Debugging:
with: npm install -g node-inspector
to start: node-debug app.js

Sublime Packges: 

Open Package Control: Preferences -> Package Control
Select Package Control: Install Package

- DocBlockr


