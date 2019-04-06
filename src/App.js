import React, { Component } from 'react'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

import firebase from 'react-native-firebase';

import FormLogin from './components/FormLogin'
import FormCadastro from './components/FormCadastro'
import BoasVindas from './components/BoasVindas'
import Principal from './components/Principal'
import AdicionarContato from './components/AdicionarContato'
import Conversa from './components/Conversa'
import Conversas from './components/Conversas'
import Loading from './components/Loading';

import reducers from './reducers'
import NavigationService from './NavigationService'

const Router = createStackNavigator({
    login: FormLogin,
    cadastro: FormCadastro,
    boasVindas: BoasVindas,
    principal: Principal,
    adicionarContato: AdicionarContato,
    conversa: Conversa,
    conversas: Conversas,
    loading: Loading
}, {
        initialRouteName: 'loading',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#115E54'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        },
        headerMode: 'screen'
    }
)

const AppContainer = createAppContainer(Router)

export default class App extends Component {

    componentDidMount() {
        // Set the current token if it exists
        /*firebase.messaging().getToken().then((fcmToken) => {
            if (fcmToken) {
                console.log('fcmToken', fcmToken)
            }
        }).catch((err) => console.log('err', err + ' ops'))*/
    }

    onReceived(notification) {
        console.log("Notification received: ", notification);
    }

    onOpened(openResult) {
        console.log('Message: ', openResult.notification.payload.body);
        console.log('Data: ', openResult.notification.payload.additionalData);
        console.log('isActive: ', openResult.notification.isAppInFocus);
        console.log('openResult: ', openResult);
    }

    onIds(device) {
        console.log('Device info: ', device);
    }

    render() {
        return (
            <Provider store={createStore(reducers, {}, applyMiddleware(ReduxThunk))}>
                <AppContainer ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef)
                }} />
            </Provider>
        )
    }
}