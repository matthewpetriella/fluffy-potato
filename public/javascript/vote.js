async function voteHandler(event) {
  const post_id = event.target.getAttribute('data-post-id');
  const likeControlsEl = document.querySelector('#post-' + post_id + '-vote');
  const likeButton = likeControlsEl.querySelector('.vote-input.like');
  const dislikeButton = likeControlsEl.querySelector('.vote-input.dislike');

  const vote_value = event.target.value;
  const vote_checked = event.target.checked;

  const vote_body = {
    post_id
  }
  let vote_method = 'POST';
  if (vote_checked) {
    switch (vote_value) {
      case 'like':
        vote_body.like = true;
        break;
      case 'dislike':
        vote_body.like = false;
        break;
      default:
        vote_method = 'DELETE';
    }
  } else {
    vote_method = 'DELETE';
  }

  const fetchOptions = {
    method: vote_method,
    body: JSON.stringify(vote_body),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log(fetchOptions);
  const response = await fetch(`/api/posts/vote`, fetchOptions);

  if (response.ok) {
    response.json().then(voteData => {
      console.log('success: ', voteData);
      likeControlsEl.querySelector('.vote-input.like + label .like-count').textContent = voteData.likes;
      likeControlsEl.querySelector('.vote-input.dislike + label .like-count').textContent = voteData.dislikes;
      switch (voteData.vote) {
        case 'like':
          dislikeButton.checked = false;
          break;
        case 'dislike':
          likeButton.checked = false;
          break;
        default:
          dislikeButton.checked = false;
          likeButton.checked = false;
      }
    });
  } else {
    event.target.checked = !event.target.checked;
    document.location.replace('/login');
  }
}

// wait until all posts are loaded, with their vote buttons
window.onload = (event) => {
  const voteInputEls = document.querySelectorAll('.vote-input');
  voteInputEls.forEach(likeInput => {
    likeInput.addEventListener('click', voteHandler);
  });
};