
async function updateFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-update').value.trim();
  const nickname = document.querySelector('#nickname-update').value.trim();
  const email = document.querySelector('#email-update').value.trim();
  const password = document.querySelector('#password-update').value.trim();

  if (username || nickname || email || password) {

    // only update the fields specified by the user
    const putBody = {};
    if (username.trim()) {
      putBody.username = username.trim();
    }
    if (nickname.trim()) {
      putBody.nickname = nickname.trim();
    }
    if (email.trim()) {
      putBody.email = email.trim();
    }
    if (password.trim()) {
      putBody.password = password.trim();
    }

    const response = await fetch('/api/users', {
      method: 'put',
      body: JSON.stringify(putBody),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      const messageEl = document.querySelector('#update-message');
      const messageContent = '<span style="color:green">Account Updated</span>';
      flashMessage(messageEl, messageContent);
    } else {
      const error = await response.json();
      const messageEl = document.querySelector('#update-message');
      flashMessage(messageEl, '<span style="color:red">' + error.message + '</span>');
    }
  }
}

document.querySelector('.update-form').addEventListener('submit', updateFormHandler);