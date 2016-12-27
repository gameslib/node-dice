function ontouch(touchsurface: HTMLElement, callback: any) {

  var startX = 0
  var startY = 0
  var distX = 0
  var distY = 0
  var mouseisdown = false

  var handletouch = callback || function (touchobj: any, phase: string, distanceX: number, distanceY: number) { }

  touchsurface.addEventListener('touchstart', function (e) {
    var touchobj = e.changedTouches[0]
    startX = touchobj.pageX
    startY = touchobj.pageY
    // fire callback function with phase="start"
    handletouch(touchobj, 'start', 0, 0)
    e.preventDefault()

  }, false)

  touchsurface.addEventListener('touchmove', function (e) {
    var touchobj = e.changedTouches[0]
    distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
    distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
    // fire callback function with phase="move"
    handletouch(touchobj, 'move', distX, distX)
    e.preventDefault() // prevent scrolling when inside DIV
  }, false)

  touchsurface.addEventListener('touchend', function (e) {
    var touchobj = e.changedTouches[0]
    distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
    distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
    // fire callback function with phase="end"
    handletouch(touchobj, 'end',  distX, distY)
    e.preventDefault()
  }, false)

  touchsurface.addEventListener('mousedown', function (e) {
    startX = e.pageX
    startY = e.pageY
    // fire callback function with phase="start"
    handletouch(e, 'start', 0, 0)
    mouseisdown = true
    e.preventDefault()

  }, false)

  document.body.addEventListener('mousemove', function (e) {
    if (mouseisdown) {
      distX = e.pageX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = e.pageY - startY // get vertical dist traveled by finger while in contact with surface
      // fire callback function with phase="move"
      handletouch(e, 'move', distX, distY)
      e.preventDefault() // prevent scrolling when inside DIV
    }
  }, false)

  document.body.addEventListener('mouseup', function (e) {
    if (mouseisdown) {
      distX = e.pageX - startX // get horizontal dist traveled by finger while in contact with surface
      distY = e.pageY - startY // get vertical dist traveled by finger while in contact with surface
      // fire callback function with phase="end"
      handletouch(e, 'end', distX, distY)
      mouseisdown = false
      e.preventDefault()
    }
  }, false)
}

// USAGE:
/*
ontouch(boundElement, function(touchobj, phase, distX, distY) {
  // boundElement: the target htmlElement
	// touchobj: contains touched object
	// phase: contains "start", "move", or "end"
	// distX: distance traveled horizontally
  // distY: distance traveled vertically
})
*/