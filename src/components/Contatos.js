import React, { Component } from 'react'
import { View, Text, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withNavigation } from 'react-navigation'
import { contatosUsuarioFetch } from '../actions/AppActions'

class Contatos extends Component {

    static navigationOptions = {
        title: 'Contatos',
        header: null
    }

    

        //this.criaFonteDeDados = this.criaFonteDeDados.bind(this)
        //this.renderRow = this.renderRow.bind(this)

    

    // antes do componente ser renderizado
    componentWillMount() {
        this.props.contatosUsuarioFetch()
        // nesse primeiro momento ele passa como um array vazio
        // mas que será atribuído como dado inicial para nosso data source
        this.criaFonteDeDados(this.props.contatos)
    }

    // sempre que houver alteração das propriedades (props)
    // não executa durante a primeira renderização do componente
    // somente após a primeira, nunca antes
    // a partir da mudança enviado às propriedades do componente
    componentWillReceiveProps(nextProps) {

        this.criaFonteDeDados(nextProps.contatos)
    }

    criaFonteDeDados(contatos) {
        // criando fonte de dados para o ListView
        // indicando como ele deve tratar a diferença dos registros - convenção passar isso no construtor
        // geralmente é esse critério
        //const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        // FUNÇÃO INICIAL PARA INSERIR DADOS NO DATASOURCE
        // dados são imutáveis, para isso usa essa função cloneWithRows
        // o ds faz a análise dessa diferença pra renderizar ou não os itens do array que é enviado para o ds
        //this.fonteDeDados = ds.cloneWithRows(contatos)
        this.fonteDeDados = contatos
    }

    _onPress = () => {
        const { navigate } = this.props.navigation;
        return navigate('conversa')
    }

    _renderRow = (contato) => {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('conversa', { contatoNome: contato.item.nome, contatoEmail: contato.item.email })} underlayColor="#fff">
                <View style={{ flex: 1, padding: 20, borderBottomWidth: 1, borderColor: "#CCC" }}>
                    <Text style={{ fontSize: 25 }}>{contato.item.nome}</Text>
                    <Text style={{ fontSize: 18 }}>{contato.item.email}</Text>
                </View>
            </TouchableHighlight>
        )
    }

    _renderFooter = () => {
        if (this.fonteDeDados.length != 0) return null

        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        )
    }

    _keyExtractor = (item, index) => item.email


    render() {
        return (
            <FlatList
                data={this.fonteDeDados}
                renderItem={this._renderRow}
                extraData={this.fonteDeDados}
                keyExtractor={this._keyExtractor}
                ListFooterComponent={this._renderFooter}
            />
        )
    }
}

mapStateToProps = state => {
    // primeiro parâmetro -> objeto
    // segundo parâmetro -> função de callback que vai organizar o array de retorno
    // para cada obj retornado, recuperar o valor e a chave de retorno
    // e na sequencia seja retornado o spread dos valores e o id dos objetos
    const contatos = _.map(state.ListaContatosReducer, (val, uid) => {
        return { ...val, uid }
    })
    return { contatos }
}

export default withNavigation(connect(mapStateToProps, { contatosUsuarioFetch })(Contatos))