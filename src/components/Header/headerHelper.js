import axios from 'axios'

//ROUTES
export const checkMail = async () =>{
    try{
        const token = localStorage.getItem("token");
        const result = await axios.put(`${import.meta.env.VITE_API_URL}client-account/check-mail`, {}, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        console.log(result.data.message)
        return result.data.message;
    }
    catch(err){
        console.log(`there was a frontend error checking mail: ${err}`)
    }
}

