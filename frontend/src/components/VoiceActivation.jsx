import React, { useEffect, useRef } from "react";
import axios from "axios";

function VoiceSOSAlwaysOn() {
  const recognitionRef = useRef(null);
  const isRecognizing = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    const startRecognition = () => {
      if (!isRecognizing.current) {
        try {
          recognition.start();
          isRecognizing.current = true;
          console.log("Recognition started");
        } catch (err) {
          console.error("Error starting recognition:", err);
        }
      }
    };

    recognition.onresult = async (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();

      if (transcript.includes("help saheli help") || transcript.includes("saheli sos")) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
          const { latitude, longitude } = pos.coords;
          try {
            await axios.post("http://localhost:3000/sos", {
              userId: "USER123",
              lat: latitude,
              lng: longitude,
            });
            alert("🚨 Voice SOS triggered automatically!");
          } catch (err) {
            console.error("Failed to send SOS:", err);
          }
        });
      }
    };

    recognition.onerror = (err) => {
      console.error("Speech error:", err);
      isRecognizing.current = false;
      setTimeout(startRecognition, 1000);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizing.current = false;
      startRecognition();
    };

    // Start recognition immediately
    startRecognition();

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startRecognition();
      } else {
        recognition.stop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      recognition.stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div>
      <p>🎤 Voice SOS is active... Say "Help Saheli Help" or "Saheli SOS"</p>
    </div>
  );
}

export default VoiceSOSAlwaysOn;
