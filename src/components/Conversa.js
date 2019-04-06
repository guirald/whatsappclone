import React, { Component } from 'react'
import { View, Text, TextInput, Image, TouchableHighlight, FlatList, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'

import { modificaMensagem, enviaMensagem, conversaUsuarioFetch, iniciaEnvioMensagem } from '../actions/AppActions'

class Conversa extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('contatoNome', 'Conversa')
        }
    }

    componentWillMount() {
        this.props.conversaUsuarioFetch(this.props.navigation.getParam('contatoEmail'))
        this.criaFonteDeDados(this.props.conversa)
    }

    componentDidMount() {
        setTimeout(() => {
            this.flatList1.scrollToEnd();
        }, 2000);
    }

    componentWillReceiveProps(nextProps) {
        // testa a necessidade de chamada da action creator tb aqui
        // caso na abertura da tela Conversa ainda não tenha dado tempo de 
        // destruir a conversa anterior na mudança de página para Contatos
        // acesso a componente antes de ele ser destruído        
        if (this.props.navigation.getParam('contatoEmail') != nextProps.navigation.getParam('contatoEmail')) {
            this.props.conversaUsuarioFetch(nextProps.navigation.getParam('contatoEmail'))
        }
        this.criaFonteDeDados(nextProps.conversa)
    }

    criaFonteDeDados(conversa) {
        this.fonteDeDados = conversa
    }

    // faz o bind na chamada do TouchebleHighlight pra acertar o contexto
    // e aqui dentro chamar a action creator
    _enviaMensagem() {

        this.props.iniciaEnvioMensagem()

        const { mensagem, navigation } = this.props
        const contatoNome = navigation.getParam('contatoNome')
        const contatoEmail = navigation.getParam('contatoEmail')

        this.props.enviaMensagem(mensagem, contatoNome, contatoEmail)

        setTimeout(() => {
            this.flatList1.scrollToEnd();
        }, 2000);

    }

    _renderRow = (texto) => {

        if (texto.item.tipo === 'e') {
            return (
                <View style={{ alignItems: 'flex-end', marginTop: 5, marginBottom: 5, marginLeft: 40 }}>
                    <Text style={{ fontSize: 18, color: '#000', padding: 10, backgroundColor: "#dbf5b4", elevation: 1 }}>{texto.item.mensagem}</Text>
                </View>
            )
        }

        return (
            <View style={{ alignItems: 'flex-start', marginTop: 5, marginBottom: 5, marginRight: 40 }}>
                <Text style={{ fontSize: 18, color: '#000', padding: 10, backgroundColor: "#f7f7f7", elevation: 1 }}>{texto.item.mensagem}</Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => item.uid


    renderBtnEnviar() {
        if (this.props.envio) {
            return (
                <ActivityIndicator size="large" />
            )
        }

        return (
            <TouchableHighlight onPress={() => this._enviaMensagem()} underlayColor="#fff">
                <Image source={require('../imgs/enviar_mensagem.png')} />
            </TouchableHighlight>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, marginTop: 50, backgroundColor: "#eee4dc", padding: 10 }}>
                <View style={{ flex: 1, paddingBottom: 20 }}>
                    <FlatList
                        ref={(ref) => { this.flatList1 = ref }}
                        data={this.fonteDeDados}
                        renderItem={this._renderRow}
                        extraData={this.fonteDeDados}
                        keyExtractor={this._keyExtractor}
                    />
                </View>
                <View style={{ flexDirection: 'row', height: 60 }}>
                    <TextInput
                        value={this.props.mensagem}
                        onChangeText={texto => this.props.modificaMensagem(texto)}
                        style={{ flex: 4, backgroundColor: "#fff", fontSize: 18 }} />
                    { this.renderBtnEnviar() }
                </View>
            </View>
        )
    }
}

mapStateToProps = state => {

    const conversa = _.map(state.ListaConversaReducer, (val, uid) => {
        return { ...val, uid }
    })

    return ({
        mensagem: state.AppReducer.mensagem,
        conversa,
        envio: state.AppReducer.enviandoMensagem
    })
}

export default connect(mapStateToProps, { modificaMensagem, enviaMensagem, conversaUsuarioFetch, iniciaEnvioMensagem })(Conversa)