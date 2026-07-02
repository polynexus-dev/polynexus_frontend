import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  CheckCircle,
  Code,
  Smartphone,
  Server,
  Layers,
  Cpu,
  Lock,
  Sparkles
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
            📋 Technical Benchmark
          </span>
          <p className="text-[11px] leading-relaxed text-slate-500">{card.note}</p>
        </div>
      </div>
    </div>
  );
}

export default function CustomSolutions() {
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
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#45C7AC]/10 rounded-full blur-[100px] -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#010B33]/5 border border-[#010B33]/10 text-[#010B33] text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-1.5 h-1.5 bg-[#45C7AC] rounded-full animate-pulse" />
            Bespoke Engineering
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-display mb-6 text-[#010B33] leading-none">
            Custom Software <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#010B33] via-blue-900 to-[#45C7AC] bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>
          
          <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-650 font-light leading-relaxed mb-10">
            Beyond standard tools. We design, architect, and deploy high-performance custom application ecosystems, adaptive design models, and zero-trust security pipelines tailored specifically to your corporate logic.
          </p>
        </div>
      </section>

      {/* 6 Core Pillars Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <span className="text-xs font-bold text-[#45C7AC] uppercase tracking-widest bg-[#45C7AC]/10 px-3.5 py-1.5 rounded-full">
            Engineering Competence
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-4xl text-[#010B33] mt-4 mb-4">
            Bespoke Architectures. Hardened Integrity.
          </h2>
          <p className="text-slate-500 text-base max-w-2xl mx-auto">
            We build secure, component-based architectures that scale across platforms and handle massive transaction pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[
            {
              icon: <Code className="w-5 h-5" />,
              title: 'Adaptive Frontend Systems',
              accent: '#3b82f6',
              accentBg: 'rgba(59,130,246,0.08)',
              accentBorder: 'rgba(59,130,246,0.15)',
              specs: [
                'Bespoke, component-based layout ecosystems.',
                'Automated styling token pipelines scaling dynamically.',
                'Highly fluid, micro-animated user interactions.',
                'Full accessibility controls and low-latency rendering.'
              ],
              note: 'Design systems that evolve. We build unified, highly responsive frontend architectures that function flawlessly on all device shapes.'
            },
            {
              icon: <Server className="w-5 h-5" />,
              title: 'Unified Data Governance',
              accent: '#10b981',
              accentBg: 'rgba(16,185,129,0.08)',
              accentBorder: 'rgba(16,185,129,0.15)',
              specs: [
                'Physical database separation isolating corporate schemas.',
                'Real-time transactional sync across redundant vaults.',
                'Cryptographic audit trail logs validating database logs.',
                'Highly scalable relational schema structures.'
              ],
              note: 'Absolute database isolation. We implement advanced structural boundaries ensuring your regional data stays completely partitioned.'
            },
            {
              icon: <Lock className="w-5 h-5" />,
              title: 'Secured Logic Pipelines',
              accent: '#f59e0b',
              accentBg: 'rgba(245,158,11,0.08)',
              accentBorder: 'rgba(245,158,11,0.15)',
              specs: [
                'Zero-trust gateway parameters protecting system endpoints.',
                'AES-256 database-level encryption protecting records.',
                'Continuous heuristic threat monitoring on operations.',
                'DevTools inspection locks blocking browser code-snooping.'
              ],
              note: 'Security-first pipelines. All business routines and user entries execute inside secure cryptographic validation rings.'
            },
            {
              icon: <Layers className="w-5 h-5" />,
              title: 'Intelligent Resource Provision',
              accent: '#8b5cf6',
              accentBg: 'rgba(139,92,246,0.08)',
              accentBorder: 'rgba(139,92,246,0.15)',
              specs: [
                'Dynamic load balancing distributing active client demands.',
                'Self-healing container topologies ensuring high availability.',
                'Automated night-run batch queues handling operations.',
                'Low-latency communication protocols across API routes.'
              ],
              note: 'Optimized system resource planning. Compute engines adjust parameters dynamically based on transaction densities.'
            },
            {
              icon: <Smartphone className="w-5 h-5" />,
              title: 'Native Mobile Foundations',
              accent: '#ec4899',
              accentBg: 'rgba(236,72,153,0.08)',
              accentBorder: 'rgba(236,72,153,0.15)',
              specs: [
                'Native Android and iOS mobile app suites.',
                'Offline storage support syncing upon link reconnect.',
                'Direct secure mobile notifications for system alerts.',
                'Lightweight compilation footprints optimizing device runtimes.'
              ],
              note: 'Cross-platform app integration. Mobile interfaces link directly to web backends via private, encrypted endpoints.'
            },
            {
              icon: <Cpu className="w-5 h-5" />,
              title: 'Enterprise Integration Bridges',
              accent: '#ef4444',
              accentBg: 'rgba(239,68,68,0.08)',
              accentBorder: 'rgba(239,68,68,0.15)',
              specs: [
                'Custom API gateways syncing with legacy platforms.',
                'Developer webhook tunnels providing immediate notifications.',
                'Admin dashboard controls showing comprehensive logs.',
                'Active user audit chains mapping employee activity.'
              ],
              note: 'Clean architectural links. We build bridges that interface legacy databases into modern, micro-animated client consoles.'
            }
          ].map((card, idx) => (
            <FeatureCard key={idx} card={card} index={idx} />
          ))}
        </div>
      </section>

      {/* Bespoke Project Cost Estimator (Replaced with Custom Scoping) */}
      <section className="relative py-28 bg-[#010B33] text-white overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-[#45C7AC]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-650/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-[#45C7AC] uppercase tracking-widest px-4 py-1.5 bg-[#45C7AC]/10 rounded-full border border-[#45C7AC]/20 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Proposals
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight font-display sm:text-5xl text-white mt-4 mb-4">
              Tailored to Your Specifications
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Every enterprise project requires distinct scoping, integrations, and architectural layouts. Speak directly to our engineering coordinators.
            </p>
          </div>

          {/* Pricing Output Cards */}
          <div className="max-w-xl mx-auto bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative">
            <div className="absolute top-0 right-8">
              <div className="bg-[#45C7AC] text-[#010B33] text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-b-lg">
                Custom Scoping
              </div>
            </div>

            <div className="text-center mb-8">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Bespoke Software Pricing</span>
              <div className="flex items-baseline justify-center gap-1 flex-wrap">
                <span className="text-5xl font-black text-[#45C7AC] tracking-tight">Custom Quote</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-4 leading-relaxed">
                Pricing is determined by functional complexity, targeted user platforms (Web/iOS/Android), and security audit compliance thresholds.
              </p>
            </div>

            <ul className="space-y-3.5 mb-8 border-t border-slate-800/80 pt-6">
              {[
                'Full custom layout specs & technical documentation',
                'Comprehensive QA testing cycles and automated runs',
                'Native Mobile (iOS & Android) and Web options',
                'Zero-trust encryption models & compliance integrations',
                'Complete code & design system transfer',
                '6 Months operational deploy support & maintenance warranty',
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-slate-350">
                  <CheckCircle className="w-4 h-4 text-[#45C7AC] flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>

            <a
              href="mailto:sales@polynexus.in?subject=Bespoke Custom Software Scoping Enquiry&body=Hello,%0A%0AWe would like to schedule a technical scoping call to coordinate custom software development requirements.%0A%0APreferred platforms (Web/iOS/Android):%0AProject summary:%0AContact details:%0A%0APlease contact us to coordinate a calendar slot."
              className="group/btn relative block text-center w-full py-4 rounded-2xl font-black tracking-wider uppercase text-xs overflow-hidden"
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
              <span className="relative z-10">Request Scoping Meeting →</span>
            </a>
          </div>

          {/* Trust strip */}
          <div className="text-center mt-12">
            <p className="text-[11px] text-slate-650 leading-relaxed">
              *All projects begin with an in-depth operational scoping review. Scoping documents and engineering timelines determine final pricing.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
