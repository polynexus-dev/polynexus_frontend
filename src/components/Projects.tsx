import { Link } from 'react-router-dom';
import { Cpu, Database, Globe, Layers, ArrowRight } from 'lucide-react';
import campusScreenshot from '../assets/campus_screenshot.png';
import mailScreenshot from '../assets/mail_screenshot.png';
import viteBridgeMockup from '../assets/vite_bridge.png';
import neuroflowMockup from '../assets/neuroflow.png';

export default function Projects() {
  const products = [
    {
      title: 'CampusNexus',
      badge: 'University Administrative ERP',
      desc: 'An all-in-one educational management ecosystem designed for student record auditing, automated grading rubrics, attendance tracking, and fee collection.',
      image: campusScreenshot,
      icon: Cpu,
      link: '/campusnexus',
      metric: '500+ Students Min',
      metricLabel: 'Entry Requirement',
      accent: 'rgba(59,130,246,0.4)',
      accentText: 'text-blue-500',
    },
    {
      title: 'PolyMX Suite',
      badge: 'Secure Workspace Suite',
      desc: 'Our enterprise Zoho/Google alternative. Fully encrypted webmail, secure cloud drive storage, real-time shared office documents, calendars, and virtual meets.',
      image: mailScreenshot,
      icon: Database,
      link: '/polymx',
      metric: 'AES-256 Encrypted',
      metricLabel: 'Database Isolation',
      accent: 'rgba(16,185,129,0.4)',
      accentText: 'text-emerald-500',
    },
    {
      title: 'Logistics Suite',
      badge: 'Last-Mile & Subscription ERP',
      desc: 'Advanced last-mile delivery management. Features automated coordinate routing, geofenced dispatch zones, customer subscription engines, and rider app bridges.',
      image: viteBridgeMockup,
      icon: Globe,
      link: '/logistics',
      metric: '₹29 / Customer',
      metricLabel: 'Introductory Rate',
      accent: 'rgba(69,199,172,0.4)',
      accentText: 'text-[#45C7AC]',
    },
    {
      title: 'Custom Solutions',
      badge: 'Bespoke Software Engineering',
      desc: 'Custom corporate dashboard builds, API bridges for legacy data structures, zero-trust backend modules, and native mobile layouts constructed to order.',
      image: neuroflowMockup,
      icon: Layers,
      link: '/custom',
      metric: 'Tailored Scope',
      metricLabel: 'Bespoke Scoping',
      accent: 'rgba(236,72,153,0.4)',
      accentText: 'text-pink-500',
    },
  ];

  return (
    <section id="projects" className="py-24 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-1/3 left-[-10%] w-[40%] aspect-square rounded-full bg-slate-100 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-[-10%] w-[35%] aspect-square rounded-full bg-slate-100 blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-20 reveal">
          <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3.5 py-1.5 rounded-full">
            Our Core Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#010B33] mt-5 mb-4 font-display tracking-tight">
            High-Performance Product Foundations
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            Architected for scalability, zero-trust security compliance, and micro-animated responsive performance across all corporate surfaces.
          </p>
        </div>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 reveal">
          {products.map((product, idx) => {
            const ProductIcon = product.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white border border-slate-200/70 hover:border-slate-300 rounded-3xl p-6 sm:p-8 transition-all duration-350 ease-out flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div>
                  {/* Viewport for Mockup Screenshot */}
                  <Link
                    to={product.link}
                    className="block relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-100 mb-6 shadow-sm group-hover:shadow-md transition-all duration-350"
                    title={`View details for ${product.title}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 to-accent/5 opacity-30 pointer-events-none z-10" />
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>

                  {/* Header Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200/50 font-mono">
                      {product.badge}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 transition-colors group-hover:bg-[#45C7AC]/10 group-hover:text-secondary">
                      <ProductIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl font-extrabold text-[#010B33] font-display">
                    <Link to={product.link} className="hover:text-secondary hover:underline transition-colors duration-200">
                      {product.title}
                    </Link>
                  </h3>
                  
                  <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                    {product.desc}
                  </p>
                </div>

                {/* Footer specs & link button */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-lg font-black text-slate-800 font-mono leading-none">
                      {product.metric}
                    </span>
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1.5 block">
                      {product.metricLabel}
                    </span>
                  </div>

                  <Link
                    to={product.link}
                    className="inline-flex items-center gap-1 bg-[#010B33] hover:bg-slate-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all duration-200 hover:translate-x-0.5"
                  >
                    View Product
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
