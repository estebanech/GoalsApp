import React, {useState, useEffect} from 'react';
import {View, StyleSheet,Modal,Dimensions} from 'react-native';
import {Text, Input, Button} from 'react-native-elements'
import firebase from 'firebase'
import DropDownPicker from 'react-native-dropdown-picker'; 
import {modifyGoal,deleteGoal} from '../helpers/firebase-goals'
import { TouchableOpacity } from "react-native-gesture-handler";


const ModifyGoal = ({route, navigation}) => {

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

    const [id,setId] = useState("")
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(()=>{
        if(route.params?.goal){
            setCurrent(route.params.goal.current)
            setExpected(route.params.goal.expected)
            setLabel(route.params.goal.label)
            setMethod(route.params.goal.method)
            setType(route.params.goal.type)
            setId(route.params.goal.id)
        }
    },[route.params?.goal])

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
                type:type,
                id:id
            }
            modifyGoal(route.params.uid,goal)
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
            <Modal
                animationType="slide"
                visible={modalVisible}
                transparent
            >
                <View style={styles.modal}>
                    <View style={styles.textModal}>
                        <Text >Do you want to delete this Goal?</Text>
                    </View>
                    
                    <View style={styles.buttonsContainer}>
                        <Button title="Yes" containerStyle={{flex:1,margin:10}}
                        onPress={()=>{
                            deleteGoal(route.params.uid,id)
                            setModalVisible(false)
                            navigation.navigate('Dashboard')
                        }}
                        ></Button>
                        <Button title="No" containerStyle={{flex:1,margin:10}}
                        onPress={()=> setModalVisible(false)}
                        ></Button>
                    </View>
                </View>
            </Modal>
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
            <Button 
            containerStyle={{marginTop:30, backgroundColor:'#ff5733'}} 
            type='clear' titleStyle={{color:'white'}} title="delete"
            onPress={()=>{setModalVisible(true)}}
            ></Button>
            
        </View>
    )
}

export default ModifyGoal

const styles = StyleSheet.create({
    main: {
        flex: 1,
        padding:20,
        paddingTop:20
    },
    modal: {
        flex: 1,
        backgroundColor: 'white',
        marginTop: ((Dimensions.get('window').height/2)/4)*3,
        marginBottom: ((Dimensions.get('window').height/2)/4)*3,
        marginLeft: ((Dimensions.get('window').width/2)/4)*1,
        marginRight: ((Dimensions.get('window').width/2)/4)*1
    },
    textModal: {
        flex:1,
        alignSelf:'center',
        justifyContent:'center'
    },
    buttonsContainer : {
        flexDirection:"row",
        flex:1
    }
})