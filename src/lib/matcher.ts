import { Params } from '../types/types';

// Pre-compile regular expressions
const CATCH_ROUTES_REGEX = /(\*)|(:([a-zA-Z_0-9$]+))/g;
const TRAILING_SLASH_REGEX = /\/$/;
const EMPTY_STRING = '';

function Matcher(q: string = '', url: string = '', fullMatch: boolean = false, strict: boolean = false): Params | boolean {
  // Early return for exact match
  if (q.indexOf(':') === -1 && q === url) return true;

  const query = strict ? q : q.replace(TRAILING_SLASH_REGEX, EMPTY_STRING);
  const params: Params = {};

  const finalQuery = query.replace(CATCH_ROUTES_REGEX, (_, wildcard, __, param) => {
    if (param) {
      params[param] = EMPTY_STRING;
      return '([^\\/]+)';
    }
    return wildcard ? '(?:(?:.)*)' : _;
  });

  const matchRegex = new RegExp(
    `${fullMatch ? '^' : ''}${finalQuery}${strict ? '' : '\\/?'}${fullMatch ? '$' : ''}`
  );

  const matched = url.match(matchRegex);
  if (!matched) return false;

  const paramsKeys = Object.keys(params);
  for (let i = 1; i < matched.length; i++) {
    params[paramsKeys[i - 1] as string] = matched[i];
  }

  return params;
}

export default Matcher;