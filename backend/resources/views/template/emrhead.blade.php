
<html ng-app="angularApp">
<head >
    <title>
        Report
    </title>
</head>
<style type="text/css" media="print">
    @media print
    {
        @page
        {
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
        /*padding:2px 4px 2px 4px;*/
    }
    .borderss{
        border-bottom: 1px solid black;
    }
    body{
        font-family: Tahoma, Geneva, sans-serif;
    }
</style>
{{----}}
<body style="background-color:  #FFFFFF" onLoad="window.print()">
<table  cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="793" style="margin-top: 20px">
    <tbody>
        <tr border="0">
            <td width="1%" border="0"></td>
            <td width="16%" border="0">
                <p align="left">
                    <img src="{{ asset('img/logo_anta.png') }}"
                         style="width: 100px" border="0"/>
                </p>
            </td>
            <td width="38%" border="0">
                <p align="left">
                    <font style="font-size: 14pt;" color="#000000" face="Tahoma"><b>{{$dataReport['namaprofile']}}</b></font><br>
                    <font style="font-size: 14pt;" color="#000000" face="Tahoma">{{$dataReport['alamat']}}</font><br>
                </p>
            </td>
            <td width="45%" border="0">
                <table  cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="1" width="100%">
                    <tr>
                        <td height="5" width="40%" style="border-right:none;border-bottom: none;">
                            <font style="font-size: 12pt;" color="#000000" face="Tahoma">&nbsp;&nbsp;No Rm</font>
                        </td>
                        <td height="5" width="2%" style="border-left:none;border-right:none;border-bottom: none;"><font size="1">:</font></td>
                        <td height="5" width="58%" style="border-left:none;border-bottom: none;"><font style="font-size: 12pt;" color="#000000" face="Tahoma">{{$dataReport['nocm']}}</font></td>
                    </tr>
                    <tr>
                        <td height="5" width="40%" style="border-right:none;border-top: none;border-bottom: none;">
                            <font style="font-size: 12pt;" color="#000000" face="Tahoma">&nbsp;&nbsp;Nama Pasien / JK</font>
                        </td>
                        <td height="5" width="2%" style="border-left:none;border-right:none;border-top: none;border-bottom: none;"><font size="1">:</font></td>
                        <td height="5" width="58%" style="border-left:none;border-top: none;border-bottom: none;"><font style="font-size: 12pt;" color="#000000" face="Tahoma">{{$dataReport['namapasien']}}/{{$dataReport['jk']}}</font></td>
                    </tr>
                    <tr>
                        <td height="5" width="40%" style="border-right:none;border-top: none;border-bottom: none;">
                            <font style="font-size: 12pt;" color="#000000" face="Tahoma">&nbsp;&nbsp;Tgl Lahir</font>
                        </td>
                        <td height="5" width="2%" style="border-left:none;border-right:none;border-top: none;border-bottom: none;"><font size="1">:</font></td>
                        <td height="5" width="58%" style="border-left:none;border-top: none;border-bottom: none;"><font style="font-size: 12pt;" color="#000000" face="Tahoma">{{$dataReport['tgllahir']}}</font></td>
                    </tr>
                    <tr>
                        <td height="5" width="40%" style="border-right:none;border-top: none;border-bottom: none;">
                            <font style="font-size: 12pt;" color="#000000" face="Tahoma">&nbsp;&nbsp;Tgl Dirawat</font>
                        </td>
                        <td height="5" width="2%" style="border-left:none;border-right:none;border-top: none;border-bottom: none;"><font size="1">:</font></td>
                        <td height="5" width="58%" style="border-left:none;border-top: none;border-bottom: none;"><font style="font-size: 12pt;" color="#000000" face="Tahoma">{{$dataReport['tglregistrasi']}}</font></td>
                    </tr>
                    <tr>
                        <td height="5" width="40%" style="border-right:none;border-top: none;">
                            <font style="font-size: 12pt;" color="#000000" face="Tahoma">&nbsp;&nbsp;Ruangan</font>
                        </td>
                        <td height="5" width="2%" style="border-left:none;border-right:none;border-top: none;"><font size="1">:</font></td>
                        <td height="5" width="58%" style="border-left:none;border-top: none;"><font style="font-size: 12pt;" color="#000000" face="Tahoma">{{$dataReport['namaruangan']}}</font></td>
                    </tr>
                </table>
            </td>
        </tr>
    </tbody>
</table>
@yield('bodyna')
</body>
</html>