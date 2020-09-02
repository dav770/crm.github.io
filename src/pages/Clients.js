import React, { Component, Fragment, createRef } from 'react';
import { Accordion, Card } from 'react-bootstrap';

import * as CallApi from '../components/api/CallApi';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './DateTimePicker.less';

import { Paper, FormControlLabel, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  Notes,
  Folder,
  GpsFixed,
  SupervisorAccount,
  Attachment,
  SquareFoot,
} from '@material-ui/icons';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import {
  Button,
  Card as Card2,
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

import '../styles/components/modal.css';

import AgentsDetails from './AgentsDetails';
import { date } from 'faker';

// import Moment from 'react-moment';
// import 'moment-timezone';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
});

class Clients extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      edit: false,
      id: '',
      modal: false,
      modal_backdrop: false,
      modal_nested_parent: false,
      modal_nested: false,
      backdrop: false,
      client: {},
      newClient: {
        // Nom: '' ,
        // Prenom: '' ,
        // Adresse: '' ,
        // Tel1: '' ,
        // Tel2: '' ,
        // IdOrigine: 0 ,
        // Ville: '' ,
        // Cp: '' ,
        // IdAgents: 0 ,
        // DateClient: '' ,
        // Status: '' ,
        // SituationFamille: '' ,
        // NomNaissance: '' ,
        // DateNaissance: '' ,
        // VilleNaissance: '' ,
        // ComplementAdresse: '' ,
        // Departement: '' ,
        // Email: '' ,
        // DateValidation: '' ,
        // DateInstalle: '' ,
        // TypeLogement: '' ,
        // SituationHabitat: '' ,
      },

      prevNom: '',
      prevPrenom: '',
      prevAdresse: '',
      prevTel1: '',
      prevTel2: '',
      prevIdOrigine: '',
      prevVille: '',
      prevCp: '',
      prevIdAgents: '',
      prevDateClient: '',
      prevOrigine: '',
      prevStatus: '',
      prevSituationFamille: '',
      prevNomNaissance: '',
      prevDateNaissance: '',
      prevVilleNaissance: '',
      prevComplementAdresse: '',
      prevDepartement: '',
      prevEmail: '',
      prevDateValidation: '',
      prevDateModification: '',
      prevDateInstalle: '',
      prevTypeLogement: '',
      prevSituationHabitat: '',
      warnMessage: '',

      checkedA: true,
      valueTabs: 0,

      create: false,
    };

    this.refModal = createRef();

    this.refModalName = createRef();
    this.refModalPrenom = createRef();
    this.refModalSf = createRef();
    this.refModalNoB = createRef();
    this.refModalVoB = createRef();
    this.refModalDoB = createRef();
    this.refModalAdresse = createRef();
    this.refModalCompAdr = createRef();
    this.refModalCp = createRef();
    this.refModalVille = createRef();
    this.refModalDep = createRef();
    this.refModalTel1 = createRef();
    this.refModalTel2 = createRef();
    this.refModalEmail = createRef();
    this.refModalStatus = createRef();
    this.refModalDateC = createRef();
    this.refModalDateV = createRef();
    this.refModalDateI = createRef();
    this.refModalOrigine = createRef();
    this.refModalToggle = createRef();
  }

  classes = useStyles;

  dateNew = new Date();
  dateCreate = this.dateNew.getFullYear();
  dateCreate =
    this.dateNew.getMonth().toString().length < 2
      ? this.dateCreate + '-0' + (this.dateNew.getMonth() + 1)
      : this.dateCreate + '-' + (this.dateNew.getMonth() + 1);
  dateCreate =
    this.dateNew.getDate().toString().length < 2
      ? this.dateCreate + '-0' + this.dateNew.getDate()
      : this.dateCreate + '-' + this.dateNew.getDate();

  optionsAlerte = {
    title: 'Title',
    message: 'Message',
    buttons: [
      {
        label: 'Yes',
        onClick: () => alert('Click Yes'),
      },
      {
        label: 'No',
        onClick: () => alert('Click No'),
      },
    ],
    childrenElement: () => <div />,
    customUI: ({ onClose }) => <div>Custom UI</div>,
    closeOnEscape: true,
    closeOnClickOutside: true,
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypressEscape: () => {},
  };

  notify = message => {
    toast(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  toggle = modalType => e => {
    console.log('toogle', modalType, e);

    this.refreshData();

    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        warnMessage: '',
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  handleCancel = () => {
    console.log('cancel prev');

    let client = this.state.client;
    client.nom = this.state.prevNom;
    client.prenom = this.state.prevPrenom;
    client.adresse = this.state.prevAdresse;
    client.tel1 = this.state.prevTel1;
    client.tel2 = this.state.prevTel2;
    client.idOrigine = this.state.prevIdOrigine;
    client.ville = this.state.prevVille;
    client.cp = this.state.prevCp;
    client.idAgents = this.state.prevIdAgents;
    client.dateClient = this.state.prevDateClient;

    client.status = this.state.prevStatus;
    client.situationFamille = this.state.prevSituationFamille;
    client.nomNaissance = this.state.prevNomNaissance;
    client.dateNaissance = this.state.prevDateNaissance;
    client.villeNaissance = this.state.prevVilleNaissance;
    client.complementAdresse = this.state.prevComplementAdresse;
    client.departement = this.state.prevDepartement;
    client.email = this.state.prevEmail;
    client.dateValidation = this.state.prevDateValidation;
    client.dateInstalle = this.state.prevDateInstalle;
    client.typeLogement = this.state.prevTypeLogement;
    client.situationHabitat = this.state.prevSituationHabitat;
    this.setState((prevState, prevprops) => {
      return {
        edit: false,
        client: client,
      };
    });
  };

  handleEdit = (ev, id, obj, ref, allClient) => {
    obj.id = id;

    console.log('edit', allClient, obj);

    this.setState((prevState, prevprops) => {
      return {
        edit: true,
        id: id,
        client: allClient,
        prevNom: obj.nom,
        prevPrenom: obj.prenom,
        prevAdresse: obj.adresse,
        prevTel1: obj.tel1,
        prevTel2: obj.tel2,
        prevIdOrigine: obj.idOrigine,
        prevVille: obj.ville,
        prevCp: obj.cp,
        prevIdAgents: obj.idAgents,
        prevDateClient: obj.dateClient,
        prevStatus: obj.status,
        prevSituationFamille: obj.situationFamille,
        prevNomNaissance: obj.nomNaissance,
        prevDateNaissance: obj.dateNaissance,
        prevVilleNaissance: obj.villeNaissance,
        prevComplementAdresse: obj.complementAdresse,
        prevDepartement: obj.departement,
        prevEmail: obj.email,
        prevDateValidation: obj.dateValidation,
        prevDateInstalle: obj.dateInstalle,
        prevTypeLogement: obj.typeLogement,
        prevSituationHabitat: obj.situationHabitat,
        prevDateModification: obj.dateModification,
      };
    });

    ref.current.click();
  };

  async componentDidMount() {
    this.refreshData();
    // console.log('new date',this.dateCreate, typeof this.dateNew.getMonth().toString().length);
  }

  async refreshData() {
    // var res = await this.callApiRequest('clients', this.storage, [], 'get');
    var res = await this.callApiRequest('clients', this.storage, [], 'post');

    console.log('res request clients', res);
    (res === null || res.length <= 0) && (res = []);
    res = await this.formatDate(res);

    this.state.clients = res;

    console.log('push', res);
    this.forceUpdate();
    // this.setState({agents: this.state.agents})
    console.log('retour axios', res, this.state);
  }

  formatDate = res => {
    res.forEach(el => {
      if (el.dateInstalle !== null && el.dateInstalle !== '') {
        el.dateInstalle = el.dateInstalle.substring(
          0,
          el.dateInstalle.indexOf('T'),
        );
      }
      if (el.dateValidation !== null && el.dateValidation !== '') {
        el.dateValidation = el.dateValidation.substring(
          0,
          el.dateValidation.indexOf('T'),
        );
      }

      if (el.dateNaissance !== null && el.dateNaissance !== '') {
        el.dateNaissance = el.dateNaissance.substring(
          0,
          el.dateNaissance.indexOf('T'),
        );
      }
    });

    return res;
  };

  async callApiRequest(dest, storage, params, verbeHttp) {
    var arrayData = [];

    if (verbeHttp === 'post') {
      var respData = await CallApi.AxiosApi(dest, storage, params);
      return new Promise(resolve => {
        if (typeof respData === 'string') {
          arrayData = [true, respData];
        } else {
          arrayData = [false, respData];
        }

        return resolve(respData);
      });
    } else {
      var respData = await CallApi.AxiosApiGet(dest, storage, params);
      console.log('get clients');
      return new Promise(resolve => {
        if (typeof respData === 'string') {
          arrayData = [true, respData];
        } else {
          arrayData = [false, respData];
        }

        return resolve(respData);
      });
    }
  }

  handleChangeTabs = (event, newValue) => {
    console.log('handleChangeTabs', event, newValue);
    this.setState({ valueTabs: newValue });
  };

  handleChangeSwitch = event => {
    this.setState({ checkedA: event.target.checked });
  };

  async handleChange(ev, refField) {
    let client =
      refField === 'create' ? this.state.newClient : this.state.client;
    console.log('handleChange', client);

    

    let error = false;
    var res = '';
    if (ev.target.name === 'name' || ev.target.name === 'namec') {
      client.nom = ev.target.value;
    }
    if (ev.target.name === 'prenom' || ev.target.name === 'prenomc') {
      client.prenom = ev.target.value;
    }

    if (ev.target.name === 'sf' || ev.target.name === 'sfc') {
      client.situationFamille = ev.target.value;
    }

    if (ev.target.name === 'nob' || ev.target.name === 'nobc') {
      client.nomNaissance = ev.target.value;
    }

    if (ev.target.name === 'vob' || ev.target.name === 'vobc') {
      client.villeNaissance = ev.target.value;
    }

    if (ev.target.name === 'dob' || ev.target.name === 'dobc') {
      client.dateNaissance = ev.target.value;
    }

    if (ev.target.name === 'adresse' || ev.target.name === 'adressec') {
      client.adresse = ev.target.value;
    }

    if (ev.target.name === 'compadr' || ev.target.name === 'compadrc') {
      client.complementAdresse = ev.target.value;
    }

    if (ev.target.name === 'ville' || ev.target.name === 'villec') {
      client.ville = ev.target.value;
    }

    if (ev.target.name === 'cp' || ev.target.name === 'cpc') {
      client.cp = ev.target.value;
    }

    if (ev.target.name === 'dep' || ev.target.name === 'depc') {
      client.departement = ev.target.value;
    }

    if (ev.target.name === 'tel1' || ev.target.name === 'tel1c') {
      client.tel1 = ev.target.value;
    }

    if (ev.target.name === 'tel2' || ev.target.name === 'tel2c') {
      client.tel2 = ev.target.value;
    }

    if (ev.target.name === 'email' || ev.target.name === 'emailc') {
      client.email = ev.target.value;
    }

    if (ev.target.name === 'origine' || ev.target.name === 'originec') {
      client.idOrigine = ev.target.value;
    }

    if (ev.target.name === 'datec' || ev.target.name === 'datecc') {
      client.dateClient = ev.target.value;
    }

    if (ev.target.name === 'datev' || ev.target.name === 'datevc') {
      client.dateValidation = ev.target.value;
    }

    if (ev.target.name === 'datei' || ev.target.name === 'dateic') {
      client.dateInstalle = ev.target.value;
    }

    if (ev.target.name === 'datem' || ev.target.name === 'datemc') {
      client.dateModification = ev.target.value;
    }

    // si retour erreur de la verif le warnMessage != ''
    // sinon on le remet a ''
    //  submit ne pourra se faire que si warnMessage === ''

    if (!error) {
      if (refField === 'create') {
        client.suppClient = 0;
        client.idAgents = 1;
        this.setState(() => {
          return { newClient: client, warnMessage: '', create: true };
        });
      } else {//modif depuis modal
        this.setState(() => {
          return { client, warnMessage: '' };
        });
      }
    } else {
      this.notify(res);
      if (refField === 'create') {
        this.setState(() => {
          return { newClient: client };
        });
      } else { 
        this.setState(() => {
          return { client };
        });
      }
    }

    console.log('handleChange', this.state.newClient);
  }

  async handleDelete(e, idClient, tel1, resp) {
    var params = [];
    params.push(idClient, tel1);
    if (resp) {
      await this.callApiRequest('delete', 'clients', params, 'get');

      this.refreshData();
    }
  }

  _submitForm = (e, ref) => {
    e.persist();
    e.preventDefault();

    console.log('submit', this.state);

    if (this.state.warnMessage === '') {
      CallApi.AxiosApi('update/user', 'client', this.state.client);
      ref.current.onClick();

      this.refreshData();
    }
  };

  _submitFormCreate = (e, appForm) => {
    e.persist();
    e.preventDefault();

    if (appForm === 1) {
      let newClient = this.state.newClient;
      let dateVerif = '';
      dateVerif = newClient.dateInstalle;
      newClient.dateInstalle =
        dateVerif === '' || dateVerif === undefined ? null : dateVerif;

      dateVerif = newClient.dateValidation;
      newClient.dateValidation =
        dateVerif === '' || dateVerif === undefined ? null : dateVerif;

      dateVerif = newClient.dateNaissance;
      newClient.dateNaissance =
        dateVerif === '' || dateVerif === undefined ? null : dateVerif;

      this.setState(() => {
        return { newClient: newClient };
      }, this.addClient());

      console.log('submit create', this.state.newClient);
    } else {
    }
  };

 addClient =()=>{
console.log('undefinde',(this.state.newClient.complementAdresse !== '' &&
this.state.newClient.complementAdresse !== undefined)
  ? (this.state.newClient.complementAdresse)
  : (''), this.state.newClient.complementAdresse , typeof this.state.newClient.complementAdresse);

    let newClient = {
      nom:
        this.state.newClient.nom !== '' &&
        this.state.newClient.nom !== undefined
          ? this.state.newClient.nom
          : '',
      prenom:
        this.state.newClient.prenom !== '' &&
        this.state.newClient.prenom !== undefined
          ? this.state.newClient.prenom
          : '',
      adresse:
        this.state.newClient.adresse !== '' &&
        this.state.newClient.adresse !== undefined
          ? this.state.newClient.adresse
          : '',
      tel1:
        this.state.newClient.tel1 !== '' &&
        this.state.newClient.tel1 !== undefined
          ? this.state.newClient.tel1
          : '',
      tel2:
        this.state.newClient.tel2 !== '' &&
        this.state.newClient.tel2 !== undefined
          ? this.state.newClient.te2
          : '',
      idOrigine:
        this.state.newClient.idOrigine !== 0 &&
        this.state.newClient.idOrigine !== undefined
          ? this.state.newClient.idOrigine
          : 0,
      ville:
        this.state.newClient.ville !== '' &&
        this.state.newClient.ville !== undefined
          ? this.state.newClient.ville
          : '',
      cp:
        this.state.newClient.cp !== '' &&
        this.state.newClient.cp !== undefined
          ? this.state.newClient.cp
          : '',
      idAgents: 
        this.state.newClient.idAgents !== 0 &&
        this.state.newClient.idAgents !== undefined
          ? this.state.newClient.idAgents
          : 0,
      situationFamille:
        this.state.newClient.situationFamille !== '' &&
        this.state.newClient.situationFamille !== undefined
          ? this.state.newClient.situationFamille
          : 'Celibataire',
      nomNaissance:
        this.state.newClient.nomNaissance !== '' &&
        this.state.newClient.nomNaissance !== undefined
          ? this.state.newClient.nomNaissance
          : '',
      dateNaissance:
        this.state.newClient.dateNaissance !== '' &&
        this.state.newClient.dateNaissance !== null &&
        this.state.newClient.dateNaissance !== undefined
          ? this.state.newClient.dateNaissance
          : null,
      villeNaissance:
        this.state.newClient.villeNaissance !== '' &&
        this.state.newClient.villeNaissance !== undefined
          ? this.state.newClient.villeNaissance
          : '',
      complementAdresse:
        this.state.newClient.complementAdresse !== '' &&
        this.state.newClient.complementAdresse !== undefined
          ? this.state.newClient.complementAdresse
          : '',
      departement:
        this.state.newClient.departement !== '' &&
        this.state.newClient.departement !== undefined
          ? this.state.newClient.departement
          : '',
      email:
        this.state.newClient.email !== '' &&
        this.state.newClient.email !== undefined
          ? this.state.newClient.email
          : '',
      dateValidation:
        this.state.newClient.dateValidation !== '' &&
        this.state.newClient.dateValidation !== null &&
        this.state.newClient.dateValidation !== undefined
          ? this.state.newClient.dateValidation
          : null,
      dateInstalle:
        this.state.newClient.dateInstalle !== '' &&
        this.state.newClient.dateInstalle !== null &&
        this.state.newClient.dateInstalle !== undefined
          ? this.state.newClient.dateInstalle
          : null,
      dateClient: null,
      suppClient: 0,
    };

    console.log('submit create', newClient);

    if (this.state.warnMessage === '') {
     var resp =  CallApi.AxiosApi('add/client', 'client', newClient);
console.log('retour callapi create', resp);
      this.refreshData();
    }
  };

  handleRetourDetails = () => {
    console.log('retour detail');
  };

  render() {
    var disabledField = '';
    console.log('state glogale', this.state);
    return (
      <>
        <Fragment>
          <ToastContainer />

          <Modal
            size="lg"
            isOpen={this.state.modal}
            toggle={this.toggle()}
            backdrop={this.state.backdrop}
          >
            <Form
              autoComplete="new-password"
              enctype="multipart/form-data"
              onSubmit={e => this._submitForm(e, this.refModalToggle)}
            >
              <ModalHeader toggle={this.toggle()}>Details Client</ModalHeader>

              <ModalBody>
                <Row>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="name" sm={4}>
                        Nom
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalName}
                        value={this.state.client.nom}
                        type="text"
                        name="name"
                        placeholder="Name "
                        onChange={e => this.handleChange(e, this.refModalName)}
                        style={{
                          borderColor: this.state.warnName ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="prenom" sm={4}>
                        Prenom
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalPrenom}
                        value={this.state.client.prenom}
                        type="text"
                        name="prenom"
                        placeholder="prenom "
                        onChange={e =>
                          this.handleChange(e, this.refModalPrenom)
                        }
                        style={{
                          borderColor: this.state.warnPrenom ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="sf" sm={4}>
                        Situation familliale
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalSf}
                        value={this.state.client.situationFamille}
                        type="select"
                        name="sf"
                        placeholder="situation famille "
                        onChange={e => this.handleChange(e, this.refModalSf)}
                      >
                        <option value="Celibataire">Celibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Pascé(e)">Pascé(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                        <option value="Veuf(ve)">Veuf(ve)</option>
                      </Input>
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="nob" sm={5}>
                        Nom de naissance
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalNoB}
                        value={this.state.client.nomNaissance}
                        type="text"
                        name="nob"
                        placeholder="Name of birth "
                        onChange={e => this.handleChange(e, this.refModalNoB)}
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="vob" sm={4}>
                        Ville de Naissance
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalVoB}
                        value={this.state.client.villeNaissance}
                        type="text"
                        name="vob"
                        placeholder="ville de naissance "
                        onChange={e => this.handleChange(e, this.refModalVoB)}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="dob" sm={5}>
                        Date de naissance
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalDoB}
                        value={this.state.client.dateNaissance}
                        type="date"
                        name="dob"
                        placeholder="date of birth "
                        onChange={e => this.handleChange(e, this.refModalDoB)}
                        style={{
                          borderColor: this.state.warnDoB ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>

                <hr></hr>
                <br></br>
                <Row>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="adresse" sm={4}>
                        Adresse
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalAdresse}
                        value={this.state.client.adresse}
                        type="text"
                        name="adresse"
                        placeholder="adresse "
                        onChange={e =>
                          this.handleChange(e, this.refModalAdresse)
                        }
                        style={{
                          borderColor: this.state.warnAdresse ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="compadr" sm={5}>
                        Complement adresse
                      </Label>

                      <Input
                        autoComplete="new-password"
                        ref={this.refModalCompAdr}
                        value={this.state.client.complementAdresse}
                        type="text"
                        name="compadr"
                        placeholder="complement adresse "
                        onChange={e =>
                          this.handleChange(e, this.refModalCompAdr)
                        }
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>
                <Row>
                  <FormGroup col className="col-sm-4">
                    <FormGroup row>
                      <Label htmlFor="cp" sm={4}>
                        Code Postal
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-small"
                        ref={this.refModalCp}
                        value={this.state.client.cp}
                        type="text"
                        name="cp"
                        placeholder="code postal "
                        onChange={e => this.handleChange(e, this.refModalCp)}
                        style={{
                          borderColor: this.state.warnCp ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-4">
                    <FormGroup row>
                      <Label htmlFor="ville" sm={4}>
                        Ville
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-small"
                        ref={this.refModalVille}
                        value={this.state.client.ville}
                        type="text"
                        name="ville"
                        placeholder="Ville "
                        onChange={e => this.handleChange(e, this.refModalVille)}
                        style={{
                          borderColor: this.state.warnVille ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-4">
                    <FormGroup row>
                      <Label htmlFor="dep" sm={5}>
                        Departement
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-small"
                        ref={this.refModalDep}
                        value={this.state.client.departement}
                        type="text"
                        name="dep"
                        placeholder="departement "
                        onChange={e => this.handleChange(e, this.refModalDep)}
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>

                <hr></hr>
                <br></br>

                <Row>
                  <FormGroup col className="col-sm-4">
                    <FormGroup row>
                      <Label htmlFor="tel1" sm={3}>
                        Tel: 1
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-small"
                        ref={this.refModalTel1}
                        value={this.state.client.tel1}
                        type="tel"
                        name="tel1"
                        placeholder="Telephone 1 "
                        onChange={e => this.handleChange(e, this.refModalTel1)}
                        style={{
                          borderColor: this.state.warnTel1 ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-4">
                    <FormGroup row>
                      <Label htmlFor="tel2" sm={3}>
                        Tel: 2
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-small"
                        ref={this.refModalTel2}
                        value={this.state.client.tel2}
                        type="tel"
                        name="tel2"
                        placeholder="Telephone 2 "
                        onChange={e => this.handleChange(e, this.refModalTel2)}
                        style={{
                          borderColor: this.state.warnTel2 ? 'red' : 'none',
                        }}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-4">
                    <FormGroup row>
                      <Label htmlFor="email" sm={3}>
                        Email
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-medium"
                        ref={this.refModalEmail}
                        value={this.state.client.email}
                        type="email"
                        name="email"
                        placeholder="email "
                        onChange={e => this.handleChange(e, this.refModalEmail)}
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>

                <hr></hr>
                <br></br>
                <Row>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="origine" sm={4}>
                        Source
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-small"
                        ref={this.refModalOrigine}
                        value={this.state.client.IdOrigine}
                        type="select"
                        name="origine"
                        placeholder="Source origine "
                        onChange={e =>
                          this.handleChange(e, this.refModalOrigine)
                        }
                        style={{
                          borderColor: this.state.warnOrigine ? 'red' : 'none',
                        }}
                      >
                        <option value={0}>LEAD</option>
                        <option value={1} >ROBOT</option>
                        <option value={2}>PRED</option>
                        <option value={3}>MAIL</option>
                        <option value={4}>PARAINAGE</option>
                        <option value={5}>COURIER</option>
                      </Input>
                    </FormGroup>

                    <FormGroup row>
                      <Label htmlFor="datec" sm={4}>
                        Date création
                      </Label>

                      <Input
                        autoComplete="new-password"
                        disabled
                        className="input-small"
                        ref={this.refModalDateC}
                        value={this.state.client.dateClient}
                        type="datetime-local"
                        name="datec"
                        placeholder="date creation"
                        onChange={e => this.handleChange(e, this.refModalDateC)}
                      />
                    </FormGroup>
                  </FormGroup>
                  <FormGroup col className="col-sm-6">
                    <FormGroup row>
                      <Label htmlFor="datev" sm={4}>
                        Date validation
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-medium"
                        ref={this.refModalDateV}
                        value={this.state.client.dateValidation}
                        type="text"
                        name="datev"
                        placeholder="date validation"
                        onChange={e => this.handleChange(e, this.refModalDateV)}
                      />
                    </FormGroup>

                    <FormGroup row>
                      <Label htmlFor="datei" sm={4}>
                        Date installation
                      </Label>

                      <Input
                        autoComplete="new-password"
                        className="input-medium"
                        ref={this.refModalDateI}
                        value={this.state.client.dateInstalle}
                        type="date"
                        name="datei"
                        placeholder="date installation"
                        onChange={e => this.handleChange(e, this.refModalDateI)}
                      />
                    </FormGroup>
                  </FormGroup>
                </Row>
              </ModalBody>
              <ModalFooter>
                <FormGroup style={{ width: '100%' }}>
                  <Row>
                    <Card className="card-agent">
                      <Label>Agent :</Label>{' '}
                      <strong>{this.state.client.nomAgent}</strong>
                    </Card>
                    <Button type="submit" color="primary">
                      Valider
                    </Button>{' '}
                    <Button
                      ref={this.refModalToggle}
                      color="secondary"
                      // onClick={this.toggle()}
                      onClick={this.toggle()}
                    >
                      Cancel
                    </Button>
                  </Row>
                </FormGroup>
              </ModalFooter>
            </Form>
          </Modal>
        </Fragment>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              Consulter !
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Adresse</th>
                    <th>Tel1</th>
                    <th>Tel2</th>
                    <th>Date validation</th>
                    <th>Date installation</th>
                  </tr>
                </thead>

                <tbody>
                  {this.state.clients.map(client => (
                    <tr key={client.idClient}>
                      {/* {client.dateValidation !== null && (client.dateValidation = client.dateValidation.substring(0,client.dateValidation.indexOf('.')))console.log('id', client)} */}

                      <td>{client.idClient}</td>
                      <td>
                        <input
                          type="text"
                          style={{ border: 'none' }}
                          disabled={true}
                          value={client.nom}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          style={{ border: 'none' }}
                          disabled={true}
                          value={client.prenom}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          style={{ border: 'none' }}
                          disabled={true}
                          value={client.adresse}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          style={{ border: 'none' }}
                          disabled={true}
                          value={client.tel1}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          style={{ border: 'none' }}
                          disabled={true}
                          value={client.tel2}
                        />
                      </td>
                      {client.dateValidation !== null ? (
                        <td>
                          <input
                            className="text-center"
                            type="date"
                            style={{ border: 'none' }}
                            disabled={true}
                            value={client.dateValidation}
                            // value={client.dateValidation !== null && (new Date(client.dateValidation))}
                          />
                        </td>
                      ) : (
                        <td>
                          <input
                            type="text"
                            style={{ border: 'none' }}
                            disabled={true}
                            value=""
                          />
                        </td>
                      )}

                      {client.dateInstalle !== null ? (
                        <td>
                          <input
                            className="text-center"
                            type="date"
                            style={{ border: 'none' }}
                            disabled={true}
                            value={client.dateInstalle}
                          />
                        </td>
                      ) : (
                        <td>
                          <input
                            type="text"
                            style={{ border: 'none' }}
                            disabled={true}
                            value=""
                          />
                        </td>
                      )}

                      <Fragment>
                        <td>
                          <button
                            disabled={disabledField}
                            className="btn btn-sm btn-primary"
                            onClick={e =>
                              this.handleEdit(
                                e,
                                client.idClient,
                                {
                                  nom: client.nom,
                                  tel1: client.tel1,
                                  tel2: client.tel2,
                                },
                                this.refModal,
                                client,
                              )
                            }
                          >
                            Edit
                          </button>
                        </td>
                        <td>
                          {/* bouton qui declenche le modal il sans bord et fond pour etre invisible juste invoque par handleEdit qui recupere son ref */}
                          <button
                            disabled={disabledField}
                            className="btn btn-sm btn-primary"
                            ref={this.refModal}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              fontSize: 0,
                            }}
                            onClick={this.toggle()}
                          >
                            Edit
                          </button>
                        </td>

                        <td>
                          <button
                            disabled={disabledField}
                            className="btn btn-sm btn-danger"
                            onClick={e => {
                              confirmAlert({
                                customUI: ({ onClose }) => {
                                  return (
                                    <div className="custom-ui">
                                      <h1>Are you sure?</h1>
                                      <p>You want to delete this file?</p>
                                      <button onClick={onClose}>No</button>
                                      <button
                                        onClick={() => {
                                          this.handleDelete(
                                            e,
                                            client.idClient,
                                            client.tel1,
                                            true,
                                          );
                                          onClose();
                                        }}
                                      >
                                        Yes, Delete it!
                                      </button>
                                    </div>
                                  );
                                },
                              });
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </Fragment>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              Creer !
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <Form
                  autoComplete="new-pass"
                  enctype="multipart/form-data"
                  onSubmit={e => this._submitFormCreate(e, 1)}
                >
                  <Row>
                    <Col sm={3}>
                      <Label htmlFor="namec">Nom :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="namec"
                        name="namec"
                        value={this.state.newClient.nom}
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnName ? 'red' : 'none',
                        }}
                      ></Input>
                      <Label htmlFor="prenomc">Prenom :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="prenomc"
                        name="prenomc"
                        value={this.state.newClient.prenom}
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnPrenom ? 'red' : 'none',
                        }}
                      ></Input>
                      <Label htmlFor="sfc">Situation familiale :</Label>
                      <Input
                        autoComplete="new-pass"
                        type="select"
                        id="sfc"
                        name="sfc"
                        value={this.state.newClient.situationFamille}
                        onChange={e => this.handleChange(e, 'create')}
                      >
                        <option value="Celibataire">Celibataire</option>
                        <option value="Marié(e)">Marié(e)</option>
                        <option value="Pascé(e)">Pascé(e)</option>
                        <option value="Divorcé(e)">Divorcé(e)</option>
                        <option value="Veuf(ve)">Veuf(ve)</option>
                      </Input>
                      <Label htmlFor="nobc">Nom de naissance :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="nobc"
                        name="nobc"
                        value={this.state.newClient.nomNaissance}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Label htmlFor="vobc">Ville de naissance :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="vobc"
                        name="vobc"
                        value={this.state.newClient.villeNaissance}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Label htmlFor="dobc">Date de naissance :</Label>
                      <Input
                        autoComplete="new-pass"
                        type="date"
                        id="dobc"
                        name="dobc"
                        value={this.state.newClient.dateNaissance}
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnDateNaissance
                            ? 'red'
                            : 'none',
                        }}
                      ></Input>
                      <Label htmlFor="adressec">Adresse :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="adressec"
                        name="adressec"
                        value={this.state.newClient.adresse}
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnAdresse ? 'red' : 'none',
                        }}
                      ></Input>
                      <Label htmlFor="compadrc">Complement d'adresse :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="compadrc"
                        name="compadrc"
                        value={this.state.newClient.complementAdresse}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Label htmlFor="villec">Ville :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="villec"
                        name="villec"
                        value={this.state.newClient.ville}
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnVille ? 'red' : 'none',
                        }}
                      ></Input>
                      <Label htmlFor="cp">Code postal :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="cp"
                        name="cp"
                        value={this.state.newClient.cp}
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnCp ? 'red' : 'none',
                        }}
                      ></Input>
                      <Label htmlFor="depc">Departement :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="depc"
                        name="depc"
                        value={this.state.newClient.departement}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Label htmlFor="tel1c">Tel 1 :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="tel1c"
                        name="tel1c"
                        value={this.state.newClient.tel1}
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnTel1 ? 'red' : 'none',
                        }}
                      ></Input>
                      <Label htmlFor="tel2c">Tel 2 :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="tel2c"
                        name="tel2c"
                        value={this.state.newClient.tel2}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Label htmlFor="emailc">Email :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="emailc"
                        name="emailc"
                        value={this.state.newClient.email}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Label htmlFor="originec">Source :</Label>
                      <Input
                        autoComplete="new-pass"
                        id="originec"
                        name="originec"
                        value={this.state.newClient.idOrigine}
                        type="select"
                        placeholder="Source origine "
                        onChange={e => this.handleChange(e, 'create')}
                        style={{
                          borderColor: this.state.warnOrigine ? 'red' : 'none',
                        }}
                      >
                        <option value={0}>LEAD</option>
                        <option value={1}>ROBOT</option>
                        <option value={2}>PRED</option>
                        <option value={3}>MAIL</option>
                        <option value={4}>PARAINAGE</option>
                        <option value={5}>COURIER</option>
                      </Input>
                      <Label htmlFor="datecc">Date de creation :</Label>
                      <Input
                        disabled
                        autoComplete="new-pass"
                        type="date"
                        id="datecc"
                        name="datecc"
                        value={this.dateCreate}
                      ></Input>
                      <Label htmlFor="datemc">Date de modification :</Label>
                      <Input
                        disabled
                        autoComplete="new-pass"
                        type="date"
                        id="datemc"
                        name="datemc"
                        value={''}
                      ></Input>
                      <Label htmlFor="datevc">Date de validation :</Label>
                      <Input
                        autoComplete="new-pass"
                        type="date"
                        id="datevc"
                        name="datevc"
                        value={this.state.newClient.DateValidation}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Label htmlFor="dateic">Date de installation :</Label>
                      <Input
                        autoComplete="new-pass"
                        type="date"
                        id="dateic"
                        name="dateic"
                        value={this.state.newClient.DateInstalle}
                        onChange={e => this.handleChange(e, 'create')}
                      ></Input>
                      <Button type="submit" color="primary">
                        {!this.state.create ? "Valider" : "Modifier"}
                      </Button>{' '}
                      <Button color="secondary" onClick={this.handleCancel}>
                        Cancel
                      </Button>
                    </Col>

                    <Col sm={9}>
                      <AgentsDetails
                        leState={this.state} leClient={this.state.newClient}
                        recieveInfos={this.handleRetourDetails}
                      ></AgentsDetails>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>
    );
  }
}

export default Clients;
