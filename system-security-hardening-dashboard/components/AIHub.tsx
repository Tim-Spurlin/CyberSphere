import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types';
import { ChatMessageAuthor, ChatMessageType } from '../types';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { generateChatResponse } from '../services/geminiService';
import { SparklesIcon, MicrophoneIcon, PaperClipIcon, StopIcon, PaperAirplaneIcon, SpinnerIcon, PhotoIcon, SpeakerWaveIcon, XMarkIcon } from './icons';

declare global {
    interface Window {
        mermaid: any;
    }
}

// Utility to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const fileToText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const MermaidRenderer: React.FC<{ code: string }> = ({ code }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ref.current) {
            ref.current.innerHTML = code;
            window.mermaid.run({ nodes: [ref.current] });
        }
    }, [code]);
    return <div ref={ref} className="mermaid">{code}</div>;
};


const AIHub: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 'intro', author: ChatMessageAuthor.AI, type: ChatMessageType.TEXT, textContent: "Welcome to the AI Hub. How can I assist you today? You can ask me questions, upload images, or provide files for analysis." }
    ]);
    const [input, setInput] = useState('');
    const [attachedFile, setAttachedFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);
    const { isRecording, startRecording, stopRecording, audioUrl, resetRecording } = useVoiceRecorder();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        window.mermaid.initialize({ startOnLoad: false, theme: 'dark', darkMode: true,  
            themeVariables: {
            background: '#121216',
            primaryColor: '#1a1d21',
            primaryTextColor: '#f3f4f6',
            lineColor: '#6d28d9',
            secondaryColor: '#40464f',
            tertiaryColor: '#2e333a',
          }
        });
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (audioUrl) {
            const newMessage: ChatMessage = {
                id: `audio-${Date.now()}`,
                author: ChatMessageAuthor.USER,
                type: ChatMessageType.AUDIO,
                mediaUrl: audioUrl,
                mediaType: 'audio/webm',
            };
            setMessages(prev => [...prev, newMessage, {id: 'audio-note', author: ChatMessageAuthor.SYSTEM, type: ChatMessageType.TEXT, textContent: "Voice recording captured. AI audio transcription is not yet available. Please provide a text description of the audio."}]);
            resetRecording();
        }
    }, [audioUrl, resetRecording]);

    const handleSend = useCallback(async () => {
        const textToSend = input.trim();
        const fileToSend = attachedFile;

        if (!textToSend && !fileToSend) return;

        setIsSending(true);
        setInput('');
        setAttachedFile(null);

        // Add user message(s) to chat
        const userMessages: ChatMessage[] = [];
        if (fileToSend) {
            const isImage = fileToSend.type.startsWith('image/');
            userMessages.push({
                id: `file-${Date.now()}`,
                author: ChatMessageAuthor.USER,
                type: isImage ? ChatMessageType.IMAGE : ChatMessageType.FILE,
                mediaUrl: URL.createObjectURL(fileToSend),
                mediaType: fileToSend.type,
                fileName: fileToSend.name,
                textContent: isImage ? textToSend : undefined,
            });
            if(!isImage) {
                 userMessages.push({ id: `file-text-${Date.now()}`, author: ChatMessageAuthor.USER, type: ChatMessageType.TEXT, textContent: textToSend });
            }
        } else if (textToSend) {
            userMessages.push({ id: `text-${Date.now()}`, author: ChatMessageAuthor.USER, type: ChatMessageType.TEXT, textContent: textToSend });
        }
        
        setMessages(prev => [...prev, ...userMessages]);
        
        const loadingMessageId = `loading-${Date.now()}`;
        setMessages(prev => [...prev, { id: loadingMessageId, author: ChatMessageAuthor.AI, type: ChatMessageType.TEXT, isLoading: true }]);

        try {
            let imageBase64: string | undefined;
            let imageMimeType: string | undefined;
            let promptText = textToSend;

            if (fileToSend) {
                if (fileToSend.type.startsWith('image/')) {
                    imageBase64 = await fileToBase64(fileToSend);
                    imageMimeType = fileToSend.type;
                } else {
                    const fileContent = await fileToText(fileToSend);
                    promptText = `File: ${fileToSend.name}\n\nContent:\n${fileContent}\n\n---\n\n${textToSend}`;
                }
            }

            const aiResponse = await generateChatResponse(promptText, imageBase64, imageMimeType);
            
            setMessages(prev => prev.map(msg => msg.id === loadingMessageId ? { ...msg, textContent: aiResponse, isLoading: false } : msg));

        } catch (error) {
            console.error("Failed to get AI response:", error);
             setMessages(prev => prev.map(msg => msg.id === loadingMessageId ? { ...msg, textContent: "An error occurred. Please check the console.", isLoading: false } : msg));
        } finally {
            setIsSending(false);
        }
    }, [input, attachedFile]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAttachedFile(e.target.files[0]);
        }
    };
    
    const handleSpeak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="h-full flex flex-col bg-gray-950 starfield">
            <header className="p-4 border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm">
                <h1 className="text-xl font-bold text-gray-100 flex items-center"><SparklesIcon className="w-6 h-6 mr-2 text-purple-400" /> AI Hub</h1>
                <p className="text-sm text-gray-400">Your intelligent assistant for analysis and generation.</p>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => {
                    const isUser = msg.author === ChatMessageAuthor.USER;
                    const isSystem = msg.author === ChatMessageAuthor.SYSTEM;
                    
                    if (isSystem) {
                        return <div key={msg.id} className="text-center text-xs text-gray-500 py-2">{msg.textContent}</div>
                    }

                    const mermaidMatch = msg.textContent?.match(/```mermaid\n([\s\S]+?)```/);

                    return (
                        <div key={msg.id} className={`flex items-end gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 ${isUser ? 'bg-purple-600' : 'bg-gray-700'}`}></div>
                            <div className={`p-4 rounded-2xl max-w-xl xl:max-w-3xl prose prose-sm prose-invert ${isUser ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                {msg.isLoading && <SpinnerIcon className="w-6 h-6 text-gray-400 animate-spin" />}
                                {msg.type === ChatMessageType.AUDIO && <audio controls src={msg.mediaUrl} className="w-full" />}
                                {msg.type === ChatMessageType.IMAGE && msg.mediaUrl && <img src={msg.mediaUrl} alt={msg.fileName || 'uploaded image'} className="rounded-lg max-w-xs" />}
                                {msg.type === ChatMessageType.FILE && <div className="text-gray-300">File attached: {msg.fileName}</div>}
                                {msg.textContent && !mermaidMatch && <p>{msg.textContent}</p>}
                                {mermaidMatch && <MermaidRenderer code={mermaidMatch[1]} />}
                                {!isUser && !msg.isLoading && msg.textContent && (
                                    <button onClick={() => handleSpeak(msg.textContent!)} className="mt-2 text-gray-400 hover:text-purple-400 transition-colors">
                                        <SpeakerWaveIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                 <div ref={chatEndRef}></div>
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-950/80 backdrop-blur-sm">
                {attachedFile && (
                    <div className="mb-2 p-2 bg-gray-800 rounded-lg flex justify-between items-center text-sm">
                        <span className="text-gray-300 truncate">{attachedFile.name}</span>
                        <button onClick={() => setAttachedFile(null)} className="text-gray-500 hover:text-red-400"><XMarkIcon className="w-4 h-4"/></button>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-purple-400 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                        {attachedFile ? <PhotoIcon className="w-6 h-6 text-purple-400" /> : <PaperClipIcon className="w-6 h-6" />}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,text/plain,text/markdown,.js,.py,.html,.css,.json" />
                    
                    <button onClick={isRecording ? stopRecording : startRecording} className={`p-2 text-white rounded-full transition-colors ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-800 hover:bg-gray-700'}`}>
                        {isRecording ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
                    </button>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                        placeholder={isRecording ? "Recording..." : "Ask the AI..."}
                        className="flex-1 bg-gray-800 border-gray-700 rounded-lg p-3 resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                        rows={1}
                        disabled={isSending || isRecording}
                    />
                    
                    <button onClick={handleSend} disabled={isSending || (!input.trim() && !attachedFile)} className="p-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 transition-colors">
                        <PaperAirplaneIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIHub;