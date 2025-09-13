import React, {useEffect, useState} from "react";
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import {useDispatch} from "react-redux";
import saheliLogo from "../assets/saheliLogo.png";
import {Menu, X, User, LogOut, Settings, Bell} from "lucide-react";
import {logoutUser} from '../store/actions/CommonActions';
import PoliceLocator from "./Police";

const Navbar=() =>
{
    const [isOpen, setIsOpen]=useState(false);
    const [showUserMenu, setShowUserMenu]=useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const [user, setUser]=useState(null);
    const location=useLocation();

    useEffect(() =>
    {
        const storedUser=localStorage.getItem("user");
        if (storedUser)
        {
            try
            {
                setUser(JSON.parse(storedUser));
            } catch (err)
            {
                console.error("Error parsing user:", err);
            }
        }
    }, []);

    useEffect(() =>
    {
        // Only auto-redirect after login when user is on public entry pages
        if (!user) return;
        const publicEntryPaths=['/', '/login', '/choice', '/register/saheli', '/register/customer'];
        if (!publicEntryPaths.includes(location.pathname)) return;

        const role=user?.role||user?.userType||user?.user?.role||user?.user?.user?.role;
        const target=role==='saheli'? '/saheli-dashboard':'/customer-dashboard';
        if (location.pathname!==target) navigate(target);
    }, [user, navigate, location.pathname]);

    const publicNavItems=[
        {name: "Home", path: "/"},
        {name: "Services", path: "/customer-services"},
        {name: "Safety Map", path: "/safety-map"},
        {name: "About", path: "/about"},
        {name: "Contact", path: "/contact"},
    ];

    const customerNavItems=[
        {name: "Dashboard", path: "/customer-dashboard"},
        {name: "Services", path: "/customer-services"},
        {name: "Safety Map", path: "/safety-map"},
        {name: "My Bookings", path: "/customer-bookings"},
        {name: "Favorites", path: "/customer-favorites"},
    ];

    const saheliNavItems=[
        {name: "Dashboard", path: "/saheli-dashboard"},
        {name: "My Services", path: "/saheli-services"},
        {name: "Safety Map", path: "/safety-map"},
        {name: "Bookings", path: "/saheli-bookings"},
        {name: "Earnings", path: "/saheli-earnings"},
    ];

    const getNavItems=() =>
    {
        if (user?.userType==='customer') return customerNavItems;
        if (user?.userType==='saheli') return saheliNavItems;
        return publicNavItems;
    };

    const handleLogout=async () =>
    {
        try
        {
            await dispatch(logoutUser()).unwrap();
        } catch (error)
        {
            console.error('Logout error:', error);
        } finally
        {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            setShowUserMenu(false);
            navigate('/');
        }
    };

    const navItems=getNavItems();

    return (
        <nav className="fixed top-0 left-0 w-full backdrop-blur-2xl bg-black/60 text-white shadow-lg z-50">
            <div className="mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-2xl flex gap-2 font-extrabold tracking-wide cursor-pointer items-center">
                    <img className="h-10 w-10 rounded-full shadow-md" src={saheliLogo} alt="logo" />
                    <span className="text-pink-400">Saheli</span>
                    <span className="text-pink-300">+</span>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({isActive}) =>
                                `transition text-lg ${isActive? "text-pink-400 font-semibold":"hover:text-pink-300"}`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden md:flex items-center space-x-4">
                    {user? (
                        <div className="relative flex items-center gap-3">
                            <PoliceLocator />
                            <button className="p-2 hover:bg-white/10 rounded-full relative">
                                <Bell size={20} />
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                            </button>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-sm font-semibold">
                                    {user.name?.[0]||user.email?.[0]||'U'}
                                </div>
                                <span className="font-medium">{user.name||'User'}</span>
                            </button>

                            {showUserMenu&&(
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-xs text-pink-600 capitalize">{user.userType}</p>
                                    </div>
                                    <NavLink
                                        to={user.userType==='saheli'? '/saheli-profile':'/customer-profile'}
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <User size={16} />
                                        <span>Profile</span>
                                    </NavLink>
                                    <NavLink
                                        to="/settings"
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ):(
                        <div className="flex items-center space-x-3">
                            <PoliceLocator />
                            <NavLink to="/login" className="text-white hover:text-pink-300 font-medium">
                                Login
                            </NavLink>
                            <NavLink to="/choice">
                                <button className="bg-pink-500  text-white font-semibold px-5 py-2 rounded-full shadow-md hover:bg-pink-400">
                                    Join Now
                                </button>
                            </NavLink>
                        </div>
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="p-2 rounded-md hover:bg-white/10">
                        {isOpen? <X size={28} />:<Menu size={28} />}
                    </button>
                </div>
            </div>

            {isOpen&&(
                <div className="md:hidden fixed inset-0 bg-black/60 z-40 flex flex-col items-center justify-start pt-20">
                    <div className="w-full max-w-md bg-[#111827] rounded-b-2xl text-white flex flex-col items-center space-y-4 py-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({isActive}) =>
                                    `block w-full py-3 text-center transition text-lg ${isActive? "text-pink-400 font-semibold":"hover:text-pink-300"}`
                                }
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
