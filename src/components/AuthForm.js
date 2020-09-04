import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Button, Form, FormGroup, Input, Label, Col, Row } from 'reactstrap';

import {
  BrowserRouter,
  Route,
  Switch,
  Redirect,
  NavLink,
} from 'react-router-dom';
import aes256 from 'aes256';
import * as CallApi from './api/CallApi';

import * as Verify from './FormatVerify';

// import Cryptr from 'cryptr';
// const cryptr = new Cryptr('myTotalySecretKey');

// const encryptedString = cryptr.encrypt('bacon');
// const decryptedString = cryptr.decrypt('mjhfksdjh');

// console.log('000',encryptedString); // e7b75a472b65bc4a42e7b3f78833a4d00040beba796062bf7c13d9533b149e5ec3784813dc20348fdf248d28a2982df85b83d1109623bce45f08238f6ea9bd9bb5f406427b2a40f969802635b8907a0a57944f2c12f334bd081d5143a357c173a611e1b64a
// console.log('1111',decryptedString); // bacon

class AuthForm extends React.Component {
  // modif perso :
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      email: '',
      pwd: '',
      level: 0,
      confirmPwd: '',
      rememberMe: false,
      validate: aes256.encrypt(
        this.keyAes,
        this.dateConnect.getDate().toString() +
          this.dateConnect.getMonth().toString() +
          this.dateConnect.getFullYear().toString(),
      ),
      codeAuth: '',
      submited: false,
    };

    this.myRefUser = React.createRef();
    this.myRefEmail = React.createRef();
    this.myRefPwd = React.createRef();
    this.myRefConfirmPwd = React.createRef();
    this.myRefSelect = React.createRef();
    this.myRefCode = React.createRef();
  }

  keyAes = 'key of secure aes256';

  arrayParams = [];
  // responseAPI = null;
  dateConnect = new Date();

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  handleChange = e => {
    if (e.target.name === 'code') {
      const event = e.target.value;
      this.setState({ codeAuth: event });
    }

    if (e.target.name === 'level') {
      const event = e.target.value;

      this.setState({ level: parseInt(event) });
    }

    if (e.target.id === 'rememberMe') {
      this.setState({ [e.target.id]: e.target.checked });
    } else {
      this.setState({ [e.target.id]: e.target.value });
    }
  };

  changeAuthState = authState => event => {
    event.preventDefault();

    this.props.onChangeAuthState(authState);
  };

  storage = {
    user: 'NC',
    email: '',
    pwd: '',
    rememberMe: false,
    validate: '',
  };

  handleSubmit = (event, app) => {
    event.persist();
    event.preventDefault();

    console.log('submit login', app);

    if (app === 'SIGNUP') {
      if (this.myRefCode.current.props.value !== '123456') {
        //en attendant

        // affichage toast err
        return;
      }
      const resUser = Verify.length(this.myRefUser.current);
      const resEmail = Verify.email(this.myRefEmail.current);
      const resPwd = Verify.password(this.myRefPwd.current);
      const resConfirmPwd = Verify.password(this.myRefConfirmPwd.current);

      if (
        !resEmail.err &&
        !resPwd.err &&
        !resConfirmPwd.err &&
        !resUser.err &&
        this.myRefPwd.current.props.value ===
          this.myRefConfirmPwd.current.props.value
      ) {
        

        // j envoi le model objet storage que la fonction rempli est je retourne sont contenu dans l objet storage local a la fonction
        this.storage = this.writeValueLocalStorage(this.state, this.storage);

        this.saveLocalStorage(this.storage);

        // axios via CallApi
        this.responseAPI = this.callApiRequest('Signup', this.storage, []);
        console.log('respAPI', this.responseAPI);

        this.setState({ submited: true });
        return;
      }
    }

    if (app === 'LOGIN') {
      //  const storage avant test function writevaluelocalstorage

      const readStorage = this.readLocalStorage();

      if (readStorage !== null) {
        const resEmail = Verify.email(this.myRefEmail.current);
        const resPwd = Verify.password(this.myRefPwd.current);
        console.log('res', resEmail, resPwd);

        if (!resEmail.err && !resPwd.err) {
          console.log('comparaison email ',readStorage.email, this.myRefEmail.current.props.value)
          console.log('comparaison pwd ',aes256.decrypt(this.keyAes, readStorage.pwd),readStorage.pwd, this.myRefPwd.current.props.value)
          if (
            
            readStorage.email === this.myRefEmail.current.props.value &&
            aes256.decrypt(this.keyAes, readStorage.pwd) ===
              this.myRefPwd.current.props.value
          ) {
            console.log('equ');

            
            this.setState({ submited: true });
            return;
          } else {
            console.log('saisie non equ localstorage');
            // saisie ne correspond pas au localStorage
            // on va verifier dans la base sql
            this.arrayParams = []; //on vide
            this.arrayParams.push(
              'all',
              `${this.myRefEmail.current.props.value}`,
            );

            // le retour est un array [err= true ou false, data={}]

            this.callApiRequest('Login', this.storage, this.arrayParams).then(
              responseAPI => {
                if (!responseAPI[0]) {
                  // j envoi le model objet storage que la fonction rempli est je retourne sont contenu dans l objet storage local a la fonction
                  console.log('responseAPI', responseAPI);

                  this.storage = this.writeValueLocalStorage(
                    responseAPI[1],
                    this.storage,
                  );

                  console.log('response storage api', this.storage);

                  this.saveLocalStorage(this.storage);

                  this.setState({ submited: true });
                }
              },
            );
          }
        } else {
          // saisies non valides
          console.log('saisie non valide');
        }
      } else {
      }
    }
  };

  // verifier passage parametres avec axios post ici pour signup

  async callApiRequest(dest, storage, params) {
    var arrayData = [];
    var respDataArr = [];

    if (dest === 'Signup') {
      var respData = await CallApi.AxiosApi(dest, storage, params);
      if (typeof respData === 'string') {
        arrayData = [true, respData];
      } else {
        arrayData = [false, respData];
      }
    }

    if (dest === 'Login') {
      var respData = await CallApi.AxiosApiGet(dest, storage, params);
      console.log('retour express', respData);
      return new Promise(resolve => {
        // les key ne sont pas nomees de la meme facon que le state ou storage obj
        // alors on renomme

        respDataArr.push(respData);
        console.log('respdataarr', respDataArr);
        respDataArr = respDataArr.map(function (obj) {
          console.log(
            'map',
            obj['nom'],
            (obj['user'] = obj['nom']),
            'hhh',
            obj,
          );
          obj['user'] = obj['nom']; // Assign new key
          delete obj['nom']; // Delete old key
          obj['pwd'] = obj['MdP']; // Assign new key
          delete obj['MdP']; // Delete old key
          obj['level'] = obj['idLevel']; // Assign new key
          delete obj['idLevel']; // Delete old key
          return obj;
        });

        console.log('respdataarr00', respDataArr);

        if (typeof respData === 'string') {
          arrayData = [true, respData];
        } else {
          arrayData = [false, respDataArr[0]];
          arrayData[1].validate = this.state.validate;
        }

        console.log('respdataarr 2', arrayData);
        return resolve(arrayData);
      });
    }
  }

  readLocalStorage = () => {
    const getStorage = localStorage.getItem('userActif');
    return JSON.parse(getStorage);
  };

  writeValueLocalStorage = (readStorage, storage) => {
    console.log('writestorage', readStorage);

    storage.user = readStorage.user;
    storage.email = readStorage.email;
    storage.pwd = aes256.encrypt(this.keyAes, readStorage.pwd);
    storage.rememberMe = readStorage.rememberMe;
    storage.validate = aes256.encrypt(
      this.keyAes,
      this.dateConnect.getDate().toString() +
        this.dateConnect.getMonth().toString() +
        this.dateConnect.getFullYear().toString(),
    );

    return storage;
  };

  saveLocalStorage = storage => {
    localStorage.setItem('userActif', JSON.stringify(storage));
  };

  renderButtonText() {
    const { buttonText } = this.props;

    if (!buttonText && this.isLogin) {
      return 'Login';
    }

    if (!buttonText && this.isSignup) {
      return 'Signup';
    }

    return buttonText;
  }

  logoClick = false;
  LogoClick = (app = false) => {
    this.logoClick = app;
    this.forceUpdate();
  };

  render() {
    const inputUser = (
      <FormGroup>
        <Label for={this.props.userLabel}>{this.props.userLabel}</Label>

        <Input
          id="user"
          type="text"
          placeholder="your user name"
          ref={this.myRefUser}
          value={this.state.user}
          onChange={this.handleChange}
        />
      </FormGroup>
    );

    const {
      showLogo,
      userLabel,
      userInputProps,
      usernameLabel,
      usernameInputProps,
      passwordLabel,
      passwordInputProps,
      confirmPasswordLabel,
      confirmPasswordInputProps,
      children,
      onLogoClick,
    } = this.props;

    return (
      <Fragment>
        {/* {this.state.submited && <Redirect to="/" />} */}
        {this.state.submited && this.props.callBackAuth(true) }

        <Form onSubmit={e => this.handleSubmit(e, this.props.authState)}>
          {showLogo && (
            <div className="text-center pb-4">
              <img
                src={logo200Image}
                className="rounded"
                style={{ width: 60, height: 60, cursor: 'pointer' }}
                alt="logo"
                // onClick={onLogoClick}
                onClick={() => this.LogoClick(true)}
              />
            </div>
          )}

          {this.props.authState === STATE_SIGNUP && (
            <FormGroup row>
              <Label for="exampleSelect" sm={2}>
                Level
              </Label>
              <Row>
                <Col sm={5}>
                  <Input
                    disabled
                    type="select"
                    name="level"
                    ref={this.myRefSelect}
                    onChange={this.handleChange}
                    style={{ width: '150px', marginRight: '25px' }}
                  >
                    <option value={0}>Admin</option>
                    <option value={1}>Agent</option>
                    <option value={2}>Consultant</option>
                  </Input>
                </Col>
                <Label for="code" sm={2}>
                  code
                </Label>
                <Col sm={5}>
                  <Input
                    type="password"
                    name="code"
                    ref={this.myRefCode}
                    value={this.state.codeAuth}
                    onChange={this.handleChange}
                    style={{ width: '150px' }}
                  ></Input>
                </Col>
              </Row>
            </FormGroup>
          )}

          {/* affichage du user name pour le SignUp */}
          {this.props.authState === STATE_SIGNUP && inputUser}

          <FormGroup>
            <Label for={usernameLabel}>{usernameLabel}</Label>

            <Input
              {...usernameInputProps}
              ref={this.myRefEmail}
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for={passwordLabel}>{passwordLabel}</Label>
            <Input
              {...passwordInputProps}
              ref={this.myRefPwd}
              value={this.state.pwd}
              onChange={this.handleChange}
            />
          </FormGroup>
          {this.isSignup && (
            <FormGroup>
              <Label for={confirmPasswordLabel}>{confirmPasswordLabel}</Label>
              <Input
                {...confirmPasswordInputProps}
                ref={this.myRefConfirmPwd}
                value={this.state.confirmPwd}
                onChange={this.handleChange}
              />
            </FormGroup>
          )}
          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                id="rememberMe"
                value={this.state.rememberMe}
                onChange={this.handleChange}
              />{' '}
              {this.isSignup ? 'Agree the terms and policy' : 'Remember me'}
            </Label>
          </FormGroup>
          <hr />
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-theme-left border-0"
            block
            // onClick={this.handleSubmit}     a verifier !!!!!!!!!!!!!!!!
          >
            {this.renderButtonText()}
          </Button>

          <div className="text-center pt-1">
            <h6>or</h6>
            <h6>
              {this.isSignup ? (
                <a href="#login" onClick={this.changeAuthState(STATE_LOGIN)}>
                  Login
                </a>
              ) : (
                <a href="#signup" onClick={this.changeAuthState(STATE_SIGNUP)}>
                  Signup
                </a>
              )}
            </h6>
          </div>

          {children}
        </Form>
      </Fragment>
    );
  }
}

