import { auth } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

const protectedLinks = document.querySelectorAll("[data-protected='true']");

protectedLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        window.location.href = link.getAttribute("href");
      } else {
        window.location.href = "login.html";
      }
    });
  });
});