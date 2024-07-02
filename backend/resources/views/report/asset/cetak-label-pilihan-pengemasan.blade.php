<html>

<head>
    <title>
        Label Pengemasan
    </title>
    <link href="{{ asset('service/css/style.css') }}" rel="stylesheet">
</head>
<style type="text/css" media="print">
    @media print {
        @page {
            size: auto;
            margin: 0;
            /* size: portrait; */
        }

        footer {
            display: none
        }

        header {
            display: none
        }

        body {
            -webkit-print-color-adjust: exact !important;
        }
    }

    tr td {
        /padding: 2px 4px 2px 4px;/
    }

    .borderss {
        border-bottom: 1px solid black;
    }

    body {
        font-family: Tahoma, Geneva, sans-serif;
    }
</style>

<body style="background-color: #CCCCCC;margin: 0">
    @foreach ($data as $row)
    <div align="left">
        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="420" style="padding:15px;">
            <tr>
                <td style="text-align:center;">
                    <font style="font-size: 15pt;margin-left: 10px;font-weight: bold;" face="Tahoma">
                        LABEL PENGEMASAN
                    </font>
                </td>
            </tr>
        </table>
    </div>
    <div align="left">
        <table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="420" style="padding:5px;">
            <tr>
                <td width="30%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;">
                        Nomor
                    </font>
                </td>
                <td width="70%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;"> :
                        {{ $row->nomor }}
                    </font>
                </td>
            </tr>
            <tr>
                <td width="30%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;">
                        Kelompok Alat
                    </font>
                </td>
                <td width="70%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;"> :
                        {{ $row->namakelompokalat }}
                    </font>
                </td>
            </tr>
            <tr>
                <td width="30%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;">
                        Tanggal Pengemasan
                    </font>
                </td>
                <td width="70%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;"> :
                        {{ $row->tglpengemasan }}
                    </font>
                </td>
            </tr>
            <tr>
                <td width="30%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;">
                        Nama Pegawai
                    </font>
                </td>
                <td width="70%" style="height: 25px;">
                    <font style="font-size: 12pt;" face="Tahoma" color="#000000;"> :
                        {{ $row->namalengkap }}
                    </font>
                </td>
            </tr>

        </table>
    </div>
    @endforeach
</body>

</html>