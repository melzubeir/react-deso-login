# React Deso Login

This project is based on  [BogdanDidenko/react-bitclout-login](https://github.com/BogdanDidenko/react-bitclout-login) which was based on [mubashariqbal/login-with-bitclout](https://github.com/mubashariqbal/login-with-bitclout) repository.


## Instalation

#### npm install
```shell
npm install
```

### JWT
If you only want to verify Bitclout users, JWT token would be enough for this goal.
Storing it in the database is safer than encryptedSeedHex(with high access level) because JWT can't sign Bitclout transactions. You can validate user publicKey by JWT token. See an example here:
https://docs.deso.org/devs/identity-api#validation-in-go

#### [NEW] by @melzubeir

3rd party dependencies that were unnecessary were removed and replaced by vanilla react native
alternatives, like @material-ui/*


## How to use

```js
import { StatusBar } from 'expo-status-bar';
import Dialog from 'react-native-dialog';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MyDesoLogin from './components/MyDesoLogin';


function App() {

  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');
  const responseClout = (response) => {
    setResponse(JSON.stringify(response, null, 2));
    setOpen(true);
  }
  console.log('func App(): response:', response);
  const handleClose = () => {
    setOpen(false);
  };

  const accessLevel = 4;
  const JWT = true;

  return (
    <>
      <View style={styles.container}>
        <MyDesoLogin
          accessLevel={accessLevel}
          onSuccess={responseClout}
          onFailure={responseClout}
          JWT={JWT} />
        <Dialog.Container open={open}
          onClose={handleClose}>
          <Dialog.Title>Auth Response</Dialog.Title>
          <Dialog.Description><pre>{response}</pre></Dialog.Description>
          <Dialog.Button onClick={handleClose} >
            Close
          </Dialog.Button>
        </Dialog.Container>
      </View>

      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

## Repository install:
```shell
git clone git@github.com:melzubeir/react-deso-login.git
cd react-deso-login
npm install
expo start
```

Runs the app through emulator.

## Security
This code may contain vulnerabilities. I ask you to help make it better. Feel free to add issues and pull requests.
