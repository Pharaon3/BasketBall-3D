var socket;

var currentState = 0
var setTimer1 = true;

var updated_uts1 = 0, updated_uts = 0
var currentTime, matchStartDate;
var ptime, setTimer, stopTime = 0

var topLeft = 243,
  topPosition = 443
var pitchX = 724,
  pitchY = 154
var w1 = pitchX / 2,
  w2 = 464 / 2,
  hp = pitchY
var x1 = 0,
  y1 = hp / 2,
  x2 = 0,
  y2 = hp / 2
var xb = 0,
  yb = 0
var t, L, H, ll, hh, h1, k
var x = 0,
  y = mapY(0, hp / 2),
  x_1 = 0,
  y_1 = mapY(0, hp / 2),
  x_b = 0,
  y_b = mapY(0, hp / 2)
var ballRadius = 13

x_1_1 = mapX(x1, y1)
y_1_1 = mapY(x1, y1)
x_1_2 = mapX(x2, y2)
y_1_2 = mapY(x2, y2)

var time, timeInterval = 10;
var setTimer;
var lineX = [
  mapX(0, hp / 2) + w2 + topLeft,
  mapX(0, hp / 2) + w2 + topLeft,
  mapX(0, hp / 2) + w2 + topLeft,
  mapX(0, hp / 2) + w2 + topLeft,
]
var lineY = [
  mapY(0, hp / 2) + topPosition,
  mapY(0, hp / 2) + topPosition,
  mapY(0, hp / 2) + topPosition,
  mapY(0, hp / 2) + topPosition,
]

var timeFlag; // 0: not set, 1: set
var currentTeam;
var rectId, currentRectId; // 0: none, 1: homeSafe, 2: homeAttack, 3: homeDangerousAttack, -3: awaySafe, -2: awayAttack, -1: awayDangerousAttack;
var timeSet;

var isGoal

