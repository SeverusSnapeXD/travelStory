import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const Home = ({navigation}) => {
  const img = './bg.png';

  // WHEN THERE IS A CHANGE IN AUTH AND IF A USER DETECTED HE WILL BE TAKEN TO THE HOME SCREEN
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(authuser => {
      if (authuser) {
        if (authuser) {
          navigation.replace('DrawerStack');
        }
      }
    });
    return subscriber;
  }, []);

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        source={require(img)}
        resizeMode="cover"
        style={{flex: 1, justifyContent: 'center'}}>
        <View style={{marginLeft: 15}}>
          <Text style={styles.heading}>
            <Text style={{fontSize: 46}}>T</Text>
            RAVEL
            <Text style={{fontSize: 46}}>S</Text>
            TORY
          </Text>
        </View>

        <View
          style={{
            alignItems: 'center',
            marginTop: 60,
            bottom: 15,
            position: 'relative',
            top: '20%',
          }}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            style={{
              ...styles.buttons,
              borderColor: 'none',
              backgroundColor: 'rgba(255, 255, 255, 0.39)',
            }}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  heading: {
    color: 'white',
    fontSize: 36,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
  },
  buttons: {
    width: '80%',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
    borderRadius: 10,
    marginVertical: 20,
    padding: 5,
  },
});
