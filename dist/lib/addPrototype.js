"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AddProtoTypes(addTo, props, perfect) {
    if (perfect === void 0) { perfect = false; }
    var main = addTo;
    var keys = Object.keys(props);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var value = props[key];
        if (!Object.prototype.hasOwnProperty.call(main, key) && value !== undefined) {
            if (perfect) {
                Object.defineProperty(Object.getPrototypeOf(main), key, {
                    value: value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            }
            else {
                main[key] = value;
            }
        }
    }
    return main;
}
exports.default = AddProtoTypes;
