export class Configuration {
  static get() {
    if (window.location.hostname.indexOf('transmedic') > -1) {
      return {
        apiBackend: 'http://apps.transmedic.co.id:8880/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    } else if (window.location.hostname.indexOf('localhost') > -1) {
      return {
        apiBackend: 'http://localhost:3331/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    } else if (window.location.hostname.indexOf('10.122.250.11') > -1) {
      return {
        apiBackend: 'https://10.122.250.11/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    } else if (window.location.hostname.indexOf('36.92.196.141') > -1) {
      return {
        apiBackend: 'https://36.92.196.141/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    } else {
      return {
        apiBackend: '/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    }
  }
}
