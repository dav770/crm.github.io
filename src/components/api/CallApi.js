import React from 'react'

import axios from 'axios'

export function AxiosApi (app, leState){

  
  
    try{
console.log("api", app, leState);



      const response =  axios.post(`http://localhost:8000/${app}`, leState )
      .then(resp=>{
        // (typeof resp.data === 'string') && gestion des log
     
          return resp.data
        

      });
       
    }catch (e) {
      console.log(`😱 Axios request failed: ${e}`);

      return {err: true, message:"erreur sur backend consulter log"}
    }


    return true
    }
  
