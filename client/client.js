// Imgur client ID
const CLIENT_ID = 'changeThis';

// Show the selection
function screenSelection() {
    SetNuiFocus(true, true)
    SendNuiMessage(JSON.stringify({ action: 'screenshot' }));
}

// Screenshot event
onNet('jsfour-screenshot', () => {
    screenSelection();
});

// Screenshot command
RegisterCommand('screenshot', () => {
    emit('jsfour-screenshot');
});

// Remove NUI focus incase of a restart
setImmediate(() => {
    SetNuiFocus(false, false);
});

// NUI callback
RegisterNuiCallbackType('selection:callback');
on('__cfx_nui:selection:callback', ( data, cb ) => {
    // Remove NUI focus
    SetNuiFocus(false, false);

    // Send a callback to the index.js to let it remove the selection
    cb(true);

    // Take a screenshot using my modified version of screenshot-basic
    exports['screenshot-basic'].requestScreenshotUpload(`https://api.imgur.com/3/upload`, 'imgur', {
        headers: {
            'authorization': `Client-ID ${ CLIENT_ID }`,
            'content-type': 'multipart/form-data'
        },
        crop: {
            offsetX: data.offsetX,
            offsetY: data.offsetY,
            width: data.width,
            height: data.height
        }
    }, ( response ) => {
        // Do something with the url..
        let url = JSON.parse(response).data.link;

        // Sends it to the chat
        emit('chat:addMessage', {
            template: '<img src="{0}">',
            args: [url]
        });
    });
});

// NUI close
RegisterNuiCallbackType('selection:close');
on('__cfx_nui:selection:close', () => {
    // Remove NUI focus
    SetNuiFocus(false, false);
});

setTick(() => {
    if ( IsControlJustReleased(0, 212) ) {
        screenSelection();
    }
});