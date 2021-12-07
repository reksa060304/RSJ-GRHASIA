VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmSuratDokter 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmSuratDokter.frx":0000
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
Attribute VB_Name = "frmSuratDokter"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crCetakSuratDokter
Dim ReportSIS As New crCetakSuratIjinSakit
Dim ReportDIG As New crCetakSuratIjinDiagnosa
Dim ReportOP As New crCetakSuratIjinOpname
Dim ReportMen As New crCetakSuratIjinMeninggal
Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String
Dim strPort As String
Dim bolSKD As Boolean
Dim bolSIS As Boolean
Dim bolDIG As Boolean
Dim bolOP As Boolean
Dim bolMen As Boolean
Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
    If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
    If bolSKD = True Then
        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        Report.PrintOut False
    ElseIf bolSIS = True Then
        ReportSIS.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportSIS.PrintOut False
    ElseIf bolDIG = True Then
        ReportDIG.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportDIG.PrintOut False
    ElseIf bolOP = True Then
        ReportOP.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportOP.PrintOut False
    ElseIf bolMen = True Then
        ReportMen.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportMen.PrintOut False
    End If
End Sub

Private Sub CmdOption_Click()
    If bolSKD = True Then
        Report.PrinterSetup Me.hwnd
    ElseIf bolSIS = True Then
        ReportSIS.PrinterSetup Me.hwnd
    ElseIf bolDIG = True Then
        ReportDIG.PrinterSetup Me.hwnd
    ElseIf bolOP = True Then
        ReportOP.PrinterSetup Me.hwnd
    ElseIf bolMen = True Then
        ReportMen.PrinterSetup Me.hwnd
    End If
    
    
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    strPrinter = strPrinter1
    cboPrinter.Text = GetSetting("SMART", "SettingPrinter", "cboPrinter")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmSuratDokter = Nothing
End Sub

Public Sub CetakSuratDokter(strNorec As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
bolSKD = True
bolSIS = False
bolDIG = False
bolMen = False
Dim umur As String
Set frmSuratDokter = Nothing
Set Report = New crCetakSuratDokter

    ReadRs " SELECT ps.nocm,pd.noregistrasi,ps.namapasien || ' (' || CASE WHEN ps.objectjeniskelaminfk IS NULL THEN '' ELSE jk.reportdisplay || ') ' END AS namapasien, " & _
           " dg.namadiagnosa,CASE WHEN alm.nocmfk IS NULL THEN '' ELSE alm.alamatlengkap END AS alamat,ps.tgllahir,pd.tglregistrasi AS tgldaftar,pd.tglkontrol " & _
           " FROM pasiendaftar_t AS pd " & _
           " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec " & _
           " INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
           " LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk " & _
           " LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id " & _
           " LEFT JOIN detaildiagnosapasien_t AS ddp ON ddp.noregistrasifk = apd.norec AND ddp.objectjenisdiagnosafk = 1 " & _
           " LEFT JOIN diagnosa_m AS dg ON dg.id = ddp.objectdiagnosafk " & _
           " WHERE pd.norec = '" & strNorec & "' LIMIT 1"
           
    strSQL = " SELECT pr.namaproduk || ' ' || pp.aturanpakai AS namaobat " & _
             " FROM pelayananpasien_t AS pp " & _
             " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             " INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             " INNER JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk " & _
             " LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
             " Where pd.statusenabled = True " & _
             " AND pp.strukresepfk IS NOT NULL AND sr.isreseppulang = TRUE " & _
             " AND pp.jeniskemasanfk = 2 AND pd.norec = '" & strNorec & "' "
    strSQL = strSQL & " UNION ALL " & _
             " SELECT 'Racikan ' || pp.aturanpakai AS namaobat " & _
             " FROM pelayananpasien_t AS pp " & _
             " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
             " INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
             " INNER JOIN strukresep_t AS sr ON sr.norec = pp.strukresepfk " & _
             " LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
             " Where pd.statusenabled = True " & _
             " AND pp.strukresepfk IS NOT NULL AND sr.isreseppulang = TRUE " & _
             " AND pp.jeniskemasanfk = 1 GROUP BY pp.aturanpakai "
             
    ReadRs2 strSQL
    Dim aingmacan As String
    Dim i As Integer
    For i = 0 To RS2.RecordCount - 1
        aingmacan = aingmacan & " " & vbCrLf & RS2!namaobat
        RS2.MoveNext
    Next
       
    If rs.EOF = False Then
        umur = hitungUmur(Format(rs!tgllahir, "yyyy/MM/dd"), Format(rs!tgldaftar, "yyyy/MM/dd"))
    Else
        umur = ""
    End If
    
    With Report
        .txtNamaRs.SetText UCase$(strNamaLengkapRs)
        .txtAlamatRs.SetText strAlamatRS
        .txtEmail.SetText strEmail
        .txtWebsite.SetText strWebSite
        .txtNamaKota.SetText strNamaKota & ", "
        .txtUmur.SetText umur
        If Not rs.EOF Then
            .txtNamaPasien.SetText IIf(IsNull(rs("namapasien")), "", rs("namapasien"))
            .txtNoRm.SetText IIf(IsNull(rs("nocm")), "", rs("nocm"))
            .txtAlamat.SetText IIf(IsNull(rs("alamat")), "", rs("alamat"))
            .txtNamaDiagnosa.SetText IIf(IsNull(rs("namadiagnosa")), "", rs("namadiagnosa"))
            .txtObatPulang.SetText aingmacan
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "SuratKeteranganDokter")
                Report.SelectPrinter "winspool", strPrinter, "Ne00:"
                Report.PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = Report
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        End If
    End With
