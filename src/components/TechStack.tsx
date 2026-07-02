import { useEffect, useRef, useState } from 'react';

/* ── Technology logo badge data ── */
const technologies = [
  // Frontend
  { name: 'React', category: 'Frontend', color: '#61DAFB', bg: '#0d1117', abbr: 'Re' },
  { name: 'TypeScript', category: 'Frontend', color: '#3178C6', bg: '#1e293b', abbr: 'TS' },
  { name: 'Next.js', category: 'Frontend', color: '#ffffff', bg: '#000000', abbr: 'Nx' },
  { name: 'Tailwind', category: 'Frontend', color: '#38BDF8', bg: '#0f172a', abbr: 'TW' },
  // Backend
  { name: 'Python', category: 'Backend', color: '#FFD343', bg: '#1e293b', abbr: 'Py' },
  { name: 'Django', category: 'Backend', color: '#44B78B', bg: '#0f2b20', abbr: 'Dj' },
  { name: 'Node.js', category: 'Backend', color: '#539E43', bg: '#0a1f0d', abbr: 'No' },
  { name: 'FastAPI', category: 'Backend', color: '#009688', bg: '#001f1d', abbr: 'FA' },
  // Database
  { name: 'PostgreSQL', category: 'Database', color: '#336791', bg: '#0d1928', abbr: 'PG' },
  { name: 'Redis', category: 'Database', color: '#DC382D', bg: '#1a0000', abbr: 'Rd' },
  { name: 'MongoDB', category: 'Database', color: '#47A248', bg: '#071a07', abbr: 'Mg' },
  // Cloud / Infra
  { name: 'Docker', category: 'Infrastructure', color: '#2496ED', bg: '#031d2e', abbr: 'Dk' },
  { name: 'AWS', category: 'Infrastructure', color: '#FF9900', bg: '#1a0e00', abbr: 'AW' },
  { name: 'Nginx', category: 'Infrastructure', color: '#009639', bg: '#001209', abbr: 'Ng' },
  // Mobile
  { name: 'React Native', category: 'Mobile', color: '#61DAFB', bg: '#0d1117', abbr: 'RN' },
  { name: 'Flutter', category: 'Mobile', color: '#54C5F8', bg: '#081620', abbr: 'Fl' },
];

const categories = ['All', 'Frontend', 'Backend', 'Database', 'Infrastructure', 'Mobile'];

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const filtered = activeCategory === 'All'
    ? technologies
    : technologies.filter(t => t.category === activeCategory);

  return (
    <section ref={sectionRef} id="tech-stack" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-14 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3.5 py-1.5 rounded-full">
            Technology Stack
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mt-4 mb-3">
            Built on battle-tested foundations
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            We work with the world's most reliable, high-performance technologies — so your systems never become a bottleneck.
          </p>
        </div>

        {/* Category filter tabs */}
        <div className={`flex flex-wrap gap-2 justify-center mb-10 transition-all duration-700 delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-secondary text-primary shadow-md shadow-secondary/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-secondary/40 hover:text-secondary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tech grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {filtered.map((tech, idx) => (
            <div
              key={tech.name}
              className={`group flex flex-col items-center gap-2.5 p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-secondary/40 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 cursor-default
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${idx * 40}ms` }}
            >
              {/* Logo badge */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 shadow-sm"
                style={{ background: tech.bg, color: tech.color }}
              >
                {tech.abbr}
              </div>
              <span className="text-[11px] font-bold text-slate-700 text-center leading-tight group-hover:text-secondary transition-colors">
                {tech.name}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                {tech.category}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className={`text-center text-xs text-slate-400 mt-10 font-mono transition-all duration-700 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          + many more — we always recommend the right tool for the job, not the trendiest one
        </p>
      </div>
    </section>
  );
}
