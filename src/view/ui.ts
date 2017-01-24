//todo: work on framework layout manager

class UI {
  static textColor: string
  static rollButton: Button
  static leftScoreElement: Label
  static scoreButtons: ScoreElement[]
  static clickables: UIElement[] = []
  static popup: Popup

  static names: string[][] = [
    ['Ones', ''],
    ['Twos', ''],
    ['Threes', ''],
    ['Fours', ''],
    ['Fives', ''],
    ['Sixes', ''],
    ['Three', 'O-Kind'],
    ['Four', 'O-Kind'],
    ['Small', 'Straight'],
    ['Large', 'Straight'],
    ['Full', 'House'],
    ['Five', 'O-Kind'],
    ['Chance', '']
  ]

  static initialize() {
    UI.popup = new Popup('WinnerDialog', {width:400, height: 400})
    let canvas = document.getElementById('drawing-surface') as HTMLCanvasElement
    surface = canvas.getContext('2d')
    surface.lineWidth = 1;
    UI.textColor = 'snow'
    surface.strokeStyle = 'snow';
    surface.fillStyle = 'snow'
    surface.font = "small-caps 18px arial"//Segoe UI" //consolas"//arial"
    surface.textAlign = 'center'
    surface.shadowBlur = 10
    surface.shadowOffsetX = 3
    surface.shadowOffsetY = 3
    surface.fillRect(0, 0, canvas.width, canvas.height)

    app.infoElement = new Label('infoLabel', '', { left: 300, top: 600 }, { width: 590, height: 35 }, UI.textColor, 'black', false)
    UI.buildPlayerElements()

    UI.buildScoreElements()
    App.dice = new Dice()

    UI.leftScoreElement = new Label('100', '^ total = 0', { left: canvas.clientLeft + 162, top: 545 }, { width: 265, height: 90 }, 'gray', UI.textColor, true)
    UI.rollButton = new Button('RollButton', { left: 210, top: 9 }, { width: 175, height: 75 }, true)

    ontouch(canvas, (touchobj: any, phase: string, distX: number, distY: number) => {
      if (phase !== 'start') { return }
      // be sure to reject all local click-events during a competitors turns
      if (App.currentPlayer.id === App.thisID) {
        let x = touchobj.pageX - canvas.offsetLeft
        let y = touchobj.pageY - canvas.offsetTop
        UI.clickables.forEach((element, index) => {
          if (surface.isPointInPath(element.path, x, y)) {
            element.onClick(true, x, y)
          }
        })
      }
    })
  }

  static buildScoreElements() {
    let location = { left: surface.canvas.clientLeft + 30, top: 180 }
    UI.scoreButtons = new Array()
    let sb = UI.scoreButtons
    let scTop = location.top
    let scLeft = location.left
    let size = { width: 150, height: 95 }
    let scRight = scLeft + (size.width * 0.72)
    let righOffset = (size.width * 2) - (size.width * 0.15)
    let isleft = true

    for (var i = 0; i < 13; i++) {
      let loc: iLocation = { left: scLeft, top: scTop }
      loc.left = (isleft) ? scLeft : scRight
      if (i == 2 || i == 3 || i == 8 || i == 9) loc.top += 100
      if (i == 4 || i == 5 || i == 10 || i == 11) loc.top += 200
      if (i == 12) loc.top += 300
      if (i > 5) loc.left += righOffset
      Game.scoreItems.push(new ScoreComponent(i, UI.names[i][0], UI.names[i][1]))
      UI.scoreButtons.push(new ScoreElement(i, loc, size, isleft, UI.names[i][0], UI.names[i][1]))
      isleft = !isleft
      UI.clickables.push(UI.scoreButtons[i])
    }
    UI.renderScoreElements()
  }

  static renderScoreElements() {
    //todo: save and restore the surface ... (ctx)
    surface.shadowColor = 'burlywood'
    surface.shadowBlur = 10
    surface.shadowOffsetX = 3
    surface.shadowOffsetY = 3
    for (let i = 0; i < UI.scoreButtons.length; i++) {
      UI.scoreButtons[i].render()
    }
  }

  static buildPlayerElements() {
    let size = { width: 150, height: 35 }
    App.playerScoreElements = new Array
    App.playerScoreElements[0] = new Label('Player1Score', '', { left: 100, top: 40 }, size, UI.textColor, 'red', false)
    App.playerScoreElements[1] = new Label('Player2Score', '', { left: 100, top: 65 }, size, UI.textColor, 'blue', false)
    App.playerScoreElements[2] = new Label('Player3Score', '', { left: 475, top: 40 }, size, UI.textColor, 'green', false)
    App.playerScoreElements[3] = new Label('Player4Score', '', { left: 475, top: 65 }, size, UI.textColor, 'black', false)
  }

  static resetPlayersScoreElements() {
    for (var i = 0; i < 4; i++) {
      App.playerScoreElements[i].textColor = 'black'
      App.playerScoreElements[i].text = ''
    }
  }
}

interface UIElement {
  id: string
  location: iLocation
  size: iSize
  path: Path2D
  color: string
  text: string
  enabled: boolean
  visible: boolean
  children: UIElement[]
  render(): void
  buildPath(args: any): void
  onClick(broadcast: boolean, x: number, y: number): any
}

interface iSize {
  width: number
  height: number
}

interface iLocation {
  left: number
  top: number
}