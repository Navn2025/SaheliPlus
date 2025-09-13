import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useForm} from 'react-hook-form';
import
{
  PlusCircle,
  Users,
  Wallet,
  TrendingUp,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import
{
  AddSaheliService,
  GetSaheliBookings,
  ApproveSaheliBooking,
  GetServicesRequired,
} from '../../../store/actions/SaheliActions';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import SaheliCirclePage from '../../../components/SaheliCircle';

function SaheliDashboard()
{
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const {services, bookings, servicesRequired, loading, error}=useSelector(
    (state) => state.saheli
  );

  const [user, setUser]=useState(null);
  const [isServiceFormVisible, setIsServiceFormVisible]=useState(false);
  const [activeTab, setActiveTab]=useState('dashboard');

  const {register, handleSubmit, reset, formState: {errors}}=useForm();

  // Load user from localStorage safely
  useEffect(() =>
  {
    const storedUser=localStorage.getItem('user');
    if (storedUser)
    {
      try
      {
        setUser(JSON.parse(storedUser));
      } catch (err)
      {
        console.error('Error parsing user:', err);
      }
    }
  }, []);

  // Load bookings and services on mount
  useEffect(() =>
  {
    dispatch(GetSaheliBookings());
    dispatch(GetServicesRequired());
  }, [dispatch]);

  const onAddService=async (data) =>
  {
    try
    {
      await dispatch(AddSaheliService(data)).unwrap();
      toast.success('Service added successfully!');
      reset();
      setIsServiceFormVisible(false);
    } catch (error)
    {
      toast.error('Failed to add service');
    }
  };

  const handleApproveBooking=async (bookingId) =>
  {
    try
    {
      await dispatch(ApproveSaheliBooking(bookingId)).unwrap();
      toast.success('Booking approved successfully!');
      dispatch(GetSaheliBookings()); // Refresh bookings
    } catch (error)
    {
      toast.error('Failed to approve booking');
    }
  };

  const getStatusClass=(status) =>
  {
    switch (status)
    {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const mockStats={
    totalEarnings: 25000,
    thisMonthEarnings: 8500,
    totalBookings: bookings?.length||0,
    activeBookings: bookings?.filter((b) => b.status==='approved').length||0,
    completedBookings: bookings?.filter((b) => b.status==='completed').length||0,
    rating: 4.8,
    reviews: 45,
  };

  // --- RENDER FUNCTIONS ---

  const renderDashboard=() => (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back 👋</h1>
        <p className="text-gray-600">
          Here's what's happening with your services {user?.name||''}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-green-600">₹{mockStats.totalEarnings}</p>
            </div>
            <Wallet className="text-green-500" size={32} />
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold text-blue-600">₹{mockStats.thisMonthEarnings}</p>
            </div>
            <TrendingUp className="text-blue-500" size={32} />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Bookings</p>
              <p className="text-2xl font-bold text-purple-600">{mockStats.activeBookings}</p>
            </div>
            <Users className="text-purple-500" size={32} />
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{mockStats.rating} ⭐</p>
            </div>
            <Star className="text-yellow-500" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30 mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Bookings</h3>
        {loading? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ):bookings?.length>0? (
          <div className="space-y-4">
            {bookings.slice(0, 5).map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Calendar className="text-gray-500" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">
                      {booking.serviceName||'Beauty Service'}
                    </p>
                    <p className="text-sm text-gray-600">{booking.customerName||'Customer'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                  {booking.status==='pending'&&(
                    <button
                      onClick={() => handleApproveBooking(booking._id)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ):(
          <p className="text-gray-500 text-center py-8">No bookings yet.</p>
        )}
      </div>
    </div>
  );

  const renderServices=() => (
    <div>
      {/* Add Service Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">My Services</h2>
        <button
          onClick={() => setIsServiceFormVisible(true)}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
        >
          <PlusCircle size={20} />
          <span>Add Service</span>
        </button>
      </div>

      {/* Add Service Form */}
      {isServiceFormVisible&&(
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Service</h3>
          <form
            onSubmit={handleSubmit(onAddService)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
              <input
                type="text"
                {...register('serviceName', {required: 'Service name is required'})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
                placeholder="e.g., Bridal Makeup"
              />
              {errors.serviceName&&(
                <p className="text-red-500 text-sm mt-1">{errors.serviceName.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                {...register('category', {required: 'Category is required'})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
              >
                <option value="">Select Category</option>
                <option value="beauty">Beauty & Wellness</option>
                <option value="tailoring">Tailoring & Fashion</option>
                <option value="tutoring">Tutoring & Education</option>
                <option value="care">Care Services</option>
                <option value="transport">Transportation</option>
                <option value="crafts">Crafts & Handmade</option>
                <option value="other">Other</option>
              </select>
              {errors.category&&(
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                {...register('price', {required: 'Price is required', min: 1})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
                placeholder="500"
              />
              {errors.price&&(
                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
              <input
                type="number"
                step="0.5"
                {...register('duration', {required: 'Duration is required'})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
                placeholder="2"
              />
              {errors.duration&&(
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                {...register('description', {required: 'Description is required'})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
                rows={3}
                placeholder="Describe your service..."
              />
              {errors.description&&(
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Service Area */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
              <input
                type="text"
                {...register('serviceArea', {required: 'Service area is required'})}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
                placeholder="e.g., Central Delhi, Gurgaon"
              />
              {errors.serviceArea&&(
                <p className="text-red-500 text-sm mt-1">{errors.serviceArea.message}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-400"
              >
                {loading? 'Adding...':'Add Service'}
              </button>
              <button
                type="button"
                onClick={() =>
                {
                  setIsServiceFormVisible(false);
                  reset();
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{service.serviceName}</h3>
              <span className="text-lg font-bold text-green-600">₹{service.price}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
              <MapPin size={14} />
              <span>{service.serviceArea}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm bg-pink-100 text-pink-800 px-3 py-1 rounded-full">
                {service.category}
              </span>
              <span className="text-sm text-gray-500">{service.duration}h</span>
            </div>
          </div>
        ))}
      </div>

      {(!services||services.length===0)&&!loading&&(
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services yet</h3>
          <p className="text-gray-600 mb-6">Add your first service to start receiving bookings</p>
          <button
            onClick={() => setIsServiceFormVisible(true)}
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Add Your First Service
          </button>
        </div>
      )}
    </div>
  );

  const renderBookings=() => (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Bookings</h2>
      {loading? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      ):bookings?.length>0? (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/30">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Date & Time</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={index} className="border-t border-gray-200/50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {booking.customerName?.[0]||'C'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.customerName||'Customer'}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Phone size={12} className="mr-1" />
                            {booking.customerPhone||'+91 xxxxx xxxxx'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{booking.serviceName||'Beauty Service'}</p>
                      <p className="text-sm text-gray-500">{booking.serviceCategory||'Beauty'}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900">{booking.bookingDate||'2024-12-15'}</p>
                      <p className="text-sm text-gray-500">{booking.bookingTime||'10:00 AM'}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-green-600">₹{booking.amount||'500'}</p>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status||'pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        {booking.status==='pending'&&(
                          <>
                            <button
                              onClick={() => handleApproveBooking(booking._id)}
                              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                            >
                              Accept
                            </button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors">
                              Reject
                            </button>
                          </>
                        )}
                        {booking.status==='approved'&&(
                          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors">
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ):(
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600">Your bookings will appear here once customers start booking your services.</p>
        </div>
      )}
    </div>
  );

  const renderSaheliCircle=() =>
  {
    return <SaheliCirclePage />;
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="mt-20">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/70 backdrop-blur-sm p-1 rounded-lg shadow-xl border border-white/30">
            {[
              {key: 'dashboard', label: 'Dashboard', icon: TrendingUp},
              {key: 'services', label: 'My Services', icon: Star},
              {key: 'bookings', label: 'Bookings', icon: Calendar},
              {key: 'saheliCircle', label: 'Saheli Circle', icon: Users},
            ].map(({key, label, icon: Icon}) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all font-medium ${activeTab===key? 'bg-pink-500 text-white shadow-lg':'text-gray-600 hover:text-gray-800'
                  }`}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab==='dashboard'&&renderDashboard()}
        {activeTab==='services'&&renderServices()}
        {activeTab==='bookings'&&renderBookings()}
        {activeTab==='saheliCircle'&&renderSaheliCircle()}
      </div>
    </div>
  );
}

export default SaheliDashboard;
