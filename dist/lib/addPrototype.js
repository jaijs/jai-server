"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function AddProtoTypes(addTo, props, perfect = false) {
    const main = addTo;
    const keys = Object.keys(props);
    for (const key of keys) {
        const value = props[key];
        if (!Object.prototype.hasOwnProperty.call(main, key) && value !== undefined) {
            if (perfect) {
                Object.defineProperty(Object.getPrototypeOf(main), key, {
                    value,
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
