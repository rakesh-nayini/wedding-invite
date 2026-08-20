;(function () {
  var TARGET = 0.4
  var audio = document.getElementById('invite-music')
  if (!audio) return

  window.__inviteMusicOff = false
  var ctx = null

  function themeUrl() {
    var path = window.location.pathname || '/'
    if (/\.html?$/i.test(path)) path = path.replace(/[^/]+$/, '')
    if (path.charAt(path.length - 1) !== '/') path += '/'
    return path + 'assets/audio/theme.mp3'
  }

  audio.setAttribute('playsinline', 'true')
  audio.setAttribute('webkit-playsinline', 'true')
  audio.preload = 'auto'
  audio.loop = true
  audio.muted = false
  audio.src = themeUrl()

  function start() {
    window.__inviteMusicOff = false
    try {
      var AC = window.AudioContext || window.webkitAudioContext
      if (AC) {
        if (!ctx) ctx = new AC()
        if (ctx.state === 'suspended') ctx.resume()
      }
    } catch (e) {}
    audio.muted = false
    audio.loop = true
    audio.volume = TARGET
    var play = audio.play()
    if (play && play.catch) play.catch(function () {})
    return true
  }

  function stop() {
    window.__inviteMusicOff = true
    try {
      audio.pause()
    } catch (e) {}
  }

  window.inviteMusicStart = start
  window.inviteMusicStop = stop
})()
