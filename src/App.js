import { STATE_LOGIN, STATE_SIGNUP } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/AuthPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';

import aes256 from 'aes256'



import Profile from './components/Profile';
import TestCp from './components/TestCp';
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
  super(props)

  this.state = {
  user:'',
      email: '',
      pwd:'',
      rememberMe: '',
      validate: aes256.encrypt(this.keyAes,'date of day'),
      auth: 0, //0=a refaire, 1=true, 2=false
      origine: '/',
      level:0,
      actif:true
  }
 
}



callHeader = (logOut)=>{
  
  if(logOut){
    // si demande logout force render avec appel de la fonction verifredirect pour revenir sur login et interdir nav vers dashboard
    // puisque value validate du localstorage est supprimee depuis header.js
    this.setState({auth: 0, origine:'/'})
  }
}

keyAes = 'key of secure aes256'


componentDidMount() {
  console.log(' monte');
  
}




verifRedirect = ()=>{
  

  this.auth = false //ouverture de l 'appli doit etre proteger pour eviter navigation depuis url sans etre authentifie

  this.getStorage = localStorage.getItem('userActif')
  this.validateStorage = ''
 
 
   if (this.getStorage === null){
    const storage = {
      user: this.state.user,
      email: this.state.email,
      pwd:this.state.pwd,
      rememberMe: this.state.rememberMe,
      validate: aes256.encrypt(this.keyAes, this.state.validate)
    }
     this.getStorage = localStorage.setItem('userActif', JSON.stringify(storage))
     this.validateStorage = JSON.parse(this.getStorage)
     
   }else{
     this.validateStorage = JSON.parse(this.getStorage)
   }

   console.log('sub',aes256.decrypt(this.keyAes, this.validateStorage.validate) === this.dateConnect.getDate().toString()+this.dateConnect.getMonth().toString()+this.dateConnect.getFullYear().toString())
   if( aes256.decrypt(this.keyAes, this.validateStorage.validate) === this.dateConnect.getDate().toString()+this.dateConnect.getMonth().toString()+this.dateConnect.getFullYear().toString()){
     this.setState({user:this.validateStorage.user, email:this.validateStorage.email, level:0 , auth: 1, origine:''})

     
   }else{
    this.setState({auth: 2})
    
   }

}



dateConnect = new Date()


  render() {
    
    // origine === '/' lancement de l'appli
    console.log('app 0', this.state)

if (this.state.origine === '/' && this.state.auth === 0){
  this.verifRedirect()
}

    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
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

{console.log('app 1', this.state.auth)}
{(this.state.auth !== 1 ) && <Redirect to='/login'/>}



            <MainLayout breakpoint={this.props.breakpoint} recieveMainHeader={this.callHeader} returnStorage={this.state} >
              <React.Suspense fallback={<PageSpinner />}>

                <Route exact path="/" component={DashboardPage} />
                <Route path="/profile" component={()=>(<Profile userOpen={this.state}/>)}></Route>
                
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
