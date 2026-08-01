
import React, { useState } from 'react';
import { 
  PRICING_PLANS, CRM_PLANS, SHOWCASE_PLANS, SOCIAL_PLANS_MONTHLY, 
  SOCIAL_PLANS_YEARLY, ADS_PLANS, ADS_FAQS, CRM_FAQS, 
  SHOWCASE_FAQS, SOCIAL_FAQS, ECOMMERCE_FAQS 
} from '../constants';
import { PricingCard } from './PricingCard';
import { FAQ, FAQItem } from './FAQ';
import { CheckIcon } from './CheckIcon';
import { ViewState } from '../types';
import { Loader2 } from 'lucide-react';

interface PricingSectionProps {
  onViewChange?: (view: ViewState) => void;
}

type MainTab = 'softwares' | 'websites' | 'social' | 'ads';
type WebSubTab = 'ecommerce' | 'showcase';
type SocialSubTab = 'monthly' | 'yearly';

export const PricingSection: React.FC<PricingSectionProps> = ({ onViewChange }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('softwares');
  const [webSubTab, setWebSubTab] = useState<WebSubTab>('ecommerce');
  const [socialSubTab, setSocialSubTab] = useState<SocialSubTab>('monthly');
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle Tab Switch Animation
  const handleTabChange = (tab: MainTab) => {
    if (tab === activeTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsAnimating(false);
    }, 200);
  };

  const handleWebSubTabChange = (tab: WebSubTab) => {
    if (tab === webSubTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setWebSubTab(tab);
      setIsAnimating(false);
    }, 200);
  };

  const handleSocialSubTabChange = (tab: SocialSubTab) => {
    if (tab === socialSubTab) return;
    setIsAnimating(true);
    setTimeout(() => {
      setSocialSubTab(tab);
      setIsAnimating(false);
    }, 200);
  };

  const renderContent = () => {
    if (isAnimating) return <div className="h-[500px]" />; // Spacer during transition

    // 1. SOFTWARES / CRM
    if (activeTab === 'softwares') {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {CRM_PLANS.map((plan) => (
            <div 
              key={plan.id}
              className={`
                relative flex flex-col p-8 md:p-10 rounded-3xl transition-all duration-300
                ${!plan.priceDisplay
                   ? 'bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.04]'
                   : 'bg-white dark:bg-white/5 border border-brand shadow-xl dark:shadow-[0_0_40px_-10px_rgba(106,13,173,0.3)] z-10'
                }
              `}
            >
              <div className="mb-8">
                <h3 className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 min-h-[40px]">
                  {plan.description}
                </p>
                
                <div className="flex items-baseline gap-1">
                  {plan.priceDisplay ? (
                    <>
                       <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">₹{plan.priceDisplay}</span>
                       {!plan.isOneTime && <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">/-</span>}
                    </>
                  ) : (
                    <span className="bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-gray-200 dark:border-white/10">
                       Contact Sales
                    </span>
                  )}
                </div>
                
                {plan.isOneTime && (
                   <p className="text-xs font-bold text-brand uppercase tracking-wider mt-2">One Time Cost • Lifetime Use</p>
                )}
              </div>

              {/* Features */}
              <div className="flex-1 mb-10">
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 group">
                      <div className={`mt-0.5 flex-shrink-0 ${feature.highlight ? 'text-brand' : 'text-gray-400'}`}>
                        <CheckIcon />
                      </div>
                      <span className={`text-sm leading-relaxed ${feature.highlight ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-auto">
                 <button
                    className={`
                      w-full py-4 px-6 rounded-xl text-sm font-bold tracking-wide transition-all duration-200
                      ${plan.priceDisplay
                        ? 'bg-brand hover:bg-brand-light text-white shadow-lg shadow-brand/25 hover:shadow-brand/40'
                        : 'bg-gray-100 dark:bg-white text-gray-900 dark:text-black hover:bg-gray-200'
                      }
                    `}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Demo Link for SME Plan */}
                  {plan.id === 'sme-crm' && (
                    <p className="text-center mt-4">
                       <button 
                          onClick={() => onViewChange && onViewChange('crm-demo')}
                          className="text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border-b border-transparent hover:border-gray-900 dark:hover:border-white pb-0.5"
                       >
                         Want to explore how the CRM works? <span className="text-brand">Click here</span> to view the live demo.
                       </button>
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // 2. WEBSITES
    if (activeTab === 'websites') {
      const plans = webSubTab === 'ecommerce' ? PRICING_PLANS : SHOWCASE_PLANS;
      return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} onViewChange={onViewChange} />
          ))}
        </div>
      );
    }

    // 3. SOCIAL MEDIA
    if (activeTab === 'social') {
      const plans = socialSubTab === 'monthly' ? SOCIAL_PLANS_MONTHLY : SOCIAL_PLANS_YEARLY;
      return (
         <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
               <PricingCard key={plan.id} plan={plan} onViewChange={onViewChange} />
            ))}
         </div>
      );
    }

    // 4. ADS (Meta & Google)
    if (activeTab === 'ads') {
      return (
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {ADS_PLANS.map((plan) => (
             <PricingCard key={plan.id} plan={plan} onViewChange={onViewChange} />
          ))}
        </div>
      );
    }

    return null;
  };

  // Determine which FAQs to show based on active tab
  const getCurrentFAQs = (): { items: FAQItem[], title?: string, subtitle?: string } => {
    if (activeTab === 'softwares') {
       return {
          items: CRM_FAQS,
          title: "CRM & Software Questions",
          subtitle: "Customization, delivery, and support."
       };
    }

    if (activeTab === 'websites') {
       if (webSubTab === 'showcase') {
          return {
             items: SHOWCASE_FAQS,
             title: "Showcase Website Questions",
             subtitle: "Design, hosting, and delivery."
          };
       }
       // Default to ecommerce if in websites tab and not showcase
       return {
          items: ECOMMERCE_FAQS,
          title: "Ecommerce Website Questions",
          subtitle: "Features, plans, and scaling."
       };
    }

    if (activeTab === 'social') {
       return {
          items: SOCIAL_FAQS,
          title: "Social Media Questions",
          subtitle: "Platforms, growth, and guarantees."
       };
    }

    if (activeTab === 'ads') {
      return {
        items: ADS_FAQS,
        title: "Ads & Performance Questions",
        subtitle: "Guarantees, timelines, and scaling."
      };
    }

    // Fallback empty
    return { items: [], title: "", subtitle: "" };
  };

  const faqData = getCurrentFAQs();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 animate-fade-in min-h-[100svh]">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-brand font-semibold tracking-wider uppercase text-sm mb-4">
            Transparent Pricing
          </h2>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
            Ready to launch your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-600 dark:from-brand-light dark:to-white">Empire?</span>
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
            Choose the perfect plan for your business. Scalable solutions, no hidden fees.
          </p>
        </div>

        {/* MAIN TABS */}
        <div className="flex justify-center mb-10">
           <div className="inline-flex items-center p-1.5 bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 rounded-2xl overflow-x-auto max-w-full hide-scrollbar scroll-fade-right">
              {[
                { id: 'softwares', label: 'Softwares / CRMs' },
                { id: 'websites', label: 'Websites' },
                { id: 'social', label: 'Social Media' },
                { id: 'ads', label: 'Ads (Meta & Google)' }
              ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as MainTab)}
                    className={`
                       px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 whitespace-nowrap
                       ${activeTab === tab.id 
                          ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm dark:shadow-black/20' 
                          : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-white/[0.02]'
                       }
                    `}
                 >
                    {tab.label}
                 </button>
              ))}
           </div>
        </div>

        {/* SUB TABS: WEBSITES */}
        {activeTab === 'websites' && (
           <div className="flex justify-center mb-12 animate-slide-up">
              <div className="inline-flex flex-wrap justify-center items-center gap-6 border-b border-gray-200 dark:border-white/5 max-w-full px-4 sm:px-8">
                 <button 
                    onClick={() => handleWebSubTabChange('ecommerce')}
                    className={`pb-4 text-sm font-medium transition-colors relative ${webSubTab === 'ecommerce' ? 'text-brand' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                 >
                    Ecommerce Websites
                    {webSubTab === 'ecommerce' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand shadow-[0_0_10px_rgba(164,82,255,0.5)]" />}
                 </button>
                 <button 
                    onClick={() => handleWebSubTabChange('showcase')}
                    className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${webSubTab === 'showcase' ? 'text-brand' : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'}`}
                 >
                    Showcase Websites
                    {webSubTab === 'showcase' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand shadow-[0_0_10px_rgba(164,82,255,0.5)]" />}
                 </button>
              </div>
           </div>
        )}

        {/* SUB TABS: SOCIAL MEDIA */}
        {activeTab === 'social' && (
           <div className="flex justify-center mb-12 animate-slide-up">
              <div className="inline-flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
                 <button 
                    onClick={() => handleSocialSubTabChange('monthly')}
                    className={`
                      px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300
                      ${socialSubTab === 'monthly' ? 'bg-brand text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}
                    `}
                 >
                    Monthly Plans
                 </button>
                 <button 
                    onClick={() => handleSocialSubTabChange('yearly')}
                    className={`
                      px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative
                      ${socialSubTab === 'yearly' ? 'bg-brand text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}
                    `}
                 >
                    Yearly Plans
                    {/* Badge */}
                    <div className="absolute -top-3 -right-3 bg-white text-brand text-[10px] font-bold px-1.5 py-0.5 rounded border border-brand/20 shadow-sm animate-pulse-slow">
                       25% OFF
                    </div>
                 </button>
              </div>
           </div>
        )}

        {/* CONTENT AREA */}
        <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
           {renderContent()}
        </div>

        {/* FAQ Section */}
        {faqData.items.length > 0 && (
          <FAQ 
            items={faqData.items} 
            title={faqData.title} 
            subtitle={faqData.subtitle}
          />
        )}

      </div>
  );
};
