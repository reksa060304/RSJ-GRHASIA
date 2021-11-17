export class Configuration {
  static get() {
    if (window.location.hostname.indexOf('apps') > -1) {
      return {
        apiBackend: 'https://apps.transmedic.co.id:8000/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    }
    else if (window.location.hostname.indexOf('172.20') > -1) {
      return {
        apiBackend: 'https://172.20.1.13:8000/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    } else if (window.location.hostname.indexOf('localhost') > -1) {
      return {
        apiBackend: 'http://localhost:8700/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    } else {
      return {
        apiBackend: 'http://localhost:8811/service/',
        headerToken: 'X-AUTH-TOKEN',
        authLogin: ':8400',
      }
    }
  }
}
