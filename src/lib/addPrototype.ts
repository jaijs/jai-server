function AddProtoTypes<T extends object, U extends object>(
  addTo: T,
  props: U,
  perfect: boolean = false
): T & U {
  const main = addTo as T & U;
  const keys = Object.keys(props) as (keyof U)[];
  
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
      } else {
        (main as any)[key] = value;
      }
    }
  }
  
  return main;
}

export default AddProtoTypes;