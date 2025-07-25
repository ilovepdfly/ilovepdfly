import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from '@google/genai';
import { Packer, Document, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';

import { TOOLS } from '../constants.ts';
import { CopyIcon, DownloadIcon, BookOpenIcon } from '../components/icons.tsx';

const AIQuizGenerator: React.FC<{ lessonPlan: string }> = ({ lessonPlan }) => {
    const [quiz, setQuiz] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const generateQuiz = async () => {
        setIsLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Based on the following lesson plan, create a short 5-question quiz (mix of multiple choice and short answer) with an answer key at the end.\n\nLesson Plan:\n${lessonPlan}`,
            });
            setQuiz(response.text);
        } catch (e: any) {
            setError('Failed to generate quiz. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(quiz).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="mt-6 p-4 border-t-2 border-dashed border-indigo-300 dark:border-indigo-800">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Bonus: Create a Quiz or Worksheet</h3>
            {!quiz && (
                <button
                    onClick={generateQuiz}
                    disabled={isLoading}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center justify-center disabled:bg-indigo-300 dark:disabled:bg-indigo-700"
                >
                    {isLoading ? 'Generating Quiz...' : 'Generate Quiz from Lesson'}
                </button>
            )}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {quiz && (
                <div className="p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black rounded-lg">
                    <div className="flex justify-end">
                         <div className="relative">
                            <button onClick={handleCopy} className="text-gray-500 hover:text-indigo-500">
                                <CopyIcon className="h-5 w-5" />
                            </button>
                            {copied && <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded shadow-lg z-10">Copied!</span>}
                        </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-sm">{quiz}</pre>
                </div>
            )}
        </div>
    );
};


const LessonPlanCreatorPage: React.FC = () => {
    const tool = TOOLS.find(t => t.id === 'lesson-plan-creator');
    
    const [gradeLevel, setGradeLevel] = useState('5th Grade');
    const [subject, setSubject] = useState('Science');
    const [topic, setTopic] = useState('The Water Cycle');
    const [duration, setDuration] = useState('45');
    const [style, setStyle] = useState('Interactive & Hands-on');
    
    const [lessonPlan, setLessonPlan] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
      document.title = "AI Lesson Plan Creator | Create Lesson Plans - I Love PDFLY";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
          metaDesc.setAttribute("content", "Generate detailed, engaging lesson plans for any subject in seconds. Let our AI build a comprehensive plan with activities, assessments, and homework.");
      }
    }, []);

    const handleGenerate = async () => {
        if (!topic.trim()) {
            setError('Please enter a topic for the lesson plan.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setLessonPlan('');

        const prompt = `You are a professional lesson planner and curriculum expert. Your task is to create a complete, creative, and effective lesson plan for a classroom teacher.

Here are the lesson details:

- Grade Level: ${gradeLevel}
- Subject: ${subject}
- Topic: ${topic}
- Class Duration: ${duration} minutes
- Preferred Teaching Style: ${style}

Please provide a detailed lesson plan that includes the following sections:

1. **Lesson Title**
2. **Grade Level**
3. **Objectives** – What should students learn by the end of the lesson?
4. **Introduction** – A short and engaging way to introduce the topic.
5. **Main Teaching Activity** – Include steps, group work or interaction if needed.
6. **Assessment Ideas** – Short quiz, oral questions, or activities to test understanding.
7. **Homework or Practice Assignment** – Something students can do after class.
8. **Materials Needed** – List of resources or supplies.
9. **Notes for the Teacher** – Tips, alternative ideas, or anything important.

Make the lesson engaging, age-appropriate, and practical for real classroom use. Keep your response in clear bullet points or sections so teachers can easily read and apply it.

If the topic is too broad, focus on a sub-topic that fits within the given class duration.`;

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            
            setLessonPlan(response.text);

        } catch (e: any) {
            console.error(e);
            setError(`Failed to generate lesson plan. ${e.message || 'Please try again later.'}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    const exportToDoc = () => {
        if (!lessonPlan) return;
        const paragraphs = lessonPlan.split('\n').map(p => new Paragraph({
            children: [new TextRun(p)]
        }));
        const doc = new Document({ sections: [{ children: paragraphs }] });
        Packer.toBlob(doc).then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `lesson-plan-${topic.replace(/\s+/g, '-')}.docx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    };
    
    const exportToPdf = () => {
        if (!lessonPlan) return;
        const pdf = new jsPDF();
        const lines = pdf.splitTextToSize(lessonPlan, 180);
        pdf.text(lines, 15, 15);
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lesson-plan-${topic.replace(/\s+/g, '-')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!tool) return null;

    return (
        <div className="min-h-[calc(100vh-200px)] flex flex-col items-center py-12 px-4 sm:px-6 bg-gray-50 dark:bg-black">
            <div className="text-center mb-10">
                <h1 className={`text-4xl font-extrabold ${tool.textColor}`}>{tool.title}</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-300 max-w-2xl">{tool.description}</p>
            </div>
            
            <div className="w-full max-w-4xl space-y-6">
                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="grade-level" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Grade Level</label>
                            <input id="grade-level" value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                         <div>
                            <label htmlFor="subject" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                            <input id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="topic" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Topic</label>
                            <textarea id="topic" value={topic} onChange={e => setTopic(e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md" rows={2} />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Duration (minutes)</label>
                            <input id="duration" type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                        <div>
                            <label htmlFor="style" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Teaching Style</label>
                            <input id="style" value={style} onChange={e => setStyle(e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md" />
                        </div>
                    </div>
                    <div className="mt-6">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className={`w-full ${tool.color} ${tool.hoverColor} text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors flex items-center justify-center disabled:bg-indigo-300 dark:disabled:bg-indigo-800`}
                        >
                            {isLoading ? 'Generating...' : <><BookOpenIcon className="h-6 w-6 mr-2" /> Generate Lesson Plan</>}
                        </button>
                    </div>
                </div>

                {error && <p className="text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}

                {lessonPlan && (
                    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Your Lesson Plan</h2>
                            <div className="flex gap-2">
                                <button onClick={exportToDoc} className="flex items-center gap-2 text-sm font-semibold p-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                                    <DownloadIcon className="h-5 w-5"/> DOC
                                </button>
                                <button onClick={exportToPdf} className="flex items-center gap-2 text-sm font-semibold p-2 rounded-md bg-red-500 text-white hover:bg-red-600">
                                    <DownloadIcon className="h-5 w-5"/> PDF
                                </button>
                            </div>
                        </div>
                        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 p-4 border rounded-md bg-gray-50 dark:bg-black">
                             <pre className="whitespace-pre-wrap font-sans">{lessonPlan}</pre>
                        </div>
                        
                        <AIQuizGenerator lessonPlan={lessonPlan} />
                    </div>
                )}
            </div>
             <div className="mt-12 text-center">
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-brand-red dark:hover:text-brand-red font-medium transition-colors">
                    &larr; Back to all tools
                </Link>
            </div>
        </div>
    );
};

export default LessonPlanCreatorPage;