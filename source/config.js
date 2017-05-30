/**
 * Configuration object
 * @typedef {Object} Config
 * @property {String} commentPrefix - What text to start the segments with (should be a comment that won't interrupt any parsers)
 * @property {String} blockPrefix - The application specific prefix. This should not normally be changed.
 * @property {String} beginText - How to identify the opening segment line. This should not normally be changed.
 * @property {String} endText - How to identify the closing segment line. This should not normally be changed.
 * @property {String} newLine - What character to use for new lines. This is also used for recognising new lines.
 * @property {null|*} noSegment - What to return when no segment is found.
 * @property {String} filename - The filename in the adapter. This will always be overwritten and cannot be specified by the user.
 */

/**
 * Create a configuration object
 * @param {Config=} custom Optionally specify configuration properties
 * @returns {Config} The newly created config
 */
function createConfig(custom = {}) {
    return Object.assign(
        {
            commentPrefix: "#",
            blockPrefix: " __fileseg__ ",
            beginText: "BEGIN:",
            endText: "END:",
            newLine: "\n",
            noSegment: null,
            filename: null
        },
        custom
    );
}

module.exports = {
    createConfig
};
