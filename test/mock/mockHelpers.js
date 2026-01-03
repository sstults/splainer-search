export function parseUrlParams(queryString) {
  if (queryString[0] === '?') {
    queryString = queryString.slice(1, queryString.length);
  }
  const queryParams = queryString.split('&');
  const parsedParams = {};
  queryParams.forEach((queryParam) => {
    const qpSplit = queryParam.split(/=(.*)/);
    const param = qpSplit[0];
    const value = qpSplit[1];
    if (!Object.hasOwn(parsedParams, param)) {
      parsedParams[param] = [];
    }
    parsedParams[param].push(value);
  });
  return parsedParams;
}

export function urlHasBasicAuth() {
  return {
    test(requestedUrl) {
      try {
        const uri = new URL(requestedUrl);
        if (uri.username !== '' && uri.password !== '') {
          return true;
        }
        console.error(
          `Expected username: ${uri.username} and password: ${uri.password} to both be embedded in url ${requestedUrl}`
        );
        return false;
      } catch (error) {
        return false;
      }
    }
  };
}

export function urlHasNoBasicAuth() {
  return {
    test(requestedUrl) {
      try {
        const uri = new URL(requestedUrl);
        if (uri.username === '' && uri.password === '') {
          return true;
        }
        console.error(
          `Expected username: ${uri.username} and password: ${uri.password} to both be missing from url ${requestedUrl}`
        );
        return false;
      } catch (error) {
        return false;
      }
    }
  };
}

export function arrayContains(list, value) {
  let contains = false;
  list.forEach((listValue) => {
    if (listValue === value) {
      contains = true;
    }
  });
  return contains;
}

export function urlContainsParams(url, params) {
  return {
    test(requestedUrl) {
      if (requestedUrl.indexOf(url) !== 0) {
        return false;
      }
      let missingParam = false;
      const urlEncodedArgs = requestedUrl.substr(url.length);
      const parsedParams = parseUrlParams(urlEncodedArgs);
      Object.entries(params).forEach(([param, values]) => {
        if (values instanceof Array) {
          values.forEach((value) => {
            if (!arrayContains(parsedParams[param], value)) {
              console.error(`Expected param: ${param} missing`);
              missingParam = true;
            }
          });
        } else {
          missingParam = true;
        }
      });
      return !missingParam;
    }
  };
}

export function urlMissingParams(url, params) {
  return {
    test(requestedUrl) {
      if (requestedUrl.indexOf(url) !== 0) {
        return false;
      }
      let found = false;
      const urlEncodedArgs = requestedUrl.substr(url.length);
      const parsedParams = parseUrlParams(urlEncodedArgs);
      Object.entries(params).forEach(([param, values]) => {
        if (values instanceof Array) {
          values.forEach((value) => {
            if (arrayContains(parsedParams[param], value)) {
              console.error(`Param: ${param} should be missing, but found`);
              found = true;
            }
          });
        }
      });
      return !found;
    }
  };
}
