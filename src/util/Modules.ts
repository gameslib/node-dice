/**
 * Modules ... simple module-loader class
 * This class is used to automate the loading of
 * client side javascript 'modules' from the local file system.
 *
 * USAGE ...
 * Place a single 'script' tag in the head of your index.html file ...
 *
 *    <script src="./build/modules.js" data-bootLoader='App'></script>
 *
 * The 'src=' attribute must point to the location of the 'modules.js' file,
 * relative to the location of the index.html file it is called from.
 *
 * The 'data-bootLoader=' attribute holds the name of a javascript
 * file you wish to boot from. This 'boot' file will 'load' all other
 * required script files using ... Module.load(['myFile'.'util/file2',...])
 * Note the parameter is an array of file names ...
 * A (.js) extension will automatically be appended to each name in the array.
 *
 * NOTE: Please see Bottom of this file for more info.
 */
class Modules {
  scriptElements: any = {}
  baseURL = 'build/'
  head = document.getElementsByTagName('head')[0]
  static BootName = 'app.js'

  constructor() {
    Modules.BootName = document.getElementsByTagName('script')[0].getAttribute('data-bootLoader')
  }

  load(names: [string] | string) {
    if (names instanceof Array) {
      for (let i = 0; i < names.length; i++) {
        this.fetch(names[i])
      }
    } else if (typeof names === 'string') {
      this.fetch(names)
    }
  }

  private fetch(dependency: string) {
    let filePath = this.baseURL + dependency
    //  just return if it's already loaded
    if (this.scriptElements[dependency]) {
      return
    }

    //  normalize file name/path
    if (!/\.js/.test(filePath) && !/^http/.test(filePath)) {
      filePath = filePath.replace('.', '/')
      filePath = filePath + '.js'
    }
    this.createScriptTag(dependency, filePath)
  }

  createScriptTag(dependencyName: string, filePath: string) {
    let script = this.getExistingScriptTag(dependencyName)
    if (script) {
      // it's already loaded -- just return
      return
    }
    script = document.createElement('script');
    script.src = filePath
    /* script.async = false; gives our scripts a mix of behaviour that can’t be achieved with plain HTML.
     * By being explicitly not async, scripts are added to an execution queue.
     * However, by being dynamically created, they’re executed outside of
     * document parsing, so rendering isn’t blocked while they’re downloaded. */
    script.async = false
    script.setAttribute('data-module', dependencyName)
    this.head.appendChild(script)
    script.addEventListener('load', this.onScriptTagLoaded.bind(this), false)
  }

  onScriptTagLoaded(event: any) {
    let target = (event.currentTarget || event.srcElement)
    target.removeEventListener('load', this.onScriptTagLoaded)
    let name = target.getAttribute('data-module')
    this.scriptElements[name] = target
    target.parentNode.removeChild(target);
  }

  getExistingScriptTag(dependencyName: string) {
    let script: HTMLScriptElement
    this.each(document.getElementsByTagName('script'), function (elem: HTMLScriptElement) {
      if (elem.getAttribute('data-module') && elem.getAttribute('data-module') === dependencyName) {
        script = elem
      }
    })
    return script
  }

  each(array: any, callback: any) {
    let i: number
    for (i = 0; i < array.length; i++) {
      if (array[i] !== undefined && callback(array[i], i, array) === false) {
        break;
      }
    }
  }
  // you can call this to set/reset the base URL
  setBaseURL(url: string) {
    // baseURL defaults to 'build/'
    this.baseURL = url || 'build/'
  }
}

// First, we create a global modules object used to load our script files
const modules = new Modules()

// Now, we 'boot-up' a start-up script that was named
// in our single script tag ... data-bootLoader='App'
// We assume this script will load all other required modules.
modules.load(Modules.BootName)
