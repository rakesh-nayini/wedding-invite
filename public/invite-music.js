;(function () {
  var TARGET = 0.35
  var FADE_MS = 2500
  var audio = document.getElementById('invite-music')
  if (!audio) return

  window.__inviteMusicOff = false
  var fading = false

  function themeUrl() {
    var path = window.location.pathname || '/'
    if (/\.html?$/i.test(path)) path = path.replace(/[^/]+$/, '')
    if (path.charAt(path.length - 1) !== '/') path += '/'
    return path + 'assets/audio/theme.mp3'
  }

  audio.preload = 'auto'
  audio.loop = true
  audio.muted = false
  audio.volume = 0
  audio.setAttribute('playsinline', 'true')
  audio.setAttribute('webkit-playsinline', 'true')
  audio.src = themeUrl()
  audio.load()

  function fadeUp() {
    if (fading || window.__inviteMusicOff || audio.paused) return
    fading = true
    var from = audio.volume
    var startAt = performance.now()
    function tick(now) {
      if (window.__inviteMusicOff || audio.paused) {
        fading = false
        return
      }
      var t = Math.min(1, (now - startAt) / FADE_MS)
      audio.volume = from + (TARGET - from) * t
      if (t < 1) requestAnimationFrame(tick)
      else fading = false
    }
    requestAnimationFrame(tick)
  }

  function start() {
    if (window.__inviteMusicOff) return false
    audio.muted = false
    audio.loop = true
    if (audio.paused && audio.volume > 0.05) audio.volume = 0
    var play = audio.play()
    if (play && play.then) play.then(fadeUp).catch(function () {})
    else fadeUp()
    return true
  }

  function stop() {
    window.__inviteMusicOff = true
    fading = false
    try {
      audio.pause()
    } catch (e) {}
  }

  window.inviteMusicStart = start
  window.inviteMusicStop = stop
})()
