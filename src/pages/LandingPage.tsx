import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, Prospect } from '../lib/supabase';
import Loader from '../components/Loader';
import VapiCTA from '../components/VapiCTA';
import VapiFAB from '../components/VapiFAB';
import { SplineSceneBasic } from '../components/ui/SplineSceneBasic';
import { Marquee } from '../components/ui/marquee';

// ── Reusable animation variants ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

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
      if (error) console.error('Error fetching prospect:', error);
      setProspect(data);
      setLoading(false);
    }
    fetchProspect();
  }, [slug]);

  useEffect(() => {
    if (!prospect) return;

    const fullName = prospect.full_name || prospect.company_name || 'Your Host';
    const title = `${fullName} x CelestIA | Private Demo`;
    const description = prospect.business_summary || `${fullName} — Powered by CelestIA AI.`;

    // Prefer site screenshot; fall back to profile pic
    const cleanUrl = (url?: string | null) => (url || '').replace(/^=+/, '').trim();
    const screenshotUrl = cleanUrl(prospect.site_screenshot_url);
    const picUrl = cleanUrl(prospect.profilePicUrl || prospect.profile_pic_url);
    const ogImage = screenshotUrl || picUrl;

    // Helper: get or create a <meta> tag by property/name attribute
    const setMeta = (attr: 'property' | 'name', key: string, content: string) => {
      let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    document.title = title;
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    return () => {
      // Reset to generic defaults on unmount / slug change
      document.title = 'CelestIA | Private Demo';
    };
  }, [prospect]);

  if (loading) return <Loader />;

  if (!prospect) {
    return (
      <div className="min-h-screen bg-[#0B132B] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-5xl font-serif text-white mb-4">Luxury Real Estate</h1>
          <p className="text-amber-500 text-lg">Premium AI Concierge Experience</p>
        </div>
      </div>
    );
  }

  // ── Safe Fallback Logic ───────────────────────────────────────────────────
  const companyName =
    prospect.company_name?.trim()
      ? prospect.company_name
      : prospect.full_name?.trim()
        ? prospect.full_name
        : 'Exquisite Properties';

  const cleanUrl = (url: string) => url.replace(/^=+/, '').trim();

  const profilePic = cleanUrl(prospect.profilePicUrl || prospect.profile_pic_url || '');

  let imagesArray: string[] = [];
  try {
    const raw = Array.isArray(prospect.post_images)
      ? prospect.post_images
      : JSON.parse(prospect.post_images as unknown as string);
    imagesArray = (raw as string[]).map(cleanUrl).filter(Boolean);
  } catch (e) {
    console.error('Failed to parse post_images:', e);
  }

  const vapiTheme = {
    buttonBg: 'from-amber-500 to-amber-700',
    textColorClass: 'text-white',
    accentColorClass: 'text-amber-400',
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans selection:bg-amber-500/30 selection:text-white">

      {/* ─── Navigation ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B132B]/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo — glassmorphic pill */}
            <div className="text-xl sm:text-2xl font-serif font-light tracking-[0.22em] text-white">
              {companyName.toUpperCase()}
            </div>
            {/* AI badge */}
            <div className="hidden sm:flex items-center gap-2.5 bg-white/5 backdrop-blur-md border border-amber-500/30 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] tracking-[0.25em] text-amber-400 uppercase font-semibold">
                AI Live Demo
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/[0.07] rounded-full blur-[160px]" />
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[130px]" />
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[130px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <motion.div
            className="flex flex-col items-center text-center gap-10"
            variants={stagger}
            initial="hidden"
            animate="show"
          >

            {/* ── Profile Picture ── */}
            <motion.div
              className="relative"
              variants={fadeUp}
              custom={0}
            >
              {/* Slow breathing outer glow */}
              <motion.div
                className="absolute -inset-6 rounded-full bg-amber-500/20 blur-3xl"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Hard gold ring */}
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 opacity-70 blur-[2px]" />

              {profilePic && !imageError ? (
                <img
                  src={profilePic}
                  alt={companyName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const proxy = 'https://wsrv.nl/?url=' + encodeURIComponent(profilePic);
                    if (e.currentTarget.src !== proxy) {
                      e.currentTarget.src = proxy;
                    } else {
                      setImageError(true);
                    }
                  }}
                  className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 object-cover rounded-full border border-amber-500/40 shadow-2xl shadow-amber-500/20"
                />
              ) : (
                <div className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 rounded-full border border-amber-500/40 bg-[#0F1E3A] flex items-center justify-center shadow-2xl shadow-amber-500/20">
                  <span className="text-6xl font-serif text-amber-500">
                    {companyName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>

            {/* ── Eyebrow label ── */}
            <motion.p
              className="text-amber-400/80 text-[11px] tracking-[0.4em] uppercase font-semibold"
              variants={fadeUp}
              custom={0.1}
            >
              Private AI Demo — For {companyName}
            </motion.p>

            {/* ── Headline ── */}
            <motion.h1
              className="text-3xl sm:text-5xl lg:text-6xl font-serif font-light leading-[1.15] text-white max-w-4xl"
              variants={fadeUp}
              custom={0.2}
            >
              Hey{' '}
              <span className="text-amber-400 italic">{companyName}</span>
              , I've built a custom{' '}
              <span className="text-amber-500">AI Receptionist</span>{' '}
              that answers your client calls{' '}
              <span className="italic">24/7.</span>
            </motion.h1>

            {/* ── Subheadline ── */}
            <motion.p
              className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed"
              variants={fadeUp}
              custom={0.3}
            >
              No hold music. No missed leads. Your AI concierge is live right now — test it below.
            </motion.p>

            {/* ── Vapi Buttons (glassmorphic card wrapper) ── */}
            {prospect.vapi_public_key && prospect.vapi_assistant_id && (
              <motion.div
                className="w-full max-w-lg bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl px-8 py-7 shadow-xl shadow-black/30"
                variants={fadeUp}
                custom={0.4}
              >
                <VapiCTA
                  companyName={companyName}
                  publicKey={prospect.vapi_public_key}
                  assistantId={prospect.vapi_assistant_id}
                  phoneNumber={prospect.vapi_phone_number}
                  theme={vapiTheme}
                />
              </motion.div>
            )}

            {/* ── 3D Robot Assistant ── */}
            <motion.div
              className="w-full max-w-lg"
              variants={fadeUp}
              custom={0.5}
            >
              <SplineSceneBasic
                publicKey={prospect.vapi_public_key || undefined}
                assistantId={prospect.vapi_assistant_id || undefined}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Diagonal accent stripe */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/[0.03] -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>

      {/* ─── Brand & Portfolio Grid ───────────────────────────────────── */}
      {imagesArray.length > 0 && (
        <section id="portfolio" className="py-32 bg-[#07091A] relative overflow-hidden">
          {/* Section glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-amber-500 text-[11px] tracking-[0.4em] uppercase mb-5 font-semibold">
                Your Presence
              </p>
              <h2 className="text-4xl sm:text-6xl font-serif font-light text-white">
                Brand &amp; Portfolio
              </h2>
              <div className="mt-6 mx-auto w-16 h-px bg-amber-500/50" />
            </motion.div>

            {/* Marquee Wrapper for Brand & Portfolio Grid */}
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
              <Marquee pauseOnHover className="[--duration:20s]">
                {imagesArray.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    className="group relative w-72 sm:w-80 lg:w-96 aspect-[4/5] overflow-hidden rounded-sm border border-white/[0.07] hover:border-amber-500/40 transition-colors duration-500"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 0.65,
                      ease: [0.22, 1, 0.36, 1],
                      delay: (index % 3) * 0.1,
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Brand Post ${index + 1}`}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const proxy = 'https://wsrv.nl/?url=' + encodeURIComponent(imageUrl);
                        if (e.currentTarget.src !== proxy) {
                          e.currentTarget.src = proxy;
                        }
                      }}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-700"
                    />
                    {/* Hover overlay — glassmorphic */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/95 via-[#0B132B]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-7 backdrop-blur-[1px]">
                      <p className="text-amber-400 text-[10px] tracking-[0.3em] uppercase mb-2 font-semibold">
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
                  </motion.div>
                ))}
              </Marquee>
            </div>
          </div>
        </section>
      )}

      {/* ─── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-[#060810] border-t border-white/[0.06] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] tracking-[0.3em] text-slate-600 uppercase font-light">
            AI Infrastructure by{' '}
            <span className="text-amber-500/80 font-normal tracking-widest">CelestIA</span>
          </p>
        </div>
      </footer>

      {/* ─── Floating Vapi Button ─────────────────────────────────────── */}
      {prospect.vapi_public_key && prospect.vapi_assistant_id && (
        <VapiFAB
          publicKey={prospect.vapi_public_key}
          assistantId={prospect.vapi_assistant_id}
        />
      )}
    </div>
  );
}
