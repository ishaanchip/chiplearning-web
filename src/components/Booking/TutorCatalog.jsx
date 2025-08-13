import React, {useState, useEffect} from 'react'


//images & icons
import { TbMail } from "react-icons/tb"; 

//intercomponent imports
import BookSessionModal from './BookSessionModal'
import Filter from './Filter';
import { fetchTutors, courseOfferingDisplay } from '../general/helper'
import { sortTutorCatalog, filterTutorCatalog } from './bookingHelper'

//external dependenices
import { useQuery } from '@tanstack/react-query'
import { Skeleton, Button, Menu, Portal, Icon, Text, Dialog, CloseButton } from '@chakra-ui/react'
import { Tooltip } from '../ui/tooltip';
import { purple } from '@mui/material/colors';


const TutorCatalog = ({classSelection, daySelection, setClassSelection, setDaySelection}) => {
    //0. fetching tutors
        const [tutorDisplay, setTutorDisplay] = useState([]);

    const {data:allTutors, isFetched:fetchedTutors} = useQuery({
        queryKey:['fetch-all-tutors'],
        queryFn:async() => fetchTutors(),
    })
    useEffect(() =>{
        if (allTutors){
            //console.log(allTutors)
            let localCatalog = filterTutorCatalog(allTutors, classSelection, daySelection)
            localCatalog = sortTutorCatalog(localCatalog, "Alphabet")
            setTutorDisplay(localCatalog)
            // setTutorDisplay(sortTutorCatalog(allTutors, "Alphabet"))
        }
    }, [allTutors])

    //1. sorting condition
        const [sortCondition , setSortCondition] = useState("Alphabet")
        useEffect(() =>{
            if (fetchedTutors == true ){
                setTutorDisplay(sortTutorCatalog(tutorDisplay, sortCondition))
            }
        }, [sortCondition])

    //2. filtering condition function
        //2a. mini filterer open
        const [miniFilterOpen, setMiniFilterOpen] = useState(false)
    useEffect(() =>{
        if (fetchedTutors == true){
            setTutorDisplay(filterTutorCatalog([...allTutors], classSelection, daySelection))
        }
    }, [classSelection, daySelection])


    //3. selecting tutor
        const [currentModal, setCurrentModal] = useState(-1)
    

  
  
    
  return (
    <div className='tutor-catalog-area'>  
        <div className="catalog-header">
            <h3>Results</h3>
            <div className="catalog-mutaters">
                <Menu.Root>
                    <Menu.Trigger asChild>
                        <Button variant="ghost" size="md">
                        Sort by: {sortCondition}
                        </Button>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                        <Menu.Content>
                            <Menu.Item onClick={() => setSortCondition('Alphabet')} value="alphabet">Alphabet</Menu.Item>
                            <Menu.Item onClick={() => setSortCondition('Grade Level')} value="grade-level">Grade level</Menu.Item>
                            <Menu.Item onClick={() => setSortCondition('Stars')} value="stars">Stars</Menu.Item>
                        </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
                <Dialog.Root size="full" placement="center" motionPreset="slide-in-bottom">
                    <Dialog.Trigger asChild>
                        <Button variant="outline" size="sm" className='mini-filter-button'>
                        Filter
                        </Button>
                    </Dialog.Trigger>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.CloseTrigger asChild mt="10%">
                                        <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                            </Dialog.Header>
                            <Dialog.Body>
                                <Filter classSelection={classSelection} setClassSelection={setClassSelection} daySelection={daySelection} setDaySelection={setDaySelection} isMini={true}/>
                            </Dialog.Body>
                        </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </div>

        </div>  


        {fetchedTutors  === false 
            ?
            <div className="tutors">
                {[0, 0, 0, 0].map((val, i) =>(
                    <Skeleton m="2" height="180px" width="45%" key={`skeleton-${i}`}/>
                ))}
            </div>
            :
            <div className="tutors">
                {
                    tutorDisplay.length > 0 
                    ?
                    tutorDisplay?.map((tutor, i) =>(
                    <div className='tutor' key={`tutor-${i}`} >
                        {currentModal === i && <BookSessionModal tutor={tutor} setCurrentModal={setCurrentModal}/>}
                        <div className="tutor-display-info">
                            <img src={tutor.tutor_info?.display_picture} alt={`${tutor.first_name}-${tutor.last_name}-img`}/>
                            <Button onClick={() => setCurrentModal(i)}>Book Tutor</Button>
                            <div className="email-tag"><Icon as={TbMail} boxSize={4} style={{color:'black', background:'none'}}/><p>{tutor.email}</p></div>

                        </div>
                        <div className="tutor-essential-info">
                            <div className='tutor-offerings'>
                                <p>Offerings:</p> 
                                {tutor.fields.map((course, index) =>(
                                    <Tooltip
                                    key={`tutor-${index}-${course}`}
                                    content={course}
                                    openDelay={200}
                                    closeDelay={100}
                                    className="course-hover"
                                    contentProps={{ css: { "--tooltip-bg": "rgb(164,94,229)" } }}
                                    >
                                        <Icon className='icon' as={courseOfferingDisplay[course].icon} boxSize={5} color={courseOfferingDisplay[course].color}  ml="2.5%"/>
                                    </Tooltip>
                                        
                                ))}   
                                                                       
                            </div>
                            <p>Tutor Name: {tutor.first_name} {tutor.last_name}</p>
                            <p>Grade: {tutor.tutor_info.grade}th</p>
                            </div>
                    </div>
                    ))
                :
                <div className='empty-area'>
                        <h1>no tutors meet these criterion 😗</h1>
                        <p>try changing the filters to find more tutors.</p>
                </div>

                
                }

            </div>

            
            
        }


    </div>
  )
}

export default TutorCatalog