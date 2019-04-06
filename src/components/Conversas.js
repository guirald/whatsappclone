import React, { Component } from 'react'
import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import _ from 'lodash'
import { withNavigation } from 'react-navigation'

import { conversasUsuarioFetch } from '../actions/AppActions'

class Conversas extends Component {

    componentWillMount() {

        this.props.conversasUsuarioFetch()
        this.criaFonteDeDados(this.props.conversas)
    }

    componentWillReceiveProps(nextProps) {
        this.criaFonteDeDados(nextProps.conversas)
    }

    criaFonteDeDados(conversas) {
        this.fonteDeDados = conversas
    }

    _renderRow = (conversa) => {
        return (
            <TouchableHighlight
                onPress={() => this.props.navigation.navigate('conversa', { contatoNome: conversa.item.nome, contatoEmail: conversa.item.email })} underlayColor="#fff">
                <View style={{ flex: 1, padding: 20, borderBottomWidth: 1, borderColor: "#CCC" }}>
                    <Text style={{ fontSize: 25 }}>{conversa.item.nome}</Text>                    
                </View>
            </TouchableHighlight>
        )
    }

    _keyExtractor = (item, index) => item.uid

    render() {
        return (
            <FlatList
                data={this.fonteDeDados}
                renderItem={this._renderRow}
                extraData={this.fonteDeDados}
                keyExtractor={this._keyExtractor}                
            />
        )
    }
}

mapStateToProps = state => {

    // convertendo para um array
    const conversas = _.map(state.ListaConversasReducer, (val, uid) => {
        return { ...val, uid }
    })

    return ({
        conversas
    })
}

export default withNavigation(connect(mapStateToProps, { conversasUsuarioFetch })(Conversas))