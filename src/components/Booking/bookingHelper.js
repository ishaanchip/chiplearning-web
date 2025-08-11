import axios from 'axios'


//FUNCTIONALITY: 
    //list of days & day conversions
    export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    export const numToDayConversions = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday"
    };

    export const dayToDayConversions = {
        "Sun": "sunday",
        "Mon": "monday",
        "Tue": "tuesday",
        "Wed": "wednesday",
        "Thu": "thursday",
        "Fri": "friday",
        "Sat": "saturday"
    };

    export const timePeriodConversions = {
        morning: ["8:00 AM", "9:30 AM", "11:00 AM"],
        afternoon: ["12:30 PM", "2:00 PM", "3:30 PM"],
        evening: ["5:00 PM", "6:30 PM", "8:00 PM"],
      };
      

    //sorting tutors by certain category
    export const sortTutorCatalog = (tutors, sortFeature) =>{
        //get sum of reviews to calculate stars
        function sumArr(arr){
            let sum = 0;
            for (let i = 0; i < arr.length; i++){
                sum += arr[i]
            }
            return sum/arr.length
        }


        if (sortFeature == "Alphabet"){
            return [...tutors].sort((a, b) =>  a.last_name.localeCompare(b.last_name))
        }
        else if (sortFeature == "Grade Level"){
            return [...tutors].sort((a, b) => b.tutor_info.grade - a.tutor_info.grade)
        }
        else if (sortFeature  == "Stars"){
            return [...tutors].sort((a, b) => sumArr(b.reviews) - sumArr(a.reviews))
        }

    }

    //filtering tutors by certain categories
    export const filterTutorCatalog = (tutors, classSelection, daySelection) =>{
        //internal heper functions
            //check to see if tutor teaches at least one similar class to user selection
            function oneClassSimilar(tutor, classSelection){
                let foundSimilarClass = false;
                let tutorClasses = tutor.fields
                for (let i = 0;i < tutorClasses.length; i++){
                  for (let j = 0; j < classSelection.length; j++){
                    if (tutorClasses[i] === classSelection[j]){
                      foundSimilarClass = true
                      return foundSimilarClass
                    }
                  }
                }
                return foundSimilarClass
            }
            //check to see if tutor teaches at least one similar day as user selection
            function oneDaySimilar(tutor, daySelection){
                let foundSimilarDay = false;
                let localDays = DAYS.map((day) => day.toLowerCase())
                let tutorDays = []
                for (let i = 0; i < localDays.length; i++){
                    if (tutor.availability[localDays[i]].available == true){
                        tutorDays.push(localDays[i])
                    }
                }
                //console.log(tutorDays)
                daySelection = daySelection.map((val) => val.toLowerCase())
                //console.log(daySelection)
                for (let i = 0;i < tutorDays.length; i++){
                  for (let j = 0; j < daySelection.length; j++){
                    if (tutorDays[i] === daySelection[j]){
                      foundSimilarDay = true
                      return foundSimilarDay
                    }
                  }
                }
                return foundSimilarDay
            }
            /*console.log(
                [...tutors]
            .filter((tutor) => oneClassSimilar(tutor, classSelection))
            .filter((tutor) => oneDaySimilar(tutor, daySelection))
            
    
            )
            */

            return [...tutors]
            .filter((tutor) => oneClassSimilar(tutor, classSelection))
            .filter((tutor) => oneDaySimilar(tutor, daySelection))
    }


//ROUTES

export const createSession = async(tutorEmail, sessionDate, rawSessionDate,  sessionTime, sessionTopic, sessionLocation) =>{
    try {
        const token = localStorage.getItem("token");
        const result = await axios.post(`${import.meta.env.VITE_API_URL}sessions/create-session`, 
            {
                tutorEmail,
                sessionDate,
                rawSessionDate,
                sessionTime,
                sessionTopic,
                sessionLocation
            },
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }

        );

        console.log(result.data.result);
        return result.data.result;

        } catch (err) {
        console.log(`Frontend error creating session: ${err}`);
        }
}


