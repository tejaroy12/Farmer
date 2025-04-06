// utils/speakTelugu.js
export const speakTelugu = (text) => {
    const synth = window.speechSynthesis;
  
    const speak = () => {
      const voices = synth.getVoices();
      const teluguVoice =
        voices.find((v) => v.lang === "te-IN") ||
        voices.find((v) => v.lang.includes("IN") || v.lang.includes("hi"));
  
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "te-IN";
      utterance.pitch = 0.5;
      utterance.rate = 0.9;
  
      if (teluguVoice) {
        utterance.voice = teluguVoice;
      }
  
      synth.cancel();
      synth.speak(utterance);
    };
  
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = () => {
        speak();
        synth.onvoiceschanged = null;
      };
    } else {
      speak();
    }
  };
  