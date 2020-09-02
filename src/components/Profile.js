import React, { Component } from 'react';
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
} from 'reactstrap';
import aes256 from 'aes256';
import * as CallApi from './api/CallApi';

import * as Verify from './FormatVerify';

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChangePwd: false,
      isChangeConfirmPwd: false,
      isChangeEmail: false,
      isChangeLevel: false,
      isChangeSoc: false,
      isChangeAvatar: false,
      isChangeUserName: false,
      isChangeComment: false,
      isChangeActif: false,
      userOpen: this.props.userOpen,
      warnPwd:false,
      warnLevel: false,
      warnActif: false,
      warnAvatar: false,
      warnComment: '',
      avatar: '',
    };

    
    this.myRefUser = React.createRef();
    this.myRefEmail = React.createRef();
    this.myRefPwd = React.createRef();
    this.myRefConfirmPwd = React.createRef();

    this.myReffile = React.createRef();
    this.myRefSelect = React.createRef();

    this.arrayUser = Object.entries(this.state.userOpen)
  }

  
cancelEmail = ''
cancelPwd = ''
cancelRememberMe = 0
cancelLevel = 0
cancelActif = false
cancelComment = ''

keyAes = 'key of secure aes256';

handleCancel = ()=>{
   
  this.arrayUser.forEach(e=>{
    for(let i=0;i<e.length;i++){
      switch (e[0]){
        case 'email':
          this.cancelEmail = e[1]
          return
        case 'pwd':
          this.cancelPwd = e[1]
          return
        case 'level':
          this.cancelLevel = e[1]
          return
        case 'rememberMe':
          this.cancelRememberMe = e[1]
          return
        case 'actif':
          this.cancelActif = e[1]
          return
        case 'comment':
          this.cancelComment = e[1]
          return
      }
      
    }
    
  })
  
  this.setState(function(prevstate,prevprops){
    
    let userOpen = Object.assign({},this.state.userOpen)
          userOpen.email = this.cancelEmail
          userOpen.level = this.cancelLevel
          userOpen.pwd = this.cancelPwd
          userOpen.actif = this.cancelActif
          userOpen.rememberMe = this.cancelRememberMe
          userOpen.comment = this.cancelComment
          console.log('set cancel',userOpen)
          return {warnActif: true, userOpen }
  })
    }
  

  handleChange = e => {
    console.log('set actif 0');

/*
*pour l instant pas de champs comment dans la basepour les users et agents
*plus gerer cet ajout dans le state et ses passages
*
*/

    if (e.target.name === 'comment') {
      const event = e.target.value;

      this.setState(function (prevstate, prevprops) {
        {
          let userOpen = Object.assign({}, this.state.userOpen);
          userOpen.comment = event;
          return { isChangeComment: true, userOpen };
        }
      });
    }

    if (e.target.name === 'level') {
      const event = e.target.value;

      this.setState(function (prevstate, prevprops) {
        {
          let userOpen = Object.assign({}, this.state.userOpen);
          userOpen.level = parseInt(event);
          return { isChangeLevel: true, userOpen };
        }
      });
    }

    if (e.target.name === 'email') {
      const event = e.target.value;

      this.setState(function (prevstate, prevprops) {
        {
          let userOpen = Object.assign({}, this.state.userOpen);
          userOpen.email = event;
          return { isChangeEmail: true, userOpen };
        }
      });
    }

    if(e.target.name === 'password'){
      const event = e.target.value
  
      this.setState(function(prevstate,prevprops){  
        {
          let userOpen = Object.assign({},this.state.userOpen)
          userOpen.pwd = event
          return {warnPwd: true, userOpen }
        }
        
      })
    }
  

    if (e.target.id === 'actif') {
      const event = e.target.checked;

      this.setState(function (prevstate, prevprops) {
        {
          let userOpen = Object.assign({}, this.state.userOpen);
          userOpen.actif = event;
          console.log('set actif', userOpen.actif);
          return { isChangeActif: true, userOpen };
        }
      });
    }
  };

  _submitForm = e => {
    e.preventDefault();

    const resPwd = ""
    const resUser = Verify.length(this.myRefUser.current);
    const resEmail = Verify.email(this.myRefEmail.current);

    if (this.state.warnPwd && this.state.userOpen.pwd !== '') {resPwd = Verify.password(this.myRefPwd.current)};


    
    const resConfirmPwd = Verify.password(this.myRefConfirmPwd.current);
    if (
      !resEmail.err &&
      !resPwd.err &&
      !resConfirmPwd.err &&
      !resUser.err &&
      this.myRefPwd.current.props.value ===
        this.myRefConfirmPwd.current.props.value
    ) {
// appel axios via CallApi
        CallApi.AxiosApi('/update/user', this.state.userOpen);


// renvoi du state m a j vers app.js
// enregistrement du avatar dans publis/asset/img

    }


    console.log('sub', this.state);
    console.log('333', this.myReffile.current.files[0].name);
  };


  handleCancel = ()=>{

  }

  render() {

    console.log('cd',this.state.userOpen.level)
    console.log('ev2',this.state.userOpen)
      return (
          <div>
          <Card>
          <CardHeader>{(this.state.userOpen.actif)? (<p style={{color: "red"}}>Compte Actif</p>) : (<p style={{color: "red"}}>Compte Inactif</p>)}</CardHeader>
          <CardBody>
            <Form enctype="multipart/form-data" onSubmit={this._submitForm}>
            
              <FormGroup row>
                <Label htmlFor="user" sm={2}>
                  User Name 
                  {this.state.userOpen.level === 0 && <div style={{color: "red"}}>Adminstrateur</div>}
                  {this.state.userOpen.level === 1 && <div style={{color: "red"}}>Agent</div>}
                  {this.state.userOpen.level === 2 && <div style={{color: "red"}}>Consultation</div>}
                </Label>
                <Col sm={10}>
                  <Input
                  value={this.state.userOpen.user}
                    type="text"
                    name="user"
                    placeholder="User Name placeholder"
                      onChange={this.handleChange}
                  />
                </Col>
              </FormGroup>
           
              <FormGroup row>
                <Label htmlFor="email" sm={2}>
                  Email
                </Label>
                <Col sm={10}>
                  <Input
                  value={this.state.userOpen.email}
                    type="email"
                    name="email"
                    placeholder="Email placeholder"
                      onChange={this.handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label htmlFor="password" sm={2}>
                  Password
                </Label>
                <Col sm={10}>
                  <Input
                  value={this.state.userOpen.pwd}
                    type="password"
                    name="password"
                    placeholder="password placeholder"
                      onChange={this.handleChange}
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label htmlFor="confirmPassword" sm={2}>
                  Confirm Password
                </Label>
                <Col sm={10}>
                    {this.state.warnPwd && this.state.userOpen.pwd !== '' ? (<Input
                  value={this.state.userOpen.confirmPwd}
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password placeholder"
                      onChange={this.handleChange}
                    />) : (<Input
                    disabled
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password placeholder"
                    />)}
                  </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="exampleSelect" sm={2}>
                  Select
                </Label>
                <Col sm={10}>
                  <Input type="select" name="level" ref={this.myRefSelect} onChange={this.handleChange}>
                  <option value={0}>Admin</option>
                  <option value={1}>Agent</option>
          <option value={2}>Consultant</option>
          </Input>
                </Col>
              </FormGroup>
              
              <FormGroup row>
                <Label htmlFor="comment" sm={2}>
                  Commentaires
                </Label>
                <Col sm={10}>
                  <Input type="textarea" name="comment" value={this.state.userOpen.comment} onChange={this.handleChange}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="exampleFile" sm={2}>
                  File
                </Label>
                <Col sm={10}>
                  {/* <Input type="file" ref={this.myReffile} name="file" /> */}
                  <input type="file" ref={this.myReffile}/>
                  
                </Col>
              </FormGroup>
              
              <FormGroup row>
                <Label for="checkbox2" sm={2}>
                  Checkbox
                </Label>
                
                
                    {this.state.userOpen.actif ? (<Col sm={{ size: 10 }}><FormGroup check>
                    <Label check>
                      <Input type="checkbox" id="actif" checked onChange={this.handleChange}/> Actif
                    </Label>
                  </FormGroup> </Col>) : 
                  (<Col sm={{ size: 10 }}><FormGroup check>
                    <Label check>
                      <Input type="checkbox" id="actif" onChange={this.handleChange}/> Non actif
                    </Label>
                  </FormGroup> </Col>)}
               
                  
               
              </FormGroup>
              <FormGroup check row>
                     
              <Row><Col sm={{ size: 12, offset: 6 }}>
                  <Button type='submit' style={{marginRight: "25px"}}>Submit</Button>
                  <Button type='button' onClick={this.handleCancel}>Cancel</Button>
                </Col>
                
               </Row>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
              
          </div>
      )
  }
}

export default Profile
