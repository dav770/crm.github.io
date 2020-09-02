import React, { Component, Fragment } from 'react';
import MaterialTable from 'material-table';
// import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Paper } from '@material-ui/core';
import aes256 from 'aes256';
import * as CallApi from '../components/api/CallApi';

import * as Verify from '../components/FormatVerify';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AgentsDetails from './AgentsDetails';

class Agents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      activate: true,
      agents: [],
    };
    this.dataQuery = [];
    this.dataRows = {};
  }
  respData = null;

  refNom = React.createRef()
  refEmail = React.createRef()
  refPwd = React.createRef()
  refCompagny = React.createRef()

  btnModal = (
    <button
      type="button"
      className="btn btn-primary"
      data-toggle="modal"
      data-target="#staticBackdrop"
    >
      +
    </button>
  );


  handleChange = (ev, id) => {
    var event = ev.target.value;
    for (let i = 0; i < this.state.agents.length; i++) {
      if (this.state.agents[i].idAgents === id) {
        this.setState(() => {
          var arrayAgent = this.state.agents;
          arrayAgent[i].name = event;
          console.log('change', arrayAgent);
          return { agents: arrayAgent };
        });

        return;
      }
    }
  };

  handleClick = e => {
    console.log('table', e.target.className);
    

    if (e.target.id === 'edit') {
      console.log('clic', e.target);
      this.setState({ edit: true });
    }
  };

  async componentDidMount() {
    var res = await this.callApiRequest('agents', this.storage, []);
    console.log('res', res);
    res.forEach(obj => {
      this.setState((pevState, prevProps) => {
        let agent = this.state.agents;

        agent.push({
          activate: obj.activeAgents,
          edit: false,
          name: obj.nom,
          email: obj.email,
          compagny: obj.idcompagny,
          pwd: obj.MdP,
          idAgents: obj.idAgents,
        });

        return { agents: agent };
      });
    });
  }

  async callApiRequest(dest, storage, params) {
    var arrayData = [];

    var respData = await CallApi.AxiosApi(dest, storage, params);
    return new Promise(resolve => {
      if (typeof respData === 'string') {
        arrayData = [true, respData];
      } else {
        arrayData = [false, respData];
      }

      return resolve(respData);
    });
  }

  btnActions = null;
 displayModal = (
      <AgentsDetails leState={this.state} myRef={this.refNom}/>
        )

  render() {

   

    const elements = this.state.agents.map((el, index) => {
      console.log('map', el);
      if (this.state.edit) {
        return (
          <tr key={el.idAgents}>
            <th scope="row">{el.idAgents}</th>
            <td>
              <input
                className={`id-${el.idAgents}`}
                type="text"
                id="name"
                value={el.name}
                onChange={e => this.handleChange(e, el.idAgents)}
                style={{ border: 'none' }}
              ></input>
            </td>
            <td>
              <input
                className={`id-${el.idAgents}`}
                type="email"
                id="email"
                value={el.email}
                onChange={this.handleChange}
                style={{ border: 'none' }}
              ></input>
            </td>
            <td>
              <input
                className={`id-${el.idAgents}`}
                type="password"
                id="pwd"
                value={el.pwd}
                onChange={this.handleChange}
                style={{ border: 'none' }}
              ></input>
            </td>
            <td>
              <input
                className={`id-${el.idAgents}`}
                type="text"
                id="compagny"
                value={el.compagny}
                onChange={this.handleChange}
                style={{ border: 'none' }}
              ></input>
            </td>
            {this.state.edit ? (
              <td>
                <button
                  type="button"
                  className={`btn btn-outline-primary btn-sl  waves-effect id-${el.idAgents}`}
                  style={{ borderRadius: '10%', marginRight: '5px' }}
                  onClick={this.handleClick}
                >
                  <i id="valide" className="fas fa-check-circle">
                    Validate
                  </i>
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-danger btn-sl  waves-effect id-${el.idAgents}`}
                  style={{ borderRadius: '10%', marginRight: '5px' }}
                  onClick={this.handleClick}
                >
                  <i id="cancel" className="fas fa-ban">
                    Cancel
                  </i>
                </button>
              </td>
            ) : (
              <td>
                <button
                  name={el.idAgents}
                  type="button"
                  className={`btn btn-outline-primary btn-sl  waves-effect id-${el.idAgents}`}
                  style={{ borderRadius: '10%', marginRight: '5px' }}
                  onClick={e => this.handleClick(e)}
                >
                  <i id="edit" className={`fas fa-user-edit id-${el.idAgents}`}>
                    {' '}
                    Edit
                  </i>
                </button>

                <button
                  type="button"
                  className={`btn btn-outline-danger btn-sl  waves-effect id-${el.idAgents}`}
                  style={{ borderRadius: '10%', marginRight: '5px' }}
                >
                  <i className="fas fa-trash-alt"> Delete</i>
                </button>
                {this.state.activate ? (
                  <button
                    type="button"
                    className={`btn btn-outline-danger btn-sl  waves-effect id-${el.idAgents}`}
                    style={{ borderRadius: '10%', marginRight: '5px' }}
                  >
                    <i className="fas fa-trash-alt"> Desactivate</i>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={`btn btn-outline-primary btn-sl  waves-effect id-${el.idAgents}`}
                    style={{ borderRadius: '10%', marginRight: '25px' }}
                  >
                    <i className="fas fa-trash-alt"> Activate</i>
                  </button>
                )}
              </td>
            )}
          </tr>
        );
      } else {
        return (
          <Fragment>
         
          <tr key={el.idAgents}>
            <th scope="row">{el.idAgents}</th>
            <td ref={this.refNom} className={`id-${el.idAgents}`}>{el.name}</td>
            <td ref={this.refEmail} className={`id-${el.idAgents}`}>{el.email}</td>
            <td ref={this.refPwd} className={`id-${el.idAgents}`}>{el.pwd}</td>
            <td ref={this.refCompagny} className={`id-${el.idAgents}`}>{el.compagny}</td>
            <td>
              {this.state.edit ? (
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sl  waves-effect"
                    style={{ borderRadius: '10%', marginRight: '5px' }}
                    onClick={this.handleClick}
                  >
                    <i id="valide" className="fas fa-check-circle">
                      Validate
                    </i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sl  waves-effect"
                    style={{ borderRadius: '10%', marginRight: '5px' }}
                    onClick={this.handleClick}
                  >
                    <i id="cancel" className="fas fa-ban">
                      Cancel
                    </i>
                  </button>
                </td>
              ) : (
                
                <td>
                <div>{this.displayModal}</div>
                  <button
                    name={el.idAgents}
                    type="button"
                    className={`btn btn-outline-primary btn-sl  waves-effect id-${el.idAgents}`}
                    style={{ borderRadius: '10%', marginRight: '5px' }}
                    onClick={e => this.handleClick(e)}
                  >
                    <i id="edit" className="fas fa-user-edit">
                      {' '}
                      Edit
                    </i>
                  </button>
                  {this.btnModal}

                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sl  waves-effect"
                    style={{ borderRadius: '10%', marginRight: '5px' }}
                  >
                    <i className="fas fa-trash-alt"> Delete</i>
                  </button>
                  {this.state.activate ? (
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sl  waves-effect"
                      style={{ borderRadius: '10%', marginRight: '5px' }}
                    >
                      <i className="fas fa-trash-alt"> Desactivate</i>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sl  waves-effect"
                      style={{ borderRadius: '10%', marginRight: '25px' }}
                    >
                      <i className="fas fa-trash-alt"> Activate</i>
                    </button>
                  )}
                </td>
              )}
            </td>
          </tr></Fragment>
        );
      }
    });

    return (
      <Fragment>
   
        <table
          id="table-agents"
          className="table table-striped table-responsive-md btn-table"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Pwd</th>
              <th>Compagny</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>{elements}</tbody>
        </table>
      </Fragment>
    );
  }
}

export default Agents;
