var currentState = 0

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
    //every 10ms
    if (Math.floor(ttt++) % 100 == 0) {
      // every 100ms
      getJsonData()
    }
    if (currentState == 0) {
      // This is very at first. Need to initialize the state and wait.
      if (time > 60000) {
        // about 1min
        // time = 0
        //Need to show that it is faild.
      }
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
      displayState()
      if (x2 == x1 && y2 == y1) {
        bounceBall()
      } else {
        if(gameState[currentState]['type']){
          bounceBall();
        } else {
          // if(t < 0.5) kickBall()
          // else bounceBall()
          kickBall()
        }
      }
      // drawTrack()
      showState()
    }
    if(setTimer == 1) time += timeInterval;
    let thisSecond = Math.floor(time / 1000);
    var minute = Math.floor(thisSecond / 60);
    var second = thisSecond % 60;
    document.getElementById('time').textContent = Math.floor(minute / 10) + '' + (minute % 10) + ':' + Math.floor(second / 10) + '' + (second % 10);
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
  getMatchJsonData()
  countdown()
}
function bounceBall() {
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
  H = max(30, H)
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
        timeFlag = 1
      }
    }
  }
  // For initializing ball position
  t = 0
  x1 = x2
  y1 = y2
  if (currentState < gameState.length - 1) {
    currentState++
    if(gameState[currentState]['seconds'] > 0){
      time = gameState[currentState]['seconds'] * 1000
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
  } else {
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
function showState() {
  document.getElementById('actionBoard').setAttribute('width', 0)
  document.getElementById('actionBoard').setAttribute('height', 0)
  document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0)
  document.getElementById('ballState').textContent = ''
  document.getElementById('holder').textContent = ''

  // Goal
  document.getElementById('score-fade-out').setAttribute('opacity', 0);

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
    if(gameState[currentState]['team'])showAction()
    if(gameState[currentState]['type'] == 'substitution'){
      document.getElementById('substitutionOut').setAttribute('fill-opacity', 0.5)
      document.getElementById('substitutionIn').setAttribute('fill-opacity', 0.5)
      if(gameState[currentState]['playerin']['name']) document.getElementById('substitutionInPlayer').textContent = gameState[currentState]['playerin']['name'] + ' IN'
      if(gameState[currentState]['playerout']['name']) document.getElementById('substitutionOutPlayer').textContent = 'OUT ' + gameState[currentState]['playerout']['name']
    }
    if(gameState[currentState]['type'] == 'throwin'){
     showAction()
      // document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('center_text').textContent = gameState[currentState]['name']
      // document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('bottom_rect').setAttribute('height', 40)
      // document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]

      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'freekick'){
      showAction()
      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'shotofftarget'){
      showAction()
      // document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('center_text').textContent = gameState[currentState]['name']
      // document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      // document.getElementById('bottom_rect').setAttribute('height', 40)
      // document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]

      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'shotontarget'){
      showAction()
      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'goal_kick'){
      showAction()
      if (gameState[currentState]['team'] == 'home') {
        document.getElementById('homeKickPolygon').style.fill = 'url(#homeKick)'
        if(y2 < hp * 0.3 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeTopKick)'
        if(y2 > hp * 0.7 && x2 > w1 * 0.6) document.getElementById('homeKickPolygon').style.fill = 'url(#homeBottomKick)'
        document.getElementById('homeKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('homeKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('homeState').textContent = gameState[currentState]['name']
      } else {
        document.getElementById('awayKickPolygon').style.fill = 'url(#awayKick)'
        if(y2 < hp * 0.3 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayTopKick)'
        if(y2 > hp * 0.7 && x2 < - w1 * 0.3) document.getElementById('awayKickPolygon').style.fill = 'url(#awayBottomKick)'
        document.getElementById('awayKickPolygon').points[0].x =
          x_b + w2 + topLeft
        document.getElementById('awayKickPolygon').points[0].y = y_b + topPosition
        document.getElementById('awayState').textContent = gameState[currentState]['name']
      }
    }
    if(gameState[currentState]['type'] == 'match_ended'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
    }
    if(gameState[currentState]['type'] == 'periodstart'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
      // 
    }
    if(gameState[currentState]['type'] == 'periodscore'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
      // 
    }
    if(gameState[currentState]['type'] == 'corner'){
      showAction()
    }
    if(gameState[currentState]['type'] == 'injurytimeshown'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = 'Injury time: ' + gameState[currentState]['minutes'] + 'mins'
    }
    if(gameState[currentState]['type'] == 'injury'){
      document.getElementById('center_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('center_text').textContent = gameState[currentState]['name']
      document.getElementById('bottom_rect').setAttribute('fill-opacity', 0.3)
      document.getElementById('bottom_rect').setAttribute('height', 40)
      document.getElementById('bottom_text').textContent = teamNames[gameState[currentState]['team']]
      if(gameState[currentState]['player']['name']){
        document.getElementById('bottom_rect').setAttribute('height', 70)
        document.getElementById('bottom2_text').textContent = gameState[currentState]['player']['name']
      }
    }
  }
  else {
    // document.getElementById('homeStateLabels').style.display = 'block'
    // document.getElementById('awayStateLabels').style.display = 'block'
  }
}
function remove() {
  // document.getElementById('homeStatePolygon').style.fill = 'url(#none)'
  // document.getElementById('awayStatePolygon').style.fill = 'url(#none)'
  document.getElementById('homeKickPolygon').style.fill = 'url(#none)'
  document.getElementById('awayKickPolygon').style.fill = 'url(#none)'
  // document.getElementById('homeStateLabels').style.display = 'none'
  // document.getElementById('awayStateLabels').style.display = 'none'
  document.getElementById('goalImage').style.display = 'none'
  document.getElementById('injury').style.display = 'none'
  document.getElementById('yellowCard').style.display = 'none'
  document.getElementById('redCard').style.display = 'none'
  document.getElementById('stateBoard').setAttribute('fill-opacity', 0)

      document.getElementById('cardBoard').setAttribute('width', 0)
      document.getElementById('cardBoard').setAttribute('height', 0)
      document.getElementById('cardBoard').setAttribute('x', 10)
      document.getElementById('cardBoard').setAttribute('y', 10)
      document.getElementById('cardBoard').style.fill = 'url(#f00)'
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
function showAction() {
  // document.getElementById('ballState').textContent = gameState[currentState]['name']
  // document.getElementById('holder').textContent = teamNames[gameState[currentState]['team']].toUpperCase()
  // var rectWidth = document.getElementById('ballState').getBBox().width;
  // rectWidth = max(rectWidth, document.getElementById('holder').getBBox().width) + 20
  // document.getElementById('actionBoard').setAttribute('width', rectWidth)
  // document.getElementById('actionBoard').setAttribute('height', 50)
  // document.getElementById('actionBoard').setAttribute('x', x_b + w2 + topLeft - rectWidth - 10)
  // document.getElementById('actionBoard').setAttribute('y', y_b + topPosition - 50 - 10)
  // document.getElementById('holder').setAttribute('text-anchor', 'end')
  // document.getElementById('ballState').setAttribute('text-anchor', 'end')
  // document.getElementById('holder').setAttribute('x', x_b + w2 + topLeft - 20)
  // document.getElementById('holder').setAttribute('y', y_b + topPosition - 12 - 5)
  // document.getElementById('ballState').setAttribute('x', x_b + w2 + topLeft - 20)
  // document.getElementById('ballState').setAttribute('y', y_b + topPosition - 37 - 5)
  // document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0.9)
  // document.getElementById('stateBoardLine').setAttribute('x1', x_b + w2 + topLeft - 15)
  // document.getElementById('stateBoardLine').setAttribute('x2', x_b + w2 + topLeft - 15)
  // document.getElementById('stateBoardLine').setAttribute('y1', y_b + topPosition - 50 - 5)
  // document.getElementById('stateBoardLine').setAttribute('y2', y_b + topPosition - 15)
document.getElementById('stateLabels').style.display = 'none'
  document.getElementById('center_rect').setAttribute('fill-opacity', 0.5)
  document.getElementById('center_text').textContent = gameState[currentState]['name']
  // if(gameState[currentState]['team'] == 'away'){
  //   document.getElementById('actionBoard').setAttribute('x', x_b + w2 + topLeft + 10)
  //   document.getElementById('holder').setAttribute('text-anchor', 'start')
  //   document.getElementById('ballState').setAttribute('text-anchor', 'start')
  //   document.getElementById('holder').setAttribute('x', x_b + w2 + topLeft + 20)
  //   document.getElementById('ballState').setAttribute('x', x_b + w2 + topLeft + 20)
  //   document.getElementById('stateBoardLine').setAttribute('stroke-opacity', 0.9)
  //   document.getElementById('stateBoardLine').setAttribute('x1', x_b + w2 + topLeft + 15)
  //   document.getElementById('stateBoardLine').setAttribute('x2', x_b + w2 + topLeft + 15)
  // }  
}
function displayState() {
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
  if(gameState[currentState]['team'] == 'home'){
    document.getElementById('state').setAttribute('text-anchor', 'end')
    document.getElementById('teamName').setAttribute('text-anchor', 'end')
    document.getElementById('stateLine').setAttribute('x1', '-10')
    document.getElementById('stateLine').setAttribute('x2', '-10')
    document.getElementById('state').setAttribute('x', '-15')
    document.getElementById('teamName').setAttribute('x', '-15')
    document.getElementById('state').textContent = 'Possession'
    statePositionX = 400
  }
  else {
    document.getElementById('state').setAttribute('text-anchor', 'start')
    document.getElementById('teamName').setAttribute('text-anchor', 'start')
    document.getElementById('stateLine').setAttribute('x1', '10')
    document.getElementById('stateLine').setAttribute('x2', '10')
    document.getElementById('state').setAttribute('x', '15')
    document.getElementById('teamName').setAttribute('x', '15')
    document.getElementById('state').textContent = 'Possession'
    statePositionX = 600
  }
  document.getElementById('stateLabels').setAttribute('transform', 'translate(' + statePositionX + ',' + statePositionY + ')');
}