define(["initialize", "Configuration"], function (initialize, configuration) {
  "use strict";
  initialize.controller("HistorySatuSehatCtrl", [
    "$rootScope",
    "$scope",
    "$state",
    "MedifirstService",
    function ($rootScope, $scope, $state, medifirstService) {
      console.log($state.params.ihs_number);
      $scope.item = {};
      $scope.image = "../app/images/avatar.jpg";
      $scope.header = {};
      $scope.itemData = {};
      $scope.encounter = {};
      $scope.Observation = [];
      $scope.Procedure = [];
      $scope.MedicationRequest = [];
      $scope.MedicationDispense = [];
      $scope.ServiceRequestLab = [];
      $scope.Specimen = [];
      $scope.ObservationLab = [];
      $scope.DiagnosticReportLab = [];
      $scope.Diagnosis = [];
      $scope.activeEncounter = "";
      // $scope.isRiwayat = false
      $scope.isRouteLoading = false;
      $scope.isLoadingNav = false;
      $scope.sourceMenu = [];
      loadPasien();
      loadRiwayat();
      function clearData() {
        $scope.Observation = [];
        $scope.Procedure = [];
        $scope.MedicationRequest = [];
        $scope.MedicationDispense = [];
        $scope.ServiceRequestLab = [];
        $scope.Specimen = [];
        $scope.ObservationLab = [];
        $scope.DiagnosticReportLab = [];
        $scope.Diagnosis = [];
      }
      async function loadPasien() {
        let data = {
          url: "Patient/" + $state.params.ihs_number,
          method: "GET",
          data: null,
        };
        $scope.isRouteLoading = true;
        await medifirstService
          .postNonMessage("bridging/ihs/tools", data)
          .then(async function (e) {
            $scope.header = e.data;
            $scope.isRouteLoading = false;
          })
          .then(function () {
            $scope.isRouteLoading = false;
          });
      }
      async function loadRiwayat() {
        let data = {
          url: "Encounter?subject=" + $state.params.ihs_number,
          method: "GET",
          data: null,
        };
        $scope.isRouteLoading = true;
        $scope.isLoadingNav = true;
        await medifirstService
          .postNonMessage("bridging/ihs/tools", data)
          .then(async function (e) {
            // debugger
            if (e.data.resourceType == "OperationOutcome") {
              $scope.isEncounter = false;
              $scope.isRiwayat = false;
              $scope.isRouteLoading = false;
              $scope.isLoadingNav = false;
              return;
            }
            if (e.data.total == 0) {
              $scope.isRiwayat = false;
              $scope.isRouteLoading = false;
              $scope.isLoadingNav = false;
              return;
            }
            $scope.isEncounter = true;
            var dataSR = [];
            for (let x = 0; x < e.data.entry.length; x++) {
              const element = e.data.entry[x];
              element.namaruangan =
                element.resource.location[0].location.display;
              element.tglregistrasi = moment(
                element.resource.period.start
              ).format("DD/MM/YY HH:mm");
              element.id = element.resource.id;
              element.display_riwayat = formatDateIndoSimple(
                element.resource.period.start
              ); //+ ' ' +   element.namaruangan //+ ' ' +   element.namars
              // let dataz = {
              //     url: "Organization/" + element.resource.serviceProvider.reference.split('/')[1],
              //     method: "GET",
              //     data: null,
              // };
              // await medifirstService.postNonMessage('bridging/ihs/tools', dataz).then(async function (x) {
              //     element.namars =  x.data.name

              // })
              dataSR.push(element);
            }
            await selectData(dataSR[0].resource);
            $scope.isRiwayat = true;
            var inlineDefault = new kendo.data.HierarchicalDataSource({
              data: dataSR,
              schema: {
                model: {
                  children: "child",
                  expanded: false,
                },
              },
            });
            $scope.treeSourceMenu = inlineDefault;
            $scope.sourceMenu = dataSR;
            $scope.mainTreeViewMenuOption = {
              dataBound: function (e) {
                $("span.k-in").each(function () {
                  if ($(this).text() == "Catatan Klinik") {
                    $(this).addClass("gemblung");
                  }
                  if ($(this).text() == "Vital Sign") {
                    $(this).addClass("gemblung");
                  }
                });
              },
              dataTextField: ["display_riwayat"],
              datakKeyField: ["id"],
              select: onSelect,
              dragAndDrop: false,
              checkboxes: false,
            };
            $scope.isRouteLoading = false;
            $scope.isLoadingNav = false;
          })
          .then(function () {
            $scope.isRouteLoading = false;
          });
      }

      async function onSelect(e) {
        var data3 = e.sender.dataSource._data;

        var uid_select = e.node.dataset.uid;

        for (let x = 0; x < data3.length; x++) {
          const element = data3[x];
          if (uid_select == element.uid) {
            $scope.Observation = [];
            $scope.Procedure = [];
            $scope.MedicationRequest = [];
            $scope.MedicationDispense = [];
            $scope.ServiceRequestLab = [];
            $scope.Specimen = [];
            $scope.ObservationLab = [];
            $scope.DiagnosticReportLab = [];
            await selectData(element.resource);
          }
        }
      }
      $scope.selectNoreg = function (items) {
        selectData(items.resource);
      };
      async function selectData(element) {
        clearData();
        $scope.activeEncounter = element.id;
        $scope.encounter = element;
        // let data = {
        //   url: "Encounter/" + element.id,
        //   method: "GET",
        //   data: null,
        // };

        // await medifirstService
        //   .postNonMessage("bridging/ihs/tools", data)
        //   .then(async function (e) {
        //     $scope.encounter = e.data;
        let dataz = {
          url:
            "Organization/" + element.serviceProvider.reference.split("/")[1],
          method: "GET",
          data: null,
        };
        await medifirstService
          .postNonMessage("bridging/ihs/tools", dataz)
          .then(async function (x) {
            $scope.encounter.provider = x.data.name;
          });
        // });

        await loadObservasiVital(element);
        await loadCondition(element);
        await loadProcedure(element);
        await loadMedicationRequest(element);
        await loadMedicationDispense(element);
        await loadServiceRequest(element);
      }
      function loadCondition(element) {
        let data2 = {
          url: "Condition?encounter=" + element.id,
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data2)
          .then(function (xx) {
            $scope.Diagnosis = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                  $scope.Diagnosis.push(element.resource);
              }
            }
          });
      }
      function loadObservasiVital(element) {
        let data2 = {
          url: "Observation?encounter=" + element.id,
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data2)
          .then(function (xx) {
            $scope.Observation = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                if (
                  element.resource.category[0].coding[0].code != "laboratory"
                ) {
                  $scope.Observation.push(element.resource);
                }
              }
            }
          });
      }
      function loadProcedure(element) {
        let data2 = {
          url: "Procedure?encounter=" + element.id,
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data2)
          .then(function (xx) {
            $scope.Procedure = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                $scope.Procedure.push(element.resource);
              }
            }
          });
      }
      async function loadMedicationRequest(element) {
        let data2 = {
          url: "MedicationRequest?encounter=" + element.id,
          method: "GET",
          data: null,
        };

      await medifirstService
          .postNonMessage("bridging/ihs/tools", data2)
          .then(async function (xx) {
            $scope.MedicationRequest = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                
                let data3 = {
                  url: "Medication/" + element.resource.medicationReference.reference.split('/')[1],
                  method: "GET",
                  data: null,
                };
                await medifirstService
                .postNonMessage("bridging/ihs/tools", data3)
                .then(async function (xxx) {
                    element.resource.extension = xxx.data.extension
                });

                $scope.MedicationRequest.push(element.resource);
              }
            }
          
            
          });
      }
      function loadMedicationDispense(element) {
        let data2 = {
          url:
            "MedicationDispense?subject=" +
            $state.params.ihs_number +
            "&context=" +
            element.id,
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data2)
          .then(function (xx) {
            $scope.MedicationDispense = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                $scope.MedicationDispense.push(element.resource);
              }
            }
          });
      }
      function loadServiceRequest(element) {
        let data2 = {
          url:
            "ServiceRequest?subject=" +
            $state.params.ihs_number +
            "&encounter=" +
            element.id,
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data2)
          .then(function (xx) {
            $scope.ServiceRequestLab = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                $scope.ServiceRequestLab.push(element.resource);
              }
            }
          });

        let data3 = {
          url:
            "Specimen?subject=" +
            $state.params.ihs_number +
            "&encounter=" +
            element.id +
            "&collected=" +
            moment(new Date(  element.period.start)).format('YYYY-MM-DD'),
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data3)
          .then(function (xx) {
            $scope.Specimen = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                $scope.Specimen.push(element.resource);
              }
            }
          });

        let data4 = {
          url:
            "Observation?subject=" +
            $state.params.ihs_number +
            "&encounter=" +
            element.id,
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data4)
          .then(function (xx) {
            $scope.ObservationLab = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                if (
                  element.resource.category[0].coding[0].code == "laboratory"
                ) {
                  $scope.ObservationLab.push(element.resource);
                }
              }
            }
          });

        let data5 = {
          url:
            "DiagnosticReport?subject=" +
            $state.params.ihs_number +
            "&encounter=" +
            element.id,
          method: "GET",
          data: null,
        };

        medifirstService
          .postNonMessage("bridging/ihs/tools", data5)
          .then(function (xx) {
            $scope.DiagnosticReportLab = [];
            if (xx.data.total > 0) {
              for (let i = 0; i < xx.data.entry.length; i++) {
                const element = xx.data.entry[i];
                $scope.DiagnosticReportLab.push(element.resource);
              }
            }
          });
      }

      function formatDateIndoSimple(tgl) {
        var date = new Date(tgl);
        var tahun = date.getFullYear().toString().substr(2, 2);
        var bulan = date.getMonth();
        var tanggal = date.getDate();
        var hari = date.getDay();
        var jam = date.getHours();
        var menit = date.getMinutes();
        var detik = date.getSeconds();
        switch (hari) {
          case 0:
            hari = "Ming";
            break;
          case 1:
            hari = "Sen";
            break;
          case 2:
            hari = "Sel";
            break;
          case 3:
            hari = "Rab";
            break;
          case 4:
            hari = "Kam";
            break;
          case 5:
            hari = "Jum";
            break;
          case 6:
            hari = "Sab";
            break;
        }
        switch (bulan) {
          case 0:
            bulan = "Jan";
            break;
          case 1:
            bulan = "Feb";
            break;
          case 2:
            bulan = "Mar";
            break;
          case 3:
            bulan = "Apr";
            break;
          case 4:
            bulan = "Mei";
            break;
          case 5:
            bulan = "Jun";
            break;
          case 6:
            bulan = "Jul";
            break;
          case 7:
            bulan = "Agu";
            break;
          case 8:
            bulan = "Sep";
            break;
          case 9:
            bulan = "Okt";
            break;
          case 10:
            bulan = "Nov";
            break;
          case 11:
            bulan = "Des";
            break;
        }
        return (
          hari +
          ", " +
          tanggal +
          " " +
          bulan +
          " " +
          tahun +
          " " +
          jam +
          ":" +
          menit
        );
      }
    },
  ]);
});
