import logo200Image from 'assets/img/logo/logo_200.png';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';

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

class AuthForm extends React.Component {
  // modif perso :
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      email: '',
      pwd: '',
      confirmPwd: '',
      rememberMe: false,
      validate: false,
    };

    this.myRefUser = React.createRef();
    this.myRefEmail = React.createRef();
    this.myRefPwd = React.createRef();
    this.myRefConfirmPwd = React.createRef();
  }

  keyAes = 'key of secure aes256';

  dateConnect = new Date();

  get isLogin() {
    return this.props.authState === STATE_LOGIN;
  }

  get isSignup() {
    return this.props.authState === STATE_SIGNUP;
  }

  handleChange = e => {
    

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

  handleSubmit = event => {
    event.preventDefault();

    if (event.target.innerHTML === 'Signup') {
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
        // local storage
        const storage = {
          user: this.state.user,
          email: this.state.email,
          pwd: aes256.encrypt(this.keyAes, this.state.pwd),
          rememberMe: this.state.rememberMe,
          validate: aes256.encrypt(
            this.keyAes,
            this.dateConnect.getDate().toString() +
              this.dateConnect.getMonth().toString() +
              this.dateConnect.getFullYear().toString(),
          ),
        };
        this.saveLocalStorage(storage);

        // axios via CallApi
        CallApi.AxiosApi('Signup', storage);

        this.setState({ validate: true });
        return;
      }
    }

    if (event.target.innerHTML === 'Login') {
      const storage = {
      user : 'NC',
      email : '',
      pwd : '',
      rememberMe : false,
      validate : '',
      }

      
     
      const readStorage = this.readLocalStorage();

      if (readStorage !== null) {
        
        const resEmail = Verify.email(this.myRefEmail.current);
        const resPwd = Verify.password(this.myRefPwd.current);
        if (!resEmail.err && !resPwd.err) {
          console.log('res');
          
          if (
          
            readStorage.email === this.myRefEmail.current.props.value &&
            aes256.decrypt(this.keyAes, readStorage.pwd) ===
              this.myRefPwd.current.props.value
          ) {
            

            console.log('equ');
          

            storage.user = readStorage.user;
            storage.email = readStorage.email;
            storage.pwd = readStorage.pwd;
            storage.rememberMe = readStorage.rememberMe;
            storage.validate = aes256.encrypt(
              this.keyAes,
              this.dateConnect.getDate().toString() +
                this.dateConnect.getMonth().toString() +
                this.dateConnect.getFullYear().toString(),
            );

            this.saveLocalStorage(storage);

            this.setState({ validate: true });
            return
            }else{
              // saisie ne correspond pas au localStorage
              console.log('not',aes256.decrypt(this.keyAes, readStorage.pwd) ===
              this.myRefPwd.current.props.value);
            }


        } else {
          // saisies non valides
          
        }
      }else{
        
      }
      
    }
  }


  readLocalStorage = () => {
    const getStorage = localStorage.getItem('userActif');
    return JSON.parse(getStorage);
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
        {this.state.validate && <Redirect to="/" />}

        <Form onSubmit={this.handleSubmit}>
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
            onClick={this.handleSubmit}
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
