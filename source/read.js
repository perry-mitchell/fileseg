const fs = require("fs");
const pify = require("pify");
const VError = require("verror");
const { generateSegmentKeys } = require("./keying.js");

const readFile = pify(fs.readFile);

function getFileContents(filename) {
    return readFile(filename, "utf8")
        .catch(function __handleCheckError(err) {
            if (err.code === "ENOENT") {
                return "";
            }
            throw new VError(err, "Failed checking for file's existence");
        });
}

function readSegment(segmentName, config) {
    const { begin, end } = generateSegmentKeys(segmentName, config);
    return getFileContents(config.filename)
        .then(text => text.split(config.newLine))
        .then(function __parseContents(lines) {
            const segment = [];
            let insideSegment = false,
                hasRead = false;
            while (!hasRead && lines.length > 0) {
                const line = lines.shift();
                if (!insideSegment && line.indexOf(begin) === 0) {
                    insideSegment = true;
                } else if (line.indexOf(end) === 0) {
                    insideSegment = false;
                    hasRead = true;
                } else if (insideSegment) {
                    segment.push(line);
                }
            }
            return segment.join(config.newLine);
        })
        .then(function __handleDefault(output) {
            return (output && output.length > 0) ?
                output :
                config.noSegment;
        })
        .catch(function __handleReadError(err) {
            throw new VError(err, `Failed retrieving segment '${segmentName}' from file: ${config.filename}`);
        });
}

module.exports = {
    getFileContents,
    readSegment
};
