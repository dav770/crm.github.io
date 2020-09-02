import React, { Component, Fragment } from 'react';
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

// import Moment from 'react-moment';
// import 'moment-timezone';
import ClientMap from './ClientMap';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    maxWidth: 500,
  },
});

class AgentsDetails extends Component {
  constructor(props) {
    super(props);

    this.state = this.props.leState;

    this.state.checkedA = false;
    this.state.checkedB = false;
    this.state.checkedC = false;

    this.state.questions = {
      avis1: '',
      refAvis: '',
      avis2: '',
      refAvis2: '',
      revFisc: 0,
      nbFoyer: 0,
      nbPers: 0,
      situationDemandeur: 0,
      eligibleLog1: 0,
      eligibleLog2: 0,
      eligibleLog3: 0,
      regimeRetraite: 0,
      statusOccupant: '',
      travauxResidPrinc: false,
      typeParcLogement: 0,
      profession: '',
      categorieProf: 0,
    };

    console.log('for', this.state,this.props.leClient);
  }

  classes = useStyles;

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

  keyAes = 'key of secure aes256';

  async componentDidMount() {}

  handleChangeSwitch = event => {
    event.persist();
    console.log('switch button', event);
    event.target.name === 'checkedA' &&
      this.setState({ checkedA: event.target.checked });
    event.target.name === 'checkedB' &&
      this.setState({ checkedB: event.target.checked });
    event.target.name === 'checkedC' &&
      this.setState({ checkedC: event.target.checked });
  };

  handleChangeTabs = (event, newValue) => {
    console.log('handleChangeTabs', event, newValue);
    this.setState({ valueTabs: newValue });
  };

  // handleEdit = (ev, id, obj, ref) => {
  //   this.setState((prevState, prevprops) => {
  //     return {
  //       edit: true,
  //       id: id,
  //       agent: obj,
  //       prevName: obj.nom,
  //       prevEmail: obj.email,
  //       prevPwd: obj.pwd,
  //       prevLevel: obj.level,
  //       prevCompagny: obj.compagny,
  //       prevActive: obj.active,
  //     };
  //   });

  //   ref.current.click();
  // };

  // handleDelete = (ev, id) => {
  //   console.log('delete', ev.target, id);
  // };

  // handleChange = (ev, refField) => {
  //   let agent = this.state.agent;
  //   let error = false;

  //   if (ev.target.name === 'name') {
  //     if (this.verifData('name', ev.target.value, refField)) {
  //       agent.nom = ev.target.value;
  //     } else {
  //       agent.nom = ev.target.value;
  //       error = true;
  //     }
  //   }

  //   if (ev.target.name === 'email') {
  //     if (this.verifData('email', ev.target.value, refField)) {
  //       agent.email = ev.target.value;
  //     } else {
  //       agent.email = ev.target.value;
  //       error = true;
  //     }
  //   }

  //   if (ev.target.name === 'pwd') {
  //     if (this.verifData('pwd', ev.target.value, refField)) {
  //       agent.pwd = ev.target.value;
  //     } else {
  //       agent.pwd = ev.target.value;
  //       error = true;
  //     }
  //   }

  //   if (ev.target.name === 'level') {
  //     agent.level = ev.target.value;
  //   }
  //   if (ev.target.name === 'compagny') {
  //     agent.compagny = ev.target.value;
  //   }
  //   if (ev.target.name === 'active') {
  //     ev.target.value === 1 && (agent.active = true);
  //     ev.target.value === 0 && (agent.active = false);
  //   }

  //   // si retour erreur de la verif le warnMessage != ''
  //   // sinon on le remet a ''
  //   //  submit ne pourra se faire que si warnMessage === ''

  //   if (!error) {
  //     this.setState(() => {
  //       return { agent, warnMessage: '' };
  //     });
  //   } else {
  //     this.setState(() => {
  //       return { agent };
  //     });
  //   }
  // };

  // verifData = (app, data, refData) => {
  //   var resUser = {};
  //   var resEmail = {};
  //   var resPwd = {};

  //   if (app === 'name') {
  //     resUser = Verify.length(refData.current);
  //   }
  //   if (app === 'email') {
  //     resEmail = Verify.email(refData.current);
  //   }
  //   if (app === 'pwd') {
  //     resPwd = Verify.password(refData.current);
  //   }

