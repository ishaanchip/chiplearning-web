import React, {useState, useEffect} from 'react'
import "./Header.css"

//images & icons
import { TbMail } from "react-icons/tb"; 
import { CgProfile } from 'react-icons/cg';
import { CiApple } from 'react-icons/ci';
import { FaEye } from 'react-icons/fa';
import { BiPurchaseTag } from 'react-icons/bi';


//intercomponent imports
import { checkMail } from './headerHelper';
import { dateToTimeConverter, fetchAccount, updateTutorAccount } from '../general/helper';


//external dependenices
import { SignedIn, SignedOut, SignInButton, SignUpButton, SignOutButton, useUser as clerkUseUser, useClerk } from "@clerk/clerk-react";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Icon, Button, Text, Popover, Portal } from '@chakra-ui/react';





const Header = ({localToken=null}) => {

  //1.sign out assuring clearing of local storage  
  const {signOut} = useClerk()  
  const handleSignOut = async () =>{
    await signOut()
    localStorage.clear()
  }
  
  //2. email viewer functionality
    //var to display mail or not 
    const [viewMail, setViewMail] = useState(false)

    //2a. mail content
    const [userMail, setUserMail] = useState([])
    const [newMail, setNewMail] = useState(false)

    //2b. fetch account
    const token = localStorage.getItem('token')
    const {data: userEmailData, isFetched: fetchedEmailData, refetch:refetchEmailData} = useQuery({
      queryKey:['fetch-user-mail'],
      queryFn:async () => fetchAccount(),
      staleTime:0,
      enabled:!!localToken
    })

    useEffect(() =>{
      if (localToken){
        refetchEmailData()
      }
    }, [localToken])

    useEffect(() =>{
      if (userEmailData){
        setUserMail(userEmailData.mail)
        setNewMail(!userEmailData.mail_checked)
      }
    }, [userEmailData])

    //2c. checking email
    const handleCheckMail = async() =>{
      let mailChecked = await checkMail()
      setNewMail(false)
    }

  //3. account click viewer functionality
      //var to display profile nav or not 
      const [viewProfile, setViewProfile] = useState(false)

  return (
    <div className='header-shell'>
        <div className='header-title'>
            <Link to="/"><h1>ChipLearning</h1></Link>
            {/* <button onClick={updateTutorAccount}>INJECT</button> */}
        </div>
        <div className='header-nav-options'>
            <Link to="/booking"><p>Book Tutors</p></Link>
            <Link to="/sessions"><p>View Sessions</p></Link>
            <Link to="/tutor-view"><p>Tutor Dashboard</p></Link>
            <SignedOut>
                <SignInButton mode="modal" className='log-in'></SignInButton>
                <SignUpButton  mode="modal" className='sign-up'></SignUpButton>
            </SignedOut>
            <SignedIn>
              {
              fetchedEmailData 
              &&
                <Popover.Root open={viewMail} onOpenChange={() => setViewMail(!viewMail)}>
                  <Popover.Trigger asChild>
                    <Button style={{background:'none'}} onClick={handleCheckMail}>
                      <Icon as={TbMail} boxSize={8} style={{color:'black', background:'none'}}/>
                      {/* {newMail == true && <div className='email-counter'></div>} */}
                    </Button>
                  </Popover.Trigger>
                  <Portal>
                    <Popover.Positioner>
                      <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body  maxHeight="320px" style={{overflowY:'scroll'}}>
                          {
                            userMail.slice().reverse().map((mail, i) =>(
                              <div className='mail' key={`mail-${i}`}>
                                <h3>{mail.subject}</h3>
                                <p>{mail.content}</p>
                                <p>{dateToTimeConverter(mail.time)}</p>
                              </div>
                            ))
                          }
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Portal>
                </Popover.Root>
              }
              <Popover.Root open={viewProfile} onOpenChange={() => setViewProfile(!viewProfile)}>
                  <Popover.Trigger asChild>
                    <Button style={{background:'none'}}>
                      <Icon as={CgProfile} boxSize={8} style={{color:'black', background:'none'}}/>
                      {/* {newMail == true && <div className='email-counter'></div>} */}
                    </Button>
                  </Popover.Trigger>
                  <Portal>
                    <Popover.Positioner>
                      <Popover.Content  maxHeight="620px" width="200px">
                        <Popover.Arrow />
                        <Popover.Body   style={{overflowY:'scroll'}}>
                            <Link to="/booking" className="sidebar-option"><Icon as={BiPurchaseTag} boxSize={4} style={{color:'black', background:'none'}}/><p>Book Tutors</p></Link>
                          <div >
                            <Link to="/sessions" className="sidebar-option"> <Icon as={FaEye} boxSize={4} style={{color:'black', background:'none'}}/><p>View Sessions</p></Link>
                          </div>
                          <Link to="/tutor-view" className="sidebar-option"><Icon as={CiApple} boxSize={4} style={{color:'black', background:'none'}}/><p>Tutor Dashboard</p></Link>
                          <div className='divider'></div>
                          <div className="sidebar-option sign-out-tab"  onClick={handleSignOut}><p>Sign out</p></div>
                        </Popover.Body>
                      </Popover.Content>
                    </Popover.Positioner>
                  </Portal>
                </Popover.Root>
            </SignedIn>
        </div>

    </div>
  )
}

export default Header