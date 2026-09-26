/**
 * All sample clinic content in one file: name, contact details, hours,
 * services, team, reviews and FAQs. Swap this file to re-skin the site for a
 * different clinic. Everything here is FICTIONAL (555 phone numbers, sample
 * address) - this is a demo website.
 *
 * Photos live in /public/images (free Unsplash licence; credits in README.md).
 */

export const CLINIC = {
  name: 'Tiny Teeth',
  fullName: 'Tiny Teeth Pediatric Dentistry',
  tagline: 'Pediatric Dentistry',
  phone: '(713) 555-0142',
  phoneHref: 'tel:+17135550142',
  email: 'hello@tinyteeth.example',
  address: ['2400 Sample Blvd, Suite 120', 'Houston, TX 77006'],
  // OpenStreetMap embed around Montrose, Houston (sample location).
  mapEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=-95.4020%2C29.7380%2C-95.3780%2C29.7530&layer=mapnik&marker=29.7455%2C-95.3900',
  mapLink: 'https://www.openstreetmap.org/?mlat=29.7455&mlon=-95.3900#map=16/29.7455/-95.3900',
  hours: [
    ['Monday – Wednesday', '9:00 am – 5:00 pm'],
    ['Thursday', '9:00 am – 7:00 pm'],
    ['Friday', '9:00 am – 5:00 pm'],
    ['Saturday', '9:00 am – 1:00 pm'],
    ['Sunday', 'Closed'],
  ] as const,
  doctor: {
    name: 'Dr. Maya Okafor, DDS',
    title: 'Board-Certified Pediatric Dentist · Clinical Director',
    bio: 'Dr. Okafor completed her pediatric dentistry residency at a leading children’s hospital and has cared exclusively for children for over twelve years. She leads a team trained in behaviour guidance, sedation safety and care for children with special healthcare needs.',
    credentials: [
      'Diplomate, American Board of Pediatric Dentistry',
      'Member, American Academy of Pediatric Dentistry',
      'Certified in nitrous oxide and minimal sedation',
      'Pediatric Advanced Life Support (PALS)',
    ],
  },
}

export type ServiceId = 'checkup' | 'first-visit' | 'sealants' | 'fillings' | 'orthodontics' | 'emergency'

export const SERVICES: { id: ServiceId; title: string; blurb: string; image: string }[] = [
  {
    id: 'checkup',
    title: 'Check-ups & Cleanings',
    blurb: 'Six-monthly exams, gentle cleanings, fluoride and digital X-rays only when needed.',
    image: '/images/svc-checkup.jpg',
  },
  {
    id: 'first-visit',
    title: 'Infant & First Visits',
    blurb: 'A calm first appointment by age one, with guidance on teething, feeding and brushing.',
    image: '/images/svc-first-visit.jpg',
  },
  {
    id: 'sealants',
    title: 'Sealants & Prevention',
    blurb: 'Protective sealants on back teeth and personalised cavity-risk plans for every child.',
    image: '/images/svc-sealants.jpg',
  },
  {
    id: 'fillings',
    title: 'Tooth-Coloured Fillings',
    blurb: 'Mercury-free restorations placed comfortably, with nitrous oxide available.',
    image: '/images/svc-fillings.jpg',
  },
  {
    id: 'orthodontics',
    title: 'Early Orthodontic Care',
    blurb: 'Bite and growth assessments from age seven, with referral for braces when appropriate.',
    image: '/images/svc-orthodontics.jpg',
  },
  {
    id: 'emergency',
    title: 'Emergency Dental Care',
    blurb: 'Same-day appointments for toothache, chipped or knocked-out teeth and injuries.',
    image: '/images/svc-emergency.jpg',
  },
]

export type Testimonial = { name: string; detail: string; quote: string }

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya S.',
    detail: 'Parent of a 5-year-old',
    quote:
      'Our son was very anxious after a bad experience elsewhere. The team took their time, explained every step, and he now looks forward to his check-ups.',
  },
  {
    name: 'Marcus T.',
    detail: 'Parent of twins',
    quote:
      'Booking both children back-to-back on a Thursday evening meant no missed school. Friendly front desk and clear explanations of the treatment plan.',
  },
  {
    name: 'Elena R.',
    detail: 'Parent of a 3-year-old',
    quote:
      'Dr. Okafor was wonderful with our daughter. Everything was clean, calm and on time, and we left with practical advice we could actually use at home.',
  },
]

export const FAQS: { q: string; a: string }[] = [
  {
    q: 'When should my child first see a dentist?',
    a: 'The American Academy of Pediatric Dentistry recommends a first visit by the first birthday or within six months of the first tooth appearing. Early visits focus on prevention and helping your child feel comfortable.',
  },
  {
    q: 'Do you accept insurance?',
    a: 'We accept most PPO dental plans as well as Texas Medicaid and CHIP. Our team will verify your benefits before the appointment. For families without insurance we offer a simple in-house membership plan.',
  },
  {
    q: 'Can I stay with my child during the appointment?',
    a: 'Yes. Parents and guardians are welcome in the treatment room for every visit. For some older children we may suggest a short period of independence once trust is established.',
  },
  {
    q: 'What should I do in a dental emergency?',
    a: 'Call us straight away. We keep same-day slots for emergencies. If a permanent tooth is knocked out, gently rinse it, keep it in milk and come in immediately.',
  },
  {
    q: 'Do you see children with special healthcare needs?',
    a: 'Absolutely. We offer longer appointments, a quiet room, and care plans developed together with families and, where helpful, the child’s other healthcare providers.',
  },
]

export const STATS = [
  { value: '12+', label: 'Years caring for children' },
  { value: '2,400+', label: 'Patients in our practice' },
  { value: '4.9', label: 'Average Google rating' },
  { value: 'Same day', label: 'Emergency appointments' },
]
