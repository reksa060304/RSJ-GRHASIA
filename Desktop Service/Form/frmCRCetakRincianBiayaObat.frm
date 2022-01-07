VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakRincianBiayaObat 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakRincianBiayaObat.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   5820
   WindowState     =   2  'Maximized
   Begin VB.CommandButton cmdOption 
      Caption         =   "Option"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   4920
      TabIndex        =   4
      Top             =   480
      Width           =   975
   End
   Begin VB.CommandButton cmdCetak 
      Caption         =   "Cetak"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   3960
      TabIndex        =   3
      Top             =   480
      Width           =   975
   End
   Begin VB.ComboBox cboPrinter 
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   8.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   315
      Left            =   960
      TabIndex        =   2
      Top             =   480
      Width           =   3015
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7000
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5800
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   0   'False
      EnableNavigationControls=   -1  'True
      EnableStopButton=   -1  'True
      EnablePrintButton=   -1  'True
      EnableZoomControl=   -1  'True
      EnableCloseButton=   -1  'True
      EnableProgressControl=   -1  'True
      EnableSearchControl=   -1  'True
      EnableRefreshButton=   -1  'True
      EnableDrillDown =   -1  'True
      EnableAnimationControl=   -1  'True
      EnableSelectExpertButton=   -1  'True
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   -1  'True
      EnableSearchExpertButton=   -1  'True
      EnableHelpButton=   -1  'True
   End
   Begin VB.TextBox txtNamaFormPengirim 
      Height          =   495
      Left            =   3120
      TabIndex        =   1
      Top             =   600
      Width           =   2175
   End
End
Attribute VB_Name = "frmCRCetakRincianBiayaObat"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crRincianBiayaObat
'Dim bolSuppresDetailSection10 As Boolean
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Private Sub cmdCetak_Click()
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "RincianBiayaPelayanan")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmCRCetakRincianBiayaObat = Nothing
End Sub

