define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('STSPertanggalV2Ctrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService', '$timeout',
        function ($scope, dateHelper, $http, $state, medifirstService, $timeout) {

            $scope.isRouteLoading = false;
            $scope.item           = {};
            $scope.now            = new Date();
            $scope.dataSelected   = {};
            $scope.item.jmlRows   = 50;
            $scope.item.bulan     = $scope.now;
            $scope.item.tahun     = $scope.now;

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle('fast', 'linear');
            };

            $scope.monthUngkul = { start: 'year',   depth: 'year'   };
            $scope.yearUngkul  = { start: 'decade', depth: 'decade' };
            $scope.group       = [];

            //  Cara bayar dari DB 
            $scope.listStatusBayar = [{ id: null, carabayar: '-- Semua --' }];
            medifirstService.get('sysadmin/general/get-combo-carabayar', true).then(function (res) {
                var list = res.data || res;
                $scope.listStatusBayar = [{ id: null, carabayar: '-- Semua --' }].concat(list);
            });

            // Format Rupiah 
            $scope.formatRupiah = function (value) {
                var num = parseInt(value) || 0;
                return 'Rp. ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            };

            window.formatRp = function (value) {
                var num = parseInt(value) || 0;
                return 'Rp. ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            };

            // set data grid
            $scope.columnGrid = {
                toolbar      : ['excel'],
                excel        : { fileName: 'STSPertanggalV2.xlsx', allPages: true },
                excelExport  : function (e) {
                    var sheet = e.workbook.sheets[0];
                    var bln   = moment($scope.item.bulan).format('MM');
                    var thn   = moment($scope.item.tahun).format('YYYY');
                    sheet.name = 'STSPertanggalV2';
                    sheet.rows.splice(0, 0, {
                        cells  : [{ value: 'STS Pertanggal ' + bln + ' ' + thn, fontSize: 14, textAlign: 'center', background: '#ffffff' }],
                        type   : 'header', height: 40
                    });
                },
                sortable  : true,
                selectable: true,
                pageable  : true,
                scrollable: true,
                columns   : []
            };

            $scope.columnGridSTS = {
                toolbar      : ['excel'],
                excel        : { fileName: 'DetailSTSPertanggalV2.xlsx', allPages: true },
                excelExport  : function (e) {
                    var sheet = e.workbook.sheets[0];
                    sheet.name = 'DetailSTSPertanggal';
                    sheet.rows.splice(0, 0, {
                        cells  : [{ value: 'Detail STS Pertanggal', fontSize: 14, textAlign: 'center', background: '#ffffff' }],
                        type   : 'header', height: 40
                    });
                },
                sortable  : true,
                selectable: true,
                pageable  : true,
                scrollable: true,
                columns   : []
            };

            // Helper build kolom dinamis
            function buildColumns(columns, mode) {
                var cols = [];

                if (mode === 'main') {
                    cols.push({
                        command: [{ text: 'Detail STS', click: DetailSTS, imageClass: 'clinic fa' }],
                        title: '', width: '110px'
                    });
                    cols.push({ field: 'tanggal', title: 'Tanggal', width: '80px',
                        headerAttributes: { style: 'text-align:center;' } });
                } else {
                    cols.push({ field: 'nosts',         title: 'No STS',        width: '130px' });
                    cols.push({ field: 'tglpenerimaan', title: 'Tgl Penerimaan', width: '120px' });
                }

                columns.forEach(function (col) {
                    var alias = col.alias;
                    var def   = {
                        field             : alias,
                        title             : col.namarekening,
                        width             : '130px',
                        attributes        : { style: 'text-align:right;' },
                        headerAttributes  : { style: 'text-align:center;' },
                        template          : '#= formatRp(data["' + alias + '"]) #'
                    };
                    if (mode === 'main') {
                        def.aggregates     = ['sum'];
                        def.footerTemplate = '#= formatRp(data["' + alias + '"].sum) #';
                    }
                    cols.push(def);
                });

                // Kolom Total paling kanan
                var totalCol = {
                    field            : '_total',
                    title            : 'Total',
                    width            : '150px',
                    attributes       : { style: 'text-align:right; font-weight:bold;' },
                    headerAttributes : { style: 'text-align:center;' },
                    template         : '#= formatRp(data["_total"]) #'
                };
                
                if (mode === 'main') {
                    totalCol.aggregates     = ['sum'];
                    totalCol.footerTemplate = '<span style="font-weight:bold;">#= formatRp(data["_total"].sum) #</span>';
                }
                cols.push(totalCol);

                return cols;
            }

            function buildAggregates(columns) {
                var aggs = columns.map(function (col) {
                    return { field: col.alias, aggregate: 'sum' };
                });
                aggs.push({ field: '_total', aggregate: 'sum' });
                return aggs;
            }

            function buildModelFields(columns) {
                var fields = {};
                columns.forEach(function (col) { fields[col.alias] = { type: 'number' }; });
                fields['_total'] = { type: 'number' };
                return fields;
            }

            function computeRowTotals(rows, columns) {
                rows.forEach(function (row) {
                    var total = 0;
                    columns.forEach(function (col) { total += parseInt(row[col.alias]) || 0; });
                    row._total = total;
                });
                return rows;
            }

            // INIT — main grid 
            function init() {
                $scope.isRouteLoading = true;

                var bulan = moment($scope.item.bulan).format('MM');
                var tahun = moment($scope.item.tahun).format('YYYY');
                var nosts = $scope.item.nosts ? ('&nosts=' + $scope.item.nosts) : '';

                // k-ng-model Kendo bind object penuh → ambil .id nya
                var idCaraBayar = $scope.item.statusBayar;
                if (idCaraBayar && typeof idCaraBayar === 'object') {
                    idCaraBayar = idCaraBayar.id;
                }
                var carabayar = idCaraBayar ? ('&carabayar=' + idCaraBayar) : '';

                medifirstService.get(
                    'bendaharapenerimaan/get-sts-pertanggal-v2?bulan=' + bulan + '&tahun=' + tahun + nosts + carabayar,
                    true
                ).then(function (dat) {
                    $scope.isRouteLoading = false;

                    var columns = dat.data.columns || [];
                    var detail  = computeRowTotals(dat.data.detail || [], columns);

                    // Guard: jangan update grid kalau columns kosong
                    if (columns.length === 0) { return; }

                    $timeout(function () {
                        var grid = $('#grid').data('kendoGrid');
                        if (grid) {
                            grid.setOptions({
                                columns    : buildColumns(columns, 'main'),
                                dataSource : {
                                    data     : detail,
                                    pageSize : 100,
                                    schema   : { model: { fields: buildModelFields(columns) } },
                                    aggregate: buildAggregates(columns)
                                }
                            });
                        }
                    });
                });
            }

            $scope.cariFilter  = function () { init(); };
            $scope.klikGrid    = function () {};
            $scope.klikGridSTS = function () {};

            //  Detail STS popup  
            function DetailSTS(e) {
                e.preventDefault();
                var dataItem = this.dataItem($(e.currentTarget).closest('tr'));

                var bulan = moment($scope.item.bulan).format('MM');
                var tahun = moment($scope.item.tahun).format('YYYY');
                var hari  = dataItem.tanggal;

                // Teruskan filter cara bayar yang sama ke detail
                var idCaraBayar = $scope.item.statusBayar;
                if (idCaraBayar && typeof idCaraBayar === 'object') {
                    idCaraBayar = idCaraBayar.id;
                }
                var carabayar = idCaraBayar ? ('&carabayar=' + idCaraBayar) : '';

                medifirstService.get(
                    'bendaharapenerimaan/get-detail-sts-pertanggal-v2?bulan=' + bulan +
                    '&tahun=' + tahun + '&tgl=' + hari + carabayar,
                    true
                ).then(function (dat) {
                    $scope.isRouteLoading = false;

                    var columns = dat.data.columns || [];
                    var detail  = computeRowTotals(dat.data.detail || [], columns);

                    // Guard: jangan update grid kalau columns kosong
                    if (columns.length === 0) { return; }

                    $timeout(function () {
                        var grid = $('#gridDetailSTS').data('kendoGrid');
                        if (grid) {
                            grid.setOptions({
                                columns    : buildColumns(columns, 'detail'),
                                dataSource : {
                                    data     : detail,
                                    pageSize : 100,
                                    schema   : { model: { fields: buildModelFields(columns) } },
                                    aggregate: []
                                }
                            });
                        }
                    });
                });

                $scope.popupDetailSTS.center().open();
            }

            // Auto-load saat halaman pertama dibuka
            init();

            //////////////////////////////////////////////////////////////    END    /////////////////////////////////////////////////////////////////////
        }
    ]);
});