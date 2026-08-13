import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { QuickAccess } from '../components/landing/QuickAccess';
import { Services } from '../components/landing/Services';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AboutLibrary } from '../components/landing/AboutLibrary';
import { CommunityStats } from '../components/landing/CommunityStats';
import { AnnouncementsSection } from '../components/landing/AnnouncementsSection';
import { ContactSection } from '../components/landing/ContactSection';
import { Footer } from '../components/landing/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <QuickAccess />
        <Services />
        <HowItWorks />
        <AboutLibrary />
        <CommunityStats />
        <AnnouncementsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
