import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Login from '../pages/auth/Login'
import SaheliBasicRegistration from '../pages/auth/SaheliBasicRegistration'
import SaheliProfileRegistration from '../pages/auth/SaheliProfileCompletion'
import CustomerRegistration from '../pages/auth/CustomerRegister'
import CustomerProfileRegistration from '../pages/auth/CustomerProfileRegistration'
import Choice from '../pages/auth/Choice'
import Home from '../pages/home/Home'



const MainRoutes=() =>
{
    return (
        <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/choice" element={<Choice />} />
            <Route path="/register/saheli" element={<SaheliBasicRegistration />} />
            <Route path="/register/saheli/profile" element={<SaheliProfileRegistration />} />
            <Route path="/register/customer" element={<CustomerRegistration />} />
            <Route path="/register/customer/profile" element={<CustomerProfileRegistration />} />



        </Routes>
    )
}

export default MainRoutes
