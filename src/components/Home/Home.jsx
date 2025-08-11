import React, {useState, useEffect} from 'react'
import "./Home.css"

//images & icons
import { CiApple } from 'react-icons/ci';
import { FaEye } from 'react-icons/fa';
import { BiPurchaseTag } from 'react-icons/bi';

//intercomponent imports
import Header from '../Header/Header'
import { fetchAccount, createTutorAccount, courseOfferingDisplay } from '../general/helper';
import { handleLoginAccount } from './homeHelper';


//external dependenices
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, useUser as clerkUseUser, useClerk } from "@clerk/clerk-react";
import { Icon, Button, Text, Container } from '@chakra-ui/react';
import { Link } from 'react-router-dom';





const Home = () => {
    //0. array holding all names of courses offered  
    const COURSE_OFFERINGS = Object.keys(courseOfferingDisplay) 

    //1.creating || logging into account [creation of jwt token]
        const [localToken, setLocalToken] = useState(null)
        //clerk status
        const {user, isSignedIn} = clerkUseUser()
        useEffect(()=>{
            if (isSignedIn){
                handleAccountSetUp()
            }
        }, [isSignedIn])

        //put handle login account in another nested function so that results can acc be saved as value, not as promise
        const handleAccountSetUp = async() =>{
            let result = await handleLoginAccount(user.emailAddresses[0].emailAddress, user.firstName, user.lastName)
            localStorage.setItem('token', result)
            setLocalToken(result)
        }


  return (
    <div className='home-shell'>
        <Header localToken={localToken}/>
        <Container className="main-description">
            <h1>Tutoring Reimagined</h1>
            <p>Personalized tutoring free of charge - Powered by students who have taken the class.</p>
            <SignedOut>
                <SignUpButton  mode="modal" className='sign-up'></SignUpButton>
            </SignedOut>
            <Container className="offering-display">
                <h3>ChipLearning offers tutoring in</h3>
                {COURSE_OFFERINGS.map((COURSE, index) =>(
                    <Button  key={index}>
                        <Icon as={courseOfferingDisplay[COURSE].icon} boxSize={8} color={courseOfferingDisplay[COURSE].color}  />
                        <Text color={'blackAlpha.900'} style={{fontWeight:'600'}}>{COURSE}</Text>
                    </Button>
                ))}
            </Container>
            <div className="bottom-navigation">
                <Link to="/booking" className="bottom-option"><Icon as={BiPurchaseTag} boxSize={6} style={{color:'black', background:'none'}}/><p>Book Tutors</p></Link>
                <Link to="/sessions" className="bottom-option"> <Icon as={FaEye} boxSize={6} style={{color:'black', background:'none'}}/><p>View Sessions</p></Link>
                <Link to="/tutor-view" className="bottom-option"><Icon as={CiApple} boxSize={6} style={{color:'black', background:'none'}}/><p>Tutor Dashboard</p></Link>
            </div>
        </Container>
        <div className="stats">
            <div className="stat">
                <h1>100+ hr</h1>
                <p>combined tutoring experience</p>
            </div>
            <div className="stat">
                <h1>5</h1>
                <p>dedicated tutors at your disposal</p>
            </div>
            <div className="stat">
                <h1>20</h1>
                <p>detailed content articles</p>
            </div>
        </div>



    </div>
  )
}

export default Home