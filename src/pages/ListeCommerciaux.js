import React, { Component, Fragment } from 'react';

import aes256 from 'aes256';
import * as CallApi from '../components/api/CallApi';


import {
  Alert,
  Input,
  Label,
  FormGroup,
  Form,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  UncontrolledAlert,
} from 'reactstrap';

import * as Verify from '../components/FormatVerify';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createRef } from 'react';
class ListeCommerciaux extends Component {
  constructor(props) {
    super(props);

    this.state = {
      agents: [],
      edit: false,
      id: '',
      modal: false,
      modal_backdrop: false,
      modal_nested_parent: false,
      modal_nested: false,
      backdrop: false,
      agent: {},

      prevName: '',
      prevTel1: '',
      prevTel2: '',
      
      warnMessage: '',
    };

    this.refModal = createRef();
    
    this.refModalTel1 = createRef();
    this.refModalTel2 = createRef();
    this.refModalName = createRef();
    
    this.refModalToggle = createRef();

    
  }

  optionsAlerte = {
    title: 'Title',
    message: 'Message',
    buttons: [
      {
        label: 'Yes',
        onClick: () => alert('Click Yes')
      },
      {
        label: 'No',
        onClick: () => alert('Click No')
      }
    ],
    childrenElement: () => <div />,
    customUI: ({ onClose }) => <div>Custom UI</div>,
    closeOnEscape: true,
    closeOnClickOutside: true,
    willUnmount: () => {},
    afterClose: () => {},
    onClickOutside: () => {},
    onKeypressEscape: () => {}
  };

  

