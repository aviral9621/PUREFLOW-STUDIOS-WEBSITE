
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Navbar } from './components/shared/Navbar';
import { Hero } from './components/sections/Hero';
import { ViewState } from './types';
import { ThemeProvider } from './components/ThemeContext';
import { useDocumentMeta } from './lib/seo';
import { getCaseStudyBySlug } from './lib/caseStudies';
import { pathToState, viewToPath } from './lib/router';

const Footer = lazy(() =>
  import('./components/Footer').then((module) => ({ default: module.Footer }))
);
const TrustStrip = lazy(() =>
  import('./components/sections/TrustStrip').then((module) => ({ default: module.TrustStrip }))
);
const Services = lazy(() =>
  import('./components/sections/Services').then((module) => ({ default: module.Services }))
);
const Work = lazy(() =>
  import('./components/sections/Work').then((module) => ({ default: module.Work }))
);
const Process = lazy(() =>
  import('./components/sections/Process').then((module) => ({ default: module.Process }))
);
const About = lazy(() =>
  import('./components/sections/About').then((module) => ({ default: module.About }))
);
const GoodStuff = lazy(() =>
  import('./components/sections/GoodStuff').then((module) => ({ default: module.GoodStuff }))
);
const FinalCTA = lazy(() =>
  import('./components/sections/FinalCTA').then((module) => ({ default: module.FinalCTA }))
);
const ContactFormPopup = lazy(() =>
  import('./components/ContactFormPopup').then((module) => ({ default: module.ContactFormPopup }))
);
const VideoReviews = lazy(() =>
  import('./components/VideoReviews').then((module) => ({ default: module.VideoReviews }))
);
const GoogleReviews = lazy(() =>
  import('./components/GoogleReviews').then((module) => ({ default: module.GoogleReviews }))
);
const LocationMap = lazy(() =>
  import('./components/LocationMap').then((module) => ({ default: module.LocationMap }))
);
const PricingSection = lazy(() =>
  import('./components/PricingSection').then((module) => ({ default: module.PricingSection }))
);
const CrmDemoPage = lazy(() =>
  import('./components/CrmDemoPage').then((module) => ({ default: module.CrmDemoPage }))
);
const RefundPolicyPage = lazy(() =>
  import('./components/RefundPolicyPage').then((module) => ({ default: module.RefundPolicyPage }))
);
const ContactPage = lazy(() =>
  import('./components/ContactPage').then((module) => ({ default: module.ContactPage }))
);
const ServiceDetailPage = lazy(() =>
  import('./components/ServiceDetailPage').then((module) => ({ default: module.ServiceDetailPage }))
);
// NOTE: `SoftwareCrmPage` was lazily declared here but never rendered anywhere in
// the tree. Rollup still saw the live import() and emitted its chunk — ~24KB gz of
// gsap — which was deployed but unreachable. Removed; `gsap` is now unused.
const NotFoundPage = lazy(() =>
  import('./components/NotFoundPage').then((module) => ({ default: module.NotFoundPage }))
);
const GetWebsiteBuiltPage = lazy(() =>
  import('./components/GetWebsiteBuiltPage').then((module) => ({ default: module.GetWebsiteBuiltPage }))
);
const GetSoftwareBuiltPage = lazy(() =>
  import('./components/GetSoftwareBuiltPage').then((module) => ({ default: module.GetSoftwareBuiltPage }))
);
const GetAppBuiltPage = lazy(() =>
  import('./components/GetAppBuiltPage').then((module) => ({ default: module.GetAppBuiltPage }))
);
const GetSocialMediaPage = lazy(() =>
  import('./components/GetSocialMediaPage').then((module) => ({ default: module.GetSocialMediaPage }))
);
const GetAdsPage = lazy(() =>
  import('./components/GetAdsPage').then((module) => ({ default: module.GetAdsPage }))
);
const AutomationPage = lazy(() =>
  import('./components/AutomationPage').then((module) => ({ default: module.AutomationPage }))
);
const LegalPage = lazy(() =>
  import('./components/LegalPage').then((module) => ({ default: module.LegalPage }))
);
const BlogIndexPage = lazy(() =>
  import('./components/BlogIndexPage').then((module) => ({ default: module.BlogIndexPage }))
);
const BlogPostPage = lazy(() =>
  import('./components/BlogPostPage').then((module) => ({ default: module.BlogPostPage }))
);
const StartProjectPage = lazy(() =>
  import('./components/StartProjectPage').then((module) => ({ default: module.StartProjectPage }))
);
const BookCallPage = lazy(() =>
  import('./components/BookCallPage').then((module) => ({ default: module.BookCallPage }))
);
const WorkIndexPage = lazy(() =>
  import('./components/WorkIndexPage').then((module) => ({ default: module.WorkIndexPage }))
);
const WorkPostPage = lazy(() =>
  import('./components/WorkPostPage').then((module) => ({ default: module.WorkPostPage }))
);
const CaseStudyPage = lazy(() =>
  import('./components/casestudy/CaseStudyPage').then((module) => ({ default: module.CaseStudyPage }))
);
const AboutPage = lazy(() =>
  import('./components/AboutPage').then((module) => ({ default: module.AboutPage }))
);

