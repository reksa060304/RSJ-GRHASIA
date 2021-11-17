<?php

use \Mpdf\Mpdf;
ini_set("memory_limit","256M");
ini_set('max_execution_time', '300');
ini_set("pcre.backtrack_limit", "5000000");

$mpdf = new Mpdf(['orientation' => $pageorientation ,'format' => 'Letter']);
$mpdf->showImageErrors = true;
$mpdf->shrink_tables_to_fit = 1;

$isi = '
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Clinicis | Klinik Bunda Mulya | '. $title .'</title> 
    
    <style>
        body{
            font-family: "Arial Narrow";
            font-size: 10px;
        }
        
        table.border-out{            
            width: 100%;    
            border-collapse: collapse;                
        }
        table.border-out {            
            border: 1px solid black;
        }
        
        th, td{
            padding-left: 10px;
            padding-right: 10px;
        }
        table.border{            
            width: 100%;
            border-collapse: collapse;            
        }
        table.border,table.border th,table.border td {
            border: 1px solid black;
        }
        
        .text-center {
            text-align: center;
        }
        .text-left {
            text-align: left;
        }
        .text-right {
            text-align: right;
        }
        
        .background {
            background: #D9D9D9;
        }
        .bg-yellow {
            background: #FFFF99;
        }    
        img{
            width: 80px;
            height:auto;
        }   
        
        tr.border-none{
            border: none;
        }
        tr td.border-top-none{
            border-top: none;                            
        }
        tr td.border-bottom-none{
            border-bottom: none;      
        }
        table tr th.border-top-none{
            border-top: none;                            
        }                
        
        td.text-bold{
            font-weight: 900 !important;
        }
        
        div.tanda-tangan {  
            margin-top: 5mm;    
            page-break-inside: avoid ;                 
            float:right;           
            width: 300px;                        
            text-align: center;            
        }
        
        .tanda-tangan .nama {
            text-decoration: underline;             
            margin-top:2cm !important;
        }
        
        body{
            font-family: serif; 
            font-size: '. $fontsize .'pt;
        }
        
        thead.report-content-header {
            display: teble-header-group;
        }

        td.text-nowrap {
            white-space: nowrap !important;
        }

    </style>
</head>

<body>    
    <table class="border">';        

$isi .= $mainheader;        
$isi .= $header;
$isi .= $contentbody;


$tanggalHariIni =   date("d/m/Y");       /* date_format( date_create($tglcetak),"d/m/Y"); */

$tandatanganuser = '
    <div class="tanda-tangan" >
        <div>'. $ttdkota .', '. $tanggalHariIni .'</div>
        <div>'. $ttdh1 .'</div><br><br><br><br><br>
        <div class="nama"><b>'. $ttdnama .'</b></div>    
        <div class="nip" >Nip. '. $ttdnip .'</div>
    </div>';
    
    $contentfooter = '
        <table style="width: 100%; margin-top: 5mm">
            <tbody>
                <tr>
                    <td style="width: 70%; vertical-align: top">'. $footerreport .'</td>
                    <td style="text-align: center">'. $tandatanganuser .'</td>
                </tr>
            </tbody>    
        </table>
    ';
        
    $footerisi = '</body></html>';    
    
    /* {DATE Y-m-j H:i:s} */    
    $footer = '
    <div>
        <span style="font-style: italic; font-size: 10px; ">*Print By Clinicis | '. $fileName .' | '. $tglcetak .' | Hal. {PAGENO} dari {nb}</span>
    </div>';
    

    $mpdf->SetAuthor("Clinicis | Klinik Bunda Mulya");
    $mpdf->SetHTMLFooter($footer);   
    /* $mpdf->SetHTMLHeader($pageheader);  */    
   
    $mpdf->WriteHTML($isi); 

    /* jika page > 150 mm maka*/
    if($mpdf->y > 150){
        $mpdf->WriteHTML('<pagebreak/>');        
        $mpdf->WriteHTML($contentfooter);                
    }else{        
        $mpdf->WriteHTML($contentfooter);
    }    
    $mpdf->WriteHTML($footerisi); 
    
    $mpdf->debug = true;
    $mpdf->Output($fileName .'.pdf',\Mpdf\Output\Destination::INLINE);
    exit();