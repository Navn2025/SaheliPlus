import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

const PrivateRoute=({element: Element, role}) =>
{
    const {isAuthenticated, user}=useSelector((state) => state.auth);
    const navigate=useNavigate();

    useEffect(() =>
    {
        if (!isAuthenticated)
        {
            navigate('/login');
        } else if (role&&user?.role!==role)
        {
            navigate(user?.role==='saheli'? '/saheli-dashboard':'/customer-dashboard');
        }
    }, [isAuthenticated, user, navigate, role]);

    if (!isAuthenticated)
    {
        return null;
    }

    return <Element />;
};

export default PrivateRoute;
