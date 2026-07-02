import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';

/* ──────────────────────────────────────────────
   Client / partner logos — using text-based
   representations with real brand color accents.
   Replace with actual logo files when available.
   ────────────────────────────────────────────── */
const clients = [
  { name: 'NovusAI', tagline: 'Platform Engineering', color: '#45C7AC' },
  { name: 'FlowState', tagline: 'Data Architecture', color: '#6366F1' },
  { name: 'Securitas', tagline: 'Zero-Trust Security', color: '#E27000' },
  { name: 'EdifyLearn', tagline: 'Campus ERP', color: '#10B981' },
  { name: 'SwiftDrop', tagline: 'Logistics Platform', color: '#3B82F6' },
  { name: 'VaultCore', tagline: 'Cloud Storage', color: '#EC4899' },
  { name: 'BuildMate', tagline: 'Custom SaaS', color: '#F59E0B' },
  { name: 'NexaHR', tagline: 'HR Automation', color: '#8B5CF6' },
];

const trustBadges = [
  { label: 'Clutch', sublabel: 'Top Developer', icon: '★', rating: '5.0', color: '#EF4444' },
  { label: 'GoodFirms', sublabel: 'Top Agency', icon: '●', rating: 'Top 10%', color: '#10B981' },
  { label: 'ISO 27001', sublabel: 'Security Standard', icon: '✦', rating: 'Aligned', color: '#6366F1' },
  { label: 'SOC2', sublabel: 'Compliance Ready', icon: '◆', rating: 'Native', color: '#F59E0B' },
];

export default function TrustedBy() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-white border-t border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center mb-10 transition-all duration-600 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px flex-1 max-w-16 bg-slate-200" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3">
              Trusted by teams at
            </span>
            <div className="h-px flex-1 max-w-16 bg-slate-200" />
          </div>
        </div>

        {/* Scrolling marquee of client logos */}
        <div className={`relative mb-14 transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex gap-4 overflow-hidden">
            <div className="flex gap-4 animate-[marquee_28s_linear_infinite] min-w-max">
              {[...clients, ...clients].map((client, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-6 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex-shrink-0 group hover:border-slate-300 transition-colors"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-800">{client.name}</span>
                    <span className="block text-[10px] text-slate-400 font-mono">{client.tagline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust / Award Badges */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {trustBadges.map((badge, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-slate-300 hover:shadow-sm transition-all"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0 font-black"
                style={{ backgroundColor: badge.color + '20', color: badge.color }}
              >
                {badge.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-800">{badge.label}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{badge.sublabel}</span>
                <span className="block text-[11px] font-bold mt-0.5" style={{ color: badge.color }}>{badge.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee keyframe */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
