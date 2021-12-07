VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmPermohonanPelayananJenazah 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmPermohonanPelayananJenazah.frx":0000
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
Attribute VB_Name = "frmPermohonanPelayananJenazah"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crSuratPermohonanPelayananJenazah
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim adoReport As New ADODB.Command

Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String

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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LaporanPasienPulang")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmPermohonanPelayananJenazah = Nothing
End Sub

Public Sub Cetak(strNoregistrasi As String, strIdPegawai As String, strPenPasien As String, strHubungan As String, strPermohonan As String, strUser As String, view As String)
'On Error GoTo errLoad
Dim adocmd As New ADODB.Command
Dim strSQL As String
Dim idPegawai As String
Dim Noregistrasi As String
Dim User As String
Set frmPermohonanPelayananJenazah = Nothing
Set Report = New crSuratPermohonanPelayananJenazah

If strNoregistrasi <> "" Then
    Noregistrasi = strNoregistrasi
Else
    Noregistrasi = ""
End If

If strUser <> "" Then
    User = strUser
Else
    User = " - "
End If
    
If strIdPegawai <> "" Then
   idPegawai = strIdPegawai
Else
   idPegawai = ""
End If


    With Report
        
        Set adoReport = New ADODB.Command
        adoReport.ActiveConnection = CN_String
              
        strSQL = " SELECT pm.nocm AS NoRm,pd.noregistrasi,pm.namapasien,pm.tgllahir,pd.tglregistrasi, " & _
                 " to_char(pm.tgllahir, 'DD-MM-YYYY') AS tglKelahiran,to_char(pd.tglregistrasi,'DD-MM-YYYY') AS tglRegis, " & _
                 " jk.jeniskelamin,jk.reportdisplay AS jklm,alm.alamatlengkap,pd.tglmeninggal, " & _
                 " to_char(pd.tglmeninggal,'DD-MM-YYYY') AS tglKematian,to_char(pd.tglmeninggal, 'HH:MI:SS') AS jamKematian, " & _
                 " CASE WHEN pd.objectpenyebabkematianfk IS NULL THEN ' Belum Diketahui ' WHEN pd.objectpenyebabkematianfk <> 4 THEN " & _
                 " pk.penyebabkematian WHEN pd.objectpenyebabkematianfk = 4 AND pd.keteranganpenyebabkematian IS NULL THEN ' Belum Diketahui ' " & _
                 " ELSE pd.keteranganpenyebabkematian END AS penyebabkematian,pj.tglpengambilan,initcap(pj.namapengambil) as namapengambil, " & _
                 " hk.hubungankeluarga,pg.namalengkap as petugas,CASE WHEN pg.nippns IS NULL THEN '-' ELSE pg.nippns END AS nip, " & _
                 " CASE WHEN pj.objectruanganfk IS NULL THEN '-' ELSE ru.namaruangan END AS ruanganmeninggal " & _
                 " FROM pasiendaftar_t AS pd " & _
                 " INNER JOIN pengambilanjenazah_t as pj on pj.objectpasiendaftarfk = pd.norec " & _
                 " INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
                 " LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk " & _
                 " LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id " & _
                 " LEFT JOIN penyebabkematian_m AS pk ON pk.id = pd.objectpenyebabkematianfk " & _
                 " LEFT JOIN hubungankeluarga_m as hk on hk.id = pj.objecthubunganfk " & _
                 " LEFT JOIN pegawai_m as pg on pg.id = pj.objectpegawaifk " & _
                 " LEFT JOIN ruangan_m as ru on ru.id = pj.objectruanganfk " & _
                 " WHERE pd.noregistrasi = '" & Noregistrasi & "' "
                         
       ReadRs strSQL
       
       ReadRs2 "select id,namalengkap,CASE WHEN nippns IS NULL THEN ' ' ELSE nippns END AS nippns from pegawai_m where id = '" & idPegawai & "' limit 1"
        
        adoReport.CommandText = strSQL
        adoReport.CommandType = adCmdUnknown
        .database.AddADOCommand CN_String, adoReport
        .txtUser.SetText User
        .txtNamaRs.SetText strNamaLengkapRs
        .txtAlamatRs.SetText strAlamatRS & ", " & strKodePos & ", " & strNoTlpn & ", " & strNoFax
        .txtWebEmail.SetText strEmail & ", " & strWebSite
        .txtNamaKota.SetText strNamaKota & ", "
        .txtNamaRs1.SetText strNamaLengkapRs
        .txtNamaRs2.SetText strNamaLengkapRs
        If Not rs.EOF Then
            .txtNoRekamMedis.SetText rs!NoRm
            .txtNamaPasien.SetText rs!namapasien
            .txtJenisKelamin.SetText rs!jeniskelamin
            .txtAlamatPasien.SetText rs!alamatlengkap
            .txtTglKematian.SetText rs!tglKematian & " " & rs!jamKematian
            .txtNamaPenerima1.SetText rs!namapengambil
            .txtPetugas.SetText rs!Petugas
            .txtNipPetugas.SetText "NIP: " & rs!nip
            .txtPenPasien.SetText strPenPasien
            .txtHubPasien.SetText strHubungan
            .txtPermohonan.SetText strPermohonan
            If IsNull(rs!tgllahir) Then
               .txtUmurPasien.SetText "-"
            Else
               .txtUmurPasien.SetText hitungUmurNew(Format(rs!tgllahir, "yyyy/MM/dd"), Format(rs!tglRegistrasi, "yyyy/MM/dd"))
            End If
        Else
            .txtUmurPasien.SetText " "
            .txtNamaPasien.SetText " "
            .txtJenisKelamin.SetText " "
            .txtAlamatPasien.SetText " "
            .txtTglKematian.SetText " "
            .txtNamaPenerima1.SetText " - "
            .txtPetugas.SetText " - "
            .txtNipPetugas.SetText "NIP: - "
        End If
        If Not RS2.EOF Then
            If IsNull(RS2!namalengkap) Then
               .txtPetugas.SetText "-"
               .txtNipPetugas.SetText "NIP : -"
            Else
               .txtPetugas.SetText RS2!namalengkap
               .txtNipPetugas.SetText "NIP : " & RS2!nippns
            End If
        Else
             .txtPetugas.SetText "-"
             .txtNipPetugas.SetText "NIP : -"
        End If
        If view = "false" Then
            strPrinter1 = GetTxt("Setting.ini", "Printer", "SuratPermohonanPelayananJenazah")
            .SelectPrinter "winspool", strPrinter1, "Ne00:"
            .PrintOut False
            Unload Me
            Screen.MousePointer = vbDefault
         Else
            With CRViewer1
                .ReportSource = Report
                .ViewReport
                .Zoom 1
            End With
            Me.Show
            Screen.MousePointer = vbDefault
        End If
    End With
Exit Sub
errLoad:
End Sub
