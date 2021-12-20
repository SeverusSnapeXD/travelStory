import React, {useContext} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator, HeaderTitle} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {DrawerContent} from './screens/DrawerContent';

// Screens

import Login from './screens/Login';
import Home from './screens/Home';
import Register from './screens/Register';
import Main from './screens/Main';
import NewTrip from './screens/NewTrip';
import TripDetails from './screens/TripDetails';
import NewPost from './screens/NewPost';
import Profile from './screens/Profile';
import PostNew from './screens/PostNew';
import {AuthProvider} from './screens/AuthProvider';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// const MenuIcon = navigation => {
//   return (
//     <Icon
//       name="menu-sharp"
//       size={35}
//       style={{marginLeft: 15}}
//       color="white"
//       onPress={() => navigation.openDrawer()}
//     />
//   );
// };

// const AddIcon = () => {
//   return (
//     <Icon
//       name="add-circle-outline"
//       size={35}
//       style={{marginRight: 15}}
//       color="white"
//       onPress={() => nav.navigate('NewPost')}
//     />
//   );
// };

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LoginStack"
            component={LoginStack}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DrawerStack"
            component={DrawerStack}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;

//SCREENS BEFORE USER HAS LOGGED IN
const LoginStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

// SCREENS AFTER LOGGIN WITH DRAWER
const DrawerStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="HomeStack"
        component={HomeStack}
        // options={{headerLeft: MenuIcon}}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: 'My Profile',
          headerStyle: {
            backgroundColor: '#59C3C3',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />
    </Drawer.Navigator>
  );
};

const HomeStack = ({navigation}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={Main}
        options={{
          headerTitle: 'My Trips',
          headerStyle: {
            backgroundColor: '#59C3C3',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="NewTrip"
        component={NewTrip}
        options={{
          headerTitle: 'New Trip',
          headerStyle: {
            backgroundColor: '#59C3C3',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="TripDetails"
        component={TripDetails}
        options={{
          headerTitle: 'Trip Details',
          headerStyle: {
            backgroundColor: '#59C3C3',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="NewPost"
        component={NewPost}
        options={{
          headerTitle: 'Nueva Publicación',
          headerStyle: {
            backgroundColor: '#59C3C3',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="PostNew"
        component={PostNew}
        options={{
          headerTitle: 'New Post',
          headerStyle: {
            backgroundColor: '#59C3C3',
          },
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      />
    </Stack.Navigator>
  );
};
