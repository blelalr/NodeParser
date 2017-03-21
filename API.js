import createLog from 'silk-log';
import fetch from 'node-fetch';
import co from 'co';

const log = createLog(`util-http`);

export function httpGET(url, _headers): Object {
  log.info(`----- httpGET[`+url+`] -----`)
  _headers['Accept'] = 'application/json';
  _headers['Content-Type'] = 'application/json';

  var response = co(function *() {
    var res = yield fetch(url,{
      method: 'GET',
      headers: _headers
    });

    var json = yield res.json();
    return json
  });

  return response;
}

export function httpGETreturnError(url, _headers): Object {
  log.info(`----- httpGET[`+url+`] -----`)
  _headers['Accept'] = 'application/json';
  _headers['Content-Type'] = 'application/json';

  var response = co(function *() {
    var res = yield fetch(url,{
      method: 'GET',
      headers: _headers
    }).then(function(response) {
        if (response.ok) {
          return Promise.resolve(response.json())
        }
        return response.json().then(json => {
          return json;
        })
      });
    return res;
  });
  return response;
}

export function httpPOST(url, _headers, _body): Object {
  log.info(`----- httpPOST[`+url+`] -----`)
  _headers['Accept'] = 'application/json';
  _headers['Content-Type'] = 'application/json';

  var response = co(function *() {
    var res = yield fetch(url,{
      method: 'POST',
      headers: _headers,
      body: JSON.stringify(_body)
    });
    var json = yield res.json();
    return json
  });

  return response;
}

export function httpPOSTforStreamingUrl(url, _headers, _body): Object {
    log.info(`----- httpPOST[` + url + `] -----`)

    var options = {
        method: 'POST',
        body: _body,
        headers: _headers
    };

    var response = co(function*() {
        var json = null;
        var res = yield fetch(url, options).then(function(response) {
            if (response.ok) {
                return Promise.resolve(response.json())
            } else if (response.status == 400 ||response.status == 404|| response.status == 500) {
                return response.json().then(json => {
                    return json;
                })
            } else {
                var json = {
                    'error': {
                        'description': 'PostUrl Error',
                        'code': 503,
                        'debugInfo': null,
                        'httpCode': 503
                    },
                    'duration': 4
                }
                return json;
            };

        });
        return res;
    });
    return response;
}

export function httpPOSTwithHeadBody(url, _headers, _body): Object {
  log.info(`----- httpPOST[`+url+`] -----`)

  var options = {
    method: 'POST',
    body: _body,
    headers: _headers
};

  var response = co(function *() {
    var json = null;
    var res = yield fetch(url, options).then(function(response) {
        if (response.ok) {
          return Promise.resolve(response.json())
        }
        return response.json().then(json => {
          return json;
        })
      });
    return res;
  });
  return response;
}

export function httpGETWithStatus(url, _headers): Object {
  log.info(`----- httpGETWithStatus[`+url+`] -----`)
  _headers['Accept'] = 'application/json';
  _headers['Content-Type'] = 'application/json';

  var response = co(function *() {
    var res = yield fetch(url,{
      method: 'GET',
      headers: _headers
    });

    var json = yield res.json();
    return [json, res]
  });

  return response;
}

export function httpPOSTWithStatus(url, _headers, _body): Object {
  log.info(`----- httpPOST[`+url+`] -----`)
  _headers['Accept'] = 'application/json';
  _headers['Content-Type'] = 'application/json';

  var response = co(function *() {
    var res = yield fetch(url,{
      method: 'POST',
      headers: _headers,
      body: JSON.stringify(_body)
    });
    var json = yield res.json();
    return [json, res]
  });

  return response;
}

/*
// Sample code
import {
  httpGET,
  httpPOST,
} from './httpUtil';

  // GET request
  log.info(`Start to invoke httpGET`);
  var getRes = yield httpGET(`http://ec2-54-162-194-192.compute-1.amazonaws.com/nabipass-login-control/list/testUser`, // url
    { // header
        APIKey: 'eb2ae3ac-6a29-48c2-b27b-639d5a79ae4d'
    });

  log.info(`response : `, getRes);

  // POST request
  log.info(`Start to invoke httpPOST`);
  var postRes = yield httpPOST(`http://ec2-54-162-194-192.compute-1.amazonaws.com/nabipass-login-control/register`, // url
    { // header
       'APIKey': 'eb2ae3ac-6a29-48c2-b27b-639d5a79ae4d'
   },
   { // body
     userKey: `testUser`,
     deviceKey: `Pando Hub`
   });

  log.info(`response : `, postRes);
*/
