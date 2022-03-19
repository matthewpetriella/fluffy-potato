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
        document.querySelector('#avatar_url-update').value = `https://res.cloudinary.com/djrbfeg4e/image/upload/w_90,h_90,c_thumb,r_max/${result.info.public_id}`;
      }
    }
  )

  async function updateFormHandler(event) {
  event.preventDefault();

  const username = document.querySelector('#username-update').value.trim();
  const email = document.querySelector('#email-update').value.trim();
  const password = document.querySelector('#password-update').value.trim();
  const avatar_url = document.querySelector('#avatar_url-update').value.trim();

  if (username || avatar_url || email || password) {

    // only update the fields specified by the user
    const putBody = {};
    if (username.trim()) {
      putBody.username = username.trim();
    }
    if (avatar_url.trim()) {
      putBody.avatar_url = avatar_url.trim();
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
        document.location.replace('/dashboard/');
      } else {
        alert(response.statusText);
      }
  }
}

document.querySelector('#upload-avatar').addEventListener('click', function (event) {
    event.preventDefault();
    console.log("Calling avatarUploadWidget");
    avatarUploadWidget.open();
  }, false);
  

document.querySelector('.update-form').addEventListener('submit', updateFormHandler);