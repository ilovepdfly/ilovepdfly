import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TOOLS } from '../constants.ts';
import ToolCard from '../components/ToolCard.tsx';
import { Tool } from '../types.ts';
import AIAssistant from '../components/AIAssistant.tsx';
import { 
    ProtectIcon, RefreshIcon, ShoppingBagIcon, EditIcon, DownloadIcon,
    StarIcon, OcrPdfIcon, StudentIcon, BriefcaseIcon, BookOpenIcon, UploadCloudIcon,
    UsersIcon, ChartBarIcon, HeartbeatIcon, LockIcon, QuestionMarkIcon
} from '../components/icons.tsx';
import { useFavorites } from '../hooks/useFavorites.ts';

const HeroBadge: React.FC<{ tool: Tool, animationClass: string, positionClasses: string }> = ({ tool, animationClass, positionClasses }) => (
    <div className={`absolute ${positionClasses} ${animationClass}`}>
        <Link 
            to={`/${tool.id}`} 
            className="flex items-center gap-2 bg-white/80 dark:bg-black/70 backdrop-blur-sm p-2 md:p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800"
        >
            <tool.Icon className={`h-5 w-5 md:h-6 md:w-6 ${tool.textColor}`} />
            <span className="font-semibold text-xs md:text-sm text-gray-700 dark:text-gray-200 hidden sm:inline">{tool.title}</span>
        </Link>
    </div>
);

const HomeFaqItem: React.FC<{
    item: { q: string, a: string },
    isOpen: boolean,
    toggle: () => void,
}> = ({ item, isOpen, toggle }) => (
    <div className="border-t border-gray-200 dark:border-gray-700 first:border-t-0">
        <button onClick={toggle} className="w-full flex justify-between items-center text-left py-4 focus:outline-none">
            <span className="text-base font-semibold text-gray-800 dark:text-gray-100">{item.q}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed pr-4">{item.a}</p>
        </div>
    </div>
);

const PremiumIllustration = () => (
    <div className="relative w-full h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            {/* Document 1 */}
            <div className="absolute top-[20%] left-[25%] w-40 h-52 bg-white dark:bg-gray-800 rounded-lg shadow-lg -rotate-12 transform-gpu transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <div className="p-3">
                    <div className="w-1/3 h-2 bg-red-400 rounded-sm mb-2"></div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-sm mb-1"></div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-sm mb-1"></div>
                    <div className="w-3/4 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-sm"></div>
                </div>
            </div>
             {/* Document 2 */}
            <div className="absolute top-[30%] left-[45%] w-40 h-52 bg-white dark:bg-gray-800 rounded-lg shadow-xl rotate-6 transform-gpu transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <div className="p-3">
                    <div className="w-1/3 h-2 bg-blue-400 rounded-sm mb-2"></div>
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-sm mb-1"></div>
                    <div className="w-5/6 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-sm"></div>
                </div>
            </div>
            {/* Path */}
            <svg viewBox="0 0 200 100" className="absolute top-[20%] left-[20%] w-full h-full" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'}}>
                <path d="M 50 70 Q 100 -20 150 70" stroke="#4299E1" fill="none" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            {/* Floating Icons */}
            <div className="absolute top-[15%] left-[60%] p-2 bg-white dark:bg-gray-700 rounded-full shadow-md animate-float-1">
                <OcrPdfIcon className="h-5 w-5 text-teal-500" />
            </div>
            <div className="absolute top-[70%] left-[15%] p-2 bg-white dark:bg-gray-700 rounded-full shadow-md animate-float-2">
                <ShoppingBagIcon className="h-5 w-5 text-brand-red" />
            </div>
        </div>
    </div>
);

