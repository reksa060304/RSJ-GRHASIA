<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <title>Surat Tugas Payjem</title>

  <link rel="stylesheet" href="{{ asset('css/paper.css') }} ">
	<link rel="stylesheet" href="{{ asset('css/table-v2.css') }}">
	<link rel="stylesheet" href="{{ asset('css/tabel.css') }}">

  <!-- Set page size here: A5, A4 or A3 -->
  <!-- Set also "landscape" if you need -->
  <style>@page { size: A4 }</style>
</head>

<!-- Set "A5", "A4" or "A3" for class name -->
<!-- Set also "landscape" if you need -->
<body class="A4">

  <!-- Each sheet element should have the class "sheet" -->
  <!-- "padding-**mm" is optional: you can set 10, 15, 20 or 25 -->
  <section class="sheet padding-10mm">

    <table cellspacing="0" cellpadding="0" height="74" border="0" width="100%">
      <tbody>
      <tr>
        <td valign="top"></td>
      </tr>
      <tr>
        <td valign="top">
          <table cellspacing="0" cellpadding="0" border="0" width="100%">
            <tbody>
            <tr>
              <td width="105">
                  <p align="left">
                    <img src="{{ asset('img/provjateng.png') }}" border="0" style="width: 120px">
                  </p>
              </td>
              <td align="center">
                <b>
                  <font style="font-size: 16pt;font-family: Times New Roman;" color="#000000">PEMERINTAH PROVINSI JAWA TENGAH</font>
                  <br>
                  <font style="font-size: 18pt;font-family: Times New Roman;font-weight: bold;" color="#000000">RUMAH SAKIT JIWA DAERAH SURAKARTA</font>
                </b>
                <br>
                <font style="font-size: 8pt;font-family: Souvenir Lt BT;font-weight: bold;" color="#000000"> Jl. Ki HajarDewantoro 80 JebresKotak Pos 187 Surakarta 57126 Telp. (0371) 641442 Fax. (0371) 648920  <br>
                </font>
                <font style="font-size: 8pt;font-family: Souvenir Lt BT;font-weight: bold;" color="#000000"> E-mail : rsjdsurakarta@jatengprov.go.idWebsite : http://rsjd-surakarta.jatengprov.go.id <br>
                </font>                    
              </td>
            </tr>			
            </tbody>
          </table>
        </td>
      </tr>
      </tbody>
    </table>

    <hr style="color: black;background-color: black;height: 1px;border: 1px solid black;margin-top: -10px;">
    <div style="text-align:center">
      <h3 style="font-family: Arial Narrow;font-size: 12pt;margin-bottom: 10px;font-weight: bold;"><u>	SURAT  PERINTAH  TUGAS	</u></h3>
      <h3 style="margin-top: -10px;font-family: Arial Narrow;font-size: 12pt;margin-bottom: -29px;FONT-WEIGHT: 100;margin-left: -55px;">	Nomor : 094 / &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </h3>
    </div>
    <table style="font-size:12pt; font-family:Arial Narrow" class="table-2">
      <tbody>
        <tr>
          <td><b>Dasar</b> </td>
          <td>:</td>
          <td>1.</td>
          <td style="padding-top: 33px;text-align: justify;">Peraturan Gubernur Jawa Tengah Nomor 17 Tahun 2013 Tentang Perjalanan Dinas Gubernur/Wakil Gubernur, Pimpinan dan Anggota Dewan Perwakilan Rakyat, Pegawai Negeri Sipil, Calon Pegawai Negeri Sipil dan Pegawai Non Pegawai Negeri Sipil. </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td style="vertical-align: text-top;padding-top: 1px;">2.</td>
          <td style="text-align: justify;">Peraturan Gubernur Jawa Tengah Nomor 27 tahun 2020 tanggal 14 Agustus 2020 tentang Standar Harga Satuan Provinsi Jawa Tengah.</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td style="vertical-align: text-top;padding-top: 7px;">3.</td>
          <td style="padding-top: 7px;text-align: justify;">Keputusan Direktur RS.Jiwa Daerah Surakarta Nomor : 188/ 8396/ 12/ 2019 tanggal 26 Desember 2019 tentang Penetapan Besaran Biaya Perjalanan Dinas pada Rumah Sakit Jiwa Daerah Surakarta. </td>
        </tr>		
      </tbody>			
    </table>
	<div style="text-align:center">
      <h3 style="font-family: Arial Narrow;font-size: 12pt;margin-bottom: 10px;font-weight: bold;">M E M E R I N T A H K A N</h3>
	</div>
    <table style="font-size:12pt; font-family:Arial Narrow" class="table-2">
      <tbody>
        <tr>
          <td><b>Kepada</b> </td>
          <td>:</td>
          <td style="width: 100%;">
            <table style="font-size:12pt;font-family:Arial Narrow;width: 100%;" class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="1">
              <tbody>
                <tr style="background-color: darkgrey;">
                  <td style="width: 30px;text-align: center;">No</td>
                  <td style="width:200px;text-align: center;">Nama / NIP</td>
                  <td style="text-align: center;">Pangkat/ Gol. Ruang</td>
                  <td style="text-align: center;">Jabatan</td>
                </tr>
                <tr>
                  <td style="width: 30px;text-align: center;">1</td>
                  <td><b style="padding-left:5px">{{ $data->petugas1 }}</b><?php if($data->nippetugas1 != null && substr($data->nippetugas1,0,2) !='33' && $data->nippetugas1 !='-'){echo "<br>";} ?><b style="padding-left:5px"> {{ $data->nippetugas1 !=null && substr($data->nippetugas1,0,2) !='33'  && $data->nippetugas1 !='-'? "NIP. ".$data->nippetugas1 :"" }}</b></td>
                  <td style="text-align: center;">{{ $data->pangkatpetugas1 !=null?$data->pangkatpetugas1 .' / ':'BLUD' }}{{ $data->golongan1 == null ? '' : $data->golongan1 }} </td>
                  <td style="padding-left:5px">{{ $data->jabatan1 }}</td>
                </tr>
                <tr>
                  <td style="width: 30px;text-align: center;">2</td>
                  <td><b style="padding-left:5px">{{ $data->petugas2 }}</b><?php if($data->nippetugas2 != null && substr($data->nippetugas2,0,2) !='33' && $data->nippetugas2 !='-'){echo "<br>";} ?><b style="padding-left:5px"> {{ $data->nippetugas2 !=null && substr($data->nippetugas2,0,2) !='33'  && $data->nippetugas2 !='-'? "NIP. ".$data->nippetugas2 :"" }}</b></td>
                  <td style="text-align: center;">{{ $data->pangkatpetugas2 !=null?$data->pangkatpetugas2 .' / ':'BLUD' }}{{ $data->golongan2 == null ? '' : $data->golongan2 }}</td>
                  <td style="padding-left:5px">{{ $data->jabatan2 }}</td>
                </tr>
                <tr>
                  <td style="width: 30px;text-align: center;">3</td>
                  <td><b style="padding-left:5px">{{ $data->petugas3 }}</b><?php if($data->nippetugas3 != null && substr($data->nippetugas3,0,2) !='33' && $data->nippetugas3 !='-'){echo "<br>";} ?><b style="padding-left:5px"> {{ $data->nippetugas3 !=null && substr($data->nippetugas3,0,2) !='33'  && $data->nippetugas1 !='-'? "NIP. ".$data->nippetugas3 :"" }}</b></td>
                  <td style="text-align: center;">{{ $data->pangkatpetugas3 !=null?$data->pangkatpetugas3 .' / ':'BLUD' }}{{ $data->golongan3 == null ? '' : $data->golongan3 }}</td>
                  <td style="padding-left:5px">{{ $data->jabatan3 }}</td>
                </tr>
                <tr>
                  <td style="width: 30px;text-align: center;">4</td>
                  <td><b style="padding-left:5px">{{ $data->security }}</b></td>
                  <td style="text-align: center;">-</td>
                  <td style="padding-left:5px">Security </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        
      </tbody>			
    </table>
    <table style="font-size:12pt; font-family:Arial Narrow" class="table-2">
      <tbody>
        <tr>
          <td><b>Untuk</b> </td>
          <td>:</td>
          <td>1.</td>
          <td style="padding-top: 18px;">Melaksanakan tugas penjemputan pasien Tanggal {{ $data->tgl }} atas nama  : {{ $data->namapasien }} , permintaan keluarga/ penanggung jawab {{ $data->penanggungjawab }}  , bertempat di {{ $data->alamatrmh }} </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>2.</td>
          <td>Tidak menerima gratifikasi dalam bentuk apapun sesuai ketentuan.</td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>3.</td>
          <td>Melaporkan kepada kepala satuan unit kerja setempat guna pelaksanaan tugas  tersebut. </td>
        </tr>	
        <tr>
          <td></td>
          <td></td>
          <td>4.</td>
          <td>Melaporkan hasil pelaksanaan tugas kepada pejabat pemberi tugas. </td>
        </tr>	
        <tr>
          <td></td>
          <td></td>
          <td>5.</td>
          <td>Perintah ini dilaksanakan dengan penuh tanggung jawab. </td>
        </tr>	
        <tr>
          <td></td>
          <td></td>
          <td>6.</td>
          <td>Apabila  terdapat kekeliruan dalam Surat Perintah ini akan diadakan perbaikan sebagaimana mestinya.</td>
        </tr>	
      </tbody>			
    </table>
    <table>
      <tbody>
        <tr>
			<td style="text-align:left">
				<div align="left">                 
				</div>
			</td>
        </tr>	    
		<tr>
			<td>    
				<table class="tablepj">
					<tbody>
					<tr>
						<td>
						<table class="tablepj">
							<tbody>
							<tr>
								<td width="400">                     
								</td>
							</tr>
							<tr style="text-align: center">
								<td>						
								<p style="margin-left:30px"><font face="Arial Narrow"><font style="font-size: 12pt"></font></font></p><font face="Arial Narrow">
								</font></td>
								<td>
								<font style="font-size: 12pt" face="Arial Narrow"> {{  $config['dibuatdi'] }}, {{App\Traits\Valet::getDateIndo(date('Y-m-d',strtotime($data->tgl)))}} </font>
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">An. Direktur RS. Jiwa Daerah Surakarta </font>
								<br>
								<font style="font-size: 12pt;" face="Arial Narrow">Provinsi Jawa Tengah </font>
								<br>
								<font style="font-size: 12pt;" face="Arial Narrow">{{ $config['jabatan'] }} </font>
								<br>							
									<font style="font-size: 12pt;" face="Arial Narrow">{{ $config['jabatanlain'] }} </font>							
								</td>
							</tr>
							<tr>
								<td style="text-align: left;padding-top: 0px!important;margin-top: 0px!important;">
								<table>
									<tbody>
									<tr height="25">
										<td colspan="3">Yang melaksanakan tugas :</td>						
									</tr>
									<tr height="25">
										<td>1.</td>
										<td>:</td>
										<td>........................................................</td>
									</tr>
									<tr height="25">
										<td>2.</td>
										<td>:</td>
										<td>........................................................</td>
									</tr>
									<tr height="25">
										<td>3.</td>
										<td>:</td>
										<td>........................................................</td>
									</tr>
									<tr height="25">
										<td>4.</td>
										<td>:</td>
										<td>........................................................</td>
									</tr>
									</tbody>
								</table>
								</td>
								<td style="text-align: center;padding-top: 45px;">
								<font style="font-size: 12pt" face="Arial Narrow"><b><u>{{$config['direktur']}}</u></b> </font>
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">{{$config['pangkat']}} </font>						
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">NIP : {{$config['nip']}} </font>						
								</td>
							</tr>
							<tr>
								<td colspan='2' style="font-size: 12pt;text-align: center;">
								<font  face="Arial Narrow">Mengetahui </font>                     
								</td>
							</tr>
							<tr height=110>
								<td colspan='2' style="font-size: 12pt;text-align: center;">
								<font  face="Arial Narrow">(............................) </font>                     
								</td>
							</tr>
							</tbody>
						</table>
						</td>
					</tr>
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>
</div>

  </section>

  <!-- Halaman 2 Awal -->
  <section class="sheet padding-10mm">

  	<div style="text-align:center">
      <h3 style="font-family: Arial Narrow;font-size: 12pt;margin-top: 60px;font-weight: bold;margin-bottom: 20px;">SURAT TUGAS</h3>
	</div>
	<font style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;">Berdasarkan permintaan {{ $data->penanggungjawab }},  selaku penanggung jawab pasien </font>
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-left: 50px;">
		<tr height="25">
			<td>Nama</td>
			<td>: {{ $data->namapasien }}</td>
		</tr>
		<tr height="25">
			<td>Umur</td>
			<td>: <?php $tanggal = new DateTime($data->tgllahir); $today = new DateTime('today'); echo $today->diff($tanggal)->y;?> Tahun</td>
		</tr>
		<tr height="25">
			<td>Alamat</td>
			<td>: {{ $data->alamatrmh }}</td>
		</tr>
		<tr height="25">
			<td colspan="2" style="line-height: 1.5;">Yang  bertandatangan dibawah ini, dokter jaga IGD / Ka. Instalasi Gawat Darurat memohonkan kepada Direktur RSJD  Surakarta c.q. Kepala Bidang Keperawatan untuk menugaskan kepada:</td>
		</tr>
	</table>
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-top: 20px;margin-left: 55px;">
		<tr height="30">
			<td>1.</td>
			<td>{{ $data->petugas1 }}<?php echo "<br>"; ?> {{ $data->nippetugas1 !=null && substr($data->nippetugas1,0,2) !='33'  && $data->nippetugas1 !='-'? "PNS":"BLUD" }}</td>
		</tr>
		<tr height="30">
			<td>2.</td>
			<td>{{ $data->petugas2 }}<?php echo "<br>"; ?> {{ $data->nippetugas2 !=null && substr($data->nippetugas2,0,2) !='33'  && $data->nippetugas2 !='-'? "PNS":"BLUD" }}</td>
		</tr>
		<tr height="30">
			<td>3.</td>
			<td>{{ $data->petugas3 }}<?php echo "<br>"; ?> {{ $data->nippetugas3 !=null && substr($data->nippetugas3,0,2) !='33'  && $data->nippetugas3 !='-'? "PNS":"BLUD" }}</td>
		</tr>
		<tr height="30">
			<td>4.</td>
			<td>{{ $data->security }}</td>
		</tr>
	</table>
	<div style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;line-height: 1.5;">
		<font >Untuk melakukan penjemputan pasien tersebut di atas dan membawa ke RSJD Surakarta untuk dilakukan perawatan. Demikian surat tugas ini untuk dilaksanakan dengan penuh tanggung jawab.
 		</font>
	</div>
	<table class="tablepj" style="margin-top: 80px;">
		<tbody>
			<tr>
				<td>
				<table class="tablepj">
					<tbody>							
					<tr style="text-align: center">
						<td style="display: flex;"	>
							<div style="width:344px">	
								<font style="font-size: 12pt" face="Arial Narrow"> {{  $config['dibuatdi'] }}, {{App\Traits\Valet::getDateIndo(date('Y-m-d',strtotime($data->tgl)))}} </font>
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">Kepala Bidang Keperawatan </font>
								<br>
								<font style="font-size: 12pt;" face="Arial Narrow">RSJD Surakarta </font>														
							</div>
							<div style="width:344px">																						
								<font style="font-size: 12pt" face="Arial Narrow"> {{  $config['dibuatdi'] }}, {{App\Traits\Valet::getDateIndo(date('Y-m-d',strtotime($data->tgl)))}} </font>
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">Dokter Jaga Instalasi Gawat Darurat </font>
								<br>
								<font style="font-size: 12pt;" face="Arial Narrow">RSJD Surakarta </font>														
							</div>
						</td>
					</tr>
					<tr height="50">
						<td colspan="2">
						</td>
					</tr>
					<tr style="text-align: center;margin-top:40px">
						<td style="display: flex;"	>
							<div style="width:344px">	
								<font style="font-size: 12pt" face="Arial Narrow"> <u>H. Sukardi, S.Kep., MM</u> </font>
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">NIP: 19640831 198603 1 009 </font>
																			
							</div>
							<div style="width:344px">																						
																					
							</div>
						</td>
					</tr>
					
					</tbody>
				</table>
				</td>
			</tr>
		</tbody>
	</table>
  </section>
  <!-- Halaman 2 Akhir -->

   	<!-- Halaman 3 Awal -->
   	<section class="sheet padding-10mm">
	<div style="text-align:center">
      <h3 style="font-family: Arial Narrow;font-size: 12pt;margin-top: 60px;font-weight: bold;margin-bottom: 20px;">SURAT PERMOHONAN PENJEMPUTAN PASIEN</h3>
	</div>
	<font style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;">Yang bertanda tangan di bawah ini, saya: </font>
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-left: 50px;">
		<tr height="25">
			<td style="width:144px">Nama</td>
			<td>: {{ $data->penanggungjawab }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Umur</td>
			<td>: {{ $data->umurpenanggungjawab }} Tahun</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Alamat</td>
			<td>: {{ $data->alamatpenanggungjawab }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Hubungan dengan Pasien</td>
			<td>: {{ $data->hubungankeluargapenanggungjawab }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">No HP/Telepon</td>
			<td>: {{ $data->noteleponpenanggungjawab }}</td>
		</tr>		
	</table>
	<font style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;">Selaku penanggung jawab dari pasien: </font>
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-left: 50px;">
		<tr height="25">
			<td style="width:144px">Nama</td>
			<td>: {{ $data->namapasien }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Umur</td>
			<td>: <?php echo $today->diff($tanggal)->y;?> Tahun</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Jenis Kelamin</td>
			<td>: {{ $data->jk }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Alamat Lengkap</td>
			<td>: {{ $data->alamatrmh }}</td>
		</tr>
	</table>
	<div style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;margin-top:20px">
		<font style="line-height: 1.5;" >Dengan ini mengajukan permohonan kepada pihak Rumah Sakit Jiwa Daerah Surakarta untuk melakukan penjemputan terhadap pasien tersebut diatas dari alamat tempat tinggal dan untuk dirawat di Rumah Sakit Jiwa Daerah Surakarta. </font>
	</div>
	<table class="tablepj" style="margin-top: 80px;">
		<tbody>
			<tr>
				<td>
				<table class="tablepj">
					<tbody>							
					<tr style="text-align: center">
						<td style="display: flex;"	>
							<div style="width:344px">	
																						
							</div>
							<div style="width:344px">																						
								<font style="font-size: 12pt" face="Arial Narrow"> {{  $config['dibuatdi'] }}, {{App\Traits\Valet::getDateIndo(date('Y-m-d',strtotime($data->tgl)))}} </font>
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">Yang mengajukan permohonan </font>																					
							</div>
						</td>
					</tr>
					<tr height="50">
						<td colspan="2">
						</td>
					</tr>
					<tr style="text-align: center;margin-top:40px">
						<td style="display: flex;"	>
							<div style="width:344px">	
								
								
																			
							</div>
							<div style="width:344px">								
								<br>
								<font style="font-size: 12pt;" face="Arial Narrow">(...............................................)</font>														
																					
							</div>
						</td>
					</tr>
					
					</tbody>
				</table>
				</td>
			</tr>
		</tbody>
	</table>
	
    
  	</section>
	<!-- Halaman 3 Akhir -->

	<!-- Halaman 4 Awal -->
  	<section class="sheet padding-10mm">
	<div style="text-align:center">
      <h3 style="font-family: Arial Narrow;font-size: 12pt;margin-top: 60px;font-weight: bold;margin-bottom: 20px;">SURAT PERNYATAAN</h3>
	</div>
	<font style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;">Yang bertanda tangan di bawah ini, saya: </font>
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-left: 50px;">
		<tr height="25">
			<td style="width:144px">Nama</td>
			<td>: {{ $data->penanggungjawab }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Umur</td>
			<td>: {{ $data->umurpenanggungjawab }} Tahun</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Alamat</td>
			<td>: {{ $data->alamatpenanggungjawab }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Hubungan dengan Pasien</td>
			<td>: {{ $data->hubungankeluargapenanggungjawab }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">No HP/Telepon</td>
			<td>: {{ $data->noteleponpenanggungjawab }}</td>
		</tr>		
	</table>
	<font style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;">Selaku penanggung jawab dari pasien: </font>
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-left: 50px;">
		<tr height="25">
			<td style="width:144px">Nama</td>
			<td>: {{ $data->namapasien }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Umur</td>
			<td>: <?php echo $today->diff($tanggal)->y;?> Tahun</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Jenis Kelamin</td>
			<td>: {{ $data->jk }}</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Alamat Lengkap</td>
			<td>: {{ $data->alamatrmh }}</td>
		</tr>
	</table>
	<div style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;margin-top:20px">
		<font style="line-height: 1.5;" >Dengan ini menyatakan bahwa setelah mendapatkan penjelasan tentang prosedur penjemputan pasien, menyetujui: </font>
	</div>
	<ol style="font-family: Arial Narrow;font-size: 12pt; margin-left: 15px;margin-top:20px;line-height: 1.5;">
		<li>Tindakan pengikatan pasien</li>
		<li>Tindakan medis/injeksi obat yang diperlukan</li>
		<li>Tidak menuntut kepada tim penjemput maupun pihak Rumah Sakit Jiwa Daerah Surakarta jika terjadi kecelakaan/ hal lain yang diluar kemampuan petugas selama perjalanan menuju Rumah Sakit Jiwa Daerah Surakarta.</li>
		<li>Bersedia menanggung beaya penjemputan sesuai dengan ketentuan yang berlaku.</li>
		<li>Jika pasien tidak berada di tempat, dan tidak berhasil dibawa ke RSJD Surakarta, keluarga menggung bea 50 % dari kewajiban</li>
	</ol>
	<table class="tablepj" style="margin-top: 80px;">
		<tbody>
			<tr>
				<td>
				<table class="tablepj">
					<tbody>							
					<tr style="text-align: center">
						<td style="display: flex;"	>
							<div style="width:400px">	
																						
							</div>
							<div style="width:288px">																						
								<font style="font-size: 12pt" face="Arial Narrow"> {{  $config['dibuatdi'] }}, {{App\Traits\Valet::getDateIndo(date('Y-m-d',strtotime($data->tgl)))}} </font>
								<br>
									<font style="font-size: 12pt;" face="Arial Narrow">Yang mengajukan permohonan </font>																					
							</div>
						</td>
					</tr>
					<tr height="50">
						<td colspan="2">
						</td>
					</tr>
					<tr style="text-align: center;margin-top:40px">
						<td style="display: flex;"	>
							<div style="width:400px">	
								<table style="margin-left: 25px;">
									<tr height="25">
										<td style="text-align:left;">Saksi-Saksi:</td>
										<td></td>
									</tr>
									<tr height="25">
										<td>Nama</td>
										<td>Tanda Tangan</td>
									</tr>
									<tr height="25">
										<td>1. ..............................</td>
										<td>.................................</td>
									</tr>
									<tr height="25">
										<td>2. .............................</td>
										<td>.................................</td>
									</tr>
								</table>																						
							</div>
							<div style="width:288px">								
								<br>
								<font style="font-size: 12pt;" face="Arial Narrow">(...............................................)</font>														
																					
							</div>
						</td>
					</tr>
					
					</tbody>
				</table>
				</td>
			</tr>
		</tbody>
	</table>
	

	</section>
	<!-- Halaman 4 Awal -->

	<!-- Halaman 5 Awal -->
	<section class="sheet padding-10mm">
	<div style="text-align:center">
      <h3 style="font-family: Arial Narrow;font-size: 12pt;margin-top: 60px;font-weight: bold;margin-bottom: 20px;"><u>NOTA DINAS</u></h3>
	</div>	
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;">
		<tr height="25">
			<td style="width:144px">Kepada Yth</td>
			<td>: Direktur RSJD Surakarta</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Melalui</td>
			<td>: .............................................................................................................</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Dari</td>
			<td>: .............................................................................................................</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Tanggal</td>
			<td>: .............................................................................................................</td>
		</tr>
		<tr height="25">
			<td style="width:144px">Perihal</td>
			<td>: Laporan hasil perjalanan dinas</td>
		</tr>		
	</table>

	<hr style="color: black;background-color: black;height: 1px;border: 1px solid black;">
	<table style="font-family: Arial Narrow;font-size: 12pt;margin-left: 30px;">
		<tr height="25">
			<td >Melaksanakan Surat Perintah Tugas No. : ......................................................... Tanggal : ................................................. </td>			
		</tr>
		<tr height="25">
			<td >Perihal Perjalanan dinas dengan hormat kami laporkan perihal di atas sebagai berikut :</td>			
		</tr>
		<tr height="25">
			<td >Perjalanan dinas dalam rangka :    ..........................................................................................................................................</td>			
		</tr>
		<tr height="25">
			<td >telah dilaksanakan pada tanggal :    di.....................................................................................................................................</td>			
		</tr>
		<tr height="25">
			<td >Laporan hasil pelaksanaan perjalanan dinas:</td>			
		</tr>
		<tr height="25">
			<td >1.  ..................................................................................................................................................................................</td>			
		</tr>
		<tr height="25">
			<td >2.  ..................................................................................................................................................................................</td>			
		</tr>
		<tr height="25">
			<td >3.  ..................................................................................................................................................................................</td>			
		</tr>	
		<tr height="30">
			<td >Kesimpulan :</td>			
		</tr>	
		<tr height="25">
			<td >......................................................................................................................................................................................</td>			
		</tr>
		<tr height="30">
			<td >Usulan / Saran / Tindak Lanjut :</td>			
		</tr>	
		<tr height="25">
			<td >..............................................................................................................................................................................................</td>			
		</tr>
		<tr height="25">
			<td >..............................................................................................................................................................................................</td>			
		</tr>
	</table>
	<div style="font-family: Arial Narrow;font-size: 12pt;margin-left: 50px;margin-top:20px">
		<font style="line-height: 1.5;" >Demikian laporan kami untuk menjadikan periksa </font>
	</div>

	<table class="tablepj" style="margin-top: 20px;">
		<tbody>
			<tr>
				<td>
				<table class="tablepj">
					<tbody>							
					<tr style="text-align: left">
						<td style="display: flex;"	>
							<div style="width:400px">	
																						
							</div>
							<div style="width:288px">																						
								<font style="font-size: 12pt" face="Arial Narrow"> Yang melaksanakan </font>																													
							</div>
						</td>
					</tr>
					<tr style="text-align: left">
						<td style="display: flex;"	>
							<div style="width:400px">	
																						
							</div>
							<div style="width:288px">																						
								<table>
									<tr>
										<td>1.  </td>
										<td>{{ $data->petugas1 }}</td>
										<td> ..........</td>
									</tr>
									<tr>
										<td>2.  </td>
										<td>{{ $data->petugas2 }}</td>
										<td> ..........</td>
									</tr>
									<tr>
										<td>3.  </td>
										<td>{{ $data->petugas3 }}</td>
										<td> ..........</td>
									</tr>
									<tr>
										<td>4.  </td>
										<td>{{ $data->security }}</td>
										<td> ..........</td>
									</tr>
								</table>																													
							</div>
						</td>
					</tr>
					</tbody>
				</table>
				</td>
			</tr>
		</tbody>
	</table>
	</section>
	<!-- Halaman 5 Awal -->

</body>

</html>
