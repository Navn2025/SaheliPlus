import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import MainRoutes from './routes/MainRoutes'
import VoiceSOSAlwaysOn from './components/VoiceActivation'

const App=() =>
{
  return (

    <div>

      <MainRoutes />
      <VoiceSOSAlwaysOn />

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

  )
}

export default App
