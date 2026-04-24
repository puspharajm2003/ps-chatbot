import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Sparkles, Send, Image as ImageIcon, Video, FileCode, 
  Settings, User, Clock, ChevronDown, Wand2, Command, 
  Check, Maximize2, MessageSquare, Briefcase, Smile, Crown,
  Code
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const MOCK_HISTORY = [
  { id: 1, title: 'Luxury Brand Strategy' },
  { id: 2, title: 'Real Estate Video Script' },
  { id: 3, title: 'Generate UI Mockup' },
  { id: 4, title: 'Quantum Physics Explained' }
];

export default function Chat({ auth }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [personalityDropdownOpen, setPersonalityDropdownOpen] = useState(false);
  const [openRouterKey, setOpenRouterKey] = useState(auth?.api_key || localStorage.getItem('openRouterKey') || '');
  const navigate = useNavigate();
  const [toolsOpen, setToolsOpen] = useState(false);
  
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [selectedPersonality, setSelectedPersonality] = useState(PERSONALITIES[2]);
  
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'ai',
      content: `Welcome back${auth?.name ? `, ${auth.name}` : ''}. I am PS Chatbot, your premium intelligence suite. How may I assist you today?`,
      type: 'text'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      type: 'text'
    };

    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    const lowerInput = newMsg.content.toLowerCase();
    let aiResponse = {
      id: Date.now() + 1,
      role: 'ai',
      type: 'text',
      content: ''
    };

    // Check for mock media generations
    if (selectedModel.id === 'ps-vision' || lowerInput.includes('image') || lowerInput.includes('picture')) {
      setTimeout(() => {
        aiResponse.content = 'Here is the image you requested. The prompt has been enhanced for maximum aesthetic quality.';
        aiResponse.type = 'image';
        aiResponse.mediaUrl = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop';
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
      return;
    } 
    else if (selectedModel.id === 'ps-motion' || lowerInput.includes('video') || lowerInput.includes('motion')) {
      setTimeout(() => {
        aiResponse.content = 'I have generated the video sequence based on your parameters. The cinematic rendering is complete.';
        aiResponse.type = 'video';
        aiResponse.mediaUrl = 'https://cdn.coverr.co/videos/coverr-a-person-working-on-a-laptop-5254/1080p.mp4';
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
      return;
    }
    else if (lowerInput.includes('code') || lowerInput.includes('script') || lowerInput.startsWith('/script')) {
      setTimeout(() => {
        aiResponse.content = 'Here is the optimized script you requested. I have ensured robust error handling and adherence to best practices.';
        aiResponse.type = 'code';
        aiResponse.code = `function generateLuxuriousExperience(user) {\n  const config = {\n    theme: 'dark-gold',\n    animations: 'smooth',\n    model: 'PS Core v2'\n  };\n  \n  if (user.preferences.premium) {\n    return initIntelligence(user, config);\n  }\n  \n  return standardResponse();\n}`;
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 1500);
      return;
    }

    // OpenRouter AI Integration
    if (selectedModel.id.includes('/')) {
      if (!openRouterKey) {
        aiResponse.content = 'Please enter your OpenRouter API Key in the settings to use this model.';
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
        return;
      }

      try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.href, // Recommended by OpenRouter
            'X-Title': 'PS Chatbot' // Recommended by OpenRouter
          },
          body: JSON.stringify({
            model: selectedModel.id,
            messages: newMessages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }))
          })
        });

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          aiResponse.content = data.choices[0].message.content;
        } else {
          aiResponse.content = `Error: ${data.error?.message || 'Unknown error occurred from OpenRouter.'}`;
        }
      } catch (err) {
        aiResponse.content = `Failed to fetch from OpenRouter: ${err.message}`;
      }
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
      return;
    }

    // Fallback Mock Text Response
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
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <motion.div 
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        initial={{ x: 0 }}
        animate={{ x: sidebarOpen ? 0 : -320 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
      >
        <div className="brand">
          <h1><Sparkles className="brand-icon" size={28} /> PS Chatbot</h1>
        </div>

        <div className="sidebar-section">
          <div className="section-title">Recent Intelligence</div>
          {MOCK_HISTORY.map(item => (
            <div key={item.id} className="history-item">
              <MessageSquare size={16} />
              <span>{item.title}</span>
            </div>
          ))}
        </div>

        <div className="user-profile">
          <div className="user-card">
            <div className="avatar">
              <User size={20} />
            </div>
            <div className="user-info">
              <h4>{auth?.name || 'Guest User'}</h4>
              <p>{auth?.type === 'premium' ? 'Premium Access' : 'Temp Chat'}</p>
            </div>
            <Settings size={16} className="ml-auto text-tertiary" style={{ marginLeft: 'auto', color: 'var(--text-tertiary)', cursor: 'pointer' }} onClick={() => navigate('/profile')} />
          </div>
        </div>
      </motion.div>

      {/* Main Area */}
      <div className="main-area">
        {/* Top Navigation Controls */}
        <div className="top-nav">
          <button 
            className="btn-icon md:hidden" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: window.innerWidth <= 768 ? 'flex' : 'none' }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <button 
            className="btn-icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}
          >
             <Menu size={24} />
          </button>

          <div className="control-group">
            {/* Model Dropdown */}
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
                    {MODELS.map(model => (
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

            {/* Personality Dropdown */}
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
                    {PERSONALITIES.map(p => (
                      <div 
                        key={p.id} 
                        className={`dropdown-item ${selectedPersonality.id === p.id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedPersonality(p);
                          setPersonalityDropdownOpen(false);
                        }}
                      >
                        <p.icon size={16} />
                        {p.name}
                        {selectedPersonality.id === p.id && <Check size={14} style={{ marginLeft: 'auto' }} />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-container" onClick={() => { setModelDropdownOpen(false); setPersonalityDropdownOpen(false); setToolsOpen(false); }}>
          {messages.map(msg => (
            <motion.div 
              key={msg.id} 
              className={`message ${msg.role}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="message-avatar">
                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div style={{ flex: 1 }}>
                <div className="message-content">
                  {msg.content}
                </div>
                
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="media-grid">
                    <div className="media-item">
                      <img src={msg.mediaUrl} alt="Generated AI Content" />
                      <button className="btn-icon" style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.5)', color: 'white' }}>
                        <Maximize2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {msg.type === 'video' && msg.mediaUrl && (
                  <div className="media-grid" style={{ gridTemplateColumns: '1fr' }}>
                    <div className="media-item" style={{ aspectRatio: '16/9' }}>
                      <video src={msg.mediaUrl} autoPlay loop muted controls />
                    </div>
                  </div>
                )}

                {msg.type === 'code' && msg.code && (
                  <div className="code-block">
                    <div className="code-header">
                      <span>javascript</span>
                      <button className="btn-icon" style={{ width: 24, height: 24 }} onClick={() => navigator.clipboard.writeText(msg.code)}>
                        <FileCode size={14} />
                      </button>
                    </div>
                    <pre><code>{msg.code}</code></pre>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              className="message ai"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
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

        {/* Input Area */}
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
              <button 
                className={`action-btn ${toolsOpen ? 'active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setToolsOpen(!toolsOpen); }}
              >
                <Command size={20} />
              </button>
              
              <textarea 
                placeholder="Command PS Chatbot or simply ask a question..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />

              <div className="input-actions">
                <button className="action-btn">
                  <ImageIcon size={18} />
                </button>
                <button 
                  className="send-btn"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
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
