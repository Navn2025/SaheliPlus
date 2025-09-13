import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {GetSaheliServices} from '../../../store/reducers/servicesSlice';
import {bookSaheli} from '../../../store/reducers/bookingsSlice';
import {toast} from 'react-toastify';
import {Search, Filter, MapPin, Star, Clock, Phone, Heart, Calendar} from 'lucide-react';

const CustomerServices=() =>
{
  const dispatch=useDispatch();
  // Read services from the new services slice and auth for customer info
  const {offered: servicesOffered, loading}=useSelector(state => state.services||{});
  const auth=useSelector(state => state.auth||{});

  const [searchTerm, setSearchTerm]=useState('');
  const [selectedCategory, setSelectedCategory]=useState('all');
  const [selectedLocation, setSelectedLocation]=useState('all');
  const [priceRange, setPriceRange]=useState([0, 5000]);
  const [sortBy, setSortBy]=useState('rating');
  const [showBookingModal, setShowBookingModal]=useState(false);
  const [selectedService, setSelectedService]=useState(null);
  const [bookingData, setBookingData]=useState({
    date: '',
    time: '',
    address: '',
    notes: ''
  });

  // Load services on component mount
  useEffect(() =>
  {
    dispatch(GetSaheliServices())
      .unwrap()
      .catch(() =>
      {
        // show a toast if fetching services fails
        toast.error('Failed to load services')
      })
  }, [dispatch]);

  // Mock services data (you can remove this when backend is connected)
  const mockServices=[
    {
      _id: '1',
      serviceName: 'Bridal Makeup',
      category: 'beauty',
      price: 2500,
      duration: 3,
      description: 'Professional bridal makeup with premium products',
      serviceArea: 'Delhi, Gurgaon',
      saheliName: 'Priya Sharma',
      saheliPhone: '+91 98765 43210',
      rating: 4.9,
      reviews: 45,
      image: '/api/placeholder/300/200'
    },
    {
      _id: '2',
      serviceName: 'Custom Blouse Stitching',
      category: 'tailoring',
      price: 800,
      duration: 2,
      description: 'Expert blouse stitching with perfect fitting',
      serviceArea: 'Mumbai, Thane',
      saheliName: 'Sunita Devi',
      saheliPhone: '+91 87654 32109',
      rating: 4.8,
      reviews: 32,
      image: '/api/placeholder/300/200'
    },
    {
      _id: '3',
      serviceName: 'Home Tutoring - Mathematics',
      category: 'tutoring',
      price: 500,
      duration: 1.5,
      description: 'Mathematics tutoring for classes 8-12',
      serviceArea: 'Bangalore, Electronic City',
      saheliName: 'Asha Reddy',
      saheliPhone: '+91 76543 21098',
      rating: 4.7,
      reviews: 28,
      image: '/api/placeholder/300/200'
    },
    {
      _id: '4',
      serviceName: 'Elder Care Services',
      category: 'care',
      price: 1200,
      duration: 4,
      description: 'Compassionate elderly care and companionship',
      serviceArea: 'Chennai, Adyar',
      saheliName: 'Meera Lakshmi',
      saheliPhone: '+91 65432 10987',
      rating: 5.0,
      reviews: 18,
      image: '/api/placeholder/300/200'
    },
    {
      _id: '5',
      serviceName: 'Women-Only Cab Service',
      category: 'transport',
      price: 15,
      duration: 0.5,
      description: 'Safe and secure cab service by women drivers',
      serviceArea: 'Pune, Koregaon Park',
      saheliName: 'Kavya Joshi',
      saheliPhone: '+91 54321 09876',
      rating: 4.6,
      reviews: 67,
      image: '/api/placeholder/300/200'
    }
  ];

  // Use mock data if no services from API. Normalize common field names that may differ between mock and backend
  const servicesFromApi=servicesOffered?.length>0? servicesOffered:null;
  const services=(servicesFromApi||mockServices).map(s => ({
    // prefer the fields used in this component (serviceName) but fall back to possible backend names
    ...s,
    serviceName: s.serviceName||s.title||s.serviceTitle||s.name,
    saheliName: s.saheliName||s.saheliName||s.saheliName||s.saheliName,
    saheliId: s.saheliId||s.saheliId||s.saheli||s.saheliId
  }));

  const categories=[
    {value: 'all', label: 'All Categories'},
    {value: 'beauty', label: 'Beauty & Wellness'},
    {value: 'tailoring', label: 'Tailoring & Fashion'},
    {value: 'tutoring', label: 'Tutoring & Education'},
    {value: 'care', label: 'Care Services'},
    {value: 'transport', label: 'Transportation'},
    {value: 'crafts', label: 'Crafts & Handmade'}
  ];

  const locations=[
    {value: 'all', label: 'All Locations'},
    {value: 'delhi', label: 'Delhi NCR'},
    {value: 'mumbai', label: 'Mumbai'},
    {value: 'bangalore', label: 'Bangalore'},
    {value: 'chennai', label: 'Chennai'},
    {value: 'pune', label: 'Pune'}
  ];

  // Filter services based on search and filters
  const filteredServices=services.filter(service =>
  {
    const matchesSearch=service.serviceName.toLowerCase().includes(searchTerm.toLowerCase())||
      service.saheliName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory=selectedCategory==='all'||service.category===selectedCategory;
    const matchesLocation=selectedLocation==='all'||
      service.serviceArea.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesPrice=service.price>=priceRange[0]&&service.price<=priceRange[1];

    return matchesSearch&&matchesCategory&&matchesLocation&&matchesPrice;
  });

  // Sort services
  const sortedServices=[...filteredServices].sort((a, b) =>
  {
    switch (sortBy)
    {
      case 'rating':
        return b.rating-a.rating;
      case 'price_low':
        return a.price-b.price;
      case 'price_high':
        return b.price-a.price;
      case 'reviews':
        return b.reviews-a.reviews;
      default:
        return 0;
    }
  });

  const handleBookService=(service) =>
  {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const handleConfirmBooking=async () =>
  {
    if (!bookingData.date||!bookingData.time||!bookingData.address)
    {
      toast.error('Please fill in all required fields');
      return;
    }

    try
    {
      const bookingPayload={
        customerId: auth.user?._id||auth.user?.id||undefined,
        customerName: auth.user?.name||auth.user?.fullName||undefined,
        notes: bookingData.notes,
        bookingDate: bookingData.date,
        bookingTime: bookingData.time,
        address: bookingData.address,
      };

      // Dispatch booking thunk. The backend route expects POST /:id/bookSaheli/:serviceId where :id is the saheli id
      await dispatch(bookSaheli({saheliId: selectedService.saheliId||selectedService.saheli, serviceId: selectedService._id, payload: bookingPayload})).unwrap();
      toast.success('Booking request sent successfully!');
      setShowBookingModal(false);
      setBookingData({date: '', time: '', address: '', notes: ''});
      setSelectedService(null);
    } catch
    {
      toast.error('Failed to book service');
    }
  };

  const getCategoryIcon=(category) =>
  {
    const icons={
      beauty: '💄',
      tailoring: '🧵',
      tutoring: '📚',
      care: '👩‍⚕️',
      transport: '🚗',
      crafts: '🎨'
    };
    return icons[category]||'🔧';
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10">
      <div className="mt-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Discover Services</h1>
          <p className="text-gray-600">Find trusted women service providers in your area</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/30 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search services or service providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
              >
                {locations.map(location => (
                  <option key={location.value} value={location.value}>{location.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (₹)</label>
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">₹0 - ₹{priceRange[1]}</div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white/50"
              >
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {sortedServices.length} service{sortedServices.length!==1? 's':''}
            {searchTerm&&` for "${searchTerm}"`}
          </p>
        </div>

        {/* Services Grid */}
        {loading? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ):sortedServices.length>0? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedServices.map(service => (
              <div key={service._id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Service Image */}
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-6xl">
                  {getCategoryIcon(service.category)}
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">{service.serviceName}</h3>
                    <button className="text-gray-400 hover:text-pink-500 transition-colors">
                      <Heart size={20} />
                    </button>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center text-yellow-500">
                      <Star size={16} className="fill-current" />
                      <span className="text-gray-800 font-semibold ml-1">{service.rating}</span>
                      <span className="text-gray-600 text-sm ml-1">({service.reviews} reviews)</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

                  {/* Saheli Info */}
                  <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {service.saheliName[0]}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-gray-800">{service.saheliName}</p>
                      <p className="text-sm text-gray-600 flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {service.serviceArea}
                      </p>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      <span>{service.duration}h duration</span>
                    </div>
                    <div className="text-lg font-bold text-green-600">₹{service.price}</div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleBookService(service)}
                      className="flex-1 bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors font-semibold flex items-center justify-center space-x-2"
                    >
                      <Calendar size={16} />
                      <span>Book Now</span>
                    </button>
                    <button className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ):(
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal&&selectedService&&(
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Book Service</h3>

              {/* Service Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-800">{selectedService.serviceName}</h4>
                <p className="text-sm text-gray-600">by {selectedService.saheliName}</p>
                <p className="text-lg font-bold text-green-600 mt-2">₹{selectedService.price}</p>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={bookingData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Address *</label>
                  <textarea
                    value={bookingData.address}
                    onChange={(e) => setBookingData({...bookingData, address: e.target.value})}
                    placeholder="Enter complete address where service is needed"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Notes (Optional)</label>
                  <textarea
                    value={bookingData.notes}
                    onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                    placeholder="Any special requirements or notes for the service provider"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none"
                    rows={2}
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() =>
                  {
                    setShowBookingModal(false);
                    setBookingData({date: '', time: '', address: '', notes: ''});
                    setSelectedService(null);
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium disabled:bg-gray-400"
                >
                  {loading? 'Booking...':'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerServices;
