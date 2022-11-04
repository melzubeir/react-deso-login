import React from 'react';
import { StyleSheet } from 'react-native';
import Button from './ui/Button';
import PropTypes from "prop-types";

function initLogin(accessLevel, JWT) {
  console.log('func initLogin()', JWT)

  return new Promise(function (resolve, reject) {
    console.log('--Promise--');

    function login() {
      console.log('func initLogin().login()')
      identityWindow = window.open('https://identity.deso.org/log-in');
      console.log('identityWindow', identityWindow)
    }

    function handleInit(e) {
      console.log('func initLogin().handleInit()')
      if (!init) {
        init = true;

        for (const e of pendingRequests) {
          e.source.postMessage(e, "*");
        }

        pendingRequests = []
        pm_id = e.data.id
        source = e.source
      }
      respond(e.source, e.data.id, {})
    }

    function handleLogin(payload) {
      console.log('func initLogin().handleLogin()', payload)
      user = payload['users'][payload.publicKeyAdded]
      user['publicKey'] = payload.publicKeyAdded;
      if (identityWindow) {
        if (JWT === false) {
          identityWindow.close();
          identityWindow = null;
          resolve(user)
        } else {
          var payload = {
            accessLevel: user.accessLevel,
            accessLevelHmac: user.accessLevelHmac,
            encryptedSeedHex: user.encryptedSeedHex
          };
          source.postMessage({
            id: pm_id,
            service: 'identity',
            method: 'initialize',
            payload: payload
          }, "*");
        }
      }
    }

    function handleJWT(payload) {
      console.log('func initLogin().handleJWT()', payload)
      user['jwt'] = payload['jwt'];
      if (identityWindow) {
        identityWindow.close();
        identityWindow = null;
      }
      resolve(user);
    }

    function respond(e, t, n) {
      console.log('func initLogin().respond()', e, t, n)

      e.postMessage({
        id: t,
        service: "identity"
      }, "*")
    }
    console.log('anyone home?')

    window.addEventListener('message', message => {
      console.log('window.addEVentListener');
      const { data: { id: id, method: method, service: service, payload: payload } } = message;
      if (service !== "identity"){ console.log('service not identity'); return };

      if (method == 'initialize') {
        console.log('method == initialize')
        handleInit(message);
      } else if (method == 'login') {
        console.log('method == login')
        handleLogin(payload);
      } else if ('jwt' in payload) {
        console.log('method == jwt')
        handleJWT(payload);
      }
      else {
        console.log('shit out of luck!')
      }
    });
    console.log('initialize variables..')
    var init = false;
    var pm_id = ''
    var source = null;
    var user = null;
    var pendingRequests = [];
    var identityWindow = null;
    login()
  });
}



const useStyles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    textTransform: 'none'
  }
});

const MyDesoLogin = (props) => {
  const {accessLevel, onSuccess, onFailure, JWT, ...other} = props

	const handleLogin = () => {
    console.log('const handleLogin')
		initLogin(accessLevel, JWT).then(e=>{
			onSuccess(e);
		}).catch(e=>{
      onFailure(e);
    });
	}
	return (
        <Button
          variant="contained"
          onPress={handleLogin}
        >
          {"Sign in with Deso"}
        </Button>
  );
}

MyDesoLogin.propTypes = {
  accessLevel: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  JWT: PropTypes.bool,
}
export default MyDesoLogin
