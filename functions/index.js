// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const _ = require('lodash');

admin.initializeApp(functions.config().firebase);

exports.touch = functions.database.ref('/mensagens/{contatoEmailB64}/{usuarioEmailB64}/{uid}').onCreate(
    (event, context) => {

        const { usuarioEmailB64, contatoEmailB64, uid } = context.params

        console.log('usuarioEmailB64', usuarioEmailB64)
        console.log('contatoEmailB64', contatoEmailB64)

        const getValuePromise = admin.database()
            .ref(`mensagens/${contatoEmailB64}/${usuarioEmailB64}/${uid}`)
            .once('value');

        return getValuePromise.then(snapshot => {
            console.log('snapshot', snapshot.val())
            console.log('lodash 1', _.values(snapshot.val()))
            console.log('lodash 2', _.first(_.values(snapshot.val())))

            const text = _.first(_.values(snapshot.val()))

            console.log('text', text)

            const payload = {
                data: { uid },
                notification: {
                    title: 'Nova mensagem',
                    body: text
                }
            };
            
            console.log(JSON.stringify(payload))

            let pushToken = ''

            admin.database().ref(`/contatos/${contatoEmailB64}`)
            .once('value')
            .then(snapshot => {
                if (snapshot.val()) {
                    console.log('values funcao', _.values(snapshot.val()))
                    _.values(snapshot.val()).map(item => pushToken = item.token)

                    console.log('pushToken', pushToken)
                    
                    // sendToDevice can also accept an array of push tokens
                    return admin.messaging().sendToDevice(pushToken, payload);
                }

            })


            //return admin.messaging().sendToTopic(`topics/${contatoEmailB64}`, payload)
        });

    });