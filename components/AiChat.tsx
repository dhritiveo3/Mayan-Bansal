
import React, { useState, useRef, useEffect, SVGProps } from 'react';
import { getChatResponse, analyzeImage, startLiveSession, createBlob, decode, decodeAudioData } from '../services/geminiService';
import type { ChatMessage, Lead } from '../types';
// FIX: Removed non-exported LiveSession type
import type { LiveServerMessage } from '@google/genai';

const PaperAirplaneIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" /></svg>);
const MicrophoneIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" /></svg>);
const StopCircleIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z" /></svg>);
const PaperClipIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 1 1 18.374 9.5l-7.693 7.693a1.125 1.125 0 0 1-1.591-1.591l7.693-7.693Z" /></svg>);
const PlusIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>);
const CalendarIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" /></svg>);
const MagnifyingGlassIcon = (props: SVGProps<SVGSVGElement>) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>);

interface AiChatProps {
    addLead: (leadData: Partial<Omit<Lead, 'id' | 'added' | 'status'>>) => void;
    onAddLeadClick: () => void;
}

export default function AiChat({ addLead, onAddLeadClick }: AiChatProps): React.ReactElement {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: 1, sender: 'ai', text: 'Hello! How can I help you with your leads today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<{ file: File, base64: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);


    // Live API state
    const [isListening, setIsListening] = useState(false);
    // FIX: Changed LiveSession to any
    const sessionRef = useRef<any | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() && !uploadedImage) return;

        const userMessage: ChatMessage = {
            id: Date.now(),
            sender: 'user',
            text: input,
            ...(uploadedImage && { image: uploadedImage.base64 })
        };

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setUploadedImage(null);
        setIsLoading(true);

        try {
            let responseText = '';
            if (uploadedImage) {
                responseText = await analyzeImage(currentInput, uploadedImage.base64, uploadedImage.file.type);
            } else {
                if (currentInput.toLowerCase().includes("add lead")) {
                    const nameMatch = currentInput.match(/add lead\s*(?:for|named?)\s*([a-z\s\d]+)/i);
                    if (nameMatch && nameMatch[1]) {
                        const name = nameMatch[1].trim().replace(/\b\w/g, l => l.toUpperCase());
                        addLead({ name, email: '', phone: '', value: 0 });
                        responseText = `Lead for "${name}" has been successfully added.`;
                    } else {
                         responseText = await getChatResponse(messages, currentInput);
                    }
                } else {
                    responseText = await getChatResponse(messages, currentInput);
                }
            }
            const aiMessage: ChatMessage = { id: Date.now() + 1, sender: 'ai', text: responseText };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error communicating with AI:", error);
            const errorMessage: ChatMessage = { id: Date.now() + 1, sender: 'ai', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage({ file, base64: (reader.result as string).split(',')[1] });
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    };
    
    const handleMicClick = async () => {
        if (isListening) {
            if (sessionRef.current) {
                sessionRef.current.close();
                sessionRef.current = null;
            }
            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach(track => track.stop());
                mediaStreamRef.current = null;
            }
            if (scriptProcessorRef.current) {
                scriptProcessorRef.current.disconnect();
                scriptProcessorRef.current = null;
            }
            if(inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
                inputAudioContextRef.current.close();
            }
            if(outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
                outputAudioContextRef.current.close();
            }
            setIsListening(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaStreamRef.current = stream;
                setIsListening(true);

                inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
                outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                nextStartTimeRef.current = 0;

                // FIX: Changed LiveSession to any
                const onOpen = (sessionPromise: Promise<any>) => {
                    const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                    const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current = scriptProcessor;

                    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                        const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then((session) => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inputAudioContextRef.current!.destination);
                };
                
                const onMessage = async (message: LiveServerMessage) => {
                    if (message.serverContent?.outputTranscription) {
                        setMessages(prev => {
                            const last = prev[prev.length -1];
                            const text = message.serverContent.outputTranscription.text;
                            if(last.sender === 'ai' && !last.text.endsWith('.') && !last.text.endsWith('?') && !last.text.endsWith('!')) {
                                return [...prev.slice(0, -1), {...last, text: last.text + text}]
                            }
                            return [...prev, {id: Date.now() + Math.random(), sender: 'ai', text: text}]
                        });
                    }
                     if (message.serverContent?.inputTranscription) {
                         setInput(prev => prev + message.serverContent.inputTranscription.text);
                    }
                     if (message.serverContent?.turnComplete) {
                        setInput('');
                     }

                    const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                    if (audio) {
                        const outputAudioContext = outputAudioContextRef.current!;
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                        const audioBuffer = await decodeAudioData(decode(audio), outputAudioContext, 24000, 1);
                        const source = outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputAudioContext.destination);
                        source.addEventListener('ended', () => { audioSourcesRef.current.delete(source); });
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += audioBuffer.duration;
                        audioSourcesRef.current.add(source);
                    }
                };

                const onError = (e: ErrorEvent) => {
                    console.error('Live session error:', e);
                    handleMicClick();
                };
                const onClose = () => { console.log('Live session closed'); };
                
                startLiveSession(onMessage, onError, onClose, onOpen).then(session => {
                    sessionRef.current = session;
                });

            } catch (err) {
                console.error("Error starting microphone:", err);
                setIsListening(false);
            }
        }
    };
    
    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
        inputRef.current?.focus();
    }


    return (
        <div className="bg-slate-800 p-6 rounded-xl flex flex-col h-[550px] lg:h-auto">
            <h3 className="text-xl font-bold text-white mb-4">AI Chat</h3>
            <div className="flex-1 overflow-y-auto pr-4 space-y-4 mb-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 self-start"></div>}
                        <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl break-words ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-300 rounded-bl-none'}`}>
                            {msg.image && <img src={`data:image/jpeg;base64,${msg.image}`} alt="uploaded content" className="rounded-lg mb-2 max-h-40" />}
                            <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && <div className="flex justify-start gap-3"><div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0"></div><div className="p-3 rounded-xl bg-slate-700 text-slate-300 rounded-bl-none"><span className="animate-pulse">Thinking...</span></div></div>}
                <div ref={messagesEndRef} />
            </div>
            {uploadedImage && (
                <div className="p-2 bg-slate-700 rounded-lg mb-2 flex items-center justify-between animate-fade-in">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <img src={`data:image/jpeg;base64,${uploadedImage.base64}`} alt="preview" className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                        <span className="text-sm text-slate-400 truncate">{uploadedImage.file.name}</span>
                    </div>
                    <button onClick={() => setUploadedImage(null)} className="text-slate-500 hover:text-white flex-shrink-0 ml-2 p-1">&times;</button>
                </div>
            )}
            <div className="pt-4 border-t border-slate-700">
                 <div className="flex items-center gap-2 mb-3">
                    <button onClick={onAddLeadClick} className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors"><PlusIcon className="w-4 h-4"/> Add Lead</button>
                    <button onClick={() => handleQuickAction('Show my follow-ups for today')} className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors"><CalendarIcon className="w-4 h-4"/> Follow-ups</button>
                    <button onClick={() => handleQuickAction('Search for lead: ')} className="flex items-center gap-2 text-sm px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors"><MagnifyingGlassIcon className="w-4 h-4"/> Search</button>
                </div>
                <div className="flex items-center gap-2 bg-slate-700 rounded-lg p-2">
                    <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()} placeholder="Ask AI: Add lead, find follow-ups, get summary..." className="w-full bg-transparent focus:outline-none text-slate-300 placeholder-slate-500" />
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full hover:bg-slate-600 text-slate-400 transition-colors" aria-label="Attach file"><PaperClipIcon className="w-5 h-5"/></button>
                    <button onClick={handleSend} disabled={isLoading || (!input.trim() && !uploadedImage)} className="p-2 rounded-full bg-slate-600 hover:bg-slate-500 text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Send message"><PaperAirplaneIcon className="w-5 h-5"/></button>
                    <button onClick={handleMicClick} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white hover:bg-green-600'}`} aria-label={isListening ? 'Stop listening' : 'Start listening'}>
                        {isListening ? <StopCircleIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}