import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Search, Code, Rocket, HeadphonesIcon, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Discovery Call',
    subtitle: '< 15 min response',
    desc: 'Share your operational bottlenecks, scale goals, and timeline. We ask the right questions to fully understand your business logic — not just the tech brief.',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
    border: 'border-secondary/25',
  },
  {
    number: '02',
    icon: Search,
    title: 'Technical Scoping',
    subtitle: '24–48 hrs',
    desc: 'Our architects map your data flows, integration requirements, and security boundaries. You receive a detailed technical proposal with timeline and pricing.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    number: '03',
    icon: Code,
    title: 'Agile Build',
    subtitle: 'Sprint-based delivery',
    desc: 'Development runs in 2-week sprints with live preview deployments. You see real progress every fortnight — no black-box development.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'QA & Security Review',
    subtitle: 'Before every release',
    desc: 'Every build passes automated test coverage, manual QA, and a security audit before it touches your production environment.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    number: '05',
    icon: Rocket,
    title: 'Production Launch',
    subtitle: 'Zero-downtime',
    desc: 'We deploy using containerized infrastructure with staged rollouts and instant rollback capability — so launch day is a non-event.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    number: '06',
    icon: HeadphonesIcon,
    title: 'Ongoing Support',
    subtitle: 'SLA-backed',
    desc: 'Post-launch support with defined SLAs, proactive monitoring, performance reporting, and a dedicated engineering contact for escalations.',
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
];

export default function HowWeWork() {
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
    <section ref={sectionRef} id="process" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3.5 py-1.5 rounded-full">
            Our Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mt-4 mb-3">
            How we go from idea to production
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            A structured, transparent delivery model. No surprises, no scope creep, no black-box sprints.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className={`relative p-7 bg-slate-50/60 border ${step.border} rounded-2xl hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group
                  ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${idx * 80}ms` }}
              >
                {/* Step number watermark */}
                <span className="absolute top-5 right-6 text-5xl font-black text-slate-100 select-none group-hover:text-slate-200 transition-colors">
                  {step.number}
                </span>

                <div className={`inline-flex p-2.5 rounded-xl ${step.bg} mb-5`}>
                  <Icon className={`w-5 h-5 ${step.color}`} />
                </div>

                <h3 className="text-base font-bold text-primary mb-0.5">{step.title}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${step.color}`}>{step.subtitle}</span>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA below process */}
        <div className={`mt-14 text-center transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-slate-500 text-sm mb-6">
            Ready to start Step 1? It costs you nothing but 15 minutes.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 bg-secondary text-primary hover:bg-[#35b399] font-bold px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg shadow-secondary/20 text-sm"
          >
            <MessageSquare className="w-4 h-4" />
            Schedule Discovery Call
          </a>
        </div>
      </div>
    </section>
  );
}
