// Keep navigation and content usable without JavaScript.
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
