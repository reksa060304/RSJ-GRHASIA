export class Configuration {
  static get() {
    if (window.location.hostname.indexOf('192.168.1.6') > -1) {
      return {
        apiBackend: 'http://192.168.1.6/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    }
    else if (window.location.hostname.indexOf('36.89.243.57') > -1) {
      return {
        apiBackend: 'http://36.89.243.57:51480/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    } else {
      return {
        apiBackend: 'https://transmedic.co.id:8811/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    }
  }
}
