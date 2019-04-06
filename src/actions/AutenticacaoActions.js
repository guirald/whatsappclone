import b64 from 'base-64'
import firebase from 'react-native-firebase'

import { auth, database } from '../firebase'
import NavigationService from '../NavigationService'

import { MODIFICA_EMAIL, MODIFICA_SENHA, MODIFICA_NOME, CADASTRO_USUARIO_SUCESSO, CADASTRO_USUARIO_ERRO, LOGIN_USUARIO_SUCESSO, LOGIN_USUARIO_ERRO, LOGIN_EM_ANDAMENTO, CADASTRO_EM_ANDAMENTO } from './types'

// uma action creator que retorna uma action (objeto literal)
export const modificaEmail = (texto) => {
    console.log(texto)
    return {
        type: MODIFICA_EMAIL,
        // dados interceptados pelo reducer
        // para evoluir o estado da aplicação
        payload: texto
    }
}

export const modificaSenha = (texto) => {
    return {
        type: MODIFICA_SENHA,
        payload: texto
    }
}

export const modificaNome = (texto) => {
    return {
        type: MODIFICA_NOME,
        payload: texto
    }
}

export const cadastraUsuario = ({ nome, email, senha }) => {
    // action de callback
    // gerenciado pelo dispatch do Redux-Thunk
    // fica intermediando nossa aplicação com o Redux
    return dispatch => {

        // ACTION PARA EVOLUIR ESTADO DA ACTION CADASTRO EM ANDAMENTO
        dispatch( { type: CADASTRO_EM_ANDAMENTO } )

        auth.createUserWithEmailAndPassword(email, senha)
            .then(async user => {
                // converte o e-mail para base 64
                let emailB64 = b64.encode(email)
                let token = ''

                // Set the current token if it exists
                await firebase.messaging().getToken()
                .then((fcmToken) => {
                    if (fcmToken) {
                        token = fcmToken
                        console.log('token', token)

                        //firebase.messaging().subscribeToTopic(`topics/${emailB64}`)

                    }
                }).catch((err) => console.log('err', err + ' ops'))


                // qual o nó inserir a informação, no caso, contatos
                await database.ref(`/contatos/${emailB64}`)
                    .push({ nome: nome, token: token })
                    // elemento que inserimos no DB através do push
                    // se o push deu certo, chama o cadastroUsuarioSucesso que vai dar o dispatch
                    .then(value => cadastroUsuarioSucesso(dispatch))
            })
            .catch(erro => cadastroUsuarioErro(erro, dispatch))
    }
}

const cadastroUsuarioSucesso = (dispatch) => {
    dispatch({ type: CADASTRO_USUARIO_SUCESSO })
    NavigationService.navigate('boasVindas')
}

const cadastroUsuarioErro = (erro, dispatch) => {
    dispatch({ type: CADASTRO_USUARIO_ERRO, payload: erro.message })
}

export const autenticarUsuario = ({ email, senha }) => {
    // retorno de função de callback
    // e dentro, implementar a lógica de modo assíncrono
    return dispatch => {

        dispatch( { type: LOGIN_EM_ANDAMENTO } )

        auth.signInWithEmailAndPassword(email, senha)
            .then(value => loginUsuarioSucesso(dispatch))
            .catch(erro => loginUsuarioErro(erro, dispatch))
    }

}

const loginUsuarioSucesso = (dispatch) => {
    dispatch({ type: LOGIN_USUARIO_SUCESSO })
    NavigationService.navigate('principal')
}

const loginUsuarioErro = (erro, dispatch) => {
    // dispatch recebe a action que deverá ser retornado pro Redux
    dispatch({ type: LOGIN_USUARIO_ERRO, payload: erro.message })
}

