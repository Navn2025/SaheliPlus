import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Login from '../pages/auth/Login'
import SaheliBasicRegistration from '../pages/auth/SaheliBasicRegistration'
import SaheliProfileRegistration from '../pages/auth/SaheliProfileCompletion'
import CustomerRegistration from '../pages/auth/CustomerRegister'
import CustomerProfileRegistration from '../pages/auth/CustomerProfileRegistration'
import Choice from '../pages/auth/Choice'
import Home from '../pages/home/Home'
import CustomerDashboard from '../pages/home/CustomerHome/CustomerDashboard'
import CustomerServices from '../pages/home/CustomerHome/CustomerServices'
import SaheliDashboard from '../pages/home/SaheliHome/SaheliDashboard'
import SaheliCirclePage from '../components/SaheliCircle'
import SafetyDashboard from '../components/CrowdSourceDataCollection'



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
            <Route path='/' element={<Home />} />
            <Route path='/customer-dashboard' element={<CustomerDashboard />} />
            <Route path='/customer-services' element={<CustomerServices />} />
            <Route path='/saheli-dashboard' element={<SaheliDashboard />} />
            <Route path='/saheli-circle' element={<SaheliCirclePage />} />
            <Route path='/safety-map' element={<SafetyDashboard />} />



        </Routes>
    )
}

export default MainRoutes
