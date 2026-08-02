
export type ViewState = 
  | 'home' 
  | 'pricing' 
  | 'crm-demo' 
  | 'refund-policy' 
  | 'contact'
  | 'services'
  | 'service-software'
  | 'service-crm'
  | 'service-mobile'
  | 'service-website'
  | 'service-social'
  | 'service-ads'
  | 'get-website-built'
  | 'get-software-built'
  | 'get-app-built'
  | 'get-social-media'
  | 'get-ads'
  | 'automation-video'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'blog'
  | 'blog-post'
  | 'start-project'
  | 'book-call'
  | 'work'
  | 'work-post'
  | 'about'
  | 'not-found';

export interface PlanFeature {
  text: string;
  highlight?: boolean;
  link?: {
    text: string;
    view: ViewState;
  };
}

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPriceDisplay?: string; // e.g. "1,000"
  yearlyTotalDisplay?: string; // e.g. "12,000"
  priceDisplay?: string; // e.g. "8,000" for one-time
  isOneTime?: boolean; // flag for one-time payment
  description?: string;
  subtitleTag?: string; // e.g. "Guaranteed Growth"
  features: PlanFeature[];
  isPopular?: boolean;
  buttonText: string;
}
