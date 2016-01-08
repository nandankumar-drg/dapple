'use strict';

var assert = require('chai').assert;
var fs = require('../lib/file.js');
var DappleRC = require('../lib/dapplerc.js');
var path = require('path');

describe('DappleRC', function() {
    var fixtureRC = path.join(__dirname, '_fixtures', 'dapplerc');
    var fixtureRCExpanded = fixtureRC + '.expanded';

    it('loads the first YAML file that exists in the array given', function() {
        var wrong = path.join(__dirname, '_fixtures', 'nonexistent');
        var rc = new DappleRC({paths: [wrong, fixtureRC]});
        assert.equal(rc.path, fixtureRC, "rc did not load from " + fixtureRC);
    });

    it('leaves `path` undefined if no file could be read', function() {
        var wrong = path.join(__dirname, '_fixtures', 'nonexistent');
        var rc = new DappleRC({paths: [wrong]});
        assert.isUndefined(rc.path, "path should have been undefined!");
    });

    it('loads configuration files into its data property', function() {
        var expected = fs.readYamlSync(fixtureRCExpanded);
        var rc = new DappleRC({paths: [fixtureRC]});
        assert.deepEqual(rc.data, expected);
    });

    it('fills in unspecified properties with defaults', function() {
        var rc = new DappleRC({paths: [fixtureRC]});
        assert.deepEqual(
            rc.data.environments.default.ipfs,
            rc.data.environments.evm.ipfs);
    });

    it('validates itself and throws an exception if it fails', function() {
        var invalidFixtureRC = fixtureRC + '.invalid';
        assert.throws(function() {
            new DappleRC({paths: [invalidFixtureRC]});
        });
    });
});