function Matcher(q, url, fullMatch = false, strict = false) {
  let query = q;
  if (query === undefined || url === undefined || typeof query !== 'string' || typeof url !== 'string') {
    return false;
  }
  if(!strict && query.slice(-1) === '/') {
    query= query.slice(0,-1)
  }
  const catchRoutes = ['(\\*)', '(\\:[a-zA-Z_0-9$]+)'];
  const finalRegex = ['(?:(?:.)*)', '([^\\/]+)'];
  const exp = catchRoutes.join('|');

  const regX = new RegExp(exp, 'g');
  const params = {};
  const finalQuery = query.replace(regX, (match, p1, p2) => {
    if (p2 !== undefined) {
      params[p2.substr(1)] = true;
    }
    if (p1) {
      return finalRegex[0];
    } if (p2) {
      return finalRegex[1];
    }
    return match;
  });
/* eslint-disable */
  const matchRegex = new RegExp((fullMatch ? '^' : '') + finalQuery + (!strict ? '\/{0,1}' : '') + (fullMatch ? '$' : ''));
 /* eslint-disable */
  const matched = url.match(matchRegex);

  if (matched) {
    const paramsKeys = Object.keys(params);

    for (let i = 1; i < matched.length; i += 1) {
      params[paramsKeys[i - 1]] = matched[i];
    }
    return params;
  }
  return false;
}

module.exports = Matcher;
