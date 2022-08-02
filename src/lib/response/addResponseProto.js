function AddResponsePrototype(res, proto) {
  Object.keys(proto).forEach((key) => {
    if (proto[key]) {
      res[key] = proto[key];
    }
  });
}
module.exports = AddResponsePrototype;
