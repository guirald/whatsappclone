import b64 from 'base-64'
import _ from 'lodash'

import { database, auth } from '../firebase'
import { MODIFICA_ADICIONA_CONTATO_EMAIL, ADICIONA_CONTATO_ERRO, ADICIONA_CONTATO_SUCESSO, LISTA_CONTATO_USUARIO, MODIFICA_MENSAGEM, LISTA_CONVERSA_USUARIO, ENVIA_MENSAGEM_SUCESSO, LISTA_CONVERSAS_USUARIO, INICIA_ENVIO_MENSAGEM } from './types'

export const modificaAdicionaContatoEmail = texto => {
    return {
        type: MODIFICA_ADICIONA_CONTATO_EMAIL,
        payload: texto
    }
}

export const adicionaContato = email => {
    return dispatch => {

        //email na base 64 para comparar com o path contatos que tem o e-mail em base 64 (firebase)
        let emailB64 = b64.encode(email)

        // agora é preciso que o Redux Thunk faça nossa aplicação aguardar pelo dispatch da action

        database.ref(`/contatos/${emailB64}`)
            // on fica escutando as alterações no firebase em tempo real
            // sendo automaticamente repassado pra aplicação
            // once faz a requisição apenas uma vez, sem preocupar com alterações futuras (única checagem quando é executado)
            // evento value recupera um snapshot (cópia do que tem naquele path naquele momento em que foi consultado)
            .once('value')
            // promessa da função once, recupera o snapshot
            .then(snapshot => {
                // val retorna o documento que tem dentro do path
                // se não tiver, retorna null
                if (snapshot.val()) {
                    //email do contato que queremos adicionar
                    // usando o lodash pra transformar um objeto em array
                    // e assim recuperar a propriedade nome dentro do primeiro objeto do array
                    const dadosUsuario = _.first(_.values(snapshot.val()))
                    console.log(dadosUsuario)
                    //email

                    //email do usuário autenticado no firebase
                    let emailUsuarioB64 = b64.encode(auth.currentUser.email)

                    database.ref(`/usuario_contato/${emailUsuarioB64}`)
                        .push({ email, nome: dadosUsuario.nome })
                        .then(() => adicionaContatoSucesso(dispatch))
                        .catch(erro => adicionaContatoErro(erro.message, dispatch))


                } else {
                    dispatch(
                        {
                            type: ADICIONA_CONTATO_ERRO,
                            payload: 'E-mail informado não corresponde a um usuário válido'
                        }
                    )
                }
            })

    }
}

const adicionaContatoErro = (erro, dispatch) => (
    dispatch(
        {
            type: ADICIONA_CONTATO_ERRO,
            payload: erro
        }
    )
)

const adicionaContatoSucesso = (dispatch) => (
    dispatch(
        {
            type: ADICIONA_CONTATO_SUCESSO,
            payload: true
        }
    )
)

export const habilitaInclusaoContato = () => (
    {
        type: ADICIONA_CONTATO_SUCESSO,
        payload: false
    }
)

export const contatosUsuarioFetch = () => {
    const { currentUser } = auth

    return dispatch => {
        let emailUsuarioB64 = b64.encode(currentUser.email)

        database.ref(`/usuario_contato/${emailUsuarioB64}`)
            .on("value", snapshot => {
                //console.log(snapshot.val())
                const dadosUsuario = _.values(snapshot.val())
                dispatch({ type: LISTA_CONTATO_USUARIO, payload: dadosUsuario })
            })
    }
}

export const modificaMensagem = texto => {
    return ({
        type: MODIFICA_MENSAGEM,
        payload: texto
    })
}

export const enviaMensagem = (mensagem, contatoNome, contatoEmail) => {
    // dados do usuario (email)
    const { currentUser } = auth
    const usuarioEmail = currentUser.email

    return dispatch => {
        // dados do contato (contatoNome e contatoEmail)

        // conversão para base 64
        const usuarioEmailB64 = b64.encode(usuarioEmail)
        const contatoEmailB64 = b64.encode(contatoEmail)

        database.ref(`/mensagens/${usuarioEmailB64}/${contatoEmailB64}`)
            // tipo indica que é mensagem de envio
            .push({ mensagem, tipo: 'e' })
            .then(() => {
                // primeiro registro mensagem pro usuário autenticado
                // depois pro meu contato
                database.ref(`/mensagens/${contatoEmailB64}/${usuarioEmailB64}`)
                    // indica mensagem de recebimento
                    .push({ mensagem, tipo: 'r' })
                    .then(() => dispatch({ type: ENVIA_MENSAGEM_SUCESSO }))
            })
            .then(() => { // armazenar os cabeçalhos das conversas do usuário autenticado para dar andamento às conversas
                database.ref(`/usuario_conversas/${usuarioEmailB64}/${contatoEmailB64}`)
                    // verifica se existe, sim, ele sobrescreve, não, ele cria
                    // update ele só atualizaria    
                    .set({ nome: contatoNome, email: contatoEmail })
            })
            .then(() => { // armazenar o cabeçalho de conversa do contato

                // para o usuário autenticado, primeiro precisamos recuperar seu nome no path contatos
                // a partir do seu e-mail
                database.ref(`/contatos/${usuarioEmailB64}`)
                    .once("value")
                    .then(snapshot => {

                        // recupera o primeiro índice do objeto e converte para um array
                        const dadosUsuario = _.first(_.values(snapshot.val()))

                        database.ref(`/usuario_conversas/${contatoEmailB64}/${usuarioEmailB64}`)
                            .set({ nome: dadosUsuario.nome, email: usuarioEmail })
                    })


            })


    }

}

export const conversaUsuarioFetch = contatoEmail => {

    // compor os e-mails na base 
    const { currentUser } = auth
    let usuarioEmailB64 = b64.encode(currentUser.email)
    let contatoEmailB64 = b64.encode(contatoEmail)

    return dispatch => {
        database.ref(`/mensagens/${usuarioEmailB64}/${contatoEmailB64}`)
            .on("value", snapshot => {
                dispatch( { type: LISTA_CONVERSA_USUARIO, payload: snapshot.val() })
            })
            
    }
}

export const conversasUsuarioFetch = () => {

    // compor os e-mails na base 
    const { currentUser } = auth
    let usuarioEmailB64 = b64.encode(currentUser.email)
    
    return dispatch => {
        database.ref(`/usuario_conversas/${usuarioEmailB64}`)
            .on("value", snapshot => {
                dispatch( { type: LISTA_CONVERSAS_USUARIO, payload: snapshot.val() })
            })
            
    }

}


export const iniciaEnvioMensagem = () => (
    {
        type: INICIA_ENVIO_MENSAGEM,
        payload: true
    }
)