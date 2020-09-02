import React , { Fragment, Component } from 'react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


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

class ClientInfoPerso extends Component {

constructor(props) {
    super(props)

    this.state = this.props.leState

    console.log('state', this.state, this.props);
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

  render(){
    var disabledField = '' 


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
                  <th>Prenom</th>
                  <th>Adresse</th>
                  <th>Tel1</th>
                  <th>Tel2</th>
                </tr>
              </thead>

              <tbody>
                {this.state.clients.map(client => (
                  <tr key={client.idClient}>
                    {console.log('id', this.state.id === client.idClient)}
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
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>

                      <td>
                        <button
                          disabled={disabledField}
                          className="btn btn-sm btn-danger"
                          onClick={e =>
                            this.handleDelete(
                              e,
                              client.idClient,
                              client.tel1,
                              confirmAlert(this.optionsAlerte),
                            )
                          }
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
    )

  }


}

export default ClientInfoPerso
