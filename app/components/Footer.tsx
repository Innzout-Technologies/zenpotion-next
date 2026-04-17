// app/components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-[#1a2e1a] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#a8d5a2] flex items-center justify-center text-[#1a2e1a] text-xs font-black"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Z+
              </div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                ZenPotion
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Clean hydration crafted for India's modern lifestyle. Natural ingredients, honest labels.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/70 text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2.5">
              {['Our Story', 'Ingredients', 'Benefits', 'Join Waitlist'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/50 text-sm hover:text-white transition-colors"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/70 text-xs uppercase tracking-widest mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Get In Touch
            </h4>
            <p className="text-white/50 text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              hello@zenpotion.in
            </p>
            <p className="text-white/50 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Made with 💚 in India
            </p>
            <div className="flex gap-3 mt-5">
              {['Instagram', 'Twitter', 'LinkedIn'].map((s) => (
                <a key={s} href="#"
                  className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors border border-white/10 px-3 py-1.5 rounded-full"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            © 2025 ZenPotion · All rights reserved · FSSAI Registered
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service'].map((link) => (
              <a key={link} href="#" className="text-white/30 text-xs hover:text-white/60 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
