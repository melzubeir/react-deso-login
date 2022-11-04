import React from 'react';
import { StyleSheet } from 'react-native';
import Button from './ui/Button';
import Icon from './ui/Icon';
import PropTypes from "prop-types";

function initLogin(accessLevel, JWT) {
  console.log('func initLogin()')
  return new Promise(function (resolve, reject) {
    function login() {
      console.log('func initLogin().login()')
      identityWindow = window.open('https://identity.deso.org/log-in?accessLevel='+accessLevel, null, 'toolbar=no, width=800, height=1000, top=0, left=0');
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
      console.log('func initLogin().handleLogin()')
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
            method: 'jwt',
            payload: payload
          }, "*");
        }
      }
    }

    function handleJWT(payload) {
      console.log('func handleJWT()')
      user['jwt'] = payload['jwt'];
      if (identityWindow) {
        identityWindow.close();
        identityWindow = null;
      }
      resolve(user);
    }

    function respond(e, t, n) {
      e.postMessage({
        id: t,
        service: "identity"
      }, "*")
    }

    window.addEventListener('message', message => {
      console.log('window.addEVentListener');
      const { data: { id: id, method: method, service: service, payload: payload } } = message;
      if (service !== "identity"){ console.log('service not identity'); return };

      if (method == 'initialize') {
        handleInit(message);
      } else if (method == 'login') {
        handleLogin(payload);
      } else if ('jwt' in payload) {
        handleJWT(payload);
      }
    });

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

const DesoLogin = (props) => {
  const {accessLevel, onSuccess, onFailure, JWT, customization,
    customIcon,
    customText,
    CustomComponent, ...other} = props
  const Component = CustomComponent || Button;
  var customClassName = '';
  if (customization) {
    customClassName =  customization.className;
  }
	const handleLogin = () => {
    console.log('const handleLogin')
		initLogin(accessLevel, JWT).then(e=>{
			onSuccess(e);
		}).catch(e=>{
      onFailure(e);
    });
	}
	return (
        <Component
          variant="contained"
          startIcon={customIcon ? customIcon : <Icon />}
          onPress={handleLogin}
        >
          {customText || "Sign in with Deso"}
        </Component>
  );
}

DesoLogin.propTypes = {
  accessLevel: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
  JWT: PropTypes.bool,
  customization: PropTypes.object,
  icon: PropTypes.element,
}
export default DesoLogin
