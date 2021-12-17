import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {globalStyles} from './styles/globalStyles';
import {AuthContext} from './AuthProvider';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const {isloggedin, setisloggedin, setuserid} = useContext(AuthContext);
  const [initializing, setInitializing] = useState(true);

  const [email, setemail] = useState('');
  const [pwd, setpwd] = useState('');

  const onAuthStateChanged = user => {
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authuser => {
      if (authuser) {
        navigation.replace('DrawerStack');
        setuserid(authuser.uid);
      }
    });
    return subscriber;
  }, []);

  const loginUser = () => {
    const expression =
      /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    if (expression.test(email) === false) {
      alert('Enter a valid email');
      return false;
    } else {
      if (pwd.length <= 0) {
        alert('Enter a valid password!');
        return false;
      } else {
        auth()
          .signInWithEmailAndPassword(email, pwd)
          .then(user => setuserid(user.user.uid))
          .then(() => setisloggedin(true))
          .catch(error => alert(error));
      }
    }
  };

  const img = require('./bg4.jpg');

  return (
    <View style={styles.container}>
      <ImageBackground style={{flex: 1}} source={img} resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.mapicon}>
            <Icon name="map-marker-radius-outline" size={110} color="#023E3F" />
          </View>
          <View style={styles.inputs}>
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
              secureTextEntry={true}
              placeholder="CONTRASEÑA"
              placeholderTextColor="white"
              value={pwd}
              onChangeText={e => setpwd(e)}
            />
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity
              style={globalStyles.btnBlue}
              onPress={() => navigation.goBack()}>
              <Text style={{color: 'white'}}>CANCELAR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.btnDark} onPress={loginUser}>
              <Text style={{color: 'white'}}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Login;

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
    alignItems: 'center',
    height: '40%',
    marginTop: '10%',
  },
  buttons: {
    height: '20%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(80,80,80,0.5)',
  },
});