Exit Sub
errLoad:
End Sub

Public Sub CetakSuratKeteranganSakit(strNorec As String, strIdPegawai As String, view As String)
On Error GoTo errLoad
bolSKD = False
bolSIS = True
bolDIG = False
bolMen = False
Set frmSuratDokter = Nothing
Set frmCRCetakPasienPerjanjian = Nothing
Set ReportSIS = New crCetakSuratIjinSakit
Dim dromawi As String

    ReadRs " SELECT ps.nocm,pd.noregistrasi,ps.namapasien || ' (' || CASE WHEN ps.objectjeniskelaminfk IS NULL THEN '' ELSE jk.reportdisplay || ') ' END AS namapasien, " & _
           " dg.namadiagnosa,CASE WHEN alm.nocmfk IS NULL THEN '' ELSE alm.alamatlengkap END AS alamat,ps.tgllahir,pg.namalengkap, " & _
           " pd.tglregistrasi AS tgldaftar,pd.tglkontrol,pa.nokepesertaan,pa.norujukan,pa.tglrujukan,ap.nmprovider AS namafaskes,ru.namaruangan, " & _
           " EXTRACT(MONTH from pd.tglregistrasi) AS bulan,to_char(pd.tglregistrasi, 'DD-MM-YYYY') AS tanggal, ps.nobpjs, sr.* " & _
           " FROM suratrekomendasidpjp_t AS sr " & _
           " INNER JOIN pasiendaftar_t AS pd ON pd.norec = sr.pasiendaftarfk " & _
           " LEFT JOIN pemakaianasuransi_t AS pa ON pa.noregistrasifk = pd.norec " & _
           " INNER JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
           " LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk " & _
           " LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id " & _
           " LEFT JOIN diagnosa_m AS dg ON dg.id = pa.diagnosisfk " & _
           " LEFT JOIN asuransipasien_m AS ap ON ap.nocmfk = ps.id " & _
           " LEFT JOIN ruangan_m AS ru ON ru.id = sr.objectruanganfk " & _
           " LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk " & _
           " WHERE sr.pasiendaftarfk = '" & strNorec & "' LIMIT 1 "
        
