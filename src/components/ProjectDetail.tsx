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
  Layers,
  CheckCircle2,
  ArrowRight,
  Code,
  Sparkles,
  X,
  Mail,
  Lock,
  Key,
  Fingerprint,
  Check
} from 'lucide-react';
import { fetchProject, type Project } from '../api';
import Header from './Header';
import Footer from './Footer';
import useScrollReveal from '../hooks/useScrollReveal';

// Fallback static project assets
import cognitiveMockup from '../assets/cognitive_query.png';
import atlasMockup from '../assets/atlas_sync.png';
import aegisMockup from '../assets/aegis_proxy.png';
import neuroflowMockup from '../assets/neuroflow.png';
import viteBridgeMockup from '../assets/vite_bridge.png';
import pench from '../assets/projects/pench.png';
import mailScreenshot from '../assets/mail_screenshot.png';
import campusScreenshot from '../assets/campus_screenshot.png';

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
    category: 'polynexus',
    desc: 'High-throughput enterprise secure mail server software supporting transactional relays, encrypted storage, and spam-filtering layers.',
    metric: '99.999%',
    metricLabel: 'Uptime Delivery',
    icon: Zap,
    tech: ['Node.js', 'Redis', 'SMTP', 'Docker', 'Secure Relay', 'Cryptography'],
    image: mailScreenshot,
    file: 'mail-delivery-service.sh',
    longDesc: 'Polynexus Secure Mail Service is a military-grade secure email server software designed for ultimate privacy and high deliverability. Utilizing elliptic curve cryptography for storage, zero-exposure metadata search databases, and secure TLS gateways, your email data is protected from physical drive theft and network eavesdropping. Fully powered by an optimized proprietary high-throughput delivery network, it guarantees industry-leading deliverability to Gmail, Outlook, and other networks while maintaining a highly profitable, scalable operation.',
    benefits: [
      'Protects inbox bodies and attachments using secure Elliptic Curve at-rest encryption.',
      'Ensures subjects and metadata indexes are stored encrypted, preventing database leaks.',
      'Secures login sessions with advanced Argon2/BCrypt hashing and isolated app-specific passwords.'
    ],
    results: [
      'Achieved 100% data confidentiality, verified by third-party storage audits.',
      'Sustained outbound deliverability rates at 99.99% using standard DKIM/SPF alignment.'
    ],
    price: 'Starting from ₹49 / user / month',
    price_detail_html: SAMPLE_PRICING_TABLE_HTML
  },
  '99902': {
    id: 99902,
    title: 'Pench Milk Delivery System',
    category: 'custom',
    desc: 'Custom route optimization and subscription management system for dairy distribution operations.',
    metric: '10k+ Liters/Day',
    metricLabel: 'Milk Distributed',
    icon: Database,
    tech: ['React Native', 'Django', 'PostgreSQL', 'Google Maps API', 'Redis'],
    image: pench,
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
    category: 'polynexus',
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
    category: 'polynexus',
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
    category: 'custom',
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
    category: 'polynexus',
    desc: 'Edge-rendered semantic vector indexing console for search engines.',
    metric: '0.15ms',
    metricLabel: 'Vector Resolution',
    icon: Cpu,
    tech: ['Vite', 'React', 'Node.js', 'Vector DB', 'Rust'],
    image: cognitiveMockup,
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
    category: 'polynexus',
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
    category: 'polynexus',
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
    title: 'Campus Nexus',
    category: 'polynexus',
    desc: 'College & School management system managing member directory, student/teacher attendance, lecture schedules, and grading.',
    metric: '99.8%',
    metricLabel: 'Attendance Accuracy',
    icon: Globe,
    tech: ['Django', 'React', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
    image: campusScreenshot,
    file: 'campus-nexus-directory.sh',
    longDesc: 'Campus Nexus is a comprehensive management platform designed for universities and schools. It unifies high-capacity student registries with automated staff attendance verification, daily lecture timetabling, and direct communication relays. By building a fast edge-indexed registry database, administrative workloads and student query latencies have been significantly minimized.',
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
  useScrollReveal();

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href === '/#contact' || href === '#contact') {
          e.preventDefault();
          setIsPricingModalOpen(false);
          navigate('/#contact');
        }
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [navigate]);

  const [project, setProject] = useState<(Project & { longDesc?: string; benefits?: string[]; results?: string[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [cfBilling, setCfBilling] = useState<'monthly' | 'annual'>('monthly');
  const [cfTab, setCfTab] = useState<'campus' | 'business'>('campus');
  const [mailBilling, setMailBilling] = useState<'monthly' | 'annual'>('annual');
  const [calcScale, setCalcScale] = useState(25);

  useEffect(() => {
    if (project) {
      const isMilk = project.title.toLowerCase().includes('milk');
      const isGarage = project.title.toLowerCase().includes('garage') || project.title.toLowerCase().includes('moto');
      setCalcScale(isMilk ? 1000 : isGarage ? 5 : 25);
    }
  }, [project]);

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

  const renderCampusNexusPricing = (isModalView = false) => {
    const isAnnual = cfBilling === 'annual';

    return (
      <div className={`w-full font-sans bg-slate-50 text-primary rounded-3xl overflow-hidden shadow-xs pb-12 ${isModalView ? '' : 'mt-16 border border-slate-200/80'}`}>
        {/* HERO */}
        <section className="bg-primary text-white text-center pt-[72px] px-6 pb-[56px] relative overflow-hidden select-none">
          <h1 className="text-3xl sm:text-[2.8rem] font-bold tracking-[-0.5px] mb-[14px] leading-tight">Plans & Pricing</h1>
          <p className="text-[1.1rem] text-slate-300 max-w-[560px] mx-auto mb-8 leading-[1.7]">
            Pay only for active students, employees, or units you manage. No hidden fees, no vendor lock-in.
          </p>
          <div className="inline-flex items-center bg-white/10 rounded-[50px] p-1 gap-1 border border-white/10">
            <button
              onClick={() => setCfBilling('monthly')}
              className={`px-[22px] py-2 rounded-[50px] border-none text-[0.9rem] font-semibold transition-all duration-200 cursor-pointer ${cfBilling === 'monthly' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-300 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCfBilling('annual')}
              className={`px-[22px] py-2 rounded-[50px] border-none text-[0.9rem] font-semibold transition-all duration-200 cursor-pointer flex items-center ${cfBilling === 'annual' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-300 hover:text-white'}`}
            >
              Annual
              <span className="bg-secondary/15 text-secondary text-[0.72rem] font-bold px-[9px] py-[3px] rounded-[50px] ml-1.5 align-middle">
                Save ~17%
              </span>
            </button>
          </div>
        </section>

        {/* SECTION TABS */}
        <div className="flex justify-center gap-3 pt-10 px-6 pb-0 select-none">
          <button
            onClick={() => setCfTab('campus')}
            className={`px-[28px] py-[9px] rounded-[50px] border-2 text-[0.88rem] font-semibold transition-all duration-200 cursor-pointer ${cfTab === 'campus' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'}`}
          >
            🎓 Campus Solutions
          </button>
          <button
            onClick={() => setCfTab('business')}
            className={`px-[28px] py-[9px] rounded-[50px] border-2 text-[0.88rem] font-semibold transition-all duration-200 cursor-pointer ${cfTab === 'business' ? 'bg-primary text-white border-primary' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'}`}
          >
            🏢 Business Solutions
          </button>
        </div>

        {/* CAMPUS SECTION */}
        {cfTab === 'campus' && (
          <div className="pt-8 px-6 pb-16 animate-in fade-in duration-200">
            <h2 className="text-center text-[1.5rem] font-bold mb-2 text-primary">Campus Solutions</h2>
            <p className="text-center text-slate-500 text-[0.95rem] mb-9">Built for colleges and institutions — attendance, operations, and managed mail.</p>

            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-3 lg:gap-2.5 max-w-7xl mx-auto px-2 lg:px-1">
              {/* Attendance Core */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border border-slate-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">Attendance Core</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">For institutions needing digital attendance only</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '19' : '29'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / student / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹29 / student / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Student</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Digital attendance tracking</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Student-wise records</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Admin dashboard</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Basic reports & exports</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Onboarding support</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-400 flex items-start gap-1.5 leading-normal"><span className="text-slate-300 text-[0.8rem] flex-shrink-0">✗</span> Mail service</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-400 flex items-start gap-1.5 leading-normal"><span className="text-slate-300 text-[0.8rem] flex-shrink-0">✗</span> Campus operations</li>
                  </ul>
                </div>
              </div>

              {/* Student Mail */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border border-slate-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">Student Mail</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">Managed email for student communication</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '22' : '29'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-455 block mt-0.5">
                      / student / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹29 / student / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Student</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Student mailboxes</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Webmail access</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Account provisioning</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Basic admin controls</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Migration assistance</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-400 flex items-start gap-1.5 leading-normal"><span className="text-slate-300 text-[0.8rem] flex-shrink-0">✗</span> Attendance tracking</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-400 flex items-start gap-1.5 leading-normal"><span className="text-slate-300 text-[0.8rem] flex-shrink-0">✗</span> Priority support</li>
                  </ul>
                </div>
              </div>

              {/* Campus Suite — POPULAR */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border-2 border-secondary relative transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-primary-foreground text-[0.65rem] font-extrabold px-3 py-0.5 rounded-full whitespace-nowrap tracking-wider font-mono">
                  ⭐ MOST POPULAR
                </div>
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">Campus Suite</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">Attendance + operations + student mail in one plan</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '34' : '49'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / student / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹49 / student / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-secondary text-primary hover:bg-[#35b399] shadow-md shadow-secondary/15">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Student</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Attendance Core</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Campus Operations</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Student mail accounts</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Central admin dashboard</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Reports & analytics</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Migration & training</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Optional priority support</li>
                  </ul>
                </div>
              </div>

              {/* Employee Mail */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border border-slate-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">Employee Mail</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">For faculty and staff communication</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '39' : '49'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / employee / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹49 / employee / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Employee</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Employee mailboxes</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Business-grade accounts</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Admin provisioning</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Account management</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Migration support</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Standard support</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-400 flex items-start gap-1.5 leading-normal"><span className="text-slate-300 text-[0.8rem] flex-shrink-0">✗</span> Audit logs & compliance</li>
                  </ul>
                </div>
              </div>

              {/* Admin / HOD Mail */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border border-slate-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">Admin / HOD Mail</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">Priority mail for administrators and HODs</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '55' : '69'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / user / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹69 / user / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Admin / HOD User</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Priority mailboxes</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Elevated admin controls</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Audit logs</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Archiving & compliance</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Priority support</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Migration & onboarding</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Custom configurations</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enterprise Band */}
            <div className="bg-primary text-white rounded-2xl max-w-[820px] mx-auto mt-10 px-9 py-7 flex flex-col md:flex-row items-center justify-between gap-5 flex-wrap border border-slate-200/10">
              <div>
                <h3 className="text-[1.1rem] font-bold mb-1">Need a custom campus deployment?</h3>
                <p className="text-slate-300 text-[0.88rem]">Large institutions, multi-campus setups, and custom integrations — we'll build a plan around you.</p>
              </div>
              <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="bg-secondary hover:bg-[#35b399] text-primary px-7 py-2.5 rounded-xl font-bold text-[0.88rem] no-underline whitespace-nowrap transition-colors duration-200">
                Contact Sales
              </a>
            </div>
          </div>
        )}

        {/* BUSINESS SECTION */}
        {cfTab === 'business' && (
          <div className="pt-8 px-6 pb-16 animate-in fade-in duration-200">
            <h2 className="text-center text-[1.5rem] font-bold mb-2 text-primary">Business Solutions</h2>
            <p className="text-center text-slate-500 text-[0.95rem] mb-9">Modular tools for logistics, workforce, and customer management.</p>

            <div className="flex flex-wrap lg:flex-nowrap justify-center gap-3 lg:gap-2.5 max-w-7xl mx-auto px-2 lg:px-1">
              {/* Logistics */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border border-slate-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">Logistics / Live Tracking</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">Real-time tracking for vehicles & delivery staff</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '499' : '599'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / unit / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹599 / unit / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Vehicle / Staff</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Live GPS tracking</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Route management</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Delivery staff tracking</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Real-time status updates</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Trip history & reports</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Mobile app access</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-400 flex items-start gap-1.5 leading-normal"><span className="text-slate-300 text-[0.8rem] flex-shrink-0">✗</span> CRM integration</li>
                  </ul>
                </div>
              </div>

              {/* CRM — POPULAR */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border-2 border-secondary relative transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-primary-foreground text-[0.65rem] font-extrabold px-3 py-0.5 rounded-full whitespace-nowrap tracking-wider font-mono">
                  ⭐ MOST POPULAR
                </div>
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">CRM</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">Customer relationship & sales pipeline management</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '666' : '799'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / user / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹799 / user / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-secondary text-primary hover:bg-[#35b399] shadow-md shadow-secondary/15">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per User</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Contact & lead management</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Sales pipeline view</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Task & follow-up tracking</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Reports & analytics</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Team collaboration</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Mobile app access</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> API & integrations</li>
                  </ul>
                </div>
              </div>

              {/* Attendance */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border border-slate-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">Attendance Module</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">Employee attendance tracking for businesses</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '166' : '199'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / employee / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹199 / employee / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Employee</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Digital attendance</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Leave management</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Shift scheduling</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Admin dashboard</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Attendance reports</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Mobile check-in</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-400 flex items-start gap-1.5 leading-normal"><span className="text-slate-300 text-[0.8rem] flex-shrink-0">✗</span> Payroll integration</li>
                  </ul>
                </div>
              </div>

              {/* HRMS */}
              <div className="bg-white rounded-2xl pt-6 px-4 lg:px-2.5 pb-5 w-full max-w-[260px] lg:w-0 lg:flex-1 border border-slate-200 transition-all duration-200 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg">
                <div>
                  <div className="font-bold text-primary text-[0.95rem] lg:text-[0.82rem] mb-1 leading-tight">HRMS</div>
                  <div className="text-[0.72rem] lg:text-[0.68rem] text-slate-400 mb-4 leading-normal h-[36px] overflow-hidden">Complete HR & employee lifecycle management</div>
                  <div className="mb-1">
                    <span className="text-[1.1rem] lg:text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                    <span className="text-3xl lg:text-[1.7rem] font-extrabold text-primary font-sans leading-none">{isAnnual ? '249' : '299'}</span>
                    <span className="text-[0.72rem] lg:text-[0.62rem] text-slate-450 block mt-0.5">
                      / employee / month{isAnnual && ' billed annually'}
                    </span>
                  </div>
                  {isAnnual ? (
                    <div className="text-[0.72rem] lg:text-[0.62rem] text-slate-400 line-through mb-3 h-4">₹299 / employee / month</div>
                  ) : (
                    <div className="h-4 mb-3" />
                  )}
                  <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2.5 lg:py-2 rounded-xl text-[0.78rem] lg:text-[0.7rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                    Get Started
                  </a>
                  <span className="text-[0.68rem] lg:text-[0.6rem] text-slate-500 bg-slate-100 rounded-md px-2 py-0.5 inline-block mb-3.5 font-semibold">Per Employee</span>
                  <hr className="border-none border-t border-slate-150 mb-3.5" />
                  <ul className="list-none flex-grow space-y-1.5">
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Employee records</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Leave & attendance</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Payroll management</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Appraisal & reviews</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Document management</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> Role-based access</li>
                    <li className="text-[0.72rem] lg:text-[0.66rem] text-slate-600 flex items-start gap-1.5 leading-normal"><span className="text-secondary text-[0.8rem] flex-shrink-0">✓</span> HR analytics & reports</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Enterprise Band */}
            <div className="bg-primary text-white rounded-2xl max-w-[820px] mx-auto mt-10 px-9 py-7 flex flex-col md:flex-row items-center justify-between gap-5 flex-wrap border border-slate-200/10">
              <div>
                <h3 className="text-[1.1rem] font-bold mb-1">Building something larger?</h3>
                <p className="text-slate-300 text-[0.88rem]">Multi-branch businesses, custom workflows, and volume pricing available on request.</p>
              </div>
              <a href="/#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="bg-secondary hover:bg-[#35b399] text-primary px-7 py-2.5 rounded-xl font-bold text-[0.88rem] no-underline whitespace-nowrap transition-colors duration-200">
                Contact Sales
              </a>
            </div>
          </div>
        )}

        {/* FOOTER NOTE */}
        <div className="text-center text-[0.8rem] text-slate-400 px-6 py-6 pb-12 mt-8 max-w-2xl mx-auto leading-normal">
          All plans include onboarding support. Setup, migration, training, priority support, archiving, audit logs, and compliance add-ons available based on deployment scope.<br />
          Pricing varies by user category based on access level, administration needs, and support scope.
        </div>
      </div>
    );
  };

  const renderMailServicePricing = (isModalView = false) => {
    const isAnnual = mailBilling === 'annual';

    return (
      <div className={`w-full font-sans text-primary rounded-3xl ${isModalView ? 'bg-white p-2' : 'mt-16 bg-slate-50 border border-slate-200/80 pb-12'}`}>
        
        {/* Header / Toggle Row */}
        {!isModalView ? (
          /* Landing Page section style */
          <section className="bg-primary text-white text-center pt-12 px-6 pb-12 relative overflow-hidden select-none rounded-t-3xl">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Mail Service Pricing</h2>
            <p className="text-sm text-slate-300 max-w-[480px] mx-auto mb-6 leading-relaxed">
              Secure, E2EE-capable email hosting optimized via our high-reputation relay servers. Choose a plan that matches your organization's scope.
            </p>
            <div className="inline-flex items-center bg-white/10 rounded-full p-1 gap-1 border border-white/10">
              <button
                onClick={() => setMailBilling('monthly')}
                className={`px-4 py-1.5 rounded-full border-none text-[0.8rem] font-semibold transition-all duration-200 cursor-pointer ${mailBilling === 'monthly' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-300 hover:text-white'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setMailBilling('annual')}
                className={`px-4 py-1.5 rounded-full border-none text-[0.8rem] font-semibold transition-all duration-200 cursor-pointer flex items-center ${mailBilling === 'annual' ? 'bg-white text-primary shadow-sm' : 'bg-transparent text-slate-300 hover:text-white'}`}
              >
                Annual
                <span className="bg-secondary/15 text-secondary text-[0.65rem] font-bold px-2 py-0.5 rounded-full ml-1 align-middle">
                  Save ~17%
                </span>
              </button>
            </div>
          </section>
        ) : (
          /* Modal compact header style */
          <div className="flex justify-center items-center gap-4 py-3 mb-6 bg-slate-50 border border-slate-200/60 rounded-2xl max-w-sm mx-auto select-none">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Billing Cycle:</span>
            <div className="inline-flex items-center bg-slate-200/60 rounded-full p-0.5 gap-0.5">
              <button
                onClick={() => setMailBilling('monthly')}
                className={`px-3 py-1 rounded-full border-none text-[0.72rem] font-bold transition-all duration-200 cursor-pointer ${mailBilling === 'monthly' ? 'bg-white text-primary shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setMailBilling('annual')}
                className={`px-3 py-1 rounded-full border-none text-[0.72rem] font-bold transition-all duration-200 cursor-pointer flex items-center ${mailBilling === 'annual' ? 'bg-white text-primary shadow-xs' : 'bg-transparent text-slate-500 hover:text-slate-800'}`}
              >
                Annual
                <span className="bg-secondary/10 text-secondary text-[0.6rem] font-extrabold px-1.5 py-0.5 rounded-full ml-1 align-middle">
                  Save ~17%
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 3-Tier Grid */}
        <div className={`px-4 max-w-7xl mx-auto ${isModalView ? 'pt-2' : 'pt-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 transition-all duration-250 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5">
              <div>
                <div className="font-bold text-primary text-[0.95rem] mb-0.5 leading-tight">Starter Secure</div>
                <div className="text-[0.7rem] text-slate-400 mb-4 leading-normal h-[32px] overflow-hidden">Basic E2EE-enabled mailbox for individuals & micro-teams</div>
                <div className="mb-2">
                  <span className="text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                  <span className="text-2xl font-extrabold text-primary font-sans leading-none">{isAnnual ? '49' : '59'}</span>
                  <span className="text-[0.65rem] text-slate-450 block mt-0.5">
                    / user / month {isAnnual && '(billed annually)'}
                  </span>
                </div>
                {isAnnual ? (
                  <div className="text-[0.65rem] text-slate-450 line-through mb-3 h-3">₹59 / user / month</div>
                ) : (
                  <div className="h-3 mb-3" />
                )}
                
                <a href="#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2 rounded-xl text-[0.72rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                  Deploy Starter Mailbox
                </a>
                
                <span className="text-[0.62rem] text-secondary bg-secondary/10 border border-secondary/15 rounded-md px-1.5 py-0.5 inline-block mb-3 font-bold font-mono">
                  Unlimited Emails
                </span>
                
                <hr className="border-none border-t border-slate-150 mb-3" />
                
                <ul className="list-none space-y-1.5 flex-grow">
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Unlimited inbound & outbound mail</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> 5 GB SSD storage capacity</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Elliptic Curve Storage Cryptography</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Secure Webmail dashboard client</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Inbound spam & phishing scanner</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Google Authenticator 2FA</li>
                </ul>
              </div>
            </div>

            {/* Pro Plan (Highlighted Card) */}
            <div className="bg-white rounded-2xl p-5 border-2 border-secondary relative transition-all duration-250 flex flex-col justify-between hover:shadow-lg hover:-translate-y-0.5 font-sans">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-primary-foreground text-[0.6rem] font-extrabold px-2.5 py-0.5 rounded-full whitespace-nowrap tracking-wider font-mono">
                ⭐ BEST VALUE
              </div>
              <div>
                <div className="font-bold text-primary text-[0.95rem] mb-0.5 leading-tight">Pro Secure</div>
                <div className="text-[0.7rem] text-slate-400 mb-4 leading-normal h-[32px] overflow-hidden">Custom domain secure communication suite for businesses</div>
                <div className="mb-2">
                  <span className="text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                  <span className="text-2xl font-extrabold text-primary font-sans leading-none">{isAnnual ? '99' : '119'}</span>
                  <span className="text-[0.65rem] text-slate-450 block mt-0.5">
                    / user / month {isAnnual && '(billed annually)'}
                  </span>
                </div>
                {isAnnual ? (
                  <div className="text-[0.65rem] text-slate-455 line-through mb-3 h-3">₹119 / user / month</div>
                ) : (
                  <div className="h-3 mb-3" />
                )}
                
                <a href="#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2 rounded-xl text-[0.72rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-secondary text-primary hover:bg-[#35b399] shadow-md shadow-secondary/15">
                  Deploy Pro Mailbox
                </a>
                
                <span className="text-[0.62rem] text-secondary bg-secondary/10 border border-secondary/15 rounded-md px-1.5 py-0.5 inline-block mb-3 font-bold font-mono">
                  Unlimited Emails
                </span>
                
                <hr className="border-none border-t border-slate-150 mb-3" />
                
                <ul className="list-none space-y-1.5 flex-grow">
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal font-semibold"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Unlimited inbound & outbound mail</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal font-semibold"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> 25 GB SSD storage capacity</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Custom Domain Support (you@yourcompany.com)</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal font-semibold"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Encrypted Metadata Indexing (Zero DB exposure)</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal font-semibold"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> App-Specific passwords for Outlook & Mail</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> SPF / DKIM / DMARC deliverability signatures</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Shared IP high-reputation outbound relays</li>
                </ul>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 transition-all duration-250 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5">
              <div>
                <div className="font-bold text-primary text-[0.95rem] mb-0.5 leading-tight">Enterprise Secure</div>
                <div className="text-[0.7rem] text-slate-400 mb-4 leading-normal h-[32px] overflow-hidden">Zero-Trust compliance and tracking for large operations</div>
                <div className="mb-2">
                  <span className="text-[0.95rem] font-bold align-super mr-0.5 text-primary">₹</span>
                  <span className="text-2xl font-extrabold text-primary font-sans leading-none">{isAnnual ? '199' : '239'}</span>
                  <span className="text-[0.65rem] text-slate-455 block mt-0.5">
                    / user / month {isAnnual && '(billed annually)'}
                  </span>
                </div>
                {isAnnual ? (
                  <div className="text-[0.65rem] text-slate-455 line-through mb-3 h-3">₹239 / user / month</div>
                ) : (
                  <div className="h-3 mb-3" />
                )}
                
                <a href="#contact" onClick={() => isModalView && setIsPricingModalOpen(false)} className="block w-full py-2 rounded-xl text-[0.72rem] font-bold text-center no-underline transition-all duration-200 mb-4 cursor-pointer bg-white text-primary border border-primary hover:bg-slate-50">
                  Contact Sales & Custom Config
                </a>
                
                <span className="text-[0.62rem] text-secondary bg-secondary/10 border border-secondary/15 rounded-md px-1.5 py-0.5 inline-block mb-3 font-bold font-mono">
                  Unlimited Emails
                </span>
                
                <hr className="border-none border-t border-slate-150 mb-3" />
                
                <ul className="list-none space-y-1.5 flex-grow">
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Unlimited inbound & outbound mail</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> 100 GB SSD storage capacity</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Everything in Pro Plan +</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal font-semibold"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Event audits & query logs</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal font-semibold"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Archiving & regulatory backup controls</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Dedicated high-reputation outbound IP request</li>
                  <li className="text-[0.7rem] text-slate-650 flex items-start gap-1 leading-normal"><Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" /> Dedicated 24/7 technical representative</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote (only on full landing page section) */}
        {!isModalView && (
          <div className="text-center text-[0.75rem] text-slate-400 px-6 py-6 pb-12 mt-4 max-w-3xl mx-auto leading-normal">
            💡 <strong>Proprietary Optimized Delivery Engine</strong>: By routing transactional and client traffic through our custom high-reputation outbound relays, we achieve optimal deliverability at a fraction of standard hosting infrastructure costs. To maintain high profit margins at scale, plans feature unlimited email sending/receiving subject to standard daily anti-abuse limits (comparable to industry-standard business mail thresholds). Volume extensions or customized SMTP relay terms can be arranged upon inquiry.
          </div>
        )}
      </div>
    );
  };

  // Get project icon component
  const ProjIcon = project.icon || Cpu;
  const isCampusNexus = project.title.toLowerCase().includes('campus nexus');
  const isMailService = project.id === 99901 || project.title.toLowerCase().includes('mail');

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
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider font-mono mb-4 border ${
              project.category === 'polynexus'
                ? 'text-secondary bg-secondary/10 border-secondary/15'
                : 'text-amber-700 bg-amber-500/10 border-amber-500/15'
            }`}>
              <ProjIcon className="w-3.5 h-3.5" />
              {project.category === 'polynexus' ? 'Polynexus Product' : 'Custom Software'}
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
                  {project.longDesc || `This client engagement involved designing, deploying, and optimizing a specialized ${project.category === 'polynexus' ? 'Polynexus Product' : project.category === 'custom' ? 'custom software' : project.category} platform around the specific operational requirements of our partners.`}
                </p>
                <p>
                  By deploying a modular microservices framework and integrating real-time telemetry analytics, the software manages transaction paths, validates workflows, and offers deep-dives into execution status without performance bottlenecks.
                </p>
              </div>
            </section>

            {/* If Mail Service, show the 6 specialties in a gorgeous high-tech grid */}
            {isMailService && (
              <section className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-secondary animate-pulse" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Security & Privacy Architecture</h2>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Zero-Knowledge Secure Protocols</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      num: '01',
                      icon: Lock,
                      title: 'Military-Grade Storage Encryption (At-Rest)',
                      copy: 'Your emails belong to you, and only you. Every single email body and attachment is encrypted using secure Elliptic Curve cryptography before it is written to disk. Even in the event of a physical server compromise or server drive theft, your data remains completely unreadable.'
                    },
                    {
                      num: '02',
                      icon: Shield,
                      title: 'Encrypted Metadata Indexing (Zero Database Exposure)',
                      copy: 'Standard email providers store search indexes (like subject lines and body previews) in plaintext databases. We encrypt all indexing metadata at the database level, ensuring your private email subjects and snippets are never exposed in plaintext.'
                    },
                    {
                      num: '03',
                      icon: Key,
                      title: 'State-of-the-Art Password Protection',
                      copy: 'We secure your primary login credentials using the industry\'s most advanced password hashing algorithms. Our authentication system is designed to withstand high-powered, hardware-accelerated offline attacks, keeping your password safe.'
                    },
                    {
                      num: '04',
                      icon: Fingerprint,
                      title: 'Two-Factor Authentication (2FA) & App-Specific Passwords',
                      copy: 'Add a second layer of defense with Google Authenticator or any standard 2FA app. Once enabled, you can generate isolated, single-device passwords for your third-party mail clients (like Outlook or Mail). Revoke access for any device instantly without changing your main password.'
                    },
                    {
                      num: '05',
                      icon: Globe,
                      title: 'Mandatory In-Transit TLS Encryption',
                      copy: 'Your data in motion is fully protected. We enforce secure, end-to-end encrypted TLS channels for all incoming and outgoing connections—whether you are using our web dashboard, mobile apps, or sending an email. This prevents eavesdropping on public Wi-Fi or networks.'
                    },
                    {
                      num: '06',
                      icon: Mail,
                      title: 'Enterprise Deliverability & Anti-Spam Shield',
                      copy: 'Keep your inbox clean and guarantee your outbound mail gets delivered. We cryptographically sign outgoing mail with standard domain alignment records to maximize delivery to Gmail, Outlook, and others. Inbound emails are instantly filtered to block spam, phishing, and malware.'
                    }
                  ].map((specialty, idx) => {
                    const SpecIcon = specialty.icon;
                    return (
                      <div key={idx} className="p-5 bg-slate-50 hover:bg-white border border-slate-150 hover:border-[#45C7AC]/35 rounded-2xl transition-all duration-300 group/item hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[10px] font-bold text-slate-400 font-mono group-hover/item:text-secondary transition-colors">{specialty.num}</span>
                          <SpecIcon className="w-4 h-4 text-slate-400 group-hover/item:text-secondary transition-colors" />
                        </div>
                        <h3 className="text-xs font-bold text-slate-800 group-hover/item:text-secondary transition-colors leading-tight mb-2">
                          {specialty.title}
                        </h3>
                        <p className="text-slate-500 text-[11px] leading-relaxed font-normal">
                          {specialty.copy}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

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

            {/* Plans & Pricing Card in Sidebar */}
            {project.category === 'polynexus' && (
              <div className="bg-white border border-slate-200 hover:border-secondary/30 shadow-md rounded-3xl p-8 transition-all duration-300">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono block mb-2">Plans & Pricing</span>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Flexible licensing models</h3>
                <p className="text-slate-550 text-xs leading-relaxed mb-6">
                  Choose the edition that fits your scale. Active subscription plans include standard or priority technical support.
                </p>
                <div className="space-y-3 mb-8">
                  {isCampusNexus ? (
                    <>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>🎓 Campus Solutions</span>
                        <span className="text-slate-900 font-mono font-bold">from ₹19/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>🏢 Business Solutions</span>
                        <span className="text-slate-900 font-mono font-bold">from ₹166/mo</span>
                      </div>
                    </>
                  ) : isMailService ? (
                    <>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>Starter Plan</span>
                        <span className="text-primary font-mono font-bold">₹49/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700 font-semibold">
                        <span>Pro Plan</span>
                        <span className="text-primary font-mono font-bold">₹99/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>Enterprise Plan</span>
                        <span className="text-primary font-mono font-bold">₹199/mo</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>Standard Edition</span>
                        <span className="text-primary font-mono font-bold">₹{project.standard_price || '1249'}/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>Premium Edition</span>
                        <span className="text-primary font-mono font-bold">₹{project.premium_price || '2999'}/mo</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                        <span>Enterprise Edition</span>
                        <span className="text-primary font-mono font-bold">Custom Quote</span>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => setIsPricingModalOpen(true)}
                  className="inline-flex items-center gap-2 justify-center w-full bg-primary hover:bg-slate-900 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 cursor-pointer shadow-xs"
                >
                  View All Pricing Plans
                  <ArrowRight className="w-4 h-4 text-secondary" />
                </button>
              </div>
            )}

            {/* Inquire CTA box */}
            <div className="bg-linear-to-tr from-primary to-slate-900 border border-slate-850 rounded-3xl p-8 shadow-xl text-white">
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

        {/* 3-Tier Pricing Section */}
        {project.category === 'polynexus' ? (
          isCampusNexus ? renderCampusNexusPricing(false) : isMailService ? renderMailServicePricing(false) : (
            <div className="mt-16 pt-16 border-t border-slate-200/80 reveal">
              {/* Header + Country Selector */}
              <div className="flex flex-col sm:flex-row justify-between items-center max-w-6xl mx-auto mb-10 px-4 gap-4">
                <div className="text-left max-w-xl">
                  <span className="text-sm font-bold text-secondary uppercase tracking-wider">Plans & Pricing</span>
                  <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Flexible licensing models</h2>
                </div>
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer select-none">
                  <span className="text-sm">🇮🇳</span>
                  <span>India</span>
                  <span className="text-[8px] text-slate-450 ml-1">▼</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto font-sans">

                {/* Joined Container: Standard & Premium */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-150 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">

                  {/* Standard Edition */}
                  <div className="p-8 flex flex-col justify-between hover:bg-slate-50/20 transition-colors duration-200">
                    <div>
                      <div className="text-center pb-6 border-b border-slate-100 mb-6">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest font-mono block mb-4">STANDARD</span>

                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="text-slate-400 text-xs font-semibold line-through tracking-tight">₹{project.standard_original_price || '1499'}</span>
                          <div className="flex items-start text-slate-900 tracking-tight font-sans mt-0.5">
                            <span className="text-xl font-bold mt-1 mr-0.5">₹</span>
                            <span className="text-5xl font-extrabold tracking-tighter">{project.standard_price || '1249'}</span>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 font-bold block leading-relaxed mt-1">per Organization per Month</span>
                        <span className="text-[9px] text-slate-400 font-medium block mt-0.5">(Billed annually)</span>
                      </div>

                      <p className="text-slate-650 text-xs text-center leading-relaxed mb-6 px-4">
                        Best suited for businesses with <span className="font-bold text-slate-850">one time billing</span> requirements
                      </p>

                      <a
                        href="/#contact"
                        className="block text-center w-full bg-secondary hover:bg-[#35b399] text-primary font-extrabold text-xs py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-secondary/10 mb-8 tracking-wide"
                      >
                        Start your 14-day free trial
                      </a>

                      <ul className="space-y-4">
                        {(project.standard_features && project.standard_features.length > 0 ? project.standard_features : [
                          'Create quotes and GST compliant invoices',
                          'Customize for local languages and tax laws',
                          'Multi-user access for up to 3 users',
                          'Handle multi-currency transactions',
                          'Set up automated payment reminders',
                          'Manage projects & timesheets',
                          'Enable self-service customer portal',
                          'Customize your transaction templates'
                        ]).map((feat, idx) => (
                          <li key={idx} className="flex gap-3 items-start text-slate-650 text-xs leading-normal">
                            <span className="text-slate-800 text-[10px] font-extrabold mt-0.5 select-none">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Premium Edition */}
                  <div className="p-8 flex flex-col justify-between hover:bg-slate-50/20 transition-colors duration-200">
                    <div>
                      <div className="text-center pb-6 border-b border-slate-100 mb-6">
                        <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest font-mono block mb-4">PREMIUM</span>

                        <div className="flex flex-col items-center justify-center mb-1">
                          <span className="text-slate-400 text-xs font-semibold line-through tracking-tight">₹{project.premium_original_price || '3499'}</span>
                          <div className="flex items-start text-slate-900 tracking-tight font-sans mt-0.5">
                            <span className="text-xl font-bold mt-1 mr-0.5">₹</span>
                            <span className="text-5xl font-extrabold tracking-tighter">{project.premium_price || '2999'}</span>
                          </div>
                        </div>

                        <span className="text-[10px] text-slate-500 font-bold block leading-relaxed mt-1">per Organization per Month</span>
                        <span className="text-[9px] text-slate-400 font-medium block mt-0.5">(Billed annually)</span>
                      </div>

                      <p className="text-slate-650 text-xs text-center leading-relaxed mb-6 px-4">
                        Best suited for businesses with <span className="font-bold text-slate-850">one time and subscription billing</span> requirements
                      </p>

                      <a
                        href="/#contact"
                        className="block text-center w-full bg-secondary hover:bg-[#35b399] text-primary font-extrabold text-xs py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-secondary/10 mb-8 tracking-wide"
                      >
                        Start your 14-day free trial
                      </a>

                      <ul className="space-y-4">
                        {(project.premium_features && project.premium_features.length > 0 ? project.premium_features : [
                          'Includes everything in Standard +',
                          'Manage subscription billing',
                          'Multi-user access for up to 10 users',
                          'Use hosted payment pages',
                          'Automate billing for usage-based pricing models',
                          'Manage in-app purchases'
                        ]).map((feat, idx) => {
                          const isHeader = idx === 0 && feat.toLowerCase().includes('everything in');
                          return (
                            <li key={idx} className="flex gap-3 items-start text-slate-650 text-xs leading-normal">
                              <span className="text-slate-800 text-[10px] font-extrabold mt-0.5 select-none">✓</span>
                              <span className={isHeader ? "font-bold text-slate-900" : ""}>{feat}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                </div>

                {/* Enterprise Edition Card */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden pt-12 shadow-xs">
                  {/* Thick top bar banner */}
                  <div className="absolute top-0 left-0 right-0 h-[6px] bg-primary" />

                  <div>
                    <div className="text-center pb-6 border-b border-slate-100 mb-6">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-3">ENTERPRISE EDITION</span>
                      <h3 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">Enterprise<br />Edition</h3>
                    </div>

                    <p className="text-slate-650 text-xs text-center leading-relaxed mb-6 px-2">
                      A platform engineered for <span className="font-bold text-slate-850">operational scale</span> and <span className="font-bold text-slate-850">deep customization</span>
                    </p>

                    <a
                      href="/#contact"
                      className="block text-center w-full bg-secondary hover:bg-[#35b399] text-primary font-extrabold text-xs py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-secondary/10 mb-8 tracking-wide"
                    >
                      Learn more
                    </a>

                    <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-4 font-sans select-none">Helps enterprises handle</div>

                    <ul className="space-y-4">
                      {(project.enterprise_features && project.enterprise_features.length > 0 ? project.enterprise_features : [
                        'High volume customers and transactions',
                        'Advanced usage-based billing controls',
                        'Flexible revenue recognition configurations',
                        'Analytics with forecasting and AI insights',
                        'In-depth customization for reports and modules',
                        'Priority support and dedicated account manager'
                      ]).map((feat, idx) => (
                        <li key={idx} className="flex gap-3 items-start text-slate-650 text-xs leading-normal">
                          <span className="text-slate-800 text-[10px] font-extrabold mt-0.5 select-none">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>

            </div>
          )
        ) : (() => {
          const isMilk = project.title.toLowerCase().includes('milk');
          const isGarage = project.title.toLowerCase().includes('garage') || project.title.toLowerCase().includes('moto');
          
          const minVal = isMilk ? 100 : isGarage ? 1 : 5;
          const maxVal = isMilk ? 10000 : isGarage ? 50 : 250;
          const stepVal = isMilk ? 100 : isGarage ? 1 : 5;
          
          let calcLabel = 'Active User Seats';
          let calcRate = 499;
          let calcUnit = 'seat';

          if (isMilk) {
            calcLabel = 'Daily Milk Distribution Volume';
            calcRate = 12; // ₹12 per liter
            calcUnit = 'liter';
          } else if (isGarage) {
            calcLabel = 'Active Mechanic / Service Bays';
            calcRate = 299;
            calcUnit = 'bay';
          }

          return (
            <div className="mt-16 pt-16 border-t border-slate-200/80 reveal">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-sm font-bold text-accent uppercase tracking-wider font-mono">Dynamic Cost Estimator</span>
                <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Interactive deployment calculator</h2>
                <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                  Estimate the custom implementation, license, or support cost for <span className="font-bold text-slate-800">{project.title}</span>. Drag the slider to set your required scale.
                </p>
              </div>

              <div className="max-w-3xl mx-auto bg-white border border-slate-200/80 rounded-3xl p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[6px] bg-accent" />
                
                <div className="space-y-8">
                  {/* Range Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono">{calcLabel}</span>
                      <span className="text-lg font-bold text-slate-900 font-mono">{calcScale.toLocaleString()} {calcUnit}s</span>
                    </div>
                    <input
                      type="range"
                      min={minVal}
                      max={maxVal}
                      step={stepVal}
                      value={calcScale}
                      onChange={(e) => setCalcScale(parseInt(e.target.value) || minVal)}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-accent border border-slate-200"
                    />
                    <div className="flex justify-between text-[10px] text-slate-450 font-bold font-mono mt-2 select-none">
                      <span>{minVal.toLocaleString()}</span>
                      <span>{((minVal + maxVal) / 2).toLocaleString()}</span>
                      <span>{maxVal.toLocaleString()}</span>
                    </div>
                  </div>

                  <hr className="border-slate-150" />

                  {/* Estimate Result */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div>
                      <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono block mb-1">ESTIMATED DEPLOYMENT COST</span>
                      <div className="flex items-baseline text-slate-900 tracking-tight font-sans">
                        <span className="text-2xl font-bold mr-0.5">₹</span>
                        <span className="text-5xl font-extrabold font-mono tracking-tighter">
                          {Math.round(calcScale * calcRate).toLocaleString()}
                        </span>
                        <span className="text-slate-500 text-xs font-bold font-mono ml-2 font-semibold">/ month</span>
                      </div>
                      <span className="text-[9px] text-slate-450 block mt-1 font-medium italic">* Subject to custom developer modifications & local SLA agreements</span>
                    </div>

                    <a
                      href="/#contact"
                      onClick={(e) => {
                        localStorage.setItem('inquiry_prefix', `I am interested in custom deploying ${project.title} for approximately ${calcScale.toLocaleString()} active ${calcUnit}s (estimated cost: ₹${Math.round(calcScale * calcRate).toLocaleString()}/month). Please get in touch.`);
                        const element = document.getElementById('contact');
                        if (element) {
                          e.preventDefault();
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-accent hover:bg-[#c15e00] text-white font-extrabold text-xs px-6 py-4 rounded-xl shadow-md shadow-accent/15 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                    >
                      Request Quote for this scale
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      </main>

      {/* Detailed Pricing Modal */}
      {isPricingModalOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#010B33]/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
            onClick={() => setIsPricingModalOpen(false)}
          />

          {/* Modal Container */}
          <div className={`relative bg-white border border-slate-200/80 w-full rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200 ${project.category === 'polynexus' ? 'max-w-5xl' : 'max-w-3xl'}`}>
            {/* Header */}
            <div className="p-6 border-b border-slate-150 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono block mb-1">Pricing Configuration Matrix</span>
                <h3 className="text-xl font-extrabold text-slate-900">{project.title} - Detailed Modules</h3>
              </div>
              <div className="flex items-center gap-4">
                {project.category === 'polynexus' && (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-2xs">
                    <span className="text-sm">🇮🇳</span>
                    <span>India</span>
                  </div>
                )}
                <button
                  onClick={() => setIsPricingModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Viewport */}
            <div className="p-6 overflow-y-auto flex-grow">
              {project.category === 'polynexus' ? (
                isCampusNexus ? renderCampusNexusPricing(true) : isMailService ? renderMailServicePricing(true) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto font-sans">

                    {/* Joined Container: Standard & Premium */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-150 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300">

                      {/* Standard Edition */}
                      <div className="p-8 flex flex-col justify-between hover:bg-slate-50/20 transition-colors duration-200">
                        <div>
                          <div className="text-center pb-6 border-b border-slate-100 mb-6">
                            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest font-mono block mb-4">STANDARD</span>

                            <div className="flex flex-col items-center justify-center mb-1">
                              <span className="text-slate-400 text-xs font-semibold line-through tracking-tight">₹{project.standard_original_price || '1499'}</span>
                              <div className="flex items-start text-slate-900 tracking-tight font-sans mt-0.5">
                                <span className="text-xl font-bold mt-1 mr-0.5">₹</span>
                                <span className="text-5xl font-extrabold tracking-tighter">{project.standard_price || '1249'}</span>
                              </div>
                            </div>

                            <span className="text-[10px] text-slate-500 font-bold block leading-relaxed mt-1">per Organization per Month</span>
                            <span className="text-[9px] text-slate-400 font-medium block mt-0.5">(Billed annually)</span>
                          </div>

                          <p className="text-slate-650 text-xs text-center leading-relaxed mb-6 px-4">
                            Best suited for businesses with <span className="font-bold text-slate-850">one time billing</span> requirements
                          </p>

                          <a
                            href="/#contact"
                            onClick={() => setIsPricingModalOpen(false)}
                            className="block text-center w-full bg-secondary hover:bg-[#35b399] text-primary font-extrabold text-xs py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-secondary/10 mb-8 tracking-wide"
                          >
                            Start your 14-day free trial
                          </a>

                          <ul className="space-y-4">
                            {(project.standard_features && project.standard_features.length > 0 ? project.standard_features : [
                              'Create quotes and GST compliant invoices',
                              'Customize for local languages and tax laws',
                              'Multi-user access for up to 3 users',
                              'Handle multi-currency transactions',
                              'Set up automated payment reminders',
                              'Manage projects & timesheets',
                              'Enable self-service customer portal',
                              'Customize your transaction templates'
                            ]).map((feat, idx) => (
                              <li key={idx} className="flex gap-3 items-start text-slate-650 text-xs leading-normal">
                                <span className="text-slate-800 text-[10px] font-extrabold mt-0.5 select-none">✓</span>
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Premium Edition */}
                      <div className="p-8 flex flex-col justify-between bg-secondary/[0.04] hover:bg-secondary/[0.08] transition-colors duration-200 relative">
                        <div className="absolute top-4 right-4 bg-primary text-secondary border border-secondary/30 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs animate-pulse">
                          Most Popular
                        </div>
                        <div>
                          <div className="text-center pb-6 border-b border-slate-200/60 mb-6">
                            <span className="text-[11px] font-bold text-secondary uppercase tracking-widest font-mono block mb-4">PREMIUM</span>

                            <div className="flex flex-col items-center justify-center mb-1">
                              <span className="text-slate-400 text-xs font-semibold line-through tracking-tight">₹{project.premium_original_price || '3499'}</span>
                              <div className="flex items-start text-slate-900 tracking-tight font-sans mt-0.5">
                                <span className="text-xl font-bold mt-1 mr-0.5 text-secondary">₹</span>
                                <span className="text-5xl font-extrabold tracking-tighter text-slate-900">{project.premium_price || '2999'}</span>
                              </div>
                            </div>

                            <span className="text-[10px] text-slate-550 font-semibold block leading-relaxed mt-1">per Organization per Month</span>
                            <span className="text-[9px] text-slate-405 font-medium block mt-0.5">(Billed annually)</span>
                          </div>

                          <p className="text-slate-650 text-xs text-center leading-relaxed mb-6 px-4">
                            Best suited for businesses with <span className="font-bold text-slate-850">one time and subscription billing</span> requirements
                          </p>

                          <a
                            href="/#contact"
                            onClick={() => setIsPricingModalOpen(false)}
                            className="block text-center w-full bg-primary hover:bg-slate-900 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-primary/20 mb-8 tracking-wide animate-pulse border border-secondary/35"
                          >
                            Start your 14-day free trial
                          </a>

                          <ul className="space-y-4">
                            {(project.premium_features && project.premium_features.length > 0 ? project.premium_features : [
                              'Includes everything in Standard +',
                              'Manage subscription billing',
                              'Multi-user access for up to 10 users',
                              'Use hosted payment pages',
                              'Automate billing for usage-based pricing models',
                              'Manage in-app purchases'
                            ]).map((feat, idx) => {
                              const isHeader = idx === 0 && feat.toLowerCase().includes('everything in');
                              return (
                                <li key={idx} className="flex gap-3 items-start text-slate-650 text-xs leading-normal">
                                  <span className="text-slate-800 text-[10px] font-extrabold mt-0.5 select-none">✓</span>
                                  <span className={isHeader ? "font-bold text-slate-900" : ""}>{feat}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </div>

                    </div>

                    {/* Enterprise Edition Card */}
                    <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between relative overflow-hidden pt-12 shadow-xs">
                      {/* Thick top bar banner */}
                      <div className="absolute top-0 left-0 right-0 h-[6px] bg-primary" />

                      <div>
                        <div className="text-center pb-6 border-b border-slate-100 mb-6">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-3">ENTERPRISE EDITION</span>
                          <h3 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">Enterprise<br />Edition</h3>
                        </div>

                        <p className="text-slate-650 text-xs text-center leading-relaxed mb-6 px-2">
                          A platform engineered for <span className="font-bold text-slate-850">operational scale</span> and <span className="font-bold text-slate-850">deep customization</span>
                        </p>

                        <a
                          href="/#contact"
                          onClick={() => setIsPricingModalOpen(false)}
                          className="block text-center w-full bg-secondary hover:bg-[#35b399] text-primary font-extrabold text-xs py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-secondary/10 mb-8 tracking-wide"
                        >
                          Learn more
                        </a>

                        <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-4 font-sans select-none">Helps enterprises handle</div>

                        <ul className="space-y-4">
                          {(project.enterprise_features && project.enterprise_features.length > 0 ? project.enterprise_features : [
                            'High volume customers and transactions',
                            'Advanced usage-based billing controls',
                            'Flexible revenue recognition configurations',
                            'Analytics with forecasting and AI insights',
                            'In-depth customization for reports and modules',
                            'Priority support and dedicated account manager'
                          ]).map((feat, idx) => (
                            <li key={idx} className="flex gap-3 items-start text-slate-650 text-xs leading-normal">
                              <span className="text-slate-800 text-[10px] font-extrabold mt-0.5 select-none">✓</span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                )
              ) : (
                <div className="prose prose-slate max-w-none">
                  {project.price_detail_html && (
                    <div
                      dangerouslySetInnerHTML={{ __html: project.price_detail_html }}
                      className="pricing-table-container"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-150 flex items-center justify-between bg-slate-50/50">
              <div className="text-xs text-slate-500 font-mono">
                {project.category === 'polynexus' ? (
                  <span>Showing all available standard packages for this product</span>
                ) : (
                  <span>Base Rate: <span className="font-bold text-slate-900">{project.price}</span></span>
                )}
              </div>
              <button
                onClick={() => {
                  setIsPricingModalOpen(false);
                  navigate('/#contact');
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
