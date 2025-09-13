import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import {LoginUser} from "../../store/actions/CommonActions";

const Login=() =>
{
    const user=useSelector(state => state.login)
    console.log(user)
    const navigate=useNavigate();
    const dispath=useDispatch()// Placeholder for navigation function
    const {register, handleSubmit, formState: {errors}}=useForm({
        mode: 'onBlur',
    });

    const [isFormVisible, setIsFormVisible]=useState(false);

    useEffect(() =>
    {
        setIsFormVisible(true);
    }, []);

    const onSubmit=(data) =>
    {
        dispath(LoginUser(data)).then((res) =>
        {
            if (res.error)
            {
                toast.error("Login failed: "+(res.payload||res.error.message));
                return;
            }


            toast.success("Login successful!.");

            setTimeout(() => {navigate("/saheli-dashboard");}, 1000)

        })

    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                @import url('https://cdn.jsdelivr.net/npm/react-toastify@9.1.3/dist/ReactToastify.min.css');
                body { font-family: 'Poppins', sans-serif; }
            `}</style>

            <div className="w-full min-h-screen p-4 sm:p-8 flex items-center justify-center bg-white/10 backdrop-blur-lg">
                <main className={`w-full h-full image p-10 mx-auto bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 transition-all duration-1000 ${isFormVisible? 'opacity-100 translate-y-0':'opacity-0 translate-y-5'}`}>

                    {/* Left Section */}
                    <div className="flex justify-center items-center relative w-full">

                        <div className="hidden lg:flex flex-col w-[80%] items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-white/10 backdrop-blur-lg shadow-lg">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Welcome Back!</h1>
                            <p className="text-gray-700 text-lg">
                                We're so happy to see you again. Enter your details to continue your journey with the Saheli community.
                            </p>
                            <svg className="w-40 h-40 mt-8 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Section - Login Form */}
                    <div className="p-8 sm:p-10 md:p-12 rounded-2xl flex w-[100%] flex-col bg-white/20 backdrop-blur-lg justify-center">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-5">
                            <h2 className="text-3xl font-bold text-center text-gray-800">Login to Saheli+</h2>
                            <p className="text-center text-white text-sm mb-4">Enter your credentials to access your account.</p>

                            <div>
                                <label htmlFor="email" className="block mb-1.5 font-medium text-white">Email</label>
                                <div className="relative w-full">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                    </span>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        {...register("email", {required: "Email is required", pattern: {value: /^\S+@\S+$/i, message: "Invalid email address"}})}
                                        className={`w-full pl-11 pr-3 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email? 'ring-2 ring-red-400':'focus:ring-pink-400'}`}
                                    />
                                </div>
                                {errors.email&&<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block mb-1.5 font-medium text-white">Password</label>
                                <div className="relative w-full">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        {...register("password", {required: "Password is required"})}
                                        className={`w-full pl-11 pr-3 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password? 'ring-2 ring-red-400':'focus:ring-pink-400'}`}
                                    />
                                </div>
                                {errors.password&&<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                                <div className="text-right mt-2">
                                    <a href="#" className="text-sm text-pink-700 bg-white/20 px-1 rounded-full backdrop-blur-lg hover:text-pink-700 hover:underline">Forgot Password?</a>
                                </div>
                            </div>

                            <button type="submit" className="mt-4 w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
                                Log In
                            </button>

                            <p className="text-sm text-center text-gray-100">
                                Don't have an account? <a href="#" className="font-medium text-pink-700 bg-white/20 px-1 rounded-full backdrop-blur-lg hover:underline">Register here</a>.
                            </p>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default Login;