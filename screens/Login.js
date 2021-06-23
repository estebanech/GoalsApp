import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text, Button, SocialIcon,Input} from 'react-native-elements'
import firebase from 'firebase'
import * as Google from 'expo-google-app-auth';
import auth from '@react-native-firebase/auth';
import {initDb,getUserInfo} from '../helpers/firebase-goals';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 
import { androidKey } from '../helpers/android-key';

const Login = ({route, navigation}) => {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [error,setError] = useState(false)

    useEffect(() => {
        try {
            initDb();
        } catch (err) {
          console.log(err);
        }
      }, []);

    const signInAsync = async () => {
        const { type, accessToken, user, idToken } = await Google.logInAsync({
            androidClientId: androidKey,
            scopes: ["profile", "email"]
          });
          
        if (type === 'success') {
            const credential = firebase.auth.GoogleAuthProvider.credential(
                idToken,
                accessToken
            );
            firebase.auth().signInWithCredential(credential).then((result)=>{
                if (result.additionalUserInfo.isNewUser) {
                    firebase
                  .database()
                  .ref('/users/' + result.user.uid)
                  .set({
                    mail: result.user.email,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name
                  })
                }
                navigation.navigate('Dashboard',{
                    user: {
                        uid: result.user.uid,
                        mail: result.user.email,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name 
                    }
                })

            })
        }
    }

    const logInWithGoogle = () => {
        signInAsync();
    };

    const logIn = () => {
        firebase.auth().signInWithEmailAndPassword(email,password).then((result)=>{
            getUserInfo(result.user.uid, (user) => {
                setEmail("")
                setPassword("")
                navigation.navigate('Dashboard',{user:user})
            })
        }).catch((error) => setError(true))
    }

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => 
                navigation.navigate('Signup')
              }
            >
              <Text style={{ marginRight: 10 , color:'#fff'}}>Signup</Text>
            </TouchableOpacity>
          ),
        });
      })

    return (
        <View style={{margin:20}}>
            <View>
                <Input
                    leftIcon={<Feather name="mail" size={24} color="black" />}
                    placeholder="email@address.com"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={(val) => setEmail(val)}
                />
                <Input 
                    leftIcon={ <AntDesign name="lock" size={24} color="black" />}
                    placeholder="Password" secureTextEntry={true} 
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                />
                <Button title="Log in" containerStyle={{margin:10}}
                onPress={()=>logIn()}
                ></Button>
            </View>
            <SocialIcon
            title={"Sign In With Google"}
            button={true}
            type={"google"}
            onPress={() => logInWithGoogle()}
            />
            {error ? <Text style={{alignSelf:'center',color:'red'}}>Wrong user information</Text> : null}
        </View>
        
    )
}

export default Login