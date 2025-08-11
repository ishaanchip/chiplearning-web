import axios from 'axios'
//UI
    //sorting tutors by certain category
    export const sortSessionCatalog = (sessions, sortFeature) =>{

        if (sortFeature == "Meeting Date"){
            return [...sessions].sort((a, b) =>  new Date(b.session_details.raw_date) - new Date(a.session_details.raw_date))
        }
        else if (sortFeature == "Time of Booking"){
            return [...sessions].sort((a, b) => b.session_id - a.session_id)
        }

    }


//ROUTING

    //cancel session
    export const cancelSession = async(tutorEmail, sessionId) =>{
        try {
            const token = localStorage.getItem("token");
            const result = await axios.put(`${import.meta.env.VITE_API_URL}sessions/cancel-session`, 
                {
                    tutorEmail,
                    sessionId
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
    
            );
    
            console.log(result);
    
            } catch (err) {
            console.log(`Frontend error canceling session: ${err}`);
            }
    }

    //approve || reject session
    export const tutorSessionDecision = async (clientEmail, sessionId, tutorDecision) =>{
        try {
            //tutor email
            const token = localStorage.getItem("token");
            const result = await axios.put(`${import.meta.env.VITE_API_URL}sessions/tutor-session-decision`, 
                {
                    clientEmail,
                    sessionId,
                    tutorDecision
                },
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                }
    
            );
    
            console.log(result);
    
            } catch (err) {
            console.log(`Frontend error applying tutor session decision: ${err}`);
            }
    }