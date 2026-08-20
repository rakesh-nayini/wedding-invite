;(function () {
  var TARGET = 0.35
  var FADE_MS = 2500
  var audio = document.getElementById('invite-music')
  if (!audio) return

  window.__inviteMusicOff = false
  var fading = false
  var ctx = null

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
    var start = performance.now()
    function tick(now) {
      if (window.__inviteMusicOff || audio.paused) {
        fading = false
        return
      }
      var t = Math.min(1, (now - start) / FADE_MS)
      audio.volume = from + (TARGET - from) * t
      if (t < 1) requestAnimationFrame(tick)
      else fading = false
    }
    requestAnimationFrame(tick)
  }

  function resumeContext() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return
      if (!ctx) ctx = new AC()
      if (ctx.state === 'suspended') ctx.resume()
    } catch (e) {}
  }

  function start() {
    if (window.__inviteMusicOff) return false
    resumeContext()
    audio.muted = false
    audio.loop = true
    if (audio.readyState < 1) audio.load()
    if (audio.volume > 0.05 && audio.paused) audio.volume = 0
    try {
      var play = audio.play()
      if (play && play.then) {
        play.then(fadeUp).catch(function () {})
      } else {
        fadeUp()
      }
    } catch (e) {}
    return !audio.paused
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

  audio.addEventListener('canplay', function () {
    if (!window.__inviteMusicOff) start()
  })
  audio.addEventListener('loadeddata', function () {
    if (!window.__inviteMusicOff) start()
  })

  start()
  var tries = 0
  var retry = window.setInterval(function () {
    if (window.__inviteMusicOff || !audio.paused) {
      if (!audio.paused) window.clearInterval(retry)
      return
    }
    tries += 1
    start()
    if (tries > 40) window.clearInterval(retry)
  }, 400)

  function fromTouch(e) {
    if (window.__inviteMusicOff) return
    var t = e.target
    if (t && t.closest && t.closest('[data-music-toggle]')) return
    start()
  }

  ;['pointerdown', 'touchstart', 'touchend', 'mousedown', 'keydown', 'click'].forEach(function (name) {
    window.addEventListener(name, fromTouch, true)
  })
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && !window.__inviteMusicOff) start()
  })
})()
