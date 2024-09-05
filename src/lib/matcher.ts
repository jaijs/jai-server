import { Params } from '../types/types';


function Matcher(q: string | undefined, url: string | undefined, fullMatch: boolean = false, strict: boolean = false): Params | boolean {
  let query = q;

  if (query === undefined || url === undefined || typeof query !== 'string' || typeof url !== 'string') {
    return false;
  }

  if (!strict && query.slice(-1) === '/') {
    query = query.slice(0, -1);
  }

  const catchRoutes = ['(\\*)', '(\\:[a-zA-Z_0-9$]+)'];
  const finalRegex = ['(?:(?:.)*)', '([^\\/]+)'];
  const exp = catchRoutes.join('|');

  const regX = new RegExp(exp, 'g');
  const params: Params = {};
  const finalQuery = query.replace(regX, (match?: string, p1?: string, p2?: string) => {
    if (p2 !== undefined) {
      params[p2.substring(1)] = '';
    }
    if (p1 !== undefined) {
      return finalRegex[0] as string;
    } else if (p2 !== undefined) {
      return finalRegex[1] as string;
    }
    return match as string;
  });

  const matchRegex = new RegExp((fullMatch ? '^' : '') + finalQuery + (!strict ? '/{0,1}' : '') + (fullMatch ? '$' : ''));
  const matched = url.match(matchRegex);

  if (matched) {
    const paramsKeys = Object.keys(params);

    for (let i = 1; i < matched.length; i += 1) {
      // if (isNaN(Number(matched[i]))) {
      //   params[paramsKeys[i - 1] as string] = matched[i];
      // } else {
      //   params[paramsKeys[i - 1] as string] = Number(matched[i]);
      // } // TODO: Leaving Add number type checking
      params[paramsKeys[i - 1] as string] = matched[i];
    }
    return params;
  }

  return false;
}

export default Matcher;
