"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var httpPrototype_1 = require("./httpPrototype");
function AddResponsePrototype(res) {
    var keys = Object.keys(httpPrototype_1.default);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (httpPrototype_1.default[key]) {
            res[key] = httpPrototype_1.default[key];
        }
    }
}
exports.default = AddResponsePrototype;
