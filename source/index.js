const { createConfig } = require("./config.js");
const { readSegment } = require("./read.js");
const { writeSegment } = require("./write.js");

/**
 * Create a new adapter for segment control
 * @param {String} filename The filename to operate on
 * @param {Config=} userConfig Optional config override (merged with defaults)
 * @returns {Object} The adapter - see readme for details
 */
function createAdapter(filename, userConfig = null) {
    let config = userConfig;
    if (config === null) {
        config = createConfig({ filename });
    }
    return {
        read: segmentName => readSegment(segmentName, config),
        write: (segmentName, contents) => writeSegment(segmentName, contents, config)
    };
}

/**
 * Create a custom configuration
 * @param {Config} config Override default configuration values
 * @type {Function}
 * @returns {Config} The configuration object
 */
createAdapter.createConfig = createConfig;

module.exports = createAdapter;
