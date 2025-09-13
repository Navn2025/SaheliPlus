import React, {useState, useEffect} from 'react';
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from 'react-redux';
// import {addCustomerService} from '../../../store/reducers/servicesSlice';
import {fetchCustomerBookings} from '../../../store/reducers/bookingsSlice';
import {PlusCircle, ShoppingBag, Wallet, Bell, HelpCircle, Star, UserCircle, Settings} from "lucide-react";

const CustomerDashboard=() =>
{
    const [isFormVisible, setIsFormVisible]=useState(false);
    const [showSuccessMessage, setShowSuccessMessage]=useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors},
    }=useForm();

    const dispatch=useDispatch();
    const auth=useSelector(state => state.auth||{});
    const bookingsState=useSelector(state => state.bookings||{});

    useEffect(() =>
    {
        const customerId=auth.user?._id||auth.user?.id;
        if (customerId)
        {
            dispatch(fetchCustomerBookings({customerId}))
        }
    }, [auth.user, dispatch]);

    const onSubmit=async (data) =>
    {
        try
        {
            const customerId=auth.user?._id||auth.user?.id;
            if (!customerId)
            {
                // optionally show toast or redirect to login
                console.error('No customer id available in auth state')
                return;
            }

            const payload={
                title: data.serviceName,
                description: data.description,
                price: data.price,
                duration: 1,
                location: {latitude: null, longitude: null}
            }

            // await dispatch(addCustomerService({customerId, payload})).unwrap();

            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 4000);
            reset();
            setIsFormVisible(false);
            // refresh bookings
            dispatch(fetchCustomerBookings({customerId}));
        } catch (err)
        {
            console.error('Failed to submit service request', err);
        }
    };

    const availableServices=[
        {id: 1, name: "Beauty Service", desc: "Makeup, salon & grooming", icon: "💄", rating: 4.8, reviews: 120},
        {id: 2, name: "Tailoring", desc: "Custom stitching & alterations", icon: "🧵", rating: 4.9, reviews: 85},
        {id: 3, name: "Cab Service", desc: "Safe rides across the city", icon: "🚖", rating: 4.7, reviews: 210},
        {id: 4, name: "Handmade Products", desc: "Buy from local women", icon: "👜", rating: 5.0, reviews: 45},
    ];

    const myBookings=bookingsState.list?.length? bookingsState.list:[
        {id: 1, service: "Custom Blouse Stitching", provider: "Rina's Boutique", date: "2025-09-15", status: "Pending"},
        {id: 2, service: "Evening Makeup", provider: "Gloss & Glam", date: "2025-09-10", status: "Completed"},
        {id: 3, service: "Airport Cab Ride", provider: "SheSafe Cabs", date: "2025-09-08", status: "Cancelled"},
    ];

    const getStatusClass=(status) =>
    {
        switch (status)
        {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Completed': return 'bg-green-100 text-green-800';
            case 'Cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen px-4 sm:px-6 py-10">

            {/* 1. Welcome & Overview */}
            <div className="flex flex-col mt-20 sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 drop-shadow-md">Hi Navneet, Welcome back to Saheli+!</h1>
                    <p className="text-gray-700 mt-1">Here’s a summary of your account.</p>
                </div>
                <a href="#" className="mt-4 sm:mt-0 flex items-center gap-3 p-2 bg-white/70 backdrop-blur-sm border border-white/30 rounded-full shadow-lg hover:shadow-xl transition">
                    <UserCircle size={40} className="text-purple-500" />
                    <div>
                        <p className="font-semibold text-gray-800">Navneet K.</p>
                        <p className="text-xs text-gray-500">View Profile & Settings</p>
                    </div>
                    <Settings size={20} className="text-gray-400 mr-2" />
                </a>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl flex items-center gap-4 hover:shadow-2xl transition cursor-pointer">
                    <ShoppingBag className="text-pink-500" size={32} />
                    <div>
                        <h4 className="font-semibold text-gray-800">My Bookings</h4>
                        <p className="text-sm text-gray-600">3 Active</p>
                    </div>
                </div>
                <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl flex items-center gap-4 hover:shadow-2xl transition cursor-pointer">
                    <Wallet className="text-pink-500" size={32} />
                    <div>
                        <h4 className="font-semibold text-gray-800">Wallet</h4>
                        <p className="text-sm text-gray-600">₹ 1,250 Balance</p>
                    </div>
                </div>
                <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl flex items-center gap-4 hover:shadow-2xl transition cursor-pointer">
                    <Bell className="text-pink-500" size={32} />
                    <div>
                        <h4 className="font-semibold text-gray-800">Notifications</h4>
                        <p className="text-sm text-gray-600">2 Unread</p>
                    </div>
                </div>
                <div className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl flex items-center gap-4 hover:shadow-2xl transition cursor-pointer">
                    <HelpCircle className="text-pink-500" size={32} />
                    <div>
                        <h4 className="font-semibold text-gray-800">Support</h4>
                        <p className="text-sm text-gray-600">Get help anytime</p>
                    </div>
                </div>
            </div>

            {/* 2. Create / Request Service */}
            <div className="mb-10">
                {!isFormVisible&&(
                    <button onClick={() => setIsFormVisible(true)} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-6 py-4 rounded-lg hover:opacity-90 transition duration-300 shadow-xl flex items-center justify-center text-lg">
                        <PlusCircle size={22} className="mr-2" /> Create a New Service Request
                    </button>
                )}
            </div>

            {showSuccessMessage&&(
                <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg" role="alert">
                    <p className="font-bold">Success!</p><p>Your service request has been submitted.</p>
                </div>
            )}

            {isFormVisible&&(
                <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl transition-all duration-500">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2"><PlusCircle size={22} className="text-pink-500" /> Create Service Request</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Service Name</label>
                            <input type="text" {...register("serviceName", {required: "Service name is required"})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50" placeholder="e.g., Evening Makeup" />
                            {errors.serviceName&&(<p className="text-red-500 text-sm mt-1">{errors.serviceName.message}</p>)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Location / Address</label>
                            <input type="text" {...register("location", {required: "Location is required"})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50" placeholder="Your full address" />
                            {errors.location&&(<p className="text-red-500 text-sm mt-1">{errors.location.message}</p>)}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea {...register("description", {required: "Description is required"})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50" placeholder="Enter service details" />
                            {errors.description&&(<p className="text-red-500 text-sm mt-1">{errors.description.message}</p>)}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                            <input type="number" {...register("price")} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50" placeholder="Offer a price (optional)" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input type="datetime-local" {...register("datetime", {required: "Date and time are required"})} className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50" />
                            {errors.datetime&&(<p className="text-red-500 text-sm mt-1">{errors.datetime.message}</p>)}
                        </div>
                        <div className="md:col-span-2 flex items-center gap-4 pt-2">
                            <button type="submit" className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-semibold shadow-md hover:bg-pink-400 transition">Submit Request</button>
                            <button type="button" onClick={() => setIsFormVisible(false)} className="w-full bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* 3. Available Services */}
            <div className="mt-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 drop-shadow-md">Available Services (Marketplace)</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {availableServices.map((service) => (
                        <div key={service.id} className="p-6 bg-white/70 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl flex flex-col justify-between hover:shadow-2xl transition cursor-pointer">
                            <div>
                                <div className="text-4xl">{service.icon}</div>
                                <h3 className="text-xl font-bold mt-3 text-pink-600">{service.name}</h3>
                                <p className="text-gray-700 text-sm mt-1">{service.desc}</p>
                                <div className="flex items-center mt-3 text-sm text-yellow-500">
                                    <Star size={16} className="fill-current" />
                                    <span className="text-gray-800 font-bold ml-1">{service.rating}</span>
                                    <span className="text-gray-600 ml-2">({service.reviews} reviews)</span>
                                </div>
                            </div>
                            <button className="mt-4 w-full px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-400 transition font-semibold">Book Now</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. My Bookings */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 drop-shadow-md">My Bookings</h2>
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-white/30">
                                    <th className="text-left p-4 font-semibold text-gray-700">Service</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Provider</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Date</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myBookings.map(booking => (
                                    <tr key={booking.id} className="border-b border-white/30 last:border-none">
                                        <td className="p-4 font-medium text-gray-800">{booking.service}</td>
                                        <td className="p-4 text-gray-600">{booking.provider}</td>
                                        <td className="p-4 text-gray-600">{booking.date}</td>
                                        <td className="p-4"><span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(booking.status)}`}>{booking.status}</span></td>
                                        <td className="p-4 space-x-2">
                                            {booking.status==='Pending'&&<button className="text-sm text-red-500 hover:underline font-semibold">Cancel</button>}
                                            {booking.status==='Completed'&&<button className="text-sm text-purple-600 hover:underline font-semibold">Leave Review</button>}
                                            {booking.status==='Completed'&&<button className="text-sm text-pink-500 hover:underline font-semibold">Re-Book</button>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    );
};
export default CustomerDashboard;