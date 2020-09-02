import React, { Component, Fragment } from 'react';

import { Datatable } from '@o2xp/react-datatable';

import {
  FreeBreakfast as CoffeeIcon,
  CallSplit as CallSplitIcon
} from "@material-ui/icons";
import { chunk } from "lodash";

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
      
      options: {
        keyColumn: 'id',
        data: {
          
        },
        features: {
          canEdit: true,
          canDelete: true,
          canPrint: true,
          canDownload: true,
          canSearch: true,
          canRefreshRows: true,
          canOrderColumns: true,
          canSelectRow: true,
          canSaveUserConfiguration: true,
        } ,
        userConfiguration: {
          columnsOrder: ["id", "nom", "email", "idcompagny", "MdP", "activate"],
          copyToClipboard: true
        },
        rowsPerPage: {
          available: [10, 25, 50, 100],
          selected: 50
        },
        additionalIcons: [
          {
            title: "Coffee",
            icon: <CoffeeIcon color="primary" />,
            onClick: () => alert("Coffee Time!")
          }
        ],
        selectionIcons: [
          {
            title: "Selected Rows",
            icon: <CallSplitIcon color="primary" />,
            onClick: rows => console.log(rows)
          }
        ]
      },
    };
    this.dataQuery = [];
    this.dataRows = [];
    this.dataColumns = [];
  }
  respData = null;


  refNom = React.createRef();
  refEmail = React.createRef();
  refPwd = React.createRef();
  refCompagny = React.createRef();

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
var col = null;

    res.forEach((obj, index) => {
      if (index < 1) {
        this.dataQuery = Object.keys(obj);
        for (let i = 0; i < this.dataQuery.length; i++) {
          let slice = this.dataQuery.slice(i, i + 1);


          
          (slice[0] === 'idAgents') && (col = {
            id: slice[0],
            label: slice[0],
            colSize: '25px',
            editable: false,
            dataType: "text",
            inputType: "input"
          }  );
          (slice[0] === 'nom' || slice[0] === 'email') && (col = {
            id: slice[0],
            label: slice[0],
            colSize: '25px',
            editable: true,
            dataType: "text",
            inputType: "input"
          });
          (slice[0] === 'MdP') && (col = {
            id: slice[0],
            label: slice[0],
            colSize: '25px',
            editable: true,
            dataType: "password",
            inputType: "input"
          });
          
          
          this.dataColumns.push(col);
        }
      }

      console.log('col', this.dataColumns);


      this.dataRows.push({
        idAgents: obj.idAgents,
        nom: obj.nom,
        email: obj.email,
        MdP: obj.MdP,
      });
    });

    console.log('col', this.dataColumns);
    console.log('row', this.dataRows);

this.state.options.data.columns = this.dataColumns
this.state.options.data.rows = this.dataRows
this.setState({edit:true})

    // this.setState((pevState, prevProps) => {
    //   let option = this.state.options;
    //   option.data.columns.push(this.dataColumns[0]);

    //   option.data.rows.push(this.dataRows[0]);

    //   return { options: option };
    // });
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
  //  displayModal = (
  //       <AgentsDetails leState={this.state} myRef={this.refNom}/>
  //         )

  actionsRow = ({ type, payload }) => {
    console.log(type);
    console.log(payload);
  };

  refreshRows = () => {
    const { rows } = this.options.data;
    const randomRows = Math.floor(Math.random() * rows.length) + 1;
    const randomTime = Math.floor(Math.random() * 4000) + 1000;
    const randomResolve = Math.floor(Math.random() * 10) + 1;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (randomResolve > 3) {
          resolve(chunk(rows, randomRows)[0]);
        }
        reject(new Error("err"));
      }, randomTime);
    });
  };

  render() {
    return (
      <Datatable
        options={this.state.options}
        refreshRows={this.refreshRows}
        actions={this.actionsRow}
      />
    );
  }
}

export default Agents;
