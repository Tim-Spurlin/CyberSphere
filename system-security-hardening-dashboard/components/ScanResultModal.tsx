import React, { useState, useCallback } from 'react';
import type { Check } from '../types';
import { CheckStatus } from '../types';
import { getRemediationInfo } from '../services/geminiService';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, SparklesIcon, SpinnerIcon } from './icons';

interface ScanResultModalProps {
  check: Check;
  onClose: () => void;
}

const statusStyles = {
    [CheckStatus.PASS]: {
        icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
        text: 'text-green-400',
        bg: 'bg-green-500/10',
        name: 'Passed'
    },
    [CheckStatus.WARN]: {
        icon: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />,
        text: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        name: 'Warning'
    },
    [CheckStatus.FAIL]: {
        icon: <XCircleIcon className="w-6 h-6 text-red-400" />,
        text: 'text-red-400',
        bg: 'bg-red-500/10',
        name: 'Failed'
    },
    [CheckStatus.PENDING]: { icon: null, text: '', bg: '', name: 'Pending' },
    [CheckStatus.RUNNING]: { icon: null, text: '', bg: '', name: 'Running' }
}

const ScanResultModal: React.FC<ScanResultModalProps> = ({ check, onClose }) => {
  const [aiDetails, setAiDetails] = useState(check.details || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchDetails = useCallback(async () => {
    if(isLoading) return;
    setIsLoading(true);
    try {
        const details = await getRemediationInfo(check.title, check.description);
        setAiDetails(details);
    } catch(error) {
        console.error("Failed to fetch remediation info:", error);
        setAiDetails("An error occurred while fetching AI-powered advice. Please check your API key and network connection.");
    } finally {
        setIsLoading(false);
    }
  }, [check, isLoading]);
  
  const style = statusStyles[check.status];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {style?.icon}
                    <div>
                        <h2 className={`text-xl font-bold ${style?.text}`}>{style?.name}: {check.title}</h2>
                    </div>
                </div>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-200 transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
                <div>
                    <h3 className="font-semibold text-gray-300 mb-1">Description</h3>
                    <p className="text-gray-400">{check.description}</p>
                </div>
                
                <div className={`p-4 rounded-lg ${style?.bg}`}>
                    <h3 className="font-semibold text-gray-200 mb-2">AI-Powered Remediation</h3>
                    {aiDetails ? (
                        <div className="prose prose-sm prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: aiDetails.replace(/\n/g, '<br />').replace(/```bash\n/g, '<pre class="bg-gray-900/50 p-3 rounded-md text-sm">').replace(/```\n/g, '</pre>') }} />
                    ) : (
                        <div className="text-center p-4 space-y-3">
                            <p className="text-gray-400">Get a detailed explanation and step-by-step remediation advice for this issue.</p>
                            <button
                                onClick={handleFetchDetails}
                                disabled={isLoading}
                                className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5 mr-2" />
                                        Get AI Advice
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>

             <div className="p-4 bg-gray-950/50 border-t border-gray-800 text-right">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-800 text-gray-200 font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
            </div>
        </div>
    </div>
  );
};

export default ScanResultModal;
