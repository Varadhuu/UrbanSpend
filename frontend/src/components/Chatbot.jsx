import React, { useState, useRef, useEffect } from 'react';
import { fetchChatResponse } from '../api';
import { MessageSquare, Send, User, Bot } from 'lucide-react';

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hi! I am the UrbanSpend AI advisor. Ask me anything about opening a business (e.g., "Is a cafe in Velachery profitable?").' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);

        try {
            const data = await fetchChatResponse(userMsg);
            setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to the AI advisor...' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white dark:border-slate-700/50 flex flex-col overflow-hidden h-[450px] transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 hover:-translate-y-1 relative group cursor-default">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 flex items-center gap-3 shadow-sm z-10">
                <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-sm">
                    <MessageSquare className="text-white w-4 h-4" />
                </div>
                <h3 className="text-white font-semibold">Business Advisor AI</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                        <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className="flex items-center gap-1 mb-1 opacity-60 text-xs">
                                {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                                {msg.role === 'user' ? 'You' : 'AI'}
                            </div>
                            <div className={`p-3 rounded-2xl text-sm shadow-sm ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="mr-auto inline-flex items-center gap-1 opacity-50 text-xs p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-bl-none shadow-sm">
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
                <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-1.5 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about a location..."
                        className="flex-1 bg-transparent border-none outline-none text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 hover:scale-105 active:scale-95 disabled:hover:scale-100"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
}
