import { auth } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await sendEmailVerification(userCredential.user);

      msg.textContent = "Conta criada! Verifique seu email antes de entrar. Confira também a caixa de spam.";
      msg.style.color = "#4dff88";

      if (typeof grecaptcha !== "undefined") {
        grecaptcha.reset();
      }

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1800);

    } catch (error) {
      let errorText = "Erro ao criar conta.";

      if (error.code === "auth/email-already-in-use") {
        errorText = "Esse email já está cadastrado. Clique em Entrar.";
      }

      if (error.code === "auth/weak-password") {
        errorText = "A senha precisa ter pelo menos 6 caracteres.";
      }

      if (error.code === "auth/invalid-email") {
        errorText = "Email inválido.";
      }

      if (error.code === "auth/operation-not-allowed") {
        errorText = "Cadastro por email/senha não está ativado no Firebase.";
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        msg.textContent = "Você precisa confirmar seu email antes de entrar. Verifique sua caixa de entrada ou spam.";
        msg.style.color = "#ffcc00";
        return;
      }

      msg.textContent = "Login realizado.";
      msg.style.color = "#4dff88";

      setTimeout(() => {
        window.location.href = "painel.html";
      }, 700);

    } catch (error) {
      msg.textContent = "Email ou senha incorretos.";
      msg.style.color = "#ff6666";
    }
  });
}

if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", async () => {
    const emailInput = document.getElementById("loginEmail");
    const msg =
      document.getElementById("loginMessage") ||
      document.getElementById("loginMsg");

    const email = emailInput.value.trim();

    if (!email) {
      msg.textContent = "Digite seu email no campo acima para recuperar a senha.";
      msg.style.color = "#ffcc00";
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      msg.textContent = "Enviamos um email para redefinir sua senha. Confira a caixa de entrada ou spam.";
      msg.style.color = "#4dff88";

    } catch (error) {
      msg.textContent = "Não foi possível enviar o email de recuperação. Verifique se o email está correto.";
      msg.style.color = "#ff6666";
    }
  });
}

if (userEmail) {
  onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
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