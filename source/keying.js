function generateSegmentKeys(segmentName, config) {
    const {
        commentPrefix,
        blockPrefix,
        beginText,
        endText
    } = config;
    return {
        begin: `${commentPrefix}${blockPrefix}${beginText}${segmentName}`,
        end: `${commentPrefix}${blockPrefix}${endText}${segmentName}`
    };
}

module.exports = {
    generateSegmentKeys
};
