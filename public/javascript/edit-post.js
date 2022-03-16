var imageUploadWidget = cloudinary.createUploadWidget(
  {
    cloud_name: 'djrbfeg4e',
    upload_preset: 'j2vg8six',
    sources: ['local', 'url']
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
      // document.querySelector('input[name="image-url"]').value = result.info.secure_url;
      document.querySelector('input[name="image-url"]').value = `https://res.cloudinary.com/djrbfeg4e/image/upload/w_300,c_pad,r_20/${result.info.public_id}`;
    }
  }
)



async function editFormHandler(event) {
  event.preventDefault();
  // title and text pulled from form
  // id pulled from url
  const title = document.querySelector('input[name="post-title"]').value.trim();
  const description = document.querySelector('input[name="post-text"]').value.trim();
  const image_url = document.querySelector('input[name="image-url"]').value;

  const id = window.location.toString().split('/')[
    window.location.toString().split('/').length - 1
  ];
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      title,
      description,
      image_url
    },
    ),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  // returns user to the dashboard
  if (response.ok) {
    document.location.replace('/dashboard/');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('#upload-image').addEventListener('click', function (event) {
  event.preventDefault();
  imageUploadWidget.open();
}, false);


document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);