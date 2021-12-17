import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyles} from './styles/globalStyles';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Register = ({navigation}) => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [pwd, setpwd] = useState('');
  const [dob, setdob] = useState('');

  const docref = firestore().collection('users');

  // USER DATA VALIDATION
  const btnRegister = () => {
    const expression =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    if (
      email.length == 0 ||
      pwd.length == 0 ||
      dob.length == 0 ||
      name.length == 0
    ) {
      alert('Please fill all the fields!');
      return false;
    } else {
      if (expression.test(email) === false) {
        alert('Enter a valid email');
        return false;
      } else {
        register();
      }
    }
  };

  const register = () => {
    auth()
      .createUserWithEmailAndPassword(email, pwd)
      .then(user =>
        docref.doc(user.user.uid.toString()).set({
          id: user.user.uid.toString(),
          date: new Date(),
          name: name,
          dob: dob,
        }),
      )
      .then(() => navigation.replace('DrawerStack'))
      .catch(error => alert(error.message));
  };

  const img = require('./bg4.jpg');

  return (
    <View style={styles.container}>
      <ImageBackground style={{flex: 1}} source={img} resizeMode="cover">
        <View style={styles.overlay}>
          <KeyboardAvoidingView>
            <View style={styles.mapicon}>
              <Icon
                name="map-marker-radius-outline"
                size={110}
                color="#023E3F"
              />
            </View>
            <ScrollView
              style={styles.inputs}
              contentContainerStyle={{alignItems: 'center'}}>
              <TextInput
                style={{...globalStyles.textinput, color: 'white'}}
                value={name}
                onChangeText={e => setname(e)}
                placeholder="NOMBRE"
                placeholderTextColor="white"
              />
              <TextInput
                style={{...globalStyles.textinput, color: 'white'}}
                keyboardType="email-address"
                placeholder="EMAIL"
                placeholderTextColor="white"
                value={email}
                onChangeText={e => setemail(e)}
              />
              <TextInput
                style={{...globalStyles.textinput, color: 'white'}}
                secureTextEntry
                placeholder="CONTRASEÑA"
                value={pwd}
                onChangeText={e => setpwd(e)}
                placeholderTextColor="white"
              />
              <TextInput
                style={{...globalStyles.textinput, color: 'white'}}
                placeholder="F. DE NACIMIENTO"
                value={dob}
                onChangeText={e => setdob(e)}
                placeholderTextColor="white"
              />
            </ScrollView>
            <View style={styles.buttons}>
              <TouchableOpacity
                style={globalStyles.btnBlue}
                onPress={() => navigation.goBack()}>
                <Text style={{color: 'white'}}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={globalStyles.btnDark}
                onPress={btnRegister}>
                <Text style={{color: 'white'}}>REGISTRARSE</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  mapicon: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputs: {
    // alignItems: 'center',
    height: '55%',
  },
  buttons: {
    height: '15%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(80,80,80,0.5)',
  },
});
