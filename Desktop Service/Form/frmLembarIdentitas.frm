VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLembarIdentitas 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmLembarIdentitas.frx":0000
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
Attribute VB_Name = "frmLembarIdentitas"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crSuratLembarIdentitasMP 'crSuratLembarIdentitas

        Dim strDeviceName As String
        Dim strDriverName As String
        Dim strPort As String
        Dim bolStrukResep As Boolean

Private Sub cmdCetak_Click()
' If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
'    If bolStrukResep = True Then
'        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
'        Report.PrintOut False
'  Report.PrintOut False
'    End If
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    If bolStrukResep = True Then
        Report.PrinterSetup Me.hwnd
    End If
    CRViewer1.Refresh
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmLembarIdentitas = Nothing
End Sub

Public Sub Cetak(noCm As String, Noreg As String, caraBayar As String, umur As String, Petugas As String, view As String)
On Error GoTo errLoad
On Error Resume Next
Set frmLembarIdentitas = Nothing
Dim adocmd As New ADODB.Command
Dim strNocm As String
Dim strUmur As String
Dim strcaraBayar As String
Dim strPetugas As String
Dim strPenanggungjawab As String
Dim tglRegis As String
Dim JamRegis As String


         strSQL = " SELECT pm.alergi, pd.noregistrasi,pm.nocm,pm.namapasien,pd.tglregistrasi,pm.tempatlahir,pm.tgllahir,jk.jeniskelamin, " & _
                  " alm.alamatlengkap,alm.namadesakelurahan,alm.namakecamatan,alm.namakotakabupaten, " & _
                  " prop.namapropinsi,gd.golongandarah,spn.statusperkawinan,ag.agama,kp.kelompokpasien, " & _
                  " pkr.pekerjaan,pm.penanggungjawab,pm.alamatrmh,pm.teleponpenanggungjawab,pend.pendidikan,pm.noidentitas " & _
                  " FROM pasiendaftar_t AS pd " & _
                  " INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
                  " LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk " & _
                  " LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id " & _
                  " LEFT JOIN golongandarah_m AS gd ON gd.id = pm.objectgolongandarahfk " & _
                  " LEFT JOIN statusperkawinan_m AS spn ON spn.id = pm.objectstatusperkawinanfk " & _
                  " LEFT JOIN agama_m AS ag ON ag.id = pm.objectagamafk " & _
                  " LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk " & _
                  " LEFT JOIN propinsi_m AS prop ON prop.id = alm.objectpropinsifk " & _
                  " LEFT JOIN pekerjaan_m AS pkr ON pkr.id = pm.objectpekerjaanfk " & _
                  " LEFT JOIN pendidikan_m AS pend ON pend.id = pm.objectpendidikanfk " & _
                  " WHERE pd.statusenabled = true AND pd.noregistrasi = '" & Noreg & "' LIMIT 1 "
                  
    ReadRs2 strSQL
    If Not RS2.EOF Then
        strUmur = hitungUmur(Format(RS2!tgllahir, "yyyy/MM/dd"), Format(RS2!tglRegistrasi, "yyyy/MM/dd"))
    Else
        strUmur = ""
    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    With Report
        .database.AddADOCommand CN_String, adocmd
        If Not RS2.EOF Then
            '.txtNamaPemerintahan.SetText strNamaPemerintah
'            .txtNamaRs.SetText strNamaLengkapRs
'            .txtAlamatRs.SetText strAlamatRS & ", " & strKodePos
            '.txtTelpFax.SetText strNoTlpn & " " & strNoFax
            '.txtWebEmail.SetText strEmail & " " & strWebSite
            '.txtNamaKota.SetText strNamaKota & ", "
            '.txtPetugasRs.SetText "Petugas, " & strNamaRS
            '.txtNamaPemerintahan.SetText strNamaPemerintah
            .txtNamaRs.SetText strNamaLengkapRs
            .txtAlamatRs.SetText strAlamatRS & ", " & strKodePos
            
            .txtNomorRm.SetText IIf(IsNull(RS2("nocm")), "", RS2("nocm"))
            .txtNamaPasien.SetText IIf(IsNull(RS2("namapasien")), "", RS2("namapasien"))
            .txtJenisKelamin.SetText IIf(IsNull(RS2("jeniskelamin")), "", RS2("jeniskelamin"))
            .txtJenisKelamin2.SetText IIf(IsNull(RS2("jeniskelamin")), "", RS2("jeniskelamin"))
            .txtTempatTglLahir.SetText IIf(IsNull(RS2("tempatlahir")), "", RS2("tempatlahir")) & ", " & IIf(IsNull(RS2("tgllahir")), "", Format(RS2!tgllahir, "dd-mm-yyyy"))
            .txtGolonganDarah.SetText IIf(IsNull(RS2("golongandarah")), "", RS2("golongandarah"))
            .txtPendidikan.SetText IIf(IsNull(RS2("pendidikan")), "", RS2("pendidikan"))
            .txtStatus.SetText IIf(IsNull(RS2("statusperkawinan")), "", RS2("statusperkawinan"))
            .txtUmur.SetText strUmur
            .txtAgama.SetText IIf(IsNull(RS2("agama")), "", RS2("agama"))
            .txtStatus.SetText IIf(IsNull(RS2("statusperkawinan")), "", RS2("statusperkawinan"))
            .txtPekerjaan.SetText IIf(IsNull(RS2("pekerjaan")), "", RS2("pekerjaan"))
            .txtCaraBayar.SetText IIf(IsNull(RS2("kelompokpasien")), "", RS2("kelompokpasien"))
            .txtNomorKTP.SetText IIf(IsNull(RS2("noidentitas")), "", RS2("noidentitas"))
            .txtAlamatPasien.SetText IIf(IsNull(RS2("alamatlengkap")), "", RS2("alamatlengkap"))
            .txtKelurahan.SetText IIf(IsNull(RS2("namadesakelurahan")), "", RS2("namadesakelurahan"))
            .txtKecamatan.SetText IIf(IsNull(RS2("namakecamatan")), "", RS2("namakecamatan"))
            .txtKabupaten.SetText IIf(IsNull(RS2("namakotakabupaten")), "", RS2("namakotakabupaten"))
            .txtPropinsi.SetText IIf(IsNull(RS2("namapropinsi")), "", RS2("namapropinsi"))
            .txtNamapenanggungJawab.SetText IIf(IsNull(RS2("penanggungjawab")), "", RS2("penanggungjawab"))
            .txtAlamatPenanggungJawab.SetText IIf(IsNull(RS2("alamatrmh")), "", RS2("alamatrmh"))
            .txtTelepon.SetText IIf(IsNull(RS2("teleponpenanggungjawab")), "", RS2("teleponpenanggungjawab"))
            .Text62.SetText IIf(IsNull(RS2("alergi")), "", RS2("alergi"))
        End If
        
        If view = "false" Then
            Dim strPrinter As String
            strPrinter = GetTxt("Setting.ini", "Printer", "CetakLembarIdentitas")
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
            Screen.MousePointer = vbDefault
        End If
        
    End With
Exit Sub
errLoad:
End Sub
