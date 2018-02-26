document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.querySelector('#login');
  const card = document.querySelector('.card');

  loginButton.addEventListener('click', () => {
    let alert;
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
      window.location.href = window.location.href + 'map';
    }).catch((error) => {
      if (alert) {
        alert.remove();
      }
      alert = document.createElement('div');

      alert.classList.add('alert', 'alert-danger');
      alert.role = 'alert';
      alert.innerHTML = error.message;
      card.appendChild(alert);
    });
  });
});
