import React, { Component, Fragment } from 'react';
import {
  GoogleMap,
  LoadScript,
  InfoWindow,
  Marker,
} from '@react-google-maps/api';

import Geocode from 'react-geocode';

import * as CallApi from '../components/api/CallApi';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

class ClientMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: {},
      currentPosition: {},
      latitude: 0,
      longitude: 0,
      address: '',
      ville: '',
      cp: '',
      resRdv: [],
    };
  }

  async componentDidMount() {
    Geocode.setApiKey('AIzaSyAszM8s940VPqwGMH9s5S_HgubYLOMSp20');
    Geocode.setLanguage('en');
    Geocode.enableDebug();
    var compAdr =
      this.props.address1 + ' ' + this.props.ville1 + ' ' + this.props.cp1;
    await this.fromAdr(compAdr);
    await this.success('#');

    var params = this.state.currentPosition;
    var respData = await CallApi.AxiosApi(
      'planing',
      `crmcdsoft.planingrdv p left outer join crmcdsoft.commercial c on p.idCommercial = c.id
    Left outer join crmcdsoft.client cli on p.idclient = cli.idclient`,
      params,
    );

    var filtreData = await this.filtrePosition(respData);
    console.log('response call', respData);

    this.setState({ resRdv: filtreData });
  }

  filtrePosition = respData => {
    var resdataFiltre = [];
    var latCurrent = this.state.latitude.toString();
    var lngCurrent = this.state.longitude.toString();
    console.log('filtre 1',this.state.latitude.toString(),this.state.longitude.toString() );

    if (respData.length > 0) {
      console.log('filtre 2');
      for (let i = 0; i < respData.length; i++) {
        var lat = respData[i].posLat.toString();
        var lng = respData[i].posLong.toString();
        console.log('filtre 3',lat,lng );

        if (
          (lat.slice(0, lat.indexOf('.')) === latCurrent.slice(0, latCurrent.indexOf('.')) &&
          lat.indexOf('.') !== -1 &&
          latCurrent.indexOf('.') !== -1) &&
          (lng.slice(0, lng.indexOf('.')) === lngCurrent.slice(0, lngCurrent.indexOf('.')) &&
          lng.indexOf('.') !== -1 &&
          lngCurrent.indexOf('.') !== -1)
        ) {
          resdataFiltre.push(respData[i]);
        }
        console.log('filtre 4',lat.slice(0, lat.indexOf('.')),'--', latCurrent.slice(0, latCurrent.indexOf('.')));
        console.log('filtre 4',lng.slice(0, lng.indexOf('.')),'--', lngCurrent.slice(0, lngCurrent.indexOf('.')));

        
      }
    }

    return resdataFiltre;
  };

  // Get address from latidude & longitude.
  fromLatLng() {
    Geocode.fromLatLng('48.8583701', '2.2922926').then(
      response => {
        const address = response.results[0].formatted_address;
        console.log('fnc lat', address);
      },
      error => {
        console.error('err lat', error);
      },
    );
  }

  // Get latidude & longitude from address.
  async fromAdr(adr) {
    console.log('fnc adr', adr);
    return new Promise(resolve => {
      Geocode.fromAddress(adr).then(
        response => {
          const { lat, lng } = response.results[0].geometry.location;
          console.log('form adr', adr, response, lat, lng);
          var position = { coords: { latitude: lat, longitude: lng } };
          this.handlePosition('name', lat, lng);
          this.setState({ latitude: lat, longitude: lng });
          return resolve(response);
        },
        error => {
          console.error('err adr', error);
          return resolve(error);
        },
      );
    });
  }

  success = position => {
    console.log('success', position);

    var currentPosition = {};
    return new Promise(resolve => {
      if (position === '#') {
        currentPosition = {
          lat: this.state.latitude,
          lng: this.state.longitude,
        };
      } else {
        // provient de : navigator.geolocation.getCurrentPosition (success);
        currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      }

      this.setState({ currentPosition });
      console.log('success 2', currentPosition);
      return resolve(this.state);
    });
  };

  // useEffect (() => {
  //   // navigator.geolocation.getCurrentPosition (success);
  //   console.log('use effect');
  // })

  handlePosition = (name, lat, lng) => {
    console.log('clic option', name, lat, lng);
    this.locations = [];
    this.locations.push({
      name: name,
      location: {
        lat: lat, //48.862725,
        lng: lng, //2.3514616
      },
    });

    this.forceUpdate();
  };

  onSelect = item => {
    this.setState({ selected: item });
  };

  mapStyles = {
    height: '100vh',
    width: '100%',
  };

  defaultCenter = {
    lat: 41.3851,
    lng: 2.1734,
  };

  comOption = '';
  // model location
  // {
  //   name: "Location 1",
  //   location: {
  //     lat: 41.3954,
  //     lng: 2.162
  //   },
  // },

  // {
  //   this.state.currentPosition.lat &&
  //   (
  //     <Marker position={this.state.currentPosition}/>
  //   )
  // }
  locations = [];
  render() {
    {
      this.comOption = this.state.resRdv.map(rdv => (
        <option
          onClick={() =>
            this.handlePosition(rdv.Commercial, rdv.posLat, rdv.posLong)
          }
        >
          Com: {rdv.Commercial} --- Cli: {rdv.Client}
        </option>
      ));
    }

    return (
      <Fragment>
        <Card>
          <Input type="date" />
          <Input type="time" />

          {/*  */}
          <FormGroup>
            <Label for="liste">Liste des Commerciaux </Label>
            <Input type="select" name="liste" id="liste" multiple>
              {this.comOption}
            </Input>
          </FormGroup>
        </Card>

        {console.log('location', this.locations)}

        <LoadScript googleMapsApiKey="AIzaSyAszM8s940VPqwGMH9s5S_HgubYLOMSp20">
          <GoogleMap
            mapContainerStyle={this.mapStyles}
            zoom={16}
            center={this.state.currentPosition}
          >
            {this.locations.length > 0 &&
              this.locations.map(item => {
                return (
                  <Marker
                    key={item.name}
                    position={item.location}
                    onClick={() => this.onSelect(item)}
                  />
                );
              })}
            {this.state.selected.location && (
              <InfoWindow
                position={this.state.selected.location}
                clickable={true}
                onCloseClick={() => this.setState({ selected: {} })}
              >
                <p>{this.state.selected.name}</p>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </Fragment>
    );
  }
}

export default ClientMap;
