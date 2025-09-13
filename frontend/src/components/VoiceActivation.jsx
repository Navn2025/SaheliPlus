import React, {useEffect, useRef} from "react";
import axios from "axios";

function VoiceSOSAlwaysOn()
{
  const recognitionRef=useRef(null);
  // This ref will now act as a "cooldown" flag
  const isCoolingDown=useRef(false);

  useEffect(() =>
  {
    const SpeechRecognition=
      window.SpeechRecognition||window.webkitSpeechRecognition;

    if (!SpeechRecognition)
    {
      console.error("SpeechRecognition is not supported in this browser.");
      return;
    }

    const recognition=new SpeechRecognition();
    recognitionRef.current=recognition;

    recognition.continuous=true;
    recognition.interimResults=false;
    recognition.lang="en-US";

    recognition.onstart=() =>
    {
      console.log("🎤 Voice recognition started. Listening for SOS...");
    };

    recognition.onresult=async (event) =>
    {
      const transcript=
        event.results[event.results.length-1][0].transcript
          .toLowerCase()
          .trim();

      console.log("Heard:", transcript);

      // Check for trigger phrases AND check if we are in a cooldown period
      if (
        !isCoolingDown.current&&
        (transcript.includes("help saheli help")||
          transcript.includes("saheli sos"))
      )
      {
        // 1. Activate cooldown to prevent immediate re-triggers
        isCoolingDown.current=true;
        console.log("SOS phrase detected! 🚨 Triggering alert and starting cooldown.");

        // 2. Get location and send the SOS request
        navigator.geolocation.getCurrentPosition(async (pos) =>
        {
          const {latitude, longitude}=pos.coords;
          try
          {
            await axios.post("http://localhost:3000/sos", {
              userId: "USER123",
              lat: latitude,
              lng: longitude,
            });
            alert("🚨 Voice SOS triggered successfully!");
          } catch (err)
          {
            console.error("Failed to send SOS request:", err);
            alert("Could not send SOS. Please check the console for errors.");
          } finally
          {
            // 3. After 30 seconds, reset the cooldown flag
            setTimeout(() =>
            {
              console.log("Cooldown finished. Ready to listen for SOS again.");
              isCoolingDown.current=false;
            }, 30000); // 30-second cooldown
          }
        });
      }
    };

    recognition.onerror=(event) =>
    {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend=() =>
    {
      console.log("Recognition service ended, restarting...");
      // ✅ ALWAYS RESTART: This ensures it truly runs all the time.
      recognition.start();
    };

    // Initial start
    recognition.start();

    // Cleanup
    return () =>
    {
      if (recognitionRef.current)
      {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return null;
}

export default VoiceSOSAlwaysOn;