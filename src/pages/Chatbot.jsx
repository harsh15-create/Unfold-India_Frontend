import { motion } from 'framer-motion';
import { useState } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import { saveChat } from '@/lib/supabaseChat';

const formatAIResponse = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br />")
    .replace(/(\d+\.)/g, "<br><b>$1</b>");
};

const Chatbot = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI travel companion for India. How can I help you plan your journey today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [mode, setMode] = useState("traveler");
  const [itineraryLocation, setItineraryLocation] = useState("");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      const response = await fetch("https://unfold-india-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      const aiResponse = {
        id: Date.now() + 1,
        text: formatAIResponse(data.reply),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      await saveChat(newMessage.text, data.reply);
    } catch (error) {
      const aiResponse = {
        id: Date.now() + 1,
        text: "Sorry, server error.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass glass-hover p-3 m-2 rounded-xl text-center fixed top-28 left-0 right-0 mx-auto z-50"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          AI Travel Companion
        </h1>
        <p className="text-muted-foreground mt-2">Ask me anything about traveling in India!</p>
      </motion.div>

      {/* Messages Container */}
      <div className="overflow-y-auto px-4 pt-4 pb-32 mt-40 mb-0 h-[calc(100vh-200px)] pointer-events-none">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ scale: 1.02 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-xl pointer-events-auto ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.sender === 'ai' 
                    ? 'bg-gradient-to-r from-primary to-accent glow-primary' 
                    : 'bg-gradient-to-r from-secondary to-primary'
                }`}>
                  {msg.sender === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Enhanced Message Bubble */}
                <motion.div 
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: msg.sender === 'user' 
                      ? '0 8px 32px hsla(var(--secondary) / 0.3)' 
                      : '0 8px 32px hsla(var(--primary) / 0.3)'
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`glass p-4 rounded-2xl backdrop-blur-xl border ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-secondary/30 to-primary/20 border-secondary/30' 
                      : 'bg-gradient-to-br from-primary/30 to-accent/20 border-primary/30'
                  } transition-all duration-500 ease-out hover:border-opacity-60`}
                >
                  <div>
                    <p
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground mt-3 block opacity-70 hover:opacity-100 transition-opacity">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Enhanced Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-xl">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent glow-primary flex items-center justify-center"
                >
                  <Bot className="w-5 h-5" />
                </motion.div>
                <div className="glass backdrop-blur-xl p-4 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30">
                  <div className="flex space-x-2">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.2, 
                        repeat: Infinity, 
                        delay: 0,
                        ease: "easeInOut"
                      }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.2, 
                        repeat: Infinity, 
                        delay: 0.2,
                        ease: "easeInOut"
                      }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.4, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.2, 
                        repeat: Infinity, 
                        delay: 0.4,
                        ease: "easeInOut"
                      }}
                      className="w-2 h-2 bg-primary rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <button
        onClick={() => setShowItineraryModal(true)}
        className="px-6 py-3 bg-primary/25 border border-primary/30 backdrop-blur-[20px] hover:bg-primary/35 hover:backdrop-blur-[25px] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] fixed bottom-7 right-12 transition-all duration-300 z-50 pointer-events-auto"
      >
        Instant Itinerary
      </button>
      {/* Input Form */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-2 fixed bottom-0 left-0 right-0 z-40"
      >
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="backdrop-blur-[20px] bg-white/15 border border-white/25 p-4 rounded-2xl flex items-center space-x-4 shadow-lg transition-all duration-300">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about destinations, safety, culture, or anything about India..."
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
              disabled={isTyping}
            />
            <motion.button
              type="submit"
              whileHover={{ 
                scale: 1.1,
                rotate: [0, -1, 1, 0],
                boxShadow: '0 0 30px hsla(var(--primary) / 0.6)'
              }}
              whileTap={{ 
                scale: 0.9,
                rotate: 0
              }}
              transition={{ 
                duration: 0.3,
                ease: [0.175, 0.885, 0.32, 1.275]
              }}
              disabled={isTyping || !message.trim()}
              className="backdrop-blur-[20px] bg-primary/25 border border-primary/30 hover:bg-primary/35 hover:backdrop-blur-[25px] p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              {isTyping ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
      {showItineraryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="glass glass-hover backdrop-blur-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 p-6 rounded-2xl w-96 shadow-2xl transition-all duration-300">
            <h2 className="text-xl font-bold mb-4">Generate Itinerary</h2>
            <p className="text-sm mb-2">Select Mode:</p>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center gap-2">
                <input type="radio" checked={mode === "traveler"} onChange={() => setMode("traveler")} /> Traveler Mode (3-4 Days)
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" checked={mode === "normal"} onChange={() => setMode("normal")} /> Normal Mode (1-Day)
              </label>
            </div>
            <input
              type="text"
              placeholder="Enter destination"
              value={itineraryLocation}
              onChange={(e) => setItineraryLocation(e.target.value)}
              className="w-full mb-4 px-4 py-2 bg-input border border-border rounded-xl"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowItineraryModal(false)}
                className="px-4 py-2 bg-red-500/20 text-foreground rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  const itineraryText =
                    mode === "traveler"
                      ? `Generate a 3-4 day detailed itinerary for ${itineraryLocation}. Include budget, food, stay, travel modes, safety tips, and make it engaging.`
                      : `Generate a 1-day quick sightseeing itinerary for ${itineraryLocation}. Focus only on main attractions.`;

                  // Show typing indicator
                  setIsTyping(true);
                  setShowItineraryModal(false);

                  try {
                    const response = await fetch("http://localhost:8000/chat", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ message: itineraryText })
                    });
                    const data = await response.json();
                    const aiResponse = {
                      id: Date.now(),
                      text: formatAIResponse(data.reply),
                      sender: 'ai',
                      timestamp: new Date()
                    };
                    setMessages(prev => [...prev, aiResponse]);
                  } catch (error) {
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      text: "Server error while generating itinerary.",
                      sender: 'ai',
                      timestamp: new Date()
                    }]);
                  } finally {
                    setIsTyping(false);
                  }
                }}
                className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-foreground rounded-xl transition-all"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
