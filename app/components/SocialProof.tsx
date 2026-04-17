'use client';
// app/components/SocialProof.tsx

import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: 'Finally, a drink that doesn\'t taste like a lab experiment. ZenPotion is the only thing I reach for after my morning run.',
    name: 'Priya M.',
    city: 'Bengaluru',
    role: 'Marathon Runner',
    avatar: 'PM',
  },
  {
    quote: 'The Tulsi note is so subtle and perfect. Feels like something my grandmother would approve of, but in a modern package.',
    name: 'Arjun S.',
    city: 'Mumbai',
    role: 'Yoga Instructor',
    avatar: 'AS',
  },
  {
    quote: 'I\'ve been on the waitlist since day one. This is the kind of product India has been waiting for — clean, honest, local.',
    name: 'Kavya R.',
    city: 'Chennai',
    role: 'Nutritionist',
    avatar: 'KR',
  },
];

export default function SocialProof() {
  return (
    <section className="py-28 md:py-36 px-6 bg-[#f8f5ef] relative overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-px opacity-20"
        style={{ background: 'linear-gradient(to right, transparent, #5a7a4e, transparent)' }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Launch banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-3 bg-[#1a2e1a] text-[#a8d5a2] px-8 py-4 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#a8d5a2] animate-pulse" />
            <span
              className="text-sm font-semibold uppercase tracking-widest"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Launching Soon in India
            </span>
            <span className="w-2 h-2 rounded-full bg-[#a8d5a2] animate-pulse" />
          </div>

          <h2
            className="text-4xl md:text-5xl font-bold text-[#1a2e1a] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Early Access Open.
          </h2>
          <p
            className="mt-4 text-lg text-[#4a5c44] max-w-lg mx-auto"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Join 2,000+ people already on the waitlist across India.
          </p>

          {/* City tags */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Pune', '+more'].map((city) => (
              <span
                key={city}
                className="text-xs bg-[#e8f5e4] text-[#5a7a4e] px-4 py-2 rounded-full border border-[#c5e0bf] font-medium"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                📍 {city}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-8 shadow-sm border border-[#e8f0e6] hover:shadow-md transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-[#c9961a] text-base">★</span>
                  ))}
              </div>

              <p
                className="text-[#2a3e28] leading-relaxed mb-6 text-[15px]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #5a7a4e, #a8d5a2)' }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    className="text-sm font-semibold text-[#1a2e1a]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.name}
                  </p>
                  <p
                    className="text-xs text-[#8a9e84]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {t.role} · {t.city}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-6 mt-14 py-10 border-t border-b border-[#e0ede0]"
        >
          {[
            { n: '2,000+', label: 'On Waitlist' },
            { n: '12', label: 'Cities Represented' },
            { n: '2025', label: 'Launch Year' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-3xl md:text-4xl font-bold text-[#1a2e1a]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {s.n}
              </p>
              <p
                className="text-sm text-[#8a9e84] mt-1 uppercase tracking-widest"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
