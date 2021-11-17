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
                    Profesional Pemberian Asuhan
                </font>
            </td>
            <td width="1%" border="0" style="text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                    Hasil Asesmen Pasien dan Pembarian Pelayanan
                </font>
            </td>
            <td width="1%" border="0" style="text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                    Instruksi PPA Termasuk Pasca Bedah
                </font>
            </td>
            <td width="1%" border="0" style="text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">
                    Review & Verifikasi DPJP
                </font>
            </td>
        </tr>
        <tr>
            <td height="5" style="border-top: none;border-bottom: none;text-align: center">
                <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['111348']}}
                </font>
            </td>
            <td height="5" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['tglemr']}}</font></td>
            <td height="5" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['111351']}}</font></td>
            <td height="5" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['111354']}}</font></td>
            <td height="5" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['111355']}}</font></td>
            <td height="5" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['111356']}}</font></td>
            <td height="5" style="border-top: none;border-bottom: none;text-align: center"> <font style="font-size: 10pt;" color="#000000" face="Tahoma">{{$dataReport['111357']}}</font></td>
        </tr>
    </table>
@endsection
