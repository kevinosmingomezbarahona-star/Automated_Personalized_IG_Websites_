import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, Prospect } from '../lib/supabase';
import Loader from '../components/Loader';
import VapiCTA from '../components/VapiCTA';
import VapiFAB from '../components/VapiFAB';
import { SplineSceneBasic } from '../components/ui/SplineSceneBasic';
import { Marquee } from '../components/ui/marquee';
import { StickySidebar } from '../components/ui/StickySidebar';
import { ScrollVideoCanvas } from '../components/ui/ScrollVideoCanvas';
import { useDelayedReveal } from '../hooks/useDelayedReveal';
import { Typewriter } from '../components/ui/typewriter';

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

  // ── Headless Browser Optimization (Directive 1) ───────────────────────────
  // Heavy assets (3D bot, ScrollVideoCanvas, Marquee) are withheld from render
  // until 2.5 s after DOM load OR the user's first scroll — whichever is first.
  // This ensures Microlink captures a fast, clean hero screenshot every time.
  const heavyAssetsReady = useDelayedReveal(2500);

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

    const cleanUrl = (url?: string | null) => (url || '').replace(/^=+/, '').trim();
    const screenshotUrl = cleanUrl(prospect.site_screenshot_url);
    const picUrl = cleanUrl(prospect.profilePicUrl || prospect.profile_pic_url);
    const ogImage = screenshotUrl || picUrl;

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
    if (Array.isArray(prospect.post_images)) {
      imagesArray = prospect.post_images;
    } else if (typeof prospect.post_images === 'string' && (prospect.post_images as string).trim() !== '') {
      imagesArray = JSON.parse(prospect.post_images);
    }
    // Ensure we only keep valid strings
    imagesArray = imagesArray.filter(url => typeof url === 'string' && url.includes('http')).map(cleanUrl);
  } catch (e) {
    console.warn("Caught post_images parse error, falling back to empty array.", e);
  }

  // Force Portfolio logic: 6 luxury fallback assets if empty or < 6
  const displayImages = (imagesArray && imagesArray.length >= 6) ? imagesArray : [
    '/placeholders/portfolio-1.png',
    '/placeholders/portfolio-2.png',
    '/placeholders/portfolio-3.png',
    '/placeholders/portfolio-4.png',
    '/placeholders/portfolio-5.png',
    '/placeholders/portfolio-6.png'
  ];


  const vapiTheme = {
    buttonBg: 'from-amber-500 to-amber-700',
    textColorClass: 'text-white',
    accentColorClass: 'text-amber-400',
  };

  return (
    <div className="min-h-screen bg-[#0B132B] text-white font-sans selection:bg-amber-500/30 selection:text-white">

      <StickySidebar />

      {/* ─── Navigation ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-[#0B132B]/80 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
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

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      {/* DIRECTIVE 1: This section is pure HTML/CSS/text — zero render-blocking. */}
      {/* DIRECTIVE 2: Updated H1 + subheader copy pulling companyName dynamically. */}
      <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Ambient glows — static background layers pushed to composite layer to prevent paint blocking */}
        <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-500/[0.07] rounded-full blur-[160px]" style={{ willChange: 'transform, opacity', WebkitBackfaceVisibility: 'hidden' }} />
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[130px]" style={{ willChange: 'transform, opacity', WebkitBackfaceVisibility: 'hidden' }} />
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[130px]" style={{ willChange: 'transform, opacity', WebkitBackfaceVisibility: 'hidden' }} />
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
              style={{ willChange: 'transform, opacity', WebkitBackfaceVisibility: 'hidden' }} // Prevent child repaints internally
            >
              {/* Slow breathing outer glow — Hardware Accelerated Cache to prevent per-frame Gaussian Blur calculations on scale */}
              <motion.div
                className="absolute -inset-6 rounded-full bg-amber-500/20 blur-3xl"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ willChange: 'transform, opacity', WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)' }}
              />
              {/* Hard gold ring */}
              <div className="absolute -inset-[3px] rounded-full bg-gradient-to-br from-amber-400 via-amber-600 to-amber-900 opacity-70 blur-[2px]" />

              <img
                src={profilePic ? ("https://images.weserv.nl/?url=" + encodeURIComponent(profilePic) + "&default=/placeholders/profile-default.png") : "/placeholders/profile-default.png"}
                alt={companyName}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = '/placeholders/profile-default.png';
                }}
                className="relative w-40 h-40 sm:w-56 sm:h-56 lg:w-72 lg:h-72 object-cover rounded-full shadow-2xl shadow-amber-500/20"
              />
            </motion.div>

            {/* ── Unified Massive Hero Header (Directive 1) ── */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium tracking-tight leading-snug text-white max-w-5xl mx-auto min-h-[280px] sm:min-h-[220px] md:min-h-[240px] lg:min-h-[280px] relative w-full flex flex-wrap items-center justify-center text-center overflow-hidden gap-2"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
              variants={fadeUp}
              custom={0.1}
            >
              <span>Hey {companyName}. I have built a custom demand-capture asset that triages inbound traffic for elite real estate teams like yours&nbsp;</span>
              <span className="font-serif italic font-normal text-amber-500 text-center" style={{ marginLeft: '8px' }}>
                <Typewriter text={["24/7.", "while you sleep.", "instantly.", "every single day.", "without taking breaks."]} speed={70} waitTime={2000} />
              </span>
            </motion.h1>

            {/* ── Subheader (Directive 1) ── */}
            <motion.p
              className="text-lg text-slate-300 font-light leading-relaxed max-w-3xl mx-auto"
              variants={fadeUp}
              custom={0.2}
            >
              It will capture high-intent buyers without losing deals to slow response times. We do this through a zero-latency automated qualification layer that seamlessly syncs with your CRM, completely removing human speed and manual follow-ups as a failure point. The next step is calling the demo below to test the latency for yourself.
            </motion.p>

            {/* ── Vapi Buttons (glassmorphic card wrapper) ── */}
            {prospect.vapi_public_key && prospect.vapi_assistant_id && (
              <motion.div
                id="voice-agent-test"
                className="w-full max-w-lg bg-white/[0.04] backdrop-blur-md border border-white/10 rounded-2xl px-8 py-7 shadow-xl shadow-black/30 scroll-mt-32"
                variants={fadeUp}
                custom={0.3}
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
          </motion.div>
        </div>

        {/* Diagonal accent stripe */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/[0.03] -skew-x-12 translate-x-1/2 pointer-events-none" />

        {/* ── Scroll Cue (Directive 3) ── */}
        {/* Fades out once the user scrolls (heavyAssetsReady becomes true) */}
        <AnimatePresence>
          {!heavyAssetsReady && (
            <motion.div
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.4 } }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <span className="text-[10px] tracking-[0.35em] text-amber-400/70 uppercase font-semibold">
                Scroll to Test AI Concierge
              </span>
              <ChevronDown
                className="w-5 h-5 text-amber-400/60 animate-bounce"
                strokeWidth={1.5}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── 3D Robot Assistant (LAZY — Directive 1) ──────────────────── */}
      {/* Withheld from render until 2.5 s post-load OR first scroll.       */}
      {/* Note: no motion.div wrapper — animating around an iframe causes     */}
      {/* duplicate compositing layers. The splite.tsx IntersectionObserver  */}
      {/* handles deferral internally; the card preserves its own height.    */}
      {heavyAssetsReady ? (
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-5xl">
            <SplineSceneBasic
              publicKey={prospect.vapi_public_key || undefined}
              assistantId={prospect.vapi_assistant_id || undefined}
              businessSummary={prospect.business_summary || undefined}
            />
          </div>
        </div>
      ) : (
        // Placeholder preserves layout height so page doesn't jump
        <div className="w-full flex justify-center px-4">
          <div className="w-full max-w-5xl h-[500px]" aria-hidden="true" />
        </div>
      )}

      {/* ─── Scroll Video Canvas Animation (LAZY — Directive 1) ────────── */}
      {/* content-visibility:auto lets the browser skip painting this section  */}
      {/* entirely until it enters the viewport — zero paint cost when above.  */}
      {heavyAssetsReady ? (
        <section
          id="scroll-video-canvas"
          className="relative z-20"
          style={{ contentVisibility: 'auto', willChange: 'transform' }}
        >
          <ScrollVideoCanvas companyName={companyName} />
        </section>
      ) : (
        <div id="scroll-video-canvas" className="relative z-20 h-[50vh]" aria-hidden="true" />
      )}

      {/* ─── Brand & Portfolio Grid (LAZY — Directive 1) ──────────────── */}
      {heavyAssetsReady && (
        <motion.section
          id="ig-portfolio"
          className="py-32 bg-[#07091A] relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
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
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden min-h-[500px] py-4">
              <Marquee pauseOnHover repeat={2} className="[--duration:20s] h-full flex items-center">
                {displayImages.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    className="group relative flex w-72 sm:w-80 lg:w-96 aspect-[4/5] overflow-hidden rounded-sm border border-white/[0.07] hover:border-amber-500/40 transition-colors duration-500"
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
                      src={imageUrl.startsWith('http') ? ("https://images.weserv.nl/?url=" + encodeURIComponent(imageUrl) + "&default=/placeholders/portfolio-" + ((index % 6) + 1) + ".png") : imageUrl}
                      alt={`Brand Post ${index + 1}`}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholders/portfolio-' + ((index % 6) + 1) + '.png';
                      }}
                      className="block w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.06] transition-all duration-700"
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
        </motion.section>
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
