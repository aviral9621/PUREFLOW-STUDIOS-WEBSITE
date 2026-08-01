
import React, { useState, useEffect } from 'react';
import { ViewState } from '../types';
import { CheckCircle, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import { LeadFormBreadcrumb } from './shared/LeadFormBreadcrumb';
import { supabase } from '../lib/supabase';

interface Props {
  onViewChange: (view: ViewState) => void;
  onBack?: () => void;
  breadcrumbLabel?: string;
  onServicesClick?: () => void;
}

const APP_TYPES = [
  "Business App",
  "Ecommerce App",
  "Service Booking App",
  "Social App / Community App",
  "Dashboard App / Admin Panel",
  "Automation-based App",
  "Custom App Idea",
  "Not sure yet"
];

const PLATFORM_OPTIONS = [
  "Android",
  "iOS",
  "Both",
  "Not sure"
];

const GOAL_OPTIONS = [
  "Increase sales",
  "Automate processes",
  "Manage customers",
  "Improve service experience",
  "Launch a new product idea",
  "Other"
];

const TIMELINE_OPTIONS = [
  "Immediately",
  "This Week",
  "This Month",
  "Just Exploring"
];

const BUDGET_OPTIONS = [
  "₹30,000 – ₹50,000",
  "₹50,000 – ₹80,000",
  "₹80,000 – ₹1,20,000",
  "₹1,20,000 – ₹2,00,000",
  "₹2,00,000+"
];

export const GetAppBuiltPage: React.FC<Props> = ({ onViewChange, onBack, breadcrumbLabel = 'Mobile apps designed for real', onServicesClick }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    hasApp: '', // 'yes' | 'no'
    appLink: '',
    appTypes: [] as string[],
    platform: '',
    mainGoal: '',
    timeline: '',
    budget: '',
    notes: ''
  });

  // UI State for custom dropdowns
  const [goalOpen, setGoalOpen] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckboxChange = (option: string) => {
    setFormData(prev => {
      const current = prev.appTypes;
      if (current.includes(option)) {
        return { ...prev, appTypes: current.filter(i => i !== option) };
      } else {
        return { ...prev, appTypes: [...current, option] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    // Map frontend state to Supabase columns matching 'app_leads' table
    const payload = {
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      state: formData.state,
      
      has_app: formData.hasApp === 'yes', // Convert to boolean
      app_link: formData.appLink,
      app_type: formData.appTypes,        // Array of strings
      platform: formData.platform,
      main_goal: formData.mainGoal,
      
      start_time: formData.timeline,
      budget_range: formData.budget,
      
      notes: formData.notes
    };

    try {
      const { error } = await supabase
        .from('app_leads')
        .insert([payload]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Supabase insert error:", err);
      setErrorMessage("Unable to submit request. Please verify your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] w-full bg-[#000000] text-white relative overflow-x-hidden font-sans selection:bg-[#8A2BE2] selection:text-white pb-20">
      
      {/* Background Ambience - Radial Vignette */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(80,0,90,0.12) 0%, rgba(0,0,0,0.9) 40%, #000000 100%)'
        }}
      />
      
      {/* Soft Purple Atmospheric Light behind Form */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#8A2BE2] opacity-[0.08] blur-[150px] rounded-full pointer-events-none z-0" />

      <LeadFormBreadcrumb
        label={breadcrumbLabel}
        onBack={onBack ?? (() => onViewChange('home'))}
        onHome={() => onViewChange('home')}
        onServices={onServicesClick ?? (() => onViewChange('services'))}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 flex flex-col items-center">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16 px-4">
          <h1 className="text-[26px] md:text-[42px] lg:text-[48px] font-extrabold leading-[1.15] tracking-tight mb-4 md:mb-6 drop-shadow-2xl">
            So you’re planning an <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8A2BE2] via-[#C82DFF] to-[#FF2DAA]" style={{ textShadow: '0 0 30px rgba(138, 43, 226, 0.4)' }}>app?</span><br className="hidden md:block"/> Let’s make it real.
          </h1>
          <p className="text-[14px] md:text-[18px] text-[#f4eadc] font-normal max-w-2xl mx-auto leading-relaxed">
            Fill this quick form so we understand your app idea. It only takes 30 seconds.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div className="w-full max-w-[780px] relative">
          
          {/* Form Card */}
          <div 
            className="
              app-lead-form-card
              relative w-full rounded-[16px] 
              bg-[rgba(18,16,20,0.92)] 
              border border-white/5 
              backdrop-blur-sm
              shadow-[0px_30px_60px_rgba(0,0,0,0.55),inset_0_0_30px_rgba(138,43,226,0.05)]
              p-[26px] md:p-[48px]
              overflow-hidden
              transition-all duration-500
              animate-slide-up
            "
          >
            {isSubmitted ? (
               // SUCCESS STATE
               <div className="min-h-[400px] flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out_forwards]">
                  <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.15)]">
                     <CheckCircle className="w-12 h-12 text-green-500" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-3">Thank you!</h2>
                  <p className="text-gray-400 text-lg">We’ll reach out to you shortly.</p>
                  <button 
                    onClick={onBack ?? (() => onViewChange('home'))}
                    className="mt-10 px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-colors border border-white/5"
                  >
                    Back
                  </button>
               </div>
            ) : (
              // ACTUAL FORM
              <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
                
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                {/* SECTION A: CONTACT */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-[#8A2BE2] uppercase tracking-widest mb-4">01. Basic Contact</h3>
                  
                  <div className="space-y-5 md:space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                       <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">Full Name*</label>
                       <input 
                         required
                         type="text"
                         placeholder="Enter your full name"
                         className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-white placeholder:text-gray-600 focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/50 outline-none transition-all"
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         disabled={isSubmitting}
                       />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                       <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">Email Address*</label>
                       <input 
                         required
                         type="email"
                         placeholder="your@email.com"
                         className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-white placeholder:text-gray-600 focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/50 outline-none transition-all"
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                         disabled={isSubmitting}
                       />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                       <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">Phone Number*</label>
                       <input 
                         required
                         type="tel"
                         placeholder="+91 ___"
                         className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-white placeholder:text-gray-600 focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/50 outline-none transition-all"
                         value={formData.phone}
                         onChange={e => setFormData({...formData, phone: e.target.value})}
                         disabled={isSubmitting}
                       />
                    </div>

                    {/* Location Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                       <div className="space-y-2">
                          <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">Country*</label>
                          <input 
                            required
                            type="text"
                            placeholder="Country"
                            className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-white placeholder:text-gray-600 focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/50 outline-none transition-all"
                            value={formData.country}
                            onChange={e => setFormData({...formData, country: e.target.value})}
                            disabled={isSubmitting}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">State / Region*</label>
                          <input 
                            required
                            type="text"
                            placeholder="State / Region"
                            className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-white placeholder:text-gray-600 focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/50 outline-none transition-all"
                            value={formData.state}
                            onChange={e => setFormData({...formData, state: e.target.value})}
                            disabled={isSubmitting}
                          />
                       </div>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* SECTION B: APP REQUIREMENT */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-[#8A2BE2] uppercase tracking-widest mb-4">02. App Requirement</h3>
                  
                  {/* Have App? */}
                  <div className="space-y-3">
                     <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">Do you already have an app?*</label>
                     <div className="flex flex-col md:flex-row gap-4">
                        {['Yes', 'No'].map(opt => (
                           <label key={opt} className="flex-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name="hasApp" 
                                className="peer sr-only" 
                                value={opt.toLowerCase()}
                                onChange={e => setFormData({...formData, hasApp: e.target.value})}
                                required 
                                disabled={isSubmitting}
                              />
                              <div className="
                                w-full h-[44px] md:h-[50px] flex items-center justify-center rounded-xl bg-[#0C0C0E] border border-white/10 text-gray-400
                                peer-checked:bg-[#8A2BE2]/10 peer-checked:border-[#8A2BE2] peer-checked:text-[#C82DFF]
                                transition-all
                              ">
                                 {opt}
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* App Link (Conditional) */}
                  {formData.hasApp === 'yes' && (
                    <div className="space-y-2 animate-[fadeIn_0.3s_ease-out]">
                       <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">If yes, app store link (optional)</label>
                       <input 
                         type="text"
                         placeholder="https://..."
                         className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-white placeholder:text-gray-600 focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/50 outline-none transition-all"
                         value={formData.appLink}
                         onChange={e => setFormData({...formData, appLink: e.target.value})}
                         disabled={isSubmitting}
                       />
                    </div>
                  )}

                  {/* App Type */}
                  <div className="space-y-3">
                     <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">What type of app do you want to build?*</label>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {APP_TYPES.map(opt => (
                           <label key={opt} className="cursor-pointer group">
                              <input 
                                type="checkbox" 
                                className="peer sr-only"
                                onChange={() => handleCheckboxChange(opt)}
                                checked={formData.appTypes.includes(opt)}
                                disabled={isSubmitting}
                              />
                              <div className="
                                w-full p-3 md:p-4 rounded-xl bg-[#0C0C0E] border border-white/10 text-gray-400 text-sm flex items-center gap-3
                                peer-checked:bg-[#8A2BE2]/10 peer-checked:border-[#8A2BE2] peer-checked:text-white
                                hover:border-white/20 transition-all
                              ">
                                 <div className="w-5 h-5 rounded border border-white/20 flex items-center justify-center peer-checked:bg-[#8A2BE2] peer-checked:border-[#8A2BE2] shrink-0">
                                    {formData.appTypes.includes(opt) && <Check className="w-3.5 h-3.5 text-white" />}
                                 </div>
                                 {opt}
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Platform */}
                  <div className="space-y-3">
                     <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">Your platform preference*</label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {PLATFORM_OPTIONS.map(opt => (
                           <label key={opt} className="cursor-pointer">
                              <input 
                                type="radio" 
                                name="platform" 
                                className="peer sr-only" 
                                value={opt}
                                onChange={e => setFormData({...formData, platform: e.target.value})}
                                required 
                                disabled={isSubmitting}
                              />
                              <div className="
                                w-full h-[44px] md:h-[50px] flex items-center justify-center rounded-xl bg-[#0C0C0E] border border-white/10 text-gray-400 text-sm
                                peer-checked:bg-[#8A2BE2]/10 peer-checked:border-[#8A2BE2] peer-checked:text-[#C82DFF]
                                transition-all
                              ">
                                 {opt}
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Main Goal */}
                  <div className="space-y-3 relative">
                     <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">What’s the main goal of the app?*</label>
                     <div className="relative">
                        <button 
                           type="button"
                           onClick={() => setGoalOpen(!goalOpen)}
                           disabled={isSubmitting}
                           className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-left flex items-center justify-between text-white focus:border-[#8A2BE2] transition-colors"
                        >
                           <span className={formData.mainGoal ? "text-white" : "text-gray-500"}>
                             {formData.mainGoal || "Select a goal"}
                           </span>
                           <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${goalOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {goalOpen && (
                           <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1E] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                              {GOAL_OPTIONS.map(opt => (
                                 <div 
                                   key={opt}
                                   onClick={() => {
                                      setFormData({...formData, mainGoal: opt});
                                      setGoalOpen(false);
                                   }}
                                   className="px-4 py-3 text-sm text-gray-300 hover:bg-[#8A2BE2] hover:text-white cursor-pointer transition-colors"
                                 >
                                    {opt}
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* SECTION C: SERIOUSNESS */}
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-[#8A2BE2] uppercase tracking-widest mb-4">03. Seriousness Filters</h3>
                  
                  {/* Start Date */}
                  <div className="space-y-3">
                     <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">When do you want to start?*</label>
                     <div className="flex flex-col md:flex-row gap-3">
                        {TIMELINE_OPTIONS.map(opt => (
                           <label key={opt} className="flex-1 cursor-pointer">
                              <input 
                                type="radio" 
                                name="timeline" 
                                className="peer sr-only" 
                                value={opt}
                                onChange={e => setFormData({...formData, timeline: e.target.value})}
                                required 
                                disabled={isSubmitting}
                              />
                              <div className="
                                w-full py-3 px-2 text-center text-sm rounded-xl bg-[#0C0C0E] border border-white/10 text-gray-400
                                peer-checked:bg-[#8A2BE2]/10 peer-checked:border-[#8A2BE2] peer-checked:text-[#C82DFF]
                                transition-all
                              ">
                                 {opt}
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Budget */}
                  <div className="space-y-3 relative">
                     <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">What budget range are you comfortable with?*</label>
                     <div className="relative">
                        <button 
                           type="button"
                           onClick={() => setBudgetOpen(!budgetOpen)}
                           disabled={isSubmitting}
                           className="w-full h-[44px] md:h-[50px] bg-[#0C0C0E] border border-white/10 rounded-xl px-4 text-left flex items-center justify-between text-white focus:border-[#8A2BE2] transition-colors"
                        >
                           <span className={formData.budget ? "text-white" : "text-gray-500"}>
                             {formData.budget || "Select budget range"}
                           </span>
                           <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${budgetOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {budgetOpen && (
                           <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1E] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden">
                              {BUDGET_OPTIONS.map(opt => (
                                 <div 
                                   key={opt}
                                   onClick={() => {
                                      setFormData({...formData, budget: opt});
                                      setBudgetOpen(false);
                                   }}
                                   className="px-4 py-3 text-sm text-gray-300 hover:bg-[#8A2BE2] hover:text-white cursor-pointer transition-colors"
                                 >
                                    {opt}
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  </div>
                </div>

                {/* SECTION D: NOTES */}
                <div className="space-y-3">
                   <label className="block text-[13px] md:text-[14px] text-gray-400 font-medium ml-1">Any short notes or app idea?</label>
                   <textarea 
                     rows={3}
                     placeholder="Optional"
                     className="w-full bg-[#0C0C0E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:border-[#8A2BE2]/50 focus:ring-1 focus:ring-[#8A2BE2]/50 outline-none transition-all resize-none"
                     value={formData.notes}
                     onChange={e => setFormData({...formData, notes: e.target.value})}
                     disabled={isSubmitting}
                   />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="
                      w-full h-[52px] md:h-[60px] rounded-[12px] 
                      bg-gradient-to-r from-[#8A2BE2] to-[#C82DFF] 
                      text-white font-semibold text-[16px] tracking-wide
                      shadow-[0_10px_30px_rgba(138,43,226,0.3)]
                      hover:shadow-[0_15px_40px_rgba(138,43,226,0.5)]
                      hover:scale-[1.01]
                      active:scale-[0.99]
                      disabled:opacity-70 disabled:cursor-not-allowed
                      transition-all duration-300
                      flex items-center justify-center gap-2
                    "
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit & Continue"
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
