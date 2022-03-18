var imageUploadWidget = cloudinary.createUploadWidget(
  {
    cloud_name: 'djrbfeg4e',
    upload_preset: 'j2vg8six',
    sources: ['local', 'url']
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
      // provides styling to image before rendered
      document.querySelector('input[name="image-url"]').value = `https://res.cloudinary.com/djrbfeg4e/image/upload/w_300,c_pad,r_20/${result.info.public_id}`;
    }
  }
)


async function newFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="post-title"]').value;
  const description = document.querySelector('input[name="description"]').value;
  const image_url = document.querySelector('input[name="image-url"]').value;

  const response = await fetch(`/api/posts`, {
    method: 'POST',
    body: JSON.stringify({
      title,
      description,
      image_url
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
}
// activates the image widget

document.querySelector('#upload-image').addEventListener('click', function (event) {
  event.preventDefault();
  imageUploadWidget.open();
}, false);

document.querySelector('.new-post-form').addEventListener('submit', newFormHandler);