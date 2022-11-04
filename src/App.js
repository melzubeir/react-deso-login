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
