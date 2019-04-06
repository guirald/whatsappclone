import { MODIFICA_EMAIL, MODIFICA_SENHA, MODIFICA_NOME, CADASTRO_USUARIO_SUCESSO, CADASTRO_USUARIO_ERRO, LOGIN_USUARIO_ERRO, LOGIN_EM_ANDAMENTO, CADASTRO_EM_ANDAMENTO, LOGIN_USUARIO_SUCESSO } from '../actions/types'

const INITIAL_STATE = {
    nome: '',
    email: '',
    senha: '',
    erroCadastro: '',
    erroLogin: '',
    loadingLogin: false,
    loadingCadastro: false
}

export default (state = INITIAL_STATE, action) => {
    //console.log(action.type)
    // para evoluir o estado da aplicação
    switch(action.type) {
        case MODIFICA_EMAIL:
            // usando spread no state para não perder o estado anterior
            return { ...state,  email: action.payload }    
        case MODIFICA_SENHA:
            return { ...state,  senha: action.payload }
        case MODIFICA_NOME:
            return { ...state, nome: action.payload }
        case CADASTRO_USUARIO_ERRO:
            return { ...state, erroCadastro: action.payload, loadingCadastro: false }
        case CADASTRO_USUARIO_SUCESSO:
            // liberar dois valores de estado
            return { ...state, nome: '', senha: '' }
        case LOGIN_USUARIO_ERRO: 
            return { ...state, erroLogin: action.payload, loadingLogin: false }
        case LOGIN_EM_ANDAMENTO:
            return { ...state, loadingLogin: true }
        case CADASTRO_EM_ANDAMENTO:
            return { ...state, loadingCadastro: true }
        case LOGIN_USUARIO_SUCESSO: 
            // todos os dados relacionados à autenticação, em caso de sucesso,
            // voltam a seu estado inicial
            return { ...state, ...INITIAL_STATE}
        default: 
            return state
    }
}