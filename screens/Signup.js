import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Button, SocialIcon,Input} from 'react-native-elements'
import firebase from 'firebase'
import * as Google from 'expo-google-app-auth';
import auth from '@react-native-firebase/auth';
import {initDb} from '../helpers/firebase-goals';
import { AntDesign } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons'; 


const Signup = ({route, navigation}) => {

    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [first_name,setFirstName] = useState("")
    const [last_name,setLastName] = useState("")
    const [error,setError] = useState(false)

    const signUp = () => {
        firebase.auth(),
        firebase.auth().createUserWithEmailAndPassword(email,password).then((result)=>{
            if (result.additionalUserInfo.isNewUser) {
                setError(false)
                firebase
                .database()
                .ref('/users/' + result.user.uid)
                .set({
                    mail: email,
                    first_name: first_name,
                    last_name: last_name
                })
                navigation.navigate('Dashboard',{
                user: {
                    uid: result.user.uid,
                    mail: email,
                    first_name: first_name,
                    last_name: last_name
                }
                })
            } else {
                setError(true)
            }  
        }).catch((error) => setError(true))
    }

    return (
        <View style={{margin:20}}>
            <View>
                <Input
                    leftIcon={<Feather name="mail" size={24} color="black" />}
                    placeholder="email@address.com"
                    value={email}
                    keyboardType="email-address"
                    onChangeText={(val) => setEmail(val)}
                />
                <Input
                    leftIcon={<Feather name="user" size={24} color="black" />}
                    placeholder="First name"
                    value={first_name}
                    onChangeText={(val) => setFirstName(val)}
                />
                <Input
                    leftIcon={<Feather name="user" size={24} color="black" />}
                    placeholder="Last name"
                    value={last_name}
                    onChangeText={(val) => setLastName(val)}
                />
                <Input 
                    leftIcon={ <AntDesign name="lock" size={24} color="black" />}
                    placeholder="Password" secureTextEntry={true} 
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                />
                <Button title="Sign up" containerStyle={{margin:10}} 
                onPress={()=>{signUp()}}></Button>
                {error ? <Text style={{alignSelf:'center',color:'red'}}>User already exist</Text> : null}
            </View>
        </View>
        
    )
}

export default Signup