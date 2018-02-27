let map;
let markers = [];

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(0, 0),
    zoom: 1,
    minZoom: 1
  });

  initTweets();
}

function addMarker(map, tweet) {
  const marker = new google.maps.Marker({
    position: { 
      lat: tweet.lat,
      lng: tweet.lng
    },
    map,
    zIndex: 99 + markers.length,
    animation: google.maps.Animation.DROP,
    icon: tweet.img,
    title: tweet.user
  });

  markers.push(marker);
}

function clean() {
  document.querySelector('#tweets').innerHTML = '';

  markers.forEach((marker) => marker.setMap(null));
  markers = [];
}

function renderTweet(tweet) {
  const container = document.querySelector('#tweets');
  const tweetContainer = document.createElement('div');
  
  tweetContainer.classList.add('card');
  tweetContainer.innerHTML = `
    <div class="card-body">
      <img class="card-img-left" src="${tweet.img}">
      <h5 class="card-title">${tweet.user}</h5>
      <p class="card-text">${tweet.text}</p>
    </div>
    `;

  $(container).prepend(tweetContainer);
}

function loadHashtag(hashtag) {
  // We dont need to wait until service responds, just start receiving twitter events.
  fetch(`${window.location.href}?hashtag=${hashtag}`, { method: 'put'});
  // Load tweets
  const tweetRef = firebase
    .database()
    .ref(`tweets/${hashtag}`)
    .limitToLast(5);

  tweetRef.on('child_added', (snapshot) => {
    const tweet = snapshot.val();

    if (tweet) {
      // Load in container
      renderTweet(tweet);
      // Load in map
      addMarker(map, tweet);
    }
  });

  return tweetRef;
}

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = window.location.origin + '?logout=true';
  });
}

function initTweets() {
  const logout = document.querySelector('#logout');
  const input = document.querySelector('input');

  // Redirect to login if user is not logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = location.origin;
    }
  });

  logout.addEventListener('click', () => {
    firebase.auth().signOut().then(() => {
      window.location.href = window.location.origin + '?logout=true';
    });
  });

  // Load tweets
  let debounce;
  let tweetRef;
  let prevHashtag;
  input.addEventListener('keyup', (event) => {
    clearTimeout(debounce);

    debounce = setTimeout(() => {
      if (prevHashtag !== event.target.value) {
        // Remove previous Firebase references
        if (tweetRef) {
          tweetRef.off();
        }
        // Clean map
        clean();
        // Start listening DB events
        prevHashtag = event.target.value;
        tweetRef = loadHashtag(event.target.value);
      }
    }, 1000);
  });
};
