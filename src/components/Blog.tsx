import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { fetchBlogPosts, type BlogPost } from '../api';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchBlogPosts(searchQuery)
      .then(setPosts)
      .catch((err) => {
        console.error('Error fetching blog posts:', err);
        // Fallback to static dummy data if API fails
        const staticPosts = [
          {
            title: 'Compiling Rust to WebAssembly for Sub-Millisecond APIs',
            category: 'Engineering',
            date: 'June 18, 2026',
            readTime: '6 min read',
            summary: 'Learn the exact pipeline configuration we use to pre-compile and distribute rust-based WASM modules across edge clusters.',
            imageUrl: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&q=80&w=400&h=250'
          },
          {
            title: 'Architecting Polymorphic Databases: Relational vs Document',
            category: 'Data Science',
            date: 'May 24, 2026',
            readTime: '9 min read',
            summary: 'An in-depth review of transaction locking schemas when handling graph relationships and JSON structures concurrently.',
            imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400&h=250'
          },
          {
            title: 'How AI-Driven Network Routing Minimizes Power Costs',
            category: 'Research',
            date: 'April 10, 2026',
            readTime: '12 min read',
            summary: 'Exploring reinforcement learning dispatcher policies that redirect transactional traffic into renewable-powered servers.',
            imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=250'
          }
        ];
        setPosts(staticPosts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.summary.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      });
  }, [searchQuery]);

  const filteredPosts = posts;

  return (
    <section id="blog" className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 reveal">
          <div>
            <span className="text-sm font-bold text-secondary uppercase tracking-wider">Polynexus Journal</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 font-display">
              Latest Insights & Engineering Reports
            </h2>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
          {filteredPosts.map((post, idx) => (
            <article
              key={idx}
              className="group bg-slate-50/50 border border-slate-200/80 hover:border-secondary/35 hover:-translate-y-2 hover:shadow-xl hover:shadow-secondary/5 rounded-2xl overflow-hidden transition-all duration-300 ease-out flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative overflow-hidden h-48 bg-slate-100">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-slate-200 text-secondary text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {post.category}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[10px] text-slate-450 font-bold mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-secondary transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0 mt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-slate-800 transition-colors duration-200"
                >
                  Read Engineering Log
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 text-sm">No engineering reports found matching "{searchQuery}".</p>
          </div>
        )}

      </div>
    </section>
  );
}
