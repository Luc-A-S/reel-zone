
import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceSearchProps {
  onSearchResult: (text: string) => void;
}

const VoiceSearch = ({ onSearchResult }: VoiceSearchProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Verificar se a Web Speech API é suportada
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
    }
  }, []);

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onSearchResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
  };

  if (!isSupported) {
    return null;
  }

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      className={`glass-card p-3 smooth-transition press-effect rounded-xl ${
        isListening 
          ? 'neon-border bg-primary/20 animate-neon-pulse' 
          : 'hover-glow hover:bg-primary/10'
      }`}
      aria-label={isListening ? "Parar gravação" : "Pesquisar por voz"}
      title={isListening ? "Parar gravação" : "Pesquisar por voz"}
    >
      {isListening ? (
        <MicOff className="w-5 h-5 text-primary" />
      ) : (
        <Mic className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
};

export default VoiceSearch;
