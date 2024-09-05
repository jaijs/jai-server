"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Matcher(q, url, fullMatch, strict) {
    if (fullMatch === void 0) { fullMatch = false; }
    if (strict === void 0) { strict = false; }
    var query = q;
    if (query === undefined || url === undefined || typeof query !== 'string' || typeof url !== 'string') {
        return false;
    }
    if (!strict && query.slice(-1) === '/') {
        query = query.slice(0, -1);
    }
    var catchRoutes = ['(\\*)', '(\\:[a-zA-Z_0-9$]+)'];
    var finalRegex = ['(?:(?:.)*)', '([^\\/]+)'];
    var exp = catchRoutes.join('|');
    var regX = new RegExp(exp, 'g');
    var params = {};
    var finalQuery = query.replace(regX, function (match, p1, p2) {
        if (p2 !== undefined) {
            params[p2.substring(1)] = '';
        }
        if (p1 !== undefined) {
            return finalRegex[0];
        }
        else if (p2 !== undefined) {
            return finalRegex[1];
        }
        return match;
    });
    var matchRegex = new RegExp((fullMatch ? '^' : '') + finalQuery + (!strict ? '\/{0,1}' : '') + (fullMatch ? '$' : ''));
    var matched = url.match(matchRegex);
    if (matched) {
        var paramsKeys = Object.keys(params);
        for (var i = 1; i < matched.length; i += 1) {
            // if (isNaN(Number(matched[i]))) {
            //   params[paramsKeys[i - 1] as string] = matched[i];
            // } else {
            //   params[paramsKeys[i - 1] as string] = Number(matched[i]);
            // } // TODO: Leaving Add number type checking
            params[paramsKeys[i - 1]] = matched[i];
        }
        return params;
    }
    return false;
}
exports.default = Matcher;