  notify = (message) => {

    toast(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    });
  }

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

  async componentDidMount() {
    this.refreshData()
  }

  async refreshData(){
    var res = await this.callApiRequest('commercial', this.storage, [], 'post');
    this.state.agents = res;
    console.log('push', res);
    this.forceUpdate();
    // this.setState({agents: this.state.agents})
    console.log('retour axios', res, this.state);
  }

  async callApiRequest(dest, storage, params, verbeHttp) {
    var arrayData = [];

    if(verbeHttp === 'post'){
      var respData = await CallApi.AxiosApi(dest, storage, params);
    return new Promise(resolve => {
      if (typeof respData === 'string') {
        arrayData = [true, respData];
      } else {
        arrayData = [false, respData];
      }

      return resolve(respData);
    });
    }else{
      var respData = await CallApi.AxiosApiGet(dest, storage, params);
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

  handleEdit = (ev, id, obj, ref) => {
    obj.id = id;

    console.log('type of', typeof id)
    this.setState((prevState, prevprops) => {
      return {
        edit: true,
        id: id,
        agent: obj,
        prevName: obj.nom,
        prevTel1: obj.tel1,
        prevTel2: obj.tel2,
        
      };
    });

    ref.current.click();
  };

  handleDelete (ev, id, refTel1) {
    console.log('delete', ev.target, id, refTel1);
    
    confirmAlert({
      title: `Confirm to delete a commercial id : ${id}`,
      message: 'Are you sure to do this.',
      buttons: [
        {
          label: 'Confirme',
          onClick: () => {
            this.callApiRequest('delete', 'commercial', [id, refTel1]);
            setTimeout(() => {
              
    this.refreshData()
            }, 2000);
          }
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ]
    });


  };

  handleChange = (ev, refField) => {
    let agent = this.state.agent;
    let error = false;
var res = ''
    if (ev.target.name === 'name') {
      
      res = this.verifData('name', ev.target.value, refField)
      console.log('change 1',res, ev.target.value, refField);
      if (res === '') {
        agent.nom = ev.target.value;
      } else {
        agent.nom = ev.target.value;
        error = true;
      }
    }


    if (ev.target.name === 'tel1') {
      agent.level = ev.target.value;
    }
    if (ev.target.name === 'tel2') {
      agent.compagny = ev.target.value;
    }

    // si retour erreur de la verif le warnMessage != ''
    // sinon on le remet a ''
    //  submit ne pourra se faire que si warnMessage === ''

    
    if (!error) {
      this.setState(() => {
        return { agent, warnMessage: '' };
      });
    } else {
      this.notify(res)
      this.setState(() => {
        return { agent };
      });
    }
  };

  verifData = (app, data, refData) => {
    var resUser = {};
    var resEmail = {};
    var resPwd = {};

    if (app === 'name') {
      
      resUser = Verify.length(refData.current, data);
    }
    if (app === 'email') {
      resEmail = Verify.email(refData.current, data);
    }
    if (app === 'pwd') {
      resPwd = Verify.password(refData.current, data);
    }

    

    if (resUser.err) {
      // toast et retour
      console.log('verif err', resUser.message);
      this.setState({ warnMessage: resUser.message });
      return resUser.message;
    }

    if (resEmail.err) {
      // toast et retour
      this.setState({ warnMessage: resEmail.message });
      return resEmail.message;
    }

    if (resPwd.err) {
      // toast et retour
      this.setState({ warnMessage: resPwd.message });
      return resPwd.message;
    }

    
    return '';
  };

  handleValide = (ev, id) => {
    console.log('valide', ev.target.value);
  };

  handleCancel = (ev, id) => {
    console.log('cancel', ev.target.value);
  };

  handleModal = (ev, ref) => {
    console.log('modal', this.state.edit);
  };

  _submitForm = (e, ref) => {
    e.persist();
    e.preventDefault();
    
    if (this.state.warnMessage === '') {
     
      
    CallApi.AxiosApi('update/user', 'commercial', this.state.agent);
    ref.current.onClick();


    this.refreshData()
    }
    
  };

  render() {
    var disabledField = '' //this.state.edit ? 'disabled' : '';

    console.log('state', this.state);
    return (
      <div>
        <Fragment>
          <ToastContainer />
          
          <Modal
            isOpen={this.state.modal}
            toggle={this.toggle()}
            backdrop={this.state.backdrop}
          >
            <Form
              enctype="multipart/form-data"
              onSubmit={e => this._submitForm(e, this.refModalToggle)}
            >
              <ModalHeader toggle={this.toggle()}>Agent Details</ModalHeader>

              <ModalBody>
                <FormGroup row>
                  <Label htmlFor="name" sm={2}>
                    Nom
                  </Label>
                  <Col sm={10}>
                    <Input
                      ref={this.refModalName}
                      value={this.state.agent.nom}
                      type="text"
                      name="name"
                      placeholder="Name placeholder"
                      onChange={e => this.handleChange(e, this.refModalName)}
                      style={{
                        borderColor: this.state.warnName ? 'red' : 'none',
                      }}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="tel1" sm={3}>
                    Tele 1 :
                  </Label>
                  <Col sm={10}>
                    <Input
                      ref={this.refModalTel1}
                      value={this.state.agent.tel1}
                      type="tel"
                      name="tel1"
                      placeholder="telephone placeholder"
                      onChange={e => this.handleChange(e, this.refModalTel1)}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label htmlFor="tel1" sm={3}>
                    Tele 2 :
                  </Label>
                  <Col sm={10}>
                    <Input
                      ref={this.refModalTel2}
                      value={this.state.agent.tel2}
                      type="tel"
                      name="tel2"
                      placeholder="telephone placeholder"
                      onChange={e => this.handleChange(e, this.refModalTel2)}
                    />
                  </Col>
                </FormGroup>
           
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary">
                  Valider
                </Button>{' '}
                <Button
                  ref={this.refModalToggle}
                  color="secondary"
                  onClick={this.toggle()}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </Fragment>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>id</th>
              <th>Nom</th>
              <th>Tel1</th>
              <th>Tel2</th>
              
            </tr>
          </thead>

          <tbody>
            {this.state.agents.map(agent => (
              <tr key={agent.idCommercial}>
                {console.log('id', this.state.id === agent.idCommercial)}
                <td>{agent.idCommercial}</td>
                <td>
               
                    <input
                      type="text"
                      style={{ border: 'none' }}
                      disabled={true}
                      value={agent.nom}
                    />
                  
                </td>
                <td>
               
                    <input
                    
                      type="text"
                      style={{ border: 'none' }}
                      disabled={true}
                      value={agent.tel1}
                    />
                  
                </td>
                <td>
               
                    <input
                    
                      type="text"
                      style={{ border: 'none' }}
                      disabled={true}
                      value={agent.tel2}
                    />
                  
                </td>
                
                
                  <Fragment>
                    <td>
                      <button
                        disabled={disabledField}
                        className="btn btn-sm btn-primary"
                        onClick={e =>
                          this.handleEdit(
                            e,
                            agent.idCommercial,
                            {
                              nom: agent.nom,
                              tel1: agent.tel1,
                              tel2: agent.tel2,
                            },
                            this.refModal,
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
                        onClick={e => this.handleDelete(e, agent.idCommercial,agent.tel1 , confirmAlert(this.optionsAlerte))}
                      >
                        Delete
                      </button>
                    </td>
                  </Fragment>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ListeCommerciaux;
