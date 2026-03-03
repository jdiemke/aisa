
class Example {

    constructor(name) {
        this.name = name;
        this.path = `./src/examples/${name}/Application.ts`;
        this.title = null;
    }

    withCustomTemplate(template) {
        this.template = template;
        return this;
    }

    withCustomEntryPoint(path) {
        this.path = path;
        return this;
    }

    withTitle(title) {
        this.title = title;
        return this;
    }

    /**
     * Returns the display title. Falls back to a Title Case
     * conversion of the kebab-case name when no custom title is set.
     */
    getTitle() {
        if (this.title) return this.title;
        return this.name
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
    }

}

exports.Example = Example;