  //   console.log('verif', resUser);

  //   if (resUser.err) {
  //     // toast et retour
  //     console.log('verif err');
  //     this.setState({ warnMessage: resUser.message });
  //     return false;
  //   }

  //   if (resEmail.err) {
  //     // toast et retour
  //     this.setState({ warnMessage: resEmail.message });
  //     return false;
  //   }

  //   if (resPwd.err) {
  //     // toast et retour
  //     this.setState({ warnMessage: resPwd.message });
  //     return false;
  //   }

  //   return true;
  // };

  // handleValide = (ev, id) => {
  //   console.log('valide', ev.target.value);
  // };

  // handleCancel = (ev, id) => {
  //   console.log('cancel', ev.target.value);
  // };

  // handleModal = (ev, ref) => {
  //   console.log('modal', this.state.edit);
  // };

  // _submitForm = (e, ref) => {
  //   e.persist();
  //   e.preventDefault();

  //   if (this.state.warnMessage === '') {

  //   CallApi.AxiosApi('update/user', 'agents', this.state.agent);
  //   ref.current.onClick();
  //   }

  // };

  render() {
    var disabledField = this.state.edit ? 'disabled' : '';

    console.log(
      'satte',
      this.state,
      this.state.clients,
      this.props.leState.clients,
    );
    return (
      <div>
        <Fragment>
          <ToastContainer />
          {/* {this.state.warnMessage !== '' && (
            <UncontrolledAlert color="warning">
              Warning saisie incorrecte, verifiez vos champs !!!
            </UncontrolledAlert>
          )} */}
          {console.log('tab value', this.state.valueTabs)}
          <Paper square className={this.classes.root}>
            <Tabs
              value={this.state.valueTabs}
              onChange={this.handleChangeTabs}
              variant="fullWidth"
              indicatorColor="secondary"
              textColor="secondary"
              aria-label="icon label tabs example"
            >
              <Tab icon={<Folder />} label="Dossier client" />
              <Tab icon={<SquareFoot />} label="Infos Techniques" />
              <Tab icon={<Notes />} label="Notes" />
              <Tab icon={<GpsFixed />} label="Geolocalisation" />
              <Tab icon={<SupervisorAccount />} label="Rendez-vous" />
              <Tab icon={<Attachment />} label="Documents" />
            </Tabs>
          </Paper>
          {this.state.valueTabs === 0 && (
            <Form>
              <Card>
                <Card.Body>
                  <h5>Infos Fiscales</h5>
                  <Row>
                    <Col sm={6} style={{ display: 'flex' }}>
                      <Label htmlFor="avis1" className="label-details">
                        Numero fiscal 1 :
                      </Label>
                      <Input
                       autoComplete="new-pass"
                        className="input-details"
                        id="avis1"
                        name="avis1"
                        value={this.state.client.avis1}
                      ></Input>
                    </Col>
                    <Col sm={6} style={{ display: 'flex' }}>
                      <Label htmlFor="refavis1" className="label-details">
                        Reference avis 1 :
                      </Label>
                      <Input
                       autoComplete="new-pass"
                       autoComplete="new-pass"
                        className="input-details"
                        id="refavis1"
                        name="refavis1"
                        value={this.state.client.refAvis1}
                      ></Input>
                    </Col>
                  </Row>

                  <Row style={{ marginTop: '10px' }}>
                    <Col sm={6} style={{ display: 'flex' }}>
                      <Label htmlFor="avis2" className="label-details">
                        Numero fiscal 2 :
                      </Label>
                      <Input
                       autoComplete="new-pass"
                        className="input-details"
                        id="avis2"
                        name="avis2"
                        value={this.state.client.avis2}
                      ></Input>
                    </Col>
                    <Col sm={6} style={{ display: 'flex' }}>
                      <Label htmlFor="refavis2" className="label-details">
                        Reference avis 2 :
                      </Label>
                      <Input
                       autoComplete="new-pass"
                        className="input-details"
                        id="refavis2"
                        name="refavis2"
                        value={this.state.client.refAvis2}
                      ></Input>
                    </Col>
                  </Row>
                  <Col sm={12}>
                    <Row
                      style={{
                        display: 'flex',
                        marginTop: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <Label className="label-details" htmlFor="revfisc">
                        Revenu fiscal :
                      </Label>
                      <Input
                       autoComplete="new-pass"
                        className="input-small input-details"
                        id="revfisc"
                        name="revfisc"
                        value={this.state.client.revFiscal}
                      ></Input>
                      <Label className="label-details" htmlFor="ville">
                        Nombre de foyer :
                      </Label>
                      <Input
                       autoComplete="new-pass"
                        className="input-small input-details"
                        type="number"
                        id="nbfoyer"
                        name="nbfoyer"
                        value={this.state.client.nbFoyer}
                      ></Input>
                      <Label className="label-details" htmlFor="cp">
                        Nombre de personne :
                      </Label>
                      <Input
                       autoComplete="new-pass"
                        className="input-small input-details"
                        type="number"
                        id="nbpers"
                        name="nbpers"
                        value={this.state.client.nbPers}
                      ></Input>
                    </Row>
                  </Col>

                  <Row>
                    <Label htmlFor="tel1">Situation demandeur :</Label>
                    <Input
                       autoComplete="new-pass"
                      style={{ width: '100%' }}
                      type="select"
                      id="situadem"
                      name="situadem"
                      value={this.state.client.situaDem}
                    >
                      <option value={0}>
                        Retraité(e) d'une entreprise du secteur privé, agé(e) de
                        70 ans et plus
                      </option>
                      <option value={1}>
                        Salarié(e) ou retraité(e) du secteur privé, agé(e) de 60
                        ans et plus, en situation de perte d'autonomie avec un
                        niveau GIR* de 1 a 4
                      </option>
                      <option value={2}>
                        Ascendant, agé(e) de 70 ans et plus ou avec un niveau
                        GIR* de 1 a 4, hébergé(e) chez un descendant salarié
                        d'une entreprise du secteur privé
                      </option>
                      <option value={3}>
                        Propriétaire bailleur dont le locataire correspond a
                        l'un des deux premiers profils ci-dessus
                      </option>
                    </Input>
                  </Row>

                  <br />
                  <Card>
                    <Card.Body>
                      <h5>
                        Conditions d’éligibilité relatives au logement du
                        bénéficiaire :
                      </h5>
                      <Row style={{ alignItems: 'center' }}>
                        <Label>
                          Le logement doit être la résidence principale du
                          senior ou de la personne en perte d’autonomie et, le
                          cas échéant, du salarié hébergeant son ascendant
                        </Label>
                        <FormControlLabel
                          style={{ marginLeft: '10px' }}
                          control={
                            <Switch
                              checked={this.state.checkedA}
                              onChange={this.handleChangeSwitch}
                              name="checkedA"
                              color="primary"
                            />
                          }
                        />
                      </Row>
                      <Row style={{ alignItems: 'center' }}>
                        <Label>
                          Le logement doit être situé dans le parc privé
                        </Label>
                        <FormControlLabel
                          style={{ marginLeft: '10px' }}
                          control={
                            <Switch
                              checked={this.state.checkedB}
                              onChange={this.handleChangeSwitch}
                              name="checkedB"
                              color="primary"
                            />
                          }
                        />
                      </Row>
                      <Row style={{ alignItems: 'center' }}>
                        <Label>
                          Le logement doit être situé sur le territoire français
                          (métropole ou DROM)
                        </Label>
                        <FormControlLabel
                          style={{ marginLeft: '10px' }}
                          control={
                            <Switch
                              checked={this.state.checkedC}
                              onChange={this.handleChangeSwitch}
                              name="checkedC"
                              color="primary"
                            />
                          }
                        />
                      </Row>
                    </Card.Body>
                  </Card>
                  <br />

                  <Row>
                    <Label htmlFor="regretraite">
                      Regime de retraite affilié :
                    </Label>
                    <Input
                       autoComplete="new-pass"
                      style={{ width: '100%' }}
                      type="select"
                      id="regretraite"
                      name="regretraite"
                      value={this.state.client.regimeRetraite}
                    >
                      <option value={0}>Agricole</option>
                      <option value={1}>
                        <s>R</s>egime <s>G</s>énéral de l'<s>A</s>ssurance{' '}
                        <s>R</s>etraite (CNAV)
                      </option>
                      <option value={2}>Autre</option>
                    </Input>
                  </Row>

                  <br />
                  <Row>
                    <Label htmlFor="statusoccup">
                      Status d'occupation de votre résidence principale :
                    </Label>
                    <Input
                       autoComplete="new-pass"
                      style={{ width: '100%' }}
                      type="select"
                      id="statusoccup"
                      name="statusoccup"
                      value={this.state.client.statusOccupant}
                    >
                      <option value={0}>Locataire</option>
                      <option value={1}>Propriétaire</option>
                      <option value={2}>
                        Hébergé(e) dans la résidence principale d'un descendant
                      </option>
                    </Input>
                  </Row>

                  <br />
                  <Row>
                    <Label htmlFor="travauxresidprinc">
                      Les travaux vont ils etre effectués dans votre résidence
                      principale ? :
                    </Label>
                    <Input
                       autoComplete="new-pass"
                      style={{ width: '100%' }}
                      type="select"
                      id="travauxresidprinc"
                      name="travauxresidprinc"
                      value={this.state.client.travauxResidPrinc}
                    >
                      <option value={0}>OUI</option>
                      <option value={1}>Non</option>
                    </Input>
                  </Row>

                  <br />
                  <Row>
                    <Label htmlFor="typeparclog">
                      Type de secteur locatif ? :{' '}
                      <mark>
                        secteur public type <strong>HLM</strong>, non eligible
                      </mark>
                    </Label>
                    <Input
                       autoComplete="new-pass"
                      style={{ width: '100%' }}
                      type="select"
                      id="typeparclog"
                      name="typeparclog"
                      value={this.state.client.typeParcLogement}
                    >
                      <option value={0}>OUI</option>
                      <option value={1}>Non</option>
                    </Input>
                  </Row>

                  <br />
                  <Row>
                    <Label htmlFor="profession">Profession du demandeur</Label>
                    <Input
                       autoComplete="new-pass"
                      style={{ width: '100%' }}
                      type="text"
                      id="profession"
                      name="profession"
                      value={this.state.client.profession}
                    ></Input>
                  </Row>

                  <br />

                  <Row>
                    <Label htmlFor="categorieprof">
                      Categorie professionnelle de l'occupant
                    </Label>
                    <Input
                       autoComplete="new-pass"
                      style={{ width: '100%' }}
                      type="select"
                      id="categorieprof"
                      name="categorieprof"
                      value={this.state.client.categorieProf}
                    >
                      <option value={0}>Agriculteur exploitant</option>
                      <option value={1}>
                        Artisan Commercant Chef d'entreprise
                      </option>
                      <option value={2}>
                        Cadre et Profession intellectuelle supérieure
                      </option>
                      <option value={3}>
                        Profession Intermédiaire (
                        
                          Instituteur, Fonctionnaire, Employé(e) administratif
                        
                        )
                      </option>
                      <option value={4}>Empoyé(e)</option>
                      <option value={5}>Ouvrier(e)</option>
                    </Input>
                  </Row>

                  <br />
                </Card.Body>{' '}
              </Card>
            </Form>
          )}
          {this.state.valueTabs === 1 && (
            <Form>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleChangeSwitch}
                    name="checkedA"
                    color="primary"
                  />
                }
                label="Secondary"
              />
            </Form>
          )}
          {this.state.valueTabs === 2 && (
            <Form>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleChangeSwitch}
                    name="checkedA"
                    color="primary"
                  />
                }
                label="Secondary"
              />
            </Form>
          )}
          {this.state.valueTabs === 3 && (
            <ClientMap adress1={this.state.newClient.adresse} ville1={this.state.newClient.ville} cp1={this.state.newClient.cp}></ClientMap>
            
          )}
          {this.state.valueTabs === 4 && (
            <Form>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleChangeSwitch}
                    name="checkedA"
                    color="primary"
                  />
                }
                label="Secondary"
              />
            </Form>
          )}
          {this.state.valueTabs === 5 && (
            <Form>
              <FormControlLabel
                control={
                  <Switch
                    checked={this.state.checkedA}
                    onChange={this.handleChangeSwitch}
                    name="checkedA"
                    color="primary"
                  />
                }
                label="Secondary"
              />
            </Form>
          )}
        </Fragment>
      </div>
    );
  }
}

export default AgentsDetails;
