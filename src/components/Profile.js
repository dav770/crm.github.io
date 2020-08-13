import React, { Component } from 'react'
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

class Profile extends Component {
constructor(props) {
  super(props)

  this.state = {
     isChangePwd:false,
     isChangeConfirmPwd:false,
     isChangeEmail:false,
     isChangeLevel:false,
     isChangeSoc:false,
     isChangeAvatar:false,
     isChangeUserName:false,
     userOpen: this.props.user
  }
}
handleChange = (e)=>{
  console.log('set actif 0',)
 

  if(e.target.name === 'level'){
    const event = e.target.value

    this.setState(function(prevstate,prevprops){
     
      
      {
        let userOpen = Object.assign({},this.state.userOpen)
        userOpen.level = parseInt(event)
        console.log('set')
        return {warnLevel: true, userOpen }
      }
      
    })
  }

  if(e.target.id === 'actif'){
    const event = e.target.checked
   
    this.setState(function(prevstate,prevprops){
      
      {
        let userOpen = Object.assign({},this.state.userOpen)
        userOpen.actif = event
        console.log('set actif',userOpen.actif)
        return {warnActif: true, userOpen }
      }
      
    })
      
    }
  

  
  }
  
  
  

  render() {

    console.log('cd',this.state.userOpen.level)
    console.log('ev2',this.state.userOpen)
      return (
          <div>
          <Card>
          <CardHeader>{(this.state.userOpen.actif)? (<p style={{color: "red"}}>Compte Actif</p>) : (<p style={{color: "red"}}>Compte Inactif</p>)}</CardHeader>
          <CardBody>
            <Form>
            
              <FormGroup row>
                <Label htmlFor="userName" sm={2}>
                  User Name 
                  {this.state.userOpen.level === 0 && <div style={{color: "red"}}>Adminstrateur</div>}
                  {this.state.userOpen.level === 1 && <div style={{color: "red"}}>Agent</div>}
                  {this.state.userOpen.level === 2 && <div style={{color: "red"}}>Consultation</div>}
                </Label>
                <Col sm={10}>
                  <Input
                  value={this.props.userOpen.user}
                    type="text"
                    name="userName"
                    placeholder="User Name placeholder"
                  />
                </Col>
              </FormGroup>
           
              <FormGroup row>
                <Label htmlFor="email" sm={2}>
                  Email
                </Label>
                <Col sm={10}>
                  <Input
                  value={this.props.userOpen.email}
                    type="email"
                    name="email"
                    placeholder="Email placeholder"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label htmlFor="password" sm={2}>
                  Password
                </Label>
                <Col sm={10}>
                  <Input
                    type="password"
                    name="password"
                    placeholder="password placeholder"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label htmlFor="confirmPassword" sm={2}>
                  Confirm Password
                </Label>
                <Col sm={10}>
                  <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password placeholder"
                  />
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
                <Label for="exampleText" sm={2}>
                  Commentaires
                </Label>
                <Col sm={10}>
                  <Input type="textarea" name="text" />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="exampleFile" sm={2}>
                  File
                </Label>
                <Col sm={10}>
                  <Input type="file" name="file" />
                  <FormText color="muted">
                    This is some placeholder block-level help text for the
                    above input. It's a bit lighter and easily wraps to a new
                    line.
                  </FormText>
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
                <Col sm={{ size: 10, offset: 2 }}>
                  <Button>Submit</Button>
                </Col>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
              
          </div>
      )
  }
}

export default Profile