export const STATE_LOGIN = 'LOGIN';
export const STATE_SIGNUP = 'SIGNUP';

AuthForm.propTypes = {
  authState: PropTypes.oneOf([STATE_LOGIN, STATE_SIGNUP]).isRequired,
  showLogo: PropTypes.bool,
  userLabel: PropTypes.string,
  userInputProps: PropTypes.object,
  usernameLabel: PropTypes.string,
  usernameInputProps: PropTypes.object,
  passwordLabel: PropTypes.string,
  passwordInputProps: PropTypes.object,
  confirmPasswordLabel: PropTypes.string,
  confirmPasswordInputProps: PropTypes.object,
  onLogoClick: PropTypes.func,
};

AuthForm.defaultProps = {
  authState: 'LOGIN',
  showLogo: true,
  usernameLabel: 'Email',
  usernameInputProps: {
    id: 'email',
    type: 'email',
    placeholder: 'your@email.com',
  },
  userLabel: 'user',
  userInputProps: {
    id: 'user',
    type: 'text',
    placeholder: 'your user name',
  },
  passwordLabel: 'Password',
  passwordInputProps: {
    id: 'pwd',
    type: 'password',
    placeholder: 'your password',
  },
  confirmPasswordLabel: 'Confirm Password',
  confirmPasswordInputProps: {
    id: 'confirmPwd',
    type: 'password',
    placeholder: 'confirm your password',
  },
  onLogoClick: () => {},
};

export default AuthForm;
