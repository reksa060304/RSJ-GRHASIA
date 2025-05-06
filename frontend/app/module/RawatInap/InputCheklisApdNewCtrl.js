
define(['initialize', 'Configuration'], function (initialize, config) {

    'use strict';
    initialize.controller('InputCheklisApdNewCtrl', ['$state', 'MedifirstService', '$rootScope', '$scope', 'DateHelper', '$timeout', '$mdDialog',
        function ($state, medifirstService, $rootScope, $scope, dateHelper, $timeout, $mdDialog) {
            $scope.titleButton = 'Input APD'
            $scope.isRouteLoading = false;
            $scope.now = new Date();
            $scope.item = {};
            $scope.arrDokter = [];
            $scope.selectedData = [];
            var dataARR = []
            var dataLoad = []
            var currentPage = 1;


            let verifikator = []
            let pegawai = JSON.parse(window.localStorage.getItem('pegawai'))

            FormLoad();

            function FormLoad() {
                $scope.item.bulan = $scope.now;
                $scope.monthOnly = {
                    start: "year",
                    depth: "year",
                    format: "MMMM yyyy",
                };
                LoadCombo();
            }

            $("#calendar").kendoCalendar();

            function LoadCombo() {
                medifirstService.getPart('sysadmin/general/get-ruangan-part', true, true, 10).then(function (e) {
                    $scope.listRuangan = e;
                });

                medifirstService.get('sysadmin/general/get-combo-pegawai').then(function (e) {
                    $scope.listPegawai = e.data
                });

                medifirstService.get('sysadmin/general/get-datacombo-jenispegawai-cppt').then(function (e) {
                    $scope.listJenisPegawai = e.data
                });


                $scope.isRouteLoading = true;
                medifirstService.get("rawatinap/get-master-audit-apd", true).then(async function (dat) {
                    $scope.isRouteLoading = false;
                    var data = dat.data
                    // olah data in here
                    // changeFormatdata(data);
                    // await searchData();
                    // crate grid in here
                    // console.log(data)
                    renderColumn(data);
                })
            }

            $scope.search = function () {
                if ($scope.item.ruangan) {
                    // medifirstService.get('sysadmin/general/get-tindakan?idRuangan='+ $scope.item.ruangan.id, true, true, 10).then(function (e) {
                    //     $scope.listTindakan = e;
                    // });
                    medifirstService.get('sysadmin/general/get-tindakan-ppi').then(function (e) {
                        $scope.listTindakan = e;
                    });
                }
            }

            function searchData() {
                if (!$scope.item.bulan) {
                    toastr.error("Harap pilih bulan terlebih dahulu !");
                    return
                }

                // if (!$scope.item.ruangan) {
                //     toastr.error("Harap pilih ruangan terlebih dahulu !");
                //     return
                // }
                $scope.isRouteLoading = true;
                let url = `rawatinap/get-audit-apd?bulan=${moment($scope.item.bulan).format("MM-YYYY")}`;
                
                if ($scope.item.ruangan && $scope.item.ruangan.id) {
                    url += `&objectruanganfk=${$scope.item.ruangan.id}`;
                }
                
                medifirstService.get(url).then(function (dat) {
                    $scope.isRouteLoading = false;

                    verifikator = dat.data.verifikator

                    if (verifikator.includes(pegawai.id.toString()) && $scope.columndinamis[0].command.length == 2) {
                        $scope.columndinamis[0].command.push({ 
                            text: "Verifikasi", 
                            click: verifikasi, 
                            attributes: { style: "margin-right: 10px; margin-top: 10px;" } 
                        })
                        $scope.columndinamis[0].command.push({ 
                            text: "Batalverif",
                            click: batalVerifikasi, 
                            attributes: { style: "margin-right: 10px; margin-top: 10px;" } 
                        })
                    }

                    for (let i = 0; i < dat.data.auditapd.length; i++) {
                        const element = dat.data.auditapd[i];
                        element.tanggalformat = $scope.formatTanggal(element.tanggal);
                    }
                    dataLoad = dat.data.auditapd;
                    creategrid();
                   
                    setTimeout(function() {
                        var grid = $("#grid").data("kendoGrid");
                        if (grid) {
                            grid.dataSource.page(currentPage);
                        }
                    }, 100);
                })
            }


            function renderColumn(data) {
                setColumnDefault();
                for (let i = 0; i < data.length; i++) {
                    const element = data[i];
                    var header = $scope.columndinamis.map(function (e) { return e.title; }).indexOf(element.header);
                    if (header > -1) {
                        var item =
                        {
                            field: `w${element.id}`,
                            title: element.description,
                            width: 150,
                            template: `# if(w${element.id}==true) {# ✔ # } else {# - #} #`,
                            headerAttributes: { style: "text-align : center" },
                        }
                        // console.log(item);
                        $scope.columndinamis[header].columns.push(item);
                    } else {
                        var item =
                        {
                            field: '',
                            title: element.header,
                            // width: 100,
                            headerAttributes: { style: "text-align : center" },
                            columns: [
                                {
                                    field: `w${element.id}`,
                                    title: element.description,
                                    width: 150,
                                    template: `# if(w${element.id}==true) {# ✔ # } else {# - #} #`,
                                    headerAttributes: { style: "text-align : center" },
                                }
                            ]
                        }
                        $scope.columndinamis.push(item);
                    }
                }

                // console.log($scope.columndinamis);
                creategrid();
            }

            function setColumnDefault() {
                const defaultColumnAttributes = {
                    locked: true,
                    attributes: {
                        style: "#= isverifikasi === true || isverifikasi === 1 ? 'background-color: rgba(0, 249, 21, 0.3);' : '' #"
                    }
                };

                $scope.columndinamis = [
                    {
                        "command": [
                            { 
                                text: "Edit", 
                                click: editData,
                                attributes: { style: "margin-right: 10px; margin-bottom: 10px;" }
                            },
                            { 
                                text: "Hapus", 
                                click: hapusData,
                                attributes: { style: "margin-right: 10px; margin-bottom: 10px;" }
                            }
                        ],
                        title: "",
                        width: 200,
                        ...defaultColumnAttributes
                    },
                    {
                        field: 'observer',
                        title: "OBSERVER",
                        width: 200,
                        ...defaultColumnAttributes
                    },
                    {
                        field: 'tanggalformat',
                        title: "TANGGAL",
                        width: 100,
                        ...defaultColumnAttributes
                    },
                    {
                        field: 'profesi',
                        title: "PROFESI YANG DIAUDIT",
                        width: 150,
                        ...defaultColumnAttributes
                    },
                    {
                        field: 'namaaktifitas',
                        title: "JENIS AKTIFITAS",
                        width: 250,
                        ...defaultColumnAttributes
                    },
                    {
                        field: 'namaruangan',
                        title: "RUANGAN",
                        width: 200,
                        ...defaultColumnAttributes
                    }
                ];
            }

            function creategrid() {
                $("#grid").empty();
                $("#grid").kendoGrid({
                    toolbar: [
                        {
                            name: "tambah",
                            text: "Tambah",
                            template: '<button class="k-button k-button-icontext addData">Tambah Data</button>'
                        }
                    ],
                    dataSource: {
                        data: dataLoad,
                        pageSize: 3
                    },
                    pageable: {
                        refresh: true,
                        pageSizes: [10, 20, 50, 100, "all"],
                        buttonCount: 5
                    },
                    height: "100%", 
                    selectable: "single",
                    page: currentPage,
                    change: onDataBound,
                    columns: $scope.columndinamis,
                    resizable: true,
                    reorderable: true,
                    dataBound: function() {
                        var grid = this;
                        grid.tbody.find("tr").each(function() {
                            var dataItem = grid.dataItem(this);
                            if (dataItem.isverifikasi === true || dataItem.isverifikasi === 1) {
                                $(this).find("td").css("background-color", "rgba(0, 249, 21, 0.3)");
                            }
                        });
                        grid.resize(true);
                    },
               change: function(e) {
                        currentPage = this.dataSource.page();
                    }
                }).data("kendoGrid");
            }

            $('body').on('click', '.addData', function (e) {
                // $("#grid").data("kendoGrid").addRow();
                if ($scope.item.ruangan == undefined) {
                    toastr.error('Harap pilih Ruangan terlebih dahulu !')
                    return
                }
                $scope.item.observer = {
                    id: medifirstService.getPegawaiLogin().id,
                    namalengkap: medifirstService.getPegawaiLogin().namaLengkap
                }
                // console.log($scope.item.observer);
                $scope.popUpIndex.center().open();
            });

            $scope.formatTanggal = function (tanggal) {
                if (tanggal != "null")
                    return moment(tanggal).format('DD-MMM-YYYY');
                else
                    return '-'
            }

            $scope.bulanSelected = moment($scope.item.bulan).format("MMMM YYYY")

            $scope.getBulan = function () {
                $scope.bulanString = moment($scope.item.bulan).format("MMMM YYYY")
                return "<center>" + $scope.bulanString + "</center>";
            }

            function onDataBound(e) {
                var grid = $("#grid").data("kendoGrid");
                if (grid.select().length > 0) {
                    var selectedItem = grid.dataItem(grid.select());
                    if (selectedItem != null) {
                        $scope.dataSelected = selectedItem;
                    }
                }
            }

            $scope.batal = function () {
                $scope.popUpIndex.close();
                clear()
            }

            function clear() {
                delete $scope.item.observer
                delete $scope.item.tanggal
                delete $scope.item.profesi
                delete $scope.item.aktifitas
                for (let i = 0; i < $scope.columndinamis.length; i++) {
                    const element = $scope.columndinamis[i];
                    if (element.field == '') {

                        for (let j = 0; j < element.columns.length; j++) {
                            const element2 = element.columns[j];
                            delete $scope.item[element2.field]
                        }
                    }
                }
            }
 
            function editData(e) {
                e.preventDefault();
                var grid = $("#grid").data("kendoGrid");
                var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

                if ($scope.item.ruangan == undefined) {
                    toastr.error('Harap pilih Ruangan terlebih dahulu !')
                    return
                }

                if (dataItem.isverifikasi === true || dataItem.isverifikasi === 1) {
                    toastr.error('Data Sudah Diverifikasi!')
                    return
                }

                if (verifikator.includes(pegawai.id.toString()) === false) {
                    toastr.error('Anda tidak memiliki akses untuk mengedit data ini!')
                    return
                }

                $scope.item.norecaudit = dataItem.norec
                $scope.item.observer = { id: dataItem.objectpegawaifk, namalengkap: dataItem.observer }
                $scope.item.tanggal = dataItem.tanggal
                $scope.item.profesi = { value: dataItem.objectjenispegawaifk, text: dataItem.profesi }
                $scope.item.aktifitas = {
                    id: dataItem.id,
                    namaaktifitas: dataItem.namaaktifitas,
                }

                for (let i = 0; i < $scope.columndinamis.length; i++) {
                    const element = $scope.columndinamis[i];
                    if (element.field == '') {
                        for (let j = 0; j < element.columns.length; j++) {
                            const element2 = element.columns[j];
                            $scope.item[element2.field] = dataItem[element2.field]
                        }
                    }
                }
                $scope.popUpIndex.center().open();
            }

            function hapusData(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                
                var grid = $("#grid").data("kendoGrid");
                var dataItem = grid.dataItem($(e.currentTarget).closest("tr"));

                if (dataItem.isverifikasi === true || dataItem.isverifikasi === 1) {
                    toastr.error('Data Sudah Diverifikasi!')
                    return
                }

                if (verifikator.includes(pegawai.id.toString()) === false) {
                    toastr.error('Anda tidak memiliki akses untuk menghapus data ini!')
                    return
                }

                $scope.$apply(function() {
                    var confirm = $mdDialog.confirm({
                        title: 'Peringatan',
                        textContent: 'Yakin mau menghapus data?',
                        ariaLabel: 'Lucky day',
                        ok: 'Ya',
                        cancel: 'Tidak'
                    });

                    $mdDialog.show(confirm).then(function () {
                        $scope.isRouteLoading = true;
                        medifirstService.post('rawatinap/delete-audit-apd', { 
                            norec: dataItem.norec 
                        }).then(function() {
                            $scope.isRouteLoading = false;
                            searchData();
                        });
                    });
                });
            }

            $scope.SaveRow = function () {

                if (!$scope.item.ruangan) {
                    toastr.error("Harap pilih Ruangan terlebih dahulu.")
                    return
                }
                if (!$scope.item.observer) {
                    toastr.error("Harap pilih Observer terlebih dahulu.")
                    return
                }
                if (!$scope.item.tanggal) {
                    toastr.error("Harap pilih Tanggal terlebih dahulu.")
                    return
                }
                if (!$scope.item.profesi) {
                    toastr.error("Harap pilih Profesi terlebih dahulu.")
                    return
                }
                if (!$scope.item.aktifitas) {
                    toastr.error("Harap isi Jenis Aktifitas terlebih dahulu.")
                    return
                }


                var jsontemp = {}
                for (let i = 0; i < $scope.columndinamis.length; i++) {
                    const element = $scope.columndinamis[i];
                    if (element.field == '') {

                        for (let j = 0; j < element.columns.length; j++) {
                            const element2 = element.columns[j];
                            jsontemp[element2.field] = $scope.item[element2.field]
                        }
                    }

                }
                var json = {
                    "norec": $scope.item.norecaudit == undefined ? '' : $scope.item.norecaudit,
                    "objectpegawaifk": $scope.item.observer.id,
                    "tanggal": moment($scope.item.tanggal).format("YYYY-MM-DD"),
                    "objectjenispegawaifk": $scope.item.profesi.value,
                    "jenisaktifitas": $scope.item.aktifitas.id,
                    "objectruanganfk": $scope.item.ruangan.id,
                }
                const jsonsave = { ...json, "detail": jsontemp, }

                $scope.isRouteLoading = true;
                medifirstService.post("rawatinap/save-audit-apd", jsonsave).then(function (dat) {
                    $scope.isRouteLoading = false;

                    // toastr.info(`Data ${$scope.item.aktifitas} berhasil ditambahkan`);
                    $scope.popUpIndex.close();
                    clear()
                    searchData()
                })
            }

            $scope.save = function () {
                if ($scope.item.ruangan == undefined) {
                    toastr.error('Ruangan Tidak Boleh Kosong')
                    return
                }
            }

            $scope.cari = function () {
                searchData();
            }

            $scope.onlyone = function (item) {

                if (item == "w9" || item == "w10") {
                    $scope.item["w9"] = false;
                    $scope.item["w10"] = false;
                }

                if (item == "w11" || item == "w12") {
                    $scope.item["w11"] = false;
                    $scope.item["w12"] = false;
                }
                $scope.item[item] = true;
            }

            function verifikasi(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var grid = $("#grid").data("kendoGrid");
                currentPage = grid.dataSource.page(); // Store current page

                if (dataItem.isverifikasi == true || dataItem.isverifikasi === 1) {
                    toastr.error("Data Telah diverifikasi")
                    return false
                }

                var confirm = $mdDialog.confirm()
                    .title('Konfirmasi')
                    .textContent('Apakah anda yakin ingin memverifikasi data ini?')
                    .cancel('Tidak')
                    .ok('Ya')

                $mdDialog.show(confirm).then(function () {
                    $scope.isRouteLoading = true;
                    return medifirstService.post('rawatinap/verifikasi-audit-apd', {
                        norec: dataItem.norec,
                    })
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        toastr.success('Data berhasil diverifikasi');
                        setTimeout(function() {
                            var newGrid = $("#grid").data("kendoGrid");
                            if (newGrid) {
                                newGrid.dataSource.page(currentPage);
                            }
                        }, 100);
                        searchData();
                    })
                    .catch(function() {
                        $scope.isRouteLoading = false;
                    });
                });
            }

            function batalVerifikasi(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                let dataItem = this.dataItem($(e.currentTarget).closest("tr"));
                var grid = $("#grid").data("kendoGrid");
                currentPage = grid.dataSource.page(); // Store current page

                if (!dataItem.isverifikasi == true || dataItem.isverifikasi === 1) {
                    toastr.error("Data Belum diverifikasi")
                    return false
                }

                var confirm = $mdDialog.confirm()
                    .title('Konfirmasi')
                    .textContent('Apakah anda yakin ingin batal verifikasi data ini?')
                    .cancel('Tidak')
                    .ok('Ya')

                $mdDialog.show(confirm).then(function () {
                    $scope.isRouteLoading = true;
                    return medifirstService.post('rawatinap/batal-verifikasi-audit-apd', {
                        norec: dataItem.norec,
                    })
                    .then(function (e) {
                        $scope.isRouteLoading = false;
                        toastr.success('Data berhasil di batal verifikasi');
                        setTimeout(function() {
                            var newGrid = $("#grid").data("kendoGrid");
                            if (newGrid) {
                                newGrid.dataSource.page(currentPage);
                            }
                        }, 100);
                        searchData();
                    })
                    .catch(function() {
                        $scope.isRouteLoading = false;
                    });
                });
            }

            $scope.laporanAPD = function () {

                var tempBulan = $scope.item.bulan;
                var tempRuangan = $scope.item.ruangan;

                $scope.item = {};

                if (tempBulan) {
                    $scope.item.bulan = tempBulan;
                }
                if (tempRuangan) {
                    $scope.item.ruangan = tempRuangan;
                }

                if (!$scope.item.bulan) {
                    toastr.error("Harap pilih bulan terlebih dahulu !");
                    return
                }

                var profile = JSON.parse(localStorage.getItem('profile'));
                var ruanganParam = $scope.item.ruangan ? '&objectruanganfk=' + $scope.item.ruangan.id : '';

                window.open(config.baseApiBackend
                    + 'report/cetak-apd-bulanan?'
                    + 'bulan=' + moment($scope.item.bulan).format("MM-YYYY")
                    + ruanganParam
                    + '&kdprofile=' + profile.id);
            }

            $scope.laporanJumlahAPD = function () {
                var tempBulan = $scope.item.bulan;
                var tempRuangan = $scope.item.ruangan;

                $scope.item = {};

                if (tempBulan) {
                    $scope.item.bulan = tempBulan;
                }
                if (tempRuangan) {
                    $scope.item.ruangan = tempRuangan;
                }

                if (!$scope.item.bulan) {
                    toastr.error("Harap pilih bulan terlebih dahulu !");
                    return
                }

                var profile = JSON.parse(localStorage.getItem('profile'));
                var ruanganParam = $scope.item.ruangan ? '&objectruanganfk=' + $scope.item.ruangan.id : '';

                window.open(config.baseApiBackend
                    + 'report/cetak-jumlah-apd?'
                    + 'bulan=' + moment($scope.item.bulan).format("MM-YYYY")
                    + ruanganParam
                    + '&kdprofile=' + profile.id);
            }

     

            /////////////////////////////// // ///////
        }
    ]);

});