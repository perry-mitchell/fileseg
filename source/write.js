const fs = require("fs");
const pify = require("pify");
const VError = require("verror");
const { generateSegmentKeys } = require("./keying.js");
const { getFileContents } = require("./read.js");

const writeFile = pify(fs.writeFile);

function putFileContents(filename, contents) {
    return writeFile(filename, contents);
}

function writeSegment(segmentName, contents, config) {
    const { begin, end } = generateSegmentKeys(segmentName, config);
    const replacement = [begin, ...contents.split(config.newLine), end];
    return getFileContents(config.filename)
        .then(text => text.split(config.newLine))
        .then(function __replaceContents(lines) {
            const newContents = [];
            let insideMatchedSegment = false,
                replaced = false;
            while (lines.length > 0) {
                const line = lines.shift();
                if (line.indexOf(begin) === 0) {
                    insideMatchedSegment = true;
                    newContents.push(...replacement);
                    replaced = true;
                } else if (line.indexOf(end) === 0) {
                    insideMatchedSegment = false;
                } else if (insideMatchedSegment) {
                    // do nothing
                } else {
                    // copy line
                    newContents.push(line);
                }
            }
            if (!replaced) {
                newContents.push(...replacement);
            }
            return putFileContents(config.filename, newContents.join(config.newLine));
        })
        .catch(function __handleError(err) {
            throw new VError(err, `Failed writing new file with segment '${segmentName}': ${config.filename}`);
        });
}

module.exports = {
    writeSegment
};
