import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import {UpdateCustomerProfile} from "../../store/actions/CustomerActions";

const StepIndicator=({currentStep}) =>
{
    const steps=['Personal Information', 'Preferences & Safety'];
    return (
        <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) =>
            {
                const stepNumber=index+1;
                const isCompleted=currentStep>stepNumber;
                const isActive=currentStep===stepNumber;

                return (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isActive? 'bg-rose-500 text-white':isCompleted? 'bg-green-500 text-white':'bg-gray-200 text-gray-500'}`}>
                                {isCompleted? '✓':stepNumber}
                            </div>
                            <p className={`mt-2 text-xs text-center ${isActive||isCompleted? 'text-gray-700 font-medium':'text-gray-500'}`}>{step}</p>
                        </div>
                        {stepNumber<steps.length&&<div className={`flex-1 h-1 mx-2 ${isCompleted? 'bg-green-500':'bg-gray-200'}`}></div>}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const CustomerProfileRegistration=() =>
{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {register, handleSubmit, formState: {errors}, trigger}=useForm({
        mode: 'onChange',
    });

    const [isFormVisible, setIsFormVisible]=useState(false);
    const [currentStep, setCurrentStep]=useState(1);

    useEffect(() =>
    {
        setIsFormVisible(true);
    }, []);

    const onSubmit=(data) =>
    {
        // Process preferences from a comma-separated string into an array
        const finalData={
            ...data,
            preferences: data.preferences.split(',').map(p => p.trim()).filter(Boolean),

        };
        dispatch(UpdateCustomerProfile(finalData)).then((res) =>
        {
            if (res.error)
            {
                toast.error(res.error.message||"Profile update failed. Please try again.");
                return;
            }
            toast.success("Profile updated successfully!");
            setTimeout(() =>
            {
                navigate("/");

            }, 1000);

            console.log("Customer Profile Data:", finalData);
        })




    };

    const handleNextStep=async () =>
    {
        let fieldsToValidate=[];
        if (currentStep===1)
        {
            fieldsToValidate=['address.street', 'address.city', 'address.state', 'address.pincode'];
        }

        const isValid=await trigger(fieldsToValidate);
        if (isValid)
        {
            setCurrentStep(prev => prev+1);
        } else
        {
            toast.error("Please fill all required fields before proceeding.");
        }
    };

    const handlePrevStep=() =>
    {
        setCurrentStep(prev => prev-1);
    };


    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
                @import url('https://cdn.jsdelivr.net/npm/react-toastify@9.1.3/dist/ReactToastify.min.css');
                body { font-family: 'Poppins', sans-serif; }
            `}</style>

            <div className="w-full min-h-screen p-4 sm:p-8 flex items-center justify-center bg-white/30 backdrop-blur-xl">
                <main className={`w-full h-full customer-image mx-auto rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5 transition-all duration-1000 ${isFormVisible? 'opacity-100 translate-y-0':'opacity-0 translate-y-5'}`}>

                    {/* Left Section */}
                    <div className="hidden lg:col-span-2 lg:flex flex-col items-center justify-center p-8 sm:p-12">
                        <div className="hidden bg-white/20 backdrop-blur-xl lg:col-span-2 lg:flex flex-col items-center justify-center p-8 text-center rounded-2xl shadow-lg">
                            <h1 className="text-4xl font-bold text-gray-700 mb-4">Welcome!<br /> Complete Your Profile</h1>
                            <svg className="w-40 h-40 mt-8 text-gray-700 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <p className="text-gray-900 text-lg">
                                Tell us a bit about yourself to personalize your experience and ensure safety.
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className="lg:col-span-3  p-5 sm:p-6 md:p-7">
                        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-3 bg-white/30 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-2xl">
                            <StepIndicator currentStep={currentStep} />

                            {/* Step 1: Personal Information */}
                            {currentStep===1&&(
                                <div className="flex flex-col gap-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Your Address</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>

                                            <input {...register("address.street", {required: "Street is required"})} placeholder="Street" className="w-full p-2.5 rounded-lg bg-white/60 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            {errors.address?.street&&<p className="text-red-500 text-xs mt-1">Enter street.</p>}
                                        </div>
                                        <div>


                                            <input {...register("address.city", {required: "City is required"})} placeholder="City" className="w-full p-2.5 rounded-lg bg-white/60 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            {errors.address?.city&&<p className="text-red-500 text-xs mt-1">Enter city.</p>}
                                        </div>
                                        <div>

                                            <input {...register("address.state", {required: "State is required"})} placeholder="State" className="w-full p-2.5 rounded-lg bg-white/60 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            {errors.address?.state&&<p className="text-red-500 text-xs mt-1">Enter state.</p>}
                                        </div>
                                        <div>

                                            <input {...register("address.pincode", {required: "Pincode is required", pattern: /^\d{6}$/})} placeholder="Pincode" className="w-full p-2.5 rounded-lg bg-white/60 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            {errors.address?.pincode&&<p className="text-red-500 text-xs mt-1">Please enter a valid 6-digit pincode.</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Preferences & Safety */}
                            {currentStep===2&&(
                                <div className="flex flex-col gap-y-6">
                                    <h3 className="text-xl font-semibold text-gray-800">Preferences & Safety</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Preferences</label>
                                        <textarea {...register("preferences", {required: true})} placeholder="What services are you interested in? (e.g., Cooking, Cleaning, Childcare)" rows="3" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none"></textarea>
                                        <p className="text-xs text-gray-500 mt-1">Separate preferences with a comma.</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Emergency Contact</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input {...register("emergencyContact.name", {required: true})} placeholder="Contact Name" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            <input {...register("emergencyContact.phone", {required: true, pattern: /^\d{10}$/})} placeholder="Contact Phone (10 digits)" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            <input {...register("emergencyContact.relation", {required: true})} placeholder="Relation" className="w-full md:col-span-2 p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                        </div>
                                        {errors.emergencyContact?.phone&&<p className="text-red-500 text-xs mt-1">Please enter a valid 10-digit phone number.</p>}
                                    </div>
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8">
                                {currentStep>1&&(
                                    <button type="button" onClick={handlePrevStep} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg transition hover:bg-gray-300">
                                        Back
                                    </button>
                                )}
                                <div className="ml-auto">
                                    {currentStep<2? (
                                        <button type="button" onClick={handleNextStep} className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold py-2 px-6 rounded-lg transition shadow-md hover:shadow-lg">
                                            Next
                                        </button>
                                    ):(
                                        <button type="submit" className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-6 rounded-lg transition shadow-md hover:shadow-lg">
                                            Complete Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </>
    );
};

export default CustomerProfileRegistration;