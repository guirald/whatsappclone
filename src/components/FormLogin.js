import React, { Component } from 'react'
import { View, Text, TextInput, Button, TouchableHighlight, ImageBackground, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

import { modificaEmail, modificaSenha, autenticarUsuario } from '../actions/AutenticacaoActions'

class formLogin extends Component {

    static navigationOptions = {
        title: 'Login',
        header: null        
    }

    // função interna
    _autenticarUsuario() {
        // recupera valores de email e senha gerenciados pelo Redux
        const { email, senha } = this.props

        // podemos usar através do this porque nosso componente já foi decorado com esse action creator
        this.props.autenticarUsuario({ email, senha })
    }

    renderBtnAcessar() {
        if (this.props.loadingLogin) {
            return (
                <ActivityIndicator size="large"/>
            )
        }
        
        return (
            <Button title="Acessar" color='#115E54' onPress={() => this._autenticarUsuario()} />
        )
    }

    render() {

        return (
            <ImageBackground style={{ flex: 1 }} source={require('../imgs/bg.png')}>
                <View style={{ flex: 1, padding: 10 }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text style={{ fontSize: 25, color: "#fff" }}>WhatsApp Clone</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                        <TextInput value={this.props.email} style={{ fontSize: 20, height: 45 }} placeholder="E-mail" placeholderTextColor="#fff" onChangeText={texto => this.props.modificaEmail(texto)} />
                        <TextInput secureTextEntry value={this.props.senha} style={{ fontSize: 20, height: 45 }} placeholder="Senha" placeholderTextColor="#fff" onChangeText={texto => this.props.modificaSenha(texto)} />
                        <Text style={{ color: '#ff0000', fontSize: 18 }}>
                            { this.props.erroLogin }
                        </Text>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('cadastro')}>
                            <Text style={{ fontSize: 20, color: "#fff" }}>Ainda não tem cadastro? Cadastre-se</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flex: 2 }}>
                        { this.renderBtnAcessar() }
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => (
    {
        email: state.AutenticacaoReducer.email,
        senha: state.AutenticacaoReducer.senha,
        erroLogin: state.AutenticacaoReducer.erroLogin,
        loadingLogin: state.AutenticacaoReducer.loadingLogin
    }
)

// redux, decora com esse reducer (com o mapa de estados do redux) o componente formLogin
export default connect(mapStateToProps, { modificaEmail, modificaSenha, autenticarUsuario })(formLogin)