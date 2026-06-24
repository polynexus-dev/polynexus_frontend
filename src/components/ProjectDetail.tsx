import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Cpu, 
  Database, 
  Globe, 
  FolderGit, 
  Zap, 
  Shield, 
  ExternalLink, 
  Terminal, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Code,
  Sparkles,
  X
} from 'lucide-react';
import { fetchProject, type Project } from '../api';
import Header from './Header';
import Footer from './Footer';

// Fallback static project assets
import cognitiveMockup from '../assets/cognitive_query.png';
import atlasMockup from '../assets/atlas_sync.png';
import aegisMockup from '../assets/aegis_proxy.png';
import neuroflowMockup from '../assets/neuroflow.png';
import viteBridgeMockup from '../assets/vite_bridge.png';
import heliosMockup from '../assets/helios.png';
import pench from '../assets/projects/pench.png';

const SAMPLE_PRICING_TABLE_HTML = `<div class="max-w-4xl mx-auto my-4">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-0 border border-slate-200 rounded-3xl overflow-hidden shadow-xs bg-white text-center">
    
    <!-- Basic Tier -->
    <div class="p-6 text-center flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50/50 transition-colors duration-200">
      <div>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 font-sans">Basic</span>
        <div class="text-3xl font-extrabold text-slate-900 mb-6 font-mono select-all">$ 29</div>
        <ul class="space-y-3.5 text-xs text-slate-500 mb-6 font-sans">
          <li>1 full user</li>
          <li>1,000 Email Previews</li>
          <li>5 contacts per client</li>
          <li>5 coffee cups</li>
        </ul>
      </div>
      <button class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition-colors duration-200 cursor-pointer">
        Buy Now
      </button>
    </div>

    <!-- Standard Tier -->
    <div class="p-6 text-center flex flex-col justify-between bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-100/50 transition-colors duration-200">
      <div>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 font-sans">Standard</span>
        <div class="text-3xl font-extrabold text-slate-900 mb-6 font-mono select-all">$ 59</div>
        <ul class="space-y-3.5 text-xs text-slate-500 mb-6 font-sans">
          <li>10 full user</li>
          <li>2,000 Email Previews</li>
          <li>10 contacts per client</li>
          <li>10 coffee cups</li>
        </ul>
      </div>
      <button class="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition-colors duration-200 cursor-pointer shadow-xs shadow-blue-500/10">
        Buy Now
      </button>
    </div>

    <!-- Advanced Tier -->
    <div class="p-6 text-center flex flex-col justify-between hover:bg-slate-50/50 transition-colors duration-200">
      <div>
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 font-sans">Advanced</span>
        <div class="text-3xl font-extrabold text-slate-900 mb-6 font-mono select-all">$ 99</div>
        <ul class="space-y-3.5 text-xs text-slate-500 mb-6 font-sans">
          <li>20 full user</li>
          <li>Unlimited Email Previews</li>
          <li>Unlimited contacts per client</li>
          <li>100 coffee cups</li>
        </ul>
      </div>
      <button class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] py-2.5 rounded-xl uppercase tracking-wider transition-colors duration-200 cursor-pointer">
        Buy Now
      </button>
    </div>

  </div>
</div>`;

