declare function AddProtoTypes<T extends object, U extends object>(addTo: T, props: U, perfect?: boolean): T & U;
export default AddProtoTypes;
