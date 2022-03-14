const SESSION_INACTIVITY_TIMEOUT_MINUTES = 180;

async function logout(event) {
  if (event) {
    event.preventDefault();
  }

  const response = await fetch('/api/users/logout', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' }
  });
  // setTimeout used to resolve bug with cookie clash
  if (response.ok) {
    if (document.location.pathname.indexOf('/post') === 0) {
      setTimeout(() => { document.location.reload(); }, 1);
    } else {
      setTimeout(() => { document.location.replace('/'); }, 1);
    }
  } else {
    alert(response.statusText);
  }
}

// timeout on inactivity
let inactivityTimer;
const resetSessionTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(logout, SESSION_INACTIVITY_TIMEOUT_MINUTES * 60 * 1000);
}
resetSessionTimer();

// listen for common user interaction events to reset the session timer
document.addEventListener('click', resetSessionTimer);
document.addEventListener('touch', resetSessionTimer);
document.addEventListener('scroll', resetSessionTimer);
document.addEventListener('keydown', resetSessionTimer);

document.querySelector('#logout').addEventListener('click', logout);
