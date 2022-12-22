var dob = 0
var gameId = 34231107
var gameState = new Array()
var gameType= new Array()
var newEvents = new Array()
var lastEvents = new Array()
var awayteamname, hometeamname
var homeScore, awayScore, periodlength, getDataTime
var teamNames = new Array()
var periodScoreH = new Array()
var periodScoreA = new Array()
const equals = (a, b) => JSON.stringify(a) === JSON.stringify(b)
function getJsonData() {
  fetch(
    'https://lmt.fn.sportradar.com/demolmt/en/Etc:UTC/gismo/match_timelinedelta/36490713',
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
      if(match['status']['name'] == '1st quarter') document.getElementById('period').textContent = '1st Quarter'
      if(match['status']['name'] == '2nd quarter') document.getElementById('period').textContent = '2nd Quarter'
      if(match['status']['name'] == '3rd quarter') document.getElementById('period').textContent = '3rd Quarter'
      if(match['status']['name'] == '4th quarter') document.getElementById('period').textContent = '4th Quarter'
      if(match['status']['name'] == '1st half') document.getElementById('period').textContent = '1st Half'
      if(match['status']['name'] == '2nd half') document.getElementById('period').textContent = '2nd Half'

      // Score Setting
      var result = match['result']
      if (result['home']) homeScore = result['home']
      if (result['away']) awayScore = result['away']
      // document.getElementById('score').textContent = homeScore + ':' + awayScore
      document.getElementById('score').textContent = homeScore + ' - ' + awayScore
      document.getElementById('fade_score').textContent = homeScore + ' - ' + awayScore

      // Period Score Setting
      let currentPeriod = 1;
      if(match['periods'] != null){
        if(match['periods']['p1']){
          document.getElementById('homeScore1').textContent = match['periods']['p1']['home']
          document.getElementById('awayScore1').textContent = match['periods']['p1']['away']
          currentPeriod = 2
        }
        else {
          document.getElementById('homeScore1').textContent = '-'
          document.getElementById('awayScore1').textContent = '-'
          if(currentPeriod == 1){
            document.getElementById('homeScore1').textContent = homeScore
            document.getElementById('awayScore1').textContent = awayScore
          }
        }
        if(match['periods']['p2']){
          document.getElementById('homeScore2').textContent = match['periods']['p2']['home']
          document.getElementById('awayScore2').textContent = match['periods']['p2']['away']
          currentPeriod = 3;
        }
        else {
          document.getElementById('homeScore2').textContent = '-'
          document.getElementById('awayScore2').textContent = '-'
          if(currentPeriod == 2){
            document.getElementById('homeScore2').textContent = homeScore - match['periods']['p1']['home']
            document.getElementById('awayScore2').textContent = awayScore - match['periods']['p1']['away']
          }
        }
        if(match['periods']['p3']){
          document.getElementById('homeScore3').textContent = match['periods']['p3']['home']
          document.getElementById('awayScore3').textContent = match['periods']['p3']['away']
          currentPeriod = 4;
        }
        else {
          document.getElementById('homeScore3').textContent = '-'
          document.getElementById('awayScore3').textContent = '-'
          if(currentPeriod == 3){
            document.getElementById('homeScore3').textContent = homeScore - match['periods']['p1']['home'] - match['periods']['p2']['home']
            document.getElementById('awayScore3').textContent = awayScore - match['periods']['p1']['away'] - match['periods']['p2']['away']
          }
        }
        if(match['periods']['p4']){
          document.getElementById('homeScore4').textContent = match['periods']['p4']['home']
          document.getElementById('awayScore4').textContent = match['periods']['p4']['away']
        }
        else {
          document.getElementById('homeScore4').textContent = '-'
          document.getElementById('awayScore4').textContent = '-'
          if(currentPeriod == 4){
            document.getElementById('homeScore4').textContent = homeScore - match['periods']['p1']['home'] - match['periods']['p2']['home'] - match['periods']['p3']['home']
            document.getElementById('awayScore4').textContent = awayScore - match['periods']['p1']['away'] - match['periods']['p2']['away'] - match['periods']['p3']['away']
          }
        }
      }
      else {
        document.getElementById('homeScore1').textContent = homeScore
        document.getElementById('awayScore1').textContent = awayScore
      }
      
      // match['numberofperiods'] == 2
      if(match['numberofperiods'] == 2){
        document.getElementById('homeScore3').style.display = 'none';
        document.getElementById('homeScore4').style.display = 'none';
        document.getElementById('awayScore3').style.display = 'none';
        document.getElementById('awayScore4').style.display = 'none';
        document.getElementById('homeScore1').setAttribute('x', 427)
        document.getElementById('homeScore2').setAttribute('x', 557)
        document.getElementById('awayScore1').setAttribute('x', 427)
        document.getElementById('awayScore2').setAttribute('x', 557)

        document.getElementById('tableName1').setAttribute('x', 427)
        document.getElementById('tableName2').setAttribute('x', 557)
        document.getElementById('tableName1').textContent = '1 HALF'
        document.getElementById('tableName2').textContent = '2 HALF'
        document.getElementById('tableName3').style.display = 'none';
        document.getElementById('tableName4').style.display = 'none';
      }
      else {
        document.getElementById('homeScore3').style.display = 'block';
        document.getElementById('homeScore4').style.display = 'block';
        document.getElementById('awayScore3').style.display = 'block';
        document.getElementById('awayScore4').style.display = 'block';
        document.getElementById('homeScore1').setAttribute('x', 395)
        document.getElementById('homeScore2').setAttribute('x', 460)
        document.getElementById('homeScore3').setAttribute('x', 525)
        document.getElementById('homeScore4').setAttribute('x', 590)
        document.getElementById('awayScore1').setAttribute('x', 395)
        document.getElementById('awayScore2').setAttribute('x', 460)
        document.getElementById('awayScore3').setAttribute('x', 525)
        document.getElementById('awayScore4').setAttribute('x', 590)

        document.getElementById('tableName1').setAttribute('x', 395)
        document.getElementById('tableName2').setAttribute('x', 460)
        document.getElementById('tableName3').setAttribute('x', 525)
        document.getElementById('tableName4').setAttribute('x', 590)

        document.getElementById('tableName1').textContent = '1 QUARTER'
        document.getElementById('tableName2').textContent = '2 QUARTER'
        document.getElementById('tableName3').textContent = '3 QUARTER'
        document.getElementById('tableName4').textContent = '4 QUARTER'
        document.getElementById('tableName3').style.display = 'block';
        document.getElementById('tableName4').style.display = 'block';
      }
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
