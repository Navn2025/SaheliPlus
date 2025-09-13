// src/redux/store.js
import {configureStore} from '@reduxjs/toolkit'
import saheliReducer from "./reducers/SaheliSlice";
import customerReducer from "./reducers/CustomerSlice";
import authReducer from './reducers/AuthSlice'; // The new consolidated slice
import userSlice from './reducers/UserSlice'; // The new consolidated slice
import servicesReducer from './reducers/servicesSlice'
import bookingsReducer from './reducers/bookingsSlice'

const store=configureStore({
    reducer: {
        // The single 'auth' slice replaces 'login' and 'user'
        auth: authReducer,
        saheli: saheliReducer,
        customer: customerReducer,
        user: userSlice,
        services: servicesReducer,
        bookings: bookingsReducer
    }
});

export default store;