import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import { DownloadIcon, PlusIcon, EditIcon, TrashIcon, UploadIcon, GmailIcon, WhatsAppIcon, MessengerIcon, ShareIcon, PrintIcon, StarIcon, LockIcon, GridIcon, DollarIcon } from '../components/icons';

// ===================================================================
// TYPES & INITIAL DATA
// ===================================================================

type Item = {
    id: number;
    name: string;
    description: string;
    unit: string;
    quantity: number;
    rate: number;
};
type Template = 'classic' | 'modern' | 'minimalist';

interface InvoiceData {
    title: string;
    logo: string | null;
    invoiceNo: string;
    invoiceDate: string;
    dueDate: string;
    from: { name: string; address: string; email: string; phone: string; taxId: string; };
    to: { name: string; address: string; email: string; phone: string; taxId: string; };
    shipTo: { name: string; address: string; };
    showShipping: boolean;
    items: Item[];
    notes: string;
    terms: string;
    signature: string | null;
    currency: { symbol: string; code: string; name: string };
    taxRate: number;
}

const currencies = [
  { symbol: '$', code: 'USD', name: 'US Dollar' },
  { symbol: '€', code: 'EUR', name: 'Euro' },
  { symbol: '£', code: 'GBP', name: 'British Pound' },
  { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
  { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
  { symbol: 'Rs', code: 'NPR', name: 'Nepalese Rupee' },
];

const initialInvoiceData: InvoiceData = {
    title: 'Invoice',
    logo: null,
    invoiceNo: '00001',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
    from: { name: 'Your Company', address: '123 Your Street, City, Country', email: 'your@company.com', phone: '+1 234 567 890', taxId: 'PAN/VAT No.' },
    to: { name: 'Client Company', address: '456 Client Street, City, Country', email: 'client@company.com', phone: '+1 098 765 432', taxId: 'Client PAN/VAT No.' },
    shipTo: { name: 'Shipping Name', address: '789 Shipping St, City, Country' },
    showShipping: false,
    items: [{ id: 1, name: 'Website Design', description: 'Responsive design and development', unit: 'Service', quantity: 1, rate: 500 }],
    notes: 'Thank you for your business.',
    terms: 'Payment is due within 15 days.',
    signature: null,
    currency: currencies[0],
    taxRate: 0,
};

// ===================================================================
// HELPER COMPONENTS & FUNCTIONS
// ===================================================================

const formatCurrency = (amount: number, currencySymbol: string) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
};

const EditableField: React.FC<{ value: string; onChange: (value: string) => void; placeholder?: string; isTextarea?: boolean; className?: string; type?: string }> = ({ value, onChange, placeholder, isTextarea, className, type = 'text' }) => {
    const Component = isTextarea ? 'textarea' : 'input';
    return (
        <Component
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`bg-transparent w-full focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 rounded p-1 text-sm ${className}`}
            rows={isTextarea ? 2 : undefined}
            type={type}
        />
    );
};

// ===================================================================
// TEMPLATE COMPONENTS
// ===================================================================

