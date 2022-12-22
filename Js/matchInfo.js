var homePlayerColor, awayPlayerColor, homePlayerStripesColor, awayPlayerStripesColor, homePlayerSleeveColor, awayPlayerSleeveColor
function getMatchJsonData() {
  fetch(
    'https://lmt.fn.sportradar.com/common/en/Etc:UTC/gismo/match_info/36490713',
  )
    .then((res) => {
      return res.json()
    })
    .then((data) => {
      var doc1 = data['doc'][0]
      var data1 = doc1['data']
      var jerseys = data1['jerseys']
      homePlayerColor = jerseys['home']['player']['base']
      awayPlayerColor = jerseys['away']['player']['base']
      document.getElementById('homeBaseColorS').setAttribute('fill', '#'+ homePlayerColor);
      document.getElementById('homeBaseColor').setAttribute('fill', '#'+ homePlayerColor);
      document.getElementById('awayBaseColor').setAttribute('fill', '#'+ awayPlayerColor);
      document.getElementById('homeBaseColorT').setAttribute('fill', '#'+ homePlayerColor);
      document.getElementById('awayBaseColorT').setAttribute('fill', '#'+ awayPlayerColor);
      
    })
}
