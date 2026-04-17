'use client';
// app/components/Navbar.tsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#f8f5ef]/90 backdrop-blur-xl shadow-sm border-b border-[#e0ede0]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        >
          <div
            className="w-8 h-8 rounded-full bg-[#1a2e1a] flex items-center justify-center text-[#a8d5a2] text-xs font-black"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Z+
          </div>
          <span
            className="text-[#1a2e1a] font-bold text-lg tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            ZenPotion
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Ingredients', id: 'ingredients' },
            { label: 'Benefits', id: 'benefits' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-[#4a5c44] hover:text-[#1a2e1a] transition-colors font-medium"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('cta')}
            className="bg-[#1a2e1a] text-[#f8f5ef] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#5a7a4e] transition-colors"
            style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em' }}
          >
            Join Waitlist
          </button>
        </nav>

        {/* Mobile menu btn */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-5 h-0.5 bg-[#1a2e1a] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#1a2e1a] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-0.5 bg-[#1a2e1a] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#f8f5ef] border-t border-[#e0ede0] overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {['ingredients', 'benefits'].map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-left text-base text-[#4a5c44] capitalize py-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {id}
                </button>
              ))}
              <button
                onClick={() => scrollTo('cta')}
                className="bg-[#1a2e1a] text-[#f8f5ef] py-3 rounded-full text-sm font-semibold"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Join Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
