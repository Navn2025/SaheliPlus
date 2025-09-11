import {configureStore} from '@reduxjs/toolkit'
import SaheliSlice from "./reducers/SaheliSlice";
import CustomerSlice from "./reducers/CustomerSlice";
import LoginSlice from "./reducers/LoginSlice";
const store=configureStore({
    reducer: {

        saheli: SaheliSlice,
        customer: CustomerSlice,
        login: LoginSlice,

    }
});

export default store;