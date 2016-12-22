class Sounds {
    constructor() {
        this.cluck = document.getElementById('cluckSound');
        this.dohh = document.getElementById('dohhSound');
        this.heehee = document.getElementById('heheSound');
        this.roll = document.getElementById('rollSound');
        this.select = document.getElementById('selectSound');
        this.woohoo = document.getElementById('woohooSound');
        this.nooo = document.getElementById('noooSound');
        this.SilkWearin = document.getElementById('YaSilkWearinSound');
    }
    play(sound) {
        if (app.playSounds) {
            sound.play();
        }
    }
}
