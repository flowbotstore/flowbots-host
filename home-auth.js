import { auth } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const authArea = document.getElementById("authArea");

onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    authArea.innerHTML = `
      <div class="logged-box">
        <span>Logado como:</span>
        <strong>${user.email}</strong>
      </div>

      <a class="login-btn" href="painel.html">Painel</a>
      <button class="btn" id="homeLogoutBtn">Sair</button>
    `;

    document.getElementById("homeLogoutBtn").addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "index.html";
    });
  } else {
    authArea.innerHTML = `
      <a class="login-btn" href="login.html">Entrar</a>
      <a class="btn" href="cadastro.html">Registrar</a>
    `;
  }
});