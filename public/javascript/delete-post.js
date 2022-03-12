async function deleteFormHandler(event) {
  event.preventDefault();
// selects id from url
  const id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  const response = await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  });
// returns user to the dashboard view
  if (response.ok) {
    document.location.replace("/dashboard");
  } 
  else {
    alert(response.statusText);
  }
}

document
  .querySelector(".delete-btn")
  .addEventListener("click", deleteFormHandler);