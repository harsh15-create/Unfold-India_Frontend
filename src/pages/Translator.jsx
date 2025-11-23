import { motion } from "framer-motion";
import { useState } from "react";
import { Languages, Volume2 } from "lucide-react";

// 🔥 Modern Translator UI — matching Safe Directions color theme
// Uses bg-input, text-foreground, text-muted-foreground, border-border, glass styles
// Smooth animations + clean layout

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("hi");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const languages = [
    { code: "hi", name: "Hindi" },
    { code: "ta", name: "Tamil" },
    { code: "bn", name: "Bengali" },
    { code: "te", name: "Telugu" },
    { code: "mr", name: "Marathi" },
    { code: "gu", name: "Gujarati" }
  ];

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);

    try {
      const res = await fetch("http://localhost:8000/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, target: selectedLanguage })
      });

      const data = await res.json();
      setOutputText(data.translated || "Translation error");
    } catch (err) {
      setOutputText("Translation error");
    }

    setIsTranslating(false);
  };

  const handlePlayAudio = async () => {
    if (!outputText) return;
    setIsPlaying(true);

    try {
      const resp = await fetch("http://localhost:8000/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: outputText, voiceId: "en-US-ryan" })
      });

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(url);
      };

      audio.play();
    } catch (err) {
      setIsPlaying(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 bg-background text-foreground flex flex-col items-center">
      <div className="w-full max-w-4xl">

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Translator</h1>
          <p className="text-muted-foreground mt-2">Instant, clean translations powered by AI</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6 rounded-2xl shadow-xl border border-border">
          <label className="text-sm text-muted-foreground">Enter text</label>
          <textarea
            className="w-full h-32 mt-2 bg-input border border-border p-4 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type text here..."
          />

          <div className="mt-4 flex items-center gap-4">
            <select
              className="bg-input border border-border p-3 rounded-lg"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>

            <button
              className="px-6 py-3 rounded-xl bg-primary text-white shadow hover:opacity-90"
              onClick={handleTranslate}
            >
              {isTranslating ? "Translating..." : "Translate"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-input rounded-lg border border-border min-h-[90px]">
            <label className="text-sm text-muted-foreground">Translation</label>
            <p className="mt-2 text-lg">{outputText || "..."}</p>
          </div>

          {outputText && (
            <button
              className="mt-4 px-5 py-3 bg-secondary text-white rounded-xl flex items-center gap-2 hover:opacity-90"
              onClick={handlePlayAudio}
            >
              <Volume2 size={20} />
              {isPlaying ? "Playing..." : "Play Audio"}
            </button>
          )}
        </motion.div>

      </div>
    </div>
  );
};

export default Translator;
