'use client';
// app/components/Benefits.tsx

import { motion } from 'framer-motion';

const benefits = [
  {
    icon: '💧',
    title: 'Hydrates Better',
    description:
      'Coconut water\'s natural electrolytes absorb faster than plain water, keeping you energized longer.',
  },
  {
    icon: '🚫',
    title: 'No Artificial Additives',
    description:
      'Every ingredient you see is every ingredient that\'s in it. Nothing more, nothing hidden.',
  },
  {
    icon: '✨',
    title: 'Light & Refreshing',
    description:
      'Lemon and mint create a clean, bright profile that\'s never heavy—perfect from sunrise to sunset.',
  },
  {
    icon: '🌿',
    title: 'Daily Wellness Drink',
    description:
      'Tulsi and coconut water combine ancient Ayurvedic wisdom with modern hydration science.',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Benefits() {
  return (
    <section className="py-28 md:py-36 px-6 relative overflow-hidden bg-[#1a2e1a]">
      {/* Texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #a8d5a2 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      {/* Top highlight */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(168,213,162,0.4), transparent)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span
            className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#a8d5a2] font-semibold mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Why ZenPotion
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Designed for the
            <br />
            <span className="text-[#a8d5a2]">Indian lifestyle.</span>
          </h2>
        </motion.div>

        {/* Benefits grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              variants={itemVariants}
              whileHover={{ scale: 1.03, transition: { duration: 0.25 } }}
              className="group relative rounded-3xl p-8 border border-white/8 cursor-default overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,213,162,0.1) 0%, transparent 60%)' }}
              />

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center text-2xl mb-6 border border-white/10">
                {benefit.icon}
              </div>

              {/* Number */}
              <div
                className="absolute top-7 right-7 text-5xl font-black opacity-[0.05] text-white select-none"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>

              <h3
                className="text-lg font-bold text-white mb-3"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {benefit.title}
              </h3>
              <p
                className="text-sm leading-relaxed text-white/55"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {benefit.description}
              </p>

              {/* Bottom bar on hover */}
              <div
                className="absolute bottom-0 inset-x-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: 'linear-gradient(to right, #5a7a4e, #a8d5a2)' }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Center comparison stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div
            className="inline-block rounded-3xl px-10 py-8 border border-white/10"
            style={{ background: 'rgba(90,122,78,0.2)' }}
          >
            <p
              className="text-5xl font-bold text-[#a8d5a2]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              2× faster
            </p>
            <p
              className="text-white/60 mt-2 text-sm"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              electrolyte absorption vs plain water
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
