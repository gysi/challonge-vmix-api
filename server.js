const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'secrets.js');

// Check if secrets.js exists
if (!fs.existsSync(configPath)) {
    throw new Error('Configuration file "secrets.js" is missing. Please create the file based on "secrets.template.js" and add your API key.');
}

const express = require('express');
const challongeService = require('./challonge_service');
const app = express();
const port = 3000;

app.get('/community-tournaments', async (req, res) => {
  try {
    const tournaments = await challongeService.getCommunityTournaments();
    res.json(tournaments);
  } catch (error) {
    console.log('Error occurred while fetching tournaments', error);
    res.status(500).send('Error occurred while fetching tournaments');
  }
});

app.get('/current-community-tournament', async (req, res) => {
  try {
    const tournaments = await challongeService.getCommunityTournaments({ showOnlyCurrent: true });
    res.json(tournaments);
  } catch (error) {
    console.log('Error occurred while fetching tournaments', error);
    res.status(500).send('Error occurred while fetching tournaments');
  }
});

app.get('/current-community-tournament-participants', async (req, res) => {
  try {
    const tournament = (await challongeService.getCommunityTournaments({ showOnlyCurrent: true }))[0];
    const participants = await challongeService.getCurrentCommunityTournamentParticipants({
        tournamentId: tournament.id 
    });
    res.json(participants);
  } catch (error) {
    console.log('Error occurred while fetching current community tournament matches', error);
    res.status(500).send('Error occurred while fetching current community tournament matches');
  }
});

app.get('/current-community-tournament-matches', async (req, res) => {
  try {
    const tournament = (await challongeService.getCommunityTournaments({ showOnlyCurrent: true }))[0];
    const participants = (await challongeService.getCurrentCommunityTournamentParticipants({ tournamentId: tournament.id }));
    const matches = await challongeService.getCurrentTournamentMatches({ 
        tournamentId: tournament.id, 
        participants: participants,
    });
    res.json(matches);
  } catch (error) {
    console.log('Error occurred while fetching current community tournament matches', error);
    res.status(500).send('Error occurred while fetching current community tournament matches');
  }
});

// Starting the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
