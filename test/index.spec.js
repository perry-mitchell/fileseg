const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf").sync;

const createAdapter = require("../source/index.js");

const EMPTY_FILE_PATH = path.resolve(__dirname, "./empty.fileseg");
const EXAMPLE_FILE_PATH = path.resolve(__dirname, "./resources/test.ini");
const EXAMPLE_COPY_PATH = path.resolve(__dirname, "./resources/copy.ini");

describe("adapter", function() {

    beforeEach(function() {
        rimraf(EMPTY_FILE_PATH);
        this.emptyAdapter = createAdapter(EMPTY_FILE_PATH);
        this.exampleAdapter = createAdapter(EXAMPLE_FILE_PATH);
        const copiedContent = fs.readFileSync(EXAMPLE_FILE_PATH, "utf8");
        fs.writeFileSync(EXAMPLE_COPY_PATH, copiedContent);
        this.writeAdapter = createAdapter(EXAMPLE_COPY_PATH);
    });

    afterEach(function() {
        rimraf(EMPTY_FILE_PATH);
        rimraf(EXAMPLE_COPY_PATH);
    });

    describe("readSegment", function() {

        it("returns `null` if no segment found", function() {
            return this.emptyAdapter.read("test")
                .then(segment => {
                    expect(segment).to.be.null;
                });
        });

        it("returns the segment if found", function() {
            return this.exampleAdapter.read("unitTestsCheck")
                .then(segment => {
                    expect(segment).to.equal("[dynamic]\noh=yeah");
                });
        });

    });

    describe("writeSegment", function() {

        it("writes a segment to the file", function() {
            return this.writeAdapter.write("secondBlockCheck", "first=1\nsecond=two\nthird=3")
                .then(() => {
                    const contents = fs.readFileSync(EXAMPLE_COPY_PATH, "utf8");
                    expect(contents).to.contain("secondBlockCheck");
                    expect(contents).to.contain("first=1\nsecond=two\nthird=3");
                });
        });

        it("writes a new file if it doesn't exist", function() {
            rimraf(EXAMPLE_COPY_PATH);
            return this.writeAdapter.write("secondBlockCheck", "test=true")
                .then(() => {
                    const contents = fs.readFileSync(EXAMPLE_COPY_PATH, "utf8");
                    expect(contents).to.contain("test=true");
                });
        });

    });

});
