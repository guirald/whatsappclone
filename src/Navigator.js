import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createStackNavigator, addNavigationHelpers } from 'react-navigation'
import { reduxifyNavigator, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'

import FormLogin from './components/FormLogin'
import FormCadastro from './components/FormCadastro'
import BoasVindas from './components/BoasVindas';

// Configure listener
// Note: createReactNavigationReduxMiddleware must be run before reduxifyNavigator
export const middleware = createReactNavigationReduxMiddleware(
    "root",
    state => state.navigation
)

export const Navigator = createStackNavigator({
    login: FormLogin,
    cadastro: FormCadastro,
    boasVindas: BoasVindas
}, {
    initialRouteName: 'login'
})

const addListener = reduxifyNavigator("root");

class Nav extends Component {
    render() {
        return (
            <Navigator navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.navigation,
                addListener
            })} />
        )
    }
}

const mapStateToProps = state => ({
    navigation: state.navigation
})

export default connect(mapStateToProps)(Nav)