'    If Not rs.EOF Then
'        dromawi = romawi(rs!bulan) & "/" & Format(Now, "yyyy")
'    Else
'        dromawi = ""
'    End If
    
    With ReportSIS
         .txtNamaRs.SetText UCase$(strNamaLengkapRs)
         .txtAlamatRs.SetText stralmtLengkapRs
         .txtNamaRs1.SetText UCase$(strNamaRS)
         .txtNamaKota.SetText strNamaKota & ", "
         '.txtBlnThn.SetText dromawi
        If Not rs.EOF Then
            .txtnosurat.SetText IIf(IsNull(rs("nosurat")), "", rs("nosurat"))
            .txtNamaPasien.SetText IIf(IsNull(rs("namapasien")), "", rs("namapasien"))
            .txtNoKartu.SetText IIf(IsNull(rs("nobpjs")), "", rs("nobpjs"))
            .txtNamaDiagnosa.SetText IIf(IsNull(rs("namadiagnosa")), "", rs("namadiagnosa"))
            .txtNoRujukan.SetText IIf(IsNull(rs("norujukan")), "", rs("norujukan"))
            .txtTglRujukan.SetText IIf(IsNull(rs("tglrujukan")), "", rs("tglrujukan"))
            .txtNamaFaskes.SetText IIf(IsNull(rs("namafaskes")), "", rs("namafaskes"))
            .txtNamaRuangan.SetText IIf(IsNull(rs("namaruangan")), "", rs("namaruangan"))
            .txttglkontrol.SetText IIf(IsNull(rs("tglkontrol")), "", rs("tglkontrol"))
            .txtNamaPoli.SetText IIf(IsNull(rs("namaruangan")), "", rs("namaruangan"))
            .txtNamaDokter.SetText IIf(IsNull(rs("namalengkap")), "", rs("namalengkap"))
            .txtUntuk.SetText IIf(IsNull(rs("untuk")), "", rs("untuk"))
            .txtobatkronis.SetText IIf(IsNull(rs("obatkronis")), "", rs("obatkronis"))
            .txtobatfaskes.SetText IIf(IsNull(rs("obatkefaskestingkat1")), "", rs("obatkefaskestingkat1"))
            .txtkembali.SetText IIf(IsNull(rs("kembalikefaskes1")), "", rs("kembalikefaskes1"))
            .txtfisio.SetText IIf(IsNull(rs("fisioterapi")), "", rs("fisioterapi"))
            .txtlamafisio.SetText IIf(IsNull(rs("lamafisioterapi")), "", rs("lamafisioterapi"))
            .txthemodialisa.SetText IIf(IsNull(rs("hemodialisa")), "", rs("hemodialisa"))
            .txtkemoterapi.SetText IIf(IsNull(rs("kemoterapi")), "", rs("kemoterapi"))
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "SuratKeteranganDokter")
                ReportSIS.SelectPrinter "winspool", strPrinter, "Ne00:"
                ReportSIS.PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = ReportSIS
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        End If
    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakSuratKeteranganDiagnosa(strNorec As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
bolSKD = False
bolSIS = False
bolMen = False
bolDIG = True

Set frmSuratDokter = Nothing
Set frmCRCetakPasienPerjanjian = Nothing
Set ReportDIG = New crCetakSuratIjinDiagnosa

    ReadRs " SELECT sk.nosurat,sk.norec,pm.nocm as noCm,pd.noregistrasi,pm.namapasien,to_char(pm.tgllahir, 'DD-MM-YYYY') as tgllahir,pm.tempatlahir, " & _
             " jk.jeniskelamin,alm.alamatlengkap,sk.keluhanlainnya,to_char(sk.tglawal, 'DD-Mon-YYYY') AS tglawal, " & _
             " to_char(sk.tglakhir, 'DD-Mon-YYYY') AS tglakhir,pg.namalengkap,'Medan,' || to_char(now(), 'DD-Mon-YYYY') as saiki, " & _
             " 'NIP. ' || CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nip, " & _
             " CASE WHEN pk.pekerjaan IS NULL THEN '' ELSE pk.pekerjaan END AS pekerjaan,EXTRACT (YEAR FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Thn ' || " & _
             " EXTRACT (MONTH FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Bln ' ||  EXTRACT (DAY FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Hr / ' || to_char(pm.tgllahir, 'DD-Mon-YYYY') AS umur FROM suratketerangan_t as sk " & _
             " INNER JOIN pasiendaftar_t as pd on pd.norec = sk.pasiendaftarfk " & _
             " INNER JOIN pasien_m as pm on pm.id = pd.nocmfk " & _
             " INNER JOIN alamat_m as alm on alm.nocmfk = pm.id " & _
             " INNER JOIN pegawai_m as pg on pg.id = sk.dokterfk " & _
             " INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk " & _
             " LEFT JOIN pekerjaan_m as pk on pk.id = pm.objectpekerjaanfk " & _
             " WHERE sk.norec = '" & strNorec & "'"
    
'    ReadRs strSQL
    Dim Laki As String
    Dim Cewe As String
    Dim nosurat As String
    If Not rs.EOF Then
       Laki = ""
       Cewe = ""
       If rs!jenisKelamin = "LAKI-LAKI" Then
        Laki = "V"
       ElseIf rs!jenisKelamin = "PEREMPUAN" Then
        Cewe = "V"
       End If
'       nosurat = rs!nosurat
    End If
    
    With ReportDIG
        If Not rs.EOF Then
            .txtNamaPemerintahan.SetText strNamaPemerintah
            .txtNamaRs.SetText strNamaLengkapRs
            .txtAlamatRs.SetText stralmtLengkapRs
            .txtWeb.SetText strEmail & ", " & strWebSite
            .txtKota.SetText rs!saiki
            .txtNamaPasien.SetText rs!namapasien
            .txtAlamatPasien.SetText rs!alamatlengkap
            .txtNamaDokter.SetText rs!namalengkap
            .txtPekerjaan.SetText rs!jenisKelamin
            .txtNip.SetText rs!nip
            .txtTanggalLahir.SetText rs!tgllahir
            .txtPria.SetText Laki
            .TxtCewe.SetText Cewe
            .txtLamaIjin.SetText rs!keluhanlainnya
            .txtTglAwal.SetText rs!noCm
'            .txtTglAkhir.SetText rs!tglAkhir
            .txtNoUrut.SetText rs!nosurat
            .txtTempatLahir.SetText rs!umur
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "SuratKeteranganDiagnosa")
                ReportDIG.SelectPrinter "winspool", strPrinter, "Ne00:"
                ReportDIG.PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = ReportDIG
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        End If
    End With