const StatCard: React.FC<{ icon: React.FC<any>, value: number, label: string, suffix?: string }> = ({ icon: Icon, value, label, suffix }) => {
    const [count, setCount] = useState(0);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const currentRef = cardRef.current;
        if (!currentRef || hasAnimated) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setHasAnimated(true); // Ensure it only runs once
                    
                    let start = 0;
                    const duration = 2000;
                    const end = value;
                    if (start === end) {
                        setCount(end);
                        return;
                    }
                    
                    let startTimestamp: number | null = null;
                    const step = (timestamp: number) => {
                        if (!startTimestamp) startTimestamp = timestamp;
                        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                        setCount(Math.floor(progress * end));
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        } else {
                            setCount(end);
                        }
                    };
                    window.requestAnimationFrame(step);
                    
                    observer.unobserve(currentRef);
                }
            },
            { threshold: 0.5 } // Trigger when 50% is visible
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [value, hasAnimated]);

    return (
        <div className="bg-white dark:bg-black p-6 rounded-xl shadow-lg text-center border border-transparent dark:border-gray-800" ref={cardRef}>
            <Icon className="h-10 w-10 mx-auto text-brand-red mb-3" />
            <p className="text-4xl font-extrabold text-gray-800 dark:text-gray-100">{count.toLocaleString()}{suffix}</p>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{label}</p>
        </div>
    );
};


