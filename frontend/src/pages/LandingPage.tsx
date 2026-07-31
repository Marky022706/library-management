import React from 'react';
import { Header } from '../components/Header';
import { HeroSection } from '../components/HeroSection';
import { FeatureCards } from '../components/FeatureCards';
import { HowItWorks } from '../components/HowItWorks';
import { AboutUsSection } from '../components/AboutUsSection';
import { ContactUsSection } from '../components/ContactUsSection';
import { Footer } from '../components/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flexGrow: 1 }}>
        <HeroSection />
        <FeatureCards />
        <HowItWorks />
        <AboutUsSection />
        <ContactUsSection />
      </main>
      <Footer />
    </div>
  );
};
