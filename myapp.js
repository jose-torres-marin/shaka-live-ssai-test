// myapp.js

async function init() {
  // When using the UI, the player is made automatically by the UI object.
  const video = document.getElementById('video');
  const ui = video['ui'];
  const controls = ui.getControls();
  const player = controls.getPlayer();

  // Attach player and UI to the window to make it easy to access in the JS console.
  window.player = player;
  window.ui = ui;

  // Listen for error events.
  player.addEventListener('error', onPlayerErrorEvent);
  controls.addEventListener('error', onUIErrorEvent);

  // Try to load a manifest.
  // This is an asynchronous process.
  let url;
  try {
    // This runs if the asynchronous load is successful.
    const adManager = initializeContainer(player);
    url = await requestStream(adManager);
  } catch (error) {
    onPlayerError(error);
  }
  if(url) player.load(uri);
  else console.log('-- no url to load');
}

function initializeContainer(player) {
  console.log('-- server side init');
  const adManager = player.getAdManager();
  const video = document.getElementById('video');
  const container = video.ui.getControls().getServerSideAdContainer();
  adManager.initServerSide(container, video);
  return adManager;
}

async function requestStream(adManager) {
  console.log('-- request stream');
  const streamRequest = new google.ima.dai.api.LiveStreamRequest();
  streamRequest.assetKey = '286166234322-europe-west1-gbnews-3-v7';
  try {
    const uri = await adManager.requestServerSideStream(streamRequest);
    console.log(uri);
    return uri;
  }
  catch(e) {
    onPlayerError(e);
  }
}

function onPlayerError(error) {
  console.error(error);
}

function onPlayerErrorEvent(event) {
  onPlayerError(event);
}

function onUIErrorEvent(event) {
  onPlayerError(event);
}

function initFailed(event) {
  console.error('-- Unable to load the UI library!', event);
}

// Listen to the custom shaka-ui-loaded event, to wait until the UI is loaded.
document.addEventListener('shaka-ui-loaded', init);
// Listen to the custom shaka-ui-load-failed event, in case Shaka Player fails
// to load (e.g. due to lack of browser support).
document.addEventListener('shaka-ui-load-failed', initFailed);
