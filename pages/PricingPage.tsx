
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const pricingFaqData = [
  {
    question: "How do I pay for a premium plan?",
    answer: "We currently accept payments through the Fonepay digital wallet. On the payment page, you will find a QR code to scan and complete the payment. After paying, you'll need to upload a screenshot of the transaction confirmation."
  },
  {
    question: "Is my payment secure?",
    answer: "Yes, Fonepay is a secure and widely trusted payment gateway in Nepal. Your transaction is protected by their security measures. We only require a screenshot for verification and do not handle your direct payment details."
  },
  {
    question: "What happens after I pay?",
    answer: "After you upload your payment screenshot and contact our support via WhatsApp, we will verify your payment and activate your Premium or Pro account, usually within a few minutes."
  },
  {
    question: "Are subscriptions automatically renewed?",
    answer: "No, currently our plans are based on one-time payments (yearly or lifetime). Your subscription will not be automatically renewed. We will notify you when your plan is about to expire."
  },
  {
    question: "What does a 'Lifetime' plan mean?",
    answer: "Our 'Lifetime' Pro plan means you pay once and get access to all Pro features for the entire lifetime of the ILovePDFLY service, including all future updates and tools."
  },
  {
    question: "Can I get a refund?",
    answer: "Due to the nature of digital services and the one-time payment structure, we generally do not offer refunds. We recommend starting with our free plan to ensure our tools meet your needs before purchasing."
  },
];

const FaqItem: React.FC<{
    item: { question: string, answer: string },
    isOpen: boolean,
    toggle: () => void,
}> = ({ item, isOpen, toggle }) => (
    <div className="border-t border-gray-200 dark:border-gray-700">
        <button onClick={toggle} className="w-full flex justify-between items-center text-left py-5 focus:outline-none">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{item.question}</h3>
            <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                 <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed pr-4">{item.answer}</p>
        </div>
    </div>
);


