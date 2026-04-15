define(["initialize", "Configuration"], function (initialize, config) {
  "use strict";
  initialize.controller("FormPemantauanTerapiObatCtrl", [
    "$q",
    "$rootScope",
    "$scope",
    "ModelItem",
    "$state",
    "CacheHelper",
    "DateHelper",
    "MedifirstService",
    "$mdDialog",
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
    ) {
      $scope.noCM = $state.params.noCM;
      // $scope.tombolSimpanVis = true
      $scope.noRecPap = cacheHelper.get("noRecPap");
      $scope.totalSkor = 0;
      $scope.totalSkor2 = 0;
      $scope.cc = {};
      var nomorEMR = "-";
      var emrfk_ = 3000517;
      $scope.cc.emrfk = emrfk_;

      var dataLoad = [];
      $scope.isCetak = false;
      $scope.isCetakV = true;
      var norecEMR = "";
      var cacheNomorEMR = cacheHelper.get("cacheNomorEMR");
      var cacheNoREC = cacheHelper.get("cacheNOREC_EMR");
      if (cacheNoREC != undefined) {
        norecEMR = cacheNomorEMR[1];
      }
      if (medifirstService.getKelompokUser() == "mahasiswadiklat") {
        $scope.tombolSimpanVis = false;
      } else if (
        medifirstService.getKelompokUser() == "dokter" &&
        medifirstService.getKelompokUser() == "suster"
      ) {
        $scope.tombolSimpanVis = false;
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
      $scope.cetakPdf = function () {
        if (norecEMR == "") return;
        var client = new HttpClient();
        client.get(
          "http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-cppt&id=" +
            $scope.cc.nocm +
            "&emr=" +
            norecEMR +
            "&view=true",
          function (response) {
            // do something with response
          },
        );
      };
      $scope.listDaily = [
        {
          id: 1,
          nama: "Alergi",
          detail: [
            { id: 21023118, nama: "Tidak Ada", type: "checkbox" },
            { id: 21023119, nama: "Ada, yaitu : ", type: "checkbox" },
            { id: 21023120, nama: "", type: "textbox" },
          ],
        },
      ];

      // Setup ColumnResult untuk Preview Data Laboratorium
      $scope.ColumnResult = {
        selectable: "row",
        pageable: true,
        sortable: true,
        groupable: true,
        columns: [
          {
            field: "tglpelayanan",
            title: "Tanggal",
            width: "12%",
          },
          {
            field: "namaproduk",
            title: "Nama Pemeriksaan",
            width: "15%",
          },
          {
            field: "detailpemeriksaan",
            title: "Detail Pemeriksaan",
            width: "15%",
          },
          {
            field: "hasil",
            title: "Hasil Pemeriksaan",
            width: "12%",
            attributes: {
              class: "#=flag != 'N' ? 'red' : 'green' #",
            },
          },
          {
            field: "nilaitext",
            title: "Nilai Normal",
            width: "15%",
          },
          {
            field: "satuanstandar",
            title: "Satuan Hasil",
            width: "15%",
          },
          {
            hidden: true,
            field: "detailjenisproduk",
            title: "Jenis Pemeriksaan",
          },
          {
            hidden: true,
            field: "nourutdetail",
          },
        ],
      };

      medifirstService
        .getPart("emr/get-datacombo-part-pegawai", true, true, 20)
        .then(function (data) {
          $scope.listPegawai = data;
        });
      medifirstService
        .getPart("emr/get-datacombo-part-dokter", true, true, 20)
        .then(function (data) {
          $scope.listDokter = data;
        });
      medifirstService
        .getPart("emr/get-datacombo-part-ruangan-pelayanan", true, true, 20)
        .then(function (data) {
          $scope.listRuang = data;
        });

      medifirstService
        .getPart("emr/get-datacombo-part-diagnosa", true, true, 20)
        .then(function (data) {
          $scope.listDiagnosa = data;
        });
      medifirstService
        .getPart(
          "sysadmin/general/get-datacombo-jenispegawai-cppt",
          true,
          true,
          20,
        )
        .then(function (data) {
          $scope.listJenisPegawai = data;
        });

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
        $scope.cc.tgllahir = chacePeriode[18];
        if (nomorEMR == "-") {
          $scope.cc.norec_emr = "-";
        } else {
          $scope.cc.norec_emr = nomorEMR;
        }
      }

      function dynamicEditor(container, options) {
        // if(options.model.tipedata == 1){
        //   var input = $('<input type="number" class="k-input k-textbox" name="hasil" data-bind="value:hasil">')
        //   input.appendTo(container);
        // }else{
        var input = $(
          '<input type="text" class="k-input k-textbox" name="hasil" data-bind="value:hasil">',
        );
        input.appendTo(container);
        // }
      }

      const firstDate = new Date($scope.cc.tgllahir);
      const secondDate = new Date($scope.cc.tglregistrasi);
      const oneDay = 24 * 60 * 60 * 1000;

      $scope.item.umurDay = Math.round(
        Math.abs((firstDate - secondDate) / oneDay),
      );

      medifirstService
        .get(
          "emr/get-hasil-lab-emr-terbaru?noregistrasi=" +
            $scope.cc.noregistrasi +
            "&objectjeniskelaminfk=" +
            $scope.cc.jeniskelamin +
            "&umur=" +
            $scope.item.umurDay +
            "&norec=" +
            $scope.item.norecPP +
            "&norecOrder=" +
            $scope.norecOrder,
        )
        .then(function (data) {
          $scope.isRouteLoading = false;
          if (data.statResponse == true && data.data.data.length > 0) {
            if (data.data.dokter.id != null) {
              if ($scope.ListDataPegawai == undefined) {
                $scope.ListDataPegawai = [
                  {
                    id: data.data.dokter.id,
                    namalengkap: data.data.dokter.namalengkap,
                  },
                ];
              }
              $scope.item.DataPegawai = {
                id: data.data.dokter.id,
                namalengkap: data.data.dokter.namalengkap,
              };
            }

            for (let i = 0; i < data.data.data.length; i++) {
              const element = data.data.data[i];
              if (element.keterangan) $scope.item.catatan = element.keterangan;
            }
            $scope.resultGrids = new kendo.data.DataSource({
              data: data.data.data,
              group: [{ field: "detailjenisproduk" }],
              sort: { field: "nourutdetail", dir: "asc" },
              schema: {
                model: {
                  id: "id",
                  fields: {
                    detailjenisproduk: { editable: false, type: "string" },
                    detailpemeriksaan: { editable: false, type: "string" },
                    memohasil: { editable: false, type: "string" },
                    namaproduk: { editable: false, type: "string" },
                    satuanstandar: { editable: false, type: "string" },
                    // detailpemeriksaan: { editable: false, type: "string" },
                    nilaimax: { editable: false, type: "string" },
                    nilaimin: { editable: false, type: "string" },
                    hasil: { editable: dynamicEditor },
                    nourutdetail: { editable: false, type: "number" },
                    nilaitext: { editable: false, type: "string" },
                  },
                },
              },
              change: function (e) {
                console.log("change :" + e.action);
                if (e.field && e.action === "itemchange") {
                  console.log(e.items[0].hasil);
                  if (e.items[0].hasil) {
                    // $scope.item.nilaistr = e.items[0].nilaimin + '-' + e.items[0].nilaimax
                    let HasilInput = e.items[0].hasil;
                    if (HasilInput == "-" || HasilInput == "Negatif") {
                      e.items[0].flag = "N";
                    } else if (HasilInput.indexOf("+/") >= 0) {
                      let hssl = "positif";
                      let nilaistring = e.items[0].nilaitext;
                      nilaistring = nilaistring.toUpperCase();
                      hssl = hssl.toUpperCase();
                      if (hssl == nilaistring) {
                        e.items[0].flag = "N";
                      } else {
                        e.items[0].flag = "Y";
                      }
                    } else if (HasilInput.indexOf("-/") >= 0) {
                      let hssl = "negatif";
                      let nilaistring = e.items[0].nilaitext;
                      nilaistring = nilaistring.toUpperCase();
                      hssl = hssl.toUpperCase();
                      if (hssl == nilaistring) {
                        e.items[0].flag = "N";
                      } else {
                        e.items[0].flag = "Y";
                      }
                    } else if (HasilInput.indexOf("*") >= 0) {
                      e.items[0].flag = "Y";
                    } else if (HasilInput.indexOf("<") >= 0) {
                      let a = parseFloat(e.items[0].nilaimin);
                      let b = parseFloat(e.items[0].nilaimax);
                      let hsslARr = HasilInput.split("<");
                      let hssl = parseFloat(hsslARr[1]);

                      if (hssl >= a && hssl <= b) {
                        e.items[0].flag = "N";
                      } else {
                        e.items[0].flag = "Y";
                      }
                    } else if (HasilInput.indexOf(">") >= 0) {
                      let a = parseFloat(e.items[0].nilaimin);
                      let b = parseFloat(e.items[0].nilaimax);
                      let hsslARr = HasilInput.split(">");
                      let hssl = parseFloat(hsslARr[1]);

                      if (hssl >= a && hssl <= b) {
                        e.items[0].flag = "N";
                      } else {
                        e.items[0].flag = "Y";
                      }
                    } else if (HasilInput.indexOf("-") >= 0) {
                      let a = parseFloat(e.items[0].nilaimin);
                      let b = parseFloat(e.items[0].nilaimax);
                      let hsslARr = HasilInput.split("-");
                      let hssl0 = parseFloat(hsslARr[0]);
                      let hssl = parseFloat(hsslARr[1]);

                      if (hssl0 >= a && hssl <= b) {
                        e.items[0].flag = "N";
                      } else {
                        e.items[0].flag = "Y";
                      }
                    } else if (e.items[0].nilaimin == null) {
                      let hssl = e.items[0].hasil;
                      let nilaistring = e.items[0].nilaitext;
                      nilaistring = nilaistring.toUpperCase();
                      hssl = hssl.toUpperCase();

                      e.items[0].flag = "N";
                    } else if (e.items[0].nilaimin == "") {
                      let hssl = e.items[0].hasil;
                      let nilaistring = e.items[0].nilaitext;
                      nilaistring = nilaistring.toUpperCase();
                      hssl = hssl.toUpperCase();

                      e.items[0].flag = "N";
                    } else {
                      if (HasilInput.indexOf("*") >= 0) {
                        e.items[0].flag = "Y";
                      } else {
                        if (e.items[0].nilaimin != null) {
                          if (e.items[0].tipedata == 2) {
                            let a = e.items[0].nilaimin.toUpperCase();
                            let b = e.items[0].nilaimax.toUpperCase();
                            let hssl = e.items[0].hasil.trim().toUpperCase();
                            if (hssl >= a && hssl <= b) {
                              e.items[0].flag = "N";
                            } else {
                              e.items[0].flag = "Y";
                            }
                          } else {
                            let a = parseFloat(e.items[0].nilaimin);
                            let b = parseFloat(e.items[0].nilaimax);
                            let hssl = parseFloat(e.items[0].hasil);
                            if (hssl >= a && hssl <= b) {
                              e.items[0].flag = "N";
                            } else {
                              e.items[0].flag = "Y";
                            }
                          }
                        } else {
                          let hssl = e.items[0].hasil.trim();
                          let nilaistring = e.items[0].nilaitext;
                          nilaistring = nilaistring.toUpperCase();
                          hssl = hssl.toUpperCase();
                          if (hssl == nilaistring) {
                            e.items[0].flag = "N";
                          } else {
                            e.items[0].flag = "Y";
                          }
                        }
                      }
                    }
                    e.items.state = "edit";
                  }
                  $scope.resultGrids.fetch();
                }
              },
            });
          } else {
            toastr.info("Data Hasil tidak ada", "Info");
          }
        });

      var chekedd = false;

      $scope.item = $scope.item || {};
      $scope.item.obj = $scope.item.obj || {};
      $scope.item.obj2 = $scope.item.obj2 || {};

      medifirstService
        .get(
          "emr/get-autoload-emr?noregistrasi=" +
            $scope.cc.noregistrasi +
            "&emrfk=777",
          true,
        )
        .then(function (data) {
          var autoloadData = [];
          if (Array.isArray(data.data)) {
            autoloadData = data.data;
          } else if (data.data && Array.isArray(data.data.data)) {
            autoloadData = data.data.data;
          }

          if (autoloadData.length > 0) {
            var fields = {};
            autoloadData.forEach(function (entry) {
              fields[entry.emrdfk] = entry.value;
            });

            var physicalLines = [];
            if (fields[120113]) {
              physicalLines.push("Tekanan Darah : " + fields[120113]);
            }
            if (fields[120114]) {
              physicalLines.push("Nadi : " + fields[120114]);
            }
            if (fields[120115]) {
              physicalLines.push("Suhu : " + fields[120115]);
            }
            if (fields[120116]) {
              physicalLines.push("Respirasi : " + fields[120116]);
            }
            if (fields[120309]) {
              physicalLines.push("Saturasi : " + fields[120309]);
            }
            if (fields[120117]) {
              physicalLines.push("");
              physicalLines.push("Status Generalis dan Neurologis :");
              physicalLines.push(fields[120117]);
            }

            var physicalText = physicalLines.join("\n");
            if (physicalText && !$scope.item.obj[3014262]) {
              $scope.item.obj[3014262] = physicalText;
            }
          }
        });

      $scope.textInputs = [3014250, 7890444, 3014252, 3014253];
      $scope.datetimeInputs = [3014254];
      $scope.comboboxInputs = [3014255];
      $scope.textareaInputs = [
        3014256, 3014257, 3014258, 3014259, 3014260, 3014261, 3014262, 3014263,
        3014264, 3014265, 3014266, 3014267, 3014268,
      ];

      medifirstService
        .get(
          "emr/get-emr-transaksi-detail?noemr=" +
            nomorEMR +
            "&emrfk=" +
            $scope.cc.emrfk,
          true,
        )
        .then(function (dat) {
          $scope.item.obj = $scope.item.obj || {};
          $scope.item.obj2 = $scope.item.obj2 || {};
          dataLoad = dat.data.data;

          // console.log(dataLoad)
          for (var i = 0; i <= dataLoad.length - 1; i++) {
            if (parseFloat($scope.cc.emrfk) == dataLoad[i].emrfk) {
              var emrdfk = dataLoad[i].emrdfk;

              if ($scope.textInputs.includes(emrdfk)) {
                $scope.item.obj[emrdfk] = dataLoad[i].value;
              } else if ($scope.datetimeInputs.includes(emrdfk)) {
                $scope.item.obj[emrdfk] = new Date(dataLoad[i].value);
              } else if ($scope.comboboxInputs.includes(emrdfk)) {
                var str = dataLoad[i].value;
                if (str != undefined) {
                  var res = str.split("~");
                  $scope.item.obj[emrdfk] = { value: res[0], text: res[1] };
                }
              } else if ($scope.textareaInputs.includes(emrdfk)) {
                $scope.item.obj[emrdfk] = dataLoad[i].value;
              } else {
                // Fallback to original type-based assignment for other types
                if (dataLoad[i].type == "textbox") {
                  $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                }
                if (dataLoad[i].type == "checkbox") {
                  chekedd = false;
                  if (dataLoad[i].value == "1") {
                    chekedd = true;
                  }
                  $scope.item.obj[dataLoad[i].emrdfk] = chekedd;
                }

                if (dataLoad[i].type == "datetime") {
                  $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                    dataLoad[i].value,
                  );
                }
                if (dataLoad[i].type == "datetime2") {
                  $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                    dataLoad[i].value,
                  );
                }
                if (dataLoad[i].type == "time") {
                  $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                    dataLoad[i].value,
                  );
                }
                if (dataLoad[i].type == "date") {
                  $scope.item.obj[dataLoad[i].emrdfk] = new Date(
                    dataLoad[i].value,
                  );
                }

                if (dataLoad[i].type == "checkboxtextbox") {
                  $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                  $scope.item.obj2[dataLoad[i].emrdfk] = true;
                }
                if (dataLoad[i].type == "checkboxtextarea") {
                  $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                  $scope.item.obj2[dataLoad[i].emrdfk] = true;
                }
                if (dataLoad[i].type == "textarea") {
                  $scope.item.obj[dataLoad[i].emrdfk] = dataLoad[i].value;
                }
                if (dataLoad[i].type == "combobox2") {
                  var str = dataLoad[i].value;
                  if (str != undefined) {
                    var res = str.split("~");
                    $scope.item.obj[dataLoad[i].emrdfk] = {
                      value: res[0],
                      text: res[1],
                    };
                  }
                }
                if (dataLoad[i].type == "combobox") {
                  var str = dataLoad[i].value;
                  if (str != undefined) {
                    var res = str.split("~");
                    $scope.item.obj[dataLoad[i].emrdfk] = {
                      value: res[0],
                      text: res[1],
                    };
                  }
                }

                if (dataLoad[i].type == "combobox3") {
                  var str = dataLoad[i].value;
                  if (str != undefined) {
                    var res = str.split("~");
                    $scope.item.obj[dataLoad[i].emrdfk] = {
                      value: res[0],
                      text: res[1],
                    };
                  }
                }
              }
            }
          }
        });

      $scope.cetakBlade = function () {
        if (norecEMR == "") return;

        var local = JSON.parse(localStorage.getItem("profile"));
        var nama = medifirstService.getPegawaiLogin().namaLengkap;

        window.open(
          config.baseApiBackend +
            "report/cetak-pemantauan-terapi-obat?nocm=" +
            $scope.cc.nocm +
            "&norec_apd=" +
            $scope.cc.norec +
            "&emr=" +
            norecEMR +
            "&emrfk=" +
            $scope.cc.emrfk +
            "&kdprofile=" +
            local.id +
            "&nama=" +
            nama +
            "&noregistrasi=" +
            $scope.cc.noregistrasi +
            "&umur=" +
            $scope.item.umurDay +
            "&jeniskelamin=" +
            $scope.cc.jeniskelamin,
          "_blank",
        );
      };

      $scope.Batal = function () {
        $scope.item.obj = [];
      };
      $scope.kembali = function () {
        $rootScope.showRiwayat();
      };

      $scope.Save = function () {
        var arrobj = Object.keys($scope.item.obj);
        var arrSave = [];
        for (var i = arrobj.length - 1; i >= 0; i--) {
          if ($scope.item.obj[parseInt(arrobj[i])] instanceof Date)
            $scope.item.obj[parseInt(arrobj[i])] = moment(
              $scope.item.obj[parseInt(arrobj[i])],
            ).format("YYYY-MM-DD HH:mm");
          // $scope.item.obj[parseInt(arrobj[i])] = moment($scope.item.obj[parseInt(arrobj[i])]).format('HH:mm')
          arrSave.push({
            id: arrobj[i],
            values: $scope.item.obj[parseInt(arrobj[i])],
          });
        }
        $scope.cc.jenisemr = "asesmen";
        var jsonSave = {
          head: $scope.cc,
          data: arrSave,
        };
        medifirstService
          .post("emr/save-emr-dinamis", jsonSave)
          .then(function (e) {
            var confirm = $mdDialog
              .confirm()
              .title("Informasi")
              .textContent("EMR SUDAH TERSIMPAN, KLIK YA UNTUK KONFIRMASI")
              .ariaLabel("Lucky day")
              .cancel("")
              .ok("Ya");
            $mdDialog.show(confirm).then(function () {
              medifirstService
                .postLogging(
                  "EMR",
                  "norec emrpasien_t",
                  e.data.data.norec,
                  "RM.07.02 PRMRJ" +
                    " dengan No EMR - " +
                    e.data.data.noemr +
                    " Sudah Klik Ya pada EMR No Registrasi " +
                    $scope.cc.noregistrasi,
                )
                .then(function (res) {});
            });

            $rootScope.loadRiwayat();
            medifirstService
              .postLogging(
                "EMR",
                "norec emrpasien_t",
                e.data.data.norec,
                "RM.07.02 PRMRJ" +
                  " dengan No EMR - " +
                  e.data.data.noemr +
                  " pada No Registrasi " +
                  $scope.cc.noregistrasi,
              )
              .then(function (res) {});
            $scope.cc.norec_emr = e.data.data.noemr;
          });
      };
    },
  ]);
});
