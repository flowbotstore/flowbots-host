import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const msg = document.getElementById("registerMsg");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(userCredential.user);

      msg.textContent = "Conta criada! Verifique seu email.";
      msg.style.color = "#7bff42";

    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "#ff5c5c";
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const msg = document.getElementById("loginMsg");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        msg.textContent = "Verifique seu email antes de entrar.";
        msg.style.color = "#ffcc00";
        return;
      }

      window.location.href = "painel.html";

    } catch (error) {
      msg.textContent = "Email ou senha inválidos.";
      msg.style.color = "#ff5c5c";
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}

if (window.location.pathname.includes("painel.html")) {

  onAuthStateChanged(auth, (user) => {

    if (!user || !user.emailVerified) {
      window.location.href = "login.html";
    } else {
      userEmail.textContent = "Logado como: " + user.email;
    }

  });

}