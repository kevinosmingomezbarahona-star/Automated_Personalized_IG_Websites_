import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { supabase, Prospect } from '../lib/supabase';
import { MagneticText } from '../components/ui/MagneticText';
import Loader from '../components/Loader';
import VapiCTA from '../components/VapiCTA';
import VapiFAB from '../components/VapiFAB';

export default function LandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(true);
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
    const name = prospect?.company_name || prospect?.full_name;
    if (name) {
      document.title = `${name} — AI-Powered Real Estate`;
    }
  }, [prospect]);

  if (loading) {
    return <Loader />;
  }

  if (!prospect) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-serif text-white mb-4">Luxury Real Estate</h1>
          <p className="text-amber-500 text-lg font-sans">Premium AI Concierge Experience</p>
        </div>
      </div>
    );
  }

  const companyName = prospect.company_name || prospect.full_name || 'Exquisite Properties';
  const headline = prospect.company_name || prospect.full_name || 'Defining Luxury Real Estate';
  const biography =
    prospect.business_profile ||
    'Dedicated to delivering unparalleled real estate experiences powered by cutting-edge AI technology.';

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const vapiTheme = {
    buttonBg: 'from-amber-500 to-amber-700',
    textColorClass: 'text-white',
    accentColorClass: 'text-amber-400',
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans selection:bg-amber-500/30 selection:text-white">

      {/* ─── Navigation (Logo Only) ─────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-[#0B132B]/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-serif font-light tracking-[0.2em] text-white">
              {companyName.toUpperCase()}
            </div>
            {/* AI badge */}
            <div className="hidden sm:flex items-center gap-2 border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs tracking-widest text-amber-400 uppercase font-medium">AI Live Demo</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section id="hero" className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-10">
              <div className="min-h-[100px] flex items-center">
                <MagneticText
                  text={companyName.split(' ')[0]}
                  hoverText="ESTATE"
                  textColor="text-amber-500"
                  hoverColor="text-white"
                  className="w-full"
                />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-light leading-tight">
                {headline}<span className="text-amber-500">.</span>
              </h1>

              <p className="text-lg text-slate-300 leading-relaxed font-sans max-w-lg">
                {biography}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => scrollToSection('vapi-cta')}
                  className="bg-amber-500 text-black px-10 py-4 text-sm tracking-widest font-semibold hover:bg-amber-400 transition-all uppercase shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40"
                >
                  Test AI Receptionist
                </button>
                <button
                  onClick={() => scrollToSection('portfolio')}
                  className="border border-amber-500/40 text-white px-10 py-4 text-sm tracking-widest font-medium hover:bg-amber-500/10 transition-all uppercase"
                >
                  View Property Data
                </button>
              </div>
            </div>

            {/* Profile Image */}
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-500/10 blur-3xl rounded-full" />
              <div className="relative">
                {prospect.profilePicUrl && !imageError ? (
                  <img
                    src={prospect.profilePicUrl}
                    alt={companyName}
                    onError={() => setImageError(true)}
                    className="w-full aspect-[4/5] object-cover rounded-sm hover:scale-[1.02] transition-transform duration-700 border border-amber-500/20 shadow-2xl shadow-amber-500/10"
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal accent stripe */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>

      {/* ─── Vapi CTA Section ───────────────────────────────────── */}
      <div id="vapi-cta">
        {prospect.vapi_public_key && prospect.vapi_assistant_id && (
          <VapiCTA
            companyName={companyName}
            publicKey={prospect.vapi_public_key}
            assistantId={prospect.vapi_assistant_id}
            phoneNumber={prospect.vapi_phone_number}
            theme={vapiTheme}
          />
        )}
      </div>

      {/* ─── Property Image Grid ───────────────────────────────── */}
      {prospect.post_images && prospect.post_images.length > 0 && (
        <section id="portfolio" className="py-32 bg-[#07091A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <h2 className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-6 font-medium">
                The Collection
              </h2>
              <h3 className="text-4xl sm:text-6xl font-serif font-light text-white">
                Curated Residences
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {prospect.post_images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/5] overflow-hidden border border-amber-500/20 hover:border-amber-500/60 transition-colors duration-500"
                >
                  <img
                    src={imageUrl}
                    alt={`Luxury Property ${index + 1}`}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <p className="text-amber-400 text-xs tracking-[0.2em] uppercase mb-2 font-medium">
                      Exquisite Dwelling
                    </p>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      <span>Explore Detail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ────────────────────────────────────────────── */}
      <footer className="bg-[#060810] border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-serif tracking-[0.2em] font-light text-white">
              {companyName.toUpperCase()}
            </div>

            <div className="flex flex-col items-center gap-1">
              <p className="text-xs tracking-[0.2em] text-slate-500 uppercase font-light">
                &copy; {new Date().getFullYear()} {companyName}
              </p>
              <p className="text-[10px] tracking-[0.15em] uppercase text-slate-600 font-light">
                Powered by{' '}
                <span className="text-amber-500 font-normal">CelestIA</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── Floating Vapi Button ───────────────────────────────── */}
      {prospect.vapi_public_key && prospect.vapi_assistant_id && (
        <VapiFAB
          publicKey={prospect.vapi_public_key}
          assistantId={prospect.vapi_assistant_id}
        />
      )}
    </div>
  );
}
