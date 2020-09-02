import React from 'react';

import axios from 'axios';

var respData = null;

export function AxiosApi(route, loc, params) {

  params.table = loc


  return new Promise(resolve => {
    try {

      console.log('avant try post',route, loc, params);
      const response = axios
        .post(`http://localhost:8000/${route}`, params)
        .then(resp => {
          if (resp.status >= 400) {
            console.log(resp.status);
            throw new Error(`Bad response from server from /user/${params[1]}`);
          } else {
            console.log('axiospost 1',resp.data);
            return resp.data;
          }
        })
        .then(data => {
          
          respData = data;
console.log('axiospost',respData);
          return resolve(respData);
        });
    } catch (e) {
      console.log(`😱 Axios request failed: ${e}`);

      respData = { err: true, message: 'erreur sur backend consulter log' };
      return resolve(respData);
    }
  });
}

export function AxiosApiGet(route, loc, params) {
  if (route === 'Login' && params[0] === 'account') {
    return new Promise(resolve => {
      try {
        const response = axios
          .get(`http://localhost:8000/user/${params[1]}`)

          .then(resp => {
            if (resp.status >= 400) {
              console.log(resp.status);
              throw new Error(
                `Bad response from server from /user/${params[1]}`,
              );
            } else {
              return resp.data[0];
            }
          })
          .then(data => {
            respData = data;

            return resolve(respData);
          });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);

        respData = { err: true, message: 'erreur sur backend consulter log' };
        return resolve(respData);
      }
    });
  }

  if (route === 'Login' && params[0] === 'agents') {
    return new Promise(resolve => {
      try {
        const response = axios
          .get(`http://localhost:8000/agent/${params[1]}`)

          .then(resp => {
            if (resp.status >= 400) {
              console.log(resp.status);
              throw new Error(
                `Bad response from server from /agent/${params[1]}`,
              );
            } else {
              return resp.data[0];
            }
          })
          .then(data => {
            respData = data;

            return resolve(respData);
          });
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);
        respData = { err: true, message: 'erreur sur backend consulter log' };
        return resolve(respData);
      }
    });
  }

  if (route === 'Login' && params[0] === 'all') {
    return new Promise(resolve => {
      try {
        const response = axios
          .get(`http://localhost:8000/all/${params[1]}`)

          .then(resp => {
            if (resp.status >= 400) {
              console.log(resp.status);
              throw new Error(
                `Bad response from server from /all/${params[1]}`,
              );
            } else {
              return resp.data[0];
            }
          })
          .then(data => {
            respData = data;

            return resolve(respData);
          });
        console.log('response axios', response);
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);

        respData = { err: true, message: 'erreur sur backend consulter log' };
        return resolve(respData);
      }
    });
  }

  if (route === 'clients') {
    return new Promise(resolve => {
      try {
        const response = axios
          .get(`http://localhost:8000/clients`)

          .then(resp => {
            if (resp.status >= 400) {
              console.log(resp.status);
              throw new Error(
                `Bad response from server from /clients`,
              );
            } else {
              return resp.data[0];
            }
          })
          .then(data => {
            respData = data;

            return resolve(respData);
          });
        console.log('response axios', response);
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);

        respData = { err: true, message: 'erreur sur backend consulter log' };
        return resolve(respData);
      }
    });
  }

  if (route === 'delete') {

    return new Promise(resolve => {
      try {
        var paramsServer = {}
loc === 'agent' && (paramsServer = {params:{ id: params[0], email: params[1]}})
loc === 'commercial' && (paramsServer = {params:{ id: params[0], tel1: params[1]}})
loc === 'clients' && (paramsServer = {params:{ idClient: params[0], tel1: params[1]}})

        const response = axios
          .get(`http://localhost:8000/delete/${loc}`, paramsServer)

          .then(resp => {
            if (resp.status >= 400) {
              console.log(resp.status);
              throw new Error(
                `Bad response from server from delete/${loc}/${params[0]}`,
              );
            } else {
              return resp.data[0];
            }
          })
          .then(data => {
            respData = data;

            return resolve(respData);
          });
        console.log('response axios', response);
      } catch (e) {
        console.log(`😱 Axios request failed: ${e}`);

        respData = { err: true, message: 'erreur sur backend consulter log' };
        return resolve(respData);
      }
    });
  }


}
