import React, { Component } from 'react'
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native'
import firebase from 'react-native-firebase'
import { AsyncStorage } from 'react-native';

import { auth } from '../firebase'

export default class Loading extends Component {

    async componentDidMount() {

       auth.onAuthStateChanged(user => {

            this.checkPermission()

            this.props.navigation.navigate(user ? 'principal' : 'login')
        })
    }

    //1
    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken', value);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }

    render() {
        return (
            <ImageBackground style={{ flex: 1 }} source={require('../imgs/bg.png')}>
                <View style={styles.container}>
                    <Text style={{ fontSize: 20, color: '#ffffff' }}>Carregando</Text>
                    <ActivityIndicator size="large" />
                </View>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})