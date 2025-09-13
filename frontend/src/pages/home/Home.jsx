import React, {useState, useEffect, useRef} from "react";
import {useNavigate, NavLink} from "react-router-dom";
import V1 from "../../assets/beauty.mp4";
import V2 from "../../assets/tailoring.mp4";

const Home=() =>
{
    const [currentVideo, setCurrentVideo]=useState(0);
    const [user, setUser]=useState(null);
    const videoRef=useRef(null);
    const navigate=useNavigate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const videos=[V1, V2]; // playlist

    // Redirect user if already logged in




    // Handle seamless video loop
    useEffect(() =>
    {
        const videoElement=videoRef.current;

        const handleEnded=() =>
        {
            setCurrentVideo((prev) =>
            {
                const nextIndex=(prev+1)%videos.length;

                if (videoElement)
                {
                    videoElement.src=videos[nextIndex];
                    videoElement.load(); // reload video

                    // wait until video is ready before playing
                    videoElement.onloadeddata=() =>
                    {
                        videoElement
                            .play()
                            .catch((err) => console.warn("Autoplay error:", err));
                    };
                }

                return nextIndex;
            });
        };

        if (videoElement)
        {
            videoElement.addEventListener("ended", handleEnded);
        }

        return () =>
        {
            if (videoElement)
            {
                videoElement.removeEventListener("ended", handleEnded);
            }
        };
    }, [videos]);

    return (
        <div className="relative w-full min-h-screen flex flex-col justify-center items-center text-white font-poppins">
            {/* Background video (seamless loop) */}
            <video
                ref={videoRef}
                src={videos[currentVideo]}
                autoPlay
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover blur-md"
            />

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/60 to-black/60"></div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-4xl px-6">
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg">
                    Welcome to <span className="text-pink-100">Saheli+</span>
                </h1>
                <p className="mt-6 text-base sm:text-lg md:text-2xl text-pink-50">
                    Empowering women with services, skills & opportunities under one
                    platform.
                </p>

                {/* Only Join button */}
                <div className="mt-10 flex justify-center">
                    <NavLink
                        to="/choice"
                        className="px-8 py-4 rounded-2xl border border-pink-200 hover:bg-pink-200 hover:text-pink-900 transition-all text-lg font-semibold text-center"
                    >
                        Join as Provider
                    </NavLink>
                </div>

                {/* Features Section */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto px-4">
                    <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:bg-white/20 transition-all">
                        <h3 className="text-2xl font-bold text-pink-200 mb-3">🌍 Reach</h3>
                        <p className="text-pink-100">
                            Connect with customers across multiple cities and expand your
                            services.
                        </p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:bg-white/20 transition-all">
                        <h3 className="text-2xl font-bold text-pink-200 mb-3">💼 Growth</h3>
                        <p className="text-pink-100">
                            Unlock opportunities to grow your skills, income, and reputation.
                        </p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl shadow-lg hover:bg-white/20 transition-all">
                        <h3 className="text-2xl font-bold text-pink-200 mb-3">🤝 Community</h3>
                        <p className="text-pink-100">
                            Be a part of a women-led community, uplifting each other for a
                            better future.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
