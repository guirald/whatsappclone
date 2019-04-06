import React, { Component } from 'react'
import { View, TextInput, Button, ImageBackground, Text, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { modificaEmail, modificaSenha, modificaNome, cadastraUsuario } from '../actions/AutenticacaoActions'

class FormCadastro extends Component {

    static navigationOptions = {
        title: 'Cadastro'
    }

    // função interna do objeto
    _cadastraUsuario() {
        /*const nome = this.props.nome
        const email = this.props.email
        const senha = this.props.senha*/

        const { nome, email, senha } = this.props;

        // disparando a action creator
        this.props.cadastraUsuario({ nome, email, senha })
    }

    renderBtnCadastro() {
        if (this.props.loadingCadastro) {
            return (
                <ActivityIndicator size="large" />
            )
        }
        return (
            <Button title="Cadastrar" color='#115E54' onPress={() => this._cadastraUsuario()} />
        )
    }

    render() {
        return (
            <ImageBackground style={{ flex: 1 }} source={require('../imgs/bg.png')}>
                <View style={{ flex: 1, padding: 10 }}>
                    <View style={{ flex: 4, justifyContent: 'center' }}>
                        <TextInput value={this.props.nome} placeholder="Nome" style={{ fontSize: 20, height: 45 }} placeholderTextColor="#fff" onChangeText={texto => this.props.modificaNome(texto)} />
                        <TextInput value={this.props.email} placeholder="E-mail" style={{ fontSize: 20, height: 45 }} placeholderTextColor="#fff" onChangeText={texto => this.props.modificaEmail(texto)} />
                        <TextInput secureTextEntry value={this.props.senha} placeholder="Senha" style={{ fontSize: 20, height: 45 }} placeholderTextColor="#fff" onChangeText={texto => this.props.modificaSenha(texto)} />
                        <Text style={{ color: '#ff0000', fontSize: 18 }}>{ this.props.erroCadastro }</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        { this.renderBtnCadastro() }
                    </View>
                </View>
            </ImageBackground>
        )
    }
}

const mapStateToProps = state => (
    {
        nome: state.AutenticacaoReducer.nome,
        email: state.AutenticacaoReducer.email,
        senha: state.AutenticacaoReducer.senha,
        erroCadastro: state.AutenticacaoReducer.erroCadastro,
        loadingCadastro: state.AutenticacaoReducer.loadingCadastro
    }
)

export default connect(mapStateToProps, { modificaEmail, modificaSenha, modificaNome, cadastraUsuario })(FormCadastro)