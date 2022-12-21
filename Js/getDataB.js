var dob = 0
var gameId = 34231107
var gameState = new Array()
var gameType= new Array()
var newEvents = new Array()
var lastEvents = new Array()
var awayteamname, hometeamname
var homeScore, awayScore, periodlength, getDataTime
var teamNames = new Array()
const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b)
function getJsonData() {
  fetch(
    'https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_timelinedelta/37564473',
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      var doc = data['doc'][0]
      if (doc['_dob'] == dob) return
      dob = doc['_dob']
      var data_ = doc['data']
      var match = data_['match']
      // Team Name Setting
      var teams = match['teams']
      periodlength = match['periodlength']
      getDataTime = match['timeinfo']['remaining'] * 1000
      setTimer = match['timeinfo']['running']
      var hometeam = teams['home']
      if (hometeam['name']) hometeamname = hometeam['name']
      // document.getElementById('homeNameLabel').textContent = hometeamname
      var awayteam = teams['away']
      if (awayteam['name']) awayteamname = awayteam['name']
      // document.getElementById('awayNameLabel').textContent = awayteamname
      teamNames['home'] = hometeamname;
      teamNames['away'] = awayteamname;
      // hometeamname = 'This team name is longer than 16 characters'
      if(hometeamname.length > 16){
        teamNames['home'] = hometeamname.substr(0, 13) + '...';
      }
      if(awayteamname.length > 16){
        teamNames['away'] = awayteamname.substr(0, 13) + '...';
      }
      document.getElementById('homeTeamName').textContent = teamNames['home']
      document.getElementById('awayTeamName').textContent = teamNames['away']
      document.getElementById('fade_homeTeamName').textContent = teamNames['home']
      document.getElementById('fade_awayTeamName').textContent = teamNames['away']
      document.getElementById('period').textContent = match['status']['name']
      // Score Setting
      var result = match['result']
      if (result['home']) homeScore = result['home']
      if (result['away']) awayScore = result['away']
      // document.getElementById('score').textContent = homeScore + ':' + awayScore
      document.getElementById('score').textContent = homeScore + ' - ' + awayScore
      document.getElementById('fade_score').textContent = homeScore + ' - ' + awayScore

      var events = data_['events']
      newEvents = new Array()
      events.forEach((event) => {
        let typeFlag = 1;
        gameType.forEach((type) => {
          if(equals(type, event['type'])) typeFlag = 0;
        })
        if (typeFlag) gameType.push(event['type'])
        if(event['seconds'] > 0 && timeSet == 0){
          // time = event['seconds'] * 1000;
          // timeSet = 1;
        }
        if(event['type'] != 'ballcoordinates') {
          newEvents.push({name: event['name'], X: event['X'], Y: event['Y'], seconds: event['seconds'], type: event['type'], team: event['team'], points: event['points']})
        }
        if (event['type'] == 'goal') {
          if (event['team'] == 'home') {
            events1 = {X: '95', Y: '50', Z: '60'}
            events1['team'] = 'home'
            events1['type'] = 'goal'
            events1['name'] = event['name']
            events1['uts'] = event['uts']
            events1['seconds'] = event['seconds']
            newEvents.push(events1)
            events2 = {X: '95', Y: '50'}
            events2['team'] = 'home'
            events2['type'] = 'goal'
            events2['name'] = event['name']
            events2['uts'] = event['uts']
            events2['seconds'] = event['seconds']
            newEvents.push(events2)
            events3 = {X: '100', Y: '50'}
            events3['team'] = 'home'
            events3['type'] = 'goal'
            events3['name'] = event['name']
            events3['uts'] = event['uts']
            events3['seconds'] = event['seconds']
            newEvents.push(events3)
          } 
          else if (event['team'] == 'away') {
            events1 = {X: '4', Y: '50', Z: '60'}
            events1['team'] = 'away'
            events1['type'] = 'goal'
            events1['name'] = event['name']
            events1['uts'] = event['uts']
            events1['seconds'] = event['seconds']
            newEvents.push(events1)

            events2 = {X: '6', Y: '50'}
            events2['team'] = 'away'
            events2['type'] = 'goal'
            events2['name'] = event['name']
            events2['uts'] = event['uts']
            events2['seconds'] = event['seconds']
            newEvents.push(events2)

            events3 = {X: '0', Y: '50'}
            events3['team'] = 'away'
            events3['type'] = 'goal'
            events3['name'] = event['name']
            events3['uts'] = event['uts']
            events3['seconds'] = event['seconds']
            newEvents.push(events3)
          } else;
        }
        if (event['type'] == 'attempt_missed') {
          if (event['team'] == 'home') {
            events1 = {X: '97', Y: '50', Z: '60'}
            events1['team'] = 'home'
            events1['type'] = 'attempt_missed'
            events1['name'] = event['name']
            events1['uts'] = event['uts']
            events1['seconds'] = event['seconds']
            events1['points'] = event['points']
            newEvents.push(events1)

            events2 = {X: '80', Y: '50'}
            events2['team'] = 'home'
            events2['type'] = 'attempt_missed'
            events2['name'] = event['name']
            events2['uts'] = event['uts']
            events2['seconds'] = event['seconds']
            events2['points'] = event['points']
            newEvents.push(events2)

            events3 = {X: '80', Y: '50'}
            events3['team'] = 'home'
            events3['type'] = 'goal'
            events3['name'] = event['name']
            events3['uts'] = event['uts']
            events3['seconds'] = event['seconds']
            events3['points'] = event['points']
            newEvents.push(events3)
          } else if (event['team'] == 'away') {
            events1 = {X: '3', Y: '50', Z: '60'}
            events1['team'] = 'away'
            events1['type'] = 'attempt_missed'
            events1['name'] = event['name']
            events1['uts'] = event['uts']
            events1['seconds'] = event['seconds']
            events1['points'] = event['points']
            newEvents.push(events1)

            events2 = {X: '20', Y: '50'}
            events2['team'] = 'away'
            events2['type'] = 'attempt_missed'
            events2['name'] = event['name']
            events2['uts'] = event['uts']
            events2['seconds'] = event['seconds']
            events2['points'] = event['points']
            newEvents.push(events2)

            events3 = {X: '20', Y: '50'}
            events3['team'] = 'away'
            events3['type'] = 'goal'
            events3['name'] = event['name']
            events3['uts'] = event['uts']
            events3['seconds'] = event['seconds']
            events3['points'] = event['points']
            newEvents.push(events3)
          } else;
        }
        if (event['type'] == 'free_throws_awarded') {
          if (event['team'] == 'home') {
            events1 = {X: '80', Y: '50'}
            events1['team'] = 'home'
            events1['type'] = 'free_throws_awarded'
            events1['name'] = event['name']
            events1['uts'] = event['uts']
            events1['seconds'] = event['seconds']
            newEvents.push(events1)

          } else if (event['team'] == 'away') {
            events1 = {X: '20', Y: '50'}
            events1['team'] = 'away'
            events1['type'] = 'free_throws_awarded'
            events1['name'] = event['name']
            events1['uts'] = event['uts']
            events1['seconds'] = event['seconds']
            newEvents.push(events1)
          } else;
        }
        
        if (event['type'] == 'ballcoordinates') {
          var coordinates = event['coordinates']
          var tmpCoordinate = new Array()
          coordinates.slice().reverse().forEach((item) => {
              newEvents.push(item)
            })
        }
      })
      // Compare newEvents with lastEvents and push new events to gameState;
      newEvents.forEach((newEvent) => {
        let flag = 1
        gameState.forEach((lastEvent) => {
          if (equals(newEvent, lastEvent)) flag = 0
        })
        if (flag == 1) {
          gameState.push(newEvent)
        }
      })
      lastEvents = newEvents
    })
}