function countdown() {
  var interval = setInterval(function () {
    changeScreenSize()
    const currentDate = new Date;
    updated_uts += timeInterval / 1000
    if(setTimer) currentTime = updated_uts
    else currentTime = stopTime
    // var seconds = Math.floor(updated_uts / 1000)
    var seconds = Math.floor(currentTime)
    var minute = Math.floor(seconds / 60)
    var second = seconds % 60
    document.getElementById('time').textContent =
      Math.floor(minute / 10) +
      '' +
      (minute % 10) +
      ':' +
      Math.floor(second / 10) +
      '' +
      (second % 10)
    if(matchStartDate){
      var seconds = Math.floor((matchStartDate - currentDate.getTime()) / 1000)
      var second = seconds % 60
      var minutes = Math.floor(seconds / 60)
      var minute = minutes % 60
      var hours = Math.floor(minutes / 60)
      var hour = hours % 24
      var days = Math.floor(hours / 24)
      setCenterFrame('Not Started', days + 'D ' + hour + 'H ' + minute + 'M ' + second + 'S')
    }

    ttt++;
    //every 10ms
    if (currentState == 0) {
      // This is very at first. Need to initialize the state and wait.
      if (gameState.length > 0) {
        // Need to go next
        stepInitialize()
      }
    } else {
      // Normal case
      if (Math.floor(ttt) % 100 == 0) {
        //every 500ms
        stepInitialize()
      }
      t += 1 / 101
      var seconds = Math.floor(time / 1000)
      ballPosition()
      drawRect()
      drawTrack()
      displayState()
      if (x2 == x1 && y2 == y1) {
        bounceBall()
        if(gameState[currentState]['Z']) kickBall();
      } else {
        if(gameState[currentState]['type']){
          bounceBall();
        } else {
          kickBall()
        }
      }
      showState()
    }
    if(gameState.length && gameState[currentState]['type'] == 'timeout'){
      setTimer = false
      setCenterFrame('Time Out', teamNames[gameState[currentState]['team']])
    }
    time -= timeInterval;
    if(setTimer1) currentTime = time
    else currentTime = getDataTime
    let thisSecond = Math.floor(currentTime / 1000);
    var minute = Math.floor(thisSecond / 60);
    var second = thisSecond % 60;
    document.getElementById('time').textContent = max(Math.floor(minute / 10), 0) + '' + max(0, (minute % 10)) + ':' + max(0, Math.floor(second / 10)) + '' + max(0, (second % 10));

      // setTimer = true

  }, timeInterval)
}
function load() {
  ttt = 0
  xb = x1 + w1
  yb = y1
  t = 0.005
  time = 0
  playMode = 0
  tmpV = true
  exceeded = true
  timeFlag = 0
  rectId = 0
  currentRectId = 0
  homeScore = 0
  awayScore = 0
  timeSet = 0;
  isGoal = 0
  setTimer = 1;
  countdown();

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = Number(urlParams.get('eventId'));

  socket=new WebSocket("ws://62.112.8.78:9680");
  socket.onopen=function(e) {
    //socket.send(JSON.stringify({r:"authenticate", a:{key:"*******"}}));
    socket.send(JSON.stringify({r:"subscribe_event", a:{id:eventId}}));
  };

  socket.onmessage=function(e) {
    var data = JSON.parse(e.data);

    if (data.r == 'event') {
      // New function added for websocket. Call it.
      handleEventData(data.d);
    }
  };
  document.getElementById('link').setAttribute('href', '../Basketball-2D/index.html?eventId=' + eventId)
}
function bounceBall() {
  if(!setTimer)return
  tt = t * 2
  if(tt > 1) tt = tt - 1
  tt = t
  x_1 = mapX(x, y)
  y_1 = ((y * y) / hp + y) / 2
  document
    .getElementById('ball')
    .setAttribute('x', x_b + w2 - ballRadius / 2 + topLeft)
  document
    .getElementById('ball')
    .setAttribute('y',y_b - ballRadius + topPosition - 20 + 20 * (tt - 0.5) * (tt - 0.5) * 4)
  document.getElementById('ball').setAttribute('width', ballRadius)
  document.getElementById('ball_shadow').setAttribute('cx', x_b + w2 + topLeft)
  document.getElementById('ball_shadow').setAttribute('cy', y_1 + topPosition)
  document.getElementById('ball_shadow').setAttribute('rx', ((ballRadius + 15) * H * 0.25) / (H * (1 - 4* (tt - 0.5) * (tt - 0.5)) + H))
  document.getElementById('ball_shadow').setAttribute('ry', ((ballRadius + 15) * H * 0.25) / (H * (1 - 4* (tt - 0.5) * (tt - 0.5)) + H) / 2)
}
function ballPosition() {
  bt = t * 2
  // if(bt > 1) return;
  bt = t
  x = x1 + (x2 - x1) * bt
  y = y1 + (y2 - y1) * bt // x is (-0.5, 0.5) in square pitch
  x_1 = mapX(x, y)
  y_1 = mapY(x, y) // x_1 is in polygon pitch
  L = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
  LL = L
  if (L < 0.01) L = 0.01
  H = L / 4
  H = max(25, H)
  ll = Math.sqrt((x1 - x) * (x1 - x) + (y1 - y) * (y1 - y))
  hh = H * (1 - (4 * (ll - L / 2) * (ll - L / 2)) / (L * L))
  h1 = ((w2 + ((w1 - w2) / hp) * y) * hh) / w1
  if(gameState[currentState]['Z']){
    h1 = gameState[currentState]['Z'] * (1 - (1 - bt) * (1 - bt))
  }
  if(gameState[currentState - 1]['Z']){
    h1 = gameState[currentState - 1]['Z'] * (1 - bt * bt)
    document.getElementById('netImage').style.display = 'block'
  } else {
    document.getElementById('netImage').style.display = 'none'
  }
  x_b = x_1
  y_b = y_1 - h1
  ballRadius = mapX(13, y)
  xs = x_1_1 + (x_1_2 - x_1_1) * bt
  ys = y_1_1 + (y_1_2 - y_1_1) * bt
}
function kickBall() {
  if(!setTimer)return
  document
    .getElementById('ball')
    .setAttribute('x', x_b + w2 - ballRadius / 2 + topLeft)
  document
    .getElementById('ball')
    .setAttribute('y', y_b - ballRadius + topPosition)
  document.getElementById('ball').setAttribute('width', ballRadius)
  document.getElementById('ball_shadow').setAttribute('cx', x_1 + w2 + topLeft)
  document.getElementById('ball_shadow').setAttribute('cy', y_1 + topPosition)
  if (hh + H > 0) {
    document.getElementById('ball_shadow').setAttribute('rx', ((ballRadius + 15) * H * 0.25) / (hh + H))
    document.getElementById('ball_shadow').setAttribute('ry', ((ballRadius + 15) * H * 0.25) / (hh + H) / 2)
  } else {
    document.getElementById('ball_shadow').setAttribute('rx', 0)
    document.getElementById('ball_shadow').setAttribute('ry', 0)
  }
}
function drawTrack() {
  if(!setTimer)return
  x_l = x_1_1 + (x_1_2 - x_1_1) * t
  y_l = y_1_1 + (y_1_2 - y_1_1) * t
  document.getElementById('ballLine1').setAttribute('x1', lineX[0])
  document.getElementById('ballLine1').setAttribute('y1', lineY[0])
  document.getElementById('ballLine1').setAttribute('x2', x_l + w2 + topLeft)
  document.getElementById('ballLine1').setAttribute('y2', y_l + topPosition)

  document.getElementById('ballLine2').setAttribute('x1', lineX[1])
  document.getElementById('ballLine2').setAttribute('y1', lineY[1])
  document.getElementById('ballLine2').setAttribute('x2', lineX[0])
  document.getElementById('ballLine2').setAttribute('y2', lineY[0])

  document.getElementById('ballLine3').setAttribute('x1', lineX[2])
  document.getElementById('ballLine3').setAttribute('y1', lineY[2])
  document.getElementById('ballLine3').setAttribute('x2', lineX[1])
  document.getElementById('ballLine3').setAttribute('y2', lineY[1])

  document.getElementById('ballLine4').setAttribute('x1', lineX[3])
  document.getElementById('ballLine4').setAttribute('y1', lineY[3])
  document.getElementById('ballLine4').setAttribute('x2', lineX[2])
  document.getElementById('ballLine4').setAttribute('y2', lineY[2])

  document.getElementById('TractDot1').setAttribute('cx', lineX[0])
  document.getElementById('TractDot1').setAttribute('cy', lineY[0])
  document.getElementById('TractDot2').setAttribute('cx', lineX[1])
  document.getElementById('TractDot2').setAttribute('cy', lineY[1])
  document.getElementById('TractDot3').setAttribute('cx', lineX[2])
  document.getElementById('TractDot3').setAttribute('cy', lineY[2])
}
function resetTrack() {
  lineX[3] = x_1_1 + w2 + topLeft
  lineX[2] = x_1_1 + w2 + topLeft
  lineX[1] = x_1_1 + w2 + topLeft
  lineX[0] = x_1_1 + w2 + topLeft
  lineY[3] = y_1_1 + topPosition
  lineY[2] = y_1_1 + topPosition
  lineY[1] = y_1_1 + topPosition
  lineY[0] = y_1_1 + topPosition
}
function stepInitialize() {
  // For setting time
  if (timeFlag == 0) {
    if (currentState > 0) {
      if (gameState[currentState]['seconds'] > -1) {
        // time = gameState[currentState]['seconds'] * 1000
        time = getDataTime
        timeFlag = 1
      }
    }
  }
  // For initializing ball position
  t = 0
  x1 = x2
  y1 = y2
  if (currentState < gameState.length - 1) {
    currentState = max(currentState + 1, gameState.length - 10)
    if(gameState[currentState]['seconds'] > 0){
      // time = gameState[currentState]['seconds'] * 1000
      if(gameState[currentState]['type'] == 'periodscore') setTimer = 0;
    }
    if (gameState[currentState]['X'] > -1) {
      x2 = ((gameState[currentState]['X'] - 50) * w1) / 50
      y2 = (gameState[currentState]['Y'] * hp) / 100
      if (gameState[currentState]['type']) {
        // x1 = x2
        // y1 = y2
        x_1_1 = mapX(x1, y1)
        y_1_1 = mapY(x1, y1)
        x_1_2 = mapX(x2, y2)
        y_1_2 = mapY(x2, y2)
        resetTrack()
      } else {
        x_1_1 = mapX(x1, y1)
        y_1_1 = mapY(x1, y1)
        x_1_2 = mapX(x2, y2)
        y_1_2 = mapY(x2, y2)
        lineX[3] = lineX[2]
        lineY[3] = lineY[2]
        lineX[2] = lineX[1]
        lineY[2] = lineY[1]
        lineX[1] = lineX[0]
        lineY[1] = lineY[0]
        lineX[0] = x_1_1 + w2 + topLeft
        lineY[0] = y_1_1 + topPosition
      }
    } else {
      x2 = x1
      y2 = y1
      x_1_1 = mapX(x1, y1)
      y_1_1 = mapY(x1, y1)
      x_1_2 = mapX(x2, y2)
      y_1_2 = mapY(x2, y2)
      resetTrack()
    }
  } else {
    x1 = x2
    y1 = y2
    x_1_1 = mapX(x1, y1)
    y_1_1 = mapY(x1, y1)
    x_1_2 = mapX(x2, y2)
    y_1_2 = mapY(x2, y2)
  }
  // For setting currentTeam
  if (gameState[currentState]['team'] != currentTeam) {
    currentTeam = gameState[currentState]['team']
    resetTrack()
  }
  rectId = currentRectId
  if(gameState[currentState]['type'] == 'goal')isGoal ++;
  else isGoal = 0;
}
function drawRect() {
  if(!setTimer)return
  rt = t * 2
  if (rt > 1) rt = 1
  if (gameState[currentState]['team'] == 'home') {
    document.getElementById('awayStatePolygon').style.fill = 'url(#none)'
    document.getElementById('homeStatePolygon').style.fill ='url(#homePossession)'
    if (rectId == 0 || rectId == 1) {
      document.getElementById('homeStatePolygon').points[1].x = 450
      document.getElementById('homeStatePolygon').points[2].x = 500
      document.getElementById('homeStatePolygon').points[3].x = 439
    }
    if (rectId == -1) {
      document.getElementById('homeStatePolygon').points[1].x =
        243 + (450 - 243) * rt
      document.getElementById('homeStatePolygon').points[2].x =
        180 + (500 - 180) * rt
      document.getElementById('homeStatePolygon').points[3].x =
        113 + (439 - 113) * rt
    }
    currentRectId = 1
  } 
  else {
    document.getElementById('homeStatePolygon').style.fill = 'url(#none)'
      currentRectId = -1
      document.getElementById('awayStatePolygon').style.fill ='url(#awayPossession)'
      if (rectId == 0 || rectId == -1) {
        document.getElementById('awayStatePolygon').points[1].x = 500
        document.getElementById('awayStatePolygon').points[0].x = 450
        document.getElementById('awayStatePolygon').points[4].x = 511
      }
      if (rectId == 1) {
        document.getElementById('awayStatePolygon').points[1].x =
          707 + (500 - 707) * rt
        document.getElementById('awayStatePolygon').points[0].x =
          775 + (450 - 775) * rt
        document.getElementById('awayStatePolygon').points[4].x =
          837 + (511 - 837) * rt
      }
  }
  if(gameState[currentState]['type'] == 'foul'){
    if (gameState[currentState]['team'] == 'away') {
      document.getElementById('awayStatePolygon').style.fill = 'url(#none)'
      document.getElementById('homeStatePolygon').style.fill ='url(#homePossession)'
      if (rectId == 0 || rectId == 1) {
        document.getElementById('homeStatePolygon').points[1].x = 450
        document.getElementById('homeStatePolygon').points[2].x = 500
        document.getElementById('homeStatePolygon').points[3].x = 439
      }
      if (rectId == -1) {
        document.getElementById('homeStatePolygon').points[1].x =
          243 + (450 - 243) * rt
        document.getElementById('homeStatePolygon').points[2].x =
          180 + (500 - 180) * rt
        document.getElementById('homeStatePolygon').points[3].x =
          113 + (439 - 113) * rt
      }
      currentRectId = 1
    } 
    else {
      document.getElementById('homeStatePolygon').style.fill = 'url(#none)'
        currentRectId = -1
        document.getElementById('awayStatePolygon').style.fill ='url(#awayPossession)'
        if (rectId == 0 || rectId == -1) {
          document.getElementById('awayStatePolygon').points[1].x = 500
          document.getElementById('awayStatePolygon').points[0].x = 450
          document.getElementById('awayStatePolygon').points[4].x = 511
        }
        if (rectId == 1) {
          document.getElementById('awayStatePolygon').points[1].x =
            707 + (500 - 707) * rt
          document.getElementById('awayStatePolygon').points[0].x =
            775 + (450 - 775) * rt
          document.getElementById('awayStatePolygon').points[4].x =
            837 + (511 - 837) * rt
        }
    }
  }
}
function showState() {
  if(!setTimer)return
  document.getElementById('actionBoard').setAttribute('width', 0)
  document.getElementById('actionBoard').setAttribute('height', 0)
  document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0)
  document.getElementById('ballState').textContent = ''
  document.getElementById('holder').textContent = ''

  // Goal

  // Substitution
  document.getElementById('substitutionOut').setAttribute('fill-opacity', 0)
  document.getElementById('substitutionIn').setAttribute('fill-opacity', 0)
  document.getElementById('substitutionOutPlayer').textContent = ''
  document.getElementById('substitutionInPlayer').textContent = ''

  document.getElementById('bottom_rect').setAttribute('fill-opacity', 0)
  document.getElementById('bottom_text').textContent = ''
  document.getElementById('bottom2_text').textContent = ''
  document.getElementById('center_rect').setAttribute('fill-opacity', 0)
  document.getElementById('center_text').textContent = ''
  document.getElementById('awayKickPolygon').style.fill = 'url(#none)'
  document.getElementById('homeKickPolygon').style.fill = 'url(#none)'


  if(gameState[currentState]['type'] && gameState[currentState]['type'] != 'possession'){
    remove()
    // if(gameState[currentState]['team'])showAction()
  }
  else {
  }
}
function remove() {
  document.getElementById('homeKickPolygon').style.fill = 'url(#none)'
  document.getElementById('awayKickPolygon').style.fill = 'url(#none)'
  document.getElementById('stateBoard').setAttribute('fill-opacity', 0)
}
function max(a, b) {
  if(a > b) return a;
  return b;
}
function mapX(x11, y11) {
  x_11 = ((w2 + ((w1 - w2) * y11) / hp) * x11) / w1
  return x_11
}
function mapY(x11, y11) {
  y_11 = ((y11 * y11) / hp + 1.5 * y11) / 2.5
  return y_11
}
function displayState() {
  if(!setTimer)return
  var statePositionX, statePositionY
  document.getElementById('stateLabels').style.display = 'block'
  if(gameState[currentState]['team']) document.getElementById('teamName').textContent = teamNames[gameState[currentState]['team']].toUpperCase()
  if ((y2 * 100) / hp < 30) {
    statePositionY = 500
  } else if ((y2 * 100) / hp < 70) {
    statePositionY = 540
  } else {
    statePositionY = 500
  }
  document.getElementById('stateRect').setAttribute('rx', 20)
  document.getElementById('stateRect').setAttribute('ry', 20)
  document.getElementById('jerseyCircle').style.display = 'block'
  document.getElementById('jerseyCircle').setAttribute('fill-opacity', 0)
  document.getElementById('stateRect').setAttribute('fill', 'blue')
  document.getElementById('stateRect').setAttribute('fill-opacity', 0)
  document.getElementById('Ball_Begin').style.display = 'block'
  document.getElementById('Ball_Track_Begin').style.display = 'block'
  if(gameState[currentState]['team'] == 'home'){
    document.getElementById('state').setAttribute('text-anchor', 'end')
    document.getElementById('teamName').setAttribute('text-anchor', 'end')
    document.getElementById('state').setAttribute('x', '-45')
    document.getElementById('teamName').setAttribute('x', '-45')
    document.getElementById('stateRect').setAttribute('x', '-150')
    document.getElementById('stateRect').setAttribute('width', '150')
    document.getElementById('jerseyCircle').setAttribute('cx', '-20')
    document.getElementById('stateJersey').setAttribute('transform', 'translate(-20, -25)')
    document.getElementById('homeBaseColorS').setAttribute('fill', '#'+ homePlayerColor);
    document.getElementById('state').textContent = 'Possession'
    let stateRectWidth = max(document.getElementById('state').getBBox().width, document.getElementById('teamName').getBBox().width) + 55
    document.getElementById('stateRect').setAttribute('width', stateRectWidth)
    document.getElementById('stateRect').setAttribute('x', - stateRectWidth)
    statePositionX = 450
  }
  else {
    document.getElementById('state').setAttribute('text-anchor', 'start')
    document.getElementById('teamName').setAttribute('text-anchor', 'start')
    document.getElementById('state').setAttribute('x', '45')
    document.getElementById('teamName').setAttribute('x', '45')
    document.getElementById('stateRect').setAttribute('x', '0')
    document.getElementById('stateRect').setAttribute('width', '150')
    document.getElementById('jerseyCircle').setAttribute('cx', '20')
    document.getElementById('stateJersey').setAttribute('transform', 'translate(20, -25)')
    document.getElementById('homeBaseColorS').setAttribute('fill', '#'+ awayPlayerColor);
    document.getElementById('state').textContent = 'Possession'
    let stateRectWidth = max(document.getElementById('state').getBBox().width, document.getElementById('teamName').getBBox().width) + 55
    document.getElementById('stateRect').setAttribute('width', stateRectWidth)
    statePositionX = 500
  }
  document.getElementById('stateLabels').setAttribute('transform', 'translate(' + statePositionX + ',' + statePositionY + ')');
  if(gameState[currentState]['type'] == 'goal' || gameState[currentState]['type'] == 'attempt_missed'){
    if(currentState > 0){
      if(gameState[currentState - 1]['Z']){
        action()
        document.getElementById('Ball_Begin').style.display = 'block'
        document.getElementById('Ball_Track_Begin').style.display = 'block'
      }
    }
    if(currentState > 1){
      if(gameState[currentState - 2]['Z']){
        action()
        document.getElementById('Ball_Begin').style.display = 'block'
        document.getElementById('Ball_Track_Begin').style.display = 'block'
      }
    }
    
  }
  if(gameState[currentState]['type'] == 'foul' || gameState[currentState]['type'] == 'block' || gameState[currentState]['type'] == 'rebound' || gameState[currentState]['type'] == 'free_throws_awarded') action()
}

