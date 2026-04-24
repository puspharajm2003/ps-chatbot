import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3, Briefcase, Check, ChevronDown, Code, Command, CreditCard, FileCode, Image as ImageIcon,
  Maximize2, Menu, Send, Settings, Smile, Sparkles, User, Video, Wand2, Crown, LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsageStats, recordUsageEvent } from './accountData';
import './App.css';

const MODELS = [
  { id: 'google/gemma-2-9b-it:free', name: 'PS Standard Intelligence' },
  { id: 'meta-llama/llama-3.1-8b-instruct:free', name: 'PS Advanced Intelligence' },
  { id: 'ps-core', name: 'PS Core v2' },
  { id: 'ps-vision', name: 'PS Vision (Images)' },
  { id: 'ps-motion', name: 'PS Motion (Video)' },
];

const PERSONALITIES = [
  { id: 'professional', name: 'Professional', icon: Briefcase },
  { id: 'creative', name: 'Creative', icon: Sparkles },
  { id: 'luxurious', name: 'Luxurious', icon: Crown },
  { id: 'humorous', name: 'Humorous', icon: Smile },
];

export default function Chat({ auth }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [personalityDropdownOpen, setPersonalityDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openRouterKey] = useState(auth?.api_key || localStorage.getItem('openRouterKey') || '');
  const [toolsOpen, setToolsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedPersonality, setSelectedPersonality] = useState(PERSONALITIES[2]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: `Welcome back${auth?.name ? `, ${auth.name}` : ''}. I am PS Chatbot, your premium intelligence suite. How may I assist you today?`,
      type: 'text',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const navigate = useNavigate();
  const usageStats = getUsageStats(auth);
  const messagesEndRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToolSelect = (tool) => {
    setToolsOpen(false);
    if (tool === 'image') setSelectedModel(MODELS[3]);
    if (tool === 'video') setSelectedModel(MODELS[4]);
    if (tool === 'code') setInput('/script ');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      role: 'user',
      content: input,
      type: 'text',
    };

    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    recordUsageEvent({
      type: 'message',
      prompt: newMsg.content,
      detail: 'Chat prompt',
    });
    setInput('');
    setIsTyping(true);

    const lowerInput = newMsg.content.toLowerCase();
    const aiResponse = {
      id: Date.now() + 1,
      role: 'ai',
      type: 'text',
      content: '',
    };

    if (selectedModel.id === 'ps-vision' || lowerInput.includes('image') || lowerInput.includes('picture')) {
      setTimeout(() => {
        aiResponse.content = 'Image requests are now tracked as real usage only. Connect a live image-generation provider to return actual renders instead of demo placeholders.';
        recordUsageEvent({
          type: 'image',
          prompt: newMsg.content,
          detail: 'Image generation',
        });
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    if (selectedModel.id === 'ps-motion' || lowerInput.includes('video') || lowerInput.includes('motion')) {
      setTimeout(() => {
        aiResponse.content = 'Video requests are now tracked from your real activity. Add a live video backend before returning generated clips, so the app no longer shows demo footage.';
        recordUsageEvent({
          type: 'video',
          prompt: newMsg.content,
          detail: 'Video generation',
        });
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    if (lowerInput.includes('code') || lowerInput.includes('script') || lowerInput.startsWith('/script')) {
      setTimeout(() => {
        aiResponse.content = 'Code requests are logged as real usage, but the old sample snippet has been removed. Use a connected coding model to generate live code responses here.';
        recordUsageEvent({
          type: 'code',
          prompt: newMsg.content,
          detail: 'Code generation',
        });
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    if (selectedModel.id.includes('/')) {
      // Get the freshest key right before making the request
      const currentKey = auth?.api_key || localStorage.getItem('openRouterKey') || '';
      
      if (!currentKey || currentKey === 'undefined' || currentKey === 'null') {
        aiResponse.content = 'Please enter a valid OpenRouter API Key in your Profile settings to use this model.';
        setMessages((prev) => [...prev, aiResponse]);
        setIsTyping(false);
        return;
      }

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.href,
            'X-Title': 'PS Chatbot',
          },
          body: JSON.stringify({
            model: selectedModel.id,
            messages: newMessages
              .filter((message) => message.id !== 1)
              .map((message) => ({ role: message.role === 'ai' ? 'assistant' : 'user', content: message.content })),
          }),
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          aiResponse.content = data.choices[0].message.content;
        } else {
          aiResponse.content = `Error: ${data.error?.message || 'Unknown error occurred from OpenRouter.'}`;
        }
      } catch (error) {
        aiResponse.content = `Failed to fetch from OpenRouter: ${error.message}`;
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
      return;
    }

    setTimeout(() => {
      if (selectedPersonality.id === 'luxurious') {
        aiResponse.content = `An exquisite request. Regarding "${newMsg.content}", we must consider the finest details. Elegance in execution is paramount. I have calibrated my response to ensure the highest quality outcome for your distinguished needs.`;
      } else if (selectedPersonality.id === 'professional') {
        aiResponse.content = `Understood. Analyzing "${newMsg.content}". Here is a concise, actionable summary of the optimal approach moving forward.`;
      } else if (selectedPersonality.id === 'humorous') {
        aiResponse.content = `Oh, absolutely! Why do something normally when we can over-engineer it? Just kidding. Let's tackle "${newMsg.content}" with a bit of style.`;
      } else {
        aiResponse.content = `I have processed your request for "${newMsg.content}". Here is a highly creative and innovative perspective on the matter.`;
      }
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-container">
      <motion.div
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      >
        <div className="brand">
          <h1><Sparkles className="brand-icon" size={28} /> PS Chatbot</h1>
        </div>

        <div className="user-profile">
          <div className="user-menu-shell" ref={userMenuRef}>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  className="user-dropup-menu"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                >
                  <div className="user-dropup-header">
                    <div>
                      <strong style={{ fontSize: '16px', color: '#fff' }}>{auth?.name || 'Guest User'}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{auth?.type === 'premium' ? 'Premium Access' : 'Temp Chat'}</span>
                    </div>
                  </div>

                  <button className="user-dropup-item" onClick={() => { setUserMenuOpen(false); navigate('/profile'); }}>
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  <button className="user-dropup-item" onClick={() => { setUserMenuOpen(false); navigate('/subscription'); }}>
                    <CreditCard size={16} />
                    <span>Subscription</span>
                  </button>
                  <button className="user-dropup-item" onClick={() => { setUserMenuOpen(false); navigate('/settings'); }}>
                    <Settings size={16} />
                    <span>Setting</span>
                  </button>

                  <div className="user-dropup-divider" style={{ height: '1px', background: 'var(--border-light)', margin: '8px 0' }}></div>

                  <button 
                    className="user-dropup-item" 
                    onClick={() => { 
                      setUserMenuOpen(false); 
                      setAuth(null); 
                      navigate('/'); 
                    }}
                    style={{ color: '#ef4444' }}
                  >
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <button className={`user-card ${userMenuOpen ? 'active' : ''}`} onClick={() => setUserMenuOpen((open) => !open)}>
              <div className="avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <h4>{auth?.name || 'Guest User'}</h4>
                <p>{auth?.type === 'premium' ? 'Premium Access' : 'Temp Chat'}</p>
              </div>
              <ChevronDown size={16} className={`user-card-caret ${userMenuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="main-area">
        <div className="top-nav">
          <button
            className="btn-icon"
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setUserMenuOpen(false);
            }}
            style={{ display: 'none' }}
          >
            <Menu size={24} />
          </button>

          <div className="control-group">
            <div className="dropdown">
              <button
                className={`dropdown-trigger ${modelDropdownOpen ? 'active' : ''}`}
                onClick={() => {
                  setModelDropdownOpen(!modelDropdownOpen);
                  setPersonalityDropdownOpen(false);
                }}
              >
                <Wand2 size={16} className="text-accent-gold" />
                {selectedModel.name}
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <motion.div
                    className="dropdown-menu open"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {MODELS.map((model) => (
                      <div
                        key={model.id}
                        className={`dropdown-item ${selectedModel.id === model.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedModel(model);
                          setModelDropdownOpen(false);
                        }}
                      >
                        {model.name}
                        {selectedModel.id === model.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="dropdown">
              <button
                className={`dropdown-trigger ${personalityDropdownOpen ? 'active' : ''}`}
                onClick={() => {
                  setPersonalityDropdownOpen(!personalityDropdownOpen);
                  setModelDropdownOpen(false);
                }}
              >
                <selectedPersonality.icon size={16} />
                {selectedPersonality.name}
                <ChevronDown size={14} />
              </button>

              <AnimatePresence>
                {personalityDropdownOpen && (
                  <motion.div
                    className="dropdown-menu open"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {PERSONALITIES.map((personality) => (
                      <div
                        key={personality.id}
                        className={`dropdown-item ${selectedPersonality.id === personality.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedPersonality(personality);
                          setPersonalityDropdownOpen(false);
                        }}
                      >
                        <personality.icon size={16} />
                        {personality.name}
                        {selectedPersonality.id === personality.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div
          className="chat-container"
          onClick={() => {
            setModelDropdownOpen(false);
            setPersonalityDropdownOpen(false);
            setToolsOpen(false);
            setUserMenuOpen(false);
          }}
        >
          {messages.map((message) => (
            <motion.div
              key={message.id}
              className={`message ${message.role}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="message-avatar">
                {message.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="message-content">{message.content}</div>

                {message.type === 'image' && message.mediaUrl && (
                  <div className="media-grid">
                    <div className="media-item">
                      <img src={message.mediaUrl} alt="Generated AI Content" />
                      <button className="btn-icon" style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white' }}>
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {message.type === 'video' && message.mediaUrl && (
                  <div className="media-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="media-item" style={{ aspectRatio: '16/9' }}>
                      <video src={message.mediaUrl} autoPlay loop muted controls />
                    </div>
                  </div>
                )}

                {message.type === 'code' && message.code && (
                  <div className="code-block">
                    <div className="code-header">
                      <span>javascript</span>
                      <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => navigator.clipboard.writeText(message.code)}>
                        <FileCode size={14} />
                      </button>
                    </div>
                    <pre><code>{message.code}</code></pre>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div className="message ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="message-avatar">
                <Sparkles size={20} />
              </div>
              <div className="message-content" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)' }} />
                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-gold)' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-wrapper">
          <div style={{ position: 'relative' }}>
            <AnimatePresence>
              {toolsOpen && (
                <motion.div
                  className="tools-menu"
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                >
                  <div className="tool-item" onClick={() => handleToolSelect('image')}>
                    <ImageIcon className="icon" size={24} />
                    <div className="tool-item-info">
                      <h5>Generate Image</h5>
                      <p>Create high-fidelity visuals</p>
                    </div>
                  </div>
                  <div className="tool-item" onClick={() => handleToolSelect('video')}>
                    <Video className="icon" size={24} />
                    <div className="tool-item-info">
                      <h5>Generate Video</h5>
                      <p>Render cinematic motion</p>
                    </div>
                  </div>
                  <div className="tool-item" onClick={() => handleToolSelect('code')}>
                    <Code className="icon" size={24} />
                    <div className="tool-item-info">
                      <h5>Write Script</h5>
                      <p>Generate robust code</p>
                    </div>
                  </div>
                  <div className="tool-item" onClick={() => { setToolsOpen(false); setInput('/command '); }}>
                    <Command className="icon" size={24} />
                    <div className="tool-item-info">
                      <h5>System Command</h5>
                      <p>Execute advanced tasks</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="input-box">
              <button className={`action-btn ${toolsOpen ? 'active' : ''}`} onClick={(event) => { event.stopPropagation(); setToolsOpen(!toolsOpen); }}>
                <Command size={20} />
              </button>

              <textarea
                placeholder="Command PS Chatbot or simply ask a question..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />

              <div className="input-actions">
                <button className="action-btn">
                  <ImageIcon size={18} />
                </button>
                <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isTyping}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
