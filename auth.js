import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value;
    const msg =
      document.getElementById("registerMessage") ||
      document.getElementById("registerMsg");

    if (typeof grecaptcha !== "undefined") {
      const captchaResponse = grecaptcha.getResponse();

      if (!captchaResponse) {
        msg.textContent = "Confirme que você não é um robô.";
        msg.style.color = "#ffcc00";
        return;
      }
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      msg.textContent = "Conta criada com sucesso.";
      msg.style.color = "#4dff88";

      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }

      setTimeout(() => {
        window.location.href = "painel.html";
      }, 1000);

    } catch (error) {
      let errorText = "Erro ao criar conta.";

      if (error.code === "auth/email-already-in-use") {
        errorText = "Esse email já está em uso.";
      }

      if (error.code === "auth/weak-password") {
        errorText = "A senha precisa ter pelo menos 6 caracteres.";
      }

      if (error.code === "auth/invalid-email") {
        errorText = "Email inválido.";
      }

      msg.textContent = errorText;
      msg.style.color = "#ff6666";

      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }
    }
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const msg =
      document.getElementById("loginMessage") ||
      document.getElementById("loginMsg");

    try {
      await signInWithEmailAndPassword(auth, email, password);

      if (msg) {
        msg.textContent = "Login realizado.";
        msg.style.color = "#4dff88";
      }

      setTimeout(() => {
        window.location.href = "painel.html";
      }, 700);

    } catch (error) {
      if (msg) {
        msg.textContent = "Email ou senha incorretos.";
        msg.style.color = "#ff6666";
      }
    }
  });
}

if (userEmail) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userEmail.innerHTML = `Logado como: <strong>${user.email}</strong>`;
    } else {
      window.location.href = "login.html";
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });
}