const PageFallback = () => (
  <div className="min-h-screen bg-black" aria-label="Loading page" />
);

const SectionFallback = () => (
  <div className="min-h-[220px] bg-black" aria-hidden="true" />
);

type LeadFormView =
  | 'get-website-built'
  | 'get-software-built'
  | 'get-app-built'
  | 'get-social-media'
  | 'get-ads';

function LazySection({ children }: { children: React.ReactNode }) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldRender) return;

    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldRender]);

  return (
    <div ref={ref}>
      {shouldRender ? (
        <Suspense fallback={<SectionFallback />}>{children}</Suspense>
      ) : (
        <SectionFallback />
      )}
    </div>
  );
}

const AppContent: React.FC = () => {
  const initialRoute = React.useMemo(
    () =>
      typeof window !== 'undefined'
        ? pathToState(window.location.pathname)
        : { view: 'home' as ViewState, slug: null },
    []
  );
  const [currentView, setCurrentView] = useState<ViewState>(initialRoute.view);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(
    initialRoute.view === 'blog-post' ? initialRoute.slug : null
  );
  const isPoppingRef = React.useRef(false);
  const viewHistoryRef = React.useRef<ViewState[]>([]);
  const shouldScrollToServicesRef = React.useRef(false);

  const handleOpenBlogPost = (slug: string) => {
    setSelectedBlogSlug(slug);
    if (currentView !== 'blog-post') {
      viewHistoryRef.current = [...viewHistoryRef.current, currentView];
      setCurrentView('blog-post');
    }
  };

  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(
    initialRoute.view === 'work-post' ? initialRoute.slug : null
  );

  // Per-page SEO meta (title/description/canonical/OG/JSON-LD), slug-aware.
  useDocumentMeta(
    currentView,
    currentView === 'work-post'
      ? selectedProjectSlug
      : currentView === 'blog-post'
        ? selectedBlogSlug
        : null
  );

  const handleOpenProject = (slug: string) => {
    setSelectedProjectSlug(slug);
    if (currentView !== 'work-post') {
      viewHistoryRef.current = [...viewHistoryRef.current, currentView];
      setCurrentView('work-post');
    }
  };
  
  // Contact Form State
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [contactTitle, setContactTitle] = useState("Book Demo");
  const [contactOrigin, setContactOrigin] = useState<DOMRect | null>(null);

  // Scroll to top on view change
  useEffect(() => {
    if (currentView === 'home' && shouldScrollToServicesRef.current) {
      shouldScrollToServicesRef.current = false;
      window.setTimeout(() => {
        document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  // NOTE: a previous "pin to hero on first load" workaround lived here. It polled
  // scroll position on a 150ms interval for 4.5s to undo a scroll jump caused by a
  // live-preview iframe in the Work section autofocusing an input once it loaded.
  // That iframe is gone (the Work section no longer embeds live sites), so the
  // workaround — which also fought the visitor's own scrolling and kept a timer
  // running through the whole page load — has been removed. `history.scrollRestoration`
  // is set to 'manual' in index.tsx, which is what actually keeps loads at the top.

  // Keep the URL in sync with the current view/slug (History API). Skips the
  // push when the change originated from a browser back/forward (popstate).
  useEffect(() => {
    if (isPoppingRef.current) {
      isPoppingRef.current = false;
      return;
    }
    // The 404 view has no canonical URL of its own — it is whatever unknown path
    // the visitor typed. Pushing here would rewrite that to /404 and lose it.
    if (currentView === 'not-found') return;
    const slug =
      currentView === 'work-post'
        ? selectedProjectSlug
        : currentView === 'blog-post'
          ? selectedBlogSlug
          : null;
    const path = viewToPath(currentView, slug);
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [currentView, selectedProjectSlug, selectedBlogSlug]);

  // Browser back/forward → derive the view/slug from the URL.
  useEffect(() => {
    const onPop = () => {
      const s = pathToState(window.location.pathname);
      isPoppingRef.current = true;
      setSelectedProjectSlug(s.view === 'work-post' ? s.slug : null);
      setSelectedBlogSlug(s.view === 'blog-post' ? s.slug : null);
      setCurrentView(s.view);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigateTo = (view: ViewState) => {
    if (view === currentView) return;

    viewHistoryRef.current = [...viewHistoryRef.current, currentView];
    setCurrentView(view);
  };

  const navigateBack = (fallback: ViewState = 'home') => {
    const previousView = viewHistoryRef.current.pop() ?? fallback;
    setCurrentView(previousView);
  };

  const navigateToServicesSection = () => {
    shouldScrollToServicesRef.current = true;
    if (currentView === 'home') {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      shouldScrollToServicesRef.current = false;
      return;
    }

    navigateTo('home');
  };

  const handleOpenContact = (title: string, rect: DOMRect) => {
    setContactTitle(title);
    setContactOrigin(rect);
    setIsContactOpen(true);
  };

  // Pre-fill the Start-a-Project flow's first step ("What we wire up?") when the
  // user lands there from a service page. Consumed once by StartProjectPage on
  // mount, then cleared.
  const [prefillService, setPrefillService] = useState<string | null>(null);

  const handleStartProject = () => {
    setPrefillService(null);
    navigateTo('start-project');
  };

  const handleStartProjectWithService = (service: string) => {
    setPrefillService(service);
    navigateTo('start-project');
  };

  const handleBookCall = () => {
    navigateTo('book-call');
  };

  // Form views render a distraction-free shell: minimal navbar (logo only) and
  // no footer. Keeps the user focused on completing the intake / booking.
  const isFormView = currentView === 'start-project' || currentView === 'book-call';

  // Footer is also hidden on the deep "detail" pages that have their own bottom
  // CTA (service detail, work post, blog post) — avoids a redundant second
  // footer-style block right after the page's own CTA card.
  const hideFooter =
    isFormView ||
    currentView === 'service-software' ||
    currentView === 'service-crm' ||
    currentView === 'service-mobile' ||
    currentView === 'service-website' ||
    currentView === 'service-social' ||
    currentView === 'service-ads' ||
    currentView === 'work-post' ||
    currentView === 'blog-post';

  const renderLeadFormPage = (view: LeadFormView) => {
    const pages = {
      'get-website-built': (
        <GetWebsiteBuiltPage
          onViewChange={navigateTo}
          onBack={() => navigateBack('service-website')}
          breadcrumbLabel="Websites built to convert"
          onServicesClick={navigateToServicesSection}
        />
      ),
      'get-software-built': (
        <GetSoftwareBuiltPage
          onViewChange={navigateTo}
          onBack={() => navigateBack('service-software')}
          breadcrumbLabel="CRMs and dashboards"
          onServicesClick={navigateToServicesSection}
        />
      ),
      'get-app-built': (
        <GetAppBuiltPage
          onViewChange={navigateTo}
          onBack={() => navigateBack('service-mobile')}
          breadcrumbLabel="Mobile apps designed for real"
          onServicesClick={navigateToServicesSection}
        />
      ),
      'get-social-media': (
        <GetSocialMediaPage
          onViewChange={navigateTo}
          onBack={() => navigateBack('service-social')}
          breadcrumbLabel="Social media systems"
          onServicesClick={navigateToServicesSection}
        />
      ),
      'get-ads': (
        <GetAdsPage
          onViewChange={navigateTo}
          onBack={() => navigateBack('service-ads')}
          breadcrumbLabel="Ads management focused on"
          onServicesClick={navigateToServicesSection}
        />
      ),
    };

    return (
      <main className="min-h-screen w-full relative bg-black text-white selection:bg-brand selection:text-white">
        <Navbar 
          currentView={currentView} 
          onViewChange={navigateTo}
          onOpenContact={handleOpenContact}
        />

        {isContactOpen && (
          <Suspense fallback={null}>
            <ContactFormPopup 
              isOpen={isContactOpen}
              onClose={() => setIsContactOpen(false)}
              title={contactTitle}
              originRect={contactOrigin}
            />
          </Suspense>
        )}

        <Suspense fallback={<PageFallback />}>
          {pages[view]}
        </Suspense>
      </main>
    );
  };

  if (
    currentView === 'get-website-built' ||
    currentView === 'get-software-built' ||
    currentView === 'get-app-built' ||
    currentView === 'get-social-media' ||
    currentView === 'get-ads'
  ) {
    return renderLeadFormPage(currentView);
  }

  if (currentView === 'automation-video') {
    return (
      <Suspense fallback={<PageFallback />}>
        <AutomationPage onViewChange={navigateTo} />
      </Suspense>
    );
  }

  // Returned before the shared shell below so the 404 carries no navbar, footer
  // or contact popup — one message, one action.
  if (currentView === 'not-found') {
    return (
      <Suspense fallback={<PageFallback />}>
        <NotFoundPage onGoHome={() => navigateTo('home')} />
      </Suspense>
    );
  }

  return (
    <main className="min-h-screen w-full relative bg-black text-white selection:bg-brand selection:text-white">
      
      {/* Global Ambient Background - Subtle and Premium.
          Was a 1200x1000 div with `blur-[150px]`, which makes the compositor
          allocate a ~1500x1300 texture and run a wide multi-pass Gaussian — on
          every route, eagerly, for a wash whose effective alpha is ~2%. A radial
          gradient paints the same result for free. */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 0%, rgba(164,82,255,0.05), transparent 70%)',
        }}
      />

      <Navbar
        currentView={currentView}
        onViewChange={navigateTo}
        onOpenContact={handleOpenContact}
        minimal={isFormView}
      />

      {isContactOpen && (
        <Suspense fallback={null}>
          <ContactFormPopup 
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            title={contactTitle}
            originRect={contactOrigin}
          />
        </Suspense>
      )}

      <div className="pt-0">
        {currentView === 'home' && (
          <>
            <Hero onViewChange={navigateTo} onOpenContact={handleOpenContact} onStartProject={handleStartProject} onBookCall={handleBookCall} />
            <LazySection>
              <TrustStrip />
            </LazySection>
            <div id="services">
              <LazySection>
                <Services onViewChange={navigateTo} />
              </LazySection>
            </div>
            <LazySection>
              <Work
                onStartProject={handleStartProject}
                onOpenProject={handleOpenProject}
                onViewAll={() => navigateTo('work')}
              />
            </LazySection>
            <LazySection>
              <Process />
            </LazySection>

            <LazySection>
              <About />
            </LazySection>

            {/* Continuous gradient flow across Reviews → Google → Map */}
            <div className="relative overflow-hidden bg-black">
              <div
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(164,82,255,0.05) 0%, rgba(255,32,160,0.06) 50%, rgba(164,82,255,0.05) 100%), radial-gradient(ellipse at 50% 0%, rgba(164,82,255,0.18) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(255,32,160,0.12) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(164,82,255,0.18) 0%, transparent 45%)',
                }}
              />
              <div className="relative z-10">
                <LazySection>
                  <VideoReviews />
                </LazySection>

                <LazySection>
                  <GoogleReviews />
                </LazySection>

                <LazySection>
                  <LocationMap />
                </LazySection>
              </div>
            </div>

            <LazySection>
              <FinalCTA onOpenContact={handleOpenContact} onStartProject={handleStartProject} onBookCall={handleBookCall} />
            </LazySection>

            <LazySection>
              <GoodStuff onViewChange={navigateTo} onOpenPost={handleOpenBlogPost} />
            </LazySection>
          </>
        )}

        {currentView === 'services' && (
          <div className="pt-20">
            <Suspense fallback={<PageFallback />}>
              <Services onViewChange={navigateTo} />
            </Suspense>
          </div>
        )}

        {(currentView === 'service-software' ||
          currentView === 'service-crm' ||
          currentView === 'service-mobile' ||
          currentView === 'service-website' ||
          currentView === 'service-social' ||
          currentView === 'service-ads') && (
          <Suspense fallback={<PageFallback />}>
            <ServiceDetailPage
              service={currentView}
              onViewChange={navigateTo}
              onServicesClick={navigateToServicesSection}
              onStartProjectWithService={handleStartProjectWithService}
            />
          </Suspense>
        )}

        {currentView === 'pricing' && (
          <div className="pt-20">
            <Suspense fallback={<PageFallback />}>
              <PricingSection onViewChange={navigateTo} />
            </Suspense>
          </div>
        )}

        {currentView === 'crm-demo' && (
           <div className="pt-0">
            <Suspense fallback={<PageFallback />}>
              <CrmDemoPage onViewChange={navigateTo} />
            </Suspense>
           </div>
        )}

        {currentView === 'refund-policy' && (
           <div className="pt-0">
            <Suspense fallback={<PageFallback />}>
              <RefundPolicyPage onViewChange={navigateTo} />
            </Suspense>
           </div>
        )}

        {currentView === 'contact' && (
          <Suspense fallback={<PageFallback />}>
            <ContactPage onViewChange={navigateTo} />
          </Suspense>
        )}

        {(currentView === 'privacy' || currentView === 'terms' || currentView === 'cookies') && (
          <Suspense fallback={<PageFallback />}>
            <LegalPage kind={currentView} onViewChange={navigateTo} />
          </Suspense>
        )}

        {currentView === 'blog' && (
          <Suspense fallback={<PageFallback />}>
            <BlogIndexPage onViewChange={navigateTo} onOpenPost={handleOpenBlogPost} />
          </Suspense>
        )}

        {currentView === 'blog-post' && selectedBlogSlug && (
          <Suspense fallback={<PageFallback />}>
            <BlogPostPage slug={selectedBlogSlug} onViewChange={navigateTo} onOpenPost={handleOpenBlogPost} />
          </Suspense>
        )}

        {currentView === 'start-project' && (
          <Suspense fallback={<PageFallback />}>
            <StartProjectPage
              onViewChange={navigateTo}
              prefillService={prefillService}
              onPrefillConsumed={() => setPrefillService(null)}
            />
          </Suspense>
        )}

        {currentView === 'book-call' && (
          <Suspense fallback={<PageFallback />}>
            <BookCallPage onViewChange={navigateTo} />
          </Suspense>
        )}

        {currentView === 'work' && (
          <Suspense fallback={<PageFallback />}>
            <WorkIndexPage onViewChange={navigateTo} onOpenProject={handleOpenProject} />
          </Suspense>
        )}

        {currentView === 'work-post' && selectedProjectSlug && (
          <Suspense fallback={<PageFallback />}>
            {getCaseStudyBySlug(selectedProjectSlug) ? (
              <CaseStudyPage
                caseStudy={getCaseStudyBySlug(selectedProjectSlug)!}
                onViewChange={navigateTo}
                onOpenProject={handleOpenProject}
              />
            ) : (
              <WorkPostPage
                slug={selectedProjectSlug}
                onViewChange={navigateTo}
                onOpenProject={handleOpenProject}
              />
            )}
          </Suspense>
        )}

        {currentView === 'about' && (
          <Suspense fallback={<PageFallback />}>
            <AboutPage onViewChange={navigateTo} onStartProject={handleStartProject} />
          </Suspense>
        )}

      </div>

      {!hideFooter && (
        <LazySection>
          <Footer onViewChange={navigateTo} />
        </LazySection>
      )}

    </main>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      {/* Supplies animation features to the lightweight `m` components used on the
          eager render path (Hero, Navbar, MagneticButton). `domAnimation` is roughly
          half the weight of the full feature set that plain `motion` would pull into
          the initial chunk. Intentionally not `strict` — the lazily-loaded sections
          still use `motion` directly, and they load off the critical path. */}
      <LazyMotion features={domAnimation}>
        <AppContent />
      </LazyMotion>
    </ThemeProvider>
  );
};

export default App;
