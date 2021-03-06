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

Gulp Builds:

the main build file is "gulpfile.js" and defines all the tests to run. Run at command line with "gulp". This runs the default task and any watchers. I added a watcher for all js files to lint them when they change. Very useful during development.

For development, consider these additional steps after step 4 from above:

5) run: npm install -g express-generator. "As of Express 4.0, you'll need to install the express "generator" as well. This is following a trend in the node industry of breaking out core functionality from site-scaffolding utility"

6) In parent folder run: express expressjs-ptt-server. This installs the expressjs skeleton framework.

7) cd expressjs-ptt-server. step in and then run: npm install

8) Create a folder for the application to reside in. Clone repo into it :)

9) Run the app: DEBUG=expressjs-ptt-server ./bin/www


Design Notes:

Controllers: Controllers are specifically concerned with interpreting, validating and formatting the request objects, passing parameters to Services and then correctly formatting the response object in a consistent manner
Models: Models are, as usual, data model objects which are instanced by the application. 
Schemas:
Services: Services provide the grunt work of the application. Any functionality bound to a schema is represented in its corresponding Service. 


Consistancy in response rules:

- For all POST, send everything in body as "x-www-form-urlencoded"
- All unsupported api's return 404
- All supported api's return 200
- All responses in json format
- Successful response object:
{
	"success": true,
	...
}
- Unsuccessful response object:
{
	"success": false,
	"error": {
		"message": ...
		...
	}
}


Ideas to implement:

- Campaign mode (1p), players use a deck of cards which they will build over the course of the campaign. 
- I think it makes sense to build a hand JUST BEFORE the game begins, by default suggest last used set
- Quick Game Type? NOPE. - maybe just put the user into a game quickly with a set of random cards? actually, this is akin to campaign mode with the side-effect that they'll see cards early -- forget it. A quick game is to play campaign and look for a random match.
- Multiplayer - build a hand from your current set, get paired with someone with similar strength and win/loss? For playing with a friend(s), maybe choose friends first, determine maximum hand strength between them and then limit selection of hand?
- Crazy boards? Sure the standard 3x3, maybe 4x4 or boards of iregular size? Maybe a boards json doc with specifictions?
- Larger boards men playing with more cards, how to save which cards were last used??

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


