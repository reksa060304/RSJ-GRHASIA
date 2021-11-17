@extends('template.master-report-pdf')

@php
$title = 'Lembar Input - Stok Opname';
$fileName = 'lembar input stokopname';
$ttdkota = 'Bandung';
$ttdh1 = 'Dibuat Oleh';
$contentbody = '';

$mainheader ='
    <tr class="border-none">                
        <td class="border-top-none border-bottom-none" height="30"><center><b><font size="5">LEMBAR INPUT STOK OPNAME</font></b></center></td>                
    </tr>
    <tr class="border-none">
        <td class="border-top-none border-bottom-none" height="20"><center><b><font size="5">PERIODE ' . $periode .'</font></b></center></td>
    </tr>
    <tr class="border-none">
        <td class="border-top-none border-bottom-none" height="5"><center><b><font size="5"></font></b></center></td>
    </tr>';

$header ='
    <tr >            
        <td height="40">
            <center>                    
                <b><font size="4">KLINIK BUNDA MULYA</font><br></b>
                <font size="2">Jl. Somawinata, Tanimulya, Kec. Ngamprah, Kabupaten Bandung Barat, Jawa Barat 40552</font>
            </center>
        </td>            
    </tr>
    <tr>
        <td  height="20"><center><b><font size="5"></font></b></center></td>
    </tr>            
</table>';

$thead = '
<thead class="report-content-header">
    <tr >
        <th height="30">NO</th>
        <th height="30">KODE</th>
        <th height="30">NAMA BARANG</th>
        <th height="30">NOTERIMA</th>    
        <th height="30" style="white-space:nowrap; width:3cm">STOK SISTEM</th>
        <th height="30" style="white-space:nowrap; width:3cm">STOK REAL</th>    
    </tr>
</thead>';

$i=0;
$tbody = '<tbody>';
foreach ($data as $dataview) {
    $kdbarang= $dataview->kdproduk;
    $namabarang = $dataview->namaproduk;
    $noterima = $dataview->noterima;
    $stoksistem = (float)$dataview->stoksistem;    
    
    $i++;

    $tbody .= '
    <tr>
        <td>'.$i.'</td>
        <td class="text-center">'.$kdbarang.'</td>
        <td class="text-wrap">'.$namabarang.'</td>
        <td class="text-center">'. $noterima .'</td>
        <td class="text-center">'.$stoksistem.'</td>
        <td class="text-center"></td>
    </tr>';
}

    $contentbody .= '<table class="border" style="border-top: none; ">';
    $contentbody .= $thead;
    $contentbody .= $tbody;    
    $contentbody .= '</tbody></table>';

@endphp