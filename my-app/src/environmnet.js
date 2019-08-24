
let url="http://localhost:3000"
let BASE_URL=""
let  REACT_APP_BACKGROUNG_COLOUR=""

  if(process.env.REACT_APP_ENV==="development")
  {
        BASE_URL=`${url}/development`;
        REACT_APP_BACKGROUNG_COLOUR="#1067EE"
  }
 
     if(process.env.REACT_APP_ENV==="staging"){
        BASE_URL=`${url}/staging`;
        REACT_APP_BACKGROUNG_COLOUR="#973AAB"
    }  

     if(process.env.REACT_APP_ENV==="production"){
        BASE_URL=`${url}/production`;
        REACT_APP_BACKGROUNG_COLOUR="#EE3810"
        }
      
export {BASE_URL,REACT_APP_BACKGROUNG_COLOUR};