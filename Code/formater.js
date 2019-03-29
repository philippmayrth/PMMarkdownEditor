"use strict";
///////////////////////////////////////////////////////////////////////////////////////
// Taken form http://internal-git.philipp-mayr.de/PhilippMayr/LicenceManagerLibraryJS/_edit/master/dist/formater.js
// This file is generated automaticaly do not change it. All changes will be lost
///////////////////////////////////////////////////////////////////////////////////////

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var createHash = require('crypto').createHash;
var base32 = require('rfc-3548-b32');
var Formater = /** @class */ (function () {
    function Formater() {
    }
    return Formater;
}());
exports.Formater = Formater;
var Base32WithSpeperator = /** @class */ (function (_super) {
    __extends(Base32WithSpeperator, _super);
    function Base32WithSpeperator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Base32WithSpeperator.prototype.format = function (data) {
        return this.formatAdvanced(data, 5, "-", 0);
    };
    Base32WithSpeperator.prototype.formatAdvanced = function (binary, seperateaftereverychars, seperator, dropfirst) {
        var shasum = createHash('sha1');
        shasum.update(binary);
        var keyBinary = base32.encode(shasum.digest());
        var key = keyBinary.toString("utf-8");
        // drop first x characters
        key = key.substring(dropfirst);
        var newKey = "";
        // format with dashes
        var counterinit = 1;
        var counter = counterinit;
        for (var iKeyCaracter = 0; iKeyCaracter < key.length; iKeyCaracter++) {
            var currentKeyCharacter = key[iKeyCaracter];
            //console.debug("current key char: "+currentKeyCharacter);
            var newKey = newKey + currentKeyCharacter;
            // apply the sperator character ever x characters
            if (counter == seperateaftereverychars) {
                newKey = newKey + seperator;
                counter = counterinit;
            }
            else {
                counter++;
            }
        }
        // remvoe any trailing seprator characters
        if (newKey.slice(-1) === seperator) {
            newKey = newKey.substr(0, newKey.length - 1);
        }
        return newKey;
    };
    return Base32WithSpeperator;
}(Formater));
exports.Base32WithSpeperator = Base32WithSpeperator;
