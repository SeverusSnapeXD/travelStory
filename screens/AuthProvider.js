import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import {Dimensions} from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [isloggedin, setisloggedin] = useState(false);
  const [userid, setuserid] = useState('');

  const w = Dimensions.get('window').width;
  const h = Dimensions.get('window').height;

  return (
    <AuthContext.Provider
      value={{
        w,
        h,
        userid,
        setuserid,
        isloggedin,
        setisloggedin,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