const HomePage: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [activeSolutionTab, setActiveSolutionTab] = useState<'students' | 'business' | 'educators'>('students');
    
    const { favorites, toggleFavorite, isFavorite } = useFavorites();
    const favoriteTools = useMemo(() => TOOLS.filter(tool => favorites.includes(tool.id)), [favorites]);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const location = useLocation();
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const heroBadges = [
        { tool: TOOLS.find(t => t.id === 'sign-pdf'), animation: 'animate-float-1', position: 'top-4 left-4 md:top-8 md:left-1/4' },
        { tool: TOOLS.find(t => t.id === 'merge-pdf'), animation: 'animate-float-2', position: 'hidden sm:block top-1/3 left-2 md:top-1/2 md:left-[15%]' },
        { tool: TOOLS.find(t => t.id === 'protect-pdf'), animation: 'animate-float-3', position: 'bottom-4 left-4 md:bottom-12 md:left-1/4' },
        { tool: TOOLS.find(t => t.id === 'jpg-to-pdf'), animation: 'animate-float-2', position: 'top-4 right-4 md:top-12 md:right-1/4' },
        { tool: TOOLS.find(t => t.id === 'watermark-pdf'), animation: 'animate-float-1', position: 'hidden sm:block top-2/3 right-2 md:top-1/2 md:right-[18%]' },
        { tool: TOOLS.find(t => t.id === 'pdf-to-pdfa'), animation: 'animate-float-3', position: 'bottom-4 right-4 md:bottom-16 md:right-1/4' },
    ].filter(item => item.tool);
    
    const steps = [
        {
            icon: UploadCloudIcon,
            title: 'Select Files',
            description: 'Choose your documents from your device or drag and drop them.',
        },
        {
            icon: EditIcon,
            title: 'Process & Customize',
            description: 'Adjust settings, merge, rotate, or apply changes as you need.',
        },
        {
            icon: DownloadIcon,
            title: 'Download',
            description: 'Your processed file is ready for download instantly.',
        },
    ];

    const testimonials = [
      { name: 'Bishal Mishra', role: 'Founder & CEO, I Love PDFLY', text: 'The entire suite of tools is impressive. From converting JPGs to PDF for our campaigns to compressing large reports for clients, I Love PDFLY handles everything flawlessly. The client-side processing gives me peace of mind about data security.', image: 'https://ik.imagekit.io/fonepay/bishal%20mishra%20ceo%20of%20ilovepdfly.jpg?updatedAt=1753167712490' },
      { name: 'Anam Mishra', role: 'Project Manager', text: 'Organizing and merging project documents from different teams used to be a nightmare. With I Love PDFLY, I can do it in minutes. The Organize PDF tool is particularly brilliant for reordering pages exactly how I need them.', image: 'https://i.ibb.co/nq8D2rCh/IMG-0293.png' },
      { name: 'Prashant Mishra', role: 'Student', text: 'I recommend I Love PDFLY to all my students. It’s an essential tool for organizing research papers and compressing presentations.The fact that it\'s free is incredible', image: 'https://i.ibb.co/JWCp96YL/IMG-0292.png' },
      { name: 'Michael Chen', role: 'Small Business Owner', text: 'Protecting confidential client proposals with a password is a critical step for my business. I Love PDFLY makes it incredibly simple and secure. Highly recommended!', image: 'https://i.pravatar.cc/150?u=michael' },
      { name: 'David Miller', role: 'Freelance Designer', text: 'The client-side processing is a game-changer for me. I can handle sensitive client files with confidence, knowing nothing is uploaded. The speed is just a fantastic bonus!', image: 'https://i.pravatar.cc/150?u=david' },
      { name: 'Emily Carter', role: 'University Professor', text: 'I recommend I Love PDFLY to all my students. It’s an essential tool for organizing research papers and compressing presentations. The fact that it\'s free is incredible.', image: 'https://i.pravatar.cc/150?u=emily' },
    ];
    
    const solutions = [
        { title: 'I Love PDFLY Desktop', description: 'Download the', linkText: 'I Love PDFLY Desktop App', descriptionAfter: 'to work with your favorite PDF tools on your Mac or Windows PC. Get a lightweight PDF app that helps you process heavy PDF tasks offline in seconds.' },
        { title: 'I Love PDFLY Mobile', description: 'Get the', linkText: 'I Love PDFLY Mobile App', descriptionAfter: 'to manage documents remotely or on the move. Turn your Android or iPhone device into a PDF Editor & Scanner to annotate, sign, and share documents with ease.' },
        { title: 'iLoveIMG', description: '', linkText: 'iLoveIMG', descriptionAfter: 'is the web app that helps you modify images in bulk for free. Crop, resize, compress, convert, and more. All the tools you need to enhance your images in just a few clicks.' },
    ];
    
    const faqs = [
        { q: "Is I Love PDFLY completely free?", a: "Yes! Most of our tools are 100% free for standard use. We offer Premium plans for users who need advanced features like unlimited processing, larger file sizes, and an ad-free experience." },
        { q: "Are my files secure?", a: "Absolutely. Security is our top priority. For most tools, your files are processed entirely in your browser, meaning they never leave your computer. For tasks requiring server-side processing, we use end-to-end encryption and delete all files automatically within a few hours." },
        { q: "Do I need to install any software?", a: "No, you don't need to install anything. I Love PDFLY works directly in your web browser. This means you can access our tools from any device with an internet connection, anywhere in the world." },
    ];

    const solutionsData = {
      students: { icon: StudentIcon, title: 'For Students', description: 'Combine research papers, compress large presentations, and convert your assignments to PDF for easy submission.', tools: ['merge-pdf', 'compress-pdf', 'pdf-to-word', 'ocr-pdf'] },
      business: { icon: BriefcaseIcon, title: 'For Business Professionals', description: 'Sign contracts, protect sensitive reports, convert data to Excel, and add your company watermark.', tools: ['sign-pdf', 'protect-pdf', 'pdf-to-excel', 'watermark-pdf'] },
      educators: { icon: BookOpenIcon, title: 'For Educators', description: 'Split textbook chapters, organize lesson plans, add page numbers to materials, and edit worksheets.', tools: ['split-pdf', 'organize-pdf', 'page-numbers', 'edit-pdf'] },
    };

    const stats = [
        { icon: UsersIcon, value: 250000, label: "Happy Users", suffix: "+" },
        { icon: ChartBarIcon, value: 500000, label: "Documents Processed", suffix: "+" },
        { icon: HeartbeatIcon, value: 99.9, label: "Uptime", suffix: "%" },
        { icon: LockIcon, value: 100, label: "Private & Secure", suffix: "%" },
    ];

  return (
    <div className="overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-20 md:pb-20 text-center bg-white dark:bg-black overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-50">
                    Every PDF Tool You Need
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400">
                    Merge, split, compress, convert, rotate, edit & sign PDFs. Fast, easy, and secure processing right in your browser.
                </p>
                <div className="mt-8">
                    <Link to="/#all-tools" className="bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-6 sm:py-4 sm:px-8 rounded-lg text-base sm:text-lg transition-colors">
                        View All Tools
                    </Link>
                </div>
            </div>
            {heroBadges.map((badge, index) => (
                badge.tool && <HeroBadge key={index} tool={badge.tool} animationClass={badge.animation} positionClasses={badge.position} />
            ))}
        </section>
      
        {/* AI Assistant Section */}
        <section className="bg-gray-50 dark:bg-black py-4">
            <AIAssistant />
        </section>

        {/* Tools Section */}
        <section id="all-tools" className="bg-gray-50 dark:bg-black py-20">
            <div className="container mx-auto px-6">
                {favoriteTools.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 flex items-center gap-3">
                            <StarIcon className="h-8 w-8 text-yellow-400" />
                            Your Favorite Tools
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                            {favoriteTools.map((tool) => (
                                <div key={tool.id}>
                                    <ToolCard tool={tool} isFavorite={isFavorite(tool.id)} onToggleFavorite={toggleFavorite} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6 scroll-mt-24">All Our Tools</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                        {TOOLS.map((tool) => (
                            <div key={tool.id}>
                                <ToolCard tool={tool} isFavorite={isFavorite(tool.id)} onToggleFavorite={toggleFavorite} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* Solutions For You Section */}
        <section className="bg-white dark:bg-black py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">Solutions For You</h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">PDF tools tailored to your specific needs.</p>
                </div>
                <div className="max-w-4xl mx-auto mt-12 bg-white dark:bg-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <div className="flex overflow-x-auto pb-2 -mb-2 no-scrollbar">
                            {Object.keys(solutionsData).map((key) => {
                                const solution = solutionsData[key as keyof typeof solutionsData];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveSolutionTab(key as keyof typeof solutionsData)}
                                        className={`flex-shrink-0 flex items-center gap-2 px-3 py-3 sm:px-6 font-semibold border-b-2 transition-colors focus:outline-none ${
                                            activeSolutionTab === key
                                                ? 'border-brand-red text-brand-red'
                                                : 'border-transparent text-gray-500 hover:text-brand-red'
                                        }`}
                                    >
                                        <solution.icon className="h-5 w-5" />
                                        <span>{solution.title}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-8">
                        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">{solutionsData[activeSolutionTab].description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {solutionsData[activeSolutionTab].tools.map(toolId => {
                                const tool = TOOLS.find(t => t.id === toolId);
                                if (!tool) return null;
                                return (
                                    <Link key={tool.id} to={`/${tool.id}`} className="flex flex-col items-center text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:shadow-md transition-all">
                                        <div className={`p-3 rounded-full ${tool.color}`}>
                                            <tool.Icon className="h-6 w-6 text-white" />
                                        </div>
                                        <span className="mt-2 text-sm font-bold text-gray-800 dark:text-gray-200">{tool.title}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Simple Steps Section */}
        <section className="bg-white dark:bg-black py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">Simple Steps to Success</h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Get your PDF tasks done in just a few clicks.</p>
                </div>
                <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block" style={{transform: 'translateY(-2.5rem)'}}></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 hidden md:block" style={{transform: 'translateY(-2.5rem)'}}>
                        <div className="h-full bg-brand-red w-full" style={{background: 'linear-gradient(to right, #e53935 50%, #f56565 100%)'}}></div>
                    </div>
                     {steps.map((step, index) => (
                        <div key={index} className="text-center relative">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                                    <step.icon className="h-12 w-12 text-brand-red" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-sm border-4 border-white dark:border-black">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-gray-100">{step.title}</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">{step.description}</p>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Link to="/how-to-use" className="inline-block bg-white dark:bg-black border-2 border-brand-red text-brand-red font-bold py-3 px-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        Explore All Guides
                    </Link>
                </div>
            </div>
        </section>
        
        {/* Why Choose Section */}
        <section className="bg-gray-50 dark:bg-black py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">Why Choose I Love PDFLY?</h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">The ultimate online toolkit for all your PDF needs.</p>
                </div>
                <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="text-center p-8 bg-white dark:bg-black rounded-xl">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                            <ProtectIcon className="h-8 w-8 text-brand-red"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ultimate Privacy</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Your files are processed client-side. Nothing is ever uploaded to our servers, guaranteeing 100% privacy.</p>
                    </div>
                    <div className="text-center p-8 bg-white dark:bg-black rounded-xl">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                            <RefreshIcon className="h-8 w-8 text-brand-red"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Blazing Fast</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Because all processing happens in your browser, there's no upload/download time. Get results instantly.</p>
                    </div>
                    <div className="text-center p-8 bg-white dark:bg-black rounded-xl">
                        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                            <ShoppingBagIcon className="h-8 w-8 text-brand-red"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Completely Free</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">All our core tools are free to use, without limits. No hidden fees, no sign-up required for most features.</p>
                    </div>
                </div>
            </div>
        </section>
        
        {/* Our Impact Section */}
        <section className="bg-white dark:bg-black py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">Our Impact in Numbers</h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
                        Join thousands of users who trust I Love PDFLY every day.
                    </p>
                </div>
                <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <StatCard 
                            key={index}
                            icon={stat.icon}
                            value={stat.value}
                            label={stat.label}
                            suffix={stat.suffix}
                        />
                    ))}
                </div>
            </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 dark:bg-black py-20 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">Trusted by Professionals Worldwide</h2>
                </div>
            </div>
            <div className="mt-12 relative">
                <div className="md:overflow-x-auto no-scrollbar md:max-w-5xl md:mx-auto">
                    <div className="flex space-x-8 animate-marquee md:animate-none md:w-max md:px-6">
                        {[...testimonials, ...testimonials].map((testimonial, index) => (
                            <div key={index} className="flex-shrink-0 w-80 bg-white dark:bg-black p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 flex flex-col items-center">
                                <img src={testimonial.image} alt={`Photo of ${testimonial.name}, ${testimonial.role} at I Love PDFLY`} className="h-20 w-20 rounded-full object-cover mb-4 border-2 border-brand-red p-1" width="80" height="80" loading="lazy" />
                                <blockquote className="text-gray-600 dark:text-gray-300 italic text-center text-base leading-relaxed flex-grow">
                                    "{testimonial.text}"
                                </blockquote>
                                <div className="mt-4 text-center">
                                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{testimonial.name}</p>
                                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 dark:from-black to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 dark:from-black to-transparent pointer-events-none"></div>
            </div>
        </section>
        
        {/* Trustpilot Section */}
        <section className="bg-white dark:bg-black py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">Review Us on Trustpilot</h2>
                    <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">Your feedback helps us grow and improve.</p>
                </div>
                <div className="mt-8 flex justify-center">
                    <a href="https://www.trustpilot.com/review/ilovepdfly.com" target="_blank" rel="noopener noreferrer">
                        <img 
                            src="https://ik.imagekit.io/fonepay/widget.jpg?updatedAt=1752933053507" 
                            alt="Review I Love PDFLY on Trustpilot" 
                            className="h-auto transition-transform hover:scale-105"
                            style={{ maxWidth: '200px' }}
                            width="200"
                            height="104"
                            loading="lazy"
                        />
                    </a>
                </div>
            </div>
        </section>

        {/* Other Solutions Section */}
        <section className="bg-gray-50 dark:bg-black py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 flex items-center justify-center gap-4">
                        <QuestionMarkIcon className="h-10 w-10 text-brand-red" />
                        <span>Looking for another solution?</span>
                    </h2>
                </div>
                <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {solutions.map((solution, index) => (
                         <div key={index} className="text-center p-8">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{solution.title}</h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {solution.description}{' '}
                                <a href="#" className="text-brand-red hover:underline font-semibold">{solution.linkText}</a>{' '}
                                {solution.descriptionAfter}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Premium Section */}
        <section className="bg-white dark:bg-black">
            <div className="bg-white dark:bg-black shadow-xl overflow-hidden md:flex">
                <div className="md:w-1/2 p-8 md:p-12 lg:px-24 lg:py-32 flex flex-col justify-center text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">Get more with Premium</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        Complete projects faster with batch file processing, convert scanned documents with OCR and e-sign your business agreements.
                    </p>
                    <div className="mt-6">
                        <Link to="/signup" className="inline-block bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                            Get Premium
                        </Link>
                    </div>
                </div>
                <div className="md:w-1/2 relative min-h-[300px] md:min-h-0">
                    <PremiumIllustration />
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-gray-50 dark:bg-black py-20">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">Frequently Asked Questions</h2>
                </div>
                <div className="max-w-4xl mx-auto mt-12 bg-white dark:bg-black p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
                    {faqs.map((faq, index) => (
                        <HomeFaqItem 
                            key={index} 
                            item={faq}
                            isOpen={openFaq === index}
                            toggle={() => toggleFaq(index)}
                        />
                    ))}
                </div>
                <div className="mt-8 text-center">
                     <Link to="/faq" className="text-brand-red font-semibold hover:underline">
                        View all FAQs &rarr;
                    </Link>
                </div>
            </div>
        </section>

    </div>
  );
};

export default HomePage;