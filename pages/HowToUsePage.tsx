
import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../constants.ts';

const toolGuides: Record<string, { purpose: string; steps: string[] }> = {
    'merge-pdf': {
        purpose: 'Combine multiple PDF files into a single, ordered document.',
        steps: [
            'Click the "Select Files" button or drag and drop all the PDFs you want to merge.',
            'In the preview area, drag the file thumbnails to arrange them in your desired order.',
            'Click the "Merge PDF" button to start the process.',
            'Once finished, click "Download Merged PDF" to save your combined file.'
        ]
    },
    'split-pdf': {
        purpose: 'Extract one or more pages from a PDF file into separate documents.',
        steps: [
            'Upload the PDF file you wish to split.',
            'Choose a split mode: "Split by range" to create custom PDFs or "Extract all pages" to get one PDF per page.',
            'Enter the page numbers or ranges you want to extract (e.g., 1, 3-5, 8).',
            'Click the "Split PDF" button.',
            'Your new PDF(s) will be available for download, often packaged in a ZIP file.'
        ]
    },
    'compress-pdf': {
        purpose: 'Reduce the file size of your PDF while maintaining the best possible quality.',
        steps: [
            'Upload the PDF file you want to compress.',
            'The tool will automatically start the compression process.',
            'After a few moments, the compressed file will be ready.',
            'Click "Download Compressed PDF" to save the smaller file.'
        ]
    },
    'organize-pdf': {
        purpose: 'Reorder, rotate, or delete pages within your PDF document.',
        steps: [
            'Upload the PDF file you want to organize.',
            'The tool will display all pages as thumbnails.',
            'Drag and drop the pages to reorder them.',
            'Hover over a page to find options to rotate or delete it.',
            'Once you are happy with the new order, click the "Organize PDF" button.',
            'Download your newly arranged PDF file.'
        ]
    },
    'remove-background': {
        purpose: 'Automatically remove the background from an image, leaving you with a transparent subject.',
        steps: [
            'Upload a JPG, PNG, or WEBP image file.',
            'The AI will automatically process the image to remove the background.',
            'A preview of the image with the background removed will be shown.',
            'Click "Download Image" to save the result as a PNG file with a transparent background.'
        ]
    },
    // Default guide for other tools
    'default': {
        purpose: 'Perform a specific task on your document.',
        steps: [
            'Upload the required file(s) for the tool.',
            'Adjust any available options if necessary (e.g., rotation angle, password).',
            'Click the main action button (e.g., "Rotate PDF", "Protect PDF").',
            'Download your processed file.'
        ]
    }
};

const HowToUsePage: React.FC = () => {
    return (
        <div className="py-16 md:py-24 bg-gray-50 dark:bg-black">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100">How to Use Our Tools</h1>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                        Simple, step-by-step guides for every tool on ILovePDFLY.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto space-y-12">
                    {TOOLS.map((tool) => {
                        const guide = toolGuides[tool.id] || toolGuides['default'];
                        return (
                            <div key={tool.id} id={tool.id} className="scroll-mt-24">
                                <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 md:p-8 rounded-lg shadow-lg">
                                    <div className="flex flex-col md:flex-row items-start gap-6">
                                        <div className={`p-4 rounded-lg ${tool.color} flex-shrink-0`}>
                                            <tool.Icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="flex-grow">
                                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{tool.title}</h2>
                                            <p className="mt-1 text-gray-600 dark:text-gray-400">{tool.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Purpose:</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">{guide.purpose}</p>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Steps:</h3>
                                        <ol className="list-decimal list-outside space-y-3 pl-5 text-gray-600 dark:text-gray-300">
                                            {guide.steps.map((step, stepIndex) => (
                                                <li key={stepIndex} className="pl-2">{step}</li>
                                            ))}
                                        </ol>
                                        <div className="mt-6 text-right">
                                            <Link to={`/${tool.id}`} className={`${tool.color} ${tool.hoverColor} text-white font-bold py-2 px-5 rounded-lg transition-colors`}>
                                                Go to {tool.title} &rarr;
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default HowToUsePage;