export const COUPLE = {
  bride: 'Asritha',
  groom: 'Rakesh',
  initials: 'A · R',
  tagline: 'You are invited to our lifetime celebrations',
  weddingDate: 'Thursday, 27 August 2026',
  weddingTime: '11:20 AM',
  countdownTarget: '2026-08-27T11:20:00+05:30',
}

export const FAMILIES = {
  bride: {
    house: 'Hanumandlakadi',
    line: "Hanumandlakadi's Family, with near & dear",
  },
  groom: {
    house: "Nayini",
    line: "Nayini's Family, with near & dear",
  },
}

export type InviteSide = 'bride' | 'groom'

export const VENUES = {
  haldiBride: {
    name: 'Gudikandhula',
    label: 'Haldi',
    when: 'Tuesday, 25 August · 5:00 PM',
    address: 'Gudikandhula, Siddipet',
    mapsUrl: 'https://maps.app.goo.gl/npVgbeCLmuPMciJN9?g_st=ac',
  },
  gajwel: {
    name: 'Vemulaghat',
    label: 'Haldi',
    when: 'Tuesday, 25 August · 4:00 PM',
    address: 'Vemulaghat · Gajwel',
    mapsUrl: 'https://maps.app.goo.gl/L1LwdfKDJLFE3jrh7?g_st=ac',
  },
  siddipet: {
    name: 'Padmanayaka Gardens',
    label: 'Wedding',
    when: 'Thursday, 27 August · 11:20 AM',
    address: 'Siddipet',
    mapsUrl: 'https://maps.app.goo.gl/URyDw2uuVgPUronv7?g_st=ac',
  },
  reception: {
    name: 'S Convention Hall',
    label: 'Reception',
    when: 'Sunday, 30 August · 6:30 PM',
    address: 'Gajwel',
    mapsUrl: 'https://maps.app.goo.gl/LM6dectcE6dkGxUJ6?g_st=ac',
  },
}

export type EventRevealType = 'scratch' | 'envelope' | 'knot' | 'lantern' | 'toast'

export interface WeddingEvent {
  id: string
  title: string
  date: string
  time: string
  venue: string
  description: string
  whisper: string
  dressCode?: string
  revealType: EventRevealType
  accent: string
  sides: InviteSide[]
}

export const EVENTS: WeddingEvent[] = [
  {
    id: 'haldi-bride',
    title: 'Haldi',
    date: 'Tuesday, 25 August 2026',
    time: '5:00 PM',
    venue: 'Gudikandhula, Siddipet',
    description: 'A blessing at home, with family and near & dear.',
    whisper: 'Rub the gold with your finger, like a lottery ticket',
    revealType: 'scratch',
    accent: '#D4A017',
    sides: ['bride'],
  },
  {
    id: 'haldi-groom',
    title: 'Haldi',
    date: 'Tuesday, 25 August 2026',
    time: '4:00 PM',
    venue: 'Vemulaghat, Gajwel',
    description: 'A blessing at home, with family and near & dear.',
    whisper: 'Rub the gold with your finger, like a lottery ticket',
    revealType: 'scratch',
    accent: '#D4A017',
    sides: ['groom'],
  },
  {
    id: 'wedding-bride',
    title: 'Wedding',
    date: 'Thursday, 27 August 2026',
    time: '11:20 AM',
    venue: 'Padmanayaka Gardens, Siddipet',
    description: 'Sumuhurtham at 11:20 in the morning — Thula Lagnam, Dhanishta Nakshatra. Two families. One promise.',
    whisper: 'Tap the threads to tie the knot',
    revealType: 'knot',
    accent: '#B76E79',
    sides: ['bride'],
  },
  {
    id: 'wedding-groom',
    title: 'Wedding',
    date: 'Thursday, 27 August 2026',
    time: '11:20 AM',
    venue: 'Padmanayaka Gardens, Siddipet',
    description: 'Sumuhurtham at 11:20 in the morning — Thula Lagnam, Dhanishta Nakshatra. Two families. One promise.',
    whisper: 'Tap the threads to tie the knot',
    revealType: 'knot',
    accent: '#C9A962',
    sides: ['groom'],
  },
  {
    id: 'reception-bride',
    title: 'Reception',
    date: 'Sunday, 30 August 2026',
    time: '6:30 PM',
    venue: 'S Convention Hall, Gajwel',
    description: 'The joy we saved for last — light, music, and a night to celebrate with you.',
    whisper: 'Tap the two glasses to toast',
    revealType: 'toast',
    accent: '#C47A84',
    sides: ['bride'],
  },
  {
    id: 'reception-groom',
    title: 'Reception',
    date: 'Sunday, 30 August 2026',
    time: '6:30 PM',
    venue: 'S Convention Hall, Gajwel',
    description: 'The joy we saved for last — light, music, and a night to celebrate with you.',
    whisper: 'Tap the two glasses to toast',
    revealType: 'toast',
    accent: '#C4A35A',
    sides: ['groom'],
  },
]

