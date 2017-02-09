class Players {

  container: Container
  playerVMs: PlayerVM[]

  constructor(container: Container) {
    this.container = container
    this.playerVMs = []
  }

  addPlayer(playerVM: PlayerVM) {
    this.playerVMs.push(playerVM)
  }

  getPlayerIndex(id: string): number | null {
    let players = this.playerVMs
    let len = players.length
    for (var i = 0; i < len; i++) {
      if (players[i].id === id) return i
    }
    return null
  }

  setPlayers(data: any) {
    this.playerVMs = []
    this.container.resetPlayersScoreElements()
    let index = 0
    Object.keys(data).forEach((prop) => {
      this.playerVMs.push( new PlayerVM (
        this.container.playerScoreElements[index], data[prop].id,
        data[prop].name,
        data[prop].color,
        0))
      if (this.container.id === data[prop].id) {
        app.me = this.playerVMs[index]
        this.container.myIndex = index
      }
      this.playerVMs[index] .resetScore()
      index += 1
    })
  }

}
