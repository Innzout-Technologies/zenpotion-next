'use client';
// app/components/Ingredients.tsx

import { motion } from 'framer-motion';

const ingredients = [
  {
    emoji: '🥥',
    name: 'Coconut Water',
    tagline: 'Natural hydration boost',
    description:
      'Rich in electrolytes, our tender coconut water base replenishes instantly and tastes clean without any processing.',
    color: '#eef7eb',
    accent: '#5a7a4e',
    badge: 'Base Ingredient',
  },
  {
    emoji: '🍋',
    name: 'Lemon',
    tagline: 'Light and refreshing citrus',
    description:
      'Cold-pressed lemon juice adds a bright, zesty note and a powerful dose of vitamin C to fuel your day.',
    color: '#fef9eb',
    accent: '#c9961a',
    badge: 'Vitamin C',
  },
  {
    emoji: '🌿',
    name: 'Mint',
    tagline: 'Cooling and fresh taste',
    description:
      'Spearmint extract brings a clean, cooling finish that makes every sip feel like a breath of fresh air.',
    color: '#ebf7f4',
    accent: '#2a8a74',
    badge: 'Cooling Agent',
  },
  {
    emoji: '🌱',
    name: 'Tulsi',
    tagline: 'Traditional wellness touch',
    description:
      'India\'s sacred herb, tulsi (holy basil), adds a subtle herbal warmth and centuries of Ayurvedic wisdom.',
    color: '#f0ebf7',
    accent: '#6a4a8a',
    badge: 'Ayurvedic',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function Ingredients() {
  return (
    <section
      id="ingredients"
      className="py-28 md:py-36 px-6 bg-[#f8f5ef] relative overflow-hidden"
    >
      {/* Background accent */}
      <div
        className="absolute top-0 inset-x-0 h-px opacity-30"
        style={{
          background: 'linear-gradient(to right, transparent, #5a7a4e, transparent)',
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span
            className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#5a7a4e] font-semibold mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            What's Inside
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2e1a] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Four ingredients.
            <br />
            <span className="text-[#5a7a4e]">Infinite freshness.</span>
          </h2>
          <p
            className="mt-6 text-lg text-[#4a5c44] max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            No fillers, no artificial flavors. Just the cleanest ingredients India has to offer,
            working in harmony.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ingredients.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative rounded-3xl p-7 cursor-default"
              style={{ background: item.color }}
            >
              {/* Badge */}
              <div
                className="absolute top-5 right-5 text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full font-semibold"
                style={{
                  color: item.accent,
                  background: `${item.accent}15`,
                  border: `1px solid ${item.accent}30`,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {item.badge}
              </div>

              {/* Emoji */}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm"
                style={{ background: `${item.accent}18` }}
              >
                {item.emoji}
              </div>

              {/* Content */}
              <h3
                className="text-xl font-bold mb-1"
                style={{
                  color: '#1a2e1a',
                  fontFamily: "'Playfair Display', Georgia, serif",
                }}
              >
                {item.name}
              </h3>
              <p
                className="text-sm font-semibold mb-3"
                style={{ color: item.accent, fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.tagline}
              </p>
              <p
                className="text-sm leading-relaxed text-[#4a5c44]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {item.description}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 inset-x-8 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: item.accent }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-sm text-[#8a9e84]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          🌿 No preservatives · No artificial colors · No added sugar · Vegan &amp; gluten-free
        </motion.p>
      </div>
    </section>
  );
}
