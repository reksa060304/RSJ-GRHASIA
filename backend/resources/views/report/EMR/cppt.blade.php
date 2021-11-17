@extends('template.emrhead')
@section('bodyna')
    <table  cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0" width="793" align="center" >
        <tr border="0">
            <td width="1%" border="0" style="text-align: center">
                <p align="center">
                    <hr style="border-style: solid"/>
                    <font style="font-size: 12pt;" color="#000000" face="Tahoma"><b>{{$dataReport['judul']}}</b></font><br>
                    <hr style="border-style: solid"/>
                </p>
            </td>
        </tr>
    </table>
    <table  cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="1" width="793" >
        <tr>
            <td width="1%" border="0" style="text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">Tanggal/Jam</font>
            </td>
            <td width="1%" border="0" style="text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                    <b>
                        HASIL PEMERIKSAAN, ANALISA, RENCANA PENATALAKSANAAN
                        PASIEN
                    </b><br />
                    (Tulis dengan format SOAP, disertai dengan target yang terukur,
                    evaluasi hasil tatalaksan dituliskan dalam assesmen, harap bubuhkan
                    nama dan paraf)
                </font>
            </td>
            <td width="1%" border="0" style="text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                    <b>Instruksi Tenaga Kesehatan
                        Termasuk Pasca
                        Bedah/Prosedur</b><br />
                        (Instruksi ditulis dengan
                        rinci dan benar)
                </font>
            </td>
            <td width="1%" border="0" style="text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                   Bubuhkan Nama dan Paraf
                </font>
            </td>
        </tr>
        <tr>
            <td height="100px" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                    {{$dataReport['tglemr']}}
                </font></td>
            <td height="100px" style="border-top: none;border-bottom: none;text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                    {{$dataReport['fieldsatu']}}
                </font>
            </td>
            <td height="100px" style="border-top: none;border-bottom: none;text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['fielddua']}}
                </font></td>
            <td height="100px" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['dokter']}}</font></td>
        </tr>
    </table>
@endsection
