function Example(name, path) {
    this.name = name;
    this.path = path != undefined ? path : `./src/examples/${name}/Application.ts`;
}

exports.Example = Example;
