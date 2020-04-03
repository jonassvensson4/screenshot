// Imgur client ID
const CLIENT_ID = 'changeThis';
let callbacks = {};

// Show the selection
function ShowScreenSelection() {
    SetNuiFocus(true, true)
    SendNuiMessage(JSON.stringify({ action: 'screenshot' }));
}

// Get the selection URL, used by exports
function select( cb ) {
    // Store the callback
    callbacks[Object.keys( callbacks ).length++] = cb;

    // Show the selecion
    ShowScreenSelection();
}

// Screenshot command
RegisterCommand('screenshot', () => {
    select((url) => {
        // Sends it to the chat
        emit('chat:addMessage', {
            template: '<img src="{0}">',
            args: [url]
        });
    });
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
        let id = Object.keys( callbacks )[0];

        callbacks[id](JSON.parse(response).data.link);

        delete callbacks[id];
    });
});

// NUI close
RegisterNuiCallbackType('selection:close');
on('__cfx_nui:selection:close', () => {
    // Remove NUI focus
    SetNuiFocus(false, false);
});
