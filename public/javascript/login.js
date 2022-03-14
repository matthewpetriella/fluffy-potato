const flashMessage = function(messageEl, messageContent) {
  messageEl.innerHTML = messageContent;
  messageEl.classList.remove('hidden');
  setTimeout(function() {
    messageEl.classList.add('hidden')
    messageEl.innerHTML = '';
  }, 3000)
}

async function signupFormHandler(event) {
  event.preventDefault();
// capture user input for create
  const username = document.querySelector('#username-signup').value.trim();
  const nickname = document.querySelector('#nickname-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();

  if (username && email && password) {
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        email,
        nickname,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace(nextUrl);
    } else {
      const error = await response.json();
      const messageEl = document.querySelector('#sign-up-error');
      const messageContent = '<span style="color:red">' + error.message + '</span>';
      flashMessage(messageEl, messageContent);
    }
  }
}

async function loginFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();

  if (username && password) {
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        username,
        password
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      setTimeout(() => { document.location.replace(nextUrl); }, 1);
    } else {
      const error = await response.json();
      const messageEl = document.querySelector('#login-error');
      const messageContent = '<span style="color:red">' + error.message + '</span>';
      flashMessage(messageEl, messageContent);
    }
  }
}

let nextUrl = '/';
if (document.location.search) {
  // Parsing query string by splitting the URL
  const qsParams = document.location.search.substr(1).split('&');
  // Looping through each and every key in the parsed query string
  for (let i = 0; i < qsParams.length; i++) {
    const [name, value] = qsParams[i].split('=');
    if (name === '_next') {
      nextUrl = value;
    }
  }
}

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
document.querySelector('.signin-form').addEventListener('submit', loginFormHandler);
document.querySelector('#sign-up-switch').addEventListener('click', function (event) {
  event.preventDefault();
  document.querySelector('.sign-in').classList.add('hidden');
  document.querySelector('.sign-up').classList.remove('hidden');
});
document.querySelector('#sign-in-switch').addEventListener('click', function (event) {
  event.preventDefault();
  document.querySelector('.sign-up').classList.add('hidden');
  document.querySelector('.sign-in').classList.remove('hidden');
});