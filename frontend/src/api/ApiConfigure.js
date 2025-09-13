import axios from 'axios';

function getCookie(name)
{
    const value=`; ${document.cookie}`;
    const parts=value.split(`; ${name}=`);
    if (parts.length===2) return parts.pop().split(';').shift();
}

const instance=axios.create({
    baseURL: 'https://saheliplus-3.onrender.com/',
    withCredentials: true
});

// Attach token from cookie if present
instance.interceptors.request.use(
    (config) =>
    {
        const token=getCookie('token');
        if (token)
        {
            config.headers['Authorization']=`Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default instance;
