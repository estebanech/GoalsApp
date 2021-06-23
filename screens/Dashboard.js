import React, {useState, useEffect} from 'react';
import {View, FlatList, TouchableOpacity,StyleSheet} from 'react-native';
import {Text, Button,FAB} from 'react-native-elements'
import firebase from 'firebase'
import {initDb,setUpGoalsListener} from '../helpers/firebase-goals';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const Dashboard = ({route, navigation}) => {

    const [user,setUser] = useState({uid:'',gmail:'',first_name:'',last_name:''})
    const [goals,setGoals] = useState([])
    const [completed_goals,setCompletedGoals] = useState([])
    const [unfinished_goals,setUnfinishedGoals] = useState([])
    const [renderGoals,setRenderGoalas] = useState("unfinished")

    useEffect(()=>{
        setUpGoalsListener(route.params.user.uid,(items) => {
            setGoals(items)
        })
    },[])

    useEffect(()=>{
        const completed = goals.filter((goal) => goalAcomplish(goal))
        const unfinished = goals.filter((goal) => !goalAcomplish(goal))
        setCompletedGoals(completed)
        setUnfinishedGoals(unfinished)
    },[goals])

    const goalAcomplish = (goal) => {
        if(goal.method === "augment"){
            return parseFloat(goal.current) > parseFloat(goal.expected)
        }
        else {
            return parseFloat(goal.current) < parseFloat(goal.expected)
        }
    }

    useEffect(()=>{
        if(route.params?.user){
            setUser(route.params.user)
        }
    }, [route.params?.user])

    const renderGoal = ({ index, item }) => {
        return(
            <TouchableOpacity onPress={() => {
                navigation.navigate('ModifyGoal',{goal: item,uid:user.uid})
            }}>
                <View style={styles.goal_card}>
                        <Text style={{flex:2,textAlignVertical:'center',fontSize:30}}>{item.label}</Text>
                        <View style={{flex:1,flexDirection:"column"}}>
                            <Text > Current: {item.current}</Text>
                            <Text> Expected: {item.expected}</Text>
                        </View>
                   </View> 
            </TouchableOpacity>
            
            
        )
    }

    useEffect(() => {
        navigation.setOptions({
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                  firebase.auth().signOut().then(
                      () =>{navigation.navigate('Login')}
                  )
              }}
            >
              <Text style={{ marginLeft: 10 , color:'#fff'}}>Log out</Text>
            </TouchableOpacity>
          ),
        });
      })

    return (
        <View style={{height:'100%',}}>
            <View style={{flexDirection:'row', marginTop:20}}>
                <TouchableOpacity style={{flex:1}} onPress={() => {
                    setRenderGoalas("unfinished")
                }}>
                    <Text style={{alignSelf:'center',fontSize:25,
                    color: renderGoals === "unfinished" ? 'blue' : 'black'
                    }}>Unfinished</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{flex:1}} onPress={() => {
                    setRenderGoalas("completed")
                }}>
                    <Text style={{alignSelf:'center', fontSize:25,
                    color: renderGoals === "completed" ? 'blue' : 'black'
                    }}>Completed</Text>
                </TouchableOpacity>
            </View>
            <View style={{margin:20}}>
               <FlatList
                    keyExtractor={(item) => item.id}
                    data={renderGoals === "completed" ? completed_goals : unfinished_goals}
                    renderItem={renderGoal}
                /> 
            </View>
            <FAB placement='left' color='#ee6e73' 
            icon={<Feather name="map" size={24} color="white" />}
            onPress={()=> {navigation.navigate('LocationsToVisit',{uid:user.uid})}}></FAB>
            <FAB placement='right' color='#ee6e73' 
            icon={<Entypo name="plus" size={24} color="white" />}
            onPress={()=> {navigation.navigate('CreateGoal',{uid:user.uid})}}></FAB>
        </View>
        
    )
}

export default Dashboard

const styles = StyleSheet.create({
    goal_card:{
        flex:1,
        flexDirection:"row",
        backgroundColor:"white",
        marginTop:10,
        padding:5
    }
});