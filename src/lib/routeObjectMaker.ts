import {RouteObject,RouteObjectMakerArgs} from '../types/types';
function RouteObjectMaker({
  callback,
  url=null,
  method=null,
  isUse=false,
  isErrorHandler=false
}:RouteObjectMakerArgs): RouteObject {
  return {
    url,
    method,
    handler: callback,
    isUse,
    isErrorHandler
  };
}

export default RouteObjectMaker;