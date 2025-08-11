//icon imports
import { RiPencilLine } from "react-icons/ri";        
import { TbPigMoney, TbMathIntegralX, TbMathFunction } from "react-icons/tb"; 
import { BsCoin } from "react-icons/bs";    
import { PiSigmaThin } from "react-icons/pi";           
import { LiaLaptopCodeSolid } from "react-icons/lia";  


//routing imports
import axios from 'axios'


//UI
    //object housing all offerings of tutor site
    export const courseOfferingDisplay = {
        "AP Calculus AB": {
        icon: TbMathIntegralX,
        color: "teal.500",
        },
        "AP Calculus BC": {
        icon: PiSigmaThin,
        color: "cyan.600",
        },
        "AP Computer Science": {
        icon: LiaLaptopCodeSolid,
        color: "gray.700",
        },
        "AP Macroeconomics": {
        icon: TbPigMoney,
        color: "purple.500",
        },
        "AP Microeconomics": {
        icon: BsCoin,
        color: "green.600",
        },
        "SAT English": {
        icon: RiPencilLine,
        color: "blue.500",
        },
        "SAT Math": {
        icon: TbMathFunction,
        color: "green.500",
        },
    };

    //Date --> time convertor
    export const dateToTimeConverter = (rawDate) => {
        const date = new Date(rawDate);
    
        //extracting [mm/dd/yyyy]
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    
        //ex: 8:00 A.M
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    
        return `${formattedDate} at ${formattedTime}`;
    };

//ROUTES

    //fetches client account details using generated jwt token
    export const fetchAccount = async () => {
        try {
        const token = localStorage.getItem("token");
        const result = await axios.get(`${import.meta.env.VITE_API_URL}client-account/get-account`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        //console.log(result.data.result);
        return result.data.result;
        } catch (err) {
        console.log(`Frontend error getting account info: ${err}`);
        }
    };

    //gets catalog of every tutor
    export const fetchTutors = async () =>{
        try{
            const result = await axios.get(`${import.meta.env.VITE_API_URL}tutor-account/fetch-tutors`);
            //console.log(result.data.result);
            return result.data.result;

        }catch(err){
            console.log(`Frontend error getting tutor account info: ${err}`);
        }
    }
    export const fetchSpecificTutor = async() =>{
        try{
            const token = localStorage.getItem("token");
            const result = await axios.get(`${import.meta.env.VITE_API_URL}tutor-account/fetch-tutor-view`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
    
            console.log(result.data);
            return result.data;
    
        }catch(err){
            console.log(`Frontend error getting tutor account info: ${err}`);
        }
    }


    //fetches all of tutor sessions
    export const fetchSessions = async(sessionIds) =>{
        try{
            console.log(sessionIds)
            const result = await axios.post(`${import.meta.env.VITE_API_URL}sessions/fetch-sessions`, {
                sessionIds:sessionIds
            });
            console.log(result.data.sessions);
            return result.data.sessions;

        }catch(err){
            console.log(`Frontend error getting tutor sessions: ${err}`);
        }
    }

//TEMP INJECTION
    export const createTutorAccount = async () =>{
        try{

            let postBody = {
                first_name: "Diana",
                last_name: "Lopez",
                email: "dlopez@example.com",
                reviews: [5, 5, 5],
                tutor_info: {
                  school: "Lincoln Preparatory School",
                  grade: 12,
                  display_picture: "diana_lopez.png"
                },
                fields: ["AP Microeconomics"],
                history: [
                  {
                    client_email: "client5@example.com",
                    meeting_status: "completed",
                    session_details: {
                      date: "2025-06-30",
                      timing: "17:00",
                      topic: "AP Microeconomics",
                      resources: ["microeconomics_summary.pdf", "mircotutor.com"]
                    },
                    session_id: "1699961000000-dlopezclient5"
                  }
                ],
                availability: {
                  monday: { available: true, slots: ["evening"] },
                  tuesday: { available: true, slots: ["morning", "afternoon"] },
                  wednesday: { available: false, slots: [] },
                  thursday: { available: true, slots: ["afternoon"] },
                  friday: { available: true, slots: ["morning", "afternoon"] },
                  saturday: { available: false, slots: [] },
                  sunday: { available: true, slots: ["morning", "evening"] }
                }
              };
              
              


              
            const res = await axios.post(`${import.meta.env.VITE_API_URL}tutor-account/create-tutor-account`, postBody);
            console.log('creating tutor account ! ! !');

        }
        catch(err){
            console.log(`Frontend error posting tutor account info: ${err}`);
        }
    }

    export const updateTutorAccount = async () =>{
        try{              
            const res = await axios.put(`${import.meta.env.VITE_API_URL}tutor-account/update-tutor-account-timings`);
            console.log(res)
            console.log('updating tutor account ! ! !');

        }
        catch(err){
            console.log(`Frontend error updating tutor account info: ${err}`);
        }
    }



