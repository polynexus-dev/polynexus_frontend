import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CheckCircle,
  Users,
  Mail,
  Lock,
  FileText,
  Calendar,
  Video,
  HardDrive
} from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface CardData {
  icon: React.ReactNode;
  title: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  specs: string[];
  note: string;
}

function FeatureCard({ card, index }: { card: CardData; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    glowRef.current.style.background = `radial-gradient(350px circle at ${x}px ${y}px, ${card.accent}12, transparent 80%)`;
  }, [card.accent]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (glowRef.current) {
      glowRef.current.style.background = 'transparent';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl flex flex-col justify-between overflow-hidden will-change-transform"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
        boxShadow: isHovered
          ? `0 20px 60px -15px ${card.accent}20, 0 8px 20px -8px rgba(0,0,0,0.08)`
          : '0 1px 3px rgba(0,0,0,0.04)',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${isHovered ? card.accent + '30' : 'rgba(226,232,240,0.8)'}`,
      }}
    >
      {/* Accent top-bar */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
          transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          transformOrigin: 'center',
        }}
      />

      {/* Cursor-following glow overlay */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{ transition: 'background 0.15s ease' }}
      />

      {/* Card content */}
      <div className="relative z-10 p-8">
        <div className="flex items-center gap-3.5 mb-6">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: card.accentBg,
              border: `1px solid ${card.accentBorder}`,
              color: card.accent,
              transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
              transform: isHovered ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0deg)',
              boxShadow: isHovered ? `0 4px 15px ${card.accent}25` : 'none',
            }}
          >
            {card.icon}
          </div>
          <h3 className="text-lg font-bold font-display text-[#010B33]">{card.title}</h3>
        </div>

        <ul className="space-y-3.5 mb-8">
          {card.specs.map((spec, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-xs text-slate-600"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(-8px)',
                transition: `opacity 0.5s ease ${index * 120 + i * 80}ms, transform 0.5s ease ${index * 120 + i * 80}ms`,
              }}
            >
              <CheckCircle
                className="w-4 h-4 flex-shrink-0 mt-0.5"
                style={{
                  color: card.accent,
                  transition: 'transform 0.3s ease',
                  transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                }}
              />
              {spec}
            </li>
          ))}
        </ul>
      </div>

      {/* Security note footer */}
      <div className="relative z-10 px-8 pb-8 mt-auto">
        <div
          className="rounded-2xl p-5"
          style={{
            background: isHovered ? `${card.accent}08` : 'rgb(248,250,252)',
            border: `1px solid ${isHovered ? card.accent + '20' : 'rgb(241,245,249)'}`,
            transition: 'background 0.4s ease, border-color 0.4s ease',
          }}
        >
          <span
            className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color: card.accent }}
          >
            🛡️ Security Focus
          </span>
          <p className="text-[11px] leading-relaxed text-slate-500">{card.note}</p>
        </div>
      </div>
    </div>
  );
}

export default function PolyMX() {
  const [users, setUsers] = useState<number>(50);
  const [quota, setQuota] = useState<number>(5); // GB per user
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const isAnnual = billingPeriod === 'annual';

  // Starter rate definitions (Competing aggressively with Google/Zoho)
  const starterBasePrice = isAnnual ? 790.00 : 99.00;
  const starterTotal = users * starterBasePrice;

  // Professional rate definitions
  const proBasePrice = isAnnual ? 1990.00 : 249.00;
  const proTotal = users * proBasePrice;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-[#010B33] font-sans antialiased selection:bg-[#45C7AC]/30">
      <Header />

      {/* Hero section */}
      <section className="relative pt-40 pb-20 overflow-hidden bg-gradient-to-b from-slate-100 via-slate-50 to-slate-50">
        {/* Soft abstract blur halos */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#45C7AC]/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#010B33]/5 border border-[#010B33]/10 text-[#010B33] text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 bg-[#45C7AC] rounded-full animate-pulse" />
            SaaS Collaboration Suite
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-display mb-6 text-[#010B33] leading-none">
            Secure Collaboration with <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#010B33] via-blue-900 to-[#45C7AC] bg-clip-text text-transparent">
              PolyMX Suite
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-650 font-light leading-relaxed mb-10">
            Our own secure workspace alternative to Google and Zoho. Complete mail server, cloud storage, calendar, video meetings, and collaborative document editing — encrypted at rest and shielded by design.
          </p>
        </div>
      </section>

      {/* 6 Core Pillars Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-[#45C7AC] uppercase tracking-widest bg-[#45C7AC]/10 px-3.5 py-1.5 rounded-full">
            Key Products Included
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl text-[#010B33] mt-4 mb-4">
            Five Modules, Zero Compromise
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            PolyMX integrates all productivity essentials into a single, hardened stack under your custom domain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Mail className="w-5 h-5" />,
              title: 'Hardened Webmail',
              accent: '#3b82f6',
              accentBg: 'rgba(59,130,246,0.08)',
              accentBorder: 'rgba(59,130,246,0.15)',
              specs: [
                'Highly secure email exchange with private transmission routing.',
                'Advanced domain verification signatures to protect sender trust.',
                'Built-in intelligent message filtering, anti-spoofing, and quarantine guards.',
                'Fully integrated webmail interface with multiple profile logging.'
              ],
              note: 'Standard mail hosts often log transmission parameters in plain text. PolyMX seals transmission routes and structures message indexes using secure cryptographic hashes.'
            },
            {
              icon: <HardDrive className="w-5 h-5" />,
              title: 'PolyMX Drive',
              accent: '#10b981',
              accentBg: 'rgba(16,185,129,0.08)',
              accentBorder: 'rgba(16,185,129,0.15)',
              specs: [
                'Isolated organization directory structures preventing cross-tenant leaks.',
                'Secure link generation with expiry parameters and download controls.',
                'Instant drag-and-drop file uploading and version tracking.',
                'Advanced content searches within document indexes.'
              ],
              note: 'Traditional cloud storage reserves access key sets. PolyMX implements tenant-level segregation guarantees, ensuring administrators cannot peek into user drive vaults.'
            },
            {
              icon: <FileText className="w-5 h-5" />,
              title: 'Collaborative Office',
              accent: '#f59e0b',
              accentBg: 'rgba(245,158,11,0.08)',
              accentBorder: 'rgba(245,158,11,0.15)',
              specs: [
                'Real-time document writing and concurrent edits directly in-browser.',
                'Spreadsheet editor with custom functional matrices and data logs.',
                'Isolated revision history rolls restoring previous document versions.',
                'Export formats support for quick document distribution.'
              ],
              note: 'No third-party trackers or external scripts are injected during sessions. Collaborative editors execute strictly within private system frames.'
            },
            {
              icon: <Calendar className="w-5 h-5" />,
              title: 'Secure Calendar',
              accent: '#8b5cf6',
              accentBg: 'rgba(139,92,246,0.08)',
              accentBorder: 'rgba(139,92,246,0.15)',
              specs: [
                'Multi-tenant event scheduling and booking calendar loops.',
                'Domain-wide resource indicators showing room and user busy logs.',
                'Sync indicators sending secure invitations automatically.',
                'Dedicated filters for scheduling meetings, out-of-office, and reminders.'
              ],
              note: 'Event logs and calendars are isolated per domain. Competitors cannot scrap public scheduling tables or user directories.'
            },
            {
              icon: <Video className="w-5 h-5" />,
              title: 'PolyMX Meet',
              accent: '#ec4899',
              accentBg: 'rgba(236,72,153,0.08)',
              accentBorder: 'rgba(236,72,153,0.15)',
              specs: [
                'Fully encrypted video and audio streams for remote conferences.',
                'Direct browser execution requiring no plugins or software downloads.',
                'Interactive screen sharing and real-time chat messages.',
                'Meeting locking and password verification parameters.'
              ],
              note: 'Meet video frames bypass intermediate servers, establishing direct peer-to-peer tunnels wherever possible to guarantee voice and image privacy.'
            },
            {
              icon: <Lock className="w-5 h-5" />,
              title: 'Confidentiality Enforced',
              accent: '#ef4444',
              accentBg: 'rgba(239,68,68,0.08)',
              accentBorder: 'rgba(239,68,68,0.15)',
              specs: [
                'Database-level private encryption protecting mail stores and user keys.',
                'DevTools inspection locks blocking code snooping at browser levels.',
                'Comprehensive audit registries logging administrators operations.',
                'Enforced multi-factor authentication (MFA) across all endpoints.'
              ],
              note: 'Unlike general providers that index your content for analytics and profiling, PolyMX ensures your information remains strictly confidential with absolute database isolation.'
            }
          ].map((card, idx) => (
            <FeatureCard key={idx} card={card} index={idx} />
          ))}
        </div>
      </section>

      {/* Pricing Section — Tiered Packages */}
      <section className="relative py-28 bg-[#010B33] text-white overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#45C7AC]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#45C7AC] uppercase tracking-widest px-4 py-1.5 bg-[#45C7AC]/10 rounded-full border border-[#45C7AC]/20 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#45C7AC] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#45C7AC]" />
              </span>
              Security Hardened Suite
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-5xl text-white mt-4 mb-4">
              Choose Your Package
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Configure your mailboxes and secure drive allocations. Switch plans or expand quotas as you scale.
            </p>
          </div>

          {/* User Count and Drive Quota Sliders */}
          <div className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 sm:p-8 rounded-3xl mb-16">
            <h3 className="text-sm font-bold font-display mb-6 flex items-center gap-2.5 text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-[#45C7AC]/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#45C7AC]" />
              </div>
              Define your deployment scale
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mailboxes (Users)</label>
                  <span className="text-xl font-black text-white tabular-nums">{users.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range" min="5" max="500" step="5" value={users}
                  onChange={e => setUsers(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #45C7AC 0%, #45C7AC ${((users - 5) / 495) * 100}%, #1e293b ${((users - 5) / 495) * 100}%, #1e293b 100%)` }}
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
                  <span>5</span><span>500</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Storage Per Mailbox</label>
                  <span className="text-xl font-black text-white tabular-nums">{quota} GB</span>
                </div>
                <input
                  type="range" min="1" max="50" step="1" value={quota}
                  onChange={e => setQuota(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E27000 0%, #E27000 ${((quota - 1) / 49) * 100}%, #1e293b ${((quota - 1) / 49) * 100}%, #1e293b 100%)` }}
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
                  <span>1 GB</span><span>50 GB</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="relative flex bg-slate-950 border border-slate-800 rounded-xl p-1 w-64">
              <div
                className="absolute top-1 bottom-1 rounded-lg"
                style={{
                  width: 'calc(50% - 4px)',
                  left: isAnnual ? 'calc(50% + 2px)' : '4px',
                  background: '#45C7AC',
                  transition: 'left 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
              <button
                onClick={() => setBillingPeriod('monthly')}
                className="relative z-10 flex-1 py-2.5 text-xs font-bold rounded-lg"
                style={{ color: !isAnnual ? '#010B33' : '#64748b', transition: 'color 0.3s ease' }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className="relative z-10 flex-1 py-2.5 text-xs font-bold rounded-lg"
                style={{ color: isAnnual ? '#010B33' : '#64748b', transition: 'color 0.3s ease' }}
              >
                Annual
              </button>
            </div>
          </div>

          {/* 3-Tier Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">

            {/* ── Tier 1: Starter ── */}
            <div
              className="group relative rounded-3xl p-8 flex flex-col overflow-hidden"
              style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(51,65,85,0.6)',
                transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, border-color 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px -15px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(100,116,139,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; }}
            >
              <div className="mb-8">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Starter</span>
                <h3 className="text-xl font-extrabold font-display text-white mt-1 mb-2">Secure Workspace</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Secure mail and collaborative tools for teams beginning data sovereignty migration.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl text-slate-500 line-through font-semibold decoration-red-500/80 tabular-nums">₹{isAnnual ? '1,580' : '199'}</span>
                  <span className="text-4xl font-black text-[#45C7AC] tabular-nums">₹{isAnnual ? '790' : '99'}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ user {isAnnual ? '/ year' : '/ month'}</span>
                </div>
                <p className="text-[10px] text-slate-650 mt-1">
                  Est. total: <span className="line-through decoration-red-500/40">₹{Math.round(starterTotal * 2.0).toLocaleString('en-IN')}</span> <span className="text-white font-semibold">₹{Math.round(starterTotal).toLocaleString('en-IN')}</span> {isAnnual ? '/yr' : '/mo'} for {users.toLocaleString('en-IN')} users
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Secure Webmail Client Integration',
                  'Advanced Domain Trust Signature Setup',
                  '5 GB Encrypted Drive space / user',
                  'Collaborative Docs & spreadsheets',
                  'Shared Team Calendars & Meet access',
                  'Standard Database Encryption',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:sales@polynexus.in?subject=PolyMX Starter Plan Enquiry&body=Hello,%0A%0AWe are interested in the PolyMX Starter Plan for ${users} users with ${quota} GB storage per user (${billingPeriod}).%0A%0APlease send us a subscription proposal.`}
                className="group/btn relative block text-center w-full py-3.5 rounded-xl font-bold tracking-wide uppercase text-xs overflow-hidden"
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid rgba(100,116,139,0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#45C7AC'; e.currentTarget.style.color = '#45C7AC'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(100,116,139,0.4)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                Get Started →
              </a>
            </div>

            {/* ── Tier 2: Professional (Highlighted) ── */}
            <div
              className="group relative rounded-3xl p-8 flex flex-col overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(69,199,172,0.08) 0%, rgba(15,23,42,0.8) 40%)',
                border: '1px solid rgba(69,199,172,0.3)',
                boxShadow: '0 0 40px -10px rgba(69,199,172,0.12)',
                transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 25px 60px -15px rgba(69,199,172,0.2)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 40px -10px rgba(69,199,172,0.12)'; }}
            >
              <div className="absolute top-0 right-6">
                <div className="bg-[#45C7AC] text-[#010B33] text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-b-lg">
                  Most Popular
                </div>
              </div>

              <div className="mb-8">
                <span className="text-[10px] font-bold text-[#45C7AC] uppercase tracking-widest">Professional</span>
                <h3 className="text-xl font-extrabold font-display text-white mt-1 mb-2">Hardened Enterprise</h3>
                <p className="text-xs text-slate-400 leading-relaxed">For scale organizations demanding absolute information isolation and audit records.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl text-slate-500 line-through font-semibold decoration-red-500/80 tabular-nums">₹{isAnnual ? '3,980' : '499'}</span>
                  <span className="text-4xl font-black text-[#45C7AC] tabular-nums">₹{isAnnual ? '1,990' : '249'}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ user {isAnnual ? '/ year' : '/ month'}</span>
                </div>
                <p className="text-[10px] text-slate-650 mt-1">
                  Est. total: <span className="line-through decoration-red-500/40">₹{Math.round(proTotal * 2.0).toLocaleString('en-IN')}</span> <span className="text-white font-semibold">₹{Math.round(proTotal).toLocaleString('en-IN')}</span> {isAnnual ? '/yr' : '/mo'} for {users.toLocaleString('en-IN')} users
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Starter',
                  'Up to 20 GB Encrypted Drive space / user',
                  'Real-time document revision histories',
                  'Dedicated end-to-end encryption key chains',
                  'Custom domain setup & DNS verifications',
                  'Comprehensive admin operations logs',
                  'Centralized directory service integrations',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-[#45C7AC] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:sales@polynexus.in?subject=PolyMX Professional Plan Enquiry&body=Hello,%0A%0AWe are interested in the PolyMX Professional Plan for ${users} users with ${quota} GB storage per user (${billingPeriod}).%0A%0APlease send us a customized proposal.`}
                className="group/btn relative block text-center w-full py-3.5 rounded-xl font-black tracking-wide uppercase text-xs overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #45C7AC, #35b399)',
                  color: '#010B33',
                  boxShadow: '0 8px 30px -8px rgba(69,199,172,0.4)',
                  transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px -8px rgba(69,199,172,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px -8px rgba(69,199,172,0.4)'; }}
              >
                {/* Shimmer sweep */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                />
                <span className="relative z-10">Request Proposal →</span>
              </a>
            </div>

            {/* ── Tier 3: Enterprise ── */}
            <div
              className="group relative rounded-3xl p-8 flex flex-col overflow-hidden"
              style={{
                background: 'rgba(15,23,42,0.6)',
                border: '1px solid rgba(51,65,85,0.6)',
                transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, border-color 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 50px -15px rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(226,112,0,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(51,65,85,0.6)'; }}
            >
              <div className="mb-8">
                <span className="text-[10px] font-bold text-[#E27000] uppercase tracking-widest">Enterprise</span>
                <h3 className="text-xl font-extrabold font-display text-white mt-1 mb-2">Dedicated Cloud</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Dedicated server resources, private VM clusters, and custom encryption key custody.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                  <span className="text-xs text-slate-500 font-semibold">/ dedicated instances</span>
                </div>
                <p className="text-[10px] text-slate-650 mt-1">
                  Self-hosted VMs / air-gapped options
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Professional',
                  'Unlimited mailboxes and storage thresholds',
                  'Your own private cluster VM infrastructure',
                  'Isolated high-availability database cluster setup',
                  'Custom encryption key custody integrations',
                  'Developer API gateways & custom webhook links',
                  'Dedicated support manager & custom SLA agreements',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-[#E27000] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:sales@polynexus.in?subject=PolyMX Dedicated Cloud Plan Enquiry&body=Hello,%0A%0AWe are interested in the PolyMX Dedicated Cloud Plan for ${users} users with ${quota} GB storage per user (${billingPeriod}).%0A%0APlease contact us to coordinateVM configurations.`}
                className="group/btn relative block text-center w-full py-3.5 rounded-xl font-bold tracking-wide uppercase text-xs overflow-hidden"
                style={{
                  background: 'transparent',
                  color: '#94a3b8',
                  border: '1px solid rgba(100,116,139,0.4)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#E27000'; e.currentTarget.style.color = '#E27000'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(100,116,139,0.4)'; e.currentTarget.style.color = '#94a3b8'; }}
              >
                Contact Sales →
              </a>
            </div>
          </div>

          {/* Trust strip */}
          <div className="text-center mt-12">
            <p className="text-[11px] text-slate-600 leading-relaxed">
              No credit card required · Free consultation & migration guide · Full databases encryption at rest
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
