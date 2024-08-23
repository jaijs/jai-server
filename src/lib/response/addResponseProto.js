
const proto = require('./httpPrototype');
function AddResponsePrototype(res) {
  const keys =Object.keys(proto)
  
  for(let i=0; i<keys.length; i++){
    const key=keys[i]
    if (proto[key]) {
      res[key] = proto[key];
    }
  };
}
module.exports = AddResponsePrototype;
