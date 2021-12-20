import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Card = ({text, location, dbimage}) => {
  const img = '../bg.png';

  const uid = auth().currentUser.uid;

  useEffect(() => {
    loadData();
  }, []);

  const [name, setname] = useState('');
  const [image, setimage] = useState(
    'https://www.pinclipart.com/picdir/big/547-5474602_character-avatar-clipart.png',
  );

  const loadData = async () => {
    await firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then(doc => {
        const data = doc.data();
        setname(data.name);
        if (data.image) {
          setimage(data.image);
        }
      })
      .catch(e => console.log(e));
  };

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={styles.details}>
          <Avatar pic={image} />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.place}>{location}</Text>
          </View>
        </View>
        {/* <Text style={styles.time}>Hace 3 horas</Text> */}
      </View>
      <View>
        <Image
          style={styles.image}
          source={{
            uri: dbimage,
          }}
          resizeMode="cover"
        />
        <Text style={styles.desc}>{text}</Text>
      </View>
    </View>
  );
};

export default Card;

const Avatar = ({pic}) => {
  return (
    <Image
      resizeMode="cover"
      source={{
        uri: pic,
      }}
      style={styles.avatarImage}
    />
  );
};

const styles = StyleSheet.create({
  avatarImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  card: {
    flexDirection: 'column',
    backgroundColor: 'white',
    padding: 5,
  },
  cards: {
    height: 290,
    padding: 10,
    borderWidth: 1,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '500',
  },
  place: {
    fontSize: 15,
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 25,
    marginTop: 10,
  },
});
