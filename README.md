# fileseg
File segment fetching and replacing for configuration files

[![Build Status](https://travis-ci.org/perry-mitchell/fileseg.svg?branch=master)](https://travis-ci.org/perry-mitchell/fileseg) [![npm version](https://badge.fury.io/js/fileseg.svg)](https://www.npmjs.com/package/fileseg)

## Installation
Simply install by running `npm install fileseg --save`.

## Usage
`fileseg` allows for configuration block management within files. For instance you may want to control a custom block of ignored paths in a `.gitignore` file:

```
node_modules
*.log
.vscode

# __fileseg__ BEGIN:customConfig
some-application-path
another/path
# __fileseg__ END:customConfig
```

Reading and editing this configuration section is easy with `fileseg`:

```javascript
const createAdapter = require("fileseg");

const adapter = createAdapter(".gitignore");
adapter
    .read("customConfig")
    .then(function(config) {
        const newConfig = [
            ...config.split("\n"),
            "somefile.exe"
        ];
        return adapter.write("customConfig", newConfig.join("\n"));
    });
```

The result within `.gitignore` would be:

```
node_modules
*.log
.vscode

# __fileseg__ BEGIN:customConfig
some-application-path
another/path
somefile.exe
# __fileseg__ END:customConfig
```

A file can have _any number_ of blocks managed by `fileseg`. A file is created automatically when writing to a path that doesn't exist. Reading a block from a non-existent file will return `null` by default (this can be overidden in the options).

### Configuring
`fileseg` can be configured by passing in a configuration object when creating the adapter:

```javascript
const createAdapter = require("fileseg");

const adapter = createAdapter(".gitignore", {
    commentPrefix: "#",
    blockPrefix: " __fileseg__ ",
    beginText: "BEGIN:",
    endText: "END:",
    newLine: "\n",
    noSegment: null
});
```

You can override the default behaviour:

 * `commentPrefix` is the string used to prefix block delimiters. The default `#` character is quite common in configuration files, but it can be changed to other comment characters for other markups and languages.
 * `blockPrefix` is a library-specific identifier to increase the uniqueness of the block.
 * `beginText` and `endText` configure the values to delimit the start and end of a block. These must never be the same and should usually not be changed.
 * `newLine` controls the new line characters (both recognised and replaced). This could be set, for example, to `"\r\n"` in a pure Windows project.
 * `noSegment` is the default return value for when a segment is not found (includes non-existent files).
