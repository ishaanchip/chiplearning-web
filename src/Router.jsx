import React from 'react'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import Booking from './components/Booking/Booking.jsx'
import ClientSessions from './components/Sessions/ClientSessions.jsx'
import TutorView from './components/TutorView/TutorView.jsx'

const Router = () => {
return (
  <BrowserRouter basename='/'>
      <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/booking" element={<Booking />}></Route>
          <Route path="/sessions" element={<ClientSessions />}></Route>
          <Route path="/tutor-view" element={<TutorView />}></Route>


          {/* <Route path="/construction" element={<Construction/>}></Route> */}
      </Routes>
  </BrowserRouter>
)


}


export default Router