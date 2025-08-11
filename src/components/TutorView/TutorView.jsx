import React, {useState, useEffect} from 'react'
import "./TutorView.css"

//images & icons

//intercomponent imports
import Header from '../Header/Header'
import TutorSessions from '../Sessions/TutorSessions'
import { fetchSpecificTutor } from '../general/helper'

//external dependenices
import { useQuery } from '@tanstack/react-query'
import { Button, Loader } from '@chakra-ui/react'
import { Link } from 'react-router-dom'




const TutorView = () => {

  //0. determing whether or not user is tutor
    const [authorized, setAuthorized]  = useState(false)
    const [tutorObject, setTutorObject] = useState(null)

    const {data:tutorViewData, isFetched:tutorViewFetched} = useQuery({
        queryKey:['tutor-view-fetch'],
        queryFn:async() => fetchSpecificTutor(),
        staleTime:0
    })

    useEffect(() =>{
        if (tutorViewData){
            setAuthorized(tutorViewData.accessGranted)
            setTutorObject(tutorViewData.tutorObject)
        }
    }, [tutorViewData])



  //1. rendering current & past sessions  
  return (
    <div className='tutor-view-shell'>
        <Header />
        {
            tutorViewFetched === false 
            ?
            <Loader className='loader-area' boxSize={15}/>
            :
            (
                authorized === true 
                ?
                <TutorSessions />
                :
                <div className='forbidden-area'>
                    <h1>this area is for tutors only 🔒</h1>
                    <p>If your looking to book a tutor or view your appointments, press the buttons below!</p>
                    <div className="button-navigation">
                        <Link to="/booking"><Button>Book a Tutor</Button></Link>
                        <Link to="/sessions"><Button>View Sessions</Button></Link>
                    </div>

                </div>
            )
        }


    </div>
  )
}

export default TutorView