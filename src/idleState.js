//file dedicated to automatically signing user out after period of time
import React, {useEffect, useRef} from 'react'
import { useClerk } from '@clerk/clerk-react'

export const useIdleLogout = () => {
    //0. base variables
    const {signOut} = useClerk()
    const idleTimer = useRef(null)
    const autoLogoutTime = 1000*60*10

    const resetTimer = () =>{
        console.log('reset')
        clearTimeout(idleTimer.current) // always clear old timer
        idleTimer.current = setTimeout(() => {
          console.log('Logging out...')
          signOut()
        }, autoLogoutTime)

    }

    useEffect(() => {
        const events = ["mousemove"];
    
        events.forEach((event) => window.addEventListener(event, resetTimer))
        resetTimer() // start timer on mount
    
        return () => {
          clearTimeout(idleTimer.current)
          events.forEach((event) => window.removeEventListener(event, resetTimer))
        }

      }, [autoLogoutTime, signOut]);




}

