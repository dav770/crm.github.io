import React , { useRef , useEffect}from 'react'
import axios from 'axios'
import GoogleMapReact from 'google-map-react';

const ClientMap = (props) => {
    // initializes state
    let [latitude, setLatitude] = React.useState(-33.7560119)
    let [longitude, setLongitude] = React.useState(150.6038367)
    let [address, setAddress] = React.useState(props.adress1)
    let [ville, setVille] = React.useState(props.ville1)
    let [cp, setCp] = React.useState(props.cp1)


    let [markers, setMarkers] = React.useState([])

    var defaultProps = {
      center: {
        lat: 59.95,
        lng: 30.33
      },
      zoom: 20
    };


    
    const Marker = ({text}) => {
      return (
            <div><b>{text}</b></div>
      );
  }


  // app responseApiCommPos :recup position des commerciaux
  // il faut donc enregistrer lat lng des rendez-vous dans table planingRdv
  // tableau objet :
  // responseApiCommPos = {
  //   name: '',
  //   lat:0,
  //   lng:0
  // }



  var arrayMarkCom = []
  arrayMarkCom.push(responseApiCommPos)
    setMarkers(arrayMarkCom)

var refFormAdr = useRef();


useEffect(()=>{
  console.log('ref',refFormAdr);
  // updateCoordinates(true)
},[])

var compAdr = address+' '+ville+' '+cp

    // searches for new locations
    const updateCoordinates = (e) => {

        e !== true && e.preventDefault()

        console.log('map',e, address, encodeURI(address));
        const encodedAddress = encodeURI(compAdr)

        var respData = ''
        
        fetch(`https://google-maps-geocoding.p.rapidapi.com/geocode/json?language=en&address=${encodedAddress}`, {
        "method": "GET",
        "headers": {
            "Access-Control-Allow-Origin": "*",
        "x-rapidapi-host": "google-maps-geocoding.p.rapidapi.com",
        "x-rapidapi-key": '11101c7c1fmsha62efecdc4c7c6ep143b3ajsn8c50c780a493' //process.env.RAPIDAPI_KEY
        }
    })
    .then(response => {
      // console.log('1 ;',response)
      return response.json()})
    .then(response => {
      console.log('2 ;',response)

      setLatitude(response[0].geometry.location.lat)
      setLongitude(response[0].geometry.location.lng)
      return response
        
        // console.log('3 ;',response.lat)
        // console.log('4 ;',response.long)
    })
    .catch(err => console.log(err))
        // return new Promise(resolve => {
        //     try {
        //       const response = axios
        //         .get(`http://localhost:8000/mapClient/${compAdr.split(' ')}`)
        //             .then(resp => {
        //           if (resp.status >= 400) {
        //             console.log(resp.status);
        //             throw new Error(
        //               `Bad response from server `,
        //             );
        //           } else {
        //             console.log('maretour map 0',resp, response);
        //             return resp.data[0];
        //           }
        //         })
        //         .then(data => {
        //           respData = data;
        //           console.log('retour map',respData);
        //           return resolve(respData);
        //         });
        //     } catch (e) {
        //       console.log(`😱 Axios request failed: ${e}`);
      
        //       respData = { err: true, message: 'erreur sur backend consulter log' };
        //       return resolve(respData);
        //     }
        //   });
        }

    

    return (
        <div>
           longitude :  {longitude}
           latitude :  {latitude}

           <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact 
          bootstrapURLKeys={{ key: 'AIzaSyAszM8s940VPqwGMH9s5S_HgubYLOMSp20' }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          <AnyReactComponent
            lat={59.955413}
            lng={30.337844}
            text="My Marker"
          />
        </GoogleMapReact>
</div>
            <form onSubmit={(e) => updateCoordinates(e)} ref={refFormAdr}>
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="address"
                        required
                        aria-describedby="addressHelp"
                        value={compAdr}
                        onChange={(e) => setAddress(e.target.value)}
                        />
                </div>
                <button  className="btn mb-4 btn-primary" type='submit'>Search Location</button>
            </form>
        </div>
    )
}

export default ClientMap