const PricingPage: React.FC = () => {
    const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Pricing Plans | I Love PDFLY";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Choose the perfect plan for your needs. From our free Basic plan to Premium and Pro, unlock more features and unlimited processing with I Love PDFLY.");
        }
    }, []);

    const handleChoosePlan = (plan: 'premium' | 'pro') => {
        if (user) {
            navigate('/payment', { state: { plan } });
        } else {
            navigate('/signup', { state: { from: 'pricing', plan } });
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const plans = {
        basic: { name: 'Basic', price: 'Free', features: ['Access to most tools', 'Limited document processing', 'Work on Web'] },
        premium: { name: 'Premium', price: { yearly: '$5/year', monthly: '$1/month' }, features: ['Full access to all tools', 'Unlimited document processing', 'Work on Web, Mobile and Desktop', 'No Ads', 'Customer support'] },
        pro: { name: 'Pro', price: { yearly: '$10/lifetime', monthly: '$2/month' }, features: ['All Premium features', 'Largest file size limits', 'Unlimited AI Assistant queries', 'Dedicated servers for faster processing', 'Priority customer support'] }
    };

    const comparisonFeatures = [
        { name: 'Access to All Tools', basic: true, premium: true, pro: true },
        { name: 'Unlimited document processing', basic: false, premium: true, pro: true },
        { name: 'Work on Web', basic: true, premium: true, pro: true },
        { name: 'Work on Mobile & Desktop', basic: false, premium: true, pro: true },
        { name: 'No Ads', basic: false, premium: true, pro: true },
        { name: 'Customer support', basic: false, premium: true, pro: true },
        { name: 'AI Assistant Queries', basic: 'Limited', premium: 'Increased', pro: 'Unlimited' },
        { name: 'Maximum file size', basic: 'Standard', premium: 'Large', pro: 'Largest' },
        { name: 'Dedicated servers', basic: false, premium: false, pro: true },
    ];

    const FeatureValue: React.FC<{ value: boolean | string }> = ({ value }) => {
        if (typeof value === 'boolean') {
            return value ? <CheckIcon className="h-6 w-6 text-green-500" /> : <MinusIcon className="h-5 w-5 text-gray-400" />;
        }
        return <span className="text-sm font-semibold">{value}</span>;
    };

    return (
        <div className="py-16 md:py-24 bg-gray-50 dark:bg-black">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">Choose the plan that suits you</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Start for free and scale up as you grow. No credit card required.
                    </p>
                </div>

                <div className="flex justify-center items-center gap-4 mb-12">
                    <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-brand-red' : 'text-gray-500'}`}>Monthly Billing</span>
                    <label htmlFor="billing-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="billing-toggle" className="sr-only peer" checked={billingCycle === 'yearly'} onChange={() => setBillingCycle(billingCycle === 'yearly' ? 'monthly' : 'yearly')} />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-red"></div>
                    </label>
                    <span className={`font-semibold ${billingCycle === 'yearly' ? 'text-brand-red' : 'text-gray-500'}`}>Yearly Billing</span>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full dark:bg-green-900 dark:text-green-300">SAVE 58%</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Basic Plan */}
                    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 flex flex-col animated-border">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{plans.basic.name}</h2>
                        <p className="text-4xl font-extrabold my-4 text-gray-800 dark:text-gray-100">{plans.basic.price}</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">For simple, occasional use</p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            {plans.basic.features.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <CheckIcon className="h-5 w-5 text-green-500" />
                                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <Link to="/signup" className="w-full text-center mt-auto bg-white dark:bg-gray-800 border border-brand-red text-brand-red font-bold py-3 px-6 rounded-lg hover:bg-red-50 dark:hover:bg-brand-red/10 transition-colors">
                            Start for free
                        </Link>
                    </div>

                    {/* Premium Plan */}
                    <div className="bg-white dark:bg-black border-2 border-brand-red rounded-lg p-8 flex flex-col relative overflow-hidden animated-border">
                        <span className="absolute top-0 right-0 bg-brand-red text-white text-xs font-bold px-8 py-1 rounded-bl-lg">Most Popular</span>
                        <h2 className="text-2xl font-bold text-brand-red">{plans.premium.name}</h2>
                        <p className="text-4xl font-extrabold my-4 text-gray-800 dark:text-gray-100">{billingCycle === 'yearly' ? plans.premium.price.yearly : plans.premium.price.monthly}</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">For advanced, regular use</p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            {plans.premium.features.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <CheckIcon className="h-5 w-5 text-green-500" />
                                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleChoosePlan('premium')} className="w-full text-center mt-auto bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Go Premium
                        </button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 flex flex-col animated-border">
                        <h2 className="text-2xl font-bold text-blue-600">{plans.pro.name}</h2>
                        <p className="text-4xl font-extrabold my-4 text-gray-800 dark:text-gray-100">{billingCycle === 'yearly' ? plans.pro.price.yearly : plans.pro.price.monthly}</p>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">For power users and teams</p>
                        <ul className="space-y-3 mb-8 flex-grow">
                            {plans.pro.features.map(feature => (
                                <li key={feature} className="flex items-center gap-3">
                                    <CheckIcon className="h-5 w-5 text-green-500" />
                                    <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => handleChoosePlan('pro')} className="w-full text-center mt-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                            Go Pro
                        </button>
                    </div>
                </div>

                <section className="mt-16 md:mt-24">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-8">Compare the plans</h2>
                        <div className="bg-white dark:bg-black rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                            <div className="hidden md:grid md:grid-cols-4 md:gap-px md:bg-gray-200 dark:md:bg-gray-700">
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 font-bold text-lg text-gray-800 dark:text-gray-100">Features</div>
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 text-center font-bold text-lg text-gray-800 dark:text-gray-100">Basic</div>
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 text-center font-bold text-lg text-brand-red">Premium</div>
                                <div className="bg-gray-50 dark:bg-gray-900 p-4 text-center font-bold text-lg text-blue-600">Pro</div>
                            </div>
                            
                            {comparisonFeatures.map((feature, index) => (
                                <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 first:border-t-0 md:border-t-0">
                                    <div className="bg-white dark:bg-black p-4 col-span-2 md:col-span-1 flex items-center">
                                      <span className="md:hidden font-bold mr-2">Feature:</span> 
                                      {feature.name}
                                    </div>
                                    <div className="bg-white dark:bg-black p-4 flex justify-between items-center">
                                      <span className="md:hidden font-bold text-gray-600 dark:text-gray-400">Basic:</span> 
                                      <div className="w-full flex justify-end md:justify-center"><FeatureValue value={feature.basic} /></div>
                                    </div>
                                    <div className="bg-white dark:bg-black p-4 flex justify-between items-center">
                                      <span className="md:hidden font-bold text-gray-600 dark:text-gray-400">Premium:</span>
                                      <div className="w-full flex justify-end md:justify-center"><FeatureValue value={feature.premium} /></div>
                                    </div>
                                    <div className="bg-white dark:bg-black p-4 flex justify-between items-center">
                                      <span className="md:hidden font-bold text-gray-600 dark:text-gray-400">Pro:</span> 
                                      <div className="w-full flex justify-end md:justify-center"><FeatureValue value={feature.pro} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section className="mt-16 md:mt-24">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 text-center mb-8">Frequently Asked Questions</h2>
                         <div className="bg-white dark:bg-black p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
                            {pricingFaqData.map((faq, index) => (
                                <FaqItem
                                    key={index}
                                    item={faq}
                                    isOpen={openFaq === index}
                                    toggle={() => toggleFaq(index)}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default PricingPage;