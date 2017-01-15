function ontouch(touchsurface, callback) {
    var startX = 0;
    var startY = 0;
    var distX = 0;
    var distY = 0;
    var mouseisdown = false;
    var handletouch = callback || function (touchobj, phase, distanceX, distanceY) { };
    touchsurface.addEventListener('touchstart', function (e) {
        var touchobj = e.changedTouches[0];
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        handletouch(touchobj, 'start', 0, 0);
        e.preventDefault();
    }, false);
    touchsurface.addEventListener('touchmove', function (e) {
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        handletouch(touchobj, 'move', distX, distX);
        e.preventDefault();
    }, false);
    touchsurface.addEventListener('touchend', function (e) {
        var touchobj = e.changedTouches[0];
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        handletouch(touchobj, 'end', distX, distY);
        e.preventDefault();
    }, false);
    touchsurface.addEventListener('mousedown', function (e) {
        startX = e.pageX;
        startY = e.pageY;
        handletouch(e, 'start', 0, 0);
        mouseisdown = true;
        e.preventDefault();
    }, false);
    document.body.addEventListener('mousemove', function (e) {
        if (mouseisdown) {
            distX = e.pageX - startX;
            distY = e.pageY - startY;
            handletouch(e, 'move', distX, distY);
            e.preventDefault();
        }
    }, false);
    document.body.addEventListener('mouseup', function (e) {
        if (mouseisdown) {
            distX = e.pageX - startX;
            distY = e.pageY - startY;
            handletouch(e, 'end', distX, distY);
            mouseisdown = false;
            e.preventDefault();
        }
    }, false);
}
