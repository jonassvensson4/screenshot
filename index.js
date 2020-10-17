let selection = {
    width: 0,
    height: 0,
    offsetY: 0,
    offsetX: 0,
    start: {
        x: 0,
        y: 0
    },
    inverted: {
        x: false,
        y: false
    },
    override: false
}

window.addEventListener('message', function( event ) {
    if ( typeof event.data.pos === 'object' ) {
        selection.override = event.data.pos;

        $('body').append('<div class="selection"></div>');

        if ( selection.override.width && selection.override.height ) {
            $('.selection').css({
                width: selection.override.width,
                height: selection.override.height
            });
        } else {
            console.error(`\nERROR: You need to specify the width AND the height`);
            console.log(`You set: ${ JSON.stringify(selection.override) }`);
        } 
    }
});

$(document)
    .mousedown(function( event ) {
        if ( !selection.override ) {
            $('.selection').remove();

            setTimeout(() => {
                $('body').append('<div class="selection"></div>');
            }, 10);
        }

        setTimeout(() => {
            selection.start = {
                x: event.pageX,
                y: event.pageY
            }

            $('.selection').css({
                top: selection.start.y,
                left: selection.start.x
            });
        }, 10);
    })
    .mouseup(() => {
        fetch('http://screenshot/selection:callback', {
            method: 'POST',
            body: JSON.stringify({
                offsetY: parseInt($('.selection').css('top')),
                offsetX: parseInt($('.selection').css('left')),
                width: parseInt($('.selection').width()) + 5,
                height: parseInt($('.selection').height())
            })
        })
        .then(() => {
            $('.selection').remove();
            selection.override = false;
        });
    })
    .mousemove( function ( event ) {
        let element = $('.selection');

        let mouseX = event.pageX;
        let mouseY = event.pageY;

        if ( !selection.override ) {
            element.css({
                width: mouseX - selection.start.x,
                height: mouseY - selection.start.y
            });
            
            if ( mouseX < selection.start.x ) {
                selection.inverted.x = true;
    
                element.css({
                    left: '',
                    right: element.css('right'),
                    width: Math.abs(mouseX - selection.start.x),
                    height: Math.abs(mouseY - selection.start.y)
                });
            } else {
                if ( selection.inverted.x ) {
                    selection.inverted.x = false;
    
                    element.css({
                        left: element.css('left'),
                        right: ''
                    });
                }
            }
    
            if ( mouseY < selection.start.y ) {
                selection.inverted.y = true;
    
                element.css({
                    top: '',
                    height: Math.abs(mouseY - selection.start.y),
                    bottom: element.css('bottom'),
                });
            } else {
                if ( selection.inverted.y ) {
                    selection.inverted.y = false;
    
                    element.css({
                        top: element.css('top'),
                        bottom: '',
                    });
                }
            }
            
            // Snap to top edge
            if ( mouseY < 10 ) {
                element.css({
                    height: '100%'
                });
            }

            // Snap to right edge
            if ( mouseX + 10 >= $(document).width() ) {
                element.css({
                    width: '100%'
                });
            }

            // Snap to left edge
            if ( mouseX < 10 ) {
                element.css({
                    width: '100%'
                });
            }

            // Snap to bottom edge
            if ( mouseY + 10 >= $(document).height() ) {
                element.css({
                    height: '100%'
                });
            }
        } else {
            $('.selection').css({
                top: mouseY,
                left: mouseX
            });

            // Snap to right edge
            if ( mouseX + parseInt($('.selection').width()) + 10 >= $(document).width() ) {
                element.css({
                    left: '',
                    right: 0
                });
            }

            // Snap to bottom edge
            if ( mouseY + parseInt($('.selection').height()) + 10 >= $(document).height() ) {
                element.css({
                    top: '',
                    bottom: 0
                });
            }
        }
    })
    .keyup(event => {
        switch( event.keyCode ) {
            case 8:
            case 27:
                fetch('http://screenshot/selection:close');
                selection.override = false;
                break;
        }
    });