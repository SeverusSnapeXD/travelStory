import React, {useEffect, useState, useLayoutEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {globalStyles} from './styles/globalStyles';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import {ScrollView} from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/Ionicons';
import {sub} from 'react-native-reanimated';

const Profile = ({navigation}) => {
  const uid = auth().currentUser.uid;

  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [number, setnumber] = useState('');
  const [dob, setdob] = useState('');
  const [address, setaddress] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  // LOAD PROFILE DATA
  const loadData = async () => {
    await firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => {
        const data = doc.data();
        setname(data.name);
        setemail(data.email);
        setnumber(data.number);
        setdob(data.dob);
        setaddress(data.address);
        setimage(data.profile);
      })
      .catch(e => console.log(e));
  };

  const headerbtn = useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Icons
          name="menu-sharp"
          size={35}
          style={{marginLeft: 15}}
          color="white"
          onPress={() => navigation.openDrawer()}
        />
      ),
    });
  }, [navigation]);

  // UPDATE PROFILE PICTURE
  const submitPost = async () => {
    const imageUrl = await uploadImage();
    if (imageUrl == null) {
      return;
    }
    console.log('Image Url: ', imageUrl);
    // setimage(null);
    setisupload(false);

    firestore()
      .collection('users')
      .doc(uid)
      .update({
        profile: imageUrl,
      })
      .then(() => {
        Alert.alert('Profile Update!', 'Your Profile Updated Successfully!');
      })
      .catch(error => {
        console.log(
          'Something went wrong with added post to firestore.',
          error,
        );
      });
  };

  const uploadImage = async () => {
    if (image == null) {
      alert('Please add an image!');
      return null;
    }
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);

    // Add timestamp to File Name
    const extension = filename.split('.').pop();
    const name = filename.split('.').slice(0, -1).join('.');
    filename = name + Date.now() + '.' + extension;

    // setUploading(true);
    // setTransferred(0);

    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);
    try {
      await task;

      const url = await storageRef.getDownloadURL();
      return url;
    } catch (e) {
      console.log(e);
      return null;
    }
  };

  // OPEN GALLERY
  const selectpic = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        if (image.path.length) {
          setisupload(true);
          setimage(image.path);
        }
      })
      .catch(e => console.log(e));
  };

  // PLACEHOLDER IMAGE WHEN USER HAS NOT PROVIDED A PROFILE PICTURE
  const imgLink =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  const [image, setimage] = useState(imgLink);

  const [isupload, setisupload] = useState(false);

  // WHEN USER SELECTS A PROFILE PICTURE, IMAGE STATE WILL BE CHANGED. WHEN IT CHANGES IT WILL BE UPLOADED TO DATABASE AS THE PROFILE PICTURE
  useEffect(() => {
    if (isupload) {
      if (image !== imgLink) {
        submitPost();
      } else {
        console.log('nop');
      }
    }
  }, [image]);

  return (
    <View style={styles.container}>
      <View style={styles.bg}>
        <Image
          style={{width: 110, height: 110, borderRadius: 55, marginBottom: 20}}
          resizeMode="cover"
          source={{
            uri: image,
          }}
        />
        <Icon
          name="camera"
          size={24}
          color="white"
          style={styles.icon}
          onPress={selectpic}
        />
      </View>

      <KeyboardAvoidingView style={styles.d} behavior="position">
        {/* <ScrollView style={{height: '100%'}}> */}
        <View style={styles.details}>
          <TextInput
            style={styles.input}
            value={name}
            placeholder="Nombre"
            onChangeText={e => setname(e)}
          />
          <TextInput style={styles.input} value={email} placeholder="Correo" />
          <TextInput
            style={styles.input}
            value={number}
            placeholder="Número  celular"
            onChangeText={e => setnumber(e)}
          />
          <TextInput
            style={styles.input}
            value={address}
            placeholder="Dirección"
            onChangeText={e => setaddress(e)}
          />
          <TextInput
            style={styles.input}
            value={dob}
            placeholder="F. Nacimiento"
            onChangeText={e => setdob(e)}
          />
        </View>
      </KeyboardAvoidingView>
      <TouchableOpacity style={[globalStyles.btnBlue, styles.btn]}>
        <Text style={{color: 'white'}}>GUARDAR</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  bg: {
    backgroundColor: '#4EA9A9',
    height: '25%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    position: 'absolute',
    right: '38%',
    top: '60%',
  },
  details: {
    backgroundColor: 'white',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    elevation: 20,
    borderRadius: 15,
    marginVertical: 5,
    padding: 10,
  },
  d: {
    width: '100%',
    marginTop: -25,
    marginBottom: 20,
    paddingBottom: 35,
    // backgroundColor: 'grey',
  },
  input: {
    // backgroundColor: 'grey',
    width: '100%',
    paddingHorizontal: 15,
    fontSize: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#4EA9A9',
    marginVertical: 6,
  },
  btn: {
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  indicator: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
});
