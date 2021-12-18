import React, {useState, useLayoutEffect, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {globalStyles} from './styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const NewPost = ({navigation, route}) => {
  // ALBUM NAME IS PASSED FROM PREVIOUS SCREEN
  const {title} = route.params;

  // HEADER BUTTON CUSTOMIZATION
  const headerbtn = useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icon
          name="checkmark-sharp"
          size={35}
          style={{marginRight: 15}}
          color="white"
          onPress={submitPost}
        />
      ),
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

  //OPEN GALLERY
  const selectpic = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 300,
      cropping: true,
    })
      .then(image => {
        setimage(image.path);
      })
      .catch(e => console.log(e));
  };

  // OPEN CAMERA
  const takepic = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    })
      .then(image => {
        console.log(image);
        setimage(image.path);
      })
      .catch(e => console.log(e));
  };

  const uid = auth().currentUser.uid;

  const [image, setimage] = useState('');

  const submitPost = async () => {
    const imageUrl = await uploadImage();
    if (imageUrl == null) {
      return;
    }
    console.log('Image Url: ', imageUrl);

    // setimage(null);
    // setisupload(false);

    firestore()
      .collection('users')
      .doc(uid)
      .collection('albums')
      .doc(title)
      .collection('posts')
      .add({
        image: imageUrl,
        time: firestore.Timestamp.fromDate(new Date()),
        description: description,
        location: loctitle,
      })
      .then(() => {
        Alert.alert(
          'Post published!',
          'Your post has been published Successfully!',
        );
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

  // Map

  const [marker, setmarker] = useState(null);

  const [isupload, setisupload] = useState(false);

  const API_KEY = 'AIzaSyAbuSHTPaK52AnEI-6sLsXKL7Id255MIVw';

  // RETRIEVE ADDRESS FROM THE LAT AND LOT USING THE GEOCODING API
  const getLocation = async () => {
    Geocoder.init(API_KEY);
    Geocoder.from(marker.latitude, marker.longitude)
      .then(json => {
        var addressComponent =
          json.results[0].address_components[1].short_name ||
          json.results[0].address_components[1].long_name;
        // console.log(addressComponent);
        settitle(addressComponent);
      })
      .catch(error => {
        console.warn(error), alert('Name Not Found');
      });
  };

  const handleMark = val => {
    setmarker({lat: val.latitude, lon: val.longitude});
    console.log('ran ', val);
  };

  // WHEN THE USER TOUCHES THE MAP, A MARKER WILL BE SET AND THE LOCATION OF THAT MARKER IS RETRIEVED
  useEffect(() => {
    if (marker !== null) {
      getLocation();
      console.log('ran');
    }
  }, [marker]);

  const [loctitle, settitle] = useState('');

  const [description, setdescription] = useState('');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={{height: '100%'}}>
          <View style={{height: '20%'}}>
            <Text style={styles.text}>Select Image</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 10,
                marginVertical: 15,
              }}>
              <TouchableOpacity
                style={globalStyles.btnBlue}
                onPress={selectpic}>
                <Text style={{color: 'white'}}>Select</Text>
              </TouchableOpacity>
              <TouchableOpacity style={globalStyles.btnBlue} onPress={takepic}>
                <Text style={{color: 'white'}}>Take</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <View style={{height: i}} > */}
          {image.length ? (
            <Image
              style={{
                height: '45%',
                width: '100%',
                alignSelf: 'center',
                borderWidth: 1,
                borderColor: 'black',
              }}
              source={{uri: image}}
            />
          ) : null}
          {/* </View> */}
          <View style={{height: '35%'}}>
            <Text style={styles.text}>Añade una descripción</Text>
            <TextInput
              style={{
                ...globalStyles.textinput,
                textAlign: 'justify',
                textAlignVertical: 'top',
                width: '100%',
              }}
              value={description}
              onChangeText={e => setdescription(e)}
              multiline
              numberOfLines={5}
            />
          </View>
          <View
            style={{
              width: '100%',
              height: '45%',
              alignSelf: 'center',
            }}>
            <Text style={styles.text}>Confirma tu ubicación </Text>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={{width: '100%', height: '100%'}}
              onPress={e => setmarker(e.nativeEvent.coordinate)}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
              }}>
              {marker ? (
                <Marker title={loctitle} coordinate={marker}></Marker>
              ) : null}
            </MapView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default NewPost;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    width: '90%',
    alignSelf: 'center',
    height: '100%',
    // backgroundColor: 'grey',
  },
  text: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '500',
    color: '#023E3F',
  },
});
