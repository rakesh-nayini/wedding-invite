import { useEffect, useState } from 'react'
import IntroGate from './sections/IntroGate'
import OurStory from './sections/OurStory'
import InvitationVideo from './sections/InvitationVideo'
import Events from './sections/Events'
import WhenWhere from './sections/WhenWhere'
import Footer from './sections/Footer'
import CustomCursor from './components/CustomCursor'
import ProgressBar from './components/ProgressBar'
import GlassNav from './components/GlassNav'
import InviteDrawer from './components/InviteDrawer'
import Blessings from './components/Blessings'
import { useLenis } from './hooks/useLenis'
import { useScrollResponse } from './hooks/useScrollResponse'
import { useMusicPreference } from './hooks/useMusicPreference'
import { InviteProvider, useInvite } from './hooks/useInvite'
import { asset } from './utils/assets'

function useAmbient(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    const file = asset('assets/audio/theme.mp3')
    const audio = new Audio(file)
    audio.loop = true
    audio.volume = 0.28

    const start = async () => {
      try {
        await audio.play()
      } catch {
        /* Autoplay blocked, or no theme.mp3 yet */
      }
    }

    const onReady = () => {
      void start()
    }
    audio.addEventListener('canplaythrough', onReady, { once: true })
    audio.load()

    return () => {
      audio.removeEventListener('canplaythrough', onReady)
      audio.pause()
      audio.src = ''
    }
  }, [enabled])
}

function Experience() {
  const { side } = useInvite()
  const [opened, setOpened] = useState(false)
  const { enabled: musicOn, toggle: toggleMusic } = useMusicPreference()
  useLenis(opened)
  useScrollResponse(opened)
  useAmbient(opened && musicOn)

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden'
  }, [opened])

  return (
    <div key={side} className="bg-[var(--paper)] text-[var(--ink)]">
      <CustomCursor />
      {opened && <ProgressBar />}
      <GlassNav visible={opened} />
      {opened && (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed left-4 top-4 z-40 rounded-full border border-gold/40 bg-white/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-maroon md:left-6"
        >
          Music {musicOn ? 'On' : 'Off'}
        </button>
      )}
      <IntroGate open={opened} onOpen={() => setOpened(true)} musicOn={musicOn} onToggleMusic={toggleMusic} />
      <main>
        {opened && (
          <>
            <OurStory />
            <Events />
            <InvitationVideo canPlay={opened} />
            <WhenWhere />
            <Footer />
            <InviteDrawer />
            <Blessings />
          </>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <InviteProvider>
      <Experience />
    </InviteProvider>
  )
}
