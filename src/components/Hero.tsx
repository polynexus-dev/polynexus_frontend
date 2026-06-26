import { ArrowRight, Play, Cpu, Database, Globe, Zap, Sparkles, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import cognitiveMockup from '../assets/cognitive_query.png';
import atlasMockup from '../assets/atlas_sync.png';
import aegisMockup from '../assets/aegis_proxy.png';
import pench from '../assets/projects/pench.png';
import { useState, useEffect } from 'react';
import { fetchProjects, fetchHeroInfo, getIconComponent, type Project, type HeroInfo } from '../api';

export default function Hero() {
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [heroInfo, setHeroInfo] = useState<HeroInfo | null>(null);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        // filter projects that have a file field (designated for Hero mockups)
        const heroProjs = data.filter((p) => p.file);
        if (heroProjs.length > 0) {
          setProjects(heroProjs);
        }
      })
      .catch((err) => {
        console.error('Error fetching hero projects:', err);
      });

    fetchHeroInfo()
      .then((data) => {
        setHeroInfo(data);
      })
      .catch((err) => {
        console.error('Error fetching hero info:', err);
      });
  }, []);

  const staticProjects: Project[] = [
    {
      id: 99906,
      title: 'Cognitive Query API',
      image: pench,
      file: 'cognitive-query-api.sh',
      desc: 'Edge-rendered semantic vector indexing console',
      metric: '0.15ms resolution',
      icon: Cpu,
      category: 'ai',
      tech: [],
      metricLabel: 'Vector Resolution'
    },
    {
      id: 99907,
      title: 'Atlas DB Sync Tool',
      image: atlasMockup,
      file: 'atlas-db-sync.sh',
      desc: 'Active-active cloud cluster transactional log synchronizer',
      metric: '100% ACID consistency',
      icon: Database,
      category: 'devtools',
      tech: [],
      metricLabel: 'ACID Consistency'
    },
    {
      id: 99908,
      title: 'Aegis Proxy Layer',
      image: aegisMockup,
      file: 'aegis-proxy-gateway.sh',
      desc: 'Serverless DNS validation and DDOS prevention portal',
      metric: '48Tbps mitigation cap',
      icon: Globe,
      category: 'infra',
      tech: [],
      metricLabel: 'Cap Mitigation'
    }
  ];

  const currentProjects = projects.length > 0 ? projects : staticProjects;
  const current = currentProjects[activeProjectIdx] || currentProjects[0];

  const getIconColor = (iconComponent: any) => {
    if (iconComponent === Database) return 'text-[#E27000]';
    if (iconComponent === Globe) return 'text-purple-500';
    return 'text-secondary';
  };

  const ActiveIcon = current.icon || Cpu;

  return (
    <section className="relative min-h-screen pt-40 pb-28 flex items-center bg-slate-50/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        {/* Advanced gradient mesh glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] aspect-square rounded-full bg-gradient-to-tr from-secondary/15 to-cyan-300/10 blur-[140px] mix-blend-multiply opacity-75 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-accent/15 to-purple-300/10 blur-[140px] mix-blend-multiply opacity-75 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40%] aspect-square rounded-full bg-[#45C7AC]/5 blur-[120px] pointer-events-none" />

        {/* Precise High-tech Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-80" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Headline and CTAs */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-linear-to-r from-secondary/10 to-[#00c2ff]/10 border border-secondary/20 text-primary text-[10px] font-bold uppercase tracking-wide mb-6 shadow-sm shadow-secondary/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              {heroInfo?.badge || "CO-CREATING DIGITAL EXCELLENCE"}
            </div>

            <h1 className="text-4xl sm:text-[50px] font-extrabold text-primary tracking-tight leading-[1.1] md:leading-[1.08]">
              {heroInfo?.title_prefix || "Building "}{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary via-[#35b399] to-[#00c2ff] bg-bg-size-[200%] animate-pulse">
                {heroInfo?.title_highlight || "custom software"}
              </span>{" "}
              {heroInfo?.title_suffix || " to maximize your business impact"}
            </h1>

            <p className="mt-6 text-lg sm:text-sm text-slate-650 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {heroInfo?.subtitle || "We deeply understand your unique operational bottlenecks and design tailored engineering pathways to solve them. Skip rigid, off-the-shelf limitations and scale with bespoke solutions built strictly around your users, your workflows, and your long-term goals."}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href={heroInfo?.cta1_link || "#contact"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-secondary text-primary hover:bg-[#35b399] font-bold px-8 py-4 rounded-xl transition-all duration-250 hover:-translate-y-1 hover:shadow-xl hover:shadow-secondary/25 shadow-lg shadow-secondary/15 text-[13px]"
              >
                {heroInfo?.cta1_text || "Get Your Custom Solution"}
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href={heroInfo?.cta2_link || "#services"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-primary font-semibold px-8 py-4 rounded-xl transition-all duration-250 hover:-translate-y-1 shadow-sm hover:shadow-md text-[13px]"
              >
                <Play className="w-4 h-4 text-accent fill-accent" />
                {heroInfo?.cta2_text || "View Our Services"}
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-slate-200/80 max-w-xl mx-auto lg:mx-0">
              <div className="grid grid-cols-3 gap-4 text-left">
                {(heroInfo?.trust_indicators || [
                  { label: "Core Team", value: "100% Expert Led", icon: "Sparkles", color: "text-secondary" },
                  { label: "Performance", value: "1.2ms Latency", icon: "Zap", color: "text-[#E27000]" },
                  { label: "Availability", value: "99.99% SLA", icon: "Activity", color: "text-purple-500" }
                ]).map((indicator, index) => {
                  const IndicatorIcon = getIconComponent(indicator.icon);
                  return (
                    <div key={index} className="flex flex-col gap-1.5 p-3 rounded-2xl bg-white/40 border border-slate-200/50 backdrop-blur-[2px] transition-all hover:bg-white/70 hover:shadow-sm">
                      <div className="flex items-center gap-2">
                        <IndicatorIcon className={`w-4 h-4 ${indicator.color}`} />
                        <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono">{indicator.label}</span>
                      </div>
                      <span className="text-sm font-bold text-primary leading-tight">{indicator.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive Graphic / App Teaser Dashboard */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="relative w-full max-w-full bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-3xl p-6 shadow-2xl shadow-slate-200/60 hover:shadow-secondary/10 hover:-translate-y-1 transition-all duration-350 ease-out group/card">
              {/* Outer decorative card glow */}
              <div className="absolute -inset-px bg-gradient-to-tr from-secondary/20 via-transparent to-accent/15 rounded-3xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none animate-in fade-in" />

              {/* Top window styling */}
              <div className="relative z-10 flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex gap-1.5 flex-1">
                  <span className="w-3 h-3 rounded-full bg-red-400/90 transition-transform hover:scale-110 cursor-pointer" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/90 transition-transform hover:scale-110 cursor-pointer" />
                  <span className="w-3 h-3 rounded-full bg-green-400/90 transition-transform hover:scale-110 cursor-pointer" />
                </div>
                <div className="text-xs text-slate-400 font-mono flex-1 text-center truncate select-none">
                  {current.file}
                </div>
                <div className="flex-1 flex justify-end">
                  <ActiveIcon className={`w-4 h-4 ${getIconColor(ActiveIcon)}`} />
                </div>
              </div>

              {/* Mockup Presentation */}
              <Link 
                to={`/project/${current.id}`}
                className="block relative z-10 aspect-video w-full bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner shadow-black/80 group-hover/card:border-secondary/30 transition-all duration-300"
                title={`View ${current.title} case study`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-accent/5 opacity-40 pointer-events-none z-10" />
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover object-top transition-all duration-700 ease-out transform group-hover/card:scale-[1.03]"
                  key={activeProjectIdx}
                />
              </Link>

              {/* Interactive Tabs */}
              <div className="relative z-10 mt-6">
                <div className="flex gap-2 p-1 bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-100">
                  {currentProjects.map((proj, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveProjectIdx(idx)}
                      className={`flex-1 text-center py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 select-none ${activeProjectIdx === idx
                        ? 'bg-secondary text-primary font-bold shadow-sm shadow-secondary/15'
                        : 'text-slate-500 hover:text-slate-850 hover:bg-slate-100/40'
                        }`}
                    >
                      {proj.title.replace(' Tool', '').replace(' API', '').replace(' Layer', '').replace(' Decentralized Proxy', ' Proxy')}
                    </button>
                  ))}
                </div>


              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
