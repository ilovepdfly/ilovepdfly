

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BrainIcon, UsersIcon, TrendingUpIcon, GlobeIcon } from '../components/icons.tsx';

const DeveloperPage: React.FC = () => {
    useEffect(() => {
        document.title = "Careers | Work at I Love PDFLY";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Join the I Love PDFLY team and help us build the future of document management. Explore our company culture and see how you can make an impact.");
        }
    }, []);

    const values = [
        {
            Icon: BrainIcon,
            title: 'Drive Innovation',
            text: 'Work with cutting-edge technologies like AI and client-side processing to build tools that are fast, smart, and secure.',
        },
        {
            Icon: GlobeIcon,
            title: 'Make a Global Impact',
            text: 'Your work will directly empower thousands of users across the globe, simplifying their daily tasks and boosting their productivity.',
        },
        {
            Icon: TrendingUpIcon,
            title: 'Grow With Us',
            text: 'We are committed to the professional growth of our team members through continuous learning, mentorship, and challenging projects.',
        },
        {
            Icon: UsersIcon,
            title: 'Collaborative Culture',
            text: 'Be part of a supportive and collaborative environment where great ideas are valued and teamwork is key to our success.',
        },
    ];

  return (
    <div className="bg-gray-50 dark:bg-black py-16 md:py-24 overflow-x-hidden">
      <div className="container mx-auto px-6 space-y-16">
        <section className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Careers at I Love PDFLY</h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Join us in our mission to revolutionize document management. We're a passionate, innovative team building tools that empower thousands of users every day. If you're driven to solve complex problems and create exceptional user experiences, you've come to the right place.
            </p>
        </section>

        <section className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-12">Why You'll Love Working Here</h2>
            <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                    <div key={index} className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-xl shadow-lg flex items-start gap-6 border-glow-hover">
                        <div className="flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
                            <value.Icon className="h-7 w-7 text-brand-red" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">{value.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
        
        <section className="max-w-4xl mx-auto text-center bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">Current Openings</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                We are always looking for talented and passionate individuals to join our growing team. While we may not have specific roles listed at this moment, we believe that great talent doesn't wait for a job description.
            </p>
             <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
                If you are an engineer, designer, or product manager who is excited by our mission, we encourage you to reach out. Send us your resume and a message about why you believe you'd be a great fit for I Love PDFLY.
            </p>
            <div className="mt-8">
                <Link to="/contact" className="inline-block bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                    Get In Touch
                </Link>
            </div>
        </section>

      </div>
    </div>
  );
};

export default DeveloperPage;