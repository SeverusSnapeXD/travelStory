import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Main = ({navigation}) => {
  // HEADER BUTTON CUSTOMIZATION
  const headerbtn = useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Icons
          name="add-circle-outline"
          size={35}
          style={{marginRight: 15}}
          color="white"
          onPress={() => navigation.navigate('NewTrip')}
        />
      ),
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

  const img = './bg.png';

  const uid = auth().currentUser.uid;

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    await firestore()
      .collection('users')
      .doc(uid)
      .collection('albums')
      .get()
      .then(albums => {
        if (albums.docs.length > 0) {
          let arr = [];
          albums.forEach(album => {
            if (album.exists) {
              const albumdata = {...album.data(), id: album.id};
              arr.push(albumdata);
            }
          });
          return arr;
        }
      })
      .then(arr => setdata(arr))
      .catch(e => console.log(e));
  };

  const [data, setdata] = useState([]);

  const renderScrn = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TripDetails', {title: item.name})}
        style={styles.imagetile}
        key={item.id}
        activeOpacity={0.6}>
        <ImageBackground
          source={require(img)}
          resizeMode="cover"
          imageStyle={{borderRadius: 20}}
          style={{
            width: '100%',
            height: 200,
            justifyContent: 'flex-end',
          }}>
          <View style={styles.imgText}>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.date}>
              {item.country} {item.date}
            </Text>
            <Text style={styles.desc}>{item.description}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const newl = ({item}) => (
    <View style={{marginTop: 10}} key={item.id}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Mis Viajes</Text>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          style={styles.list}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderScrn}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',
    // height: '90%',
    alignSelf: 'center',
  },
  heading: {},
  headingText: {
    fontSize: 45,
    color: '#023E3F',
  },
  imagetile: {
    borderRadius: 20,
    // borderWidth: 1,
    height: 200,
    width: '100%',
    marginVertical: 10,
  },
  imgText: {
    width: '70%',
    padding: 10,
    backgroundColor: 'rgba(80,80,80,0.6)',
    marginBottom: 15,
    marginLeft: 15,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
  date: {
    color: 'white',
    fontSize: 15,
  },
  desc: {
    color: 'white',
    fontSize: 15,
  },
  list: {
    flex: 1,
    // height: 400,
    // width: 250,
  },
});
