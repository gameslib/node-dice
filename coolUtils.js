// hack: don't forget to use Object destructuring tricks
/*
    const { name } = player; // pulls the 'name'  property from player object
    console.log(name)
*/
  function render(_args) {
    const { component, children } = _args;
    const props = this.rest(_args, ['component', 'children', 'path']);
  }

  function rest(_args, excluded) {
    const t = {};
    for (let p in _args) {
      if (excluded.indexOf(p) < 0) {
        t[p] = _args[p];
      }
    }
    return t;
  }
