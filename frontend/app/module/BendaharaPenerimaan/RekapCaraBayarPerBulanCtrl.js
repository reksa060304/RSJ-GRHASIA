define(['initialize'], function (initialize) {
    'use strict';
    initialize.controller('RekapCaraBayarPerBulanCtrl', ['$scope', 'DateHelper', '$http', '$state', 'MedifirstService', '$timeout',
        function ($scope, dateHelper, $http, $state, medifirstService, $timeout) {

            $scope.isRouteLoading = false;
            $scope.item           = {};
            $scope.now            = new Date();
            $scope.dataSelected   = {};
            $scope.item.jmlRows   = 50;
            $scope.item.bulan     = $scope.now;
            $scope.item.tahun     = $scope.now;

            // Simpan data hasil fetch terakhir supaya bisa dipakai ulang saat export Excel
            $scope.lastGridData = [];

            $scope.showAndHide = function () {
                $('#contentPencarian').fadeToggle('fast', 'linear');
            };

            $scope.monthUngkul = { start: 'year',   depth: 'year'   };
            $scope.yearUngkul  = { start: 'decade', depth: 'decade' };
            $scope.group       = [];

            //  Kategori cara bayar — statis, 4 pilihan
            $scope.listKategoriBayar = [
                { value: 'semua',    text: '-- Semua --' },
                { value: 'tunai',    text: 'Tunai'        },
                { value: 'transfer', text: 'Transfer'     },
                { value: 'qris',     text: 'Qris'         }
            ];
            $scope.item.kategoriBayar = $scope.listKategoriBayar[0];

            // Format Rupiah untuk tampilan grid (dengan "Rp. ")
            $scope.formatRupiah = function (value) {
                var num = parseFloat(value) || 0;
                return 'Rp. ' + num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            };

            window.formatRp = function (value) {
                var num = parseFloat(value) || 0;
                return 'Rp. ' + num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            };

            // Format angka gaya Indonesia TANPA "Rp." — dipakai khusus saat export Excel (sesuai gaya file referensi)
            function formatNumberID(value) {
                var num = parseFloat(value) || 0;
                return num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }

            // Hitung kedalaman level dari kode rekening (jumlah segmen dipisah titik)
            window.getDepth = function (kode) {
                if (!kode || kode === 'Total') { return 0; }
                return kode.split('.').length;
            };

            // Label bulan (Indonesia) dari nomor bulan
            var namaBulanID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

            // set data grid
            $scope.columnGrid = {
                toolbar      : ['excel'],
                excel        : { fileName: 'RekapCaraBayarPerBulan.xlsx', allPages: true },
                excelExport  : function (e) {
                    e.preventDefault();

                    var bln          = parseInt(moment($scope.item.bulan).format('MM'), 10);
                    var thn          = moment($scope.item.tahun).format('YYYY');
                    var namaBulan    = namaBulanID[bln - 1] || '';
                    var kategori     = $scope.item.kategoriBayar;
                    if (kategori && typeof kategori === 'object') { kategori = kategori.text; }
                    kategori = kategori || 'Semua';

                    var rows = [];

                    // Baris judul (merge 6 kolom)
                    rows.push({
                        cells: [
                            { value: 'Rekapitulasi Transaksi Pembayaran Lunas per Bulan', bold: true, fontSize: 13, colSpan: 6 }
                        ],
                        height: 22
                    });

                    // Baris subjudul (merge 6 kolom)
                    rows.push({
                        cells: [
                            { value: 'Dikelompokkan Berdasarkan Jenis Cara Bayar (QRIS, Transfer, Tunai) - Bulan ' + namaBulan + ' ' + thn + ' - Kategori: ' + kategori, bold: true, fontSize: 11, colSpan: 6 }
                        ],
                        height: 20
                    });

                    // Baris kosong
                    rows.push({ cells: [{ value: '' }] });

                    // Baris header tabel
                    rows.push({
                        cells: [
                            { value: 'Kode Rekening', bold: true, background: '#D9D9D9', textAlign: 'center' },
                            { value: 'Uraian',        bold: true, background: '#D9D9D9', textAlign: 'center' },
                            { value: 'QRIS',          bold: true, background: '#D9D9D9', textAlign: 'center' },
                            { value: 'TRANSFER',      bold: true, background: '#D9D9D9', textAlign: 'center' },
                            { value: 'TUNAI',         bold: true, background: '#D9D9D9', textAlign: 'center' },
                            { value: 'Jumlah',        bold: true, background: '#D9D9D9', textAlign: 'center' }
                        ]
                    });

                    // Baris data (pakai data yang sudah di-fetch, termasuk baris Total di akhir)
                    ($scope.lastGridData || []).forEach(function (row) {
                        var isTotal   = row.koderekening === 'Total';
                        var depth     = getDepth(row.koderekening);
                        var isBoldLvl = !isTotal && depth <= 6;
                        var bold      = isTotal || isBoldLvl;
                        var bg        = isTotal ? '#F2F2F2' : null;

                        rows.push({
                            cells: [
                                { value: row.koderekening,            bold: bold, background: bg },
                                { value: row.namarekening || '',      bold: bold, background: bg },
                                { value: formatNumberID(row.qris),     bold: bold, background: bg, textAlign: 'right' },
                                { value: formatNumberID(row.transfer), bold: bold, background: bg, textAlign: 'right' },
                                { value: formatNumberID(row.tunai),    bold: bold, background: bg, textAlign: 'right' },
                                { value: formatNumberID(row.jumlah),   bold: bold, background: bg, textAlign: 'right' }
                            ]
                        });
                    });

                    var workbook = new kendo.ooxml.Workbook({
                        sheets: [{
                            name   : namaBulan,
                            columns: [
                                { width: 200 },
                                { width: 380 },
                                { width: 150 },
                                { width: 150 },
                                { width: 150 },
                                { width: 160 }
                            ],
                            rows: rows
                        }]
                    });

                    kendo.saveAs({
                        dataURI : workbook.toDataURL(),
                        fileName: 'RekapCaraBayarPerBulan_' + namaBulan + '_' + thn + '.xlsx'
                    });
                },
                sortable  : false,
                selectable: true,
                pageable  : false,
                scrollable: true,
                columns   : buildColumns()
            };

            // Kolom bersifat tetap (tidak dinamis seperti laporan STS Pertanggal)
            function buildColumns() {
                return [
                    {
                        field: 'koderekening',
                        title: 'Kode Rekening',
                        width: '180px',
                        attributes: { style: 'text-align:left;' },
                        headerAttributes: { style: 'text-align:center;' },
                        template: '#= data.koderekening === "Total" ? "<b>Total</b>" : data.koderekening #'
                    },
                    {
                        field: 'namarekening',
                        title: 'Uraian',
                        width: '320px',
                        attributes: { style: 'text-align:left;' },
                        headerAttributes: { style: 'text-align:center;' },
                        // Tanpa indentasi — hanya bold untuk level ringkas (<=6 segmen), sama seperti gaya file Excel
                        template: '#= "<span style=\'font-weight:" + (getDepth(data.koderekening) <= 6 && data.koderekening !== "Total" ? "bold" : "normal") + "\'>" + (data.namarekening || "") + "</span>" #'
                    },
                    {
                        field: 'qris',
                        title: 'QRIS',
                        width: '150px',
                        attributes: { style: 'text-align:right;' },
                        headerAttributes: { style: 'text-align:center;' },
                        template: '#= formatRp(data.qris) #'
                    },
                    {
                        field: 'transfer',
                        title: 'TRANSFER',
                        width: '150px',
                        attributes: { style: 'text-align:right;' },
                        headerAttributes: { style: 'text-align:center;' },
                        template: '#= formatRp(data.transfer) #'
                    },
                    {
                        field: 'tunai',
                        title: 'TUNAI',
                        width: '150px',
                        attributes: { style: 'text-align:right;' },
                        headerAttributes: { style: 'text-align:center;' },
                        template: '#= formatRp(data.tunai) #'
                    },
                    {
                        field: 'jumlah',
                        title: 'Jumlah',
                        width: '160px',
                        attributes: { style: 'text-align:right; font-weight:bold;' },
                        headerAttributes: { style: 'text-align:center;' },
                        template: '#= formatRp(data.jumlah) #'
                    }
                ];
            }

            // INIT
            function init() {
                $scope.isRouteLoading = true;

                var bulan = moment($scope.item.bulan).format('MM');
                var tahun = moment($scope.item.tahun).format('YYYY');

                // k-ng-model Kendo bind object penuh → ambil .value nya
                var kategori = $scope.item.kategoriBayar;
                if (kategori && typeof kategori === 'object') {
                    kategori = kategori.value;
                }
                var kategoribayar = kategori ? ('&kategoribayar=' + kategori) : '';

                medifirstService.get(
                    'bendaharapenerimaan/get-rekap-carabayar-per-bulan?bulan=' + bulan + '&tahun=' + tahun + kategoribayar,
                    true
                ).then(function (dat) {
                    $scope.isRouteLoading = false;

                    var detail = dat.data.detail || [];
                    var total  = dat.data.total;

                    // Tambahkan baris Total di akhir data (backend hitung terpisah)
                    if (total) {
                        detail = detail.concat([total]);
                    }

                    // Simpan untuk dipakai saat export Excel
                    $scope.lastGridData = detail;

                    $timeout(function () {
                        var grid = $('#grid').data('kendoGrid');
                        if (grid) {
                            grid.setOptions({
                                columns    : buildColumns(),
                                dataSource : {
                                    data     : detail,
                                    pageSize : 200,
                                    schema   : {
                                        model: {
                                            fields: {
                                                koderekening: { type: 'string' },
                                                namarekening: { type: 'string' },
                                                qris        : { type: 'number' },
                                                transfer    : { type: 'number' },
                                                tunai       : { type: 'number' },
                                                jumlah      : { type: 'number' }
                                            }
                                        }
                                    }
                                }
                            });

                            // Kasih highlight khusus baris Total
                            grid.tbody.find('tr').each(function () {
                                var row = grid.dataItem(this);
                                if (row && row.koderekening === 'Total') {
                                    $(this).addClass('row-total');
                                }
                            });
                        }
                    });
                });
            }

            $scope.cariFilter = function () { init(); };
            $scope.klikGrid   = function () {};

            // Auto-load saat halaman pertama dibuka
            init();

            //////////////////////////////////////////////////////////////    END    /////////////////////////////////////////////////////////////////////
        }
    ]);
});