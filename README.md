# Challonge API for VMIX
## How to (Windows)
### Install NodeJS
* Go to https://nodejs.org/en/ and download latest LTS  
* Install latest LTS  
* Verify that installation worked, open a commandline and execute `node -v`
### Get this Git repository
Download this git repository to a directory.
* Maybe use this here or any other way you are comfortable with https://gitforwindows.org/
* Clone this repository to any directory you want `git clone git@github.com:gysi/challonge-vmix-api.git`
* If there has been changes since the last time you cloned it make sure that you are up to date
  `git pull origin main`
### Start the Server
* Go into the root of the repository
* Execute `node server.js`, server will be started at http://localhost:3000

## Current Endpoints:
* http://localhost:3000/community-tournaments
* http://localhost:3000/current-community-tournament
* http://localhost:3000/current-community-tournament-participants
* http://localhost:3000/current-community-tournament-matches