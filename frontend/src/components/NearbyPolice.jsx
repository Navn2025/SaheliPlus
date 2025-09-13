import React, {useEffect, useRef} from "react";
import axios from "axios";

function VoiceSOSAlwaysOn()
{
    const recognitionRef=useRef(null);
    const isRecognizing=useRef(false);

    useEffect(() =>
    {
        const SpeechRecognition=
            window.SpeechRecognition||window.webkitSpeechRecognition;

        if (!SpeechRecognition)
        {
            console.error("SpeechRecognition not supported in this browser.");
            return;
        }

        const recognition=new SpeechRecognition();
        recognitionRef.current=recognition;

        recognition.continuous=true; // keeps listening
        recognition.interimResults=false;
        recognition.lang="en-US";

        // Function to start recognition safely
        const startRecognition=() =>
        {
            if (!isRecognizing.current)
            {
                try
                {
                    recognition.start();
                    isRecognizing.current=true;
                    console.log("✅ Speech recognition started");
                } catch (err)
                {
                    console.error("Error starting recognition:", err);
                }
            }
        };

        // Handle results
        recognition.onresult=async (event) =>
        {
            const transcript=event.results[event.results.length-1][0].transcript
                .toLowerCase()
                .trim();
            console.log("🎙️ Heard:", transcript);

            if (transcript.includes("help saheli help")||transcript.includes("help help"))
            {
                // Fetch current location
                navigator.geolocation.getCurrentPosition(
                    async (pos) =>
                    {
                        const {latitude, longitude}=pos.coords;
                        try
                        {
                            await axios.post("http://localhost:3000/sos", {
                                userId: "USER123", // replace with dynamic userId
                                lat: latitude,
                                lng: longitude,
                            });
                            alert("🚨 Voice SOS triggered automatically!");
                        } catch (err)
                        {
                            console.error("Failed to send SOS:", err);
                        }
                    },
                    (err) =>
                    {
                        console.error("Geolocation error:", err);
                    }
                );
            }
        };

        // Handle errors
        recognition.onerror=(err) =>
        {
            console.error("SpeechRecognition error:", err);
            isRecognizing.current=false;
            // Only restart on recoverable errors
            if (err.error!=="not-allowed"&&err.error!=="service-not-allowed")
            {
                setTimeout(startRecognition, 1000);
            }
        };
        startRecognition();


        // Restart automatically if recognition stops
        recognition.onend=() =>
        {
            console.log("SpeechRecognition ended, restarting...");
            isRecognizing.current=false;
            setTimeout(startRecognition, 500); // small delay before restarting
            startRecognition();

        };

        // Start recognition initially
        startRecognition();

        // Cleanup on unmount
        return () =>
        {
            recognition.stop();
            isRecognizing.current=false;
        };
    }, []);

    return null; // invisible component
}

export default VoiceSOSAlwaysOn;
