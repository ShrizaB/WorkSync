import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Zap, X, Calendar, CreditCard, User, Users, Grid, ShieldCheck, Sparkles, BarChart2, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

const DEMO_ACCOUNTS = [
  { label: 'Admin Demo', email: 'admin@worksync.com', password: 'admin123' },
  { label: 'Employee Demo', email: 'employee@worksync.com', password: 'emp123' },
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Controls if login form modal is visible

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/dashboard/admin' : '/dashboard/employee');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] relative overflow-x-hidden font-sans scroll-smooth">

      {/* Right Side Background Circle Glow */}
      <div className="absolute top-[-25%] right-[-20%] w-[1300px] h-[1300px] rounded-full bg-rose-500/10 blur-[100px] z-0 pointer-events-none" />
      {/* Right Side Background Solid Circle */}
      <div 
        className="absolute top-[-10%] right-[-25%] w-[1200px] h-[1200px] rounded-full bg-gradient-to-br from-[#ff2a5f] to-[#e60039] opacity-95 shadow-[0_0_80px_rgba(230,0,57,0.3)] z-0" 
      />

      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all duration-300">
        <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-16 py-4">
          {/* Left nav items */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 pr-6 border-r border-gray-200 h-8">
              <div className="w-9 h-9 rounded-full bg-[#e60039] flex items-center justify-center shadow-[0_2px_10px_rgba(230,0,57,0.3)]">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-slate-900 font-bold text-[22px] tracking-tight">WorkSync</span>
            </div>

            {/* Links */}
            <div className="hidden lg:flex items-center gap-8 text-[15px] font-bold text-slate-700">
              <div className="relative text-[#e60039] pb-1 cursor-pointer">
                Home
                <span className="absolute bottom-[-4px] left-0 w-full h-[2.5px] bg-[#e60039] rounded-full"></span>
              </div>
              <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
              <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
            </div>
          </div>

          {/* Right buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-slate-900 text-[14px] font-bold transition-colors shadow-sm"
            >
              Log In
            </button>
            <Link
              to="/register"
              className="px-6 py-2.5 rounded-full bg-[#e60039] hover:bg-[#d00030] text-white text-[14px] font-bold transition-colors shadow-md"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 pt-32 pb-4 h-full flex flex-col">



        {/* Main Content */}
        <div className="max-w-2xl flex flex-col justify-center mt-2">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full text-[#e60039] text-xs font-bold mb-6 self-start">
            <Sparkles size={14} />
            Smarter HR. Stronger Teams. Better Workdays.
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[68px] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-2">
            Simplify HR.<br />
            <span className="text-[#e60039]">Empower People.</span><br />
            Drive Performance.
          </h1>

          <div className="w-12 h-1 bg-[#e60039] rounded-full mt-5 mb-6" />

          {/* Subheadline */}
          <p className="text-slate-500 text-[17px] md:text-[18px] leading-relaxed max-w-[500px] mb-8 font-medium">
            WorkSync brings all your HR processes together in one place — from attendance and payroll to leaves and employee profiles. Less admin. More impact.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { icon: Calendar, text: 'Attendance Tracking' },
              { icon: CreditCard, text: 'Payroll Management' },
              { icon: User, text: 'Leave Approval' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-slate-900 text-[13px] font-bold">
                <f.icon size={16} className="text-[#e60039]" />
                {f.text}
              </div>
            ))}
          </div>




        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-24 pb-12 relative z-10">
        
        <div className="mb-16 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center bg-rose-50 px-3.5 py-1.5 rounded-full text-[#e60039] text-xs font-bold mb-6">
            Features
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-[52px] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-6">
            Powerful Features <br /> Built for <span className="text-[#e60039]">Modern HR</span> Teams
          </h2>

          {/* Subheadline */}
          <p className="text-slate-500 text-[18px] leading-relaxed max-w-[500px]">
            WorkSync brings together everything you need to manage your workforce efficiently and effectively.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Calendar, title: 'Attendance Tracking', desc: 'Track attendance in real-time. Monitor check-ins, late arrivals, and improve accountability.' },
            { icon: CreditCard, title: 'Payroll Management', desc: 'Automate salary calculations, deductions, and generate payslips in just a few clicks.' },
            { icon: Users, title: 'Leave Approval', desc: 'Simplify leave requests and approvals with custom policies and real-time updates.' },
            { icon: User, title: 'Employee Profiles', desc: 'Centralize employee information, documents, and job details in one secure place.' },
            { icon: BarChart2, title: 'Reports & Analytics', desc: 'Get actionable insights with powerful reports and dashboards to drive better decisions.' },
            { icon: ShieldCheck, title: 'Role & Access Control', desc: 'Manage roles, permissions, and ensure data security across your organization.' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-[24px] p-8 border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] transition-all">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mb-6">
                <f.icon size={26} className="text-[#e60039]" />
              </div>
              <h3 className="text-[20px] font-extrabold text-slate-900 mb-3">{f.title}</h3>
              <p className="text-slate-500 text-[14.5px] leading-relaxed mb-6 font-medium">{f.desc}</p>
              
            </div>
          ))}
        </div>

      </section>

      {/* About Section */}
      <section id="about" className="max-w-[1400px] mx-auto px-6 lg:px-16 pt-16 pb-24 relative z-10 border-t border-gray-100">
        
        {/* About Hero */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-14 mb-28 relative">
          
          {/* Left Text */}
          <div className="w-full lg:w-[40%] max-w-xl">
            <div className="inline-flex items-center bg-rose-50 px-3.5 py-1.5 rounded-full text-[#e60039] text-xs font-bold mb-6">
              About Us
            </div>
            
            <h2 className="text-4xl md:text-[52px] font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-6">
              Building Better Workplaces <br /> Through <span className="text-[#e60039]">Smart HR Solutions</span>
            </h2>

            <p className="text-slate-500 text-[18px] leading-relaxed mb-8 font-medium">
              WorkSync was created with a simple mission — to help organizations streamline their HR processes and empower their people to do their best work.
            </p>

            <button className="px-7 py-3.5 rounded-full bg-[#e60039] hover:bg-[#d00030] text-white text-[15px] font-bold flex items-center gap-2 shadow-md transition-colors">
              Get Started Free
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Right Features Block (Why us?) */}
          <div className="w-full lg:w-[60%] relative mt-12 lg:mt-0 lg:pl-4">
            {/* Background decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[560px] lg:h-[560px] rounded-full bg-rose-50/60 -z-10" />
            
            <div className="relative w-full h-full min-h-[580px] flex flex-col justify-center bg-white/60 backdrop-blur-md rounded-[40px] p-10 lg:p-12 border border-white shadow-[0_8px_40px_rgba(0,0,0,0.06)]">
              <h3 className="text-[28px] font-extrabold text-slate-900 mb-10 tracking-tight">Why us?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
                {[
                  { icon: Users, title: 'People First', desc: 'We build solutions that empower HR teams and employees alike.' },
                  { icon: Target, title: 'Purpose Driven', desc: 'Our goal is to simplify HR so you can focus on what truly matters.' },
                  { icon: ShieldCheck, title: 'Trusted & Secure', desc: 'We prioritize data security and compliance at every step.' },
                  { icon: TrendingUp, title: 'Better Every Day', desc: 'We listen, learn, and continuously improve our platform for you.' },
                ].map((feature, i) => (
                  <div key={i} className="flex flex-col items-start text-left">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center mb-4 text-[#e60039]">
                      <feature.icon size={22} strokeWidth={2.5} />
                    </div>
                    <h4 className="text-[16px] font-extrabold text-slate-900 mb-2">{feature.title}</h4>
                    <p className="text-slate-500 text-[13px] leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 lg:py-12 relative z-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e60039] flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="text-slate-900 font-bold text-[18px] tracking-tight">WorkSync</span>
          </div>
          <div className="flex items-center gap-6 text-[14.5px] font-bold text-slate-500">
            <a href="#" className="hover:text-[#e60039] transition-colors">Home</a>
            <a href="#features" className="hover:text-[#e60039] transition-colors">Features</a>
            <a href="#about" className="hover:text-[#e60039] transition-colors">About</a>
          </div>
          <p className="text-slate-400 text-[13px] font-medium">© 2026 WorkSync. All rights reserved.</p>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-[28px] w-full max-w-[420px] p-8 relative shadow-2xl animate-slideUp">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-bold text-slate-900 mb-1.5 mt-2">Welcome back</h2>
            <p className="text-slate-500 mb-8 text-[15px]">Sign in to your workspace</p>

            {/* Demo quick-fill */}
            <div className="mb-6 p-4 rounded-2xl bg-rose-50/50 border border-rose-100/50">
              <p className="text-[#e60039] text-xs font-bold mb-3 flex items-center gap-1.5">
                <Zap size={14} /> Quick Demo Access
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {DEMO_ACCOUNTS.map(acc => (
                  <button key={acc.label} type="button" onClick={() => { setValue('email', acc.email); setValue('password', acc.password); }}
                    className="py-2.5 px-3 rounded-xl bg-white border border-gray-200 text-slate-700 hover:text-slate-900 hover:border-[#e60039] shadow-sm text-xs font-bold transition-all text-center">
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
              {/* Email */}
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type="email" placeholder="you@worksync.com" {...register('email')}
                    className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 pl-11 text-[15px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all ${errors.email ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`} />
                </div>
                {errors.email && <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="pt-2">
                <label className="block text-[13px] font-bold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input type={showPw ? 'text' : 'password'} placeholder="••••••••" {...register('password')}
                    className={`w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 pl-11 pr-11 text-[15px] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all ${errors.password ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`} />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="mt-1.5 text-xs text-red-600 font-bold">{errors.password.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#e60039] hover:bg-[#d00030] text-white rounded-xl py-3.5 mt-6 font-bold text-[15px] flex items-center justify-center gap-2 transition-all shadow-md">
                {loading
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <><span>Sign In</span> <ArrowRight size={18} /></>
                }
              </button>
            </form>

            <p className="mt-8 text-center text-slate-500 text-[14px]">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#e60039] font-bold hover:text-[#d00030] transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
