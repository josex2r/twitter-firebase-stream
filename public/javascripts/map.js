let map;
let markers = [];

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(0, 0),
    zoom: 2,
    minZoom: 2,
    styles: [{featureType:"all",elementType:"all",stylers:[{visibility:"on"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"},{saturation:"-100"}]},{featureType:"all",elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#000000"},{lightness:40},{visibility:"off"}]},{featureType:"all",elementType:"labels.text.stroke",stylers:[{visibility:"off"},{color:"#000000"},{lightness:16}]},{featureType:"all",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#000000"},{lightness:17},{weight:1.2}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#000000"},{lightness:20}]},{featureType:"landscape",elementType:"geometry.fill",stylers:[{color:"#4d6059"}]},{featureType:"landscape",elementType:"geometry.stroke",stylers:[{color:"#4d6059"}]},{featureType:"landscape.natural",elementType:"geometry.fill",stylers:[{color:"#4d6059"}]},{featureType:"poi",elementType:"geometry",stylers:[{lightness:21}]},{featureType:"poi",elementType:"geometry.fill",stylers:[{color:"#4d6059"}]},{featureType:"poi",elementType:"geometry.stroke",stylers:[{color:"#4d6059"}]},{featureType:"road",elementType:"geometry",stylers:[{visibility:"on"},{color:"#7f8d89"}]},{featureType:"road",elementType:"geometry.fill",stylers:[{color:"#7f8d89"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#7f8d89"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#7f8d89"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#000000"},{lightness:18}]},{featureType:"road.arterial",elementType:"geometry.fill",stylers:[{color:"#7f8d89"}]},{featureType:"road.arterial",elementType:"geometry.stroke",stylers:[{color:"#7f8d89"}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#000000"},{lightness:16}]},{featureType:"road.local",elementType:"geometry.fill",stylers:[{color:"#7f8d89"}]},{featureType:"road.local",elementType:"geometry.stroke",stylers:[{color:"#7f8d89"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#000000"},{lightness:19}]},{featureType:"water",elementType:"all",stylers:[{color:"#2b3638"},{visibility:"on"}]},{featureType:"water",elementType:"geometry",stylers:[{color:"#2b3638"},{lightness:17}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#24282b"}]},{featureType:"water",elementType:"geometry.stroke",stylers:[{color:"#24282b"}]},{featureType:"water",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.fill",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"labels.icon",stylers:[{visibility:"off"}]}]
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
    <div>
      <img class="card-img-left" src="${tweet.img}">
      <h5 class="card-title">${tweet.user}</h5>
      <p class="card-text">${tweet.text}</p>
    </div>
    `;

  $(container).prepend(tweetContainer);
}

function loadHashtag(hashtag, socket) {
  socket.emit('hashtag', hashtag);
  // Load tweets
  const tweetRef = firebase
    .database()
    .ref(`tweets/${hashtag}`)
    .limitToLast(20);

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

  let socket = io();

  // Load tweets
  let debounce;
  let tweetRef;
  let prevHashtag;
  input.addEventListener('keyup', (event) => {
    clearTimeout(debounce);

    debounce = setTimeout(() => {
      if (prevHashtag !== event.target.value && event.target.value) {
        // Remove previous Firebase references
        if (tweetRef) {
          tweetRef.off();
        }
        // Clean map
        clean();
        // Start listening DB events
        prevHashtag = event.target.value;
        tweetRef = loadHashtag(event.target.value, socket);
      }
    }, 1000);
  });
};
