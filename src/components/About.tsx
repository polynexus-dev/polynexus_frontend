import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import useScrollReveal from '../hooks/useScrollReveal';
import aboutHeroImg from '../assets/about_hero.png';
import techCollabImg from '../assets/tech_collab.png';
import teamEngImg from '../assets/team_eng.png';
import teamDesignImg from '../assets/team_design.png';
import teamInfraImg from '../assets/team_infra.png';
import { fetchAboutInfo, getIconComponent, type AboutInfo } from '../api';

export default function About() {
  useScrollReveal();
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'About Polynexus | Who We Are';
    
    fetchAboutInfo()
      .then(setAboutInfo)
      .catch((err) => {
        console.error('Error fetching about settings:', err);
        setAboutInfo({
          title_prefix: 'Building the infrastructure',
          title_highlight: "powering tomorrow's businesses",
          subtitle: "Polynexus is an enterprise software engineering firm. We design, build, and operate the high-performance platforms, cloud backends, and custom applications that modern organizations need to operate at scale — with zero compromise on security or reliability.",
          stats: [
            { value: '4+',   label: 'Enterprise Products', icon: 'Award' },
            { value: '99.99%', label: 'Uptime SLA',         icon: 'Zap' },
            { value: '100%', label: 'Expert-Led Team',     icon: 'Users' },
            { value: '<15m', label: 'Support Response',    icon: 'Globe' },
          ],
          values: [
            {
              icon: 'Target',
              color: 'text-secondary',
              bg: 'bg-secondary/10',
              title: 'Precision Engineering',
              desc: 'We build every system with exactness — from database schemas to UI micro-animations. No shortcuts, no generic templates.',
            },
            {
              icon: 'ShieldCheck',
              color: 'text-blue-500',
              bg: 'bg-blue-50',
              title: 'Security First',
              desc: 'Zero-trust architecture, AES-256 encryption, and SOC2 compliance principles are the baseline — not the afterthought.',
            },
            {
              icon: 'Lightbulb',
              color: 'text-amber-500',
              bg: 'bg-amber-50',
              title: 'Innovation Always',
              desc: "We push beyond off-the-shelf. Every client engagement is an opportunity to engineer something the industry hasn't seen.",
            },
            {
              icon: 'Heart',
              color: 'text-rose-500',
              bg: 'bg-rose-50',
              title: 'Partner Mindset',
              desc: 'We don\'t just build and hand over. We become an extension of your team — aligned to your long-term business outcomes.',
            },
          ],
          team: [
            {
              name: 'Polynexus Engineering',
              role: 'Core Platform Architecture',
              desc: 'Full-stack engineers specializing in distributed systems, zero-trust security frameworks, and high-throughput API design.',
              initials: 'PE',
              color: 'bg-secondary/15 text-secondary',
            },
            {
              name: 'Design & UX Lab',
              role: 'Interface & Experience Design',
              desc: 'UI/UX specialists who craft component-first design systems and micro-animated user experiences for enterprise surfaces.',
              initials: 'DX',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              name: 'Infrastructure Ops',
              role: 'Cloud & Database Operations',
              desc: 'DevOps and database architects managing active-active replication, geo-distributed caching, and compliance monitoring.',
              initials: 'IO',
              color: 'bg-amber-50 text-amber-600',
            },
          ]
        });
      });
  }, []);

  if (!aboutInfo) {
    return (
      <div className="min-h-screen bg-slate-50 text-[#010B33] font-sans antialiased flex flex-col justify-between">
        <Header />
        <div className="flex-1 flex items-center justify-center py-40">
          <span className="text-sm font-mono text-slate-400">Loading specs...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-[#010B33] font-sans antialiased">
      <Header />

      <section className="relative pt-36 pb-0 bg-white overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_60%,transparent_100%)] opacity-60 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-secondary/8 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pb-14">
          <span className="inline-block text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-4 py-1.5 rounded-full mb-6">
            Who We Are
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight leading-[1.1]">
            {aboutInfo.title_prefix}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-[#35b399] to-[#00c2ff]">
              {aboutInfo.title_highlight}
            </span>
          </h1>
          <p className="mt-6 text-slate-500 text-base leading-relaxed max-w-2xl mx-auto">
            {aboutInfo.subtitle}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/#contact"
              className="inline-flex items-center gap-2 bg-secondary text-primary hover:bg-[#35b399] font-bold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-secondary/20 text-sm"
            >
              Start a Project
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/#services"
              className="inline-flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-7 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm text-sm"
            >
              View Our Services
            </Link>
          </div>
        </div>

        <div className="relative w-full h-72 sm:h-96 overflow-hidden mt-4">
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/5 to-white/80 z-10 pointer-events-none" />
          <img
            src={aboutHeroImg}
            alt="Polynexus engineering team at work"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {aboutInfo.stats.map((s) => {
              const StatIcon = getIconComponent(s.icon);
              return (
                <div key={s.label} className="text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="inline-flex p-2.5 rounded-xl bg-secondary/10 text-secondary mb-3">
                    <StatIcon className="w-5 h-5" />
                  </div>
                  <div className="text-3xl font-black text-primary font-mono">{s.value}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center reveal">
            <div>
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Our Mission</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mt-3 mb-6">
                Custom software that solves real operational problems
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Most businesses are forced to bend their operations around rigid, generic SaaS tools
                that were never designed for their specific workflows. We believe that's backwards.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Polynexus deeply understands your business logic, data flows, and long-term scale
                requirements — then engineers software that fits your operations perfectly, rather
                than forcing you to adapt.
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl reveal reveal-delay-200 aspect-[4/3]">
              <img
                src={techCollabImg}
                alt="Polynexus engineers collaborating on architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary/20 via-transparent to-accent/10" />
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md border border-white/60 rounded-2xl p-4 shadow-xl">
                <div className="grid grid-cols-3 gap-4">
                  {aboutInfo.stats.slice(0, 3).map((s) => (
                    <div key={s.label} className="text-center">
                      <div className="text-lg font-black text-primary font-mono">{s.value}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mt-3">
              The principles behind every line of code
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {aboutInfo.values.map((v, idx) => {
              const ValueIcon = getIconComponent(v.icon);
              return (
                <div
                  key={idx}
                  className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-secondary/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`inline-flex p-2.5 rounded-xl ${v.bg} mb-4`}>
                    <ValueIcon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-primary mb-2">{v.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 reveal">
            <span className="text-xs font-bold text-secondary uppercase tracking-widest">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mt-3">
              Expert-led, across every discipline
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal">
            {aboutInfo.team.map((t) => {
              let teamImg = teamEngImg;
              if (t.initials === 'DX') teamImg = teamDesignImg;
              if (t.initials === 'IO') teamImg = teamInfraImg;
              return (
                <div
                  key={t.name}
                  className="bg-white border border-slate-200/80 rounded-2xl p-7 hover:border-secondary/35 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mb-5 border border-slate-200/60 bg-slate-50 p-1 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={teamImg}
                      alt={t.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h3 className="text-base font-bold text-primary">{t.name}</h3>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider font-mono mt-0.5">{t.role}</span>
                  <p className="text-slate-500 text-xs mt-3 leading-relaxed">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#010B33] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Ready to build?</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-3 mb-4">
            Let's architect your next platform
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-primary hover:bg-[#35b399] font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-secondary/20 text-sm"
            >
              Start a Conversation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
