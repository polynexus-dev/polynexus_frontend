import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, FolderGit, Database, Cpu, Globe, Zap } from 'lucide-react';
import { fetchProjects, type Project } from '../api';
import cognitiveMockup from '../assets/cognitive_query.png';
import atlasMockup from '../assets/atlas_sync.png';
import aegisMockup from '../assets/aegis_proxy.png';
import neuroflowMockup from '../assets/neuroflow.png';
import viteBridgeMockup from '../assets/vite_bridge.png';
import heliosMockup from '../assets/helios.png';

export default function Projects() {
  const [filter, setFilter] = useState<'all' | 'enterprise' | 'logistics' | 'saas'>('all');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch((err) => {
        console.error('Error fetching projects:', err);
        // Fallback to static dummy data if API fails
        setProjects([
          {
            id: 99901,
            title: 'Mail Service Software',
            category: 'saas',
            desc: 'High-throughput enterprise mail server software supporting transactional relays and spam-filtering layers.',
            metric: '99.999%',
            metricLabel: 'Uptime Delivery',
            icon: Zap,
            tech: ['Node.js', 'Redis', 'SMTP', 'Docker'],
            image: cognitiveMockup
          },
          {
            id: 99902,
            title: 'Pench Milk Delivery System',
            category: 'logistics',
            desc: 'Custom route optimization and subscription management system for dairy distribution operations.',
            metric: '10k+ Liters/Day',
            metricLabel: 'Milk Distributed',
            icon: Database,
            tech: ['React Native', 'Django', 'PostgreSQL', 'Google Maps API'],
            image: atlasMockup
          },
          {
            id: 99903,
            title: 'Enterprise ERP Software',
            category: 'enterprise',
            desc: 'Modular management tool synchronizing production schedules, ledger accounting, and raw material inventory.',
            metric: '35%',
            metricLabel: 'Operational Savings',
            icon: Cpu,
            tech: ['PostgreSQL', 'React', 'Python', 'Django'],
            image: aegisMockup
          },
          {
            id: 99904,
            title: 'Enterprise CRM Software',
            category: 'enterprise',
            desc: 'Customer relationship platform tracking sales pipelines, support interactions, and agent response latency.',
            metric: '18x',
            metricLabel: 'Sales Conversion',
            icon: Globe,
            tech: ['React', 'TypeScript', 'WebSockets', 'Django REST'],
            image: neuroflowMockup
          },
          {
            id: 99905,
            title: 'Moto Bee Garage System',
            category: 'logistics',
            desc: 'Custom software for garage owners featuring a real-time parts inventory dashboard and mobile app for mechanics.',
            metric: '< 5s',
            metricLabel: 'Dispatch Latency',
            icon: FolderGit,
            tech: ['Flutter', 'Go', 'Firebase', 'Polynexus Edge'],
            image: viteBridgeMockup
          },
          {
            id: 99909,
            title: 'Campus Flow',
            category: 'enterprise',
            desc: 'College & School management system managing member directory, student/teacher attendance, lecture schedules, and grading.',
            metric: '99.8%',
            metricLabel: 'Attendance Accuracy',
            icon: Globe,
            tech: ['Django', 'React', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
            image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250'
          }
        ]);
      });
  }, []);

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 reveal">
          <span className="text-sm font-bold text-secondary uppercase tracking-wider">Proof of Performance</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Powering industry-scale implementations
          </h2>
          <p className="text-slate-500 mt-4">
            See how partners integrate Polynexus core modules into their production, security, and neural training topologies.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {([
            { id: 'all', label: 'All Projects' },
            { id: 'enterprise', label: 'Enterprise Management' },
            { id: 'logistics', label: 'Custom Operations & Logistics' },
            { id: 'saas', label: 'Productivity & B2B SaaS' }
          ] as const).map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 ${
                filter === btn.id
                  ? 'bg-secondary border-secondary text-primary font-bold shadow-md shadow-secondary/15'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-350'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
          {filteredProjects.map((project, idx) => {
            const ProjIcon = project.icon;
            return (
              <div
                key={idx}
                className="group bg-white border border-slate-200/80 hover:border-[#45C7AC]/30 hover:-translate-y-2 hover:shadow-xl hover:shadow-secondary/5 rounded-2xl p-6 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div>
                  {/* Project Image Viewport */}
                  <Link to={`/project/${project.id}`} className="block relative aspect-video w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-100 mb-4 shadow-sm group-hover:shadow-md transition-all duration-300">
                    <div className="absolute inset-0 bg-linear-to-tr from-secondary/5 to-accent/5 opacity-30 pointer-events-none z-10" />
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    />
                  </Link>

                  {/* Category & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider font-mono">
                      {project.category}
                    </span>
                    <div className="p-2 rounded-lg bg-slate-200/60 text-slate-500 group-hover:text-secondary transition-colors duration-200">
                      <ProjIcon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-secondary transition-colors duration-200">
                    <Link to={`/project/${project.id}`} className="hover:underline">
                      {project.title}
                    </Link>
                  </h3>
                  <p className="text-slate-500 text-xs mt-2.5 leading-relaxed">
                    {project.desc}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tech.map((t, idx_t) => (
                      <span
                        key={idx_t}
                        className="text-[9px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metric footer */}
                <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="block text-lg font-bold text-slate-800 font-mono leading-none">
                      {project.metric}
                    </span>
                    <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1 block">
                      {project.metricLabel}
                    </span>
                  </div>
                  <Link
                    to={`/project/${project.id}`}
                    className="p-2 rounded-lg bg-slate-200/60 text-slate-500 hover:text-[#45C7AC] hover:bg-slate-200 transition-all duration-205"
                    aria-label={`View ${project.title} case study`}
                  >
                    <ExternalLink className="w-4 h-4" />
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
