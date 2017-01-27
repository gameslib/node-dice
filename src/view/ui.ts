//todo: work on framework layout manager

class UI {
  static textColor: string
  static rollButton: Button
  static leftScoreTotalLabel: Label
  static scoreButtons: ScoreButton[]
  static targetElements: UIElement[] = []
  static popup: Popup


  static initialize() {
    UI.popup = new Popup('WinnerDialog', { left: 100, top: 100, width: 400, height: 400 })
    let canvas = document.getElementById('drawing-surface') as HTMLCanvasElement
    surface = canvas.getContext('2d')
    surface.lineWidth = 1;
    UI.textColor = 'snow'
    surface.strokeStyle = 'snow';
    surface.fillStyle = 'snow'
    surface.font = "small-caps 18px arial"
    surface.textAlign = 'center'
    surface.shadowBlur = 10
    surface.shadowOffsetX = 3
    surface.shadowOffsetY = 3
    surface.fillRect(0, 0, canvas.width, canvas.height)

    let info: any = document.getElementById('infoLabel').dataset
    app.infoElement = new Label('infoLabel', '',
      { left: parseInt(info.left), top: parseInt(info.top), width: parseInt(info.width), height: 35 },
      UI.textColor, 'black', false)

    UI.buildPlayerElements()

    UI.buildScoreElements()
    App.dice = new Dice()

    let leftSC: any = document.getElementById('leftScore').dataset
    UI.leftScoreTotalLabel = new Label('100', '^ total = 0', {
      left: canvas.clientLeft + parseInt(leftSC.left),
      top: parseInt(leftSC.top),
      width: parseInt(leftSC.width),
      height: parseInt(leftSC.height)
    },
      'gray', UI.textColor, false)

    let RB: any = document.getElementById('rollButton').dataset
    UI.rollButton = new Button('RollButton',
      {
        left: parseInt(RB.left), top: parseInt(RB.top),
        width: parseInt(RB.width), height: parseInt(RB.height)
      }, true)

    ontouch(canvas, (touchobj: any, phase: string, distX: number, distY: number) => {
      if (phase !== 'start') { return }
      let hit = false
      // be sure to reject all local click-events during a competitors turns
      if (App.currentPlayer.id === App.thisID) {
        let x = touchobj.pageX - canvas.offsetLeft
        let y = touchobj.pageY - canvas.offsetTop
        UI.targetElements.forEach((element, index) => {
          if (!hit) {
            if (surface.isPointInPath(element.path, x, y)) {
              element.touched(true, x, y)
              hit = true
            }
          }
        })
      }
    })
  }

  static buildScoreElements() {
    UI.scoreButtons = new Array()
    let data: any
    let thisScore: any
    var scores = document.querySelectorAll('score')
    for (var i = 0; i < scores.length; i++) {
      thisScore = scores[i]
      data = this.parseData(thisScore.dataset)
      let loc = { left: data.left, top: data.top }
      Game.scoreItems.push(new ScoreComponent(i, data.name))
      UI.scoreButtons.push(new ScoreButton(i, data.geo, data.isleft, data.name))
      thisScore.parentNode.removeChild(thisScore)
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
    App.playerScoreElements = new Array
    App.playerScoreElements[0] = new Label('Player1Score', '', { left: 100, top: 40, width: 150, height: 35 }, UI.textColor, 'red', false)
    App.playerScoreElements[1] = new Label('Player2Score', '', { left: 100, top: 65, width: 150, height: 35 }, UI.textColor, 'blue', false)
    App.playerScoreElements[2] = new Label('Player3Score', '', { left: 475, top: 40, width: 150, height: 35 }, UI.textColor, 'green', false)
    App.playerScoreElements[3] = new Label('Player4Score', '', { left: 475, top: 65, width: 150, height: 35 }, UI.textColor, 'black', false)
  }

  static resetPlayersScoreElements() {
    for (var i = 0; i < 4; i++) {
      App.playerScoreElements[i].textColor = 'black'
      App.playerScoreElements[i].text = ''
    }
  }

  static parseData(data: any) {
    return {
      name: (<string>data.text),
      geo: {
        left: parseInt(data.left),
        top: parseInt(data.top),
        width: 150,
        height: 95
      },
      isleft: (data.isleft === 'true') ? true : false
    }
  }
}

interface iGeometry {
  left: number
  top: number
  width: number
  height: number
}
