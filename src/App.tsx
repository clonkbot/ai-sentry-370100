import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: number;
  title: string;
  author: string;
  subreddit: string;
  aiScore: number;
  status: 'pending' | 'flagged' | 'approved';
  indicators: string[];
  engagement: { upvotes: number; comments: number; ratio: number };
  excerpt: string;
  timestamp: string;
}

const mockPosts: Post[] = [
  {
    id: 1,
    title: "The Ultimate Guide to Understanding Machine Learning Fundamentals",
    author: "knowledge_seeker_2024",
    subreddit: "r/learnprogramming",
    aiScore: 94,
    status: 'flagged',
    indicators: ['Repetitive phrasing', 'Generic opener', 'Unnatural transitions'],
    engagement: { upvotes: 12, comments: 2, ratio: 0.67 },
    excerpt: "In today's rapidly evolving technological landscape, understanding machine learning has become increasingly important...",
    timestamp: "2 min ago"
  },
  {
    id: 2,
    title: "Why I finally switched to Arch Linux after 10 years",
    author: "linuxfan_mike",
    subreddit: "r/linux",
    aiScore: 18,
    status: 'approved',
    indicators: [],
    engagement: { upvotes: 847, comments: 234, ratio: 0.96 },
    excerpt: "So I've been putting this off forever but last week my Ubuntu install finally died and I said screw it...",
    timestamp: "4 min ago"
  },
  {
    id: 3,
    title: "Comprehensive Analysis: Top 10 Productivity Apps for Remote Workers",
    author: "productivity_hub",
    subreddit: "r/productivity",
    aiScore: 87,
    status: 'pending',
    indicators: ['List format abuse', 'SEO-style title', 'Shallow depth'],
    engagement: { upvotes: 45, comments: 8, ratio: 0.72 },
    excerpt: "In an era where remote work has become the norm, finding the right productivity tools is essential for success...",
    timestamp: "6 min ago"
  },
  {
    id: 4,
    title: "My cat discovered the roomba and now they're best friends",
    author: "catdad_supreme",
    subreddit: "r/cats",
    aiScore: 5,
    status: 'approved',
    indicators: [],
    engagement: { upvotes: 3420, comments: 189, ratio: 0.99 },
    excerpt: "I can't even make this up. He literally waits by the charging dock every morning...",
    timestamp: "8 min ago"
  },
  {
    id: 5,
    title: "The Definitive Guide to Personal Finance: Building Wealth Step by Step",
    author: "finance_wisdom_daily",
    subreddit: "r/personalfinance",
    aiScore: 91,
    status: 'flagged',
    indicators: ['Template structure', 'Keyword stuffing', 'No personal anecdotes'],
    engagement: { upvotes: 28, comments: 4, ratio: 0.68 },
    excerpt: "Welcome to this comprehensive guide on personal finance. In this article, we will explore the fundamental principles...",
    timestamp: "12 min ago"
  }
];

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none"
      initial={{ top: 0, opacity: 0 }}
      animate={{
        top: ['0%', '100%', '0%'],
        opacity: [0, 0.8, 0]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
}

function DetectionMeter({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' }) {
  const isAI = score >= 70;
  const isSuspect = score >= 40 && score < 70;
  const color = isAI ? '#ff3d5a' : isSuspect ? '#ffaa00' : '#00ff88';
  const sizeClasses = size === 'sm' ? 'w-10 h-10' : 'w-14 h-14';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`relative ${sizeClasses}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-white/10"
        />
        <motion.circle
          cx="18"
          cy="18"
          r="15"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={`${score * 0.94} 100`}
          initial={{ strokeDasharray: '0 100' }}
          animate={{ strokeDasharray: `${score * 0.94} 100` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      <div className={`absolute inset-0 flex items-center justify-center ${textSize} font-mono font-bold`} style={{ color }}>
        {score}
      </div>
    </div>
  );
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isAI = post.aiScore >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`relative group bg-gradient-to-br from-slate-900/80 to-slate-950/90 border rounded-lg overflow-hidden transition-all duration-300 ${
        isAI ? 'border-red-500/30 hover:border-red-500/60' : 'border-white/5 hover:border-cyan-500/30'
      }`}
    >
      {/* Scan effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Top status bar */}
      <div className={`h-0.5 w-full ${
        post.status === 'flagged' ? 'bg-gradient-to-r from-red-500 via-red-400 to-red-500' :
        post.status === 'approved' ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500' :
        'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500'
      }`} />

      <div className="p-4 md:p-5">
        <div className="flex gap-3 md:gap-4">
          {/* Detection meter */}
          <div className="flex-shrink-0 hidden sm:block">
            <DetectionMeter score={post.aiScore} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-cyan-400 text-xs font-mono">{post.subreddit}</span>
                  <span className="text-white/20">·</span>
                  <span className="text-white/30 text-xs font-mono">{post.timestamp}</span>

                  {/* Mobile score */}
                  <div className="sm:hidden ml-auto">
                    <DetectionMeter score={post.aiScore} size="sm" />
                  </div>
                </div>
                <h3 className="text-white/90 font-medium text-sm md:text-base leading-snug line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <span className="text-white/40 text-xs font-mono">u/{post.author}</span>
              </div>

              {/* Status badge - desktop */}
              <div className={`hidden sm:flex flex-shrink-0 px-2 py-1 rounded text-xs font-mono uppercase tracking-wider ${
                post.status === 'flagged' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                post.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {post.status}
              </div>
            </div>

            {/* Excerpt with "AI highlighting" */}
            <div className="relative mt-3 p-3 bg-black/30 rounded border border-white/5 font-mono text-xs text-white/50 leading-relaxed">
              <div className="absolute top-2 right-2 text-white/20 text-[10px]">EXCERPT</div>
              <span className={isAI ? 'relative' : ''}>
                {isAI ? (
                  <>
                    <span className="bg-red-500/20 border-b border-red-500/50">{post.excerpt.slice(0, 30)}</span>
                    {post.excerpt.slice(30)}
                  </>
                ) : post.excerpt}
              </span>
            </div>

            {/* Indicators */}
            {post.indicators.length > 0 && (
              <motion.div
                className="flex flex-wrap gap-1.5 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {post.indicators.map((indicator, i) => (
                  <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-red-500/10 text-red-400/80 rounded border border-red-500/20">
                    {indicator}
                  </span>
                ))}
              </motion.div>
            )}

            {/* Engagement stats */}
            <div className="flex items-center gap-4 mt-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span className="text-white/50">{post.engagement.upvotes.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                <span className="text-white/50">{post.engagement.comments}</span>
              </div>
              <div className={`ml-auto px-2 py-0.5 rounded text-[10px] ${
                post.engagement.ratio >= 0.9 ? 'bg-emerald-500/20 text-emerald-400' :
                post.engagement.ratio >= 0.7 ? 'bg-amber-500/20 text-amber-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {Math.round(post.engagement.ratio * 100)}% ratio
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
              <button className="flex-1 py-2 px-3 text-xs font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                APPROVE
              </button>
              <button className="flex-1 py-2 px-3 text-xs font-mono bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/20 hover:border-red-500/40 transition-all">
                REMOVE
              </button>
              <button className="py-2 px-3 text-xs font-mono bg-white/5 hover:bg-white/10 text-white/50 rounded border border-white/10 hover:border-white/20 transition-all">
                MORE
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, trend, color }: { label: string; value: string; trend?: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-white/5 rounded-lg p-4 overflow-hidden group hover:border-white/10 transition-colors"
    >
      <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: color }} />
      <div className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl md:text-3xl font-bold font-mono" style={{ color }}>{value}</div>
      {trend && <div className="text-white/30 text-xs font-mono mt-1">{trend}</div>}
    </motion.div>
  );
}

function App() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'flagged' | 'pending' | 'approved'>('all');
  const [isScanning, setIsScanning] = useState(true);

  const filteredPosts = mockPosts.filter(post =>
    activeFilter === 'all' || post.status === activeFilter
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsScanning(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-x-hidden">
      {/* Background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,240,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,240,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Radial glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative border-b border-white/5 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <div className="absolute inset-0 bg-cyan-500/20 rounded-lg rotate-45" />
                <div className="absolute inset-1 bg-slate-950 rounded-lg rotate-45 flex items-center justify-center">
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-cyan-400 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-tight">
                  <span className="text-cyan-400">AI</span>
                  <span className="text-white">Sentry</span>
                </h1>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest hidden sm:block">Content Detection System</div>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              {/* Status indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <motion.div
                  className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-emerald-400 text-xs font-mono">MONITORING</span>
              </div>

              {/* Settings button */}
              <button className="p-2 md:p-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <ScanLine />
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard label="Posts Scanned" value="2,847" trend="+124 today" color="#00f0ff" />
          <StatCard label="AI Detected" value="312" trend="11% of total" color="#ff3d5a" />
          <StatCard label="Pending Review" value="28" trend="3 urgent" color="#ffaa00" />
          <StatCard label="False Positives" value="2.1%" trend="-0.3% this week" color="#00ff88" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(['all', 'flagged', 'pending', 'approved'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 md:px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border transition-all ${
                activeFilter === filter
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {filter}
              {filter === 'flagged' && <span className="ml-1.5 text-red-400">2</span>}
              {filter === 'pending' && <span className="ml-1.5 text-amber-400">1</span>}
            </button>
          ))}

          <div className="flex-1" />

          <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full sm:w-64 px-4 py-2 pl-10 text-sm font-mono bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Posts list */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 text-sm font-mono bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 rounded-lg text-white/50 hover:text-cyan-400 transition-all group">
            <span className="flex items-center gap-2">
              LOAD MORE POSTS
              <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <p className="text-white/25 text-xs font-mono">
            Requested by @web-user · Built by @clonkbot
          </p>
        </div>
      </footer>

      {/* Initial scan overlay */}
      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-[#0a0a0f] z-[100] flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full mx-auto mb-4"
              />
              <div className="text-cyan-400 font-mono text-sm tracking-wider">INITIALIZING SCAN PROTOCOL</div>
              <motion.div
                className="mt-2 text-white/30 text-xs font-mono"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                CONNECTING TO DETECTION NETWORK...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
