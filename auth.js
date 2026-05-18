import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// =======================
// CADASTRO
// =======================

const registerForm = document.getElementById("registerForm");

if(registerForm){

  registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("registerEmail").value;

    const password =
      document.getElementById("registerPassword").value;

    const msg =
      document.getElementById("registerMessage");

    // CAPTCHA

    const captchaResponse = grecaptcha.getResponse();

    if(!captchaResponse){

      msg.textContent =
        "Confirme que você não é um robô.";

      msg.style.color = "#ffcc00";

      return;
    }

    try{

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      msg.textContent =
        "Conta criada com sucesso.";

      msg.style.color = "#4dff88";

      grecaptcha.reset();

      setTimeout(() => {

        window.location.href = "painel.html";

      }, 1200);

    } catch(error){

      let errorText = "Erro ao criar conta.";

      if(error.code === "auth/email-already-in-use"){
        errorText = "Esse email já está em uso.";
      }

      if(error.code === "auth/weak-password"){
        errorText = "A senha precisa ter pelo menos 6 caracteres.";
      }

      if(error.code === "auth/invalid-email"){
        errorText = "Email inválido.";
      }

      msg.textContent = errorText;
      msg.style.color = "#ff6666";

      grecaptcha.reset();

    }

  });

}


// =======================
// LOGIN
// =======================

const loginForm = document.getElementById("loginForm");

if(loginForm){

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
      document.getElementById("loginEmail").value;

    const password =
      document.getElementById("loginPassword").value;

    const msg =
      document.getElementById("loginMessage");

    try{

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      msg.textContent = "Login realizado.";
      msg.style.color = "#4dff88";

      setTimeout(() => {

        window.location.href = "painel.html";

      }, 1000);

    } catch(error){

      msg.textContent =
        "Email ou senha incorretos.";

      msg.style.color = "#ff6666";

    }

  });

}


// =======================
// PAINEL
// =======================

const userEmail =
  document.getElementById("userEmail");

const logoutBtn =
  document.getElementById("logoutBtn");

if(userEmail){

  onAuthStateChanged(auth, (user) => {

    if(user){

      userEmail.innerHTML = `
        Logado como:
        <strong>${user.email}</strong>
      `;

    } else {

      window.location.href = "login.html";

    }

  });

}

if(logoutBtn){

  logoutBtn.addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "login.html";

  });

}