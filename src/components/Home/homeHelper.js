//routing imports
import axios from 'axios'



    

//ROUTES
    //creates json web token for user when log into account w clerk
    export const handleLoginAccount = async (email, firstName, lastName) =>{
        try{
            const postBody = { email: email, firstName:firstName, lastName:lastName };
            const res = await axios.post(`${import.meta.env.VITE_API_URL}client-account/login`, postBody);
            //console.log('creating jwt ! ! !');
            return res.data.token
        }
        catch(err){
            console.log(`Frontend error getting account info: ${err}`);
        }
    }

