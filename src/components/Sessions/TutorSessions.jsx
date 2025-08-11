import React, {useState, useEffect} from 'react'
import "./Sessions.css"

//images & icons

//intercomponent imports
import { fetchSpecificTutor, fetchSessions, dateToTimeConverter, courseOfferingDisplay } from '../general/helper';
import { sortSessionCatalog, tutorSessionDecision } from './sessionHelper';

//external dependenices
import { useQuery } from '@tanstack/react-query';
import { Icon, Button, Menu, Portal, CloseButton, Dialog, Loader } from '@chakra-ui/react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const TutorSessions = () => {

    //0. base variables
        const [tutorSessionNumbers, setTutorSessionNumbers] = useState([])
        //0a. display of either current || past sessions
        const [sessionDisplay, setSessionDisplay] = useState([])
        const {data: tutor, isFetched: fetchedTutor} = useQuery({
            queryKey:['tutor-data-numbers'],
            queryFn:async () => fetchSpecificTutor(),
            staleTime:0
        })

        useEffect(() =>{
            if (tutor){
                let localTutor = tutor.tutorObject;
                setTutorSessionNumbers([...localTutor.current_sessions, ...localTutor.past_sessions])
            }
        }, [tutor])


    //1. setting session type
        const [sessionType, setSessionType] = useState('current-sessions');
        //1a. presetting session display to current sessions
        const {data: sessionData, isFetched: fetchedClientSessions, refetch:refetchTutorSessions} = useQuery({
            queryKey:['client-session-data', tutorSessionNumbers],
            queryFn:async () => fetchSessions(tutorSessionNumbers),
            enabled: !!tutorSessionNumbers && tutorSessionNumbers.length > 0,
            staleTime:0
        })

        useEffect(() =>{
            if (sessionData){
                console.log(sessionData)
                //automatically render in current sessions [meeting_status == "pending" || "approved"]
                let currentSessionDisplay = sessionData.filter((data) => (data.meeting_status == "pending") || (data.meeting_status == "approved"))
                console.log(currentSessionDisplay)
                setSessionDisplay(sortSessionCatalog(currentSessionDisplay, "Time of Booking"))
            }
        }, [sessionData])


    //2. handle session switch
    const handleSessionChange = (event, newValue) => {
        setSessionType(newValue);
        console.log(sessionData)
        if (newValue == "current-sessions"){
            let currentSessionDisplay = sessionData.filter((data) => (data.meeting_status == "pending") || (data.meeting_status == "approved"))
            setSessionDisplay(sortSessionCatalog(currentSessionDisplay, sortCondition))
        }
        else{
            let currentSessionDisplay = sessionData.filter((data) => !((data.meeting_status == "pending") || (data.meeting_status == "approved")))
            setSessionDisplay(sortSessionCatalog(currentSessionDisplay, sortCondition))
        }
    };

    //3. handle session sorting
    const [sortCondition , setSortCondition] = useState("Time of Booking")
    useEffect(() =>{
        if (fetchedTutor == true ){
            setSessionDisplay(sortSessionCatalog(sessionDisplay, sortCondition))
        }
    }, [sortCondition])
        


  return (
    <div className="session-area">
        <h2>Sessions</h2>
        <div className='session-options'>
            <Tabs className='session-options-tabs-area'
                value={sessionType}
                onChange={handleSessionChange}
                aria-label="session display options"
                variant="fullWidth"
            >
                    <Tab value="current-sessions" label="Current" className='session-option' width="200px"/>
                    <Tab value="past-sessions" label="History" className='session-option'/>
            </Tabs>
            <Menu.Root>
                <Menu.Trigger asChild>
                    <Button variant="ghost" size="md" minW="200px">
                    Sort by: {sortCondition}
                    </Button>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item onClick={() => setSortCondition('Time of Booking')} value="time-of-booking">Time of Booking</Menu.Item>
                        <Menu.Item onClick={() => setSortCondition('Meeting Date')} value="meeting-date">Meeting Date</Menu.Item>
                    </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </div>
        {
            fetchedTutor === false 
            ?
            <Loader className='loader-area' boxSize={15}/>
            :
            <div className='session-booked-area'>
            {
            sessionDisplay.length > 0 ?
                sessionDisplay.map((session) =>{
                    return (
                        <div className='session' key={session._id}>
                            <div className="session-topic">
                                <Icon as={courseOfferingDisplay[session.session_details.topic].icon} boxSize={12} color={courseOfferingDisplay[session.session_details.topic].color} height="65%"  />
                                <p>{session.session_details.topic}</p>
                                <p>{session.session_details.date}</p>
                            </div>
                            <div className="session-specifics">
                                <p>Client Contact: {session.client_email}</p>
                                <p>Meeting Details: {session.session_details.date} * {session.session_details.timing} * {session.session_details.location}</p>
                                <div className='meeting-status-area'>
                                    <p>Meeting Status: </p>
                                    <button className={`session-status session-${session.meeting_status}`}>{session.meeting_status}</button>
                                </div>
                            {
                                session.meeting_status === "pending" &&
                                <p>Session Confirmation By: {dateToTimeConverter(session?.accept_by)}</p>
                            }
                            {(session.meeting_status == "pending")
                                &&
                                <div className="tutor-choices">
                                    <Dialog.Root>
                                        <Dialog.Trigger asChild>
                                            <Button className='session-action-button'>
                                                Approve Session
                                            </Button>
                                        </Dialog.Trigger>
                                        <Portal >
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <div className='dialog-content'>
                                                    <h2>Are you sure?</h2>
                                                    <p>This action cannot be reversed.</p>
                                                    <Button onClick={async () => {
                                                        await tutorSessionDecision(session.client_email, session.session_id, "approved");
                                                        await refetchTutorSessions(); 
                                                        }}>
                                                    Approve Session
                                                    </Button>
                                                </div>
                                            </Dialog.Body>
                                            <Dialog.Footer>

                                            </Dialog.Footer>
                                            <Dialog.CloseTrigger asChild>
                                            <CloseButton size="sm" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                    </Dialog.Root>

                                    <Dialog.Root>
                                        <Dialog.Trigger asChild>
                                            <Button className='session-action-button'>
                                                Reject Session
                                            </Button>
                                        </Dialog.Trigger>
                                        <Portal >
                                        <Dialog.Backdrop />
                                        <Dialog.Positioner>
                                        <Dialog.Content>
                                            <Dialog.Header>
                                            </Dialog.Header>
                                            <Dialog.Body>
                                                <div className='dialog-content'>
                                                    <h2>Are you sure?</h2>
                                                    <p>This action cannot be reversed.</p>
                                                    <Button onClick={async () => {
                                                        await tutorSessionDecision(session.client_email, session.session_id, "rejected");
                                                        await refetchTutorSessions(); 
                                                        }}>
                                                    Reject Session
                                                    </Button>
                                                </div>
                                            </Dialog.Body>
                                            <Dialog.Footer>

                                            </Dialog.Footer>
                                            <Dialog.CloseTrigger asChild>
                                            <CloseButton size="sm" />
                                            </Dialog.CloseTrigger>
                                        </Dialog.Content>
                                        </Dialog.Positioner>
                                    </Portal>
                                    </Dialog.Root>


 
                                </div>

                            }
                            </div>
                        </div>
                    )
                })
            :
            <div className='empty-area'>
                    <h1>no sessions currently fit this category 😗</h1>
                    <p>you will be notified if there are any updates to your sessions</p>
                    {/* <div className="button-navigation">
                        <Link to="/booking"><Button>Book a Tutor</Button></Link>
                        <Link to="/sessions"><Button>View Sessions</Button></Link>
                    </div> */}

            </div>
            }
            </div>
        }

    </div>

  )
}

export default TutorSessions



/*

                                                    <Button onClick={async () => {
                                                        await tutorSessionDecision(session.client_email, session.session_id, "approved");
                                                        await refetchTutorSessions(); 
                                                        }}>
                                                    Approve Session
                                                    </Button>



                                                    <Button onClick={async () => {
                                                        await tutorSessionDecision(session.client_email, session.session_id, "rejected");
                                                        await refetchTutorSessions(); 
                                                        }}>
                                                    Reject Session
                                                    </Button>


*/