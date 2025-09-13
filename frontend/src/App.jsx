import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useDispatch, useSelector} from 'react-redux'

import MainRoutes from './routes/MainRoutes'
import Navbar from './components/Navbar'
import {getUserDetails} from './store/actions/CommonActions'
import {useEffect} from 'react'
import VoiceSOSAlwaysOn from './components/VoiceActivation'


const App=() =>
{
  const dispatch=useDispatch();
  const user=useSelector((state) => state);
  console.log(user);

  useEffect(() =>
  {
    dispatch(getUserDetails());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <VoiceSOSAlwaysOn />
      {/* <SafetyMap /> */}

      <MainRoutes />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App
