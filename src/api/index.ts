import { 
  Zap, 
  Database, 
  Shield, 
  Layers, 
  Cpu, 
  Globe, 
  FolderGit,
  HelpCircle,
  Sparkles,
  Activity,
  Award,
  Users,
  Target,
  ShieldCheck,
  Lightbulb,
  Heart,
  MessageSquare,
  Search,
  Code,
  Rocket,
  Headphones,
  CheckCircle2
} from 'lucide-react';

// Map string icon names from the database to actual Lucide component imports
const iconMap: { [key: string]: any } = {
  Zap,
  Database,
  Shield,
  Layers,
  Cpu,
  Globe,
  FolderGit,
  HelpCircle,
  Sparkles,
  Activity,
  Award,
  Users,
  Target,
  ShieldCheck,
  Lightbulb,
  Heart,
  MessageSquare,
  Search,
  Code,
  Rocket,
  Headphones,
  CheckCircle2
};

export function getIconComponent(iconName: string): any {
  return iconMap[iconName] || Zap;
}

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

// Content Interfaces with ID supports
export interface Service {
  id: string;
  icon: any; // Used as Lucide React Component in UI
  title: string;
  shortDesc: string;
  fullDesc: string;
  features: string[];
  specs: { [key: string]: string };
}

export interface Project {
  id?: number;
  title: string;
  category: 'polynexus' | 'custom';
  desc: string;
  metric: string;
  metricLabel: string;
  icon: any;
  tech: string[];
  image: string;
  file?: string | null;
  longDesc?: string;
  benefits?: string[];
  results?: string[];
  price?: string;
  price_detail_html?: string;
  standard_price?: string;
  standard_original_price?: string;
  premium_price?: string;
  premium_original_price?: string;
  standard_features?: string[];
  premium_features?: string[];
  enterprise_features?: string[];
}

export interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface FAQItem {
  id?: number;
  question: string;
  answer: string;
}

export interface BlogPost {
  id?: number;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  imageUrl: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  est_response: string;
}

export interface HeroInfo {
  badge: string;
  title_prefix: string;
  title_highlight: string;
  title_suffix: string;
  subtitle: string;
  cta1_text: string;
  cta1_link: string;
  cta2_text: string;
  cta2_link: string;
  trust_indicators: Array<{ label: string; value: string; icon: string; color: string }>;
}

export interface AboutInfo {
  title_prefix: string;
  title_highlight: string;
  subtitle: string;
  stats: Array<{ value: string; label: string; icon: string }>;
  values: Array<{ title: string; desc: string; icon: string; color: string; bg: string }>;
  team: Array<{ name: string; role: string; desc: string; initials: string; color: string }>;
}

// Authentication Storage Helpers
export function getStoredToken(): string | null {
  return localStorage.getItem('admin_token');
}

export function getStoredUsername(): string | null {
  return localStorage.getItem('admin_username');
}

export function setStoredAuth(token: string, username: string) {
  localStorage.setItem('admin_token', token);
  localStorage.setItem('admin_username', username);
}

export function clearStoredAuth() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_username');
}

// Centralized fetch wrapper to enforce credentials (cookies) and Authorization headers
async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });
}

// API Authentication Request
export async function loginAdmin(username: string, password: string): Promise<{ token: string; username: string }> {
  const response = await apiFetch(`${API_BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Invalid admin credentials');
  }
  const data = await response.json();
  setStoredAuth(data.token, data.username);
  return data;
}

// Public API Fetch Functions
export async function fetchServices(): Promise<Service[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/services`);
  if (!response.ok) throw new Error('Failed to fetch services');
  const data = await response.json();
  return data.map((s: any) => ({
    ...s,
    icon: getIconComponent(s.icon)
  }));
}

export async function fetchProjects(): Promise<Project[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/projects`);
  if (!response.ok) throw new Error('Failed to fetch projects');
  const data = await response.json();
  return data.map((p: any) => ({
    ...p,
    icon: getIconComponent(p.icon)
  }));
}

export async function fetchProject(id: number | string): Promise<Project> {
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${id}/detail`);
  if (!response.ok) throw new Error('Failed to fetch project details');
  const p = await response.json();
  return {
    ...p,
    icon: getIconComponent(p.icon)
  };
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/testimonials`);
  if (!response.ok) throw new Error('Failed to fetch testimonials');
  return response.json();
}

export async function fetchFAQs(): Promise<FAQItem[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/faqs`);
  if (!response.ok) throw new Error('Failed to fetch FAQs');
  return response.json();
}

