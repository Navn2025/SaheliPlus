import React from 'react';
import {useNavigate} from 'react-router-dom';

// A simple User Icon component for the buttons

const UserIcon=() => (
    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
    </svg>
);

// A simple Saheli Icon component (representing connection/support)
const SaheliIcon=() => (
    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// A new, more prominent icon for the card header
const CommunityIcon=() => (
    <div className="mx-auto mb-4 h-20 w-20 flex items-center justify-center rounded-full bg-indigo-100">
        <svg className="w-12 h-12 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    </div>
);

export default function Choice()
{
    const navigate=useNavigate()
    // Handlers for button clicks
    const handleSaheliRegister=() =>
    {
        navigate("/register/saheli");
        // Add navigation logic here
    };

    const handleCustomerRegister=() =>
    {
        navigate("/register/customer");
        console.log("Navigating to Customer Registration page...");
        // Add navigation logic here
    };

    const handleLogin=() =>
    {
        navigate("/login");
        console.log("Navigating to Login page...");
        // Add navigation logic here
    }

    return (
        <>
            {/* Injecting the Poppins font and custom animations */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                body { 
                    font-family: 'Poppins', sans-serif; 
                    
                    
                }
                
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.7s ease-out forwards;
                }
                .animate-blob {
                    animation: blob 8s infinite ease-in-out;
                }
            `}</style>

            <div className="relative min-h-screen  backdrop-blur-2xl bg-white/20 w-full flex items-center justify-center overflow-hidden p-4">
                {/* Decorative background gradient blobs */}
                <div className="absolute top-0 -left-24 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-0 -right-24 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob" style={{animationDelay: '2s'}}></div>
                <div className="absolute top-1/2 -right-24 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-blob" style={{animationDelay: '4s'}}></div>


                {/* Main Content Card */}
                <main className="relative w-full max-w-2xl backdrop-blur-2xl rounded-2xl shadow-2xl p-8 md:p-12 text-center transition-all duration-500 transform hover:scale-[1.01] animate-fadeInUp">
                    <CommunityIcon />

                    <h1 className="text-4xl md:text-5xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 [animation-delay:200ms]" style={{animation: 'fadeInUp 0.7s ease-out 0.2s forwards', opacity: 0}}>
                        Join Our Community!
                    </h1>

                    <p className="max-w-md mx-auto text-gray-600 my-6" style={{animation: 'fadeInUp 0.7s ease-out 0.4s forwards', opacity: 0}}>
                        Your trusted network awaits. Choose your role and start connecting today.
                    </p>

                    {/* Action Buttons */}
                    <div className="space-y-5" style={{animation: 'fadeInUp 0.7s ease-out 0.6s forwards', opacity: 0}}>
                        <button
                            onClick={handleSaheliRegister}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                        >
                            <SaheliIcon />
                            Register as a Saheli
                        </button>

                        <button
                            onClick={handleCustomerRegister}
                            className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-300"
                        >
                            <UserIcon />
                            Register as a Customer
                        </button>
                    </div>

                    {/* Login Link */}
                    <div className="mt-10 text-sm text-gray-500" style={{animation: 'fadeInUp 0.7s ease-out 0.8s forwards', opacity: 0}}>
                        <span>Already have an account? </span>
                        <a
                            href="#"
                            onClick={(e) => {e.preventDefault(); handleLogin();}}
                            className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-200"
                        >
                            Login Here
                        </a>
                    </div>
                </main>
            </div>
        </>
    );
}

