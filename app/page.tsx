// app/page.tsx
import Hero from './components/Hero';
import ParallaxSection from './components/ParallaxSection';
import Ingredients from './components/Ingredients';
import Benefits from './components/Benefits';
import SocialProof from './components/SocialProof';
import CTA from './components/CTA';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import GameSection from './components/GameSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ParallaxSection />
      <Ingredients />
      <section id="benefits">
        <Benefits />
      </section>
      <GameSection />
      <SocialProof />
      <CTA />
      <Footer />
    </main>
  );
}
