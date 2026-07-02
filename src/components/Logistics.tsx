import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CheckCircle,
  Users,
  Lock,
  Calendar,
  Truck,
  Camera,
  Compass
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

      {/* Operations note footer */}
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
            📈 Operational Yield
          </span>
          <p className="text-[11px] leading-relaxed text-slate-500">{card.note}</p>
        </div>
      </div>
    </div>
  );
}

export default function Logistics() {
  const [customers, setCustomers] = useState<number>(1000);
  const [routes, setRoutes] = useState<number>(10);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  const isAnnual = billingPeriod === 'annual';

  // Starter rate definitions (₹29/customer/mo or ₹240/customer/yr)
  const starterBasePrice = isAnnual ? 240.00 : 29.00;
  const starterTotal = customers * starterBasePrice;

  // Professional rate definitions (₹49/customer/mo or ₹390/customer/yr)
  const proBasePrice = isAnnual ? 390.00 : 49.00;
  const proTotal = customers * proBasePrice;

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
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#45C7AC]/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#010B33]/5 border border-[#010B33]/10 text-[#010B33] text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 bg-[#45C7AC] rounded-full animate-pulse" />
            Last-Mile Logistics ERP
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-display mb-6 text-[#010B33] leading-none">
            Automate Your Last-Mile <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#010B33] via-emerald-900 to-[#45C7AC] bg-clip-text text-transparent">
              Logistics Suite
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-650 font-light leading-relaxed mb-10">
            A secure, multi-city logistics and subscription management suite built for high-frequency recurrent operations. Optimize routing pipelines, monitor dispatches, and verify drop-offs with absolute data isolation.
          </p>
        </div>
      </section>

      {/* Client Spotlight Section */}
      <section className="py-16 bg-[#020d29] text-white overflow-hidden relative border-y border-slate-900">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#45C7AC]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center md:text-left">
              <span className="text-[10px] font-bold text-[#45C7AC] uppercase tracking-widest">Client Spotlight</span>
              <h3 className="text-2xl font-extrabold font-display text-white mt-1.5 mb-3">Trusted by Pench Foods</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pench Foods utilizes our logistics platform daily to power their multi-city fresh dairy and subscription logistics network, running optimized routes with zero dispatch delays.
              </p>
            </div>
            <div className="md:col-span-8">
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 relative">
                <div className="absolute top-6 right-8 text-5xl text-slate-700 font-serif pointer-events-none">“</div>
                <blockquote className="text-sm font-medium text-slate-200 leading-relaxed mb-6">
                  Before implementing this logistics platform, route optimization was a manual headache every morning. Now, the route planning is completely automated. Our drivers follow pre-optimized paths on their apps, and the geotagged proof-of-delivery ensures our customers get their fresh products precisely on time. It has reduced our daily delivery preparation by over 2 hours.
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#45C7AC]/20 flex items-center justify-center text-xs font-bold text-[#45C7AC]">
                    PF
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">Operations Director</h5>
                    <p className="text-[10px] text-slate-500">Pench Foods Dairy Division</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Core Pillars Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-[#45C7AC] uppercase tracking-widest bg-[#45C7AC]/10 px-3.5 py-1.5 rounded-full">
            ERP Features
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl text-[#010B33] mt-4 mb-4">
            Built for Subscription & Logistics Scale
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            From overnight order queues to geotagged drop-offs, our Logistics ERP connects your dispatch team directly to the road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Truck className="w-5 h-5" />,
              title: 'Dynamic Routing Solver',
              accent: '#3b82f6',
              accentBg: 'rgba(59,130,246,0.08)',
              accentBorder: 'rgba(59,130,246,0.15)',
              specs: [
                'Algorithmic solver calculating shortest road trajectories.',
                'Sub-zone route optimizations keeping travel distance minimal.',
                'Dynamic route updates pushing adjustments straight to drivers.',
                'Fuel consumption optimization mapping active paths.'
              ],
              note: 'Manual routing wastes fuel and time. Our system calculates the absolute shortest route sequence for each driver based on real-time zone parameters.'
            },
            {
              icon: <Calendar className="w-5 h-5" />,
              title: 'Subscription Engine',
              accent: '#10b981',
              accentBg: 'rgba(16,185,129,0.08)',
              accentBorder: 'rgba(16,185,129,0.15)',
              specs: [
                'Flexible scheduling patterns (daily, alternate, custom weekdays).',
                'One-tap vacation suspension pausing active cycles instantly.',
                'Automatic night-run order queue creation at 4:00 AM.',
                'Proportionate billing calculators tracking active deliveries.'
              ],
              note: 'Keeps track of subscription suspensions automatically. Active deliveries resume on exact target dates without administrative overrides.'
            },
            {
              icon: <Compass className="w-5 h-5" />,
              title: 'Live Fleet Tracking',
              accent: '#f59e0b',
              accentBg: 'rgba(245,158,11,0.08)',
              accentBorder: 'rgba(245,158,11,0.15)',
              specs: [
                'Real-time vehicle position streams on dispatch consoles.',
                'Historical breadcrumb paths showing actual routes taken.',
                'Estimated times of arrival (ETA) updating dynamically.',
                'Automatic alarms notifying if drivers leave assigned zones.'
              ],
              note: 'Tracks vehicles actively. Dispatch panels display real-time movement histories alongside delivery progress logs.'
            },
            {
              icon: <Camera className="w-5 h-5" />,
              title: 'Geotagged Delivery Proof',
              accent: '#8b5cf6',
              accentBg: 'rgba(139,92,246,0.08)',
              accentBorder: 'rgba(139,92,246,0.15)',
              specs: [
                'Encrypted drop-off photo captures within delivery portals.',
                'Automatic coordinate tagging stamps locked at the delivery site.',
                'Real-time customer notifications showing delivery proof.',
                'Audit records mapping exact distance variances.'
              ],
              note: 'Verifies deliveries instantly. Drivers must be within the geofenced coordinate perimeter to submit drop-off confirmations.'
            },
            {
              icon: <Users className="w-5 h-5" />,
              title: 'Driver Zones & Persistence',
              accent: '#ec4899',
              accentBg: 'rgba(236,72,153,0.08)',
              accentBorder: 'rgba(236,72,153,0.15)',
              specs: [
                'Permanent driver assignments to geographical zones.',
                'Zone boundary controls blocking deliveries outside domains.',
                'Smart driver onboarding mapping regular delivery sequences.',
                'Dynamic load sheets showing inventory quantities per van.'
              ],
              note: 'Drivers assigned to permanent zones build familiarity with paths and regular customer schedules, resulting in 20% faster run times.'
            },
            {
              icon: <Lock className="w-5 h-5" />,
              title: 'Confidential City Segregation',
              accent: '#ef4444',
              accentBg: 'rgba(239,68,68,0.08)',
              accentBorder: 'rgba(239,68,68,0.15)',
              specs: [
                'Physical database separation isolating regional data folders.',
                'Encrypted backend databases protecting customer addresses.',
                'Audit registries tracking dispatch operators actions.',
                'Secure mobile portal authentication codes.'
              ],
              note: 'Ensures absolute corporate isolation. Operations records, customer lists, and financial reports from different regions are locked in isolated database schemas.'
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
              Enterprise Logistics Suite
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-5xl text-white mt-4 mb-4">
              Choose Your Scale
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Select a tier matching your daily operations limits. Request customized pricing metrics as your routes grow.
            </p>
          </div>

          {/* User Count and Driver Scale Sliders */}
          <div className="max-w-3xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 p-6 sm:p-8 rounded-3xl mb-16">
            <h3 className="text-sm font-bold font-display mb-6 flex items-center gap-2.5 text-slate-300">
              <div className="w-7 h-7 rounded-lg bg-[#45C7AC]/15 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#45C7AC]" />
              </div>
              Define your operational capacity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Customers Managed</label>
                  <span className="text-xl font-black text-white tabular-nums">{customers.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range" min="100" max="10000" step="100" value={customers}
                  onChange={e => setCustomers(Math.max(100, parseInt(e.target.value) || 100))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #45C7AC 0%, #45C7AC ${((customers - 100) / 9900) * 100}%, #1e293b ${((customers - 100) / 9900) * 100}%, #1e293b 100%)` }}
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
                  <span>100</span><span>10,000</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Driver Routes</label>
                  <span className="text-xl font-black text-white tabular-nums">{routes} Routes</span>
                </div>
                <input
                  type="range" min="5" max="100" step="5" value={routes}
                  onChange={e => setRoutes(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #E27000 0%, #E27000 ${((routes - 5) / 95) * 100}%, #1e293b ${((routes - 5) / 95) * 100}%, #1e293b 100%)` }}
                />
                <div className="flex justify-between text-[10px] text-slate-600 mt-1.5">
                  <span>5 Routes</span><span>100 Routes</span>
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
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Starter Hub</span>
                <h3 className="text-xl font-extrabold font-display text-white mt-1 mb-2">Regional Hub</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Perfect for subscription businesses managing operations within a single city zone.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl text-slate-500 line-through font-semibold decoration-red-500/80 tabular-nums">₹{isAnnual ? '480' : '59'}</span>
                  <span className="text-4xl font-black text-[#45C7AC] tabular-nums">₹{isAnnual ? '240' : '29'}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ customer {isAnnual ? '/ year' : '/ month'}</span>
                </div>
                <p className="text-[10px] text-slate-650 mt-1">
                  Est. total: <span className="line-through decoration-red-500/40">₹{Math.round(starterTotal * 2.0).toLocaleString('en-IN')}</span> <span className="text-white font-semibold">₹{Math.round(starterTotal).toLocaleString('en-IN')}</span> {isAnnual ? '/yr' : '/mo'}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  `Up to ${customers.toLocaleString('en-IN')} active customers`,
                  'Limited to 10 active driver routes (riders)',
                  'Web dispatch dashboard console',
                  'Android & iOS Driver apps included',
                  'Android & iOS Customer portal apps',
                  'Standard route optimization solver',
                  'Subscription pause & vacation scheduling',
                  'Standard coordinate delivery tracking',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:sales@polynexus.in?subject=Logistics Starter Plan Enquiry&body=Hello,%0A%0AWe are interested in the Logistics Starter Plan for ${customers} active customers and ${routes} driver routes (${billingPeriod}).%0A%0APlease send us a subscription proposal.`}
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
                <span className="text-[10px] font-bold text-[#45C7AC] uppercase tracking-widest">Pro Dispatch</span>
                <h3 className="text-xl font-extrabold font-display text-white mt-1 mb-2">Multi-City Scale</h3>
                <p className="text-xs text-slate-400 leading-relaxed">For large subscription logistics setups operating across multiple zones and regional cities.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl text-slate-500 line-through font-semibold decoration-red-500/80 tabular-nums">₹{isAnnual ? '780' : '99'}</span>
                  <span className="text-4xl font-black text-[#45C7AC] tabular-nums">₹{isAnnual ? '390' : '49'}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ customer {isAnnual ? '/ year' : '/ month'}</span>
                </div>
                <p className="text-[10px] text-slate-650 mt-1">
                  Est. total: <span className="line-through decoration-red-500/40">₹{Math.round(proTotal * 2.0).toLocaleString('en-IN')}</span> <span className="text-white font-semibold">₹{Math.round(proTotal).toLocaleString('en-IN')}</span> {isAnnual ? '/yr' : '/mo'}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  `Up to ${customers.toLocaleString('en-IN')} active customers`,
                  'Unlimited driver routes (riders) included',
                  'Web dispatch dashboard console',
                  'Android & iOS Driver apps included',
                  'Android & iOS Customer portal apps',
                  'Advanced algorithmic route optimization',
                  'Real-time GPS vehicle location updates',
                  'Mandatory geotagged proof-of-delivery photos',
                  'Air-gapped database city segregation',
                  'Multi-admin regional dispatcher panels',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle className="w-3.5 h-3.5 text-[#45C7AC] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:sales@polynexus.in?subject=Logistics Professional Plan Enquiry&body=Hello,%0A%0AWe are interested in the Logistics Professional Plan for ${customers} active customers and ${routes} driver routes (${billingPeriod}).%0A%0APlease send us a customized proposal.`}
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
                <span className="text-[10px] font-bold text-[#E27000] uppercase tracking-widest">Enterprise Custom</span>
                <h3 className="text-xl font-extrabold font-display text-white mt-1 mb-2">Dedicated Infrastructure</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Dedicated logistics server deployments, private geofenced boundaries, and KMS keys custody.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">Custom</span>
                  <span className="text-xs text-slate-500 font-semibold">/ dedicated clusters</span>
                </div>
                <p className="text-[10px] text-slate-650 mt-1">
                  Self-hosted VMs / air-gapped instances
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  'Everything in Professional',
                  'Unlimited active customers and driver routes',
                  'Web dispatch dashboard console',
                  'Android & iOS Driver apps included',
                  'Android & iOS Customer portal apps',
                  'Your own private cluster VM infrastructure',
                  'Dedicated database cluster setup',
                  'Custom encryption key custody integrations',
                  'Developer API gateways & custom webhook integrations',
                  'Dedicated support manager & custom SLA agreements',
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                    <CheckCircle className="w-3.5 h-3.5 text-[#E27000] flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:sales@polynexus.in?subject=Logistics Dedicated Cloud Plan Enquiry&body=Hello,%0A%0AWe are interested in the Logistics Dedicated Cloud Plan for ${customers} active customers and ${routes} driver routes (${billingPeriod}).%0A%0APlease contact us to coordinate configurations.`}
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
