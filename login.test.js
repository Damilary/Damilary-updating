describe('Login Form Validation', () => {
  let form;
  let usernameInput;
  let passwordInput;

  beforeEach(() => {
    // Set up the DOM document
    document.body.innerHTML = `
      <form>
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" />
          <small></small>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" />
          <small></small>
        </div>
        <button id="submit" type="submit">Submit</button>
      </form>
    `;

    // Load the script
    // Note: since login.js doesn't export anything and runs immediately,
    // we need to require it after the DOM is set up.
    // Also we need to clear the module cache to ensure the script runs again.
    jest.resetModules();
    require('./login.js');

    form = document.querySelector('form');
    usernameInput = document.querySelector('#username');
    passwordInput = document.querySelector('#password');
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('shows error when username is empty', () => {
    usernameInput.value = '';
    passwordInput.value = 'validpassword';

    // Dispatch submit event
    form.dispatchEvent(new Event('submit'));

    const usernameGroup = usernameInput.parentElement;
    expect(usernameGroup.className).toBe('form-group error');
    expect(usernameGroup.querySelector('small').innerText).toBe('Username is required!');
  });

  test('shows error when username is less than 3 characters', () => {
    usernameInput.value = 'ab';
    passwordInput.value = 'validpassword';

    form.dispatchEvent(new Event('submit'));

    const usernameGroup = usernameInput.parentElement;
    expect(usernameGroup.className).toBe('form-group error');
    expect(usernameGroup.querySelector('small').innerText).toBe('Username must be at least 3 characters long!');
  });

  test('shows success when username is valid', () => {
    usernameInput.value = 'validuser';
    passwordInput.value = 'validpassword';

    form.dispatchEvent(new Event('submit'));

    const usernameGroup = usernameInput.parentElement;
    expect(usernameGroup.className).toBe('form-group success');
  });

  test('shows error when password is empty', () => {
    usernameInput.value = 'validuser';
    passwordInput.value = '';

    form.dispatchEvent(new Event('submit'));

    const passwordGroup = passwordInput.parentElement;
    expect(passwordGroup.className).toBe('form-group error');
    expect(passwordGroup.querySelector('small').innerText).toBe('Password is required!');
  });

  test('shows error when password is less than 8 characters', () => {
    usernameInput.value = 'validuser';
    passwordInput.value = 'short';

    form.dispatchEvent(new Event('submit'));

    const passwordGroup = passwordInput.parentElement;
    expect(passwordGroup.className).toBe('form-group error');
    expect(passwordGroup.querySelector('small').innerText).toBe('Password must be at least 8 characters long!');
  });

  test('shows success when password is valid', () => {
    usernameInput.value = 'validuser';
    passwordInput.value = 'validpassword';

    form.dispatchEvent(new Event('submit'));

    const passwordGroup = passwordInput.parentElement;
    expect(passwordGroup.className).toBe('form-group success');
  });
});
