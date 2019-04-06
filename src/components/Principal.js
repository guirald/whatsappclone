import React, { Component } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';

import TabBarMenu from './TabBarMenu'
import Conversas from './Conversas'
import Contatos from './Contatos'

export default class Principal extends Component {
    state = {
        index: 0,
        routes: [
            { key: 'first', title: 'Conversas' },
            { key: 'second', title: 'Contatos' },
        ],
    };

    static navigationOptions = {
        title: 'Login',
        header: null
    }

    _renderHeader = props => <TabBarMenu {...props} navigation={this.props.navigation} />

    render() {
        return (
            <TabView
                navigationState={this.state}
                renderScene={SceneMap({
                    first: Conversas,
                    second: Contatos,
                })}
                renderTabBar={this._renderHeader}
                onIndexChange={index => this.setState({ index })}
                initialLayout={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
            />
        );
    }
}

const styles = StyleSheet.create({
    scene: {
        flex: 1,
    },
});