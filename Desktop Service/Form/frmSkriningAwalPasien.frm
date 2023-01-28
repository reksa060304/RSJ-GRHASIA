VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmSkriningAwalPasien 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmSkriningAwalPasien.frx":0000
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
Attribute VB_Name = "frmSkriningAwalPasien"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crSkriningAwalPasien 'crSuratLembarIdentitas

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
    Set frmSkriningAwalPasien = Nothing
End Sub

Public Sub Cetak(Noreg As String, view As String)
On Error GoTo errLoad
On Error Resume Next
Set frmSkriningAwalPasien = Nothing
Dim adocmd As New ADODB.Command
Dim strNocm As String
Dim strUmur As String
Dim strcaraBayar As String
Dim strPetugas As String
Dim strPenanggungjawab As String
Dim tglRegis As String
Dim JamRegis As String


    strSQL = " SELECT sap.*,pd.noregistrasi,pm.nocm,pm.noidentitas,pm.namapasien, " & _
             " to_char(pm.tgllahir, 'DD/MM/YYYY') AS tgllahir,to_char(pd.tglregistrasi,'DD/MM/YYYY HH24:MI:SS') AS tglregistrasi, " & _
             " jk.jeniskelamin,ru.namaruangan,pg.namalengkap, " & _
             " case when alm.alamatlengkap ilike '%kec.%' or alm.alamatlengkap ilike '%kab.%' or alm.alamatlengkap ilike '%kel.%'  then alm.alamatlengkap " & _
             "else alm.alamatlengkap ||' - Kel. '|| alm.namadesakelurahan || ' - Kec. '|| alm.namakecamatan || ' - '|| alm.namakotakabupaten end as alamatlengkap" & _
             " FROM pasiendaftar_t AS pd " & _
             " INNER JOIN skriningawalpasien_t AS sap ON sap.norec_pd = pd.norec " & _
             " INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
             " LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk " & _
             " LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id " & _
             " LEFT JOIN ruangan_m AS ru ON ru.id = sap.objectruanganfk " & _
             " LEFT JOIN pegawai_m AS pg ON pg.id = sap.pegawaifk " & _
             " WHERE pd.statusenabled = true AND pd.noregistrasi = '" & Noreg & "' LIMIT 1 "
                  
    ReadRs2 strSQL
'    If Not RS2.EOF Then
'        strUmur = hitungUmur(Format(RS2!tgllahir, "yyyy/MM/dd"), Format(RS2!tglRegistrasi, "yyyy/MM/dd"))
'    Else
'        strUmur = ""
'    End If
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    With Report
        .database.AddADOCommand CN_String, adocmd
'        .txtNamaRs.SetText UCase(strNamaLengkapRs)
'        .txtAlamatRs.SetText stralmtLengkapRs
        If Not RS2.EOF Then
             .txtNoRm.SetText IIf(IsNull(RS2("nocm")), "", RS2("nocm"))
             .txtNoRM1.SetText IIf(IsNull(RS2("nocm")), "", RS2("nocm"))
             .txtNamaPasien.SetText IIf(IsNull(RS2("namapasien")), "", RS2("namapasien"))
             .txtNamaPasien1.SetText IIf(IsNull(RS2("namapasien")), "", RS2("namapasien"))
             .txtJenisKelamin.SetText IIf(IsNull(RS2("jeniskelamin")), "", RS2("jeniskelamin"))
             .txtJenisKelamin1.SetText IIf(IsNull(RS2("jeniskelamin")), "", RS2("jeniskelamin"))
             .txttgllahir.SetText IIf(IsNull(RS2("tgllahir")), "", RS2("tgllahir"))
             .txtTglLahir1.SetText IIf(IsNull(RS2("tgllahir")), "", RS2("tgllahir"))
             .txtAlamatPasien.SetText IIf(IsNull(RS2("alamatlengkap")), "", RS2("alamatlengkap"))
             .txtKeteranganKhusus.SetText IIf(IsNull(RS2("keterangankhusus")), "", RS2("keterangankhusus"))
             .txtPetugasSkrining.SetText IIf(IsNull(RS2("namalengkap")), "(_____________________)", RS2("namalengkap"))
             If RS2!kesadaran = 0 Then
                .txtKesadaran0.SetText "V"
             ElseIf RS2!kesadaran = 1 Then
                .txtKesadaran1.SetText "V"
             ElseIf RS2!kesadaran = 2 Then
                .txtKesadaran2.SetText "V"
             End If
             If RS2!transportasi = 0 Then
                .txtTransportasi0.SetText "V"
             ElseIf RS2!transportasi = 1 Then
                .txtTransportasi1.SetText "V"
             ElseIf RS2!transportasi = 2 Then
                .txtTransportasi2.SetText "V"
             End If
             If RS2!teruskanke = 0 Then
                .txtPasienke0.SetText "V"
             ElseIf RS2!teruskanke = 1 Then
                .txtPasienke1.SetText "V"
             ElseIf RS2!teruskanke = 2 Then
                .txtPasienke2.SetText "V"
             ElseIf RS2!teruskanke = 3 Then
                .txtPasienke3.SetText "V"
             ElseIf RS2!teruskanke = 4 Then
                .txtPasienke4.SetText "V"
             End If
             If RS2!ketkhusus = 0 Then
                .txtKhusus0.SetText "V"
             ElseIf RS2!ketkhusus = 1 Then
                .txtKhusus1.SetText "V"
             End If
             If RS2!screentb = 0 Then
                .txtTb1.SetText "V"
             ElseIf RS2!screentb = 1 Then
                .txtTb2.SetText "V"
             End If
        End If
        
        If view = "false" Then
            Dim strPrinter As String
            strPrinter = GetTxt("Setting.ini", "Printer", "SkriningAwalPasien")
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
