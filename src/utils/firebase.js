// import { initializeApp, cert, getApps } from "firebase-admin/app";
// import { getDatabase } from "firebase-admin/database";

// // Initialize Firebase only if it's not already initialized
// if (!getApps().length) {
//   const firebaseConfig = {
//     type: process.env.service_account,
//     project_id: "authentication-fde56",
//     private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
//     client_email: "firebase-adminsdk-tz8i0@authentication-fde56.iam.gserviceaccount.com",
//   };

//   initializeApp({
//     credential: cert(firebaseConfig),
//     databaseURL: "https://authentication-fde56.firebaseio.com", // Use your Firebase Database URL
//   });
// }

// const database = getDatabase();

// export { database };

// nwe code 
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyBK0ixZQiw8tGEda0t9CW14KRt1Q3yUIiA",
  authDomain: "authentication-fde56.firebaseapp.com",
  databaseURL: "https://authentication-fde56-default-rtdb.firebaseio.com",
  projectId: "authentication-fde56",
  storageBucket: "authentication-fde56.appspot.com",
  messagingSenderId: "801214843516",
  appId: "1:801214843516:web:0dc54cf413df0ea93217f9",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };