//todo: work on framework layout manager

class Container {

  id: string
  geometry: iGeometry
  ctx: CanvasRenderingContext2D
  path: Path2D
  color: string
  enabled: boolean
  visible: boolean
  children: iView[]
  viewModel: ContainerVM
  myIndex: number = 0
  canvas: HTMLCanvasElement
  infoElement: Label
  playerScoreElements: Label[]
  leftScoreTotalLabel: Label
  targetElements: iView[] = []
  popup: Popup
  rollButton: Button

  constructor(canvas: HTMLCanvasElement) {
    this.id = this.generateID()
    this.initCanvasContext(canvas)
    this.viewModel = new ContainerVM(this)
    canvas.addEventListener(Events.Type.MouseDown, (e: any) => {
      e.preventDefault()
      this.handleClickOrTouch(e.pageX, e.pageY)
    }, false)
    canvas.addEventListener(Events.Type.TouchStart, (e: any) => {
      e.preventDefault()
      this.handleClickOrTouch(e.changedTouches[0].pageX, e.changedTouches[0].pageY)
    }, false)
    this.hydrateUIfromHTML()
  }

  handleClickOrTouch(mX: number, mY: number) {
    let hit = false
    // we must reject any local click-events during a competitors turns
    if (app.currentPlayer.id === this.id) {
      let x = mX - this.canvas.offsetLeft
      let y = mY - this.canvas.offsetTop
      this.targetElements.forEach((element, index) => {
        if (!hit) {
          if (this.ctx.isPointInPath(element.path, x, y)) {
            element.touched(true, x, y)
            hit = true
          }
        }
      })
    }
  }

  hydrateUIfromHTML() {
    this.popup = new Popup('WinnerDialog',
      { left: 100, top: 100, width: 400, height: 400 }, this, null)
    let geometry = this.parseGeometry(document.getElementById('infoLabel').dataset)
    this.infoElement = new Label('infoLabel', '', geometry, 'snow', 'black', false, this)
    geometry = this.parseGeometry(document.getElementById('leftScore').dataset)
    this.leftScoreTotalLabel = new Label('100', '^ total = 0', geometry, 'gray', 'snow', false, this)
    geometry = this.parseGeometry(document.getElementById('rollButton').dataset)
    this.rollButton = new Button('RollButton', geometry, true, this)
    this.buildDice()
    this.buildPlayerElements()
    this.buildScoreElements()
  }

  buildDice() {
    let dieFaceBuilder = new DieBuilder
    dieFaceBuilder.buildDieFaces(80)
    let dieSet = this.viewModel.dice.die
    let dieSize = 82
    for (var i = 0; i < 5; i++) {
      var x = 81 + (i * 90)
      let vm = new DieVM(i, 'Die' + i)
      let d = new Die('Die' + i,
        {
          left: x,
          top: 95,
          width: dieSize,
          height: dieSize
        },
        true,
        this,
        vm)
      dieSet.push(vm)
    }
  }

  buildScoreElements() {
    let data: any
    let thisScore: any
    var scores = document.querySelectorAll('score')
    for (var i = 0; i < scores.length; i++) {
      thisScore = scores[i]
      data = this.parseScoreData(thisScore.dataset)
      let loc = { left: data.left, top: data.top }
      this.viewModel.scoreItems.push(new ScoreButtonVM(i, data.name, this))
      let view = new ScoreButton(i, data.geo, data.isleft, data.name, this, this.viewModel.scoreItems[i])
      thisScore.parentNode.removeChild(thisScore)
    }
  }

  buildPlayerElements() {
    this.playerScoreElements = []
    for (var i = 0; i < 4; i++) {
      this.playerScoreElements[i] = this.buildPlayer(i)
    }
  }

  buildPlayer(i: number) {
    let data: any = document.getElementById('Player' + i).dataset
    return new Label('Player' + i, 'Player' + i, {
      left: this.canvas.clientLeft + parseInt(data.left),
      top: parseInt(data.top),
      width: parseInt(data.width),
      height: parseInt(data.height)
    }, 'snow', 'black', false, this)
  }

  resetPlayersScoreElements() {
    for (var i = 0; i < 4; i++) {
      this.playerScoreElements[i].textColor = 'black'
      this.playerScoreElements[i].text = ''
    }
  }

  generateID() {
    let chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let num = 10;
    let id: string = '';
    for (var i = 0; i < num; i++) {
      chars[i]
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  parseGeometry(data: any): iGeometry {
    return {
      left: parseInt(data.left),
      top: parseInt(data.top),
      width: parseInt(data.width),
      height: parseInt(data.height),
    }
  }

  parseScoreData(data: any) {
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

  initCanvasContext(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'snow';
    this.ctx.fillStyle = 'snow'
    this.ctx.font = "small-caps 18px arial"
    this.ctx.textAlign = 'center'
    this.ctx.shadowBlur = 10
    this.ctx.shadowOffsetX = 3
    this.ctx.shadowOffsetY = 3
    this.ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
}
