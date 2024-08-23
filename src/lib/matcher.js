const paramRegex = /:\w+/g;
const wildcardRegex = /\*/g;
const trailingSlashRegex = /\/$/;

function Matcher(q, url, fullMatch = false, strict = false) {
  if (typeof q !== 'string' || typeof url !== 'string') {
    return false;
  }

  const query = strict ? q : q.replace(trailingSlashRegex, '');
  const params = {};

  // Create regex pattern
  const pattern = query
    .replace(wildcardRegex, '.*')
    .replace(paramRegex, (match) => {
      const paramName = match.slice(1);
      params[paramName] = true;
      return '([^\\/]+)';
    });

  const flags = strict ? '' : 'i';
  const matchRegex = new RegExp(
    `${fullMatch ? '^' : ''}${pattern}${strict ? '' : '\\/?'}${fullMatch ? '$' : ''}`,
    flags,
  );

  const matched = url.match(matchRegex);

  if (!matched) {
    return false;
  }

  const paramNames = Object.keys(params);
  for (let i = 1; i < matched.length; i++) {
    const value = matched[i];
    params[paramNames[i - 1]] = Number.isNaN(value) ? value : Number(value);
  }

  return params;
}

module.exports = Matcher;
