import React, {useState, useEffect} from 'react';
import {View,TouchableOpacity} from 'react-native';
import {Text, Button, Input} from 'react-native-elements'
import {storeLocation} from '../helpers/firebase-goals'

const AddLocation = ({route, navigation}) => {
    const [latitude,setLatitude] = useState("")
    const [errorLatitude,setErrorLatitude] = useState(false)
    const [longitude,setLongitude] = useState("")
    const [errorLongitude,setErrorLongitude] = useState(false)
    const [title,setTitle] = useState("")
    const [errorTitle,setErrorTitle] = useState(false)

    useEffect(()=>{
        if (route.params?.location) {
            setLatitude(route.params.location.latitude)
            setLongitude(route.params.location.longitude)
        }
    },[route.params?.location])

    function updateNumericInputValue(value,setFunc,setErrorFunc) {
        if (typeof value === 'string' && ((!isNaN(value) && !isNaN(parseFloat(value))) || value === "" )){
            setFunc(value)
            setErrorFunc(false)
        } else {
            setErrorFunc(true)
        }
    }

    const saveLocation = () => {
        if(title==="" || latitude==="" || longitude === ""){
            setErrorTitle(title === "" )
            setErrorLongitude(longitude === "")
            setErrorLatitude(latitude === "")
        } else if(!errorLatitude && !errorLongitude){
            const location = {
                latitude: latitude,
                longitude: longitude,
                title: title
            }
            storeLocation(route.params.uid,location)
            navigation.navigate('LocationsToVisit',{
                id:route.params.uid
            })
        } 
    }

    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => saveLocation()}>
              <Text style={{ marginRight: 10, color:'#fff' }}>Save</Text>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => 
                navigation.navigate('LocationsToVisit',{
                    id:route.params.uid
                })
              }
            >
              <Text style={{ marginLeft: 10 , color:'#fff'}}>Cancel</Text>
            </TouchableOpacity>
          ),
        });
      })

    return (
        <View style={{marginTop:30}}>
           <Input 
            placeholder='Latitude'
            onChangeText = {(val)=>{updateNumericInputValue(val,setLatitude,setErrorLatitude)}}
            value={latitude}
            errorMessage={errorLatitude ? "Enter a valid numeric value" : ""}
            ></Input>
            <Input 
            placeholder='Longitude'
            onChangeText = {(val)=>{updateNumericInputValue(val,setLongitude,setErrorLongitude)}}
            value={longitude}
            errorMessage={errorLongitude ? "Enter a valid numeric value" : ""}
            ></Input>
            <Input 
            placeholder="Title"
            onChangeText = {(val)=>{setTitle(val)}}
            value={title}
            errorMessage={errorTitle ? "The goal must have a Title" : ""}
            ></Input> 
        </View>
        
    )
}

export default AddLocation