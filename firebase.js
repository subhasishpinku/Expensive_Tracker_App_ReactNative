import firebase from 'firebase/app';
import 'firebase/auth'; // Import the authentication module if you need it
import 'firebase/database'; // Import other Firebase modules as needed

const firebaseConfig = {
    apiKey: 'AIzaSyCeEQuPqMv8-rYB4D7VvymMG7SL2hXzUzA',
    authDomain: '',
    projectId: 'react-native-course-353be',
    // Add other Firebase config properties
  };

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
