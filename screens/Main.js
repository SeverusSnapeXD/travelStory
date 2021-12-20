import React, {useLayoutEffect, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  Button,
  TouchableOpacity,
  RefreshControl,
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
    return () => {
      setdata([]);
    };
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
      .then(() => setrefreshing(false))
      .catch(e => console.log(e));
  };

  const [data, setdata] = useState([]);
  const [refreshing, setrefreshing] = useState(false);

  const onRefresh = () => {
    setrefreshing(true);
    loadAlbums();
  };

  const renderScrn = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TripDetails', {title: item.name})}
        style={styles.imagetile}
        key={item.id}
        activeOpacity={0.6}>
        <ImageBackground
          source={{
            uri: item.image
              ? item.image
              : 'https://media.istockphoto.com/photos/travel-during-the-covid19-pandemic-airplane-model-with-face-mask-and-picture-id1268257924?b=1&k=20&m=1268257924&s=170667a&w=0&h=kviE-Bd4sAaGuHXJqdzxk__-URPKAZV6Zj7VpnuXges=',
          }}
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

  const Footer = () => {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
        refreshing={refreshing}
        onRefresh={onRefresh}>
        <Text style={{fontSize: 25}}>Add albums from top + button</Text>
        <Icons
          name="compass-outline"
          size={100}
          color="black"
          onPress={() => navigation.openDrawer()}
        />
      </View>
    );
  };

  setTimeout(() => {
    setrefreshing(false);
  }, 2000);

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text style={styles.headingText}>Mis Viajes</Text>
      </View>
      {/* {data?.length ? ( */}
      <View style={{flex: 1}}>
        <FlatList
          style={styles.list}
          data={data}
          showsVerticalScrollIndicator={false}
          renderItem={renderScrn}
          keyExtractor={item => item.id}
          ListFooterComponent={<Footer />}
          refreshing={refreshing}
          onRefresh={onRefresh}
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
