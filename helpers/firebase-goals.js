import * as firebase from 'firebase'
import 'firebase/database'
import {firebaseConfig} from './firebase-credentials'

export function initDb() {
  firebase.initializeApp(firebaseConfig);
}

export function getUserInfo(uid,updateFunc) {
  firebase.database().ref(`users/${uid}`).get().then(
    (result) => updateFunc({
      uid:uid,
      first_name: result.first_name,
      last_name: result.last_name,
      mail: result.mail
    })
  )
}

export function storeGoal(uid,item) {
  firebase.database().ref(`goals/${uid}/`).push(item);
}

export function modifyGoal(uid,item) {
  firebase.database().ref(`goals/${uid}/${item.id}/`).update({
    current:item.current,
    expected:item.expected,
    label:item.label,
    method:item.method,
    type:item.type
  });
}

export function deleteGoal(uid,goalId) {
  firebase.database().ref(`goals/${uid}/${goalId}`).remove();
}

export function setUpGoalsListener(uid,updateFunc) {
  firebase
    .database()
    .ref(`goals/${uid}/`)
    .on('value', (snapshot) => {
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          newArr.push({ ...fbObject[key], id: key});
        });
        updateFunc(newArr.reverse());
      } else {
        updateFunc([]);
      }
    });
}

export function storeLocation(uid,item) {
  firebase.database().ref(`locations/${uid}/`).push(item);
}

export function deleteLocation(uid,locaitonId) {
  firebase.database().ref(`locations/${uid}/${locaitonId}`).remove();
}

export function setUpLocationsListener(uid,updateFunc) {
  firebase
    .database()
    .ref(`locations/${uid}/`)
    .on('value', (snapshot) => {
      if (snapshot?.val()) {
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          newArr.push({ ...fbObject[key], id: key});
        });
        updateFunc(newArr.reverse());
      } else {
        updateFunc([]);
      }
    });
}