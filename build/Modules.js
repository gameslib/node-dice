class Modules {
    constructor() {
        this.scriptElements = {};
        this.baseURL = 'build/';
        this.head = document.getElementsByTagName('head')[0];
        Modules.BootName = document.getElementsByTagName('script')[1].getAttribute('data-boot');
    }
    load(names) {
        if (names instanceof Array) {
            for (let i = 0; i < names.length; i++) {
                this.fetch(names[i]);
            }
        }
        else if (typeof names === 'string') {
            this.fetch(names);
        }
    }
    fetch(dependency) {
        let filePath = this.baseURL + dependency;
        if (this.scriptElements[dependency]) {
            return;
        }
        if (!/\.js/.test(filePath) && !/^http/.test(filePath)) {
            filePath = filePath.replace('.', '/');
            filePath = filePath + '.js';
        }
        this.createScriptTag(dependency, filePath);
    }
    createScriptTag(dependencyName, filePath) {
        let script = this.getExistingScriptTag(dependencyName);
        if (script) {
            return;
        }
        script = document.createElement('script');
        script.src = filePath;
        script.async = false;
        script.setAttribute('data-module', dependencyName);
        this.head.appendChild(script);
        script.addEventListener('load', this.onScriptTagLoaded.bind(this), false);
    }
    onScriptTagLoaded(event) {
        let target = (event.currentTarget || event.srcElement);
        target.removeEventListener('load', this.onScriptTagLoaded);
        let name = target.getAttribute('data-module');
        this.scriptElements[name] = target;
        target.parentNode.removeChild(target);
    }
    getExistingScriptTag(dependencyName) {
        let script;
        this.each(document.getElementsByTagName('script'), function (elem) {
            if (elem.getAttribute('data-module') && elem.getAttribute('data-module') === dependencyName) {
                script = elem;
            }
        });
        return script;
    }
    each(array, callback) {
        let i;
        for (i = 0; i < array.length; i++) {
            if (array[i] !== undefined && callback(array[i], i, array) === false) {
                break;
            }
        }
    }
    setBaseURL(url) {
        this.baseURL = url || 'build/';
    }
}
Modules.BootName = 'app.js';
const modules = new Modules();
modules.load(Modules.BootName);