function action() {
  statePositionX = 475
  statePositionY = 520
  document.getElementById('homeStatePolygon').style.fill = 'url(#none)'
  document.getElementById('awayStatePolygon').style.fill = 'url(#none)'
  document.getElementById('state').setAttribute('text-anchor', 'start')
  document.getElementById('teamName').setAttribute('text-anchor', 'start')
  document.getElementById('state').textContent = gameState[currentState]['name']
  if(gameState[currentState]['points']){
    document.getElementById('state').textContent = gameState[currentState]['points'] + 'pt ' + 'missed'
    if(gameState[currentState]['points'] == 1) document.getElementById('state').textContent = 'Free Throw missed'
  } 
  let stateRectWidth = max(document.getElementById('state').getBBox().width, document.getElementById('teamName').getBBox().width) + 40 + 20
  let stateRectX = - (stateRectWidth) / 2 + 20
  document.getElementById('stateRect').setAttribute('width', stateRectWidth)
  document.getElementById('stateRect').setAttribute('rx', 0)
  document.getElementById('stateRect').setAttribute('ry', 0)
  document.getElementById('stateRect').setAttribute('x', - stateRectWidth / 2)
  document.getElementById('jerseyCircle').setAttribute('cx', stateRectX)
  document.getElementById('state').setAttribute('x', stateRectX + 20)
  document.getElementById('teamName').setAttribute('x', stateRectX + 20)
  document.getElementById('jerseyCircle').style.display = 'none'
  document.getElementById('stateRect').setAttribute('fill', 'black')
  document.getElementById('stateRect').setAttribute('fill-opacity', 0.6)
  document.getElementById('stateJersey').setAttribute('transform', 'translate(' + stateRectX + ', -25)')
  document.getElementById('stateLabels').setAttribute('transform', 'translate(' + statePositionX + ',' + statePositionY + ')');
  document.getElementById('Ball_Begin').style.display = 'none'
  document.getElementById('Ball_Track_Begin').style.display = 'none'
}
function goalAnimation() {
  // action()
  document.getElementById('stateLabels').style.display = 'none'
  document.getElementById('score-fade-out').style.display = 'block'
  document.getElementById('fadeScore').style.display = 'block'
  if(gameState[currentState]['team'] == 'home'){
    // document.getElementById('homeBScoreFade').textContent = 5
    // document.getElementById('homeCScoreFade').textContent = 3
    // document.getElementById('homeAScoreFade').textContent = 8
    document.getElementById('homeBScoreFade').textContent = homeScore - thisScore
    document.getElementById('homeCScoreFade').textContent = thisScore
    document.getElementById('homeAScoreFade').textContent = homeScore
    if(gameState[currentState]['name'] == '1'){
      document.getElementById('homeBScoreFade').setAttribute('y', 60 - 60 * t)
      document.getElementById('homeCScoreFade').setAttribute('y', 120 - 60 * t)
      document.getElementById('homeAScoreFade').setAttribute('y', 180)
    }
    if(gameState[currentState]['name'] == '2'){
      document.getElementById('homeBScoreFade').setAttribute('y', -100)
      document.getElementById('homeCScoreFade').setAttribute('y', 60 - 60 * t)
      document.getElementById('homeAScoreFade').setAttribute('y', 120 - 60 * t)
    }

  }
}
function setCenterFrame(title, content) {
  document.getElementById('stateLabels').style.display = 'none'
  document.getElementById('center_rect').setAttribute('fill-opacity', 0.5)
  center_text = capitalizeWords(title.split(" ")).join(' ')
  document.getElementById('center_text').textContent = center_text
  document.getElementById('center_rect').setAttribute('height', 140)
  document.getElementById('bottom_text').textContent = content
  document.getElementById('ball').setAttribute('x', 100000)
  document.getElementById('ball').setAttribute('y', 100000)
  document.getElementById('ball_shadow').setAttribute('cx', 100000)
  document.getElementById('ball_shadow').setAttribute('cy', 100000)
}
function capitalizeWords(arr) {
  return arr.map(word => {
    const firstLetter = word.charAt(0).toUpperCase();
    const rest = word.slice(1).toLowerCase();

    return firstLetter + rest;
  });
}

