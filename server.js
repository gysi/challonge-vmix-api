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

// Starting the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
