const buttons = document.querySelectorAll(".card button");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    alert("Chame a FlowBots no Discord para contratar este plano.");
  });
});