var dob = 0
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

// New function added for websocket.
function handleEventData(data) {

  /*
    data.info   => (matchinfo)
    data.match    => match (match_timelinedelta)
    data.events   => events (match_timelinedelta)
  */


  if (data.info) {
    handleInfoData(data);
  }

  var match = data['match']

  if (match) {
    setTimer = true
    if(match['p'] == 31) setTimer = false
    if(match['p'] == 32) setTimer = false
    if(match['p'] == 0) setTimer = false
    var teams = match['teams']
    periodlength = match['periodlength']
    getDataTime = match['timeinfo']['remaining'] * 1000
    // setTimer = match['timeinfo']['running']
    setTimer1 = match['timeinfo']['running']
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
    // document.getElementById('fade_score').textContent = homeScore + ' - ' + awayScore

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

    if(match['status']['name'] == 'Ended'){ //Match End
      setTimer = false
      setCenterFrame('Match End', homeScore + ' : ' + awayScore)
    }
    if(match['status']['name'] == 'Break'){ //Break time
      setTimer = false
      setCenterFrame('Break', homeScore + ' : ' + awayScore)
    }

    if(match['status']['name'] == 'Not started'){ //Match End
      const currentDate = new Date;
      upCommingTime = currentDate.getTime() / 1000 - match['updated_uts']
      // var seconds = Math.floor(updated_uts / 1000)
      var seconds = Math.floor(upCommingTime)
      var minute = Math.floor(seconds / 60)
      var second = seconds % 60
      // var date = new Date(match['_dt']['date'] + '4:52:48 PM UTC');
      var matchDate = match['_dt']['date'].split("/")
      var date = new Date(matchDate[1] + '/' + matchDate[0] + '/20' + matchDate[2] + ' ' + match['_dt']['time'] + ':00 UTC')

      matchStartDate = date.getTime()
    }

    if(match['p'] == 31) {
      setTimer = false
      setCenterFrame('Break', homeScore + ':' + awayScore)
    }
    if(match['p'] == 32) {
      setTimer = false
      setCenterFrame('Halftime', homeScore + ':' + awayScore)
    }
    if(match['p'] == 33) {
      setTimer = false
      setCenterFrame('Break', homeScore + ':' + awayScore)
    }

  }

  var events = data['events'] || {};

  var newEvents = new Array()
  Object.values(events).forEach((event) => {
    let typeFlag = 1;
    gameType.forEach((type) => {
      if(equals(type, event['type'])) typeFlag = 0;
    })
    if(typeFlag) gameType.push(event['type'])
    if(event['seconds'] > 0 && timeSet == 0){
      // time = event['seconds'] * 1000;
      // timeSet = 1;
    }
    if(event['type'] != 'ballcoordinates') {
      newEvents.push({name: event['name'], X: event['X'], Y: event['Y'], seconds: event['seconds'], type: event['type'], team: event['team'], points: event['points']})
    }
    if(event['type'] == 'goal') {
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
    if(event['type'] == 'attempt_missed') {
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
    if(event['type'] == 'free_throws_awarded') {
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
    
    if(event['type'] == 'ballcoordinates') {
      var coordinates = event['coordinates']
      var tmpCoordinate = new Array()
      coordinates.slice().reverse().forEach((item) => {
          newEvents.push(item)
        })
    }
  })
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
}

function handleInfoData(data) {
  var data1 = data.info;
  var jerseys = data1['jerseys']
  homePlayerColor = jerseys['home']['player']['base']
  awayPlayerColor = jerseys['away']['player']['base']
  document.getElementById('homeBaseColorS').setAttribute('fill', '#'+ homePlayerColor);
  document.getElementById('homeBaseColor').setAttribute('fill', '#'+ homePlayerColor);
  document.getElementById('awayBaseColor').setAttribute('fill', '#'+ awayPlayerColor);
  document.getElementById('homeBaseColorT').setAttribute('fill', '#'+ homePlayerColor);
  document.getElementById('awayBaseColorT').setAttribute('fill', '#'+ awayPlayerColor);
}

function changeScreenSize() {
  screenHeight = window.innerHeight
  screenWidth = window.innerWidth
  console.log('screenWidth: ', screenWidth)
  console.log('screenHeight: ', screenHeight)

  scale = min(screenWidth / 750, screenHeight / 430);

  document.getElementById('scale').setAttribute('transform', 'scale(' + scale + ')')
  document.getElementById('svg').setAttribute('width', 750 * scale)
  document.getElementById('svg').setAttribute('height', 430 * scale)

}

function min(a, b) {
  if(a > b) return b;
  return a;
}