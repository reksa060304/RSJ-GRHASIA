define(["initialize", "Configuration"], function (initialize, config) {
  "use strict";
  initialize.controller("CpptREVCtrl", [
    "$q",
    "$rootScope",
    "$scope",
    "ModelItem",
    "$state",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    "$mdDialog",
    "$interval",
    "socket",
    "$ocLazyLoad",
    function (
      $q,
      $rootScope,
      $scope,
      ModelItem,
      $state,
      cacheHelper,
      dateHelper,
      medifirstService,
      $mdDialog,
      $interval,
      socket,
      $ocLazyLoad
    ) {

      // socket.on('set-server-socket', function (e) {
      //   var json = JSON.parse(e);
      //   if (json.name == "sendRefreshCPPT") {
      //     if(json.body.pegawaifk != medifirstService.getPegawaiLogin().id){
      //       loadRiwayat()
      //     }
      //   }
      // })

      var paramsIndex = $state.params.index ?
        parseInt($state.params.index) :
        null;
      // $scope.disabledSimpan = true;
      // $scope.disabledBatal = true;
      $scope.noCM = $state.params.noCM;
      $scope.tombolSimpanVis = true;
      if(medifirstService.getKelompokUser() == 'mahasiswadiklat'){
        $scope.tombolSimpanVis = false
    }
      $scope.totalSkor = 0;
      $scope.totalSkor2 = 0;
      $scope.cc = {};
      var nomorEMR = "-";
      $scope.refreshAutoX = "";
      $scope.SOAP_OLDSCHOOL = {
        // all: [
        //   111355, 111395, 111435, 111480, 111520, 111560, 21040380, 21040383,
        //   21040386, 21040389, 21040392, 21040395, 21040398, 21040401, 21040404,
        //   21040407, 21040410, 21040413, 21040416, 21040419, 21040422, 21040425,
        //   21040428, 21040431, 111350, 111360, 111370, 111380, 111390, 111400,
        //   111410, 111420, 111430, 111440, 111450, 111460, 111475, 111485,
        //   111495, 111505, 111515, 111525, 111535, 111545, 111555, 111565,
        //   111575, 111585, 111351, 111361, 111371, 111381, 111391, 111401,
        //   111411, 111421, 111431, 111441, 111451, 111461, 111476, 111486,
        //   111496, 111506, 111516, 111526, 111536, 111546, 111556, 111566,
        //   111576, 111586, 111354, 111364, 111374, 111384, 111394, 111404,
        //   111414, 111424, 111434, 111444, 111454, 111464, 111479, 111489,
        //   111499, 111509, 111519, 111529, 111539, 111549, 111559, 111569,
        //   111579, 111589, 111355, 111395, 111435, 111480, 111520, 111560,
        //   21040380, 21040383, 21040386, 21040389, 21040392, 21040395, 21040398,
        //   21040401, 21040404, 21040407, 21040410, 21040413, 21040416, 21040419,
        //   21040422, 21040425, 21040428, 21040431, 111356, 111396, 111436,
        //   111481, 111521, 111561, 21040381, 21040384, 21040387, 21040390,
        //   21040393, 21040396, 21040399, 21040402, 21040405, 21040408, 21040411,
        //   21040414, 21040417, 21040420, 21040423, 21040426, 21040429, 21040432,
        //   111357, 111397, 111437, 111482, 111522, 111562, 21040382, 21040385,
        //   21040388, 21040391, 21040394, 21040397, 21040400, 21040403, 21040406,
        //   21040409, 21040412, 21040415, 21040418, 21040421, 21040424, 21040427,
        //   21040430, 21040433,
        // ],
        
        tgljam: [
          111348, 111358, 111368, 111378, 111388, 111398, 111408, 111418,
          111428, 111438, 111448, 111458, 111473, 111483, 111493, 111503,
          111513, 111523, 111533, 111543, 111553, 111563, 111573, 111583,
          //tab 2
          111593, 111603, 111613, 111623, 111633, 111643, 111653, 111663,
          111673, 111683, 111693, 111703, 111717, 111727, 111737, 111747,
          111767, 111777, 111787, 111797, 111807, 111817, 111827,
          // tab 3
          111837, 111847, 111857
        ],
        jenisppa: [
          111349, 111359, 111369, 111379, 111389, 111399, 111409, 111419,
          111429, 111439, 111449, 111459, 111474, 111484, 111494, 111504,
          111514, 111524, 111534, 111544, 111554, 111564, 111574, 111584,
          // tab 2
          111594, 111604, 111614, 111624, 111634, 111644, 111654, 111664,
          111674, 111684, 111694, 111704, 111718, 111728, 111738, 111748,
          111768, 111778, 111788, 111798, 111808, 111818, 111828,
          //tab 3
          111838, 111848, 111858
        ],
        soap: [
          111350, 111360, 111370, 111380, 111390, 111400, 111410, 111420,
          111430, 111440, 111450, 111460, 111475, 111485, 111495, 111505,
          111515, 111525, 111535, 111545, 111555, 111565, 111575, 111585,
          //tab 2
          111595, 111605, 111615, 111625, 111635, 111645, 111655, 111665,
          111675, 111685, 111695, 111705, 111719, 111729, 111739, 111749,
          111769, 111779, 111789, 111799, 111809, 111819, 111829,
          //tab 3
          111839, 111849, 111859
        ],
        tenagamedis: [
          111351, 111361, 111371, 111381, 111391, 111401, 111411, 111421,
          111431, 111441, 111451, 111461, 111476, 111486, 111496, 111506,
          111516, 111526, 111536, 111546, 111556, 111566, 111576, 111586,
          // tab 2
          111596, 111606, 111616, 111626, 111636, 111646, 111656, 111666,
          111676, 111686, 111696, 111706, 111720, 111730, 111740, 111750,
          111770, 111780, 111790, 111800, 111810, 111820, 111830,
          //tab 3
          111840, 111850, 111860
        ],
        ppa: [
          111354, 111364, 111374, 111384, 111394, 111404, 111414, 111424,
          111434, 111444, 111454, 111464, 111479, 111489, 111499, 111509,
          111519, 111529, 111539, 111549, 111559, 111569, 111579, 111589,
          // tab 2
          111599, 111609, 111619, 111629, 111639, 111650, 111659, 111669,
          111679, 111689, 111699, 111709, 111723, 111733, 111743, 111753,
          111773, 111783, 111793, 111803, 111813, 111823, 111833,
          //tab 2
          111843, 111853, 111863
        ],

        dpjp: [
          111355, 111395, 111435, 111480, 111520, 111560, 21040380, 21040383,
          21040386, 21040389, 21040392, 21040395, 21040398, 21040401, 21040404,
          21040407, 21040410, 21040413, 21040416, 21040419, 21040422, 21040425,
          21040428, 21040431,
          // tab 2
          111600, 111610, 111620, 111630, 111640, 111649, 111660, 111670,
          111680, 111690, 111700, 111710, 111724, 111734, 111744, 111754,
          111774, 111784, 111794, 111804, 111814, 111824, 111834,
          //tab 3
          111844, 111854, 111864
        ],
        tgldpjp: [
          111356, 111396, 111436, 111481, 111521, 111561, 21040381, 21040384,
          21040387, 21040390, 21040393, 21040396, 21040399, 21040402, 21040405,
          21040408, 21040411, 21040414, 21040417, 21040420, 21040423, 21040426,
          21040429, 21040432,
          // tab 2
          111601, 111611, 111621, 111631, 111641, 111651, 111661, 111671,
          111681, 111691, 111701, 111711, 111725, 111735, 111745, 111755,
          111775, 111785, 111795, 111805, 111815, 111825, 111835,
          //tab 3
          111845, 111855, 111865
        ],
        dropdpjp: [
          111357, 111397, 111437, 111482, 111522, 111562, 21040382, 21040385,
          21040388, 21040391, 21040394, 21040397, 21040400, 21040403, 21040406,
          21040409, 21040412, 21040415, 21040418, 21040421, 21040424, 21040427,
          21040430, 21040433,
          //tab 2
          111602, 111612, 111622, 111632, 111642, 111652, 111662, 111672,
          111682, 111692, 111702, 111712, 111726, 111736, 111746, 111756,
          111776, 111786, 111796, 111806, 111816, 111826, 111836,
          //tab 3
          111846, 111856, 111866
        ],
      };
      $scope.listCPPTNEW = [{
          id: 31700500,
          name: "Tanggal/Jam"
        },
        {
          id: 31700501,
          name: "SOAP"
        },
        {
          id: 31700502,
          name: "Tenaga Kesehatan"
        },
        {
          id: 31700503,
          name: "Intruksi PPA"
        },
        {
          id: 31700504,
          name: "Verif DPJP Text"
        },
        {
          id: 31700505,
          name: "Verif DPJP Tgl"
        },
        {
          id: 31700506,
          name: "DPJP"
        },
      ];
      $scope.listItemREV = [{
          norec: null,
          tgljam: new Date(),
          soap: null,
          tenagamedis: null,
          ppa: null,
          jenisppa: null,
            jenisppa2: null,
          dpjp: null,
          tgldpjp: null,
          dropdpjp: null,
          tgljam2: null,
          soap2: null,
          tenagamedis2: null,
          ppa2: null,
          dpjp2: null,
          tgldpjp2: null,
          dropdpjp2: null,
        },
        // { index: 1,tgljam: $scope.listCPPTNEW[0].id,soap: $scope.listCPPTNEW[1].id,tenagamedis: $scope.listCPPTNEW[2].id }
      ];
      $scope.waktuRefreshMenit = 10;
      $scope.mouseMoveResetTimeCPPT = "false";
      var x;
      async function settingDataFixedAuto() {
        await medifirstService
          .get("emr/get-setting-cppt")
          .then(async function (dat) {
            $scope.mouseMoveResetTimeCPPT = dat.data.mouseMoveResetTimeCPPT;
            $scope.waktuRefreshMenit = parseInt(dat.data.menitAutoRefreshCPPT);
            // $scope.start();
          });
      }

      $scope.countDownDate = new Date(
        new Date().getTime() + $scope.waktuRefreshMenit * 60000
      ).getTime();

      $scope.stop = function () {
        $scope.countDownDate = new Date(
          new Date().getTime() + $scope.waktuRefreshMenit * 60000
        ).getTime();
        $scope.refreshAutoX = "";
        $interval.cancel(x);
      };
      $scope.start = function () {
        $scope.stop();
        x = $interval(setAutoRefreshTimer, 1000);
      };
      settingDataFixedAuto();

      onmouseover = (event) => {
        if ($scope.mouseMoveResetTimeCPPT == "true") {
          // $scope.start();
        }
      };

      function setAutoRefreshTimer() {
        var now = new Date().getTime();
        var distance = $scope.countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $scope.refreshAutoX = minutes + " menit " + seconds + " detik ";
        // console.log($scope.refreshAutoX  );

        if (distance < 0) {
          // $scope.start()
          $scope.refreshAutoX = "";
          if (statusConfirm == true) {
            showRefresh();
          }
        }
      }
      var statusConfirm = true;

      function showRefresh() {
        statusConfirm = false;
        var confirm = $mdDialog
          .confirm()
          .title("Info")
          .textContent(
            "Data sudah terlalu lama dibiarkan, klik OK untuk memperbaharui data"
          )
          .ariaLabel("Lucky day")
          .cancel("Tidak")
          .ok("Ya");
        $mdDialog.show(confirm).then(
          function (e) {
            // $scope.start();
            statusConfirm = true;
            loadRiwayat();

          },
          
        );
      }
      $scope.cc.emrfk = [443,444,445];
      var dataLoad = [];
      $scope.isCetak = true;
      $scope.isCetakV = true;
      var norecEMR = "";
      $scope.show = true;
      var pegawaiLogin = medifirstService.getPegawaiLogin();
      $scope.listItem = [{
          id: 111348,
          inuse: true
        },
        {
          id: 111358
        },
        {
          id: 111368
        },
        {
          id: 111378
        },
        {
          id: 111388
        },
        {
          id: 111398
        },
        {
          id: 111408
        },
        {
          id: 111418
        },
        {
          id: 111428
        },
        {
          id: 111438
        },
        {
          id: 111448
        },
        {
          id: 111458
        },
        {
          id: 111473
        },
        {
          id: 111483
        },
        {
          id: 111493
        },
        {
          id: 111503
        },
        {
          id: 111513
        },
        {
          id: 111523
        },
        {
          id: 111533
        },
        {
          id: 111543
        },
        {
          id: 111553
        },
        {
          id: 111563
        },
        {
          id: 111573
        },
        {
          id: 111583
        },
      ];
      $scope.CPPTNEWWW = false
      // var peagawaiLogin = medifirstService.getPegawaiLogin()
      var cacheNomorEMR = cacheHelper.get("cacheNomorEMR");
      var cacheNoREC = cacheHelper.get("cacheNOREC_EMR");
      if (cacheNoREC != undefined) {
        norecEMR = cacheNomorEMR[1];
      }
      if (cacheNomorEMR != undefined) {
        nomorEMR = cacheNomorEMR[0];
        norecEMR = cacheNomorEMR[1];
        $scope.cc.norec_emr = nomorEMR;
      }
      var HttpClient = function () {
        this.get = function (aUrl, aCallback) {
          var anHttpRequest = new XMLHttpRequest();
          anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
              aCallback(anHttpRequest.responseText);
          };

          anHttpRequest.open("GET", aUrl, true);
          anHttpRequest.send(null);
        };
      };
      $scope.addNewItem = function () {
        let pegawai = JSON.parse(localStorage.getItem("pegawai"));
        if (
          $scope.listPegawai == undefined
          // ||
          // $scope.listPegawai._data.length == 0
        ) {
          $scope.listPegawai = [{
            value: pegawai.id,
            text: pegawai.namaLengkap,
          }];
        }
        var soap = ''
        if (pegawai.jenisPegawai.jenispegawai == 'Dokter' || pegawai.jenisPegawai.jenispegawai == 'Perawat') {
          soap = 'S : \n\nO : \n\nA : \n\nP : '
        }
        $scope.listItemREV.push({
          index: $scope.listItemREV.length + 1,
          jenisppa: {
            value: pegawai.jenisPegawai.id,
            text: pegawai.jenisPegawai.jenispegawai,
          },
          tenagamedis: {
            value: pegawai.id,
            text: pegawai.namaLengkap
          },
          tgljam: new Date(),
          soap: soap,
          dpjp: null,
          tgldpjp: null,
          dropdpjp: null
        });
        // $scope.listItemREV[ $scope.listItemREV.length + 1].tenagamedis = { value: pegawai.id, text: pegawai.namaLengkap }
        // $scope.listItemREV[ $scope.listItemREV.length + 1].tgljam = $scope.now
      };
      $scope.removeItem = function (index) {
        $scope.listItemREV.splice(index, 1);
      };
      $scope.cetakPdf = function () {
        if (norecEMR == "") return;
        var client = new HttpClient();
        client.get(
          "http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cppt-ranap&id=" +
          $scope.cc.nocm +
          "&norec_apd=" +
          $scope.cc.norec +
          "&emr=" +
          norecEMR +
          "&view=true",
          function (response) {
            // do something with response
          }
        );
      };
      medifirstService
        .getPart("emr/get-datacombo-part-pegawai", true, true, 20)
        .then(function (data) {
          $scope.listPegawai = data;
        });

      medifirstService
        .getPart("emr/get-datacombo-part-kelas", true, true, 20)
        .then(function (data) {
          $scope.listKelas = data;
        });
      medifirstService
        .getPart("emr/get-datacombo-part-ruangan-pelayanan", true, true, 20)
        .then(function (data) {
          $scope.listRuang = data;
        });

      medifirstService
        .getPart(
          "sysadmin/general/get-datacombo-jenispegawai-cppt",
          true,
          true,
          20
        )
        .then(function (data) {
          $scope.listJenisPegawai = data;
        });

      var cacheNomorEMR = cacheHelper.get("cacheNomorEMR");
      if (cacheNomorEMR != undefined) {
        nomorEMR = cacheNomorEMR[0];
        $scope.cc.norec_emr = nomorEMR;
      }

      var chacePeriode = cacheHelper.get("cacheRekamMedis");
      if (chacePeriode != undefined) {
        $scope.cc.nocm = chacePeriode[0];
        $scope.cc.namapasien = chacePeriode[1];
        $scope.cc.jeniskelamin = chacePeriode[2];
        $scope.cc.noregistrasi = chacePeriode[3];
        $scope.cc.umur = chacePeriode[4];
        $scope.cc.kelompokpasien = chacePeriode[5];
        $scope.cc.tglregistrasi = chacePeriode[6];
        $scope.cc.norec = chacePeriode[7];
        $scope.cc.norec_pd = chacePeriode[8];
        $scope.cc.objectkelasfk = chacePeriode[9];
        $scope.cc.namakelas = chacePeriode[10];
        $scope.cc.objectruanganfk = chacePeriode[11];
        $scope.cc.namaruangan = chacePeriode[12];
        $scope.cc.DataNoregis = chacePeriode[12];
        $scope.cc.dokterdpjp = chacePeriode[16];
        $scope.cc.iddpjp = chacePeriode[17];
        if (nomorEMR == "-") {
          $scope.cc.norec_emr = "-";
        } else {
          $scope.cc.norec_emr = nomorEMR;
        }
      }
      var chekedd = false;
      // medifirstService.get("emr/get-rekam-medis-dynamic?emrid="+ $scope.cc.emrfk).then(function (e) {
      //   $scope.listItem = e.data.kolom4

      $scope.item.obj = [];
      $scope.item.obj2 = [];
      loadRiwayat();
      async function loadRiwayat() {
        if (nomorEMR == "-") {

          $scope.item.tgljamdatang = $scope.cc.tglregistrasi;
          $scope.item.dpjputama = {
            value: $scope.cc.iddpjp,
            text: $scope.cc.dokterdpjp
          };
          $scope.item.bangsal = {
            value: $scope.cc.objectruanganfk,
            text: $scope.cc.namaruangan
          };
          $scope.item.kelas = {
            value: $scope.cc.objectkelasfk,
            text: $scope.cc.namakelas
          }
          let pegawai = JSON.parse(localStorage.getItem("pegawai"));
          if (
            $scope.listPegawai == undefined
            // ||
            // $scope.listPegawai._data.length == 0
          ) {
            $scope.listPegawai = [{
              value: pegawai.id,
              text: pegawai.namaLengkap,
            }];
          }
          var soap = ''
          if (pegawai.jenisPegawai.jenispegawai == 'Dokter' || pegawai.jenisPegawai.jenispegawai == 'Perawat') {
            soap = 'S : \n\nO : \n\nA : \n\nP : '
          }
          if ($scope.listItemREV.length) {
            $scope.listItemREV[0] = {
              index: $scope.listItemREV.length + 1,
              tenagamedis: {
                value: pegawai.id,
                text: pegawai.namaLengkap
              },
              jenisppa: {
                value: pegawai.jenisPegawai.id,
                text: pegawai.jenisPegawai.jenispegawai,
              },
              tgljam: new Date(),
              soap: soap,
              dpjp: null,
              tgldpjp: null,
              dropdpjp: null
            };
          }

          return;
        }

        let cek = await medifirstService.get(
          "emr/get-emr-cppt-cek?noemr=" + nomorEMR
        );
        if (
          cek.data.data != null &&
          cek.data.data.isnewcppt != null &&
          cek.data.data.isnewcppt == true
        ) {
          $scope.CPPTNEWWW = true
          await medifirstService
            .get(
              "emr/get-emr-cppt?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk
            )
            .then(async function (response) {
              // $scope.start();
              await medifirstService
                .getPart("emr/get-datacombo-part-pegawai", true, true, 20)
                .then(async function (data) {
                  $scope.listPegawai = data;
                });

              let resp = response.data.data;
              if (resp.length) {
                for (let xxx = 0; xxx < resp.length; xxx++) {
                  const element = resp[xxx];
                  if (element.tgljamdatang != null) {
                    $scope.item.tgljamdatang = new Date(element.tgljamdatang);
                  }
                  if (element.dpjputama != null) {
                    var str = element.dpjputama;
                    if (str != undefined) {
                      var res = str.split("~");
                      $scope.item.dpjputama = {
                        value: res[0],
                        text: res[1],
                      };
                    }
                  }
                  if (element.bangsal != null) {
                    var str = element.bangsal;
                    if (str != undefined) {
                      var res = str.split("~");
                      $scope.item.bangsal = {
                        value: res[0],
                        text: res[1],
                      };
                    }
                  }
                  if (element.kelas != null) {
                    var str = element.kelas;
                    if (str != undefined) {
                      var res = str.split("~");
                      $scope.item.kelas = {
                        value: res[0],
                        text: res[1],
                      };
                    }
                  }
                }
              }


              $scope.listItemREV = [];
              let arr = [];
              for (let xx = 0; xx < response.data.data.length; xx++) {
                const element = response.data.data[xx];
                var tenagamedis =
                  element.tenagamedis != null ?
                  element.tenagamedis.split("~") :
                  null;
                var dropdpjp =
                  element.dropdpjp != null ? element.dropdpjp.split("~") : null;
                  var jenisppa =
                    element.jenisppa != null ? element.jenisppa.split("~") : null;

                arr.push({
                  norec: element.norec,
                  tgljam: element.tgljam != null ? new Date(element.tgljam) : null,
                  soap: element.soap != null ? element.soap : null,
                  tenagamedis: element.tenagamedis != null ?
                    {
                      value: tenagamedis[0],
                      text: tenagamedis[1],
                    } :
                    null,
                  ppa: element.ppa != null ? element.ppa : null,
                  dpjp: element.dpjp != null ? element.dpjp : null,
                  tgldpjp: element.tgldpjp != null ? new Date(element.tgldpjp) : null,
                  dropdpjp: element.dropdpjp != null ?
                    {
                      value: dropdpjp[0],
                      text: dropdpjp[1],
                    } :
                    null,
                    jenisppa: element.jenisppa != null ? {
                        value: jenisppa[0],
                        text: jenisppa[1],
                      } :
                      null,
                });
              }
              for (var i = 0; i <= arr.length - 1; i++) {
                var element = arr[i];
                element.tgljam2 = false;
                element.soap2 = false;
                element.tenagamedis2 = false;
                element.ppa2 = false;
                element.dpjp2 = false;
                element.tgldpjp2 = false;
                element.dropdpjp2 = false;
                element.jenisppa2 = false;
                if (element.tenagamedis != null) {
                  if (pegawaiLogin.id != element.tenagamedis.value) {
                    element.tgljam2 = true;
                    element.soap2 = true;
                    element.tenagamedis2 = true;
                    element.ppa2 = true;
                    element.jenisppa2 = true;
                    // element.dpjp2 = true;
                    // element.tgldpjp2 = true;
                    // element.dropdpjp2 = true;
                  }
                  if (element.dropdpjp != null) {
                    if (pegawaiLogin.id != element.dropdpjp.value) {
                      element.dropdpjp2 = true;
                      if (element.dpjp != null && element.tgldpjp != null) {
                        element.dpjp2 = true;
                        element.tgldpjp2 = true;
                      }

                    }
                  }
                }
              }
              $scope.listItemREV = arr;
            });
        } else {
          var obj = {
            noemr: nomorEMR,
            emrfk: $scope.cc.emrfk
          }
          await medifirstService
            .postNonMessage(
              "emr/get-emr-transaksi-details",
              obj
            )
            .then(async function (dat) {
              // get dulu listPegawainya
              // $scope.start();
              await medifirstService
                .getPart("emr/get-datacombo-part-pegawai", true, true, 20)
                .then(async function (data) {
                  $scope.listPegawai = data;
                });

              // if (dat.data.data.length > 0) {
              //   if (dat.data.data[0].emrfk != $scope.cc.emrfk) {
              //     return
              //   }
              // }
              console.log(dat);
              dataLoad = dat.data.data;
              if (dataLoad.length == 0) return
              $scope.item.tgljamdatang = $scope.cc.tglregistrasi;
              $scope.item.dpjputama = {
                value: $scope.cc.iddpjp,
                text: $scope.cc.dokterdpjp,
              };
              $scope.item.bangsal = {
                value: $scope.cc.objectruanganfk,
                text: $scope.cc.namaruangan,
              };
              $scope.item.kelas = {
                value: $scope.cc.objectkelasfk,
                text: $scope.cc.namakelas,
              };
              for (let i = 0; i < dataLoad.length; i++) {
                const element = dataLoad[i];
                element.nourut = parseInt(element.nourut);
              }
              dataLoad.sort(function (a, b) {
                if (a.nourut < b.nourut) {
                  return -1;
                }
                if (a.nourut > b.nourut) {
                  return 1;
                }
                return 0;
              });
              var arrayPUSH = [];
              for (let zz = 0; zz < $scope.listBaris.length; zz++) {
                arrayPUSH.push({
                  null: null,
                  emrdfk: $scope.listBaris[zz].id,
                  emrfk: $scope.listBaris[zz].emrfk,
                  tenagamedis: null,
                });
              }

              for (var i = 0; i <= dataLoad.length - 1; i++) {
                if (
                  parseFloat($scope.cc.emrfk[0]) == dataLoad[i].emrfk ||
                  parseFloat($scope.cc.emrfk[1]) == dataLoad[i].emrfk ||
                  parseFloat($scope.cc.emrfk[2]) == dataLoad[i].emrfk
                  // &&
                  // paramsIndex == dataLoad[i].index
                ) {
                  setCPPTLAMA(dataLoad[i], arrayPUSH);
                  
                }
              }
              var a = arrayPUSH.filter(obj => obj.tenagamedis !== null)
              $scope.listItemREV = a;
              console.log($scope.listItemREV);
              for (var i = 0; i <= dataLoad.length - 1; i++) {
                if (
                  parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk &&
                  paramsIndex == dataLoad[i].index
                ) {
                  for (let z = 0; z < $scope.listBaris.length; z++) {
                    const element = $scope.listBaris[z];
                    if (dataLoad[i].emrdfk == element.id) {
                      var str = dataLoad[i].value;
                      if (str != undefined) {
                        var res = str.split("~");
                        if (pegawaiLogin.id != res[0]) {
                          for (let x = 0; x < element.child.length; x++) {
                            const element2 = element.child[x];
                            if ($scope.item.obj[element2] != undefined) {
                              $scope.item.obj2[element2] = true;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

              for (var i = 0; i <= $scope.listItemREV.length - 1; i++) {
                if (
                  parseFloat($scope.cc.emrfk) == $scope.listItemREV[i].emrfk &&
                  1 == dataLoad[i].index
                ) {
                  for (let z = 0; z < $scope.listBaris.length; z++) {
                    const element = $scope.listBaris[z];
                    if (dataLoad[i].emrdfk == element.id) {
                      var str = dataLoad[i].value;
                      if (str != undefined) {
                        var res = str.split("~");
                        if (pegawaiLogin.id != res[0]) {
                          for (let x = 0; x < element.child.length; x++) {
                            const element2 = element.child[x];
                            if ($scope.item.obj[element2] != undefined) {
                              $scope.item.obj2[element2] = true;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

              var arrobj = Object.keys($scope.item.obj);
              for (let l = 0; l < $scope.listItem.length; l++) {
                const element = $scope.listItem[l];
                for (let m = 0; m < arrobj.length; m++) {
                  const element2 = arrobj[m];
                  if (element.id == element2) {
                    element.inuse = true;
                  }
                }
              }
              // $scope.disabledSimpan = true;
              // $scope.disabledBatal = true;
              // setTimeout(function(){medifirstService.setDisableAllInputElement()  }, 2000);
            });
        }
      }
      // })
      function setCPPTLAMA(dataLoad, arrayPUSH) {
        if (dataLoad.index == null) {
          if (dataLoad.emrdfk == 111468) {
            $scope.item.tgljamdatang = setTYPE(dataLoad);
            var str = dataLoad.value;
            if (str != undefined) {
              var res = str.split("~");
              if (pegawaiLogin.id != res[0]) {
                $scope.item.tgljamdatang2 = true;
              }
            }
          }
          if (dataLoad.emrdfk == 111469) {
            $scope.item.dpjputama = setTYPE(dataLoad);
            var str = dataLoad.value;
            if (str != undefined) {
              var res = str.split("~");
              if (pegawaiLogin.id != res[0]) {
                $scope.item.dpjputama2 = true;
              }
            }
          }
          if (dataLoad.emrdfk == 111470) {
            $scope.item.bangsal = setTYPE(dataLoad);
            var str = dataLoad.value;
            if (str != undefined) {
              var res = str.split("~");
              if (pegawaiLogin.id != res[0]) {
                $scope.item.bangsal2 = true;
              }
            }
          }
          if (dataLoad.emrdfk == 111471) {
            $scope.item.kelas = setTYPE(dataLoad);
            var str = dataLoad.value;
            if (str != undefined) {
              var res = str.split("~");
              if (pegawaiLogin.id != res[0]) {
                $scope.item.kelas2 = true;
              }
            }
          }
          for (let z = 0; z < $scope.listBaris.length; z++) {
            if ($scope.listBaris[z].child.includes(dataLoad.emrdfk) == true ) {
              if (arrayPUSH[z] == undefined) {
                arrayPUSH.push({
                  norec: null,
                  tgljam: null,
                  soap: null,
                  tenagamedis: null,
                  ppa: null,
                  dpjp: null,
                  tgldpjp: null,
                  jenisppa: null,
                  jenisppa2: null,
                  dropdpjp: null,
                  tgljam2: null,
                  soap2: null,
                  tenagamedis2: null,
                  ppa2: null,
                  dpjp2: null,
                  tgldpjp2: null,
                  dropdpjp2: null,
                });
              }
              
              if (
                $scope.SOAP_OLDSCHOOL.tgljam.includes(dataLoad.emrdfk) == true
              ) {
                
                arrayPUSH[z].tgljam = setTYPE(dataLoad);
                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].tgljam2 = true;
                  }
                }
              }
              if (
                $scope.SOAP_OLDSCHOOL.jenisppa.includes(dataLoad.emrdfk) == true
              ) {
                arrayPUSH[z].jenisppa = setTYPE(dataLoad);
                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].jenisppa2 = true;
                  }
                }
              }
              if (
                $scope.SOAP_OLDSCHOOL.soap.includes(dataLoad.emrdfk) == true
              ) {
                arrayPUSH[z].soap = setTYPE(dataLoad);
                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].soap2 = true;
                  }
                }
              }
              if (
                $scope.SOAP_OLDSCHOOL.tenagamedis.includes(dataLoad.emrdfk) ==
                true
              ) {
                arrayPUSH[z].tenagamedis = setTYPE(dataLoad);

                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].tenagamedis2 = true;
                  }
                }
              }
              if ($scope.SOAP_OLDSCHOOL.ppa.includes(dataLoad.emrdfk) == true) {
                arrayPUSH[z].ppa = setTYPE(dataLoad);
                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].ppa2 = true;
                  }
                }
              }
              if (
                $scope.SOAP_OLDSCHOOL.dpjp.includes(dataLoad.emrdfk) == true
              ) {
                arrayPUSH[z].dpjp = setTYPE(dataLoad);

                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].dpjp2 = true;
                  }
                }
              }
              if (
                $scope.SOAP_OLDSCHOOL.tgldpjp.includes(dataLoad.emrdfk) == true
              ) {
                arrayPUSH[z].tgldpjp = setTYPE(dataLoad);

                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].tgldpjp2 = true;
                  }
                }
              }
              if (
                $scope.SOAP_OLDSCHOOL.dropdpjp.includes(dataLoad.emrdfk) == true
              ) {
                arrayPUSH[z].dropdpjp = setTYPE(dataLoad);

                var str = dataLoad.value;
                if (str != undefined) {
                  var res = str.split("~");
                  if (pegawaiLogin.id != res[0]) {
                    arrayPUSH[z].dropdpjp2 = true;
                  }
                }
              }
              
            } 
          }
        }
      }

      function setTYPE(source) {
        if (source.type == "textbox") {
          return source.value;
        }
        if (source.type == "checkbox") {
          chekedd = false;
          if (source.value == "1") {
            chekedd = true;
          }
          return chekedd;
        }

        if (source.type == "datetime") {
          return new Date(source.value);
        }
        if (source.type == "datetime2") {
          return new Date(source.value);
        }
        if (source.type == "time") {
          return new Date(source.value);
        }
        if (source.type == "date") {
          return new Date(source.value);
        }
        if (source.type == "combobox") {
          var str = source.value;
          if (str != undefined) {
            var res = str.split("~");
            return {
              value: res[0],
              text: res[1],
            };
          }
        }
        if (source.type == "checkboxtextbox") {
          return source.value;
        }
        if (source.type == "checkboxtextarea") {
          return source.value;
        }
        if (source.type == "textarea") {
          return source.value;
        }
      }
      $scope.getTTD = function(index, data){
        medifirstService
          .getPart("emr/get-datacombo-part-pegawai", true, true, 20)
          .then(function (data) {
            $scope.listPegawai = data;
          });
        let pegawai = JSON.parse(localStorage.getItem("pegawai"));
            if(data.dpjp != null){
              data.tgldpjp = new Date()
              data.dropdpjp = {
                value: pegawai.id,
                text: pegawai.namaLengkap
              }
            }
        
      }

      $scope.Batal = function () {
        $scope.item.obj = [];
      };
      $scope.kembali = function () {
        $rootScope.showRiwayat();
      };

      $scope.Save = function () {
        var arrSave = [];
        for (let x = 0; x < $scope.listItemREV.length; x++) {
          const element = $scope.listItemREV[x];
          if (element.tenagamedis2 == null || element.tenagamedis2 == false && $scope.CPPTNEWWW == true) {


            arrSave.push({
              norec: element.norec != null ? element.norec : "",
              tgljam: element.tgljam != undefined ?
                moment(element.tgljam).format("YYYY-MM-DD HH:mm:ss") :
                null,
              soap: element.soap != undefined ? element.soap : null,
              tenagamedis: element.tenagamedis != undefined ?
                element.tenagamedis.value + "~" + element.tenagamedis.text :
                null,
              ppa: element.ppa != undefined ? element.ppa : null,
              jenisppa: element.jenisppa != undefined ?
                element.jenisppa.value + "~" + element.jenisppa.text :
                null,
              // jenisppa: element.jenisppa != undefined ? element.jenisppa : null,
              dpjp: element.dpjp != undefined ? element.dpjp : null,
              tgldpjp: element.tgldpjp != undefined ?
                moment(element.tgldpjp).format("YYYY-MM-DD HH:mm:ss") :
                null,
              dropdpjp: element.dropdpjp != undefined ?
                element.dropdpjp.value + "~" + element.dropdpjp.text :
                null,
              tgljamdatang: $scope.item.tgljamdatang != undefined ?
                moment($scope.item.tgljamdatang).format("YYYY-MM-DD HH:mm:ss") :
                null,
              dpjputama: $scope.item.dpjputama != undefined ?
                $scope.item.dpjputama.value + "~" + $scope.item.dpjputama.text :
                null,
              bangsal: $scope.item.bangsal != undefined ?
                $scope.item.bangsal.value + "~" + $scope.item.bangsal.text :
                null,
                kelas: $scope.item.kelas != undefined ?
                  $scope.item.kelas.value + "~" + $scope.item.kelas.text :
                  null,
            });
          } else {
            arrSave.push({
              norec: element.norec != null ? element.norec : "",
              tgljam: element.tgljam != undefined ?
                moment(element.tgljam).format("YYYY-MM-DD HH:mm:ss") :
                null,
              soap: element.soap != undefined ? element.soap : null,
              tenagamedis: element.tenagamedis != undefined ?
                element.tenagamedis.value + "~" + element.tenagamedis.text :
                null,
                jenisppa: element.jenisppa != undefined ?
                  element.jenisppa.value + "~" + element.jenisppa.text :
                  null,
              ppa: element.ppa != undefined ? element.ppa : null,
              // jenisppa: element.jenisppa != undefined ? element.jenisppa : null,
              dpjp: element.dpjp != undefined ? element.dpjp : null,
              tgldpjp: element.tgldpjp != undefined ?
                moment(element.tgldpjp).format("YYYY-MM-DD HH:mm:ss") :
                null,
              dropdpjp: element.dropdpjp != undefined ?
                element.dropdpjp.value + "~" + element.dropdpjp.text :
                null,
              tgljamdatang: $scope.item.tgljamdatang != undefined ?
                moment($scope.item.tgljamdatang).format("YYYY-MM-DD HH:mm:ss") :
                null,
              dpjputama: $scope.item.dpjputama != undefined ?
                $scope.item.dpjputama.value + "~" + $scope.item.dpjputama.text :
                null,
              bangsal: $scope.item.bangsal != undefined ?
                $scope.item.bangsal.value + "~" + $scope.item.bangsal.text :
                null,
                kelas: $scope.item.kelas != undefined ?
                $scope.item.kelas.value + "~" + $scope.item.kelas.text :
                null,
            });
          }
        }

        // var arrobj = Object.keys($scope.item.obj);
        // var arrSave = [];
        // for (var i = arrobj.length - 1; i >= 0; i--) {
        //   if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
        //     $scope.item.obj[parseInt(arrobj[i])] = moment(
        //       $scope.item.obj[parseInt(arrobj[i])]
        //     ).format("YYYY-MM-DD HH:mm");
        //   // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
        //   arrSave.push({
        //     id: arrobj[i],
        //     values: $scope.item.obj[parseInt(arrobj[i])],
        //   });
        // }
        // $scope.cc.index = $state.params.index;
        $scope.cc.jenisemr = "asesmen";
        var jsonSave = {
          head: $scope.cc,
          data: arrSave,
        };
        medifirstService.post("emr/save-emr-cppt", jsonSave).then(function (e) {
          var confirm = $mdDialog.confirm()
                        .title('Informasi')
                        .textContent('EMR SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI')
                        .ariaLabel('Lucky day')
                        .cancel('')
                        .ok('Ya')
                    $mdDialog.show(confirm).then(function () {
                      medifirstService
                      .postLogging(
                        "EMR",
                        "norec emrpasien_t",
                        e.data.data.norec,
                        "Cppt rawat inap Versi 2 " +
                        " dengan No EMR - " +
                        e.data.data.noemr +
                        " Sudah Klik ya pada popup No Registrasi " +
                        $scope.cc.noregistrasi
                      )
                      .then(function (res) {});
                    })
          var pegLogin = medifirstService.getPegawaiLogin()
          var body = {
            norec: e.data.data.norec,
            noemr: e.data.data.noemr,
            pegawaifk: pegLogin.id,
            pegawai: pegLogin.namaLengkap,
          }
          //  medifirstService.sendSocket("sendRefreshCPPT", body);
          // $scope.disabledBatal = true;
          // $scope.disabledSimpan = true;
          nomorEMR = e.data.data.noemr;
          $rootScope.loadRiwayat();
          medifirstService
            .postLogging(
              "EMR",
              "norec emrpasien_t",
              e.data.data.norec,
              "Cppt rawat inap new " +
              " dengan No EMR - " +
              e.data.data.noemr +
              " pada No Registrasi " +
              $scope.cc.noregistrasi
            )
            .then(function (res) {});
          $scope.cc.norec_emr = e.data.data.noemr;
          var arrStr = {
            0: e.data.data.noemr,
          };
          cacheHelper.set("cacheNomorEMR", arrStr);
          loadRiwayat();
        });
      };
      $scope.tambah = function () {
        let details = [];
        for (let i = 0; i < $scope.listItem.length; i++) {
          const element = $scope.listItem[i];
          if (element.inuse == undefined) {
            details.push(element.id);
          }
        }
        if (details.length == 0) {
          $rootScope.showCppt2 = true;

          toastr.info("Isi di Tab Berikutnya");
          $rootScope.tabIndex("+");
          return;
        }
        let json = {
          noemr: nomorEMR,
          emrfk: $scope.cc.emrfk,
          index: $state.params.index,
          details: details,
        };
        medifirstService
          .postNonMessage("emr/get-status-dipake", json)
          .then(function (dat) {
            let result = dat.data.data;
            for (let j = 0; j < $scope.listItem.length; j++) {
              const element = $scope.listItem[j];
              for (let x = 0; x < result.length; x++) {
                const element2 = result[x];
                if (element.id == element2.emrdfk) {
                  element.inuse = true;
                }
              }
            }

            for (let j = 0; j < $scope.listItem.length; j++) {
              const element2 = $scope.listItem[j];
              if (element2.inuse == undefined) {
                $scope.item.obj[parseInt(element2.id)] = new Date();
                saveTosDipake(element2.id);
                break;
              }
            }
          });

        // medifirstService.get("emr/get-sttaus-transaksi-detail?noemr=" + nomorEMR + "&emrfk=" + $scope.cc.emrfk, true).then(function (dat) {
        // })
      };

      function saveTosDipake(id) {
        if (nomorEMR != "-") {
          let json = {
            noemr: nomorEMR,
            emrfk: $scope.cc.emrfk,
            index: $state.params.index,
            id: id,
            value: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
          };
          medifirstService
            .postNonMessage("emr/save-status-dipake", json)
            .then(function (dat) {
              $scope.disabledSimpan = false;
              $scope.disabledBatal = true;
            });
        }
      }
      $scope.cetakBlade = function () {
        if (norecEMR == "") return;

        var local = JSON.parse(localStorage.getItem("profile"));
        var nama = medifirstService.getPegawaiLogin().namaLengkap;

        window.open(
          config.baseApiBackend +
          "report/cetak-cppt-ranap-rev?nocm=" +
          $scope.cc.nocm +
          "&norec_apd=" +
          $scope.cc.norec +
          "&emr=" +
          norecEMR +
          "&emrfk=" +
          nomorEMR +
          "&kdprofile=" +
          local.id +
          "&nama=" +
          nama,
          "_blank"
        );
      };
      $(window).bind("beforeunload", function () {
        if ($scope.disabledSimpan == false) {
          return "Anda yakin meninggalkan laman ini? Perubahan yang Anda lakukan mungkin tidak disimpan.";
        }
      });

      // $scope.$watch("item.obj[31700500]", function (x, y) {
      //   if (x != y) {
      //     $scope.disabledSimpan = false;
      //     $scope.disabledBatal = true;
      //   }
      // });
      // $scope.$watch("item.obj[31700501]", function (x, y) {
      //   if (x != y) {
      //     $scope.disabledSimpan = false;
      //     $scope.disabledBatal = true;
      //   }
      // });
      // $scope.$watch("item.obj[31700502]", function (x, y) {
      //   if (x != y) {
      //     $scope.disabledSimpan = false;
      //     $scope.disabledBatal = true;
      //   }
      // });
      // $scope.$watch("item.obj[31700503]", function (x, y) {
      //   if (x != y) {
      //     $scope.disabledSimpan = false;
      //     $scope.disabledBatal = true;
      //   }
      // });
      // $scope.$watch("item.obj[31700504]", function (x, y) {
      //   if (x != y) {
      //     $scope.disabledSimpan = false;
      //     $scope.disabledBatal = true;
      //   }
      // });
      // $scope.$watch("item.obj[31700505]", function (x, y) {
      //   if (x != y) {
      //     $scope.disabledSimpan = false;
      //     $scope.disabledBatal = true;
      //   }
      // });
      // $scope.$watch("item.obj[31700506]", function (x, y) {
      //   if (x != y) {
      //     $scope.disabledSimpan = false;
      //     $scope.disabledBatal = true;
      //   }
      // });
      // setTimeout(() => {
      //   $scope.disabledSimpan = true;
      //   $scope.disabledBatal = true;
      // }, 4000);

      $scope.listOBJ = [{
        id: 31700500,
        child: [
          31700501, 31700502, 31700503, 31700504, 31700505, 31700506,
          31700507,
        ],
      }, ];
      $scope.listBaris = [{
          id: 111351,
          child: [111351, 111348, 111349, 111350, 111354, 111355, 111356, 111357],
          emrfk: 443
        },
        {
          id: 111361,
          child: [111361, 111358, 111359, 111360, 111364, 111395, 111396, 111397],
          emrfk: 443

        },
        {
          id: 111371,
          child: [111371, 111368, 111369, 111370, 111374, 111435, 111436, 111437],
          emrfk: 443

        },
        {
          id: 111381,
          child: [111378, 111379, 111380, 111381, 111384, 111480, 111481, 111482],
          emrfk: 443

        },
        {
          id: 111391,
          child: [111388, 111389, 111390, 111391, 111394, 111520, 111521, 111522],
          emrfk: 443

        },
        {
          id: 111401,
          child: [111398, 111399,111400, 111401, 111404, 111560, 111561, 111562],
          emrfk: 443
        },
        {
          id: 111411,
          child: [111408, 111409, 111410, 111411, 111414, 21040380, 21040381, 21040382],
          emrfk: 443
        },
        {
          id: 111421,
          child: [111418, 111419,111420, 111421, 111424, 21040383, 21040384, 21040385],
          emrfk: 443
        },
        {
          id: 111431,
          child: [111428, 111429, 111430, 111431, 111434, 21040386, 21040387, 21040388],
          emrfk: 443
        },
        {
          id: 111441,
          child: [111438, 111439, 111440, 111441, 111444, 21040389, 21040390, 21040391],
          emrfk: 443
        },
        {
          id: 111451,
          child: [111448, 111449, 111450, 111451, 111454, 21040392, 21040393, 21040394],
          emrfk: 443
        },
        {
          id: 111461,
          child: [111458, 111459, 111460, 111461, 111464, 21040395, 21040396, 21040397],
          emrfk: 443
        },
        {
          id: 111476,
          child: [111473, 111474, 111475, 111476, 111479, 21040398, 21040399, 21040400],
          emrfk: 443
        },
        {
          id: 111486,
          child: [111483, 111484, 111485, 111486, 111489, 21040401, 21040402, 21040403],
          emrfk: 443
        },
        {
          id: 111496,
          child: [111493, 111494, 111495, 111496, 111499, 21040404, 21040405, 21040406],
          emrfk: 443
        },
        {
          id: 111506,
          child: [111503, 111504, 111505, 111506, 111509, 21040407, 21040408, 21040409],
          emrfk: 443
        },
        {
          id: 111516,
          child: [111513, 111514,111515, 111516, 111519, 21040410, 21040411, 21040412],
          emrfk: 443
        },
        {
          id: 111526,
          child: [111523, 111524,111525, 111526, 111529, 21040413, 21040414, 21040415],
          emrfk: 443
        },
        {
          id: 111536,
          child: [111533, 111534, 111535, 111536, 111539, 21040416, 21040417, 21040418],
          emrfk: 443
        },
        {
          id: 111546,
          child: [111543, 111544,111545, 111546, 111549, 21040419, 21040420, 21040421],
          emrfk: 443
        },
        {
          id: 111556,
          child: [111553, 111554, 111555, 111556, 111559, 21040422, 21040423, 21040424],
          emrfk: 443
        },
        {
          id: 111566,
          child: [111563, 111564, 111565, 111566, 111569, 21040425, 21040426, 21040427],
          emrfk: 443
        },
        {
          id: 111576,
          child: [111573, 111574, 111575, 111576, 111579, 21040428, 21040429, 21040430],
          emrfk: 443
        },
        {
          id: 111586,
          child: [111583, 111584, 111585, 111586, 111589, 21040431, 21040432, 21040433],
          emrfk: 443
        },
        //tab dua cppt
        {
          id: 111596,
          child: [111593, 111594, 111595, 111596, 111599, 111600, 111601, 111602],
          emrfk: 444
        },
        {
          id: 111606,
          child: [111603, 111604, 111605, 111606, 111609, 111610, 111611, 111612],
          emrfk: 444
        },
        {
          id: 111616,
          child: [111613, 111614, 111615, 111616, 111619, 111620, 111621, 111622],
          emrfk: 444
        },
        {
          id: 111626,
          child: [111623, 111624, 111625, 111626, 111629, 111630, 111631, 111632],
          emrfk: 444
        },
        {
          id: 111636,
          child: [111633, 111634, 111635, 111636, 111639, 111640, 111641, 111642],
          emrfk: 444
        },
        {
          id: 111646,
          child: [111643, 111644, 111645, 111646, 111649, 111650, 111651, 111652],
          emrfk: 444
        },
        {
          id: 111656,
          child: [111653, 111654, 111655, 111656, 111659, 111660, 111661, 111662],
          emrfk: 444
        },
        {
          id: 111666,
          child: [111663, 111664, 111665, 111666, 111669, 111670, 111671, 111672],
          emrfk: 444
        },
        {
          id: 111676,
          child: [111673, 111674, 111675, 111676, 111679, 111680, 111681, 111682],
          emrfk: 444
        },
        {
          id: 111686,
          child: [111683, 111684, 111685, 111686, 111689, 111690, 111691, 111692],
          emrfk: 444
        },
        {
          id: 111696,
          child: [111693, 111694, 111695, 111696, 111699, 111700, 111701, 111702],
          emrfk: 444
        },
        {
          id: 111706,
          child: [111703, 111704, 111705, 111706, 111709, 111710, 111711, 111712],
          emrfk: 444
        },
        {
          id: 111719,
          child: [111717, 111718, 111719, 111720, 111723, 111724, 111725, 111726],
          emrfk: 444
        },
        {
          id: 111729,
          child: [111727, 111728, 111729, 111730, 111733, 111734, 111735, 111736],
          emrfk: 444
        },
        {
          id: 111739,
          child: [111737, 111738, 111739, 111740, 111743, 111744, 111745, 111746],
          emrfk: 444
        },
        {
          id: 111749,
          child: [111747, 111748, 111749, 111750, 111753, 111754, 111755, 111756],
          emrfk: 444
        },
        {
          id: 111769,
          child: [111767, 111768, 111769, 111770, 111773, 111774, 111775, 111776],
          emrfk: 444
        },
        {
          id: 111779,
          child: [111777, 111778, 111779, 111780, 111783, 111784, 111785, 111786],
          emrfk: 444
        },
        {
          id: 111789,
          child: [111787, 111788, 111789, 111790, 111793, 111794, 111795, 111796],
          emrfk: 444
        },
        {
          id: 111799,
          child: [111797, 111798, 111799, 111800, 111803, 111804, 111805, 111806],
          emrfk: 444
        },
        {
          id: 111809,
          child: [111807, 111808, 111809, 111810, 111813, 111814, 111815, 111816],
          emrfk: 444
        },
        {
          id: 111819,
          child: [111817, 111818, 111819, 111820, 111823, 111824, 111825, 111826],
          emrfk: 444
        },
        {
          id: 111829,
          child: [111827, 111828, 111829, 111830, 111833, 111834, 111835, 111836],
          emrfk: 444
        },
        //tab 3
        {
          id: 111839,
          child: [111837, 111838, 111839, 111840, 111843, 111844, 111845, 111846],
          emrfk: 445
        },
        {
          id: 111849,
          child: [111847, 111848, 111849, 111850, 111853, 111854, 111855, 111856],
          emrfk: 445
        },
        {
          id: 111859,
          child: [111857, 111858, 111859, 111860, 111863, 111864, 111865, 111866],
          emrfk: 445
        },
        // {id: 111469, child : [111469,111471,111468]},
      ];

      function showIntegrasiAsuhanDialog() {
            $mdDialog
              .show({
                templateUrl: "../app/module/EMR/RencanaIntegrasiAsuhanDialog.html",
                controller: "RencanaIntegrasiAsuhanCtrl",
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                locals: {
                  isPopupIntegrasiAsuhan: true
                },
              })
              .finally(function () {
                // dialog closed
              });
      }

      $scope.IntegrasiAsuhan = function () {
        // Tampilkan indikator loading
        var loadingToast = document.createElement('div');
        loadingToast.id = 'integrasi-loading-toast';
        loadingToast.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; Memuat Form Integrasi Asuhan...';
        loadingToast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;padding:10px 22px;border-radius:4px;z-index:9999;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
        document.body.appendChild(loadingToast);

        function removeToast() {
          var t = document.getElementById('integrasi-loading-toast');
          if (t) t.parentNode.removeChild(t);
        }

        // Sync cache nomorEMR agar RencanaIntegrasiAsuhanCtrl membaca EMR yang sedang aktif
        // sehingga data tersimpan terhubung ke EMR yang sama (bukan norec_emr: "-")
        if (nomorEMR && nomorEMR !== '-') {
          var arrStr = cacheHelper.get('cacheNomorEMR') || {};
          arrStr[0] = nomorEMR;
          cacheHelper.set('cacheNomorEMR', arrStr);
        }

        require(
          ["app/module/EMR/RencanaIntegrasiAsuhanCtrl"],
          function () {
            // Wajib inject ke Angular runtime terlebih dahulu (sama seperti routing.js)
            $ocLazyLoad.inject('myApp').then(function () {
              removeToast();
              showIntegrasiAsuhanDialog();
            }, function() {
              removeToast();
              showIntegrasiAsuhanDialog();
            });
          },
          function (err) {
            removeToast();
            var confirm = $mdDialog
              .confirm()
              .title("Informasi")
              .textContent("Gagal memuat Form Integrasi Asuhan. Silakan muat ulang halaman.")
              .ariaLabel("Informasi")
              .ok("OK");
            $mdDialog.show(confirm);
          }
        );
      };

      $scope.openRujukanEdukasi = function () {
        var nocm = $scope.cc.nocm || '';
        var noregistrasi = $scope.cc.noregistrasi || '';

        // Robust fallback jika cc belum terisi di scope induk
        if (!nocm || !noregistrasi) {
          var cacheRM = cacheHelper.get('cacheRekamMedis');
          if (cacheRM) {
            if (!nocm) nocm = cacheRM[0] || '';
            if (!noregistrasi) noregistrasi = cacheRM[3] || '';
          }
        }

        // Tampilkan indikator loading
        var loadingToast = document.createElement('div');
        loadingToast.id = 'rujukan-loading-toast';
        loadingToast.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; Memuat Data Rujukan Edukasi...';
        loadingToast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;padding:10px 22px;border-radius:4px;z-index:9999;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
        document.body.appendChild(loadingToast);

        function removeToast() {
          var t = document.getElementById('rujukan-loading-toast');
          if (t) t.parentNode.removeChild(t);
        }

        var url = 'emr/get-emr-transaksi-detail-form-new?nocm=' + encodeURIComponent(nocm) + '&jenisEmr=asesmen';

        var p1 = medifirstService.get(url, true);
        var p2 = medifirstService.get("sysadmin/settingdatafixed/get/FormRujukanEdukasiConfig").then(function (res) {
          return res;
        }, function () {
          return null;
        });

        $q.all([p1, p2]).then(function (results) {
          removeToast();
          var res = results[0].data ? results[0].data : results[0];
          var rawData = (res && Array.isArray(res.data)) ? res.data : [];

          var resConfig = results[1];
          var formsConfig = null;
          if (resConfig && resConfig.data) {
            try {
              var val = typeof resConfig.data === 'string' ? resConfig.data : (resConfig.data.value || resConfig.data);
              if (typeof val === 'string' && val.trim() !== '') {
                formsConfig = JSON.parse(val);
              } else if (Array.isArray(val)) {
                formsConfig = val;
              }
            } catch (e) {
              console.error('Error parsing FormRujukanEdukasiConfig:', e);
            }
          }

          if (!formsConfig || !Array.isArray(formsConfig) || formsConfig.length === 0) {
            toastr.warning('Formulir Rujukan Edukasi belum dikonfigurasi di data fixed!');
            return;
          }

          formsConfig.forEach(function (form) {
            form.status = false;
            form.noemr = '-';
            form.norec = undefined;
            form.tglemr = undefined;

            for (var i = 0; i < rawData.length; i++) {
              var parent = rawData[i];

              var parentNoReg = parent.noregistrasi || parent.noregistrasifk || parent.noregistrasi_fk;
              if (parentNoReg && noregistrasi) {
                if (String(parentNoReg).trim() != String(noregistrasi).trim()) {
                  continue;
                }
              }

              // 1. Cocokkan emrfk langsung di level parent
              if (parent.emrfk && parseInt(parent.emrfk) === form.id) {
                form.status = true;
                form.noemr = parent.noemr || parent.norec || '-';
                form.norec = parent.norec;
                form.tglemr = parent.tglemr;
              }
              // 2. Jika tidak cocok di parent, cek di details (fallback)
              else if (parent.details && Array.isArray(parent.details)) {
                for (var j = 0; j < parent.details.length; j++) {
                  if (parseInt(parent.details[j].emrfk) === form.id) {
                    form.status = true;
                    form.noemr = parent.noemr || parent.norec || '-';
                    form.norec = parent.norec;
                    form.tglemr = parent.tglemr;
                    break;
                  }
                }
              }
              if (form.status) break;
            }
          });

          $mdDialog.show({
            templateUrl: "../app/module/EMR/FormRujukanEdukasiListDialog.html",
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            controller: ['$scope', '$mdDialog', 'rujukansData', function ($scopeDialog, $mdDialog, rujukansData) {
              $scopeDialog.rujukanEdukasiForms = rujukansData;
              $scopeDialog.tutupDialog = function () {
                $mdDialog.hide();
              };
              $scopeDialog.isiForm = function (form) {
                $mdDialog.hide(form);
              };
            }],
            locals: {
              rujukansData: formsConfig
            }
          }).then(function (selectedForm) {
            if (selectedForm) {
              openRujukanEdukasiFormPopup(selectedForm);
            }
          });

        }, function () {
          removeToast();
          toastr.error('Gagal memuat data Rujukan Edukasi');
        });
      };

      function openRujukanEdukasiFormPopup(form) {
        // Simpan cache asli sebelum ditimpa, agar bisa di-restore setelah dialog tutup
        var originalCacheNomorEMR = cacheHelper.get('cacheNomorEMR');
        var originalCacheNOREC_EMR = cacheHelper.get('cacheNOREC_EMR');

        var arrStr = { 0: form.noemr, 1: form.norec };
        cacheHelper.set('cacheNomorEMR', arrStr);
        cacheHelper.set('cacheNOREC_EMR', arrStr);

        var loadingToast = document.createElement('div');
        loadingToast.id = 'rujukan-loading-toast';
        loadingToast.innerHTML = '<i class="fa fa-spinner fa-spin"></i>&nbsp; Memuat Form...';
        loadingToast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#323232;color:#fff;padding:10px 22px;border-radius:4px;z-index:9999;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);';
        document.body.appendChild(loadingToast);

        function removeToast() {
          var t = document.getElementById('rujukan-loading-toast');
          if (t) t.parentNode.removeChild(t);
        }

        require([form.controller], function () {
          $ocLazyLoad.inject('myApp').then(function () {
            removeToast();
            showActualEmrDialog();
          }, function () {
            removeToast();
            showActualEmrDialog();
          });
        }, function (err) {
          removeToast();
          console.error(err);
          toastr.error('Gagal memuat file controller: ' + form.controller);
        });

        function showActualEmrDialog() {
          var dialogScope = $rootScope.$new();
          dialogScope.item = { obj: [], obj2: [] };
          dialogScope.cc = {};
          dialogScope.templateUrl = '../app/module/EMR/' + form.template;
          dialogScope.formTitle = form.title;

          $mdDialog.show({
            templateUrl: '../app/module/EMR/FormRujukanEdukasiDialog.html',
            controller: form.controller,
            scope: dialogScope,
            preserveScope: true,
            parent: angular.element(document.body),
            clickOutsideToClose: false,
            fullscreen: true
          }).finally(function () {
            // Restore cache EMR pasien utama yang sebelumnya disimpan
            cacheHelper.set('cacheNomorEMR', originalCacheNomorEMR);
            cacheHelper.set('cacheNOREC_EMR', originalCacheNOREC_EMR);
            $scope.openRujukanEdukasi();
          });
        }
      }

      $scope.tutupDialog = function() {
        $mdDialog.hide();
      }
    },
  ]);
});
