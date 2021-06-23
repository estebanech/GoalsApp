import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, View, Dimensions , Modal} from 'react-native';
import {Text, Button,FAB} from 'react-native-elements';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import {setUpLocationsListener,deleteLocation} from '../helpers/firebase-goals'

const LocationsToVisit = ({route, navigation}) => {

    const [locations,setLocations] = useState([])
    const [currentLocation,setCurrentLocation] = useState({})
    const [modalVisible, setModalVisible] = useState(false);
    const [newMarker,setNewMarker] = useState(null)
    const markerRef = useRef(null);


    useEffect(()=>{
        setUpLocationsListener(route.params.uid,(items) => {
            setLocations(items)
        })
    },[])

    useEffect(()=>{
        if (newMarker) {
            markerRef.current.showCallout();
        }
    },[newMarker])
    
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"
                visible={modalVisible}
                transparent
            >
                <View style={styles.modal}>
                    <View style={styles.textModal}>
                        <Text >Do you want to delete this Location?</Text>
                    </View>
                    
                    <View style={styles.buttonsContainer}>
                        <Button title="Yes" containerStyle={{flex:1,margin:10}}
                        onPress={()=>{
                            deleteLocation(route.params.uid,currentLocation.id)
                            setModalVisible(false)
                        }}
                        ></Button>
                        <Button title="No" containerStyle={{flex:1,margin:10}}
                        onPress={()=> setModalVisible(false)}
                        ></Button>
                    </View>
                </View>
            </Modal>
            <MapView 
                style={styles.map}
                showsUserLocation={true}
                onPress={(event) => {
                    setNewMarker({
                        latitude:event.nativeEvent.coordinate.latitude.toString(),
                        longitude:event.nativeEvent.coordinate.longitude.toString(),
                        title:"Click here to add this location"
                    })
                }}
            >
                {newMarker ? 
                <Marker
                ref={markerRef}
                coordinate={{
                    longitude : parseFloat(newMarker.longitude),
                    latitude: parseFloat(newMarker.latitude)
                }}>
                    <Callout 
                        onPress={() => {
                            setNewMarker(null)
                            navigation.navigate("AddLocation",{
                                uid:route.params.uid,
                                location:{
                                    longitude:newMarker.longitude,
                                    latitude:newMarker.latitude
                                }
                            })
                        }}
                    >
                        <View>
                            <Text>{newMarker.title}</Text>
                        </View>
                    </Callout>
                </Marker> : null}
                {locations.map((location,index) => {
                    return (
                    <Marker
                        key={location.id}
                        coordinate={{
                            longitude : parseFloat(location.longitude),
                            latitude: parseFloat(location.latitude)
                        }}>
                        <Callout 
                            onPress={() => {
                                setModalVisible(true)
                                setCurrentLocation(location)
                            }}
                        >
                            <View>
                                <Text>{location.title}</Text>
                            </View>
                        </Callout>
                    </Marker>)
                })}
            </MapView>
            <FAB placement='right' color='#ee6e73' 
            icon={<Feather name="map-pin" size={24} color="white" />}
            onPress={()=> {navigation.navigate('AddLocation',{
                uid:route.params.uid
            })}}
            ></FAB>
        </View>
    );
}

export default LocationsToVisit

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
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
});