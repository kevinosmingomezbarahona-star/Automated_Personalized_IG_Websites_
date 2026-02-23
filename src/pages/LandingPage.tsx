import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Menu, X, ExternalLink } from 'lucide-react';
import { supabase, Prospect } from '../lib/supabase';
import { getTheme } from '../lib/themes';
import { MagneticText } from '../components/ui/MagneticText';
import Loader from '../components/Loader';
import VapiCTA from '../components/VapiCTA';
import VapiFAB from '../components/VapiFAB';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    async function fetchProspect() {
      if (!slug) return;

      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching prospect:', error);
      }

      setProspect(data);
      setLoading(false);
    }

    fetchProspect();
  }, [slug]);

  useEffect(() => {
    if (prospect?.company_name || prospect?.full_name) {
      const name = prospect.company_name || prospect.full_name;
      document.title = `${name} - Premium Personal Brand`;
    }
  }, [prospect]);

  if (loading) {
    return <Loader />;
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-serif text-[#16213e] mb-4">Premium Template</h1>
          <p className="text-[#1a1a2e]/70 text-lg">This is a demo of our luxury personal brand platform.</p>
        </div>
      </div>
    );
  }

  const theme = getTheme(prospect.niche);
  const heroHeadline = prospect.hero_headline || theme.heroHeadline;
  const companyName = prospect.company_name || prospect.full_name || 'Your Brand';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const bgClass = prospect.niche === 'fitness' ? 'bg-[#050505]' : 'bg-white';
  const navBgClass = prospect.niche === 'fitness' ? 'bg-[#050505]/95 border-[#D4AF37]/20' : 'bg-white/95 border-gray-200';
  const textColorClass = prospect.niche === 'fitness' ? 'text-[#F5F5F5]' : 'text-[#1a1a2e]';
  const accentColorClass = prospect.niche === 'fitness' ? 'text-[#D4AF37]' : 'text-[#16213e]';
  const cardBgClass = prospect.niche === 'fitness' ? 'from-[#1a1a1a] to-[#0a0a0a]' : 'from-[#f5f5f5] to-[#f9f9f9]';
  const cardBorderClass = prospect.niche === 'fitness' ? 'border-[#D4AF37]/20' : 'border-gray-200';
  const hoverBorderClass = prospect.niche === 'fitness' ? 'hover:border-[#D4AF37]/50' : 'hover:border-gray-400';

  const vapiTheme = {
    buttonBg: theme.buttonBg,
    textColorClass,
    accentColorClass,
  };

  return (
    <div className={`min-h-screen ${bgClass} ${textColorClass}`}>
      <nav className={`sticky top-0 z-40 ${navBgClass} backdrop-blur-lg border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className={`text-2xl font-serif font-bold tracking-wide ${accentColorClass}`}>
              {companyName}
            </div>

            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection('services')}
                className={`${textColorClass} ${accentColorClass} transition-colors hover:opacity-80`}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className={`${textColorClass} ${accentColorClass} transition-colors hover:opacity-80`}
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`${textColorClass} ${accentColorClass} transition-colors hover:opacity-80`}
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('hero')}
                className={`bg-gradient-to-r ${theme.buttonBg} ${prospect.niche === 'fitness' ? 'text-[#050505]' : 'text-white'} px-6 py-2 rounded-full font-semibold ${theme.buttonHover} transition-all`}
              >
                Book Consultation
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={accentColorClass}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden border-t ${cardBorderClass} ${prospect.niche === 'fitness' ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => scrollToSection('services')}
                className={`block w-full text-left ${textColorClass} ${accentColorClass} transition-colors py-2 hover:opacity-80`}
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className={`block w-full text-left ${textColorClass} ${accentColorClass} transition-colors py-2 hover:opacity-80`}
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className={`block w-full text-left ${textColorClass} ${accentColorClass} transition-colors py-2 hover:opacity-80`}
              >
                Contact
              </button>
              <button
                onClick={() => scrollToSection('hero')}
                className={`w-full bg-gradient-to-r ${theme.buttonBg} ${prospect.niche === 'fitness' ? 'text-[#050505]' : 'text-white'} px-6 py-3 rounded-full font-semibold`}
              >
                Book Consultation
              </button>
            </div>
          </div>
        )}
      </nav>

      <section id="hero" className={`relative min-h-screen flex items-center`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <div className="min-h-[120px] flex items-center">
                <MagneticText
                  text={companyName.split(' ')[0]}
                  hoverText="ELEVATE"
                  textColor={accentColorClass}
                  hoverColor={prospect.niche === 'fitness' ? 'text-[#050505]' : 'text-white'}
                  className="w-full"
                />
              </div>

              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight ${textColorClass}`}>
                {heroHeadline.split('.')[0]}.
              </h1>

              <p className={`text-lg sm:text-xl ${prospect.niche === 'fitness' ? 'text-[#F5F5F5]/80' : 'text-[#1a1a2e]/70'} leading-relaxed`}>
                {prospect.business_profile || 'Transform your journey with personalized excellence and premium results.'}
              </p>

              <button className={`bg-gradient-to-r ${theme.buttonBg} ${prospect.niche === 'fitness' ? 'text-[#050505]' : 'text-white'} px-8 py-4 rounded-full font-semibold text-lg ${theme.buttonHover} transition-all hover:scale-105`}>
                Start Your Transformation
              </button>
            </div>

            <div className="relative">
              {prospect.niche === 'fitness' && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#C5A028] rounded-3xl blur-3xl opacity-30"></div>
              )}
              <div className="relative">
                {prospect.profilePicUrl && !imageError ? (
                  <img
                    src={prospect.profilePicUrl}
                    alt={companyName}
                    onError={() => setImageError(true)}
                    className={`w-full aspect-[3/4] object-cover rounded-3xl ${prospect.niche === 'fitness' ? 'border-2 border-[#D4AF37]/30' : 'border-2 border-gray-300'} shadow-2xl`}
                  />
                ) : (
                  <div className={`w-full aspect-[3/4] ${prospect.niche === 'fitness' ? 'bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#D4AF37]/30' : 'bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-300'} rounded-3xl flex items-center justify-center`}>
                    <div className="text-center">
                      <div className={`text-6xl font-serif font-bold mb-4 ${accentColorClass}`}>
                        {companyName.charAt(0)}
                      </div>
                      <p className={prospect.niche === 'fitness' ? 'text-[#F5F5F5]/50' : 'text-[#1a1a2e]/50'}>
                        {companyName}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {prospect.vapi_public_key && prospect.vapi_assistant_id && (
        <VapiCTA
          companyName={companyName}
          publicKey={prospect.vapi_public_key}
          assistantId={prospect.vapi_assistant_id}
          phoneNumber={prospect.vapi_phone_number}
          theme={vapiTheme}
        />
      )}

      <section id="services" className={prospect.niche === 'fitness' ? 'py-20 bg-[#0a0a0a]' : 'py-20 bg-gray-50'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-4xl sm:text-5xl font-serif font-bold text-center mb-4 ${textColorClass}`}>
            Why Choose{' '}
            <span className={accentColorClass}>{companyName}?</span>
          </h2>
          <p className={`text-center ${prospect.niche === 'fitness' ? 'text-[#F5F5F5]/60' : 'text-[#1a1a2e]/60'} mb-16 max-w-2xl mx-auto`}>
            Exclusive services designed for those who demand excellence
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {theme.services.map((service, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${cardBgClass} border ${cardBorderClass} rounded-2xl p-8 ${hoverBorderClass} transition-all hover:shadow-xl`}
              >
                <div className={`w-12 h-1 bg-gradient-to-r ${theme.buttonBg} mb-6`}></div>
                <h3 className={`text-2xl font-serif font-bold mb-4 ${textColorClass} hover:${accentColorClass} transition-colors`}>
                  {service.title}
                </h3>
                <p className={`${prospect.niche === 'fitness' ? 'text-[#F5F5F5]/70' : 'text-[#1a1a2e]/70'} leading-relaxed`}>
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {prospect.post_images && prospect.post_images.length > 0 && (
        <section id="portfolio" className={`py-20 ${bgClass}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-4xl sm:text-5xl font-serif font-bold text-center mb-4 ${textColorClass}`}>
              {theme.sectionTitle}
            </h2>
            <p className={`text-center ${prospect.niche === 'fitness' ? 'text-[#F5F5F5]/60' : 'text-[#1a1a2e]/60'} mb-16`}>
              A showcase of transformative work
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {prospect.post_images.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`group relative aspect-square overflow-hidden rounded-2xl border ${prospect.niche === 'fitness' ? 'border-[#D4AF37]/20 hover:border-[#D4AF37]/50' : 'border-gray-300 hover:border-gray-400'} transition-all`}
                >
                  <img
                    src={imageUrl}
                    alt={`Portfolio item ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 ${prospect.niche === 'fitness' ? 'bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent' : 'bg-gradient-to-t from-black via-black/50 to-transparent'} opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6`}>
                    <p className={`${prospect.niche === 'fitness' ? 'text-[#F5F5F5]' : 'text-white'} mb-4 text-sm font-medium`}>
                      Featured Work
                    </p>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 ${accentColorClass} ${prospect.niche === 'fitness' ? 'hover:text-[#F5F5F5]' : 'hover:text-white'} transition-colors`}
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="contact" className={prospect.niche === 'fitness' ? 'py-20 bg-[#0a0a0a]' : 'py-20 bg-gray-50'}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl sm:text-5xl font-serif font-bold mb-6 ${textColorClass}`}>
            Ready to{' '}
            <span className={accentColorClass}>Begin?</span>
          </h2>
          <p className={`text-xl ${prospect.niche === 'fitness' ? 'text-[#F5F5F5]/80' : 'text-[#1a1a2e]/80'} mb-10 max-w-2xl mx-auto`}>
            Take the first step towards exceptional results. Book your exclusive consultation today.
          </p>
          <button className={`bg-gradient-to-r ${theme.buttonBg} ${prospect.niche === 'fitness' ? 'text-[#050505]' : 'text-white'} px-10 py-4 rounded-full font-semibold text-lg ${theme.buttonHover} transition-all hover:scale-105`}>
            Schedule Consultation
          </button>
        </div>
      </section>

      <footer className={`border-t ${prospect.niche === 'fitness' ? 'border-[#D4AF37]/20' : 'border-gray-300'} py-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center ${prospect.niche === 'fitness' ? 'text-[#F5F5F5]/50' : 'text-[#1a1a2e]/50'}`}>
            <p className="mb-2">&copy; {new Date().getFullYear()} {companyName}. All rights reserved.</p>
            <p className="text-sm">
              Powered by{' '}
              <span className={`${accentColorClass} font-semibold`}>CelestIA</span>
            </p>
          </div>
        </div>
      </footer>

      {prospect.vapi_public_key && prospect.vapi_assistant_id && (
        <VapiFAB
          publicKey={prospect.vapi_public_key}
          assistantId={prospect.vapi_assistant_id}
        />
      )}
    </div>
  );
}
