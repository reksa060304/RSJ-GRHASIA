
// home




//RESERVASI ONLINE 
export * from './reservasi/reservasi-online/reservasi-online.component';



// not found
export * from './404/not-found.component';
import * as component from './';
var Cmp = [];
for (var key in component) {
  if (component[key]) {
    if (key.indexOf('Component') > 0) {
      Cmp.push(component[key]);
    }
  }
}

import * as service from './';
var Srv = [];
for (var k in service) {
  if (service[k]) {
    if (k.indexOf('Service') > 0) {
      Srv.push(service[k]);
    }
  }
}


import { pathMaster } from './path';
export const routerModule = pathMaster;
export const ComponentMaster = Cmp;
export const ServiceMaster = Srv;
