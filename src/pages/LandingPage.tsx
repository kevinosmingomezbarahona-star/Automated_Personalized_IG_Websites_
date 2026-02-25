import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { supabase, Prospect } from '../lib/supabase';
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

  // ── Safe Fallback Logic ──────────────────────────────────────────────────
  const companyName =
    prospect.company_name && prospect.company_name.trim() !== ''
      ? prospect.company_name
      : prospect.full_name && prospect.full_name.trim() !== ''
        ? prospect.full_name
        : 'Exquisite Properties';

  const profilePic = prospect.profilePicUrl || prospect.profile_pic_url || '';


  const vapiTheme = {
    buttonBg: 'from-amber-500 to-amber-700',
    textColorClass: 'text-white',
    accentColorClass: 'text-amber-400',
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans selection:bg-amber-500/30 selection:text-white">

      {/* ─── Navigation (Logo Only) ───────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-[#0B132B]/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="text-2xl font-serif font-light tracking-[0.2em] text-white">
              {companyName.toUpperCase()}
            </div>
            {/* AI Live Demo badge */}
            <div className="hidden sm:flex items-center gap-2 border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs tracking-widest text-amber-400 uppercase font-medium">AI Live Demo</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/8 rounded-full blur-[140px]" />
          <div className="absolute top-1/4 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="flex flex-col items-center text-center gap-10">

            {/* ── Profile Picture (Central Visual) ── */}
            <div className="relative">
              {/* Gold glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-br from-amber-400/40 via-amber-600/20 to-transparent blur-2xl" />
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-500/50 to-amber-700/30 blur-md" />
              {profilePic && !imageError ? (
                <img
                  src={profilePic}
                  alt={companyName}
                  onError={() => setImageError(true)}
                  className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 object-cover rounded-full border-2 border-amber-500/60 shadow-2xl shadow-amber-500/30"
                />
              ) : (
                <div className="relative w-40 h-40 sm:w-52 sm:h-52 lg:w-64 lg:h-64 rounded-full border-2 border-amber-500/60 bg-[#0F1E3A] flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <span className="text-5xl font-serif text-amber-500">
                    {companyName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* ── Intro Text ── */}
            <div className="space-y-5 max-w-3xl">
              <p className="text-amber-400 text-sm tracking-[0.3em] uppercase font-medium">
                Private AI Demo — For {companyName}
              </p>

              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif font-light leading-tight text-white">
                Hey{' '}
                <span className="text-amber-400">{companyName}</span>
                , I've built a custom{' '}
                <span className="text-amber-500">AI Receptionist</span>{' '}
                that answers your client calls{' '}
                <span className="italic">24/7.</span>
              </h1>

              <p className="text-slate-400 text-lg font-sans max-w-xl mx-auto leading-relaxed">
                No hold music. No missed leads. Your AI concierge is live right now — test it below.
              </p>
            </div>

            {/* ── Live Vapi Buttons (inline in Hero) ── */}
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
        </div>

        {/* Subtle diagonal accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>



      {/* ─── Brand & Portfolio Grid ───────────────────────────────── */}
      {prospect.post_images && prospect.post_images.length > 0 && (
        <section id="portfolio" className="py-32 bg-[#07091A]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <p className="text-amber-500 text-sm tracking-[0.3em] uppercase mb-6 font-medium">
                Your Presence
              </p>
              <h2 className="text-4xl sm:text-6xl font-serif font-light text-white">
                Brand &amp; Portfolio
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {prospect.post_images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/5] overflow-hidden border border-amber-500/20 hover:border-amber-500/60 transition-colors duration-500"
                >
                  <img
                    src={imageUrl}
                    alt={`Brand Post ${index + 1}`}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <p className="text-amber-400 text-xs tracking-[0.2em] uppercase mb-2 font-medium">
                      Brand Content
                    </p>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      <span>View Post</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-[#060810] border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm tracking-[0.2em] text-slate-500 uppercase font-light">
            AI Infrastructure by{' '}
            <span className="text-amber-500 font-normal tracking-widest">CelestIA</span>
          </p>
        </div>
      </footer>

      {/* ─── Floating Vapi Button ────────────────────────────────── */}
      {prospect.vapi_public_key && prospect.vapi_assistant_id && (
        <VapiFAB
          publicKey={prospect.vapi_public_key}
          assistantId={prospect.vapi_assistant_id}
        />
      )}
    </div>
  );
}
