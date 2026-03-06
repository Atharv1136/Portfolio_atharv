import { useQuery } from '@tanstack/react-query';
import { HeroSection } from '@/components/ui/3d-hero-section-boxes';

export default function Hero() {
  const { data: aboutData } = useQuery<{ resumeUrl?: string }>({
    queryKey: ['/api/about']
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home">
      <HeroSection
        resumeUrl={aboutData?.resumeUrl}
        onContactClick={scrollToContact}
      />
    </section>
  );
}
