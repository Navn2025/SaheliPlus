import React, {useEffect, useState} from "react";
import {useForm, useFieldArray} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify';
import {UpdateSaheliProfile} from "../../store/actions/SaheliActions";
import {useDispatch} from "react-redux";

const StepIndicator=({currentStep}) =>
{
    const steps=['Personal Details', 'Services Offered', 'Safety & Verification'];
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

const SaheliProfileRegistration=() =>
{
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {register, handleSubmit, control, formState: {errors}, watch, trigger}=useForm({
        mode: 'onChange',
        defaultValues: {
            servicesOffered: [{title: "", description: "", price: "", duration: ""}]
        }
    });

    const [isFormVisible, setIsFormVisible]=useState(false);
    const [currentStep, setCurrentStep]=useState(1);

    const {fields, append, remove}=useFieldArray({
        control,
        name: "servicesOffered"
    });

    useEffect(() =>
    {
        setIsFormVisible(true);
    }, []);

    const onSubmit=(data) =>
    {

        const finalData={
            ...data,
            skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
            languages: data.languages.split(',').map(l => l.trim()).filter(Boolean),
        };

        // Build FormData
        const formData=new FormData();

        // Append files (if selected)

        if (data.idProof?.[0])
        {
            formData.append("idProof", data.idProof[0]);
        }

        // Append other fields
        formData.append("bio", data.bio||"");
        formData.append("experienceYears", data.experienceYears||0);

        // stringify arrays/objects
        formData.append("skills", JSON.stringify(finalData.skills));
        formData.append("languages", JSON.stringify(finalData.languages));
        formData.append("servicesOffered", JSON.stringify(data.servicesOffered||[]));
        formData.append("address", JSON.stringify(data.address||{}));
        formData.append("emergencyContact", JSON.stringify(data.emergencyContact||{}));

        // Dispatch with FormData
        dispatch(UpdateSaheliProfile(formData)).then((res) =>
        {
            if (res.error)
            {

                toast.error(res.message||"Failed to update profile.");
                return;
            }
            toast.success("Profile updated successfully!");
            navigate("/saheli-dashboard");

        }
        )


            .catch((err) =>
            {
                toast.error("An error occurred. Please try again.");
                console.error(err);
            }

            );
    }

    const handleNextStep=async () =>
    {
        let fieldsToValidate=[];
        if (currentStep===1)
        {
            fieldsToValidate=['address.street', 'address.city', 'address.state', 'address.pincode', 'bio', 'skills', 'languages', 'experienceYears'];
        } else if (currentStep===2)
        {
            fieldsToValidate=['servicesOffered'];
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
                <main className={`w-full image mx-auto rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5 transition-all duration-1000 ${isFormVisible? 'opacity-100 translate-y-0':'opacity-0 translate-y-5'}`}>

                    {/* Left Section */}
                    <div className="hidden lg:col-span-2 lg:flex flex-col items-center justify-center p-8 sm:p-12">

                        <div className="hidden bg-white/30 backdrop-blur-xl lg:col-span-2 lg:flex flex-col items-center justify-center p-8 text-center rounded-2xl shadow-lg">
                            <h1 className="text-4xl font-bold text-white mb-4">Complete Your Profile</h1>
                            <p className="text-gray-900 text-lg">
                                Sharing more about yourself helps build trust and connects you with the right opportunities.
                            </p>
                            <svg className="w-40 h-40 mt-8 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Right Section - Form */}
                    <div className="lg:col-span-3 bg-white/30 backdrop-blur-xl p-8 sm:p-10 md:p-12">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <StepIndicator currentStep={currentStep} />

                            {/* Step 1: Personal Details */}
                            {currentStep===1&&(
                                <div className="flex flex-col gap-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Personal Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input {...register("address.street", {required: true})} placeholder="Street" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                        <input {...register("address.city", {required: true})} placeholder="City" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                        <input {...register("address.state", {required: true})} placeholder="State" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                        <input {...register("address.pincode", {required: true, pattern: /^\d{6}$/})} placeholder="Pincode" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                    </div>
                                    <textarea {...register("bio", {required: true, maxLength: 300})} placeholder="Short Bio (max 300 chars)" rows="3" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none"></textarea>
                                    <input {...register("skills", {required: true})} placeholder="Skills (e.g., Tailoring, Cooking)" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                    <input {...register("languages", {required: true})} placeholder="Languages (e.g., Hindi, English)" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                    <input type="number" {...register("experienceYears", {required: true, valueAsNumber: true, min: 0})} placeholder="Years of Experience" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                </div>
                            )}

                            {/* Step 2: Services Offered */}
                            {currentStep===2&&(
                                <div className="flex flex-col gap-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Services You Offer</h3>
                                    {fields.map((item, index) => (
                                        <div key={item.id} className="p-4 border border-rose-100 rounded-lg space-y-3 relative">
                                            <input {...register(`servicesOffered.${index}.title`, {required: true})} placeholder="Service Title" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            <textarea {...register(`servicesOffered.${index}.description`, {required: true})} placeholder="Service Description" rows="2" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none"></textarea>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input type="number" {...register(`servicesOffered.${index}.price`, {required: true, valueAsNumber: true})} placeholder="Price (INR)" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                                <input {...register(`servicesOffered.${index}.duration`, {required: true})} placeholder="Duration (e.g., 1 hour)" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            </div>
                                            {fields.length>1&&(
                                                <button type="button" onClick={() => remove(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => append({title: "", description: "", price: "", duration: ""})} className="text-sm font-semibold text-rose-500 hover:text-rose-600 self-start">
                                        + Add Another Service
                                    </button>
                                </div>
                            )}

                            {/* Step 3: Safety & Verification */}
                            {currentStep===3&&(
                                <div className="flex flex-col gap-y-4">
                                    <h3 className="text-xl font-semibold text-gray-800">Safety & Verification</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof (e.g., Aadhar, Voter ID)</label>
                                        <input type="file" {...register("idProof", {required: true})} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Emergency Contact</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input {...register("emergencyContact.name", {required: true})} placeholder="Contact Name" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            <input {...register("emergencyContact.phone", {required: true, pattern: /^\d{10}$/})} placeholder="Contact Phone" className="w-full p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                            <input {...register("emergencyContact.relation", {required: true})} placeholder="Relation" className="w-full md:col-span-2 p-2.5 rounded-lg bg-white/20 focus:ring-2 focus:ring-pink-400 outline-none" />
                                        </div>
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
                                    {currentStep<3? (
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

export default SaheliProfileRegistration;
