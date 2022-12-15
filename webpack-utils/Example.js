
class Example {

    constructor(name) {
        this.name = name;
        this.path = `./src/examples/${name}/Application.ts`;
    }

    withCustomTemplate(template) {
        this.template = template;
        return this;
    }

    withCustomEntryPoint(path) {
        this.path = path;
        return this;
    }

}

exports.Example = Example;