const TemplatePreview: React.FC<{ data: InvoiceData; template: Template }> = ({ data, template }) => {
    const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const taxAmount = subtotal * (data.taxRate / 100);
    const total = subtotal + taxAmount;

    const baseClasses = "p-4 sm:p-8 w-full h-full text-xs sm:text-sm";
    const templateStyles = {
        classic: `bg-white text-gray-800 font-sans`,
        modern: `bg-gray-900 text-white font-serif`,
        minimalist: `bg-white text-gray-600 font-light`
    };

    const headerStyles = {
        classic: 'border-b-2 border-gray-300 pb-4',
        modern: 'border-b-2 border-blue-400 pb-4',
        minimalist: 'text-center'
    };
    
    const tableHeaderStyles = {
        classic: 'bg-gray-200 text-gray-700',
        modern: 'bg-blue-500 text-white',
        minimalist: 'border-b-2 border-gray-400 font-normal'
    }

    return (
        <div className={`${baseClasses} ${templateStyles[template]}`}>
            <div className={`flex justify-between items-start ${headerStyles[template]}`}>
                <div>
                    {data.logo && <img src={data.logo} alt="Company Logo" className="h-12 sm:h-16 w-auto mb-4" />}
                    <h1 className="text-3xl sm:text-4xl font-bold">{data.title}</h1>
                </div>
                <div className="text-right">
                    <p><strong>Invoice #:</strong> {data.invoiceNo}</p>
                    <p><strong>Date:</strong> {data.invoiceDate}</p>
                    <p><strong>Due Date:</strong> {data.dueDate}</p>
                </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 my-8">
                <div>
                    <h2 className="font-bold mb-2">From:</h2>
                    <p className="font-semibold">{data.from.name}</p>
                    <p className="whitespace-pre-wrap">{data.from.address}</p>
                    <p>{data.from.email}</p>
                    <p>{data.from.phone}</p>
                    <p>{data.from.taxId}</p>
                </div>
                <div>
                    <h2 className="font-bold mb-2">To:</h2>
                    <p className="font-semibold">{data.to.name}</p>
                    <p className="whitespace-pre-wrap">{data.to.address}</p>
                    <p>{data.to.email}</p>
                    <p>{data.to.phone}</p>
                    <p>{data.to.taxId}</p>
                </div>
                {data.showShipping && (
                    <div>
                        <h2 className="font-bold mb-2">Ship To:</h2>
                        <p className="font-semibold">{data.shipTo.name}</p>
                        <p className="whitespace-pre-wrap">{data.shipTo.address}</p>
                    </div>
                )}
            </div>
            <table className="w-full text-left">
                <thead>
                    <tr className={tableHeaderStyles[template]}>
                        <th className="p-1 sm:p-2">Item</th><th className="p-1 sm:p-2">Qty</th><th className="p-1 sm:p-2">Rate</th><th className="p-1 sm:p-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map(item => (
                        <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                            <td className="p-1 sm:p-2 align-top">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                            </td>
                            <td className="p-1 sm:p-2 align-top">{item.quantity} {item.unit}</td>
                            <td className="p-1 sm:p-2 align-top">{formatCurrency(item.rate, data.currency.symbol)}</td>
                            <td className="p-1 sm:p-2 align-top">{formatCurrency(item.quantity * item.rate, data.currency.symbol)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-end mt-4 sm:mt-8">
                <div className="w-full md:w-1/2 lg:w-2/5">
                    <div className="space-y-2">
                        <div className="flex justify-between p-1 sm:p-2"><span>Subtotal</span><span>{formatCurrency(subtotal, data.currency.symbol)}</span></div>
                        {data.taxRate > 0 && <div className="flex justify-between p-1 sm:p-2"><span>Tax ({data.taxRate}%)</span><span>{formatCurrency(taxAmount, data.currency.symbol)}</span></div>}
                        <div className="flex justify-between font-bold text-lg sm:text-xl p-2 bg-gray-100 dark:bg-gray-800 rounded-lg"><span>Total</span><span>{formatCurrency(total, data.currency.symbol)}</span></div>
                    </div>
                </div>
            </div>
            <div className="mt-8">
                {data.notes && <div><h3 className="font-bold">Notes</h3><p>{data.notes}</p></div>}
                {data.terms && <div className="mt-4"><h3 className="font-bold">Terms</h3><p>{data.terms}</p></div>}
                {data.signature && <div className="mt-8"><h3 className="font-bold">Signature</h3><img src={data.signature} alt="Signature" className="h-16 w-auto" /></div>}
            </div>
        </div>
    );
};

// ===================================================================
// STEP COMPONENTS
// ===================================================================

const Step1Details: React.FC<{ data: InvoiceData, setData: React.Dispatch<React.SetStateAction<InvoiceData>> }> = ({ data, setData }) => {
    const [isTitleEditing, setIsTitleEditing] = useState(false);
    const [showDescription, setShowDescription] = useState<Record<number, boolean>>({});
    const [showTaxInput, setShowTaxInput] = useState(false);
    const titleInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isTitleEditing) titleInputRef.current?.focus();
    }, [isTitleEditing]);

    const handleItemChange = (id: number, field: keyof Item, value: any) => {
        setData(prev => ({ ...prev, items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item) }));
    };
    
    const addItem = () => setData(prev => ({ ...prev, items: [...prev.items, { id: Date.now(), name: '', description: '', unit: 'pcs', quantity: 1, rate: 0 }] }));
    const removeItem = (id: number) => setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
    const duplicateItem = (id: number) => {
        const itemToDuplicate = data.items.find(item => item.id === id);
        if(itemToDuplicate) setData(p => ({ ...p, items: [...p.items, {...itemToDuplicate, id: Date.now() }]}));
    };
    const toggleDescription = (id: number) => setShowDescription(p => ({...p, [id]: !p[id]}));
    
    const onSignatureDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => { setData(p => ({...p, signature: reader.result as string})) };
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, [setData]);

    const { getRootProps: getSignatureRootProps, getInputProps: getSignatureInputProps } = useDropzone({ onDrop: onSignatureDrop, accept: { 'image/*': [] } });

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = currencies.find(c => c.code === e.target.value) || currencies[0];
        setData(p => ({...p, currency: newCurrency}));
    };
    
    const subtotal = data.items.reduce((acc, item) => acc + item.quantity * item.rate, 0);
    const taxAmount = subtotal * (data.taxRate / 100);
    const total = subtotal + taxAmount;

    return (
        <div className="bg-white dark:bg-black p-4 sm:p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            {/* Header and top options */}
            <div className="flex flex-wrap justify-between items-center gap-4 pb-4 border-b dark:border-gray-700">
                 <div className="flex items-center gap-2">
                    {isTitleEditing ? (
                        <input ref={titleInputRef} value={data.title} onChange={e => setData(p => ({ ...p, title: e.target.value }))} onBlur={() => setIsTitleEditing(false)} className="text-3xl font-bold bg-gray-100 dark:bg-gray-800 focus:outline-none p-1 rounded" />
                    ) : (
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                    )}
                    <button onClick={() => setIsTitleEditing(true)}><EditIcon className="h-5 w-5 text-gray-400 hover:text-brand-red" /></button>
                </div>
                 <div><EditableField value={data.invoiceNo} onChange={val => setData(p => ({...p, invoiceNo: val}))} placeholder="Invoice #" className="text-right font-semibold" /></div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 my-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={data.showShipping} onChange={e => setData(p => ({...p, showShipping: e.target.checked}))} className="h-4 w-4 rounded" /> Add Shipping Details</label>
                <button onClick={() => setShowTaxInput(!showTaxInput)} className="text-sm font-semibold p-2 border rounded-md hover:border-brand-red">% Add TAX</button>
                {showTaxInput && <input type="number" value={data.taxRate} onChange={e => setData(p => ({...p, taxRate: parseFloat(e.target.value) || 0}))} className="p-2 border rounded-md w-24" placeholder="Tax %" />}
                <select value={data.currency.code} onChange={handleCurrencyChange} className="p-2 border rounded-md text-sm"><option value="" disabled>Currency</option>{currencies.map(c => <option key={c.code} value={c.code}>{c.name} ({c.symbol})</option>)}</select>
                <button disabled className="text-sm p-2 border rounded-md disabled:opacity-50">123 Number Format</button>
                <button disabled className="text-sm p-2 border rounded-md disabled:opacity-50">Edit Columns</button>
            </div>
            
            {/* From/To/Ship To section */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 my-6">
                <div>
                    <h2 className="font-bold mb-2">From</h2>
                    <EditableField value={data.from.name} onChange={val => setData(p => ({...p, from: {...p.from, name: val}}))} placeholder="Your Name/Company" />
                    <EditableField isTextarea value={data.from.address} onChange={val => setData(p => ({...p, from: {...p.from, address: val}}))} placeholder="Your Address" />
                    <EditableField type="email" value={data.from.email} onChange={val => setData(p => ({...p, from: {...p.from, email: val}}))} placeholder="Email Address" />
                    <EditableField type="tel" value={data.from.phone} onChange={val => setData(p => ({...p, from: {...p.from, phone: val}}))} placeholder="Phone Number" />
                    <EditableField value={data.from.taxId} onChange={val => setData(p => ({...p, from: {...p.from, taxId: val}}))} placeholder="PAN / Tax ID" />
                </div>
                <div>
                    <h2 className="font-bold mb-2">To</h2>
                    <EditableField value={data.to.name} onChange={val => setData(p => ({...p, to: {...p.to, name: val}}))} placeholder="Client Name/Company" />
                    <EditableField isTextarea value={data.to.address} onChange={val => setData(p => ({...p, to: {...p.to, address: val}}))} placeholder="Client Address" />
                    <EditableField type="email" value={data.to.email} onChange={val => setData(p => ({...p, to: {...p.to, email: val}}))} placeholder="Email Address" />
                    <EditableField type="tel" value={data.to.phone} onChange={val => setData(p => ({...p, to: {...p.to, phone: val}}))} placeholder="Phone Number" />
                    <EditableField value={data.to.taxId} onChange={val => setData(p => ({...p, to: {...p.to, taxId: val}}))} placeholder="PAN / Tax ID" />
                </div>
                 {data.showShipping && (
                    <div>
                        <h2 className="font-bold mb-2">Ship To</h2>
                        <EditableField value={data.shipTo.name} onChange={val => setData(p => ({...p, shipTo: {...p.shipTo, name: val}}))} placeholder="Shipping Name" />
                        <EditableField isTextarea value={data.shipTo.address} onChange={val => setData(p => ({...p, shipTo: {...p.shipTo, address: val}}))} placeholder="Shipping Address" />
                    </div>
                 )}
            </div>

            {/* Items Section */}
            <div>
                <div className="bg-purple-600 text-white p-3 rounded-t-lg grid grid-cols-12 gap-2 font-semibold">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Rate</div>
                    <div className="col-span-3">Amount</div>
                </div>
                <div className="border border-t-0 rounded-b-lg p-2 dark:border-gray-700">
                    {data.items.map(item => (
                        <div key={item.id} className="py-2 border-b dark:border-gray-700 last:border-b-0">
                             <div className="grid grid-cols-12 gap-2 items-start">
                                <div className="col-span-5"><EditableField value={item.name} onChange={val => handleItemChange(item.id, 'name', val)} placeholder="Item Name" /></div>
                                <div className="col-span-2"><EditableField type="number" value={String(item.quantity)} onChange={val => handleItemChange(item.id, 'quantity', Number(val))} placeholder="1" /></div>
                                <div className="col-span-2"><EditableField type="number" value={String(item.rate)} onChange={val => handleItemChange(item.id, 'rate', Number(val))} placeholder="0.00" /></div>
                                <div className="col-span-2 p-1 font-semibold text-sm">{formatCurrency(item.quantity * item.rate, data.currency.symbol)}</div>
                                <div className="col-span-1 flex justify-end"><button onClick={() => removeItem(item.id)}><TrashIcon className="h-5 w-5 text-gray-400 hover:text-red-500" /></button></div>
                            </div>
                            {showDescription[item.id] && <div className="mt-1 ml-2"><EditableField isTextarea value={item.description} onChange={val => handleItemChange(item.id, 'description', val)} placeholder="Item Description" /></div>}
                             <div className="mt-2 flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4 text-purple-600">
                                    <button onClick={() => toggleDescription(item.id)}>+ Add Description</button>
                                    <button disabled className="disabled:opacity-50">+ Add Thumbnail</button>
                                    <select value={item.unit} onChange={e => handleItemChange(item.id, 'unit', e.target.value)} className="bg-transparent font-semibold">
                                        <option>Service</option><option>hrs</option><option>pcs</option><option>item</option>
                                    </select>
                                </div>
                                <button onClick={() => duplicateItem(item.id)} className="text-purple-600 font-semibold">Duplicate</button>
                            </div>
                        </div>
                    ))}
                     <button onClick={addItem} className="mt-2 flex items-center gap-2 text-brand-red font-semibold"><PlusIcon className="h-5 w-5"/> Add Item</button>
                </div>
            </div>
            
            <div className="flex justify-end mt-6">
                <div className="w-full md:w-1/2 lg:w-2/5">
                    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                        <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal, data.currency.symbol)}</span></div>
                        {data.taxRate > 0 && <div className="flex justify-between"><span>Tax ({data.taxRate}%)</span><span>{formatCurrency(taxAmount, data.currency.symbol)}</span></div>}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t dark:border-gray-700"><span>Total</span><span>{formatCurrency(total, data.currency.symbol)}</span></div>
                    </div>
                </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                    <h2 className="font-bold mb-2">Signature</h2>
                     <div {...getSignatureRootProps()} className="cursor-pointer">
                        <input {...getSignatureInputProps()} />
                        {data.signature ? (
                            <img src={data.signature} alt="Signature" className="h-16 w-auto" />
                        ) : (
                            <div className="p-4 border-2 border-dashed rounded text-center text-gray-500 hover:border-brand-red flex flex-col items-center gap-2"><UploadIcon className="h-6 w-6"/> Upload Signature</div>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="font-bold mb-2">Notes</h2>
                    <EditableField isTextarea value={data.notes} onChange={val => setData(p => ({...p, notes: val}))} />
                </div>
            </div>
        </div>
    );
};

