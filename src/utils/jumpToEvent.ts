export function jumpToEvent(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.remove('event-spotlight')
  void el.offsetWidth
  el.classList.add('event-spotlight')
  window.setTimeout(() => el.classList.remove('event-spotlight'), 3200)
}
