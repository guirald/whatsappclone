import { combineReducers } from 'redux'
import AutenticacaoReducer from './AutenticacaoReducer'
import AppReducer from './AppReducer'
import ListaContatosReducer from './ListaContatosReducer'
import ListaConversaReducer from './ListaConversaReducer'
import ListaConversasReducer from './ListaConversasReducer'

// implementação do combineReducers que vem do Redux
// informação capturada no App.js
// e envia esses reducers combinados para o store do React-Redux
export default combineReducers({
    // chave : valor
    AutenticacaoReducer,
    AppReducer,
    ListaContatosReducer,
    ListaConversaReducer,
    ListaConversasReducer
})