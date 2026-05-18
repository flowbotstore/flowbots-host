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

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;

    const msg = document.getElementById("registerMsg");

    msg.textContent = "Criando sua conta...";
    msg.style.color = "#b8d7e6";

    try {

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await sendEmailVerification(userCredential.user);

      window.location.href = "confirmacao.html";

      registerForm.reset();

    } catch (error) {

      msg.textContent =
        "Não foi possível criar a conta. Verifique o email ou use uma senha com pelo menos 6 caracteres.";

      msg.style.color = "#ff5c5c";

    }

  });

}

if (loginForm) {

  loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    const msg = document.getElementById("loginMsg");

    msg.textContent = "Entrando...";
    msg.style.color = "#b8d7e6";

    try {

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (!userCredential.user.emailVerified) {

        msg.textContent =
          "Confirme seu email antes de entrar. Verifique sua caixa de entrada ou spam.";

        msg.style.color = "#ffcc00";

        return;
      }

      window.location.href = "painel.html";

    } catch (error) {

      msg.textContent =
        "Email ou senha inválidos. Caso não tenha conta, clique em criar conta.";

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

      if (userEmail) {

        userEmail.textContent =
          "Logado como: " + user.email;

      }

    }

  });

}