export function eventsFor(side: InviteSide) {
  return EVENTS.filter((e) => e.sides.includes(side))
}

export function introImagesFor(side: InviteSide) {
  return [
    { slug: side === 'bride' ? 'slide-0-bride' : 'slide-0-groom', alt: 'Opening' },
    { slug: 'slide-1', alt: 'Slide 1' },
    { slug: 'slide-2', alt: 'Slide 2' },
    { slug: 'slide-3', alt: 'Slide 3' },
    { slug: 'slide-4', alt: 'Slide 4' },
  ]
}

export type StoryImage = string | Record<InviteSide, string>

export function storyImageSlug(image: StoryImage, side: InviteSide) {
  return typeof image === 'string' ? image : image[side]
}

export const STORY_CHAPTERS: Array<{
  id: string
  image: StoryImage
  kicker: string
  title: string
  text: string
  frame: '3/2' | '3/4'
}> = [
  {
    id: 'beginning',
    image: { bride: 'engagement-bride', groom: 'engagement-groom' },
    kicker: 'The beginning',
    title: 'A glance that stayed',
    text: 'It began with family around us — a smile, a promise, and the feeling that home had found a name. We are so glad you are here to see it.',
    frame: '3/2',
  },
  {
    id: 'promise',
    image: 'story-wedding',
    kicker: 'The vow',
    title: 'A promise for forever',
    text: 'Not a grand speech. Just two hearts choosing each other — and a day that feels complete when you are with us.',
    frame: '3/4',
  },
  {
    id: 'celebration',
    image: 'story-reception',
    kicker: 'The joy',
    title: 'A celebration with everyone we love',
    text: 'On 30 August we gather again. Please keep going — your presence is one of the gifts we are waiting for.',
    frame: '3/4',
  },
]

export const NAV_SECTIONS = [
  { id: 'story', label: 'Story' },
  { id: 'events', label: 'Events' },
  { id: 'video', label: 'Glimpse' },
  { id: 'when', label: 'When' },
]

export const VIDEOS = {
  bride: { id: 'asritha', title: 'Asritha', src: 'assets/video/asritha-web.mp4' },
  groom: { id: 'rakesh', title: 'Rakesh', src: 'assets/video/rakesh-reddy-web.mp4' },
}

export const BLESSINGS = ['శుభమస్తు', 'శ్రీరస్తు', 'కల్యాణమస్తు']

export const PHOTO_CREDIT = 'The Pixel Photography'

export const MUHURTHAM = {
  title: 'Sumuhurtham',
  time: '11:20 AM',
  lagnam: 'Thula Lagnam',
  nakshatra: 'Dhanishta Nakshatra',
  tithi: 'Shravana Shukla Chaturdashi',
  year: 'Parabhava Nama Samvatsara',
  line: '11:20 AM · Thula Lagnam · Dhanishta Nakshatra',
}

export interface FamilyGroup {
  label: string
  lines: string[]
}

export interface FamilyPage {
  kicker: string
  title: string
  village: string
  groups: FamilyGroup[]
  littleOnes?: { names: string; note: string }
  favourite?: string
  thanks?: string
}

export const FAMILY_PAGES: Record<InviteSide, FamilyPage> = {
  bride: {
    kicker: 'Hanumandlakadi family',
    title: 'With our people',
    village: 'Gudikandula, Thoguta · Siddipet',
    groups: [
      {
        label: 'Invited by',
        lines: [
          'Smt. & Sri Hanumandlakadi Ranamma & Sudhakar Reddy',
          'Smt. & Sri Hanumandlakadi Vinoda & Ravinder Reddy',
        ],
      },
      {
        label: 'Divine blessings',
        lines: ['Late Hanumandlakadi Shyamala & Late Shiva Reddy'],
      },
      {
        label: 'Blessings',
        lines: ['Smt. Mallaiahgari Ratnamma & Late Shiva Reddy'],
      },
      {
        label: 'Family',
        lines: [
          'Pavani & Akhil',
          'Rachana & Pavan, with Junnu & Dolu',
          'Ritu',
        ],
      },
    ],
    favourite:
      "With love for Swapna Akka & Reshma — the bride's favourites, who have helped so much with this wedding.",
  },
  groom: {
    kicker: 'Nayini family',
    title: 'With our people',
    village: 'Vemulaghat, Gajwel · Siddipet',
    groups: [
      {
        label: 'Invited by',
        lines: [
          'Smt. & Sri Nayini Venkatalaxmi & Mallareddy',
          'Smt. & Sri Udara Navya & Mahender Reddy',
          'Smt. & Sri Nayini Pragathi & Narender Reddy',
        ],
      },
    ],
    littleOnes: {
      names: 'Vihaan · Arnika · Arshik',
      note: 'Vihaan, just forty-five days new, already our littlest guest of honour — with Arnika & Arshik beside him.',
    },
    thanks:
      "With special thanks to every Nayini family member, and our cousin brothers, for standing with us in this joy.",
  },
}
