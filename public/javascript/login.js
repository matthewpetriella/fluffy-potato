var avatarUploadWidget = cloudinary.createUploadWidget(
  {
    cloud_name: 'djrbfeg4e',
    upload_preset: 'j2vg8six',
    sources: ['local', 'url']
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
      // provides styling to image before rendered
      document.querySelector('input[name="avatar-url"]').value = `https://res.cloudinary.com/djrbfeg4e/image/upload/w_90,h_90,c_thumb,r_max/${result.info.public_id}`;
    }
  }
)




async function loginFormHandler(event) {
  event.preventDefault();

  const email = document.querySelector('#email-login').value.trim();
  const password = document.querySelector('#password-login').value.trim();


  if (email && password) {
    const response = await fetch('/api/users/login', {
      method: 'post',
      body: JSON.stringify({
        email,
        password

      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
  }
}

async function signupFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-signup').value.trim();
  const email = document.querySelector('#email-signup').value.trim();
  const password = document.querySelector('#password-signup').value.trim();
  const avatar_url = document.querySelector('input[name="avatar-url"]').value;

  if (username && email && password) {
    const response = await fetch('/api/users', {
      method: 'post',
      body: JSON.stringify({
        username,
        email,
        password,
        avatar_url
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
      document.location.replace('/dashboard/');
    } else {
      alert(response.statusText);
    }
  }
}
// activates the image widget
document.querySelector('#upload-avatar').addEventListener('click', function (event) {
  event.preventDefault();
  console.log("Calling avatarUploadWidget");
  avatarUploadWidget.open();
}, false);


document.querySelector('.login-form').addEventListener('submit', loginFormHandler);

document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);
