import './App.css';
import React, {useEffect, useId} from "react"
import {useIdleLogout} from './idleState';
import Router from './Router';

const App = ()  =>  {
  useEffect(() => {
    if (window.location.pathname !== "/") {
      window.location.replace("/");
    }
  }, []);

  useIdleLogout()

 return (
   <div className="App">
       <Router/>
   </div>
 );
}


export default App;