Exit Sub
errLoad:
End Sub

Public Sub CetakSuratKeteranganOpname(strNorec As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
bolSKD = False
bolSIS = False
bolDIG = False
bolMen = False
bolOP = True

Set frmSuratDokter = Nothing
Set frmCRCetakPasienPerjanjian = Nothing
Set ReportOP = New crCetakSuratIjinOpname

    ReadRs " SELECT to_char(pd.tglregistrasi, 'DD-Mon-YYYY') AS tglregistrasi,sk.nosurat,sk.norec,pm.nocm as noCm,pd.noregistrasi,pm.namapasien,to_char(pm.tgllahir, 'DD-MM-YYYY') as tgllahir,pm.tempatlahir, " & _
             " jk.jeniskelamin,alm.alamatlengkap,sk.keluhanlainnya,to_char(sk.tglawal, 'DD-Mon-YYYY') AS tglawal, " & _
             " to_char(sk.tglakhir, 'DD-Mon-YYYY') AS tglakhir,pg.namalengkap,'Medan,' || to_char(now(), 'DD-Mon-YYYY') as saiki, " & _
             " 'NIP. ' || CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nip, " & _
             " CASE WHEN pk.pekerjaan IS NULL THEN '' ELSE pk.pekerjaan END AS pekerjaan,EXTRACT (YEAR FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Thn ' || " & _
             " EXTRACT (MONTH FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Bln ' ||  EXTRACT (DAY FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Hr / ' || to_char(pm.tgllahir, 'DD-Mon-YYYY') AS umur FROM suratketerangan_t as sk " & _
             " INNER JOIN pasiendaftar_t as pd on pd.norec = sk.pasiendaftarfk " & _
             " INNER JOIN pasien_m as pm on pm.id = pd.nocmfk " & _
             " INNER JOIN alamat_m as alm on alm.nocmfk = pm.id " & _
             " INNER JOIN pegawai_m as pg on pg.id = sk.dokterfk " & _
             " INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk " & _
             " LEFT JOIN pekerjaan_m as pk on pk.id = pm.objectpekerjaanfk " & _
             " WHERE sk.norec = '" & strNorec & "'"
    
'    ReadRs strSQL
'    Dim Laki As String
'    Dim Cewe As String
'    Dim nosurat As String
'    If Not rs.EOF Then
'       Laki = ""
'       Cewe = ""
'       If rs!jenisKelamin = "LAKI-LAKI" Then
'        Laki = "V"
'       ElseIf rs!jenisKelamin = "PEREMPUAN" Then
'        Cewe = "V"
'       End If
''       nosurat = rs!nosurat
'    End If
    
    With ReportOP
        If Not rs.EOF Then
            .txtNamaPemerintahan.SetText strNamaPemerintah
            .txtNamaRs.SetText strNamaLengkapRs
            .txtAlamatRs.SetText stralmtLengkapRs
            .txtWeb.SetText strEmail & ", " & strWebSite
            .txtKota.SetText rs!saiki
            .txtNamaPasien.SetText rs!namapasien
            .txtAlamatPasien.SetText rs!alamatlengkap
            .txtNamaDokter.SetText rs!namalengkap
            .txtPekerjaan.SetText rs!jenisKelamin
            .txtNip.SetText rs!nip
            .txtTanggalLahir.SetText rs!tgllahir
'            .txtPria.SetText Laki
'            .TxtCewe.SetText Cewe
            .txtLamaIjin.SetText rs!tglRegistrasi
            .txtTglAwal.SetText rs!noCm
'            .txtTglAkhir.SetText rs!tglregistrasi
            .txtNoUrut.SetText rs!nosurat
            .txtTempatLahir.SetText rs!umur
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "SuratKeteranganDiagnosa")
                ReportOP.SelectPrinter "winspool", strPrinter, "Ne00:"
                ReportOP.PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = ReportOP
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        End If
    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakSuratKeteranganMeninggal(strNorec As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
bolSKD = False
bolSIS = False
bolDIG = False
bolOP = False
bolMen = True

Set frmSuratDokter = Nothing
Set frmCRCetakPasienPerjanjian = Nothing
Set ReportMen = New crCetakSuratIjinMeninggal

    ReadRs " SELECT to_char(pd.tglmeninggal, 'DD-Mon-YYYY') AS tglmeninggal, to_char(pd.tglregistrasi, 'DD-Mon-YYYY') AS tglregistrasi,sk.nosurat,sk.norec,pm.nocm as noCm,pd.noregistrasi,pm.namapasien,to_char(pm.tgllahir, 'DD-MM-YYYY') as tgllahir,pm.tempatlahir, " & _
             " jk.jeniskelamin,alm.alamatlengkap,sk.keluhanlainnya,to_char(sk.tglawal, 'DD-Mon-YYYY') AS tglawal, " & _
             " to_char(sk.tglakhir, 'DD-Mon-YYYY') AS tglakhir,pg.namalengkap,'Medan,' || to_char(now(), 'DD-Mon-YYYY') as saiki, " & _
             " 'NIP. ' || CASE WHEN pg.nippns IS NULL THEN '' ELSE pg.nippns END AS nip, " & _
             " CASE WHEN pk.pekerjaan IS NULL THEN '' ELSE pk.pekerjaan END AS pekerjaan,EXTRACT (YEAR FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Thn ' || " & _
             " EXTRACT (MONTH FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Bln ' ||  EXTRACT (DAY FROM(age(pd.tglregistrasi,pm.tgllahir))) || ' Hr / ' || to_char(pm.tgllahir, 'DD-Mon-YYYY') AS umur FROM suratketerangan_t as sk " & _
             " INNER JOIN pasiendaftar_t as pd on pd.norec = sk.pasiendaftarfk " & _
             " INNER JOIN pasien_m as pm on pm.id = pd.nocmfk " & _
             " INNER JOIN alamat_m as alm on alm.nocmfk = pm.id " & _
             " INNER JOIN pegawai_m as pg on pg.id = sk.dokterfk " & _
             " INNER JOIN jeniskelamin_m as jk on jk.id = pm.objectjeniskelaminfk " & _
             " LEFT JOIN pekerjaan_m as pk on pk.id = pm.objectpekerjaanfk " & _
             " WHERE sk.norec = '" & strNorec & "'"
    
'    ReadRs strSQL
'    Dim Laki As String
'    Dim Cewe As String
'    Dim nosurat As String
'    If Not rs.EOF Then
'       Laki = ""
'       Cewe = ""
'       If rs!jenisKelamin = "LAKI-LAKI" Then
'        Laki = "V"
'       ElseIf rs!jenisKelamin = "PEREMPUAN" Then
'        Cewe = "V"
'       End If
''       nosurat = rs!nosurat
'    End If
    
    With ReportMen
        If Not rs.EOF Then
            .txtNamaPemerintahan.SetText strNamaPemerintah
            .txtNamaRs.SetText strNamaLengkapRs
            .txtAlamatRs.SetText stralmtLengkapRs
            .txtWeb.SetText strEmail & ", " & strWebSite
            .txtKota.SetText rs!saiki
            .txtNamaPasien.SetText rs!namapasien
            .txtAlamatPasien.SetText rs!alamatlengkap
            .txtNamaDokter.SetText rs!namalengkap
            .txtPekerjaan.SetText rs!jenisKelamin
            .txtNip.SetText rs!nip
            .txtTanggalLahir.SetText rs!tgllahir
'            .txtPria.SetText Laki
'            .TxtCewe.SetText Cewe
            .txtLamaIjin.SetText rs!tglRegistrasi
            .txtTglAwal.SetText rs!noCm
'            .txtTglAkhir.SetText rs!tglregistrasi
            .txtNoUrut.SetText rs!nosurat
            .txtTempatLahir.SetText rs!umur
            .Text21.SetText rs!tglmeninggal
            
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "SuratKeteranganDiagnosa")
                ReportMen.SelectPrinter "winspool", strPrinter, "Ne00:"
                ReportOP.PrintOut False
                Unload Me
            Else
                With CRViewer1
                    .ReportSource = ReportMen
                    .ViewReport
                    .Zoom 1
                End With
                Me.Show
            End If
        End If
    End With
Exit Sub
errLoad:
End Sub



