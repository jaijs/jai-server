function AddProtoTypes(addTo, props) {
  const main = addTo;
  const keys = Object.keys(props);
  const len = keys.length;
  for (let i = 0; i < len; i += 1) {
    const key = keys[i];
    const value = props[key];
    if (!Object.prototype.hasOwnProperty.call(main, key) && value) {
      main[key] = value;
    }
  }
  return main;
}

module.exports = AddProtoTypes;
