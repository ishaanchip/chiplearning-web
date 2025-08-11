import React, {useState, useEffect} from 'react'
import "./Booking.css"

//images & icons

//intercomponent imports
import Header from '../Header/Header'
import Filter from './Filter';
import TutorCatalog from './TutorCatalog';
import { fetchAccount } from '../general/helper';
import { DAYS } from './bookingHelper';

//external dependenices



const Booking = () => {

  //1. saving state of what user filter by
    const [classSelection ,setClassSelection] = useState(["AP Calculus AB", "AP Calculus BC", "AP Computer Science", "AP Macroeconomics", "AP Microeconomics","SAT English", "SAT Math"]);
    const [daySelection, setDaySelection] = useState(DAYS);  
  return (
    <div className='booking-shell'>
      <Header />
      <div className="booking-area">
        <Filter classSelection={classSelection} setClassSelection={setClassSelection} daySelection={daySelection} setDaySelection={setDaySelection} isMini={false}/>
        <TutorCatalog classSelection={classSelection} daySelection={daySelection} setClassSelection={setClassSelection} setDaySelection={setDaySelection}/>
      </div>
    </div>
  )
}

export default Booking