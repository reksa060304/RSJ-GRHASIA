export class Configuration {
  static get() {
    if (window.location.hostname.indexOf('192.168.1.6') > -1) {
      return {
        apiBackend: 'http://192.168.1.6/service/',
        headerToken: 'X-AUTH-TOKEN',
      }
    }
    else if (window.location.hostname.indexOf('36.89.243.57') > -1) {
      return {
        apiBackend: 'http://36.89.243.57:51480/service/',
        headerToken: 'X-AUTH-TOKEN',
      }
    } else if (window.location.hostname.indexOf('localhost') > -1) {
      return {
        apiBackend: 'http://localhost:8009/service/',
        headerToken: 'X-AUTH-TOKEN',
      }
    } else {
      return {
        apiBackend: '/service/',
        headerToken: 'X-AUTH-TOKEN',
      }
    }
  }
  static profile() {
      return {
        nama:'RSJ. GRHASIA',
        alamat: 'Jl. Kaliurang KM.17, Duwetsari, Pakembinangun, Kec. Pakem, Kabupaten Sleman, Daerah Istimewa Yogyakarta',
        link: 'https://drive.google.com/file/d/1GCx6WDTTykrGWSFIa6S6guVGRqZR9uQ1/view?usp=sharing',
        kdRekananBPJS:2552,
        kdKelompokBPJS:2,
        consid: '11282',
        secretkey: '8gQ50779E4'
      }
    
  }
}
