import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  loginAdmin, 
  clearStoredAuth, 
  getStoredToken, 
  getStoredUsername,
  fetchServices, 
  fetchProjects, 
  fetchTestimonials, 
  fetchFAQs, 
  fetchBlogPosts, 
  fetchContactInfo,
  fetchHeroInfo,
  createService, updateService, deleteService,
  createProject, updateProject, deleteProject,
  createTestimonial, updateTestimonial, deleteTestimonial,
  createFAQ, updateFAQ, deleteFAQ,
  createBlogPost, updateBlogPost, deleteBlogPost,
  updateContactInfo,
  updateHeroInfo,
  fetchEnquiries, deleteEnquiry, replyToEnquiry
} from '../api';
import type { Service, Project, Testimonial, FAQItem, BlogPost, ContactInfo, HeroInfo, Enquiry } from '../api';
import { 
  Lock, User, LogOut, Plus, Edit2, Trash2, X, Info, 
  Zap, Database, Shield, Layers, Cpu, Globe, FolderGit, 
  HelpCircle, Settings, FileText, Star, ArrowLeft, Mail
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  // Authentication State
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [username, setUsername] = useState<string | null>(getStoredUsername());
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Navigation State
  const [activeTab, setActiveTab] = useState<'services' | 'projects' | 'testimonials' | 'faqs' | 'blog' | 'contact' | 'hero' | 'enquiries'>('services');

  // Loaded Data State
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Reply States
  const [replyText, setReplyText] = useState('');
  const [replyingId, setReplyingId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedId, setSelectedId] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Form Field State
  const [serviceForm, setServiceForm] = useState<Omit<Service, 'icon'>>({ id: '', title: '', shortDesc: '', fullDesc: '', features: [''], specs: { '': '' } });
  const [serviceIcon, setServiceIcon] = useState('Zap');

  const [projectForm, setProjectForm] = useState<Omit<Project, 'icon'>>({
    title: '',
    category: 'polynexus',
    desc: '',
    metric: '',
    metricLabel: '',
    tech: [''],
    image: '',
    file: '',
    longDesc: '',
    benefits: [''],
    results: [''],
    price: '',
    price_detail_html: '',
    standard_price: '',
    standard_original_price: '',
    premium_price: '',
    premium_original_price: '',
    standard_features: [''],
    premium_features: [''],
    enterprise_features: ['']
  });
  const [projectIcon, setProjectIcon] = useState('Cpu');

  const [testimonialForm, setTestimonialForm] = useState<Testimonial>({ name: '', role: '', company: '', content: '', rating: 5, avatar: '' });
  const [faqForm, setFaqForm] = useState<FAQItem>({ question: '', answer: '' });
  const [blogForm, setBlogForm] = useState<BlogPost>({ title: '', category: '', date: '', readTime: '', summary: '', imageUrl: '' });
  const [contactForm, setContactForm] = useState<ContactInfo>({ email: '', phone: '', address: '', est_response: '' });
  const [heroForm, setHeroForm] = useState<HeroInfo>({
    badge: '',
    title_prefix: '',
    title_highlight: '',
    title_suffix: '',
    subtitle: '',
    cta1_text: '',
    cta1_link: '',
    cta2_text: '',
    cta2_link: '',
    trust_indicators: []
  });

  // Load Admin Token on Mount
  useEffect(() => {
    if (token) {
      loadTabData();
    }
  }, [token, activeTab]);

  const loadTabData = async () => {
    setDataLoading(true);
    try {
      if (activeTab === 'services') {
        const res = await fetchServices();
        setServices(res);
      } else if (activeTab === 'projects') {
        const res = await fetchProjects();
        setProjects(res);
      } else if (activeTab === 'testimonials') {
        const res = await fetchTestimonials();
        setTestimonials(res);
      } else if (activeTab === 'faqs') {
        const res = await fetchFAQs();
        setFaqs(res);
      } else if (activeTab === 'blog') {
        const res = await fetchBlogPosts();
        setBlogPosts(res);
      } else if (activeTab === 'contact') {
        const res = await fetchContactInfo();
        setContactInfo(res);
        setContactForm(res);
      } else if (activeTab === 'hero') {
        const res = await fetchHeroInfo();
        setHeroForm(res);
      } else if (activeTab === 'enquiries') {
        const res = await fetchEnquiries();
        setEnquiries(res);
      }
    } catch (err) {
      console.error('Error loading tab data:', err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleDeleteEnquiry = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await deleteEnquiry(id);
      const res = await fetchEnquiries();
      setEnquiries(res);
      if (replyingId === id) {
        setReplyingId(null);
        setReplyText('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete enquiry');
    }
  };

  const handleReplyEnquiry = async (id: number) => {
    if (!replyText.trim()) {
      alert('Reply message cannot be empty');
      return;
    }
    try {
      await replyToEnquiry(id, replyText);
      setReplyText('');
      setReplyingId(null);
      const res = await fetchEnquiries();
      setEnquiries(res);
      alert('Reply saved and simulated dispatch logged successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to send reply');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await loginAdmin(loginUser, loginPass);
      setToken(res.token);
      setUsername(res.username);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    setToken(null);
    setUsername(null);
  };

  // --- CRUD Modal Actions ---

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedId(null);
    setSaveError('');
    
    // Reset Forms
    setServiceForm({ id: '', title: '', shortDesc: '', fullDesc: '', features: [''], specs: { '': '' } });
    setServiceIcon('Zap');
    
    setProjectForm({
      title: '',
      category: 'polynexus',
      desc: '',
      metric: '',
      metricLabel: '',
      tech: [''],
      image: '',
      file: '',
      longDesc: '',
      benefits: [''],
      results: [''],
      price: '',
      price_detail_html: '',
      standard_price: '',
      standard_original_price: '',
      premium_price: '',
      premium_original_price: '',
      standard_features: [''],
      premium_features: [''],
      enterprise_features: ['']
    });
    setProjectIcon('Cpu');
    
    setTestimonialForm({ name: '', role: '', company: '', content: '', rating: 5, avatar: '' });
    setFaqForm({ question: '', answer: '' });
    setBlogForm({ title: '', category: '', date: new Date().toISOString().split('T')[0], readTime: '', summary: '', imageUrl: '' });
    
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode('edit');
    setSaveError('');
    
    if (activeTab === 'services') {
      setSelectedId(item.id);
      setServiceForm({
        id: item.id,
        title: item.title,
        shortDesc: item.shortDesc,
        fullDesc: item.fullDesc,
        features: item.features.length > 0 ? item.features : [''],
        specs: Object.keys(item.specs).length > 0 ? item.specs : { '': '' }
      });
      // Icon mapping back to string name
      const iconName = item.icon?.name || 'Zap';
      setServiceIcon(iconName);
    } else if (activeTab === 'projects') {
      setSelectedId(item.id);
      setProjectForm({
        title: item.title,
        category: item.category,
        desc: item.desc,
        metric: item.metric,
        metricLabel: item.metricLabel,
        tech: item.tech.length > 0 ? item.tech : [''],
        image: item.image,
        file: item.file || '',
        longDesc: item.longDesc || '',
        benefits: item.benefits && item.benefits.length > 0 ? item.benefits : [''],
        results: item.results && item.results.length > 0 ? item.results : [''],
        price: item.price || '',
        price_detail_html: item.price_detail_html || '',
        standard_price: item.standard_price || '',
        standard_original_price: item.standard_original_price || '',
        premium_price: item.premium_price || '',
        premium_original_price: item.premium_original_price || '',
        standard_features: item.standard_features && item.standard_features.length > 0 ? item.standard_features : [''],
        premium_features: item.premium_features && item.premium_features.length > 0 ? item.premium_features : [''],
        enterprise_features: item.enterprise_features && item.enterprise_features.length > 0 ? item.enterprise_features : ['']
      });
      const iconName = item.icon?.name || 'Cpu';
      setProjectIcon(iconName);
    } else if (activeTab === 'testimonials') {
      setSelectedId(item.id);
      setTestimonialForm(item);
    } else if (activeTab === 'faqs') {
      setSelectedId(item.id);
      setFaqForm(item);
    } else if (activeTab === 'blog') {
      setSelectedId(item.id);
      // Convert formatted string date back to ISO format for input value
      let dateIso = '';
      try {
        const d = new Date(item.date);
        dateIso = d.toISOString().split('T')[0];
      } catch {
        dateIso = new Date().toISOString().split('T')[0];
      }
      setBlogForm({
        ...item,
        date: dateIso
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      if (activeTab === 'services') {
        await deleteService(id);
      } else if (activeTab === 'projects') {
        await deleteProject(id);
      } else if (activeTab === 'testimonials') {
        await deleteTestimonial(id);
      } else if (activeTab === 'faqs') {
        await deleteFAQ(id);
      } else if (activeTab === 'blog') {
        await deleteBlogPost(id);
      }
      loadTabData();
    } catch (err: any) {
      alert(err.message || 'Deletion failed');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveLoading(true);
    try {
      if (activeTab === 'services') {
        const payload = {
          ...serviceForm,
          icon: serviceIcon,
          // filter empty specification fields
          specs: Object.fromEntries(
            Object.entries(serviceForm.specs).filter(([k, v]) => k.trim() !== '')
          )
        };
        if (modalMode === 'create') {
          await createService(payload);
        } else {
          await updateService(selectedId, payload);
        }
      } else if (activeTab === 'projects') {
        const payload = {
          ...projectForm,
          icon: projectIcon,
          tech: projectForm.tech.filter((t) => t.trim() !== ''),
          benefits: (projectForm.benefits || []).filter((b) => b.trim() !== ''),
          results: (projectForm.results || []).filter((r) => r.trim() !== ''),
          standard_features: (projectForm.standard_features || []).filter((f) => f.trim() !== ''),
          premium_features: (projectForm.premium_features || []).filter((f) => f.trim() !== ''),
          enterprise_features: (projectForm.enterprise_features || []).filter((f) => f.trim() !== '')
        };
        if (modalMode === 'create') {
          await createProject(payload);
        } else {
          await updateProject(selectedId, payload);
        }
      } else if (activeTab === 'testimonials') {
        if (modalMode === 'create') {
          await createTestimonial(testimonialForm);
        } else {
          await updateTestimonial(selectedId, testimonialForm);
        }
      } else if (activeTab === 'faqs') {
        if (modalMode === 'create') {
          await createFAQ(faqForm);
        } else {
          await updateFAQ(selectedId, faqForm);
        }
      } else if (activeTab === 'blog') {
        if (modalMode === 'create') {
          await createBlogPost(blogForm);
        } else {
          await updateBlogPost(selectedId, blogForm);
        }
      } else if (activeTab === 'contact') {
        await updateContactInfo(contactForm);
      } else if (activeTab === 'hero') {
        await updateHeroInfo(heroForm);
      }
      
      setIsModalOpen(false);
      loadTabData();
    } catch (err: any) {
      setSaveError(err.message || 'Saving failed');
    } finally {
      setSaveLoading(false);
    }
  };

  // --- Dynamic Sub-array inputs helpers ---
  
  const addFeatureRow = () => {
    setServiceForm(prev => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeatureRow = (index: number) => {
    setServiceForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const updateFeatureRow = (index: number, val: string) => {
    setServiceForm(prev => {
      const copy = [...prev.features];
      copy[index] = val;
      return { ...prev, features: copy };
    });
  };

  const addSpecRow = () => {
    setServiceForm(prev => ({ ...prev, specs: { ...prev.specs, '': '' } }));
  };

  const removeSpecRow = (key: string) => {
    setServiceForm(prev => {
      const copy = { ...prev.specs };
      delete copy[key];
      return { ...prev, specs: copy };
    });
  };

  const updateSpecKey = (oldKey: string, newKey: string) => {
    setServiceForm(prev => {
      const copy = { ...prev.specs };
      const val = copy[oldKey];
      delete copy[oldKey];
      copy[newKey] = val;
      return { ...prev, specs: copy };
    });
  };

  const updateSpecVal = (key: string, val: string) => {
    setServiceForm(prev => ({
      ...prev,
      specs: { ...prev.specs, [key]: val }
    }));
  };

  const addTechRow = () => {
    setProjectForm(prev => ({ ...prev, tech: [...prev.tech, ''] }));
  };

  const removeTechRow = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      tech: prev.tech.filter((_, i) => i !== index)
    }));
  };

  const updateTechRow = (index: number, val: string) => {
    setProjectForm(prev => {
      const copy = [...prev.tech];
      copy[index] = val;
      return { ...prev, tech: copy };
    });
  };

  const addBenefitRow = () => {
    setProjectForm(prev => ({ ...prev, benefits: [...(prev.benefits || []), ''] }));
  };

  const removeBenefitRow = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      benefits: (prev.benefits || []).filter((_, i) => i !== index)
    }));
  };

  const updateBenefitRow = (index: number, val: string) => {
    setProjectForm(prev => {
      const copy = [...(prev.benefits || [])];
      copy[index] = val;
      return { ...prev, benefits: copy };
    });
  };

  const addResultRow = () => {
    setProjectForm(prev => ({ ...prev, results: [...(prev.results || []), ''] }));
  };

  const removeResultRow = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      results: (prev.results || []).filter((_, i) => i !== index)
    }));
  };

  const updateResultRow = (index: number, val: string) => {
    setProjectForm(prev => {
      const copy = [...(prev.results || [])];
      copy[index] = val;
      return { ...prev, results: copy };
    });
  };

  const addStandardFeatureRow = () => {
    setProjectForm(prev => ({ ...prev, standard_features: [...(prev.standard_features || []), ''] }));
  };

  const removeStandardFeatureRow = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      standard_features: (prev.standard_features || []).filter((_, i) => i !== index)
    }));
  };

  const updateStandardFeatureRow = (index: number, val: string) => {
    setProjectForm(prev => {
      const copy = [...(prev.standard_features || [])];
      copy[index] = val;
      return { ...prev, standard_features: copy };
    });
  };

  const addPremiumFeatureRow = () => {
    setProjectForm(prev => ({ ...prev, premium_features: [...(prev.premium_features || []), ''] }));
  };

  const removePremiumFeatureRow = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      premium_features: (prev.premium_features || []).filter((_, i) => i !== index)
    }));
  };

  const updatePremiumFeatureRow = (index: number, val: string) => {
    setProjectForm(prev => {
      const copy = [...(prev.premium_features || [])];
      copy[index] = val;
      return { ...prev, premium_features: copy };
    });
  };

  const addEnterpriseFeatureRow = () => {
    setProjectForm(prev => ({ ...prev, enterprise_features: [...(prev.enterprise_features || []), ''] }));
  };

  const removeEnterpriseFeatureRow = (index: number) => {
    setProjectForm(prev => ({
      ...prev,
      enterprise_features: (prev.enterprise_features || []).filter((_, i) => i !== index)
    }));
  };

  const updateEnterpriseFeatureRow = (index: number, val: string) => {
    setProjectForm(prev => {
      const copy = [...(prev.enterprise_features || [])];
      copy[index] = val;
      return { ...prev, enterprise_features: copy };
    });
  };

  // --- RENDER PORTAL ---

  // LOGIN SCREEN RENDER
  if (!token) {
    return (
      <div className="min-h-screen bg-[#010B33] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Visual mesh glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-[#45C7AC]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[#E27000]/10 blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 relative z-10 shadow-2xl">
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-8 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Website
          </button>
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-4 border border-secondary/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Admin Console</h1>
            <p className="text-slate-400 text-xs mt-1">Authenticate to access database models</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-xs placeholder-slate-500 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="admin"
                  required
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label htmlFor="pass" className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  id="pass"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-xs placeholder-slate-500 focus:outline-none focus:border-secondary transition-colors"
                  placeholder="••••••••"
                  required
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-secondary hover:bg-[#35b399] disabled:bg-slate-700 text-primary font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer mt-4 flex justify-center items-center gap-1.5"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD RENDER
  return (
    <div className="min-h-screen bg-[#010620] text-slate-100 flex font-sans">
      {/* Sidebar navigation */}
      <aside className="w-64 bg-[#010b33] border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-secondary/15 text-secondary">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm tracking-tight text-white">POLYNEXUS</span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Control Center</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'services' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              Services Table
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'projects' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Cpu className="w-4 h-4" />
              Projects Table
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              Testimonials
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'faqs' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQs Accordion
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'blog' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'contact' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              Contact Coordinates
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'hero' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Hero Section
            </button>
            <button
              onClick={() => setActiveTab('enquiries')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'enquiries' ? 'bg-secondary text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              User Enquiries
            </button>
          </nav>
        </div>

        {/* Footer controls */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 px-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-secondary font-mono">
              {username?.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <span className="block text-[10px] text-white font-bold leading-none">{username}</span>
              <span className="block text-[8px] text-slate-400 uppercase font-bold font-mono mt-0.5">Staff Account</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Landing Page
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-550/15 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Tab Header title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold text-secondary uppercase font-mono tracking-wider">Database Operations</span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
              {activeTab === 'services' && 'Services Schema Card Grid'}
              {activeTab === 'projects' && 'Projects Portfolio Cards'}
              {activeTab === 'testimonials' && 'Testimonials Slideshow Reviews'}
              {activeTab === 'faqs' && 'FAQ checklist Accordion'}
              {activeTab === 'blog' && 'Journal BlogPost Articles'}
              {activeTab === 'contact' && 'Global Coordinates Config'}
              {activeTab === 'hero' && 'Hero Section Configuration'}
              {activeTab === 'enquiries' && 'User Contact Enquiries'}
            </h2>
          </div>

          {activeTab !== 'contact' && activeTab !== 'hero' && activeTab !== 'enquiries' && (
            <button
              onClick={openCreateModal}
              className="bg-secondary hover:bg-[#35b399] text-primary text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Record
            </button>
          )}
        </div>

        {/* Content render panels */}
        {dataLoading ? (
          <div className="h-64 flex items-center justify-center font-mono text-slate-400 text-xs">
            Querying PostgreSQL database...
          </div>
        ) : (
          <div className="bg-[#010b33]/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl relative backdrop-blur-sm overflow-hidden">
            
            {/* SERVICES RENDER */}
            {activeTab === 'services' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Slug (ID)</th>
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Icon</th>
                      <th className="pb-3">Short Description</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/50">
                    {services.map((item) => (
                      <tr key={item.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 pl-2 font-mono text-slate-300 font-bold">{item.id}</td>
                        <td className="py-3.5 font-bold text-white">{item.title}</td>
                        <td className="py-3.5 font-mono text-secondary">{item.icon?.name || 'Zap'}</td>
                        <td className="py-3.5 text-slate-400 max-w-xs truncate">{item.shortDesc}</td>
                        <td className="py-3.5 text-right space-x-1">
                          <button onClick={() => openEditModal(item)} className="p-2 bg-slate-850 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-850 hover:bg-red-550/15 rounded-lg text-slate-350 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PROJECTS RENDER */}
            {activeTab === 'projects' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Title</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Metric</th>
                      <th className="pb-3">Tech stack</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/50">
                    {projects.map((item) => (
                      <tr key={item.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-white">{item.title}</td>
                        <td className="py-3.5 font-bold font-mono"><span className="px-2.5 py-0.5 rounded border border-white/5 bg-white/5 text-slate-300 uppercase text-[9px]">{item.category === 'polynexus' ? 'Polynexus' : item.category === 'custom' ? 'Custom' : item.category}</span></td>
                        <td className="py-3.5 font-mono text-secondary">{item.metric} ({item.metricLabel})</td>
                        <td className="py-3.5 text-slate-400 max-w-xs truncate">{item.tech.join(', ')}</td>
                        <td className="py-3.5 text-right space-x-1">
                          <button onClick={() => openEditModal(item)} className="p-2 bg-slate-850 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-850 hover:bg-red-550/15 rounded-lg text-slate-350 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TESTIMONIALS RENDER */}
            {activeTab === 'testimonials' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Name</th>
                      <th className="pb-3">Role / Company</th>
                      <th className="pb-3">Content</th>
                      <th className="pb-3 text-center">Rating</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/50">
                    {testimonials.map((item) => (
                      <tr key={item.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-white">{item.name}</td>
                        <td className="py-3.5 text-slate-300">{item.role} at <span className="font-bold text-secondary">{item.company}</span></td>
                        <td className="py-3.5 text-slate-400 max-w-xs truncate italic">"{item.content}"</td>
                        <td className="py-3.5 text-center font-bold text-accent font-mono">{item.rating}/5</td>
                        <td className="py-3.5 text-right space-x-1">
                          <button onClick={() => openEditModal(item)} className="p-2 bg-slate-850 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-850 hover:bg-red-550/15 rounded-lg text-slate-350 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* FAQS RENDER */}
            {activeTab === 'faqs' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Question</th>
                      <th className="pb-3">Answer</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/50">
                    {faqs.map((item) => (
                      <tr key={item.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-white max-w-xs truncate">{item.question}</td>
                        <td className="py-3.5 text-slate-400 max-w-md truncate">{item.answer}</td>
                        <td className="py-3.5 text-right space-x-1">
                          <button onClick={() => openEditModal(item)} className="p-2 bg-slate-850 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-850 hover:bg-red-550/15 rounded-lg text-slate-350 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* BLOG RENDER */}
            {activeTab === 'blog' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <th className="pb-3 pl-2">Headline</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Published Date</th>
                      <th className="pb-3">Read Time</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-slate-800/50">
                    {blogPosts.map((item) => (
                      <tr key={item.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 pl-2 font-bold text-white max-w-xs truncate">{item.title}</td>
                        <td className="py-3.5 font-bold text-secondary font-mono">{item.category}</td>
                        <td className="py-3.5 text-slate-300 font-mono">{item.date}</td>
                        <td className="py-3.5 text-slate-400 font-mono">{item.readTime}</td>
                        <td className="py-3.5 text-right space-x-1">
                          <button onClick={() => openEditModal(item)} className="p-2 bg-slate-850 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 bg-slate-850 hover:bg-red-550/15 rounded-lg text-slate-350 hover:text-red-400 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CONTACT SETTINGS RENDER */}
            {activeTab === 'contact' && contactInfo && (
              <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
                {saveError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Support Email</label>
                    <input
                      type="email"
                      id="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Call Registry Phone</label>
                    <input
                      type="text"
                      id="phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Command Center Address</label>
                  <input
                    type="text"
                    id="address"
                    value={contactForm.address}
                    onChange={(e) => setContactForm(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors font-bold"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="est" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Response Time Label</label>
                  <input
                    type="text"
                    id="est"
                    value={contactForm.est_response}
                    onChange={(e) => setContactForm(prev => ({ ...prev, est_response: e.target.value }))}
                    className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors font-mono font-bold"
                    required
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="bg-secondary hover:bg-[#35b399] disabled:bg-slate-700 text-primary text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    {saveLoading ? 'Updating settings...' : 'Update Settings'}
                  </button>
                </div>
              </form>
            )}

            {/* HERO SETTINGS RENDER */}
            {activeTab === 'hero' && (
              <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
                {saveError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Badge Text</label>
                    <input
                      type="text"
                      value={heroForm.badge}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, badge: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Title Highlight Word(s)</label>
                    <input
                      type="text"
                      value={heroForm.title_highlight}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title_highlight: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors font-bold text-secondary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Title Prefix</label>
                    <input
                      type="text"
                      value={heroForm.title_prefix}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title_prefix: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Title Suffix</label>
                    <input
                      type="text"
                      value={heroForm.title_suffix}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title_suffix: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={heroForm.subtitle}
                    onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary CTA Button Text</label>
                    <input
                      type="text"
                      value={heroForm.cta1_text}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, cta1_text: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary CTA Button Link</label>
                    <input
                      type="text"
                      value={heroForm.cta1_link}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, cta1_link: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Secondary CTA Button Text</label>
                    <input
                      type="text"
                      value={heroForm.cta2_text}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, cta2_text: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Secondary CTA Button Link</label>
                    <input
                      type="text"
                      value={heroForm.cta2_link}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, cta2_link: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Trust Indicators Array Fields */}
                <div className="border-t border-slate-800 pt-6">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
                    Trust Indicators (Exact 3 Items recommended)
                    <button
                      type="button"
                      onClick={() => setHeroForm(prev => ({ ...prev, trust_indicators: [...prev.trust_indicators, { label: 'New Metric', value: '100% SLA', icon: 'Sparkles', color: 'text-secondary' }] }))}
                      className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Add Indicator
                    </button>
                  </label>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {heroForm.trust_indicators?.map((indicator, index) => (
                      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-white/2 border border-slate-800/80 rounded-2xl relative">
                        <button
                          type="button"
                          onClick={() => setHeroForm(prev => ({ ...prev, trust_indicators: prev.trust_indicators.filter((_, i) => i !== index) }))}
                          className="absolute -top-2.5 -right-2.5 bg-red-500/10 border border-red-500/30 text-red-400 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="sm:col-span-3">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Label</label>
                          <input
                            type="text"
                            value={indicator.label}
                            onChange={(e) => setHeroForm(prev => {
                              const copy = [...prev.trust_indicators];
                              copy[index] = { ...copy[index], label: e.target.value };
                              return { ...prev, trust_indicators: copy };
                            })}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                            required
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Value</label>
                          <input
                            type="text"
                            value={indicator.value}
                            onChange={(e) => setHeroForm(prev => {
                              const copy = [...prev.trust_indicators];
                              copy[index] = { ...copy[index], value: e.target.value };
                              return { ...prev, trust_indicators: copy };
                            })}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                            required
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Icon Component</label>
                          <select
                            value={indicator.icon}
                            onChange={(e) => setHeroForm(prev => {
                              const copy = [...prev.trust_indicators];
                              copy[index] = { ...copy[index], icon: e.target.value };
                              return { ...prev, trust_indicators: copy };
                            })}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary font-mono"
                          >
                            <option value="Sparkles">Sparkles</option>
                            <option value="Zap">Zap</option>
                            <option value="Activity">Activity</option>
                            <option value="Cpu">Cpu</option>
                            <option value="Database">Database</option>
                            <option value="Globe">Globe</option>
                            <option value="Shield">Shield</option>
                          </select>
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">Color CSS Class</label>
                          <select
                            value={indicator.color}
                            onChange={(e) => setHeroForm(prev => {
                              const copy = [...prev.trust_indicators];
                              copy[index] = { ...copy[index], color: e.target.value };
                              return { ...prev, trust_indicators: copy };
                            })}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary font-mono"
                          >
                            <option value="text-secondary">text-secondary (Emerald)</option>
                            <option value="text-[#E27000]">text-[#E27000] (Amber)</option>
                            <option value="text-purple-500">text-purple-500 (Purple)</option>
                            <option value="text-cyan-500">text-cyan-500 (Cyan)</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="bg-secondary hover:bg-[#35b399] disabled:bg-slate-700 text-primary text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    {saveLoading ? 'Updating hero details...' : 'Update Hero Settings'}
                  </button>
                </div>
              </form>
            )}

            {/* ENQUIRIES RENDER */}
            {activeTab === 'enquiries' && (
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 pl-2">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Company</th>
                        <th className="pb-3">Message</th>
                        <th className="pb-3">Submitted At</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-slate-800/50">
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500 italic">No enquiries received yet.</td>
                        </tr>
                      ) : (
                        enquiries.map((item) => (
                          <tr key={item.id} className="hover:bg-white/2 transition-colors">
                            <td className="py-3.5 pl-2 font-bold text-white whitespace-nowrap">{item.name}</td>
                            <td className="py-3.5 font-mono text-slate-300">{item.email}</td>
                            <td className="py-3.5 text-slate-300">{item.company || <span className="text-slate-600">-</span>}</td>
                            <td className="py-3.5 text-slate-400 max-w-xs truncate" title={item.message}>{item.message}</td>
                            <td className="py-3.5 text-slate-400 font-mono whitespace-nowrap">{item.created_at}</td>
                            <td className="py-3.5 whitespace-nowrap">
                              {item.replied ? (
                                <span className="px-2.5 py-0.5 rounded border border-secondary/20 bg-secondary/10 text-secondary text-[9px] font-bold uppercase">Replied</span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded border border-accent/20 bg-accent/10 text-accent text-[9px] font-bold uppercase">Pending</span>
                              )}
                            </td>
                            <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                              <button 
                                onClick={() => {
                                  setReplyingId(item.id);
                                  setReplyText(item.reply_message || '');
                                }} 
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-[10px] font-bold rounded-lg text-secondary hover:text-white transition-colors cursor-pointer animate-none"
                              >
                                {item.replied ? 'View/Edit Reply' : 'Reply'}
                              </button>
                              <button onClick={() => handleDeleteEnquiry(item.id)} className="p-2 bg-slate-850 hover:bg-red-550/15 rounded-lg text-slate-350 hover:text-red-400 transition-colors cursor-pointer inline-flex items-center">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Reply Form Section */}
                {replyingId !== null && (
                  <div className="mt-8 border-t border-slate-800 pt-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-white">
                        {enquiries.find(e => e.id === replyingId)?.replied ? 'Update Reply' : 'Send Reply'} to {enquiries.find(e => e.id === replyingId)?.name}
                      </h3>
                      <button 
                        onClick={() => {
                          setReplyingId(null);
                          setReplyText('');
                        }} 
                        className="text-slate-400 hover:text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>

                    <div className="bg-[#010620]/65 border border-slate-800 rounded-2xl p-4 mb-4">
                      <span className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider font-mono mb-1.5">Original Message</span>
                      <p className="text-xs text-slate-300 whitespace-pre-wrap">{enquiries.find(e => e.id === replyingId)?.message}</p>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reply Content</label>
                      <textarea
                        rows={4}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-secondary transition-colors"
                        placeholder="Type your response specifications here..."
                      />
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleReplyEnquiry(replyingId)}
                          className="bg-secondary hover:bg-[#35b399] text-primary text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                        >
                          Submit Reply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* CRUD POP-UP EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#010620]/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#010b33] border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800/40 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white tracking-tight mb-6">
              {modalMode === 'create' ? 'Create New' : 'Edit Existing'}{' '}
              {activeTab === 'services' && 'Service Module'}
              {activeTab === 'projects' && 'Portfolio Project'}
              {activeTab === 'testimonials' && 'Customer Review'}
              {activeTab === 'faqs' && 'FAQ Accordion Card'}
              {activeTab === 'blog' && 'BlogPost Article'}
            </h3>

            <form onSubmit={handleSave} className="space-y-5">
              {saveError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3.5 rounded-xl flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {/* SERVICES FORM FIELDS */}
              {activeTab === 'services' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Service Slug (ID) *</label>
                      <input
                        type="text"
                        value={serviceForm.id}
                        onChange={(e) => setServiceForm(prev => ({ ...prev, id: e.target.value }))}
                        disabled={modalMode === 'edit'}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono disabled:opacity-50"
                        placeholder="design"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lucide Icon name *</label>
                      <select
                        value={serviceIcon}
                        onChange={(e) => setServiceIcon(e.target.value)}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                      >
                        <option value="Zap">Zap (Lightning)</option>
                        <option value="Database">Database (Data)</option>
                        <option value="Shield">Shield (Security)</option>
                        <option value="Layers">Layers (Allocation)</option>
                        <option value="Cpu">Cpu (Inference)</option>
                        <option value="Globe">Globe (Network)</option>
                        <option value="FolderGit">FolderGit (Code)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Display Title *</label>
                    <input
                      type="text"
                      value={serviceForm.title}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-bold"
                      placeholder="Adaptive Design Systems"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Short Description (max 250 chars) *</label>
                    <input
                      type="text"
                      maxLength={250}
                      value={serviceForm.shortDesc}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, shortDesc: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                      placeholder="Card brief description..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Modal Description *</label>
                    <textarea
                      rows={3}
                      value={serviceForm.fullDesc}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, fullDesc: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                      placeholder="In-depth spec description..."
                      required
                    />
                  </div>

                  {/* Features List */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      Integration Features (min 1 feature)
                      <button type="button" onClick={addFeatureRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Feature
                      </button>
                    </label>
                    <div className="space-y-2 max-h-36 overflow-y-auto pt-1.5">
                      {serviceForm.features.map((feat, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={feat}
                            onChange={(e) => updateFeatureRow(index, e.target.value)}
                            className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-secondary"
                            placeholder="e.g. Automated component assembly pipelines"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeFeatureRow(index)}
                            disabled={serviceForm.features.length <= 1}
                            className="p-2 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications JSON KV */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      Engineering Benchmark Specifications
                      <button type="button" onClick={addSpecRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Spec Row
                      </button>
                    </label>
                    <div className="space-y-2 max-h-36 overflow-y-auto pt-1.5">
                      {Object.entries(serviceForm.specs).map(([k, v], index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={k}
                            onChange={(e) => updateSpecKey(k, e.target.value)}
                            className="w-1/3 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-secondary font-mono"
                            placeholder="Key (e.g. Speed)"
                            required
                          />
                          <input
                            type="text"
                            value={v}
                            onChange={(e) => updateSpecVal(k, e.target.value)}
                            className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-secondary font-mono"
                            placeholder="Value (e.g. 100% core speed)"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeSpecRow(k)}
                            disabled={Object.keys(serviceForm.specs).length <= 1}
                            className="p-2 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PROJECTS FORM FIELDS */}
              {activeTab === 'projects' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Display Title *</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-bold"
                        placeholder="Cognitive Query API"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Project Category *</label>
                      <select
                        value={projectForm.category}
                        onChange={(e: any) => setProjectForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                      >
                        <option value="polynexus">Polynexus Products</option>
                        <option value="custom">Custom Software</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">High-Impact Metric *</label>
                      <input
                        type="text"
                        value={projectForm.metric}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, metric: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono text-secondary"
                        placeholder="e.g. 0.15ms, 100%, 48Tbps"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Metric Explanation Label *</label>
                      <input
                        type="text"
                        value={projectForm.metricLabel}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, metricLabel: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                        placeholder="e.g. Vector Resolution"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Mockup Shell File (Hero projects only)</label>
                      <input
                        type="text"
                        value={projectForm.file || ''}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, file: e.target.value || null }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                        placeholder="cognitive-query-api.sh"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Lucide Icon name *</label>
                      <select
                        value={projectIcon}
                        onChange={(e) => setProjectIcon(e.target.value)}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                      >
                        <option value="Cpu">Cpu</option>
                        <option value="Database">Database</option>
                        <option value="Globe">Globe</option>
                        <option value="FolderGit">FolderGit</option>
                        <option value="Zap">Zap</option>
                        <option value="Shield">Shield</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upload Project Mockup Image File</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProjectForm(prev => ({ ...prev, image: reader.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-secondary font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Or Image Screenshot URL</label>
                      <input
                        type="text"
                        value={projectForm.image.startsWith('data:image/') ? '' : projectForm.image}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, image: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                        placeholder="https://images.unsplash.com/photo-..."
                      />
                    </div>
                  </div>

                  {projectForm.image && (
                    <div className="mt-2">
                      <label className="block text-[9px] font-bold text-slate-505 uppercase tracking-wider mb-1.5">Mockup Image Preview</label>
                      <div className="relative w-48 aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black/40">
                        <img src={projectForm.image} alt="Preview" className="w-full h-full object-cover object-top" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Case Study Description *</label>
                    <textarea
                      rows={3}
                      value={projectForm.desc}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, desc: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                      placeholder="Detailed explanation..."
                      required
                    />
                  </div>

                  {/* Tech stack row */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      Technologies used (Array of Strings)
                      <button type="button" onClick={addTechRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Tech
                      </button>
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto pt-1.5">
                      {projectForm.tech.map((t, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={t}
                            onChange={(e) => updateTechRow(index, e.target.value)}
                            className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary font-mono"
                            placeholder="Rust"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => removeTechRow(index)}
                            disabled={projectForm.tech.length <= 1}
                            className="p-1.5 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Narrative Case Study Details */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Narrative Case Study (Optional)</label>
                    <textarea
                      rows={3}
                      value={projectForm.longDesc || ''}
                      onChange={(e) => setProjectForm(prev => ({ ...prev, longDesc: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                      placeholder="Extended detailed project explanation..."
                    />
                  </div>

                  {/* Benefits List */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      Key Project Benefits & Value
                      <button type="button" onClick={addBenefitRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Benefit
                      </button>
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pt-1.5">
                      {(projectForm.benefits || ['']).map((b, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={b}
                            onChange={(e) => updateBenefitRow(index, e.target.value)}
                            className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                            placeholder="Scales message capacity smoothly to eliminate latency bottlenecks..."
                          />
                          <button
                            type="button"
                            onClick={() => removeBenefitRow(index)}
                            disabled={(projectForm.benefits || []).length <= 1}
                            className="p-1.5 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Results List */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                      Measurable Outcomes & Results
                      <button type="button" onClick={addResultRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                        <Plus className="w-3 h-3" /> Add Outcome
                      </button>
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pt-1.5">
                      {(projectForm.results || ['']).map((r, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={r}
                            onChange={(e) => updateResultRow(index, e.target.value)}
                            className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                            placeholder="Delivered 99.999% uptime SLA..."
                          />
                          <button
                            type="button"
                            onClick={() => removeResultRow(index)}
                            disabled={(projectForm.results || []).length <= 1}
                            className="p-1.5 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Starting Base Price *</label>
                      <input
                        type="text"
                        value={projectForm.price || ''}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                        placeholder="Starting from ₹599 / unit / month"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upload Detailed Pricing HTML Sheet</label>
                      <input
                        type="file"
                        accept=".html,.txt"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProjectForm(prev => ({ ...prev, price_detail_html: reader.result as string }));
                            };
                            reader.readAsText(file);
                          }
                        }}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-secondary font-mono"
                      />
                    </div>
                  </div>

                  {projectForm.price_detail_html && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Detailed Pricing HTML Markup</label>
                        <button
                          type="button"
                          onClick={() => setProjectForm(prev => ({ ...prev, price_detail_html: '' }))}
                          className="text-red-400 hover:text-red-300 text-[9px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Clear HTML Sheet
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={projectForm.price_detail_html}
                        onChange={(e) => setProjectForm(prev => ({ ...prev, price_detail_html: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-[11px] focus:outline-none focus:border-secondary font-mono leading-relaxed"
                        placeholder="Raw HTML content (e.g. <table>...</table>)..."
                      />
                    </div>
                  )}

                  {/* Polynexus Products Pricing Tiers (Only shown for polynexus category) */}
                  {projectForm.category === 'polynexus' && (
                    <div className="border-t border-slate-800/85 pt-4 mt-4 space-y-4">
                      <div className="text-[11px] font-bold text-secondary uppercase tracking-wider font-mono">3-Tier Plan Configuration</div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Standard Price (Discounted)</label>
                          <input
                            type="text"
                            value={projectForm.standard_price || ''}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, standard_price: e.target.value }))}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                            placeholder="e.g. 1249"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Standard Price (Original)</label>
                          <input
                            type="text"
                            value={projectForm.standard_original_price || ''}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, standard_original_price: e.target.value }))}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                            placeholder="e.g. 1499"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Premium Price (Discounted)</label>
                          <input
                            type="text"
                            value={projectForm.premium_price || ''}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, premium_price: e.target.value }))}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                            placeholder="e.g. 2999"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Premium Price (Original)</label>
                          <input
                            type="text"
                            value={projectForm.premium_original_price || ''}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, premium_original_price: e.target.value }))}
                            className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                            placeholder="e.g. 3499"
                          />
                        </div>
                      </div>

                      {/* Standard Plan Features List */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          Standard Plan Features List
                          <button type="button" onClick={addStandardFeatureRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                            <Plus className="w-3 h-3" /> Add Standard Feature
                          </button>
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pt-1.5">
                          {(projectForm.standard_features || ['']).map((feat, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => updateStandardFeatureRow(index, e.target.value)}
                                className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                                placeholder="e.g. Create quotes and GST compliant invoices"
                              />
                              <button
                                type="button"
                                onClick={() => removeStandardFeatureRow(index)}
                                disabled={(projectForm.standard_features || []).length <= 1}
                                className="p-1.5 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Premium Plan Features List */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          Premium Plan Features List
                          <button type="button" onClick={addPremiumFeatureRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                            <Plus className="w-3 h-3" /> Add Premium Feature
                          </button>
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pt-1.5">
                          {(projectForm.premium_features || ['']).map((feat, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => updatePremiumFeatureRow(index, e.target.value)}
                                className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                                placeholder="e.g. Manage subscription billing"
                              />
                              <button
                                type="button"
                                onClick={() => removePremiumFeatureRow(index)}
                                disabled={(projectForm.premium_features || []).length <= 1}
                                className="p-1.5 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Enterprise Plan Features List */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                          Enterprise Plan Features List
                          <button type="button" onClick={addEnterpriseFeatureRow} className="text-secondary hover:underline text-[9px] font-bold flex items-center gap-0.5 cursor-pointer">
                            <Plus className="w-3 h-3" /> Add Enterprise Feature
                          </button>
                        </label>
                        <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto pt-1.5">
                          {(projectForm.enterprise_features || ['']).map((feat, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={feat}
                                onChange={(e) => updateEnterpriseFeatureRow(index, e.target.value)}
                                className="flex-1 bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-secondary"
                                placeholder="e.g. Flexible revenue recognition configurations"
                              />
                              <button
                                type="button"
                                onClick={() => removeEnterpriseFeatureRow(index)}
                                disabled={(projectForm.enterprise_features || []).length <= 1}
                                className="p-1.5 border border-slate-800 hover:border-red-500 rounded-xl text-slate-400 hover:text-red-400 disabled:opacity-30 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TESTIMONIALS FORM FIELDS */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Reviewer Full Name *</label>
                      <input
                        type="text"
                        value={testimonialForm.name}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-bold"
                        placeholder="Sarah Jenkins"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Rating score (1 to 5) *</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={testimonialForm.rating}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Job Role *</label>
                      <input
                        type="text"
                        value={testimonialForm.role}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                        placeholder="VP of Platform Engineering"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company *</label>
                      <input
                        type="text"
                        value={testimonialForm.company}
                        onChange={(e) => setTestimonialForm(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                        placeholder="NovusAI"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Avatar Profile Photo URL *</label>
                    <input
                      type="url"
                      value={testimonialForm.avatar}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, avatar: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                      placeholder="https://images.unsplash.com/photo-..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Narrative content (max 500 chars) *</label>
                    <textarea
                      rows={3}
                      maxLength={500}
                      value={testimonialForm.content}
                      onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary italic"
                      placeholder="Migrating our ingestion layers reduced API latency..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* FAQS FORM FIELDS */}
              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Frequently Asked Question *</label>
                    <input
                      type="text"
                      value={faqForm.question}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, question: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-bold"
                      placeholder="How does Polynexus achieve sub-2ms start times?"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Detailed Answer Content *</label>
                    <textarea
                      rows={4}
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm(prev => ({ ...prev, answer: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                      placeholder="We leverage lightweight WebAssembly (WASM) isolates..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* BLOG FORM FIELDS */}
              {activeTab === 'blog' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Article Headline *</label>
                      <input
                        type="text"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-bold"
                        placeholder="Compiling Rust to WebAssembly..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Category Label *</label>
                      <input
                        type="text"
                        value={blogForm.category}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-bold text-secondary font-mono"
                        placeholder="e.g. Engineering, Research"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Publication Date *</label>
                      <input
                        type="date"
                        value={blogForm.date}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Estimated Reading Duration *</label>
                      <input
                        type="text"
                        value={blogForm.readTime}
                        onChange={(e) => setBlogForm(prev => ({ ...prev, readTime: e.target.value }))}
                        className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                        placeholder="e.g. 6 min read"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Teaser Image Header URL *</label>
                    <input
                      type="url"
                      value={blogForm.imageUrl}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary font-mono"
                      placeholder="https://images.unsplash.com/photo-..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Brief Summary Abstract (max 300 chars) *</label>
                    <textarea
                      rows={3}
                      maxLength={300}
                      value={blogForm.summary}
                      onChange={(e) => setBlogForm(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full bg-[#010620]/65 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-secondary"
                      placeholder="Learn the exact pipeline configuration we use..."
                      required
                    />
                  </div>
                </div>
              )}

              {/* SAVE & SUBMIT CONTROLS */}
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 text-slate-350 hover:bg-slate-700 hover:text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="bg-secondary text-primary hover:bg-[#35b399] disabled:bg-slate-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  {saveLoading ? 'Saving changes...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
