import React, {useState, useEffect} from 'react'
import "./Sessions.css"

//images & icons

//intercomponent imports
import Header from '../Header/Header'
import { fetchAccount, fetchSessions, dateToTimeConverter, courseOfferingDisplay } from '../general/helper';
import { cancelSession, sortSessionCatalog } from './sessionHelper';

//external dependenices
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Icon, Button, Menu, Portal, Dialog, CloseButton, Loader } from '@chakra-ui/react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';



const ClientSessions = () => {

    //0. base variables
        const [clientSessionNumbers, setClientSessionNumbers] = useState([])
        //0a. display of either current || past sessions
        const [sessionDisplay, setSessionDisplay] = useState([])
        const {data: client, isFetched: fetchedClient} = useQuery({
            queryKey:['client-data-numbers'],
            queryFn:async () => fetchAccount(),
            staleTime:0
        })

        useEffect(() =>{
            if (client){
                setClientSessionNumbers([...client.current_sessions, ...client.past_sessions])
            }
        }, [client])



    //1. setting session type
        const [sessionType, setSessionType] = useState('current-sessions');
        //1a. presetting session display to current sessions
        const {data: sessionData, isFetched: fetchedClientSessions, refetch:refetchClientSessions} = useQuery({
            queryKey:['client-session-data', clientSessionNumbers],
            queryFn:async () => fetchSessions(clientSessionNumbers),
            enabled: !!clientSessionNumbers && clientSessionNumbers.length > 0,
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
        if (fetchedClient == true ){
            setSessionDisplay(sortSessionCatalog(sessionDisplay, sortCondition))
        }
    }, [sortCondition])
        


  return (
    <div className='session-shell'>
        <Header />

        <div className="session-area">
            <h2>Sessions</h2>
            <div className='session-options'>
                <Tabs className='session-options-tabs-area'
                    value={sessionType}
                    onChange={handleSessionChange}
                    aria-label="session display options"
                    variant="fullWidth"
                >
                        <Tab value="current-sessions" label="Current" className='session-option'/>
                        <Tab value="past-sessions" label="History" className='session-option'/>
                </Tabs>
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="ghost" size="md">
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
                fetchedClient === false 
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
                                    <Icon as={courseOfferingDisplay[session.session_details.topic].icon} boxSize={24} color={courseOfferingDisplay[session.session_details.topic].color} height="65%"  />
                                    <p>{session.session_details.topic}</p>
                                    <p>{session.session_details.date}</p>
                                </div>
                                <div className="session-specifics">
                                    <p>Tutor Contact: {session.tutor_email}</p>
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
                                <Dialog.Root >
                                    <Dialog.Trigger asChild>
                                        <Button className='session-action-button'>Cancel Session
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
                                                    <p>This action cannot be reversed. This booking will permanently delete this request.</p>
                                                    <Button onClick={async () => {
                                                        await cancelSession(session.tutor_email, session.session_id);
                                                        await refetchClientSessions(); // This will trigger the useEffect that updates clientSessionNumbers
                                                        }}>
                                                    Cancel Session
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
                                }
                                </div>
                            </div>
                        )
                    })
                    :
                    <div className='empty-area'>
                        <h1>no sessions currently fit this category 😗</h1>
                        <p>you will be notified if there are any updates to your sessions</p>
                        <div className="button-navigation">
                            <Link to="/booking"><Button>Book a Tutor</Button></Link>
                        </div>
                    </div>
                }
                </div>
            }

        </div>
    </div>
  )
}

export default ClientSessions