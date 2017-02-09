class DieVM implements iViewModel {

  id: string
  index: number

  _value: number
  get value() {
    return this._value
  }
  set value(newValue) {
    if (this._value !== newValue) {
      this._value = newValue
      this.render()
    }
  }

  _frozen: boolean
  get frozen () {
    return this._frozen
  }
  set frozen(newValue) {
    this._frozen = newValue
    this.render()
  }

  constructor(index: number, id: string) {
    this.index = index
    this.id = id
    this.value = 1
  }

  touched(broadcast: boolean, x: number, y: number) {
    if (this._value > 0) {
      this._frozen = !this._frozen
      this.render()
      app.sounds.play(app.sounds.select)
      if (broadcast) {
        app.socketSend('DieClicked', { 'dieNumber': this.index })
      }
    }
  }

  render() {
    Events.fire(this.id, { value: this._value })
  }

  reset() {
    this._frozen = false
    this._value = 0
    this.render()
  }
}