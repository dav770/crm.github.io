import { STATE_LOGIN, STATE_SIGNUP } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/AuthPage';
import Planning from 'pages/Planning';
import React from 'react';
import componentQueries from 'react-component-queries';
import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  NavLink,
} from 'react-router-dom';
import './styles/reduction.scss';

import aes256 from 'aes256';

import Profile from './components/Profile';
import TestCp from './components/TestCp';

import { isEmpty } from 'lodash';
import ListeAgents from './pages/ListeAgents';
import ListeCommerciaux from './pages/ListeCommerciaux';
import Clients from './pages/Clients';
// const Profile = React.lazy(() => import('components/Profile'));

const AlertPage = React.lazy(() => import('pages/AlertPage'));
const AuthModalPage = React.lazy(() => import('pages/AuthModalPage'));
const BadgePage = React.lazy(() => import('pages/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('pages/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('pages/ButtonPage'));
const CardPage = React.lazy(() => import('pages/CardPage'));
const ChartPage = React.lazy(() => import('pages/ChartPage'));
const DashboardPage = React.lazy(() => import('pages/DashboardPage'));
const DropdownPage = React.lazy(() => import('pages/DropdownPage'));
const FormPage = React.lazy(() => import('pages/FormPage'));
const InputGroupPage = React.lazy(() => import('pages/InputGroupPage'));
const ModalPage = React.lazy(() => import('pages/ModalPage'));
const ProgressPage = React.lazy(() => import('pages/ProgressPage'));
const TablePage = React.lazy(() => import('pages/TablePage'));
const TypographyPage = React.lazy(() => import('pages/TypographyPage'));
const WidgetPage = React.lazy(() => import('pages/WidgetPage'));

const getBasename = () => {
  return `/`;
  // return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      email: 'demo@gmail.com',
      pwd: aes256.encrypt(this.keyAes, 'demoPwd770@'),
      rememberMe: true,
      validate: aes256.encrypt(this.keyAes, 'date of day'),
      auth: 1, //0=a refaire, 1=true, 2=false
      origine: '/',
      level: 0,
      actif: true,
      confirmPwd: '',
      comment: '',
    };
  }

  callHeader = logOut => {
    if (logOut) {
      // si demande logout force render avec appel de la fonction verifredirect pour revenir sur login et interdire nav vers dashboard
      // puisque value validate du localstorage est supprimee depuis header.js
      this.setState({ auth: 0, origine: '/' });
    }
  };

  keyAes = 'key of secure aes256';

  componentDidMount() {
    console.log(' monte');

    this.verifRedirect();
  }

  verifRedirect = () => {
    
    
    this.auth = 0; //ouverture de l 'appli doit etre protegee pour eviter navigation depuis url sans etre authentifie

    this.getStorage = localStorage.getItem('userActif');
    this.validateStorage = '';
console.log('verif redirect APP ',this.getStorage);

    if (this.getStorage === null || isEmpty(this.getStorage)) {
      const storage = {
        user: this.state.user,
        email: this.state.email,
        pwd: this.state.pwd,
        rememberMe: this.state.rememberMe,
        validate: aes256.encrypt(this.keyAes, this.state.validate),
      };
      localStorage.setItem('userActif',JSON.stringify(storage));
      this.validateStorage = storage;
      console.log('rentre dans verif', this.validateStorage);
      
    } else {
      this.validateStorage = JSON.parse(this.getStorage);
    }

    // console.log(
    //   'comparaison verif',
    //   aes256.decrypt(this.keyAes, this.validateStorage.validate) ===
    //     this.dateConnect.getDate().toString() +
    //       this.dateConnect.getMonth().toString() +
    //       this.dateConnect.getFullYear().toString(),
    // );
    if (
      aes256.decrypt(this.keyAes, this.validateStorage.validate) ===
      this.dateConnect.getDate().toString() +
        this.dateConnect.getMonth().toString() +
        this.dateConnect.getFullYear().toString()
    ) {
      this.setState({
        user: this.validateStorage.user,
        email: this.validateStorage.email,
        level: 0,
        auth: 1,
        origine: '',
      });
    } else {
      this.setState({ auth: 2 }, () => {
        console.log('sort de verif', this.state);
      });
    }
  };

  recieveLogin=(auth)=>{
auth && this.setState({auth: 1})

  }

  componentDidMount() {
    console.log('render didmount');
    // this.verifRedirect()
  }
  

  dateConnect = new Date();

  render() {
    // origine === '/' lancement de l'appli
    
    // if (this.state.origine === '/' && this.state.auth === 0){
    //   console.log('render APP',this.state.origine, "state APP:", this.state);
    //   this.verifRedirect()
    // }
    
    
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} callBackLogin={this.recieveLogin}/>
              )}
            />
            <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_SIGNUP} />
              )}
            />

            {console.log("valeur auth",this.state.auth, this.state.origine )}
            {/* {(this.state.auth === 2 ) &&  <Redirect to='/login'/>} 
            {(this.state.auth === 1 ) && <Redirect to='/'/>} */}
            {/*  */}

            <MainLayout
              breakpoint={this.props.breakpoint}
              recieveMainHeader={this.callHeader}
              returnStorage={this.state}
            >
              <React.Suspense fallback={<PageSpinner />}>
              {console.log("valeur route",)}

                <Route exact path="/" component={DashboardPage} />
                <Route
                  path="/profile"
                  component={() => <Profile userOpen={this.state} />}
                ></Route>
                {/* <Route path="/agents" component={()=>(<Agents userOpen={this.state}/>)}></Route> */}
                <Route
                  path="/agents"
                  component={() => <ListeAgents userOpen={this.state} />}
                ></Route>
                <Route
                  path="/commerciaux"
                  component={() => <ListeCommerciaux userOpen={this.state} />}
                ></Route>
                <Route
                  path="/clients"
                  component={() => <Clients userOpen={this.state} />}
                ></Route>
                <Route
                  path="/planning"
                  component={() => <Planning userOpen={this.state} />}
                ></Route>
              </React.Suspense>
            </MainLayout>
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
