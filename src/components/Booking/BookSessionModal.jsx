import React, {useState, useEffect} from 'react'
import "./BookSession.css"

//images & icons


//intercomponent imports
import { numToDayConversions, dayToDayConversions, timePeriodConversions, createSession } from './bookingHelper';
import { fetchSessions } from '../general/helper';


//external dependenices
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button, CloseButton, Dialog, Portal, Alert } from "@chakra-ui/react"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


const BookSessionModal = ({tutor, setCurrentModal}) => {
  //0. getting essential tutor available status
    const [updatedTutorAvailability, setUpdatedTutorAvailability]= useState({})
    const [tutorCurrentSessions, setTutorCurrentSessions] = useState([])
    const [timingTutorCurrentSessions, setTimingTutorCurrentSessions] = useState([])

    useEffect(() =>{
      setUpdatedTutorAvailability(tutor.updated_availability)
      setTutorCurrentSessions(tutor.current_sessions)
    }, [])

    const {data: sessionData} = useQuery({
      queryKey:['tutor-session-data'],
      queryFn:async () => fetchSessions(tutorCurrentSessions),
      enabled: !!tutorCurrentSessions && tutorCurrentSessions.length > 0,
      staleTime:0
    })

    useEffect(() =>{
      if (sessionData && tutorCurrentSessions){
        console.log(sessionData)
        const formattedSet = sessionData.map((session) =>`${session.session_details.date}|${session.session_details.timing}`)
        setTimingTutorCurrentSessions(formattedSet)
      }
    }, [sessionData, tutorCurrentSessions])

  //1. calendar date  initial ui selection:


    const shouldDisableDate = (date) => {
      const today = new Date();
      const todayDate = today.getDate();
      const todayDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
      const daysUntilSunday = 14 - todayDayOfWeek
      // const daysUntilSunday = 7 - todayDayOfWeek;
      const endDate = new Date(today);
      endDate.setDate(todayDate + daysUntilSunday); // Subtract 1 because today counts

      const jsDate = date.toDate();
      // 1.disable dates before today
      if (jsDate < today) return true;
      // 2.disable dates after  sunday
      if (jsDate > endDate) return true;
      const day = date.day()

      
      let stringedDay = numToDayConversions[day]
      let forbiddenDays = Object.keys(updatedTutorAvailability).filter((day) => updatedTutorAvailability[day].available == false)
      if (forbiddenDays.includes(stringedDay)) return true;

      //false leaves day active
      return false; 
    };


  //2. setting potential dates & times
    const [selectedDayObject, setSelectedDayObject] = useState(null);
    const [currentDay, setCurrentDay] = useState(null)
    const [rawCurrentDay, setRawCurrentDay] = useState(null)


    const [updatedViableTimes, setUpdatedViableTimes] = useState([])

    const handleChange = (value) =>{
      //"mth-day-yr"
      setCurrentDay((value['$M']+1)+"-"+value['$D']+"-"+value['$y'])
      setRawCurrentDay(value['$d'])
      setSelectedDayObject(value)
      let selectedFullDayInfo = value['$d']
      let selectedDayToObject = new Date(selectedFullDayInfo)
      let selectedDayOfWeek = selectedDayToObject.getDay()
      setUpdatedViableTimes(updatedTutorAvailability[numToDayConversions[selectedDayOfWeek]].slots)
      setCurrentTime(null)
    }

    //3. client selection & navigation functionality
      const navigate = useNavigate()

      const [currentCourse, setCurrentCourse] = useState(null)
      const [currentTime, setCurrentTime] = useState(null)
      const [currentLocation, setCurrentLocation] = useState(null)
      const [showAlert, setShowAlert] = useState(false);
      //3a. toggle for chakra dialog
      const [isOpen, setIsOpen] = useState(true)

      const handleCreateSession = async() =>{
        if (currentCourse && currentTime && currentLocation && currentDay) {
          await createSession(tutor.email, currentDay, rawCurrentDay,  currentTime, currentCourse, currentLocation)
          //1. reseting modal state after successful entry
          handleResetModal()
          navigate("/sessions")

        }
        else{
          setShowAlert(true)
          console.log(`FILL OUT ALL FIELDS!!!!`)
        }
      }

    //4. cleaning  functionality
      const handleResetModal = () =>{
        setCurrentCourse(null)
        setCurrentDay(null)
        setCurrentLocation(null)
        setCurrentTime(null)
        setIsOpen(false) //closes chakra
        setShowAlert(false) //closes potential alert
        setCurrentModal(-1) // un-renders tutor specific booking
      }

      useEffect(() =>{
        if (isOpen === false){
          handleResetModal()
        }
      }, [isOpen])


  return (
    <Dialog.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)} size="cover" placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          Book Tutor
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header className='dialog-header'>
              <Dialog.CloseTrigger asChild onClick={() => handleResetModal()}>
                <CloseButton size="md"/>
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body className='book-session-area'>
              <div className="booking-process">
                  <div className="booking-note">
                    <h1>Before booking</h1>
                    <p>You may cancel a booked session at any time before the tutor approves or rejects it. Once approved, the appointment is binding and cannot be canceled</p>
                  </div>
                  <div className='topic-selection'>
                    <h1>What do you want help with?</h1>
                    <div className='course-list'>
                    {tutor.fields.map((course, i) =>(
                      <Button key={`tutor-course-${i}`} onClick={() => setCurrentCourse(course)} className='booking-button' style={course == currentCourse ? {'backgroundColor':'green', 'color':'white'}: {'color':'black'}}>{course}</Button>
                    ))}
                    </div>
                  </div>
                  <h1>Book the Date</h1>
                  <div className="date-selection">
                    <div className='calender-area'>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar 
                          value={selectedDayObject} 
                          onChange={handleChange} 
                          shouldDisableDate={shouldDisableDate} 
                          views={['day']} 
                          sx={{
                            // shrink entire calendar
                            transform: "scale(0.8)",
                            transformOrigin: "top left",
                            // align weekday headers with shrunken cells
                            "& .MuiDayCalendar-weekDayLabel": {
                              fontSize: "0.5rem", // shrink M, T, W...
                              width: "28px", // match smaller cells
                            },
                            "& .MuiPickersDay-root": {
                              fontSize: "0.75rem", // shrink numbers
                              width: 28,
                              height: 28,
                              margin: "0 2px",
                            },
                            // remove default padding/margins so it's flush left
                            "& .MuiDateCalendar-root": {
                              margin: 0,
                              padding: 0,
                            },
                          }}
                          />
                      </LocalizationProvider>
                    </div>
                    <div className='time-slot-area'>
                    {
                    updatedViableTimes.length > 0 &&
                      
                      updatedViableTimes.map((slot, i) => {
                        const slotKey = `${currentDay}|${slot}`;
                        const isBooked = timingTutorCurrentSessions.includes(slotKey);

                        return (
                          <div key={`time-slot-${i}`}>
                            <Button
                              key={`slot-${i}`}
                              onClick={() => setCurrentTime(slot)}
                              className={isBooked ? 'booking-button booked' : 'booking-button'}
                              style={
                                slot === currentTime
                                  ? { backgroundColor: 'green', color: 'white' }
                                  : { color: 'black' }
                              }
                              disabled={isBooked}
                            >
                              {slot} {isBooked && '(booked)'}
                            </Button>
                          </div>
                        );
                      })
                    }
                    

                    </div>
                  </div>
                  <div className="location-selection">
                    <h1>Pick the Spot</h1>
                    <div className='location-options'>
                    {tutor.locations.map((location, i) =>(
                      <Button key={`tutor-location-${i}`} onClick={() => setCurrentLocation(location)} className='booking-button' style={location == currentLocation ? {'backgroundColor':'green', 'color':'white'}: {'color':'black'}}>{location}</Button>
                    ))}
                    </div>
                  </div>
                  {
                    showAlert &&
                    <Alert.Root status="error" className='alert'>
                      <Alert.Indicator />
                      <Alert.Content>
                        <Alert.Title>ERROR</Alert.Title>
                        <Alert.Description>
                        Must complete all fields to book a session!
                        </Alert.Description>
                      </Alert.Content>
                      <CloseButton pos="relative" top="-2" insetEnd="-2" onClick={() => setShowAlert(false)}/>
                    </Alert.Root>
                    }
                  <div className="final-part">
                    <Button className='booking-button' onClick={() => handleCreateSession()}>Book session</Button>
                  </div>


              </div>

              <div className="tutor-marketing">
                {/* <div className="tutor-image-area">
                      <img src={tutor.tutor_info.display_picture} alt="what"/>
                </div>
                <div className="tutor-stats">
                  <h3>{tutor.first_name} teaches</h3>
                  <div className='course-list'>
                    {tutor.fields.map((course, i) =>(
                      <Button key={`tutor-course-display-${i}`} className='display-button'>{course}</Button>
                    ))}
                    </div>
                </div> */}
                {/* <p style={{color:'gray'}}>*You may cancel a booked session at any time before the tutor approves or rejects it. Once approved, the appointment is binding and cannot be canceled.</p> */}

              </div>

            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default BookSessionModal