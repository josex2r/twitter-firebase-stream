let map;
let marker;

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(0, 0),
    zoom: 1,
    minZoom: 1
  });

  initTweets();
}

function renderTweet(tweet) {
  const container = document.querySelector('#tweets');

  // Clear container
  container.innerHTML = '';

  // Remove last marker
  if (marker) {
    marker.setMap(null);
  }

  // Load in map
  marker = new google.maps.Marker({
    position: { 
      lat: tweet.lat,
      lng: tweet.lng
    },
    map,
    title: tweet.user
  });
  
  // Load in container
  const tweetContainer = document.createElement('div');
  
  tweetContainer.classList.add('card');
  tweetContainer.innerHTML = `
    <div class="card-body">
      <img class="card-img-left" src="${tweet.img}">
      <h5 class="card-title">${tweet.user}</h5>
      <p class="card-text">${tweet.text}</p>
    </div>
    `;

  container.appendChild(tweetContainer);
}

function loadHashtag(hashtag) {
  // Load tweets
  const tweetListener = firebase.database().ref(`tweets/${hashtag}`);

  tweetListener.on('value', (snapshot) => {
    console.log(snapshot.val());
    renderTweet(snapshot.val());
  });

  return tweetListener;
}

function initTweets() {
  const input = document.querySelector('input');

  // Redirect to login if user is not logged in
  firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = location.origin;
    }
  });

  // Load tweets
  let debounce;
  input.addEventListener('keyup', (event) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => loadHashtag(event.target.value), 1000);
  });
};
