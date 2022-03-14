const post_id = document.querySelector('input[name="id"]').value;
const tagIdsInputEl = document.querySelector('input[name="tag-ids"]');
const tagInputEls = document.querySelectorAll('.tag-input');
const tagsSelected = [];
// upload widget for cloudinary
var imageUploadWidget = cloudinary.createUploadWidget(
  {
    // should be in .env but will be changed after presentation
    // your cloudinary credentials can be used instead
    cloud_name: 'djrbfeg4e',
    upload_preset: 'j2vg8six',
    sources: ['local', 'url', 'camera']
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      console.log('Done! Here is the image info: ', result.info);
      document.querySelector('input[name="image-url"]').value = result.info.secure_url;
    }
  }
)

async function editFormHandler(event) {
  event.preventDefault();

  const title = document.querySelector('input[name="title"]').value;
  const description = document.querySelector('textarea[name="description"]').value;
  const image_url = document.querySelector('input[name="image-url"]').value;
  const tags = document.querySelector('input[name="tag-ids"]').value;

  const response = await fetch(`/api/posts${post_id ? '/' + post_id : ''}`, {
    method: (post_id ? 'PUT' : 'POST'),
    body: JSON.stringify({
      id: post_id,
      title,
      description,
      image_url,
      tags
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

const updateTagIdsInput = function (tag_id, checked) {
  if (checked) {
    tagsSelected.push(tag_id);
  } else {
    if (tagsSelected.indexOf(tag_id) > -1) {
      tagsSelected.splice(tagsSelected.indexOf(tag_id), 1);
    }
  }
  tagIdsInputEl.value = tagsSelected.join(',');
};
// all tag info is being left but not utilized.  This will be used in future development
async function tagHandler(event) {
  const tag_id = event.target.value;
  const tag_state = event.target.checked;

  updateTagIdsInput(tag_id, tag_state);
}

for (let i = 0; i < tagInputEls.length; i++) {
  tagInputEls[i].addEventListener('change', tagHandler);
  updateTagIdsInput(tagInputEls[i].value, tagInputEls[i].checked);
}
document.querySelector('#upload-image').addEventListener('click', function (event) {
  event.preventDefault();
  imageUploadWidget.open();
}, false);
document.querySelector('#edit-form').addEventListener('submit', editFormHandler);