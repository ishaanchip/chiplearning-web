import React, {useState, useEffect} from 'react'


//images & icons

//intercomponent imports
import { courseOfferingDisplay } from '../general/helper';
import { DAYS } from './bookingHelper';

//external dependenices
import { Checkbox, CheckboxGroup, Fieldset, For } from "@chakra-ui/react"

const Filter = ({classSelection, daySelection, setClassSelection, setDaySelection, isMini}) => {
//0. array holding all names of courses offered  
    const COURSE_OFFERINGS = Object.keys(courseOfferingDisplay) 


  return (

    <div className={isMini ? 'mini-filter-area' : 'filter-area'}>
        <h3>Filter by</h3>
        <div className="filter-topic">
            <Fieldset.Root mt="8" ml="2">
                <CheckboxGroup  name="courseofferings" value={classSelection} onValueChange={setClassSelection}>
                    <Fieldset.Legend fontSize="lg" mb="1" fontWeight="bolder">
                    Courses
                    </Fieldset.Legend>
                    <Fieldset.Content>
                        <For each={COURSE_OFFERINGS}>
                            {(course) => (
                            <Checkbox.Root key={course} value={course}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label ml="1">{course}</Checkbox.Label>
                            </Checkbox.Root>
                            )}
                        </For>
                    </Fieldset.Content>
                </CheckboxGroup>
            </Fieldset.Root>
        </div>

        <div className="filter-topic">
            <Fieldset.Root mt="8" ml="2">
                <CheckboxGroup  name="weekdays" value={daySelection} onValueChange={setDaySelection}>
                    <Fieldset.Legend fontSize="lg" mb="1" fontWeight="bolder">
                    Days of week
                    </Fieldset.Legend>
                    <Fieldset.Content>
                    <For each={DAYS}>
                        {(day) => (
                        <Checkbox.Root key={day} value={day}>
                            <Checkbox.HiddenInput />
                            <Checkbox.Control />
                            <Checkbox.Label ml="1">{day}</Checkbox.Label>
                        </Checkbox.Root>
                        )}
                    </For>
                    </Fieldset.Content>
                </CheckboxGroup>
            </Fieldset.Root>
        </div>

    </div>
  )
}

export default Filter