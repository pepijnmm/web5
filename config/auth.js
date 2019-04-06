module.exports = {

    'facebookAuth' : {
        'clientID'        : '371249490399620', // your App ID
        'clientSecret'    : 'eb05ce515764f3764e3aeb8b2a004f45', // your App Secret
        'callbackURL'     : 'http://localhost:3000/auth/facebook/callback',
        'profileURL': 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields'   : ['id', 'email', 'name'] // For requesting permissions from Facebook API

    },
    
    'googleAuth' : {
        'clientID'      : '856733135469-khnkpk9jmdubgtbonogcaqfum7sjvmfj.apps.googleusercontent.com',
        'clientSecret'  : 'X-HL8WM52VobHWGvld10N7lX',
        'callbackURL'   : 'http://localhost:3000/auth/google/callback'
    }

};
