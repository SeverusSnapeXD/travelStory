import React, {useState, useLayoutEffect, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import {globalStyles} from './styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';

import {DateTimePickerModal} from 'react-native-modal-datetime-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';

const NewTrip = ({navigation}) => {
  const headerbtn = useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icon
          name="menu-sharp"
          size={35}
          style={{marginLeft: 15}}
          color="white"
          onPress={() => navigation.openDrawer()}
        />
      ),
    });
  }, [navigation]);

  const userid = auth().currentUser.uid;

  const [date, setDate] = useState(new Date());
  const [show, setshow] = useState(false);

  const [tripnname, settripname] = useState('');
  const [country, setcountry] = useState('');
  const [destination, setdestination] = useState('');
  const [description, setdescription] = useState('');

  const [selectedDate, seetselectedDate] = useState(
    'Tap the icon to select date',
  );

  const handleDate = n => {
    let newdate = n.getFullYear() + '/' + n.getMonth() + '/' + n.getDate();
    seetselectedDate(newdate);
    setshow(false);
  };

  const openPicker = () => {
    setshow(true);
  };

  const [keyboardStatus, setKeyboardStatus] = useState(undefined);

  const clearStates = () => {
    settripname('');
    setdestination('');
    setcountry('');
    seetselectedDate('Tap the icon to select date');
    setdescription('');
  };

  const create = async () => {
    if (
      country.length == 0 ||
      tripnname.length == 0 ||
      destination.length == 0 ||
      description.length == 0 ||
      selectedDate.length > 12
    ) {
      alert('Please fill all the fields!');
    } else {
      addAlbum();
      console.log('user id ', userid);
    }
  };

  const addAlbum = async () => {
    await firestore()
      .collection('users')
      .doc(userid)
      .collection('albums')
      .doc(tripnname)
      .set({
        name: tripnname,
        country: country,
        destination: destination,
        date: selectedDate,
        description: description,
        image: '',
      })
      .then(() => alert('Album Created!'))
      .then(() => navigation.goBack())
      .then(() => clearStates())
      .catch(e => console.log(e));
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardStatus('Keyboard Shown');
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus('Keyboard Hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    // <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.heading}>
          <Text style={styles.headingText}>Crea un nuevo Viaje</Text>
        </View>
        <View style={styles.sub}>
          <Text style={styles.subText}>
            Que un hermoso día se quede en tus recuerdos
          </Text>
        </View>
        <View style={styles.subHead}>
          <Text style={styles.subHeadText}>Sobre tu Viaje</Text>
        </View>
        <View style={styles.inputs}>
          <View style={[styles.test, styles.textinput]}>
            <Icon
              style={styles.icon}
              name="information-circle-outline"
              size={24}
              color="black"
            />
            <TextInput
              style={styles.text}
              placeholder="Nombre de tu Viaje"
              value={tripnname}
              onChangeText={e => settripname(e)}
            />
          </View>

          <View style={[styles.test, styles.textinput]}>
            <Icon style={styles.icon} name="location" size={24} color="black" />
            <TextInput
              style={styles.text}
              placeholder="País de Destino"
              value={country}
              onChangeText={e => setcountry(e)}
            />
          </View>

          <View style={[styles.test, styles.textinput]}>
            <Icon style={styles.icon} name="locate" size={24} color="black" />
            <TextInput
              style={styles.text}
              placeholder="Nombre del lugar de destino"
              value={destination}
              onChangeText={e => setdestination(e)}
            />
          </View>

          <View style={[styles.test, styles.textinput]}>
            <Icon
              style={styles.icon}
              name="calendar-sharp"
              size={24}
              color="black"
              onPress={openPicker}
            />
            <TextInput
              style={styles.text}
              placeholder="Fecha de inicio"
              value={selectedDate}
            />
            <DateTimePickerModal
              isVisible={show}
              mode="date"
              onConfirm={handleDate}
              onCancel={() => setshow(false)}
            />
          </View>

          <Text style={{...styles.subHeadText, width: '100%'}}>
            Descripcion
          </Text>
          <View style={[styles.test, styles.textinput]}>
            <Icon name="book-outline" size={24} color="black" />
            <TextInput
              style={styles.text}
              placeholder="Descripción"
              value={description}
              onChangeText={e => setdescription(e)}
            />
          </View>
        </View>
        <View style={styles.button}>
          <TouchableOpacity style={globalStyles.btnBlue} onPress={create}>
            <Text style={{color: 'white'}}>CREAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default NewTrip;

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    width: '90%',
    alignSelf: 'center',
    // marginTop: 25,
  },
  heading: {},
  headingText: {
    color: '#023E3F',
    fontSize: 30,
  },
  sub: {
    // marginTop: 0,
  },
  subText: {
    color: '#84A98C',
    fontSize: 20,
  },
  subHead: {
    marginTop: 5,
  },
  subHeadText: {
    color: '#023E3F',
    fontSize: 25,
    fontWeight: '400',
    textAlign: 'left',
  },
  test: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textinput: {
    width: '100%',
    borderColor: '#59C3C3',
    borderWidth: 3,
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 20,
  },
  inputs: {
    width: '100%',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  button: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
});
