import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Input} from 'react-native-elements'
import firebase from 'firebase'
import {initDb} from '../helpers/firebase-goals';
import DropDownPicker from 'react-native-dropdown-picker'; 
import {storeGoal} from '../helpers/firebase-goals'
import { v4 as uuidv4 } from 'uuid';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native-gesture-handler";


const CreateGoal = ({route, navigation}) => {

    const [current,setCurrent] = useState("")
    const [errorCurrent,setErrorCurrent] = useState(false)
    const [expected,setExpected] = useState("")
    const [errorExpected,setErrorExpected] = useState(false)
    const [label,setLabel] = useState("")
    const [errorLabel,setErrorLabel] = useState(false)

    const [openMethod, setOpenMethod] = useState(false);
    const [method, setMethod] = useState('augment');
    const [itemsMethod, setItemsMethod] = useState([
        {label: 'Augment', value: 'augment'},
        {label: 'Reduce', value: 'reduce'}
    ]);

    const [openType, setOpenType] = useState(false);
    const [type, setType] = useState('health');
    const [itemsType, setItemsType] = useState([
        {label: 'Health', value: 'health'},
        {label: 'Income', value: 'income'},
        {label: 'Time', value: 'time'},
        {label: 'Other', value: 'Other'}
    ]);

    function updateNumericInputValue(value,setFunc,setErrorFunc) {
        if (typeof value === 'string' && ((!isNaN(value) && !isNaN(parseFloat(value))) || value === "" )){
            setFunc(value)
            setErrorFunc(false)
        } else {
            setErrorFunc(true)
        }
    }

    const saveGoal = () => {
        if (label === "" || current === "" || expected === "") {
          setErrorLabel(label === "")
          setErrorCurrent(current === "" )
          setErrorExpected(expected === "")
        } else {
            const goal = {
                current:current,
                expected:expected,
                label:label,
                method:method,
                type:type
            }
            storeGoal(route.params.uid,goal)
            navigation.navigate('Dashboard') 
        }
        
    }


    useEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              onPress={() => saveGoal()}>
              <Text style={{ marginRight: 10, color:'#fff' }}>Save</Text>
            </TouchableOpacity>
          ),
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => 
                navigation.navigate('Dashboard')
              }
            >
              <Text style={{ marginLeft: 10 , color:'#fff'}}>Cancel</Text>
            </TouchableOpacity>
          ),
        });
      })

    return (
        <View style={[styles.main,{margin: 20}]}>
            <View>
                <Input 
                placeholder='Current value'
                onChangeText = {(val)=>{updateNumericInputValue(val,setCurrent,setErrorCurrent)}}
                value={current}
                errorMessage={errorCurrent ? "Enter a valid numeric value" : ""}
                ></Input>
                <Input 
                placeholder='Expected value'
                onChangeText = {(val)=>{updateNumericInputValue(val,setExpected,setErrorExpected)}}
                value={expected}
                errorMessage={errorExpected ? "Enter a valid numeric value" : ""}
                ></Input>
                <Input 
                placeholder="Label"
                onChangeText = {(val)=>{setLabel(val)}}
                value={label}
                errorMessage={errorLabel ? "The goal must have a label" : ""}
                ></Input>
            </View>
            <View>
                <Text>Measure</Text>
                <DropDownPicker
                    open={openMethod}
                    value={method}
                    items={itemsMethod}
                    setOpen={setOpenMethod}
                    setValue={setMethod}
                    setItems={setItemsMethod}
                    zIndex={20}
                    modalContentContainerStyle={{
                        backgroundColor: "#fff"
                      }}
                />
            </View>
            <View>
              <Text style={{marginTop:20}}>Type</Text>
                <DropDownPicker
                    open={openType}
                    value={type}
                    items={itemsType}
                    setOpen={setOpenType}
                    setValue={setType}
                    setItems={setItemsType}
                    zIndex={10}
                    modalContentContainerStyle={{
                        backgroundColor: "#fff"
                      }}
                />   
            </View>
            
        </View>
    )
}

export default CreateGoal

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding:20,
        paddingTop:20
    }
})