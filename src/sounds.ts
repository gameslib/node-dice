class Sounds {
  cluck: HTMLAudioElement
  dohh: HTMLAudioElement
  heehee: HTMLAudioElement
  roll: HTMLAudioElement
  select: HTMLAudioElement
  woohoo: HTMLAudioElement
  nooo: HTMLAudioElement
  SilkWearin: HTMLAudioElement

  constructor() {
    this.cluck = document.getElementById('cluckSound') as HTMLAudioElement
    this.dohh = document.getElementById('dohhSound') as HTMLAudioElement
    this.heehee = document.getElementById('heheSound') as HTMLAudioElement
    this.roll = document.getElementById('rollSound') as HTMLAudioElement
    this.select = document.getElementById('selectSound') as HTMLAudioElement
    this.woohoo = document.getElementById('woohooSound')as HTMLAudioElement
    this.nooo = document.getElementById('noooSound') as HTMLAudioElement
    this.SilkWearin = document.getElementById('YaSilkWearinSound') as HTMLAudioElement
  }

  play(sound: HTMLAudioElement) {
    if (app.playSounds) {
      sound.play()
    }
  }
}
