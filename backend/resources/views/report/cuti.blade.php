<html>
<head>
	<meta charset="utf-8">
	<title>Cuti</title>
	<link rel="stylesheet" href="{{ asset('css/paper.css') }} ">
	<link rel="stylesheet" href="{{ asset('css/table-v2.css') }}">
	<link rel="stylesheet" href="{{ asset('css/tabel.css') }}">
	<style>
		@page { size: A4 }
		tr td {
			padding: 1px 2px 1px 2px;
		}
	</style>

</head>
<body class="A4" style="font-size:12pt">
<section class="sheet padding-10mm" style="font-family:Tahoma;overflow: hidden;">
	<div align="center">
		<table class="bayangprint" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" border="0">
			<tbody>
			<tr>
				<td style="padding: 15px">
					<div align="center">
						<p align="right">
							<!--                        <a href="#"><font face="Arial"><img src="image/report_print.png" onclick="window.print()" height="40" border="0" width="39"></font></a>-->
							<!--                        <a href="#"><font face="Arial"><img src="image/report_pdf.png" height="40" border="0" width="39"></font></a>-->
							<!--                        <a href="#"><font face="Arial"><img src="image/report_close.png" onclick="window.close()" height="40" border="0" width="39"></font></a>-->
							<table cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" height="133" border="0" width="100%">
								<tbody>
								<tr>
									<td style="text-align:left">
										<div align="left">
											<table cellspacing="0" cellpadding="0" height="74" border="0"  width="100%">
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
						<font style="font-size: 15pt" color="#000000">PEMERINTAH PROVINSI JAWA TENGAH</font>
						<br>
						<font style="font-size: 15pt" color="#000000">RSJD SURAKARTA</font>
					</b>
					<br>
					<font style="font-size: 11pt" color="#000000"> Jl. Ki Hajar Dewantara No.80, Jebres, Kec. Jebres, Kota Surakarta, Jawa Tengah 57126 <br>
					</font>
				</td>
			</tr>
			<tr>
				<td width="105">&nbsp;</td>
				<td>&nbsp;</td>
			</tr>
			</tbody>
		</table>
		</td>
		</tr>
		</tbody>
		</table>
	</div>
	<hr style="color: black;
						    background-color: black;
						    height: 1px;
						    border: 1px solid black;">

	</td>
	</tr>
	<!-- KONTEN -->
	<tr>
		<td style="text-align:center">
			<h3>	SURAT IZIN CUTI TAHUNAN	</h3>
		</td>
	</tr>
	<tr >
		<td style="text-align:center;">
			<h3 style="margin-top: -10px">	NOMOR : {{ $data->noplanning }}</h3>
		</td>
	</tr>
	<tr style="text-align: left">

		<td style="text-align:left">
			<div align="left">
				<table style="font-size:15px; font-family:Tahoma" class="table-2">
					<tr>
						<td>Dasar </td>
						<td>:</td>
						<td>1.</td>
						<td style="padding-top: 18px;">Peraturan Pemerintah Republik Indonesia Nomor 11 Tahun 2017 tentang Manajemen Pegawai Negeri Sipil ;</td>
					</tr>
					<tr>
						<td></td>
						<td></td>
						<td>2.</td>
						<td>Peraturan Badan Kepegawaian Negara Republik Indonesia Nomor 24 tahun 2017 tentang Tata Cara Cuti Pegawai Negeri Sipil;</td>

					</tr>
					<tr>
						<td></td>
						<td></td>
						<td>3.</td>
						<td> Peraturan Peraturan Gubernur Jawa Tengah Nomor 27 tahun 2016 tanggal 5 Agustus 2016 tentang Pendelegasian Wewenang Menetapkan </td>

					</tr>
					<tr>
						<td></td>
						<td></td>
						<td></td>
						<td> dan Pemberian Kuasa dan Kepegawaian Negara Republik Indonesia Nomor 24 tahun 2017 tentang Tata Cara Cuti Pegawai Negeri Sipil;</td>

					</tr>
					<table>
			</div>
		</td>


	</tr>
	<tr style="text-align: left;margin-top: 20px">

		<td style="text-align:left">
			<tr >
				<td style="padding: 20px"> 1. Diberikan cuti tahunan untuk tahun 2020 kepada Pegawai Negeri Sipil : </td>
				<td></td>
				<td></td>
			</tr>
				<div align="left">
					<table style="font-size:14px; font-family:Tahoma;">
						<tr  >
							<td style="padding-left:30px;width: 100px">Nama </td>
							<td  style="width: 10px">:</td>
							<td>{{ $data->namalengkap }}</td>
						</tr>
						<tr>
							<td style="padding-left:30px;width:  100px">NIP </td>
							<td  style="width: 10px">:</td>
							<td>{{ $data->nip }}</td>
						</tr>
						<tr >
							<td style="padding-left:30px;width:  100px">Pangkat / Gol. Ruang</td>
							<td  style="width: 10px">:</td>
							<td>{{ $data->namapangkat !=null?$data->namapangkat .' / ':'' }}  {{ $data->golonganpegawai == null ? '' : $data->golonganpegawai }} {{ $data->namaruangan == null ? '' : $data->namaruangan }}</td>
						</tr>
						<tr >
							<td style="padding-left:30px;;width: 100px">Jabatan</td>
							<td  style="width: 10px">:</td>
							<td>{{ $data->namajabatan }}</td>
						</tr>
						<tr >
							<td style="padding-left:30px;width:  100px" >Unit Kerja</td>
							<td style="width: 10px">:</td>
							<td>RSJD Surakarta</td>
						</tr>
						<tr >
							@php
								$arrNum = count($data->listtanggalapprove) - 1 ;
							@endphp
							<td style="padding-left:30px;padding-top:20px" colspan="3" >Selama {{ count($data->listtanggalapprove) }} hari kerja terhitung
								mulai tanggal {{ count($data->listtanggalapprove) == 0 ? '-':App\Traits\Valet::getDateIndo( $data->listtanggalapprove[0]['tgl'])}}
								s.d. {{count($data->listtanggalapprove) ==0?'-':App\Traits\Valet::getDateIndo( $data->listtanggalapprove[$arrNum]['tgl']) }}
								, dengan ketentuan sebagai berikut : </td>

						</tr>
						<tr >
							<table style="padding-left:30px;">
								<tr >
									<td>a.</td>
									<td> Sebelum menjalankan cuti tahunan wajib menyerahkan pekerjaannya kepada atasan langsungnya
										atau pejabatan yang ditentukan.</td>
								</tr>

								<tr >
									<td>b.</td>
									<td>Setelah selesai menjalankan cuti tahunan wajib melaporkan diri kepada atasan langsungnya
										dan bekerja kembali sebagaimana biasa.</td>
								</tr>
							</table>


						</tr>
						<tr >



						</tr>

					</table>
				</div>
			<tr >
				<td style="padding-left: 38"> 2. Demikian Surat izin cuti tahunan ini dibuat untuk dapat digunakan sebagaimana mestinya.</td>
				<td></td>
				<td></td>
			</tr>
		</td>


	</tr>
	

	<!-- END KONTEN -->

	<!-- FOOTER -->


	<tr >
		<td>
			<table style="margin-top:25px;">
				<tr>
					<td width="400">

						<p style="margin-left:30px"><font face="Arial"><font style="font-size: 12pt">

								</font> <b><font style="font-size: 12pt">

									</font></b>
							</font></p>
					</td>
				</tr>
				<tr style="text-align: center">
					<td >

						<p style="margin-left:30px"><font face="Arial"><font style="font-size: 12pt"></font></p>
					</td>
					<td >
						<font style="font-size: 12pt" face="Arial"> {{  $config['dibuatdi'] }}, {{App\Traits\Valet::getDateIndo(date('Y-m-d'))}} </font>
						<br>
							<font style="font-size: 12pt;font-weight: bold" face="Arial">a.n. GUBERNUR JAWA TENGAH </font>
						<br>						
							<font style="font-size: 12pt;" face="Arial">{{ $config['jabatan'] }} </font>						
					</td>
				</tr>
				<tr>
					<td height="200" style="text-align: center;">
						<span>
							<img style="margin-top:-120px" src="http://api.qrserver.com/v1/create-qr-code/?color=000000&amp;bgcolor=FFFFFF&amp;data={{$url}}&amp;qzone=1&amp;margin=0&amp;size=120x120&amp;ecc=L" alt="qr code" />
						</span>
					</td>
					<td  style="text-align: center">
						<font style="font-size: 12pt" face="Arial"><b><u>{{$config['direktur']}}</u></b> </font>
						<br>
							<font style="font-size: 12pt;" face="Arial">{{$config['pangkat']}} </font>						
						<br>
							<font style="font-size: 12pt;" face="Arial">NIP : {{$config['nip']}} </font>						
					</td>
				</tr>
			</table>
		</td>
	</tr>


	<!-- END FOOTER -->


	</tbody>
	</table>
	</p>
	</div>
	</td>

	</tr>

	</tbody>
	</table>
	</div>


</section>
</body>
</html>
