async function deleteFormHandler(event) {
    event.preventDefault();
    // selects id from url
    const id = window.location.toString().split("/")[
      window.location.toString().split("/").length - 1
    ];
  
    const response = await fetch(`/api/comments/${id}`, {
      method: "DELETE",
    });
    // takes user back to previous page
    if (response.ok && history.length > 0) {
      window.location = document.referrer;
    }
    else {
      alert(response.statusText);
    }
  }
  
  document
    .querySelector(".delete-btn")
    .addEventListener("click", deleteFormHandler);