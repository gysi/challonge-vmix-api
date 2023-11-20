const axios = require('axios');
const moment = require('moment');

const { API_KEY } = require('./secrets');
const COMMUNITY_IDENTIFIER = 'flitedek'

const challongeApi = axios.create({
  baseURL: 'https://api.challonge.com/v2.1',
  headers: {
    'Authorization-Type': 'v1',
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/json',
    'Authorization': API_KEY
  }
});

async function getCommunityTournaments({ page = 1, perPage = 25, showOnlyCurrent = false } = {}) {
  try {
  	let result = [];
    const pastTwoDaysDate = moment().subtract(2, 'days').format('MM/DD/YYYY');
    const response = await challongeApi.get(`/communities/${COMMUNITY_IDENTIFIER}/tournaments.json`, {
      params: {
        page: page,
        per_page: perPage,
        created_after: pastTwoDaysDate
      }
    });
    
    let tournaments = response.data.data;
    if (showOnlyCurrent) {
      const currentTime = new Date();

      // Filter tournaments that have started or are about to start
      let relevantTournaments = tournaments.filter(tournament => {
        const startsAt = tournament.attributes.timestamps.starts_at;
        const startedAt = tournament.attributes.timestamps.started_at;
        return startsAt || startedAt;
      });

      // Sort by closeness to current time
      relevantTournaments.sort((a, b) => {
        let aTime = a.attributes.timestamps.started_at || a.attributes.timestamps.starts_at;
        let bTime = b.attributes.timestamps.started_at || b.attributes.timestamps.starts_at;
        return Math.abs(new Date(aTime) - currentTime) - Math.abs(new Date(bTime) - currentTime);
      });

      // Take the closest tournament
      tournaments = relevantTournaments.length > 0 ? [relevantTournaments[0]] : [];
    }

    for (let i = 0; i < tournaments.length; i++) {
   		tournamentResult = {};
   		tournamentResult.id = tournaments[i].id;
   		tournamentResult.name = tournaments[i].attributes.name;
   		tournamentResult.game_name = tournaments[i].attributes.game_name;
   		tournamentResult.state = tournaments[i].attributes.state;
   		tournamentResult.description = tournaments[i].attributes.description;
   		tournamentResult.live_image_url = tournaments[i].attributes.live_image_url;
   		tournamentResult.private = tournaments[i].attributes.private;
   		tournamentResult.decorated_tournament_type = tournaments[i].attributes.decorated_tournament_type;
   		tournamentResult.starts_at = tournaments[i].attributes.timestamps.starts_at;
   		tournamentResult.started_at = tournaments[i].attributes.timestamps.started_at;
   		tournamentResult.created_at = tournaments[i].attributes.timestamps.created_at;
   		tournamentResult.completed_at = tournaments[i].attributes.timestamps.completed_at;
   		result.push(tournamentResult);
   	}
   	return result;
  } catch (error) {
    console.error('Error fetching community tournaments:', error);
    throw error;
  }
}

async function getCurrentCommunityTournamentParticipants({ tournamentId = null, page = 1, perPage = 25 } = {}) {
  try {
  	let result = [];
    const response = await challongeApi.get(`/communities/${COMMUNITY_IDENTIFIER}/tournaments/${tournamentId}/participants.json`, {
      params: {
        page: page,
        per_page: perPage,
      }
    });
    
    let participants = response.data.data;
    for (let i = 0; i < participants.length; i++) {
    	let participant = {};
    	participant.id = participants[i].id;
    	participant.name = participants[i].attributes.name;
    	result.push(participant);
    }
    
   	return result;
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
}

async function getCurrentTournamentMatches({ tournamentId = null, participants = null, page = 1, perPage = 25 } = {}) {
  try {
  	let result = [];
  	const participantsByIdFunc = (array) => {
	    const lookupObject = {};
	    array.forEach(item => {
	        lookupObject[item.id] = item.name;
	    });
	    return lookupObject;
	}
	participantsById = participantsByIdFunc(participants);

    const response = await challongeApi.get(`/communities/${COMMUNITY_IDENTIFIER}/tournaments/${tournamentId}/matches.json`, {
      params: {
        page: page,
        per_page: perPage,
      }
    });
    
    let matches = response.data.data;
    for (let i = 0; i < matches.length; i++) {
    	let match = {};
    	match.id = matches[i].id;
    	match.state = matches[i].attributes.state;
    	match.round = matches[i].attributes.round;
    	match.identifier = matches[i].attributes.identifier;
    	match.scores = matches[i].attributes.scores;
    	match.suggested_player_order = matches[i].attributes.suggested_play_order;
    	match.participant1 = participantsById[matches[i].attributes.points_by_participant[0].participant_id];
    	match.participant2 = participantsById[matches[i].attributes.points_by_participant[1].participant_id];
    	//sets
    	const sets = matches[i].attributes.score_in_sets;
    	for(let s = 0; s < sets.length; s++){
    		match[`set${s+1}`] = `${sets[s][0]} - ${sets[s][1]}`
    	}
    	match.winner = participantsById[matches[i].attributes.winner_id];
    	result.push(match);
    }
    
   	return result;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw error;
  }
}

module.exports = {
  getCommunityTournaments,
  getCurrentCommunityTournamentParticipants,
  getCurrentTournamentMatches,
};