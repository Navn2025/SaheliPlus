import React, {useEffect, useState} from "react";
import {useForm, Controller} from "react-hook-form";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Removed direct import
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Removed direct import
import {useNavigate} from "react-router-dom"; // Commented out due to environment constraints
import {useDispatch} from 'react-redux'; // Commented out due to environment constraints
import {sendOtp, verifyOtp} from "../../store/actions/CommonActions";
import {CreateSaheli} from "../../store/actions/SaheliActions";

// Password Strength Indicator Component
const PasswordStrengthIndicator=({password=''}) =>
{
    const getStrength=() =>
    {
        let score=0;
        if (password.length>5) score++;
        if (password.length>8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return score;
    };

    const strength=getStrength();
    const strengthLabels=['Weak', 'Weak', 'Medium', 'Good', 'Strong', 'Very Strong'];
    const strengthColors=['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'];

    return (
        <div className="flex items-center mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                <div className={`h-2 rounded-full ${strengthColors[strength]}`} style={{width: `${(strength/5)*100}%`, transition: 'width 0.3s ease-in-out'}}></div>
            </div>
            <span className="text-sm text-gray-600 w-20 text-right">{strengthLabels[strength]}</span>
        </div>
    );
};

const SaheliBasicRegistration=() =>
{
    const navigate=useNavigate(); // Navigation requires a router setup, commented for preview
    const dispatch=useDispatch(); // Redux requires a store setup, commented for preview
    const {register, handleSubmit, control, watch, formState: {errors}, getValues, setValue}=useForm({
        mode: 'onBlur',
    });

    const [isFormVisible, setIsFormVisible]=useState(false);
    const [reVerifyEmail, setReVerifyEmail]=useState(false);
    const [reVerifyPhone, setReVerifyPhone]=useState(false);
    const [showEmailOtp, setShowEmailOtp]=useState(false);
    const [isEmailVerified, setIsEmailVerified]=useState(false);
    const [showPhoneOtp, setShowPhoneOtp]=useState(false);
    const [isPhoneVerified, setIsPhoneVerified]=useState(false);
    const [profileImagePreview, setProfileImagePreview]=useState(null);


    useEffect(() =>
    {
        setIsFormVisible(true);
        // Cleanup function for the object URL to prevent memory leaks
        return () =>
        {
            if (profileImagePreview)
            {
                URL.revokeObjectURL(profileImagePreview);
            }
        };
    }, [profileImagePreview]);

    const password=watch("password");

    const handleSendOtp=(type) =>
    {
        if (type==='email')
        {
            if (isEmailVerified&&!reVerifyEmail) return;
            const emailValue=getValues('email');
            const data={email: emailValue};
            if (!emailValue||!/^\S+@\S+$/i.test(emailValue))
            {
                toast.error("Please enter a valid email before requesting OTP.");
                return;
            }
            dispatch(sendOtp(data)).then((res) =>
            {
                if (res.error)
                {
                    toast.error(res.error.message||"Failed to send OTP. Please try again.");
                    return;
                }


                toast.success("OTP sent to your email!");
                setShowEmailOtp(true);
            })
        }
        if (type==='phone')
        {
            if (isPhoneVerified&&!reVerifyPhone) return;
            dispatch(sendOtp(getValues('phone')));
            const phoneValue=getValues('phone');
            if (!phoneValue||!/^[0-9]{10}$/.test(phoneValue))
            {
                toast.error("Please enter a valid 10-digit phone number before requesting OTP.");
                return;
            }
            setShowPhoneOtp(true);
            toast.success("OTP sent to your phone!");
        }
    };

    const handleVerifyOtp=(type) =>
    {
        // In a real app, you would verify the OTP against a server
        if (type==='email')
        {
            dispatch(verifyOtp({email: getValues('email'), otp: getValues('email_otp')})).then((res) =>
            {
                if (res.error)
                {
                    toast.error(res.error.message||"OTP verification failed. Please try again.");
                    return;
                }
                // If successful
                setReVerifyEmail(false);
                setShowEmailOtp(false);
                setIsEmailVerified(true);
                toast.success("Email verified successfully!");
            }
            )

        }
        if (type==='phone')
        {
            setReVerifyPhone(true)
            toast.success("Phone verified successfully!");
            setIsPhoneVerified(true);
            setShowPhoneOtp(false);
        }
    };

    const handleImageChange=(e) =>
    {
        const file=e.target.files[0];
        if (file)
        {
            if (file.size>2*1024*1024)
            { // 2MB limit
                toast.error("File is too large. Max size is 2MB.");
                return;
            }
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type))
            {
                toast.error("Invalid file type. Please upload a JPG or PNG image.");
                return;
            }
            // Revoke old preview URL if it exists
            if (profileImagePreview)
            {
                URL.revokeObjectURL(profileImagePreview);
            }
            setProfileImagePreview(URL.createObjectURL(file));
            setValue("profileImage", file, {shouldValidate: true});
        }
    };

    const onSubmit=(data) =>
    {
        const formData=new FormData();
        formData.append("name", data.name);
        formData.append("phone", data.phone);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("gender", data.gender);
        formData.append("dateOfBirth", new Date(data.dateOfBirth).toISOString());
        formData.append("profileImage", data.profileImage[0]); // ✅ file object

        dispatch(CreateSaheli(formData)).then((res) =>
        {
            if (res.error)
            {
                toast.error(res.error.message||"Registration failed. Please try again.");
                return;
            }

            navigate("/register/saheli/profile");
            toast.success("Registration successful!");
        });
    };


    const selectCustomStyles={
        control: (base, state) => ({
            ...base, backgroundColor: '#fdfdff', border: state.isFocused? '1px solid #db2777':'1px solid #e5e7eb',
            borderRadius: '0.5rem', padding: '0.1rem 0.25rem', boxShadow: state.isFocused? '0 0 0 3px rgba(219, 39, 119, 0.15)':'none',
            '&:hover': {borderColor: '#db2777'}, transition: 'all 0.2s ease-in-out',
        }),
        menu: (base) => ({
            ...base, backgroundColor: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)',
            borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }),
        option: (base, state) => ({
            ...base, backgroundColor: state.isSelected? '#d65d95':state.isFocused? '#f5d3e4':'transparent',
            color: state.isSelected? 'white':'#4A5568', padding: '0.75rem 1rem'
        }),
        singleValue: (base) => ({...base, color: '#4A5568'}),
        placeholder: (base) => ({...base, color: '#9ca3af'}),
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                @import url('https://cdn.jsdelivr.net/npm/react-toastify@9.1.3/dist/ReactToastify.min.css');
                @import url('https://cdn.jsdelivr.net/npm/react-datepicker@6.9.0/dist/react-datepicker.css');
                body { font-family: 'Poppins', sans-serif; }
                .react-datepicker-wrapper { display: block; width: 100%; }
                .react-datepicker__input-container input { width: 100% !important; }
                .react-datepicker { font-family: 'Poppins', sans-serif !important; border-radius: 0.5rem !important; border: 1px solid #fbcfe8 !important; }
                .react-datepicker__header { background-color: #fff0f5 !important; border-bottom: 1px solid #fbcfe8 !important; }
                .react-datepicker__current-month { color: #c026d3 !important; font-weight: 500; }
                .react-datepicker__day-name, .react-datepicker__day { color: #4A5568 !important; }
                .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected { background-color: #db2777 !important; color: white !important; }
                .react-datepicker__day:hover { background-color: #fce7f3 !important; }
                .react-datepicker__year-read-view--down-arrow, .react-datepicker__navigation-icon::before { border-color: #c026d3 !important; }
                .otp-section { max-height: 0; overflow: hidden; transition: max-height 0.5s ease-in-out; }
                .otp-section.expanded { max-height: 100px; }
                 input[type=number]::-webkit-inner-spin-button, 
                 input[type=number]::-webkit-outer-spin-button { 
                   -webkit-appearance: none; 
                   margin: 0; 
                 }
                 input[type=number] {
                   -moz-appearance: textfield;
                 }
            `}</style>

            <div className="w-full min-h-screen p-15 flex items-center  bg-white/30 backdrop-blur-xl justify-center ">
                <main className={`w-full image  mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 transition-opacity duration-1000 ${isFormVisible? 'opacity-100':'opacity-0'}`}>

                    <div className="hidden lg:flex flex-col items-center  p-12  text-white relative">
                        <div className="absolute top-0 left-0 w-48 h-48 bg-pink-600/20 rounded-full opacity-50 -translate-x-1/3 -translate-y-1/3 filter blur-xl"></div>
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full opacity-50 translate-x-1/4 translate-y-1/4 filter blur-xl"></div>
                        <div className="max-w-md mt-[20%] text-gray-700 bg-white/30 p-8 rounded-2xl md:p-12  backdrop-blur-lg text-center z-10">
                            <svg className="w-32 h-32 mx-auto mb-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            <h1 className="text-3xl font-bold" style={{fontFamily: "'Poppins', sans-serif"}}>Welcome to Saheli+</h1>
                            <p className="opacity-90 mt-3">Your journey to empowerment and community starts here. Let's get you set up.</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        <form onSubmit={handleSubmit(onSubmit)} className="flex bg-white/30 p-8 rounded-2xl md:p-12  backdrop-blur-lg flex-col gap-y-4">
                            <h2 className="text-3xl font-bold text-center text-gray-800">Create Your Account</h2>
                            <p className="text-center text-gray-500 text-sm mb-4">Join our community of amazing women!</p>

                            {/* Profile Image Upload */}
                            <div>
                                <label className="block mb-2 font-medium text-gray-700">Profile Picture</label>
                                <div className="flex items-center gap-5">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed flex items-center justify-center overflow-hidden">
                                        {profileImagePreview? (
                                            <img src={profileImagePreview} alt="Profile Preview" className="w-full h-full object-cover" />
                                        ):(
                                            <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="profileImage" className="cursor-pointer bg-rose-500 text-white font-semibold py-2 px-5 rounded-lg hover:bg-rose-600 transition-colors shadow-sm">
                                            Upload Image
                                        </label>
                                        <input
                                            id="profileImage"
                                            type="file"
                                            className="hidden"
                                            accept="image/png, image/jpeg, image/jpg"
                                            {...register("profileImage")}
                                            onChange={handleImageChange}
                                        />
                                        <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB.</p>
                                    </div>
                                </div>

                            </div>

                            <div>
                                <label htmlFor="name" className="block mb-1.5 font-medium text-gray-700">Name</label>
                                <div className="relative w-full">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </span>
                                    <input id="name" type="text" placeholder="Enter your full name" {...register("name", {required: "Name is required"})}
                                        className={`w-full pl-11 pr-3 py-2.5 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.name? 'border-red-400 focus:ring-red-300':'border-gray-200 focus:ring-pink-300 focus:border-pink-300'}`}
                                    />
                                </div>
                                {errors.name&&<p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Email Input */}
                            <div>
                                <label htmlFor="email" className="block mb-1.5 font-medium text-gray-700">Email</label>
                                <div className="flex items-center gap-2">
                                    <div className="relative w-full">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </span>
                                        <input id="email" type="email" placeholder="you@example.com" {...register("email", {required: "Email is required", pattern: {value: /^\S+@\S+$/i, message: "Invalid email address"}})} disabled={isEmailVerified||reVerifyEmail||showEmailOtp}
                                            className={`w-full pl-11 pr-3 py-2.5 border rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.email? 'border-red-400 focus:ring-red-300':'border-gray-200 focus:ring-pink-300 focus:border-pink-300'} ${isEmailVerified? 'bg-gray-200 cursor-not-allowed':''}`}
                                        />
                                    </div>
                                    <button type="button" onClick={() => handleSendOtp('email')} disabled={isEmailVerified||reVerifyEmail||showEmailOtp} className="px-4 py-2.5 bg-rose-500 text-white rounded-lg text-sm font-semibold hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                                        {isEmailVerified? <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>:'Verify'}
                                    </button>
                                </div>
                                {errors.email&&<p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                                <div className={`otp-section ${showEmailOtp? 'expanded':''}`}>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="number"
                                            placeholder="Enter 6-digit OTP"
                                            {...register("email_otp", {required: "OTP is required", pattern: {value: /^\d{6}$/, message: "OTP must be 6 digits"}})}
                                            disabled={reVerifyEmail}
                                            className="w-full p-2 border rounded-md bg-gray-50/50 focus:ring-2 focus:ring-pink-300" />
                                        <button type="button" onClick={() => handleVerifyOtp('email')} disabled={!watch('email_otp')||watch('email_otp').length!==6} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Submit</button>
                                    </div>
                                    {errors.email_otp&&<p className="text-red-500 text-sm mt-1">{errors.email_otp.message}</p>}
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div>
                                <label htmlFor="phone" className="block mb-1.5 font-medium text-gray-700">Phone</label>
                                <div className="flex items-center w-full gap-2">
                                    <div className="relative w-full">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                        </span>
                                        <input id="phone" type="tel" disabled={isPhoneVerified||reVerifyPhone||showPhoneOtp} placeholder="10-digit mobile number" {...register("phone", {required: "Phone number is required", pattern: {value: /^[0-9]{10}$/, message: "Invalid phone number"}})}
                                            className={`w-full pl-11 pr-3 py-2.5 border rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.phone? 'border-red-400 focus:ring-red-300':'border-gray-200 focus:ring-pink-300 focus:border-pink-300'} ${isPhoneVerified? 'bg-gray-200 cursor-not-allowed':''}`}
                                        />
                                    </div>
                                    <button type="button" onClick={() => handleSendOtp('phone')} disabled={isPhoneVerified||reVerifyPhone||showPhoneOtp} className="px-4 py-2.5 bg-rose-500 text-white rounded-lg text-sm font-semibold hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                                        {isPhoneVerified? <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>:'Verify'}
                                    </button>
                                </div>
                                {errors.phone&&<p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                                <div className={`otp-section ${showPhoneOtp? 'expanded':''}`}>
                                    <div className="flex items-center gap-2 mt-2">
                                        <input
                                            type="number"
                                            placeholder="Enter 6-digit OTP"
                                            {...register("phone_otp", {required: "OTP is required", pattern: {value: /^\d{6}$/, message: "OTP must be 6 digits"}})}
                                            disabled={reVerifyPhone||watch('phone_otp')?.length===6}
                                            className="w-full p-2 border bg-gray-50/50 rounded-md focus:ring-2 focus:ring-pink-300" />
                                        <button type="button" onClick={() => handleVerifyOtp('phone')} disabled={!watch('phone_otp')||watch('phone_otp').length!==6} className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">Submit</button>
                                    </div>
                                    {errors.phone_otp&&<p className="text-red-500 text-sm mt-1">{errors.phone_otp.message}</p>}
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block mb-1.5 font-medium text-gray-700">Password</label>
                                <div className="relative w-full">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </span>
                                    <input id="password" type="password" placeholder="••••••••" {...register("password", {required: "Password is required", minLength: {value: 6, message: "Password must be at least 6 characters"}})}
                                        className={`w-full pl-11 pr-3 py-2.5 border rounded-lg bg-gray-50/50 focus:outline-none focus:ring-2 transition-all duration-200 ${errors.password? 'border-red-400 focus:ring-red-300':'border-gray-200 focus:ring-pink-300 focus:border-pink-300'}`}
                                    />
                                </div>
                                <PasswordStrengthIndicator password={password} />
                                {errors.password&&<p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1.5 font-medium text-gray-700">Date of Birth</label>
                                    <Controller name="dateOfBirth" control={control} rules={{required: "Date of Birth is required"}}
                                        render={({field}) => (
                                            <DatePicker selected={field.value} onChange={field.onChange} placeholderText="Select date"
                                                className={`w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 bg-gray-50/50 ${errors.dateOfBirth? 'border-red-400 focus:ring-red-300':'border-gray-200 focus:ring-pink-300 focus:border-pink-300'}`}
                                                dateFormat="dd-MM-yyyy" showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100} maxDate={new Date()}
                                            />
                                        )}
                                    />
                                    {errors.dateOfBirth&&<p className="text-red-500 text-sm mt-1">{errors.dateOfBirth.message}</p>}
                                </div>
                                <div>
                                    <label className="block mb-1.5 font-medium text-gray-700">Gender</label>
                                    <Controller name="gender" control={control} rules={{required: "Gender is required"}}
                                        render={({field}) => (
                                            <Select {...field} options={[{value: "Female", label: "Female"}, {value: "Other", label: "Other"}]}
                                                placeholder="Select..." styles={selectCustomStyles}
                                                value={field.value? {value: field.value, label: field.value}:null}
                                                onChange={(option) => field.onChange(option.value)}
                                            />
                                        )}
                                    />
                                    {errors.gender&&<p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                                </div>
                            </div>
                            <button type="submit" disabled={!isEmailVerified||!isPhoneVerified} className="mt-4 w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed disabled:shadow-none">
                                Register
                            </button>
                            <p className="text-xs text-center text-gray-500">By registering, you agree to our Terms and Conditions.</p>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default SaheliBasicRegistration;