export async function fetchBlogPosts(searchQuery: string = ''): Promise<BlogPost[]> {
  const url = searchQuery 
    ? `${API_BASE_URL}/api/blog/posts?search=${encodeURIComponent(searchQuery)}`
    : `${API_BASE_URL}/api/blog/posts`;
  const response = await apiFetch(url);
  if (!response.ok) throw new Error('Failed to fetch blog posts');
  return response.json();
}

export async function fetchContactInfo(): Promise<ContactInfo> {
  const response = await apiFetch(`${API_BASE_URL}/api/settings/contact`);
  if (!response.ok) throw new Error('Failed to fetch contact details');
  return response.json();
}

export async function fetchHeroInfo(): Promise<HeroInfo> {
  const response = await apiFetch(`${API_BASE_URL}/api/settings/hero`);
  if (!response.ok) throw new Error('Failed to fetch hero section details');
  return response.json();
}

export async function fetchAboutInfo(): Promise<AboutInfo> {
  const response = await apiFetch(`${API_BASE_URL}/api/settings/about`);
  if (!response.ok) throw new Error('Failed to fetch About page details');
  return response.json();
}

export async function updateAboutInfo(data: Partial<AboutInfo>): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/settings/about/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error('Failed to update About page settings');
  return response.json();
}

// Protected CRUD Methods for Dashboard

export async function createService(data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/services/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create service');
  }
  return response.json();
}

export async function updateService(id: string, data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update service');
  }
  return response.json();
}

export async function deleteService(id: string): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/services/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete service');
  }
  return response.json();
}

// Projects CRUD
export async function createProject(data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/projects/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create project');
  }
  return response.json();
}

export async function updateProject(id: number, data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update project');
  }
  return response.json();
}

export async function deleteProject(id: number): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/projects/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete project');
  }
  return response.json();
}

// Testimonials CRUD
export async function createTestimonial(data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/testimonials/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create testimonial');
  }
  return response.json();
}

export async function updateTestimonial(id: number, data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/testimonials/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update testimonial');
  }
  return response.json();
}

export async function deleteTestimonial(id: number): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/testimonials/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete testimonial');
  }
  return response.json();
}

// FAQs CRUD
export async function createFAQ(data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/faqs/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create FAQ');
  }
  return response.json();
}

export async function updateFAQ(id: number, data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update FAQ');
  }
  return response.json();
}

export async function deleteFAQ(id: number): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/faqs/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete FAQ');
  }
  return response.json();
}

// Blog Posts CRUD
export async function createBlogPost(data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/blog/posts/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to create blog post');
  }
  return response.json();
}

export async function updateBlogPost(id: number, data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/blog/posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update blog post');
  }
  return response.json();
}

export async function deleteBlogPost(id: number): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/blog/posts/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete blog post');
  }
  return response.json();
}

// Settings Update
export async function updateContactInfo(data: any): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/settings/contact/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update contact info');
  }
  return response.json();
}

export async function updateHeroInfo(data: HeroInfo): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/settings/hero/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to update hero info');
  }
  return response.json();
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  company: string;
  message: string;
  created_at: string;
  replied: boolean;
  reply_message: string;
  replied_at: string | null;
}

export async function createEnquiry(data: { name: string; email: string; company?: string; message: string }): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/enquiries/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to submit enquiry');
  }
  return response.json();
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  const response = await apiFetch(`${API_BASE_URL}/api/enquiries`);
  if (!response.ok) throw new Error('Failed to fetch enquiries');
  return response.json();
}

export async function deleteEnquiry(id: number): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/enquiries/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to delete enquiry');
  }
  return response.json();
}

export async function replyToEnquiry(id: number, replyMessage: string): Promise<any> {
  const response = await apiFetch(`${API_BASE_URL}/api/enquiries/${id}/reply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reply_message: replyMessage })
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to submit reply');
  }
  return response.json();
}