const STATIC_PROJECTS_FALLBACK: Record<string, Project & { id: number; longDesc?: string; benefits?: string[]; results?: string[] }> = {
  '99901': {
    id: 99901,
    title: 'Mail Service Software',
    category: 'saas',
    desc: 'High-throughput enterprise mail server software supporting transactional relays and spam-filtering layers.',
    metric: '99.999%',
    metricLabel: 'Uptime Delivery',
    icon: Zap,
    tech: ['Node.js', 'Redis', 'SMTP', 'Docker', 'Kubernetes'],
    image: cognitiveMockup,
    file: 'mail-delivery-service.sh',
    longDesc: 'Our Mail Service Software provides an enterprise-ready SMTP transaction gateway tailored for massive scale. By separating incoming relays from outgoing transactional queues, we achieved a resilient routing architecture that tolerates sudden load bursts and external API latencies. Additionally, we integrated a signature-based real-time spam filter running directly on memory caches for negligible processing delay.',
    benefits: [
      'Ensures transactional messages are delivered instantly, boosting user trust.',
      'Provides real-time security shielding against spam and threat payloads.'
    ],
    results: [
      'Delivered 99.999% uptime SLA continuously over 12 months.',
      'Reduced average delivery latency to under 350ms globally.'
    ],
    price: 'Starting from ₹599 / unit / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99902': {
    id: 99902,
    title: 'Pench Milk Delivery System',
    category: 'logistics',
    desc: 'Custom route optimization and subscription management system for dairy distribution operations.',
    metric: '10k+ Liters/Day',
    metricLabel: 'Milk Distributed',
    icon: Database,
    tech: ['React Native', 'Django', 'PostgreSQL', 'Google Maps API', 'Redis'],
    image: atlasMockup,
    file: 'pench-milk-system.py',
    longDesc: 'The Pench Milk Delivery System digitizes the distribution chain of fresh milk from farms to households. We built an offline-first mobile app for delivery agents, backed by a robust Django engine that handles daily route calculations based on geography, driver capacity, and current traffic conditions. An integrated customer portal allows flexible subscription management and instant notifications.',
    benefits: [
      'Optimizes delivery routes automatically to decrease logistics overhead.',
      'Guarantees reliable offline functionality for remote updates.'
    ],
    results: [
      'Optimized daily delivery miles by 24%, reducing vehicle fuel overheads.',
      'Successfully scaling distributions past 10,000 liters of milk per day.'
    ],
    price: 'Starting from ₹199 / user / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99903': {
    id: 99903,
    title: 'Enterprise ERP Software',
    category: 'enterprise',
    desc: 'Modular management tool synchronizing production schedules, ledger accounting, and raw material inventory.',
    metric: '35%',
    metricLabel: 'Operational Savings',
    icon: Cpu,
    tech: ['PostgreSQL', 'React', 'Python', 'Django', 'REST API'],
    image: aegisMockup,
    file: 'enterprise-erp-core.py',
    longDesc: 'This bespoke Enterprise ERP solution unifies fragmented workflows within heavy manufacturing environments. By integrating raw inventory ledgers directly with machine scheduling, the plant managers gain automatic forecasting on stock levels, labor requirements, and machinery load. A double-entry accounting engine underpins every invoice and purchase order, ensuring total transparency.',
    benefits: [
      'Unifies all regional office records into a singular, high-speed data source.',
      'Automates auditing procedures to prevent stock and invoice drifts.'
    ],
    results: [
      'Generated 35% operational savings by eliminating raw material inventory surplus.',
      'Decreased month-end closing cycles from 12 days to just 2 hours.'
    ],
    price: 'Starting from ₹999 / enterprise / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99904': {
    id: 99904,
    title: 'Enterprise CRM Software',
    category: 'enterprise',
    desc: 'Customer relationship platform tracking sales pipelines, support interactions, and agent response latency.',
    metric: '18x',
    metricLabel: 'Sales Conversion',
    icon: Globe,
    tech: ['React', 'TypeScript', 'WebSockets', 'Django REST', 'Redis'],
    image: neuroflowMockup,
    file: 'crm-pipeline-optimizer.sh',
    longDesc: 'A fast, real-time CRM platform targeting quick-response support desks and modern sales operations. Incorporating WebSockets for instantaneous lead updates and in-app messaging, agents can respond to customers in seconds. Interactive dashboard widgets break down sales metrics, conversation durations, and pipeline status dynamically.',
    benefits: [
      'Enables instantaneous client tracking to maximize sales pipeline velocity.',
      'Reduces client support queue waiting times automatically.'
    ],
    results: [
      'Increased overall sales conversions by 18x through lead response automation.',
      'Reduced support ticket queue times by 40% using priority queuing logic.'
    ],
    price: 'Starting from ₹799 / user / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99905': {
    id: 99905,
    title: 'Moto Bee Garage System',
    category: 'logistics',
    desc: 'Custom software for garage owners featuring a real-time parts inventory dashboard and mobile app for mechanics.',
    metric: '< 5s',
    metricLabel: 'Dispatch Latency',
    icon: FolderGit,
    tech: ['Flutter', 'Go', 'Firebase', 'Polynexus Edge'],
    image: viteBridgeMockup,
    file: 'garage-mechanic-sync.sh',
    longDesc: 'The Moto Bee Garage System empowers auto repair shops with modern resource and inventory control. Mechanics use a custom mobile application to claim jobs, scan auto parts barcodes, and record service notes, while garage managers oversee operations, staff capacity, and parts catalog values from a comprehensive desktop dashboard.',
    benefits: [
      'Enables instant parts inventory synchronization to speed up repairs.',
      'Provides a durable mobile application optimized for mechanic service bays.'
    ],
    results: [
      'Reduced parts dispatch and order matching times to under 5 seconds.',
      'Increased mechanic utilization and bay turnover rates by 30%.'
    ],
    price: 'Starting from ₹299 / employee / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99906': {
    id: 99906,
    title: 'Cognitive Query API',
    category: 'saas',
    desc: 'Edge-rendered semantic vector indexing console for search engines.',
    metric: '0.15ms',
    metricLabel: 'Vector Resolution',
    icon: Cpu,
    tech: ['Vite', 'React', 'Node.js', 'Vector DB', 'Rust'],
    image: pench,
    file: 'cognitive-query-api.sh',
    longDesc: 'Cognitive Query API delivers high-frequency semantic index updates to core search backends. Built around an optimized vector distance engine running near the client edge, search inputs yield conceptual matching results within fraction of a millisecond. Perfect for enterprise catalogs and localized semantic lookups.',
    benefits: [
      'Delivers ultra-fast search results, improving customer retrieval latency.',
      'Reduces infrastructure and hosting constraints by 45% compared to monolithic setups.'
    ],
    results: [
      'Achieved a blazing fast 0.15ms average lookup query latency.',
      'Lowered infrastructure hosting costs by 45% compared to monolithic setups.'
    ],
    price: 'Starting from ₹199 / user / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99907': {
    id: 99907,
    title: 'Atlas DB Sync Tool',
    category: 'logistics',
    desc: 'Active-active cloud cluster transactional log synchronizer.',
    metric: '100%',
    metricLabel: 'ACID Consistency',
    icon: Database,
    tech: ['PostgreSQL', 'Vite', 'TypeScript', 'Go', 'gRPC'],
    image: atlasMockup,
    file: 'atlas-db-sync.sh',
    longDesc: 'Atlas DB Sync ensures multi-region databases remain perfectly in sync without data conflict or downtime. Utilizing customized write-ahead log tailing and lightning-fast gRPC transport pipelines, write requests made in Europe propagate and settle in Asian databases with strict transactional isolation and consistency.',
    benefits: [
      'Guarantees multi-region database replication consistency without edits overlap.',
      'Maintains complete operational uptime during network split-brain scenarios.'
    ],
    results: [
      'Maintained 100% ACID consistency without a single database drift issue.',
      'Processed continuous synchronizations at rates exceeding 50,000 transactions/sec.'
    ],
    price: 'Starting from ₹199 / user / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99908': {
    id: 99908,
    title: 'Aegis Proxy Layer',
    category: 'enterprise',
    desc: 'Serverless DNS validation and DDOS prevention portal.',
    metric: '48Tbps',
    metricLabel: 'Mitigation Cap',
    icon: Globe,
    tech: ['Cloudflare Workers', 'Go', 'Kubernetes', 'eBPF'],
    image: aegisMockup,
    file: 'aegis-proxy-gateway.sh',
    longDesc: 'Aegis Proxy sits at the edge of the corporate network, scanning incoming traffic patterns to identify, isolate, and terminate malicious requests before they exhaust application capacity. By implementing eBPF kernel hooks, traffic scrubbers operate directly in the network driver path, guaranteeing incredible scaling capability.',
    benefits: [
      'Sustains volumetric DDoS blocking thresholds, keeping applications active.',
      'Guarantees client requests are routed safely without delay.'
    ],
    results: [
      'Successfully sustained simulated 48Tbps DDoS volumetric blockages.',
      'Guaranteed average routing overhead remains under 1ms.'
    ],
    price: 'Starting from ₹199 / user / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99909': {
    id: 99909,
    title: 'Campus Flow',
    category: 'enterprise',
    desc: 'College & School management system managing member directory, student/teacher attendance, lecture schedules, and grading.',
    metric: '99.8%',
    metricLabel: 'Attendance Accuracy',
    icon: Globe,
    tech: ['Django', 'React', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=400&h=250',
    file: 'campus-flow-directory.sh',
    longDesc: 'Campus Flow is a comprehensive management platform designed for universities and schools. It unifies high-capacity student registries with automated staff attendance verification, daily lecture timetabling, and direct communication relays. By building a fast edge-indexed registry database, administrative workloads and student query latencies have been significantly minimized.',
    benefits: [
      'Simplifies school operations by consolidating student, staff, and lecture data.',
      'Maintains precise daily attendance records with automated reports.',
      'Provides real-time schedule relays for smooth academic course tracking.'
    ],
    results: [
      'Improved administrative staff productivity by 40%.',
      'Achieved 99.8% attendance recording accuracy and reduced reporting latency.'
    ],
    price: 'Starting from ₹199 / user / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  }
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<(Project & { longDesc?: string; benefits?: string[]; results?: string[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) {
      setError('No project ID provided.');
      setLoading(false);
      return;
    }

    // Check if it's a fallback ID
    if (STATIC_PROJECTS_FALLBACK[id]) {
      setProject(STATIC_PROJECTS_FALLBACK[id]);
      setLoading(false);
      return;
    }

    // Try fetching from database API
    setLoading(true);
    fetchProject(id)
      .then((data) => {
        setProject(data);
        setError(null);
      })
      .catch((err) => {
        console.warn('Backend fetch failed, searching static fallbacks by matching title/ID:', err);
        // Fallback search logic: if numeric ID matches part of static fallback
        const matched = Object.values(STATIC_PROJECTS_FALLBACK).find(
          (p) => String(p.id).endsWith(id) || p.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(id.toLowerCase())
        );
        if (matched) {
          setProject(matched);
          setError(null);
        } else {
          setError('Project not found. Please verify the URL or ensure the backend server is running.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-[#010B33] flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center py-40">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium font-mono animate-pulse">Loading case study specsheet...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 text-[#010B33] flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center py-40">
          <div className="max-w-md w-full px-6 text-center">
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl mb-6">
              <p className="text-sm font-semibold">{error || 'Unable to retrieve project details.'}</p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#010B33] text-white hover:bg-slate-800 font-bold px-6 py-3 rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Landing Page
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get project icon component
  const ProjIcon = project.icon || Cpu;

  return (
    <div className="min-h-screen bg-slate-50 text-[#010B33] selection:bg-[#45C7AC]/30 selection:text-[#010B33] font-sans antialiased">
      <Header />

      {/* Decorative BG mesh */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-tr from-secondary/10 to-cyan-300/5 blur-[120px] mix-blend-multiply opacity-60" />
        <div className="absolute top-[20%] right-[-10%] w-[50%] aspect-square rounded-full bg-gradient-to-br from-accent/10 to-purple-300/5 blur-[120px] mix-blend-multiply opacity-60" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-40 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_60%,transparent_100%)]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-secondary font-semibold transition-colors duration-200 mb-8 mt-4 group"
        >
          <ArrowLeft className="w-4.5 h-4.5 transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Projects
        </Link>

        {/* Project Header section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-accent bg-accent/10 uppercase tracking-wider font-mono mb-4">
              <ProjIcon className="w-3.5 h-3.5" />
              {project.category}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
              {project.title}
            </h1>
            <p className="text-lg text-slate-500 mt-6 leading-relaxed max-w-3xl">
              {project.desc}
            </p>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2.5 mt-8">
              {project.tech.map((t, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1 text-xs font-mono text-slate-650 bg-white border border-slate-200 shadow-sm px-3.5 py-1.5 rounded-xl"
                >
                  <Code className="w-3.5 h-3.5 text-secondary" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Metrics Panel */}
          <div className="lg:col-span-4 w-full">
            <div className="relative group bg-white border border-slate-200/80 hover:border-secondary/25 shadow-lg rounded-3xl p-8 overflow-hidden transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full pointer-events-none" />
              <span className="text-xs font-bold text-slate-455 uppercase tracking-wider block font-mono mb-2">Key Value Accomplished</span>
              <div className="text-5xl font-extrabold text-slate-900 font-mono tracking-tight leading-none mb-2 select-all">
                {project.metric}
              </div>
              <div className="text-sm font-bold text-secondary uppercase tracking-wider">
                {project.metricLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Primary Case Study Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Detailed Content column */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Overview Section */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5 text-secondary" />
                Project Overview
              </h2>
              <div className="text-slate-500 text-sm leading-relaxed space-y-4 font-normal">
                <p>
                  {project.longDesc || `This client engagement involved designing, deploying, and optimizing a specialized ${project.category} platform around the specific operational requirements of our partners.`}
                </p>
                <p>
                  By deploying a modular microservices framework and integrating real-time telemetry analytics, the software manages transaction paths, validates workflows, and offers deep-dives into execution status without performance bottlenecks.
                </p>
              </div>
            </section>

            {/* Benefits Section */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-secondary animate-pulse" />
                Key Benefits & Value Proposition
              </h2>
              <ul className="space-y-4">
                {(project.benefits || [
                  `Enables seamless scaling of system workloads to maximize operational capabilities.`,
                  `Ensures high-availability routing globally for a smooth customer experience.`
                ]).map((benefit, idx) => (
                  <li key={idx} className="flex gap-3 text-slate-500 text-sm leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary text-xs font-mono font-bold mt-0.5">
                      ✓
                    </span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Key Deliverables & Results */}
            <section className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                Measurable Outcomes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(project.results || [
                  `Optimized overall processing execution speed by 35%.`,
                  `Reduced operational overhead and data storage constraints by 20%.`
                ]).map((result, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-slate-650 text-xs font-medium leading-relaxed">{result}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Visual Showcase column (Mockup / Terminal) */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Project Image Frame */}
            <div className="relative group bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-linear-to-tr from-secondary/5 to-accent/5 opacity-40 pointer-events-none z-10" />
              
              {/* Header simulation bar */}
              <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-3.5 flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>
                <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#45C7AC] rounded-full animate-ping" />
                  CASE_STUDY_MOCKUP.PNG
                </span>
              </div>

              {/* Showcase Image Viewport */}
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* Terminal console demo */}
            {project.file && (
              <div className="bg-[#030712] border border-slate-850 rounded-3xl overflow-hidden shadow-xl text-left">
                <div className="bg-slate-950/80 border-b border-slate-900 px-4 py-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 font-mono flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-secondary" />
                    INTEGRATION_CONSOLE
                  </span>
                  <span className="text-[9px] text-[#45C7AC] font-mono bg-[#45C7AC]/10 border border-[#45C7AC]/20 px-2 py-0.5 rounded">
                    Active Relays
                  </span>
                </div>
                <div className="p-5 font-mono text-xs text-slate-350 space-y-4 overflow-x-auto leading-relaxed select-all">
                  <div>
                    <span className="text-secondary font-bold">~</span>
                    <span className="text-slate-100 ml-2">curl -X GET https://api.polynexus.com/v1/relays/{project.file} \</span>
                  </div>
                  <div>
                    <span className="text-slate-450 ml-4">-H "Authorization: Bearer $TOKEN"</span>
                  </div>
                  <div className="pt-2 text-[11px] text-[#45C7AC] border-t border-slate-900">
                    <div>{"{"}</div>
                    <div className="pl-4">"status": "Relay Operational",</div>
                    <div className="pl-4">"target": "{project.title}",</div>
                    <div className="pl-4">"efficiency": "{project.metric}",</div>
                    <div className="pl-4">"dependencies_met": true</div>
                    <div>{"}"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Section Card */}
            {project.price && (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#45C7AC]/10 to-transparent rounded-bl-full pointer-events-none" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-2">PRICING STRUCTURE</span>
                
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{project.price}</span>
                </div>
                
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  Starting base licensing rate. Custom module configurations and scale agreements available.
                </p>

                {project.price_detail_html && (
                  <button
                    onClick={() => setIsPricingModalOpen(true)}
                    className="inline-flex items-center gap-2 justify-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
                  >
                    View Detailed Pricing Table
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Inquire CTA box */}
            <div className="bg-gradient-to-tr from-[#010B33] to-slate-900 border border-slate-850 rounded-3xl p-8 shadow-xl text-white">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono block mb-2">Build Your Vision</span>
              <h3 className="text-xl font-bold mb-4">Interested in acquiring or custom implementing?</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Let's discuss how Polynexus engineering frameworks can optimize your operations or talk about licensing/acquiring this software product for your organization.
              </p>
              <a 
                href="/#contact"
                className="inline-flex items-center gap-2 justify-center w-full bg-secondary hover:bg-[#35b399] text-primary font-extrabold text-sm py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
              >
                Inquire For Licensing & Purchase
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </main>

      {/* Detailed Pricing Modal */}
      {isPricingModalOpen && project && project.price_detail_html && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#010B33]/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsPricingModalOpen(false)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white border border-slate-200/80 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono block mb-1">Pricing Configuration Matrix</span>
                <h3 className="text-xl font-extrabold text-slate-900">{project.title} - Detailed Modules</h3>
              </div>
              <button
                onClick={() => setIsPricingModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content Viewport */}
            <div className="p-6 overflow-y-auto flex-grow prose prose-slate max-w-none">
              <div 
                dangerouslySetInnerHTML={{ __html: project.price_detail_html }}
                className="pricing-table-container"
              />
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-slate-150 flex items-center justify-between bg-slate-50/50">
              <div className="text-xs text-slate-500 font-mono">
                Base Rate: <span className="font-bold text-slate-900">{project.price}</span>
              </div>
              <button
                onClick={() => {
                  setIsPricingModalOpen(false);
                  const contactEl = document.getElementById('contact');
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    // Navigate to home and hash
                    window.location.href = '/#contact';
                  }
                }}
                className="bg-secondary hover:bg-[#35b399] text-primary font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
              >
                Inquire For Custom Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
