var dob = 0
var gameId = 34231107
var gameState = new Array()
var gameType= new Array()
var newEvents = new Array()
var lastEvents = new Array()
var awayteamname, hometeamname
var homeScore, awayScore
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
          time = event['seconds'] * 1000;
          timeSet = 1;
        }
        if(event['type'] != 'ballcoordinates' && event['type'] != 'goal' && event['type'] != 'attempt_missed' && event['type'] != 'free_throws_awarded') {
          let events0 = new Array()
          events0['X'] = event['X']
          events0['Y'] = event['Y']
          events0['team'] = event['team']
          events0['type'] = event['type']
          events0['name'] = event['name']
          events0['uts'] = event['uts']
          events0['seconds'] = event['seconds']
          newEvents.push(events0)
        }
        if (event['type'] == 'goal') {
          let events0 = new Array()
          events0['X'] = event['X']
          events0['Y'] = event['Y']
          events0['team'] = event['team']
          events0['type'] = event['type']
          events0['name'] = event['name']
          events0['uts'] = event['uts']
          events0['seconds'] = event['seconds']
          newEvents.push(events0)
          if (event['team'] == 'home') {
              let events1 = new Array()
              let events2 = new Array()
              events1['X'] = 95
              events1['Y'] = 50
              events1['Z'] = 60
              events1['team'] = 'home'
              events1['type'] = 'goal'
              events1['name'] = event['name']
              events1['uts'] = event['uts']
              events1['seconds'] = event['seconds']
              newEvents.push(events1)
              events2['X'] = 95
              events2['Y'] = 50
              events2['team'] = 'home'
              events2['type'] = 'goal'
              events2['name'] = event['name']
              events2['uts'] = event['uts']
              events2['seconds'] = event['seconds']
              newEvents.push(events2)
          } 
          else if (event['team'] == 'away') {
              let events1 = new Array()
              events1['X'] = 4
              events1['Y'] = 50
              events1['Z'] = 60
              events1['team'] = 'away'
              events1['type'] = 'goal'
              events1['name'] = event['name']
              events1['uts'] = event['uts']
              events1['seconds'] = event['seconds']
              newEvents.push(events1)
              let events2 = new Array()
              events2['X'] = 6
              events2['Y'] = 50
              events2['team'] = 'away'
              events2['type'] = 'goal'
              events2['name'] = event['name']
              events2['uts'] = event['uts']
              events2['seconds'] = event['seconds']
              newEvents.push(events2)
          } else;
        }
        if (event['type'] == 'attempt_missed') {
          let events0 = new Array()
          events0['X'] = event['X']
          events0['Y'] = event['Y']
          events0['team'] = event['team']
          events0['type'] = event['type']
          events0['name'] = event['name']
          events0['uts'] = event['uts']
          events0['seconds'] = event['seconds']
          newEvents.push(events0)
          if (event['team'] == 'home') {
              let events1 = new Array()
              let events2 = new Array()
              events1['X'] = 97
              events1['Y'] = 50
              events1['Z'] = 60
              events1['team'] = 'home'
              events1['type'] = 'attempt_missed'
              events1['name'] = event['name']
              events1['uts'] = event['uts']
              events1['seconds'] = event['seconds']
              newEvents.push(events1)
              events2['X'] = 80
              events2['Y'] = 50
              events2['team'] = 'home'
              events2['type'] = 'attempt_missed'
              events2['name'] = event['name']
              events2['uts'] = event['uts']
              events2['seconds'] = event['seconds']
              newEvents.push(events2)
          } else if (event['team'] == 'away') {
              let events1 = new Array()
              let events2 = new Array()
              events1['X'] = 3
              events1['Y'] = 50
              events1['Z'] = 60
              events1['team'] = 'away'
              events1['type'] = 'attempt_missed'
              events1['name'] = event['name']
              events1['uts'] = event['uts']
              events1['seconds'] = event['seconds']
              newEvents.push(events1)
              events2['X'] = 20
              events2['Y'] = 50
              events2['team'] = 'away'
              events2['type'] = 'attempt_missed'
              events2['name'] = event['name']
              events2['uts'] = event['uts']
              events2['seconds'] = event['seconds']
              newEvents.push(events2)
          } else;
        }
        if (event['type'] == 'free_throws_awarded') {
          let events0 = new Array()
          if(event['team'] == 'home'){
            events0['X'] = 80
          }
          else if (event['team'] == 'away'){
            events0['X'] = 20
          }
          events0['Y'] = 50
          events0['team'] = event['team']
          events0['type'] = event['type']
          events0['name'] = event['name']
          events0['uts'] = event['uts']
          events0['seconds'] = event['seconds']
          newEvents.push(events0)
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
