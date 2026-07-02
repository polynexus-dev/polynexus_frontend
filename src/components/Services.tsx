import { useState, useEffect } from 'react';
import { Layers, Database, Shield, Zap, Terminal, ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchServices, type Service } from '../api';

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchServices()
      .then(setServices)
      .catch((err) => {
        console.error('Error fetching services:', err);
        // Fallback to static dummy data if API fails
        setServices([
          {
            id: 'design',
            icon: Zap,
            title: 'Adaptive Design Systems',
            shortDesc: 'Architecting flexible, component-based user interfaces that evolve with your business logic and brand identity.',
            fullDesc: 'Build unified component ecosystems, flexible UI architecture, and automated design token deployment pipelines that scale across mobile, web, and enterprise surfaces seamlessly.',
            features: ['Automated component assembly pipelines', 'Adaptive styling token generation', 'Comprehensive cross-platform layout APIs'],
            specs: { Framework: 'React / Tailwind v4', Speed: '100% Core Performance', Accessibility: 'WCAG AA Compliant' }
          },
          {
            id: 'governance',
            icon: Database,
            title: 'Unified Data Governance',
            shortDesc: 'Designing centralized and secure data structures that break down silos across your operational ecosystem.',
            fullDesc: 'Establish structural transactional log audits, active-active cloud database partitions, and enterprise-grade schema lifecycle protocols with strict compliance.',
            features: ['Active-active multi-region syncing', 'Real-time schema trace logs', 'Cryptographic compliance validation'],
            specs: { Architecture: 'Distributed Sync', Auditing: 'Continuous Event Logs', Security: 'RBAC Access Policies' }
          },
          {
            id: 'security',
            icon: Shield,
            title: 'Secured Business Logic Pipelines',
            shortDesc: 'Implementing zero-trust architecture and cryptographic validation to protect your entire process workflow.',
            fullDesc: 'Protect data payloads, routine workflows, and custom backend modules using zero-trust function boundaries, E2EE parameters, and automated security scanning layers.',
            features: ['Zero-trust gateway authentication', 'AES-GCM-256 encrypted isolation', 'Continuous threat heuristic monitoring'],
            specs: { Protocol: 'WASM Isolation Boundary', Validation: '< 0.15ms runtime checks', Compliance: 'SOC2 / HIPAA native' }
          },
          {
            id: 'allocation',
            icon: Layers,
            title: 'Intelligent Resource Allocation',
            shortDesc: 'Dynamic and automated resource provisioning to ensure peak system performance and cost efficiency, tailored to demand.',
            fullDesc: 'Deploy and schedule background jobs onto low-cost, low-latency computing node clusters globally using neural routing models and CPU resource benchmarks.',
            features: ['AI-predictive routine routing', 'Self-healing cluster topologies', 'Sub-atomic runtime scheduling'],
            specs: { Engine: 'Neural scheduler', Protocols: 'gRPC / HTTP3 routing', Nodes: '14k+ active global servers' }
          }
        ]);
      });
  }, []);

  return (
    <section id="services" className="relative py-24 bg-white border-t border-slate-100">
      {/* Subtle decorative background mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#45C7AC]/5 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="text-xs font-bold tracking-wider text-secondary uppercase font-mono">Our Core Services</span>
          <h2 className="mt-2.5 text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
            Comprehensive solutions designed for bespoke business challenges
          </h2>
          <p className="mt-4 text-slate-500 text-sm leading-relaxed">
            The Polynexus service ecosystem moves beyond generic products, providing end-to-end, integrated
            strategies across design, security, optimization, and governance.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const delayClass = idx === 0 ? '' : idx === 1 ? 'reveal-delay-100' : idx === 2 ? 'reveal-delay-200' : 'reveal-delay-300';
            return (
              <div
                key={service.id}
                className={`reveal ${delayClass} group relative bg-slate-50/50 hover:bg-white border border-slate-200/60 hover:border-secondary/40 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-secondary/5 rounded-3xl p-6 transition-all duration-300 ease-out flex flex-col justify-between`}
              >
                <div>
                  {/* Icon badge */}
                  <div className="inline-flex p-2.5 rounded-xl bg-[#45C7AC]/10 text-secondary group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-primary mt-5 group-hover:text-secondary transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 mt-2 text-xs leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>
                
                {/* Footer specs log */}
                <div className="mt-8 pt-4 border-t border-slate-100/50 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-secondary hover:text-slate-800 transition-colors duration-200 cursor-pointer"
                  >
                    View Engineering Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold text-slate-400">POLYNEXUS_V2</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Engineering Modal / Expand Panel (Interactive Overlay) */}
        {selectedService && (
          <div className="fixed inset-0 z-50 bg-[#010B33]/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
              {/* Close Button */}
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors cursor-pointer"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 border-b border-slate-150 pb-6">
                <div className="p-3 rounded-xl bg-[#45C7AC]/10 text-secondary">
                  <selectedService.icon className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono">Polynexus Specsheet</span>
                  <h3 className="text-xl font-bold text-primary mt-0.5">{selectedService.title}</h3>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-slate-500 text-xs leading-relaxed">
                  {selectedService.fullDesc}
                </p>

                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mt-8 mb-4">Key Integration Pillars</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedService.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mt-8 mb-4 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-accent" />
                  Engineering Benchmarks
                </h4>
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {Object.entries(selectedService.specs).map(([key, val]) => (
                    <div key={key}>
                      <span className="block text-[9px] uppercase font-bold text-slate-400 tracking-wider font-mono">{key}</span>
                      <span className="text-xs font-bold text-slate-800 font-mono mt-1 block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedService(null)}
                  className="bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Spec
                </button>
                <Link
                  to="/#contact"
                  onClick={() => setSelectedService(null)}
                  className="bg-secondary text-primary hover:bg-[#35b399] px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  Deploy Module
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
