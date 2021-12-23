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
  Dimensions,
  PermissionsAndroid,
} from 'react-native';
import {globalStyles} from './styles/globalStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geocoder from 'react-native-geocoding';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Geolocation from '@react-native-community/geolocation';

const PostNew = ({navigation, route}) => {
  const {title} = route.params;
  const uid = auth().currentUser.uid;

  const height = Dimensions.get('window').height;

  const headerbtn = useLayoutEffect(() => {
    navigation.setOptions({
      //   headerRight: () => (
      //     <Icon
      //       name="checkmark-sharp"
      //       size={35}
      //       style={{marginRight: 15}}
      //       color="white"
      //       onPress={createPost}
      //     />
      //   ),
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

  const createPost = () => {
    console.log(description);
    console.log(location);
  };

  const API_KEY = 'AIzaSyAbuSHTPaK52AnEI-6sLsXKL7Id255MIVw';

  // RETRIEVE ADDRESS FROM THE LAT AND LOT USING THE GEOCODING API
  const getLocation = async () => {
    Geocoder.init(API_KEY);
    Geocoder.from(marker.latitude, marker.longitude)
      .then(json => {
        console.log(marker.latitude, marker.longitude);
        var addressComponent =
          json.results[0].address_components[1].short_name ||
          json.results[0].address_components[1].long_name;
        // console.log(addressComponent);
        setlocation(addressComponent);
      })
      .catch(error => {
        console.warn(error), alert('Name Not Found');
      });
  };

  const [location, setlocation] = useState('');
  const [description, setdescription] = useState('');
  const [image, setimage] = useState(null);
  const [marker, setmarker] = useState();

  useEffect(() => {
    if (marker !== null) {
      getLocation();
      console.log('ran');
    }
  }, [marker]);

  const requestGPSPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'TravelStory App GPS Permission',
          message:
            'TravelStory App needs to locate your location ' +
            'so we can mark on the map.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('granted');
        return true;
      } else {
        // alert("App can't locate you!");
        console.log('not granted');
        return false;
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const checkPermission = async () => {
    const result = await requestGPSPermission();
    if (result) {
      getGpsLocation();
    }
  };

  useEffect(() => {
    checkPermission();
    // requestGPSPermission();
  }, []);

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

  const post = () => {
    console.log('Descrpn ', description);
    console.log('Locatn ', location);
    console.log('Img ', image);
  };

  const submitPost = async () => {
    post();
    if (description.length == 0 || location.length == 0) {
      alert('All the fields are required!');
      return;
    }
    const imageUrl = await uploadImage();
    if (imageUrl == null) {
      return;
    }
    console.log('Image Url: ', imageUrl);

    setimage(null);
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
        location: location,
      })
      .then(() => {
        updateImage(imageUrl);
      })
      .then(() => {
        Alert.alert(
          'Post published!',
          'Your post has been published Successfully!',
        );
      })
      .then(() => navigation.goBack())
      .catch(error => {
        console.log(
          'Something went wrong with added post to firestore.',
          error,
        );
      });
  };

  const getGpsLocation = () => {
    Geolocation.getCurrentPosition(
      pos => {
        console.log('pos long', pos.coords.longitude);
        console.log('pos lat', pos.coords.latitude);
        setmarker({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      error => console.log('Error ', error),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 2000},
    );
  };

  const updateImage = async url => {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('albums')
      .doc(title)
      .update({
        image: url,
      })
      .then(() => console.log('image updated'))
      .catch(e => alert(e));
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

  return (
    <ScrollView style={styles.container}>
      {/* <Text>{title}</Text> */}
      <View style={[styles.imageselect, {height: height * 0.15}]}>
        <Text style={styles.text}>Add Image</Text>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
            justifyContent: 'space-evenly',
            width: '95%',
          }}>
          <TouchableOpacity
            style={{...globalStyles.btnBlue, height: 40}}
            onPress={selectpic}>
            <Text style={{color: 'white'}}>Select</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...globalStyles.btnBlue, height: 40}}
            onPress={takepic}>
            <Text style={{color: 'white'}}>Take</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.image}>
        {image == null ? null : (
          <Image
            style={{height: height * 0.4, width: '100%', borderWidth: 1}}
            source={{uri: image}}
          />
        )}
      </View>
      <View style={styles.input}>
        <Text style={styles.text}>Añade una descripción</Text>
        <TextInput
          style={{...globalStyles.textinput, width: '100%'}}
          multiline
          numberOfLines={2}
          value={description}
          onChangeText={text => setdescription(text)}
        />
      </View>
      <Text style={styles.text}>Añade una descripción</Text>
      <View style={styles.mapview}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{flex: 1}}
          onPress={e => setmarker(e.nativeEvent.coordinate)}
          showsUserLocation={true}
          // initialRegion={{
          //   latitude: -12.074,
          //   longitude: -77.026,
          //   latitudeDelta: 0.015,
          //   longitudeDelta: 0.0121,
          // }}
        >
          {marker ? (
            <Marker
              title={location}
              coordinate={marker}
              showUserLocation={true}></Marker>
          ) : null}
        </MapView>
      </View>
      <View style={styles.button}>
        <TouchableOpacity style={globalStyles.btnBlue} onPress={submitPost}>
          <Text style={{color: 'white'}}>Post</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default PostNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageselect: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    alignSelf: 'center',
    width: '95%',
  },
  input: {
    alignSelf: 'center',
    width: '95%',
  },
  text: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '500',
    color: '#023E3F',
  },
  mapview: {
    width: '95%',
    alignSelf: 'center',
    height: 400,
    borderWidth: 3,
    borderRadius: 15,
    borderColor: '#59C3C3',
  },
  button: {
    height: 65,
    // backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
