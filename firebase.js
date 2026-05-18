import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7UUUGEIUO96Lb4XagwROF5s0rybPWGVM",
  authDomain: "flowbots-host.firebaseapp.com",
  projectId: "flowbots-host",
  storageBucket: "flowbots-host.firebasestorage.app",
  messagingSenderId: "413543932038",
  appId: "1:413543932038:web:dca7479b18cd965144b107"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);