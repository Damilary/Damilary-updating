const form = document.querySelector('form');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');
const submitBtn = document.querySelector('#submit');

if (form && usernameInput && passwordInput) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if(username === '') {
      showError(usernameInput, 'Username is required!');
    } else if(username.length < 3) {
      showError(usernameInput, 'Username must be at least 3 characters long!');
    } else {
      showSuccess(usernameInput);
    }

    if(password === '') {
      showError(passwordInput, 'Password is required!');
    } else if(password.length < 8) {
      showError(passwordInput, 'Password must be at least 8 characters long!');
    } else {
      showSuccess(passwordInput);
    }

  });
}

function showError(input, message) {
  if (!input) return;
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  formGroup.classList.add('error');
  formGroup.classList.remove('success');
  const errorMessage = formGroup.querySelector('small');
  if (errorMessage) {
    errorMessage.innerText = message;
  }
}

function showSuccess(input) {
  if (!input) return;
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  formGroup.classList.add('success');
  formGroup.classList.remove('error');
  const errorMessage = formGroup.querySelector('small');
  if (errorMessage) {
    errorMessage.innerText = '';
  }
}
