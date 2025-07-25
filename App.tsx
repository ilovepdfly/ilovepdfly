import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ScrollToTopButton from './components/ScrollToTopButton';
import ProfileImageModal from './components/ProfileImageModal';
import ChangePasswordModal from './components/ChangePasswordModal';
import CalendarModal from './components/CalendarModal';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import CookieConsentBanner from './components/CookieConsentBanner';
import { Tool } from './types';
import { TOOLS, blogPosts } from './constants';
import { SearchIcon, BookOpenIcon, CloseIcon } from './components/icons';

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const DeveloperPage = lazy(() => import('./pages/DeveloperPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const GamesPage = lazy(() => import('./pages/PlayGamePage'));
const ImageGeneratorPage = lazy(() => import('./pages/ImageGeneratorPage'));
const AIQuestionGeneratorPage = lazy(() => import('./pages/AIQuestionGeneratorPage'));
const InvoiceGeneratorPage = lazy(() => import('./pages/InvoiceGeneratorPage'));
const LessonPlanCreatorPage = lazy(() => import('./pages/LessonPlanCreatorPage'));
const CVGeneratorPage = lazy(() => import('./pages/CVGeneratorPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const PremiumFeaturePage = lazy(() => import('./pages/PremiumFeaturePage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const DeveloperAccessPage = lazy(() => import('./pages/DeveloperAccessPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const HowToUsePage = lazy(() => import('./pages/HowToUsePage'));
const EducationPage = lazy(() => import('./pages/EducationPage'));
const BusinessPage = lazy(() => import('./pages/BusinessPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const CeoPage = lazy(() => import('./pages/CeoPage'));
const SitemapPage = lazy(() => import('./pages/SitemapPage'));
const MemoryMatchGame = lazy(() => import('./pages/games/MemoryMatchGame'));
const WordFinderGame = lazy(() => import('./pages/games/WordFinderGame'));
const QuizGame = lazy(() => import('./pages/games/QuizGame'));
const CarRacingGame = lazy(() => import('./pages/games/CarRacingGame'));
const PdfInvadersGame = lazy(() => import('./pages/games/PdfInvadersGame'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<{ tools: Tool[], posts: any[] }>({ tools: [], posts: [] });
  const location = useLocation();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSearchTerm('');
        setSearchResults({ tools: [], posts: [] });
      }, 300);
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    if (location.pathname === '/search' && queryParams.has('q')) {
        setSearchTerm(queryParams.get('q') || '');
    }

    const handler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);

  }, [isOpen, onClose, location.pathname, location.search]);

  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const filteredTools = TOOLS.filter(tool =>
        tool.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        tool.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
      const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.excerpt.toLowerCase().includes(lowerCaseSearchTerm)
      );
      setSearchResults({ tools: filteredTools, posts: filteredPosts });
    } else {
      setSearchResults({ tools: [], posts: [] });
    }
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex justify-center p-4 sm:p-8 pt-[15vh]" onClick={onClose}>
      <div 
        className="bg-white dark:bg-black w-full max-w-xl max-h-[70vh] flex flex-col rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex items-center gap-4 border-b border-gray-200 dark:border-gray-700">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for tools or articles..."
            autoFocus
            className="w-full bg-transparent focus:outline-none text-lg text-gray-800 dark:text-gray-100"
          />
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="overflow-y-auto">
          {searchTerm.trim().length > 1 && searchResults.tools.length === 0 && searchResults.posts.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No results found for "{searchTerm}".</p>
          ) : (
            <div className="p-4 space-y-4">
              {searchResults.tools.length > 0 && (
                <div>
                  <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Tools</h3>
                  <ul className="mt-2 space-y-1">
                    {searchResults.tools.map(tool => (
                      <li key={tool.id}>
                        <Link to={`/${tool.id}`} onClick={onClose} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                          <tool.Icon className={`h-6 w-6 flex-shrink-0 ${tool.textColor}`} />
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{tool.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{tool.description}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {searchResults.posts.length > 0 && (
                 <div>
                  <h3 className="px-4 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Blog Posts</h3>
                  <ul className="mt-2 space-y-1">
                    {searchResults.posts.map(post => (
                      <li key={post.slug}>
                        <Link to={`/blog/${post.slug}`} onClick={onClose} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                           <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                             <BookOpenIcon className="h-6 w-6 text-gray-500" />
                           </div>
                           <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{post.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{post.excerpt}</p>
                           </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PageLoader = () => (
    <div className="flex-grow flex items-center justify-center">
        <div className="text-center">
            <div className="flex items-center justify-center space-x-1 animate-pulse">
                <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">I</span>
                <span className="text-2xl text-brand-red">❤</span>
                <span className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 tracking-tight">PDFLY</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
    </div>
);

function AppContent() {
  const { loading } = useAuth();
  const [isProfileImageModalOpen, setProfileImageModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [isCalendarModalOpen, setCalendarModalOpen] = useState(false);
  const [isSearchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/search') {
      setSearchModalOpen(true);
    }
  }, [location.pathname]);
  
  const handleSearchModalClose = () => {
    setSearchModalOpen(false);
    if (location.pathname === '/search') {
      navigate('/');
    }
  };
  
  return (
    <>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen font-sans text-gray-800 dark:text-gray-200">
        <Header 
          onOpenProfileImageModal={() => setProfileImageModalOpen(true)}
          onOpenChangePasswordModal={() => setChangePasswordModalOpen(true)}
          onOpenSearchModal={() => setSearchModalOpen(true)}
        />
        <main className="flex-grow flex flex-col">
          {loading ? (
             <PageLoader />
          ) : (
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/developer" element={<DeveloperPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/play-game" element={<GamesPage />} />
                <Route path="/play-game/memory-match" element={<MemoryMatchGame />} />
                <Route path="/play-game/word-finder" element={<WordFinderGame />} />
                <Route path="/play-game/quiz-game" element={<QuizGame />} />
                <Route path="/play-game/car-racing" element={<CarRacingGame />} />
                <Route path="/play-game/pdf-invaders" element={<PdfInvadersGame />} />
                <Route path="/ai-image-generator" element={<ImageGeneratorPage />} />
                <Route path="/ai-question-generator" element={<AIQuestionGeneratorPage />} />
                <Route path="/invoice-generator" element={<InvoiceGeneratorPage />} />
                <Route path="/lesson-plan-creator" element={<LessonPlanCreatorPage />} />
                <Route path="/cv-generator" element={<CVGeneratorPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/premium-feature" element={<PremiumFeaturePage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/developer-access" element={<DeveloperAccessPage />} />
                <Route path="/how-to-use" element={<HowToUsePage />} />
                <Route path="/education" element={<EducationPage />} />
                <Route path="/business" element={<BusinessPage />} />
                <Route element={<AdminProtectedRoute />}>
                    <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                </Route>
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="/ceo" element={<CeoPage />} />
                <Route path="/:toolId" element={<ToolPage />} />
              </Routes>
            </Suspense>
          )}
        </main>
        <Footer onOpenCalendarModal={() => setCalendarModalOpen(true)} />
      </div>
      <ScrollToTopButton />
      <ProfileImageModal 
        isOpen={isProfileImageModalOpen} 
        onClose={() => setProfileImageModalOpen(false)} 
      />
      <ChangePasswordModal 
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
      <CalendarModal 
        isOpen={isCalendarModalOpen}
        onClose={() => setCalendarModalOpen(false)}
      />
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalClose}
      />
      <CookieConsentBanner />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;