Public Sub CetakRincianBiayaObat(strNoregistrasi As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmCRCetakRincianBiayaObat = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter As String
strFilter = ""
    
Set Report = New crRincianBiayaObat
    strSQL = "SELECT x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk,x.dokterpj, " & _
             "x.tglregistrasi,x.tglpulang,x.namarekanan,x.ruangan AS ruangantindakan,SUBSTRING(x.namaproduk, 5, 255) as namaproduk,'-' as penulisresep,'-' as jenisproduk,x.dokter, " & _
             "SUM(x.jumlah) as jumlah,x.hargajual,SUM (x.total) AS total,x.namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namakelaspd " & _
             "FROM(SELECT *,USER AS namauser,SUBSTRING (ruangantindakan, 1, 10) AS ruangan FROM temp_billing_t WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             "AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') AND penulisresep IS NOT NULL) AS x " & _
             "Group By x.norec_pp,x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.objectdepartemenfk, " & _
             "x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.ruangan,x.dokter,x.namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             "x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.hargajual,x.namaproduk,x.namakelaspd"
    
    ReadRs "select case when pa.nosep is null then '-' else pa.nosep end as sep, pd.objectkelompokpasienlastfk as KelompokPasien " & _
            "from pemakaianasuransi_t as pa " & _
            "left join pasiendaftar_t as pd on pd.norec=pa.noregistrasifk " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' "
            
    ReadRs2 "select sum(hargajual) as totalDeposit from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk=402611 "
    
'    ReadRs3 "select ppd.hargadiscount,ppd.hargajual,ppd.komponenhargafk from pasiendaftar_t pd " & _
'            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
'            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
'            "left JOIN pelayananpasienpetugas_t as ppp on ppp.pelayananpasien=pp.norec " & _
'            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
'            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 and ppp.objectjenispetugaspefk=4 "
      
      ReadRs3 "select     sum(ppd.hargadiscount) as hargadiscount,ppd.komponenhargafk from pasiendaftar_t pd " & _
              "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
              "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
              "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
              "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 group by ppd.komponenhargafk "
    
    Dim TotalDiskonMedis  As Double
    Dim TotalDiskonUmum  As Double
    Dim i As Integer
    
    
    For i = 0 To RS3.RecordCount - 1
        If RS3!komponenhargafk = 35 Then TotalDiskonMedis = TotalDiskonMedis + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        If RS3!komponenhargafk <> 35 Then TotalDiskonUmum = TotalDiskonUmum + CDbl(IIf(IsNull(RS3!hargadiscount), 0, RS3!hargadiscount))
        RS3.MoveNext
    Next
    
    Dim TotalDeposit As Double
    TotalDeposit = IIf(IsNull(RS2(0)), 0, RS2(0))
    
    
'    ReadRs2 "SELECT " & _
'            "sum((pp.jumlah*(pp.hargajual-case when pp.hargadiscount is null then 0 else pp.hargadiscount end))) as total " & _
'            "from pasiendaftar_t as pd " & _
'            "inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk=pd.norec " & _
'            "inner join pelayananpasien_t as pp on pp.noregistrasifk=apd.norec " & _
'            "inner join produk_m as pr on pr.id=pp.produkfk " & _
'            "inner join detailjenisproduk_m as djp on djp.id=pr.objectdetailjenisprodukfk " & _
'            "inner join jenisproduk_m as jp on jp.id=djp.objectjenisprodukfk " & _
'            "inner join pasien_m as ps on ps.id=pd.nocmfk " & _
'            "inner join jeniskelamin_m as jk on jk.id=ps.objectjeniskelaminfk " & _
'            "inner join ruangan_m  as ru on ru.id=pd.objectruanganlastfk " & _
'            "inner join ruangan_m  as ru2 on ru2.id=apd.objectruanganfk " & _
'            "LEFT join kelas_m  as kl on kl.id=pd.objectkelasfk " & _
'            "inner join pegawai_m  as pg on pg.id=pd.objectpegawaifk " & _
'            "inner join pegawai_m  as pg2 on pg2.id=apd.objectpegawaifk " & _
'            "left join rekanan_m  as rk on rk.id=pd.objectrekananfk " & _
'            "where pd.noregistrasi='" & strNoregistrasi & "' "

   
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        'If Not RS.EOF Then
            .txtNamaRs.SetText strNamaLengkapRs
            .txtAlamatRs.SetText strAlamatRS & ", " & strKodePos & ", " & strNoTlpn & ", " & strNoFax
            .txtWebEmail.SetText strEmail & ", " & strWebSite
            .usNoRegistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoCM.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasienjk}")
            .usRuangan.SetUnboundFieldSource ("{ado.unit}")
            .usKamar.SetUnboundFieldSource IIf(IsNull("{ado.namakamar}") = True, "-", ("{ado.namakamar}"))
            .usDokterPJawab.SetUnboundFieldSource ("{ado.dokterpj}")
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPlng.SetUnboundFieldSource IIf(IsNull("{ado.tglpulang}") = True, "-", ("{ado.tglpulang}"))
            .usPenjamin.SetUnboundFieldSource IIf(IsNull("{ado.namarekanan}") = True, ("-"), ("{ado.namarekanan}"))
            .usTipe.SetUnboundFieldSource ("{ado.tipepasien}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usJmlQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargajual}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usRuanganTindakan.SetUnboundFieldSource ("{ado.ruangantindakan}")
            .usNoStruk.SetUnboundFieldSource ("{ado.nobilling}")
            .ucDepartemen.SetUnboundFieldSource ("{ado.objectdepartemenfk}")
            .usNorecpp.SetUnboundFieldSource ("{ado.norec_pp}")
            .usPenulisResep.SetUnboundFieldSource ("{ado.penulisresep}")
            
            
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
'            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
'            .usNomor.SetUnboundFieldSource ("{ado.nomor}")
'            .usJenisProduk.SetUnboundFieldSource ("{ado.jenisproduk}")
'            .udTanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}")
            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
'            .ucAdministrasi.SetUnboundFieldSource ("0") '("{ado.administrasi}")
'            .ucMaterai.SetUnboundFieldSource ("0") '("{ado.materai}")

            If strNoStruk = "TOTALTOTALTOTAL" Then
                TotalDeposit = 0
                .Section11.Suppress = True
            Else
                .Section11.Suppress = False
            End If
            
            If rs.EOF = False Then
                If rs!KelompokPasien = 2 Or rs!KelompokPasien = 4 Then
                    .txtNoSep.SetText rs!sep
                Else
                    .txtNoSep.Suppress = True
                    .txtLblSep.Suppress = True
                    .txtLblSep2.Suppress = True
                End If
            Else
                .txtNoSep.Suppress = True
                .txtLblSep.Suppress = True
                .txtLblSep2.Suppress = True
            End If
            
            .ucDeposit.SetUnboundFieldSource (TotalDeposit) '("{ado.deposit}")
            '.ucDeposit.SetUnboundFieldSource 0 '(TotalDeposit) '("{ado.deposit}")
            .ucDiskonJasaMedis.SetUnboundFieldSource (TotalDiskonMedis)
            .ucDiskonUmum.SetUnboundFieldSource (TotalDiskonUmum) '("{ado.diskonumum}")
'            .ucSisaDeposit.SetUnboundFieldSource ("0")
            
            
            .ucDitanggungPerusahaan.SetUnboundFieldSource ("{ado.totalprekanan}")
            .ucDitanggungRS.SetUnboundFieldSource ("0") '("{ado.totalharusdibayarrs}")
            .ucDitanggungSendiri.SetUnboundFieldSource ("{ado.totalharusdibayar}")
'            .ucDitanggungSendiri.SetUnboundFieldSource ("{ado.totalharusdibayar}")
            .ucSurplusMinusRS.SetUnboundFieldSource ("0") '("{ado.SurplusMinusRS}")
            .usUser.SetUnboundFieldSource ("{ado.namauser}")
            .txtVersi.SetText App.Comments
            
            
            
'            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
'            If RS2.BOF Then
'                .txtUser.SetText "-"
'            Else
'                .txtUser.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            End If
            .txtUser.SetText UCase(strIdPegawai)
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RincianObatAlkes")
                .SelectPrinter "winspool", strPrinter, "Ne00:"
                .PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
