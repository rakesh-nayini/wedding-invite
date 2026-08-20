;(function () {
  var TARGET = 0.4
  var FADE_MS = 1200
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
  if (!audio.getAttribute('src')) audio.src = themeUrl()
  try {
    audio.load()
  } catch (e) {}

  function fadeUp() {
    if (fading || window.__inviteMusicOff) return
    fading = true
    var from = Math.max(audio.volume, 0.08)
    audio.volume = from
    var startAt = performance.now()
    function tick(now) {
      if (window.__inviteMusicOff) {
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
    window.__inviteMusicOff = false
    audio.muted = false
    audio.loop = true
    if (!audio.src) audio.src = themeUrl()
    if (audio.paused) audio.volume = 0.08
    var play = audio.play()
    if (play && play.then) {
      play.then(fadeUp).catch(function () {})
    } else {
      fadeUp()
    }
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
