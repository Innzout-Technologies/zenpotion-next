'use client';
// app/components/CTA.tsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function CTA() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setFormState('loading');
    setMessage('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setFormState('success');
        setMessage(data.message || "You're on the list!");
        setFormData({ name: '', phone: '', email: '' });
      } else {
        setFormState('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setFormState('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section
      id="cta"
      className="py-28 md:py-36 px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #eef7eb 0%, #f8f5ef 50%, #f0f7e8 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(90,122,78,0.2) 0%, transparent 65%)' }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,150,26,0.2) 0%, transparent 65%)' }}
      />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="inline-block text-[11px] uppercase tracking-[0.25em] text-[#5a7a4e] font-semibold mb-5 bg-[#e8f5e4] px-4 py-2 rounded-full border border-[#c5e0bf]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Limited Early Access
          </span>
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a2e1a] leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Be the first to
            <br />
            <span className="text-[#5a7a4e]">taste ZenPotion.</span>
          </h2>
          <p
            className="mt-5 text-lg text-[#4a5c44] leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Sign up now for exclusive early access, launch-day pricing,
            and a free bottle with your first order.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {formState === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16 bg-white rounded-3xl shadow-sm border border-[#c5e0bf]"
              >
                <div className="text-5xl mb-4">🎉</div>
                <h3
                  className="text-2xl font-bold text-[#1a2e1a] mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  You're in!
                </h3>
                <p
                  className="text-[#4a5c44]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {message}
                </p>
                <button
                  onClick={() => setFormState('idle')}
                  className="mt-6 text-sm text-[#5a7a4e] underline underline-offset-4"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Refer a friend →
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-[#e0ede0] flex flex-col gap-5"
              >
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-widest text-[#5a7a4e] font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Arjun Sharma"
                    required
                    className="w-full px-5 py-4 rounded-2xl border border-[#ddebd8] bg-[#f8fdf7] text-[#1a2e1a] placeholder-[#b0c4ac] focus:outline-none focus:border-[#5a7a4e] focus:ring-2 focus:ring-[#5a7a4e]/20 transition-all text-base"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-widest text-[#5a7a4e] font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8a9e84] text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      pattern="[0-9]{10}"
                      className="w-full pl-14 pr-5 py-4 rounded-2xl border border-[#ddebd8] bg-[#f8fdf7] text-[#1a2e1a] placeholder-[#b0c4ac] focus:outline-none focus:border-[#5a7a4e] focus:ring-2 focus:ring-[#5a7a4e]/20 transition-all text-base"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    className="text-xs uppercase tracking-widest text-[#5a7a4e] font-semibold"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="arjun@email.com"
                    className="w-full px-5 py-4 rounded-2xl border border-[#ddebd8] bg-[#f8fdf7] text-[#1a2e1a] placeholder-[#b0c4ac] focus:outline-none focus:border-[#5a7a4e] focus:ring-2 focus:ring-[#5a7a4e]/20 transition-all text-base"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {formState === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      ⚠️ {message}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formState === 'loading'}
                  className="group relative overflow-hidden bg-[#1a2e1a] text-[#f8f5ef] w-full py-5 rounded-2xl text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:shadow-xl hover:shadow-[#1a2e1a]/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {formState === 'loading' ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Securing your spot…
                      </>
                    ) : (
                      <>
                        Get Early Access
                        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-[#5a7a4e] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>

                <p
                  className="text-center text-xs text-[#a0b09c]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  🔒 No spam. Your info stays with us. Unsubscribe anytime.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