const Step2Templates: React.FC<{ data: InvoiceData, setTemplate: (t: Template) => void, selectedTemplate: Template }> = ({ data, setTemplate, selectedTemplate }) => (
    <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold">Choose a Template</h2>
            {['classic', 'modern', 'minimalist'].map(t => (
                <button key={t} onClick={() => setTemplate(t as Template)} className={`w-full p-4 border-2 rounded-lg transition-colors text-left ${selectedTemplate === t ? 'border-brand-red font-bold' : 'border-gray-300 dark:border-gray-700'}`}>
                    {t.charAt(0).toUpperCase() + t.slice(1)} Template
                </button>
            ))}
        </div>
        <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg flex justify-center items-start">
            <div className="w-full max-w-3xl overflow-auto transform sm:scale-[0.9] origin-top">
                <div className="aspect-[210/297]">
                    <TemplatePreview data={data} template={selectedTemplate} />
                </div>
            </div>
        </div>
    </div>
);

const Step3Share: React.FC<{ data: InvoiceData, template: Template }> = ({ data, template }) => {
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'png' | null>(null);

    const generateFile = async (format: 'pdf' | 'png'): Promise<Blob> => {
        const element = invoiceRef.current;
        if (!element) throw new Error("Preview element not found");
        const canvas = await html2canvas(element, { scale: 3 });
        if (format === 'png') {
            return new Promise(resolve => canvas.toBlob(blob => resolve(blob!), 'image/png'));
        } else {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            return pdf.output('blob');
        }
    };

    const handleDownloadClick = async () => {
        if (!downloadFormat) return;
        const blob = await generateFile(downloadFormat);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${data.invoiceNo}.${downloadFormat}`;
        a.click();
        URL.revokeObjectURL(url);
        setDownloadFormat(null);
    };
    
    const handlePrint = async () => {
        const element = invoiceRef.current;
        if (!element) return;
        const canvas = await html2canvas(element, { scale: 3 });
        const imgData = canvas.toDataURL('image/png');
        
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Invoice</title><style>@page { size: A4; margin: 0; } body { margin: 0; } img { width: 100%; }</style></head><body>');
            printWindow.document.write(`<img src="${imgData}" />`);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.onload = () => {
                 printWindow.print();
                 printWindow.close();
            };
        }
    };
    
    const handleShare = async (platform: 'gmail' | 'whatsapp' | 'generic') => {
        const pdfBlob = await generateFile('pdf');
        const file = new File([pdfBlob], `invoice-${data.invoiceNo}.pdf`, { type: 'application/pdf' });
        const text = `Here is the invoice #${data.invoiceNo}.`;
        const url = window.location.href;

        if (platform === 'generic' && navigator.share) {
            try {
                await navigator.share({ files: [file], title: `Invoice ${data.invoiceNo}`, text });
            } catch (error) { console.error('Share failed:', error); }
        } else if (platform === 'whatsapp') {
            window.open(`https://wa.me/?text=${encodeURIComponent(`${text} - ${url}`)}`, '_blank');
        } else if (platform === 'gmail') {
             window.open(`mailto:?subject=${encodeURIComponent(`Invoice ${data.invoiceNo}`)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`, '_blank');
        }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
                <h2 className="text-2xl font-bold">Design & Share</h2>
                <div className="space-y-2">
                    <button onClick={() => setDownloadFormat(p => p ? null : 'pdf')} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex justify-center items-center gap-2"><DownloadIcon className="h-5 w-5"/> Download</button>
                    {downloadFormat && (
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex flex-col gap-2 animate-fade-in-down">
                            <div className="flex gap-2">
                                <button onClick={() => setDownloadFormat('pdf')} className={`flex-1 p-2 rounded text-sm font-semibold ${downloadFormat === 'pdf' ? 'bg-gray-400 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>PDF</button>
                                <button onClick={() => setDownloadFormat('png')} className={`flex-1 p-2 rounded text-sm font-semibold ${downloadFormat === 'png' ? 'bg-gray-400 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>PNG</button>
                            </div>
                            <button onClick={handleDownloadClick} className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-sm font-semibold">Confirm Download</button>
                        </div>
                    )}
                    <button onClick={handlePrint} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg flex justify-center items-center gap-2"><PrintIcon className="h-5 w-5"/> Print Invoice</button>
                </div>
                <div className="pt-4 border-t dark:border-gray-700">
                    <h3 className="font-semibold mb-2 text-center">Share via</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleShare('gmail')} className="flex items-center justify-center gap-2 p-2 bg-red-100 text-red-700 rounded-lg"><GmailIcon className="h-5 w-5"/> Gmail</button>
                        <button onClick={() => handleShare('whatsapp')} className="flex items-center justify-center gap-2 p-2 bg-green-100 text-green-700 rounded-lg"><WhatsAppIcon className="h-5 w-5"/> WhatsApp</button>
                        <button onClick={() => handleShare('generic')} className="col-span-2 flex items-center justify-center gap-2 p-2 bg-gray-200 text-gray-700 rounded-lg"><ShareIcon className="h-5 w-5"/> More Options</button>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg flex justify-center items-start">
                <div className="w-full max-w-3xl overflow-auto">
                    <div id="invoice-print-area" ref={invoiceRef} className="aspect-[210/297]">
                        <TemplatePreview data={data} template={template} />
                    </div>
                </div>
            </div>
        </div>
    );
};


const FeatureCard: React.FC<{ icon: React.FC<any>, title: string, text: string }> = ({ icon: Icon, title, text }) => (
    <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-md text-center border-glow-hover">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
            <Icon className="h-7 w-7 text-brand-red" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{text}</p>
    </div>
);

const FaqItem: React.FC<{ item: { q: string, a: string }, isOpen: boolean, toggle: () => void }> = ({ item, isOpen, toggle }) => (
    <div className="border-t border-gray-200 dark:border-gray-700">
        <button onClick={toggle} className="w-full flex justify-between items-center text-left py-4 focus:outline-none">
            <span className="text-base font-semibold">{item.q}</span>
            <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed pr-4">{item.a}</p>
        </div>
    </div>
);


// ===================================================================
// MAIN PAGE COMPONENT
// ===================================================================

const InvoiceGeneratorPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [invoiceData, setInvoiceData] = useState<InvoiceData>(initialInvoiceData);
    const [template, setTemplate] = useState<Template>('classic');
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const generatorRef = useRef<HTMLDivElement>(null);
    
    const scrollToGenerator = () => {
        generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const restoredDataString = location.state?.restoredData;
        if (restoredDataString) {
            setInvoiceData(restoredDataString);
            setStep(2);
            // Clear location state to prevent re-triggering
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]);

    const handleNextStep = () => {
        if (step === 1 && !user) {
            localStorage.setItem('pendingInvoiceData', JSON.stringify(invoiceData));
            navigate('/login', { state: { from: '/invoice-generator' } });
        } else {
            setStep(s => Math.min(s + 1, 3));
        }
    };
    const handlePrevStep = () => setStep(s => Math.max(s - 1, 1));
    
    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Details data={invoiceData} setData={setInvoiceData} />;
            case 2: return <Step2Templates data={invoiceData} setTemplate={setTemplate} selectedTemplate={template} />;
            case 3: return <Step3Share data={invoiceData} template={template} />;
            default: return null;
        }
    };

    const features = [
        { icon: StarIcon, title: "Completely Free", text: "Create, customize, and download unlimited invoices without any cost." },
        { icon: GridIcon, title: "Multiple Templates", text: "Choose from classic, modern, and minimalist designs to match your brand." },
        { icon: EditIcon, title: "Easy Customization", text: "Add your logo, edit all fields, and tailor the invoice to your specific needs." },
        { icon: DollarIcon, title: "Multi-Currency Support", text: "Bill clients in their local currency with our extensive currency options." },
        { icon: DownloadIcon, title: "Instant Downloads", text: "Get your final invoice as a professional PDF or a high-quality PNG image." },
        { icon: LockIcon, title: "Secure & Private", text: "Your invoice data is processed in your browser and is never stored on our servers." }
    ];

    const faqs = [
        { q: "What is an invoice?", a: "An invoice is a commercial document issued by a seller to a buyer, detailing a transaction and indicating the products, quantities, and agreed prices for products or services the seller has provided. It serves as a request for payment and is a crucial tool for business accounting and record-keeping." },
        { q: "Is the invoice generator really free?", a: "Yes, it is 100% free to create and download unlimited invoices. No watermarks, no hidden fees." },
        { q: "Can I save my invoice to edit later?", a: "To save your progress and access invoices from any device, you need to sign up for a free ILovePDFLY account. This allows us to securely save your data." },
        { q: "Is my invoice data saved on your servers?", a: "No. For your privacy, all invoice creation and data processing happens directly in your browser. We do not see or store your financial data unless you are logged in and choose to save it." },
        { q: "Can I add my company logo?", a: "Absolutely! You can upload your company logo in the 'From' section. It will automatically appear on your invoice." },
        { q: "What formats can I download my invoice in?", a: "You can download your final invoice as a universally compatible PDF file or as a high-resolution PNG image." }
    ];

    return (
        <div className="bg-white dark:bg-black overflow-x-hidden">
            {/* Hero Section */}
            <section className="py-20 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 dark:text-gray-100">
                                Free Invoice Generator
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                                Create professional invoices in seconds. Customize with your logo, add items, and download as a PDF for free. Simple, fast, and no sign-up required to create.
                            </p>
                            <div className="mt-8">
                                <button onClick={scrollToGenerator} className="inline-block bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
                                    Create Invoice Now
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <img src="https://ik.imagekit.io/fonepay/Invoice-Template.png?updatedAt=1753101972128" alt="A preview of a professional invoice template" className="rounded-lg shadow-xl" />
                        </div>
                    </div>
                </div>
            </section>
            
            <div ref={generatorRef} className="bg-gray-50 dark:bg-black py-16 min-h-screen scroll-mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-8">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Create Your Invoice</h2>
                        <div className="flex gap-2">
                            {step > 1 && <button onClick={handlePrevStep} className="bg-gray-200 dark:bg-gray-700 font-semibold py-2 px-4 rounded-lg">Back</button>}
                            {step < 3 && <button onClick={handleNextStep} className="bg-brand-red text-white font-semibold py-2 px-4 rounded-lg">{step === 1 && !user ? 'Login to Continue' : 'Next'}</button>}
                        </div>
                    </div>
                    {renderStep()}
                </div>
            </div>

            {/* Features Section */}
            <section className="py-20 md:py-24 bg-white dark:bg-black">
                <div className="container mx-auto px-6">
                     <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">Powerful Features, Zero Cost</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Everything you need to create professional invoices for your business.</p>
                    </div>
                    <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => <FeatureCard key={i} {...feature} />)}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-gray-50 dark:bg-black py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">Frequently Asked Questions</h2>
                    </div>
                    <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-black p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800">
                        {faqs.map((faq, index) => (
                            <FaqItem 
                                key={index} 
                                item={faq}
                                isOpen={openFaq === index}
                                toggle={() => setOpenFaq(openFaq === index ? null : index)}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default InvoiceGeneratorPage;