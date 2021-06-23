import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Keyboard, TouchableWithoutFeedback, LogBox  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login'
import Dashboard from './screens/Dashboard';
import CreateGoal from './screens/CreateGoal';
import ModifyGoal from './screens/ModifyGoal';
import LocationsToVisit from './screens/LoactionsToVisit';
import AddLocation from './screens/AddLocation'
import Signup from './screens/Signup';
export default function App() {
  const Stack = createStackNavigator()


  LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
  LogBox.ignoreAllLogs();//Ignore all log notifications

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerTitleAlign: 'center', headerTintColor:'#fff' ,headerStyle:{backgroundColor:'#7272c4'}}}>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="CreateGoal" component={CreateGoal} />
            <Stack.Screen name="ModifyGoal" component={ModifyGoal} />
            <Stack.Screen name="LocationsToVisit" component={LocationsToVisit} />
            <Stack.Screen name="AddLocation" component={AddLocation} />
            <Stack.Screen name="Signup" component={Signup} />
          </Stack.Navigator>
        </NavigationContainer>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
