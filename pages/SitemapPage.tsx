import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, blogPosts } from '../constants.ts';
import { Tool } from '../types.ts';

const SitemapPage: React.FC = () => {

    useEffect(() => {
      document.title = "Sitemap | I Love PDFLY";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
          metaDesc.setAttribute("content", "Explore the sitemap for I Love PDFLY. Find links to all our PDF tools, blog articles, and main pages to easily navigate our website.");
      }
    }, []);

    const categoryConfig: Record<string, { title: string; tools: Tool[] }> = {
        organize: { title: 'Organize PDF', tools: [] },
        optimize: { title: 'Optimize PDF', tools: [] },
        'convert-to': { title: 'Convert to PDF', tools: [] },
        'convert-from': { title: 'Convert from PDF', tools: [] },
        edit: { title: 'Edit & Sign PDF', tools: [] },
        security: { title: 'Secure & Sign PDF', tools: [] },
    };

    const groupedTools = TOOLS.reduce((acc, tool) => {
        const categoryKey = tool.category || 'organize';
        if (!acc[categoryKey]) {
            acc[categoryKey] = { title: categoryConfig[categoryKey]?.title || 'Tools', tools: [] };
        }
        acc[categoryKey].tools.push(tool);
        return acc;
    }, {} as Record<string, { title: string; tools: Tool[] }>);


  return (
    <div className="bg-gray-50 dark:bg-black py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Sitemap</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              An overview of all pages and resources available on I Love PDFLY.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Pages */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 lg:col-span-1">
              <h2 className="text-2xl font-bold text-brand-red border-b-2 border-brand-red/30 pb-2 mb-4">Main Pages</h2>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">About Us</Link></li>
                 <li><Link to="/ceo" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Message from CEO</Link></li>
                <li><Link to="/blog" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Blog</Link></li>
                <li><Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Contact</Link></li>
                <li><Link to="/faq" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">FAQ</Link></li>
                <li><Link to="/developer" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Careers</Link></li>
                <li><Link to="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Pricing</Link></li>
                <li><Link to="/sitemap" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Sitemap</Link></li>
                <li><Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Login</Link></li>
                <li><Link to="/signup" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Sign Up</Link></li>
                <li><Link to="/privacy-policy" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Terms of Service</Link></li>
              </ul>

               <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">Solutions & Resources</h3>
                <ul className="space-y-2">
                    <li><Link to="/education" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">For Education</Link></li>
                    <li><Link to="/business" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">For Business</Link></li>
                    <li><Link to="/how-to-use" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">How-to Guides</Link></li>
                    <li><Link to="/ai-image-generator" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">AI Image Generator</Link></li>
                    <li>
                        <Link to="/play-game" className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">Games Arcade</Link>
                        <ul className="pl-4 space-y-1 mt-1 border-l-2 border-gray-200 dark:border-gray-700">
                            <li><Link to="/play-game/memory-match" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-red transition-colors">Memory Match</Link></li>
                            <li><Link to="/play-game/word-finder" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-red transition-colors">Word Finder</Link></li>
                             <li><Link to="/play-game/quiz-game" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-red transition-colors">Quiz Game</Link></li>
                            <li><Link to="/play-game/car-racing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-red transition-colors">Retro Racer</Link></li>
                            <li><Link to="/play-game/pdf-invaders" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-red transition-colors">PDF Invaders</Link></li>
                        </ul>
                    </li>
                </ul>
            </div>

            {/* PDF Tools */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 lg:col-span-2">
                <h2 className="text-2xl font-bold text-brand-red border-b-2 border-brand-red/30 pb-2 mb-4">PDF Tools</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {Object.values(groupedTools).map(category => (
                        <div key={category.title} className="space-y-2">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{category.title}</h3>
                            <ul className="space-y-1">
                            {category.tools.map(tool => (
                                <li key={tool.id}><Link to={`/${tool.id}`} className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">{tool.title}</Link></li>
                            ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Blog Posts */}
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 lg:col-span-3">
              <h2 className="text-2xl font-bold text-brand-red border-b-2 border-brand-red/30 pb-2 mb-4">Blog Articles</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {blogPosts.map(post => (
                  <li key={post.slug}>
                    <Link to={`/blog/${post.slug}`} className="text-gray-700 dark:text-gray-300 hover:text-brand-red transition-colors">{post.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;