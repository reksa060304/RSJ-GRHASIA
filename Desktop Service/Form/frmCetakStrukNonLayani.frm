VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Object = "{248DD890-BB45-11CF-9ABC-0080C7E7B78D}#1.0#0"; "mswinsck.ocx"
Begin VB.Form frmCetakStrukNonLayan 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakStrukNonLayani.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   9075
   WindowState     =   2  'Maximized
   Begin MSWinsockLib.Winsock Winsock1 
      Left            =   8040
      Top             =   6120
      _ExtentX        =   741
      _ExtentY        =   741
      _Version        =   393216
   End
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
      Height          =   7005
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   9045
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
   Begin VB.PictureBox Picture1 
      Height          =   1095
      Left            =   4080
      ScaleHeight     =   1035
      ScaleWidth      =   4155
      TabIndex        =   5
      Top             =   3000
      Width           =   4215
   End
End
Attribute VB_Name = "frmCetakStrukNonLayan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New cetakBuktiLayanaRSJ
Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Dim bolBuktiPendaftaran As Boolean
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String

Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
    If bolBuktiPendaftaran = True Then
        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        Report.PrintOut False
    End If
    SaveSetting "SMART", "SettingPrinter", "cboPrinter", PrinterNama
End Sub

Private Sub CmdOption_Click()
    
    If bolBuktiPendaftaran = True Then
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
    Set frmCetakStrukNonLayan = Nothing
'    fso.DeleteFile (App.Path & "\tempbitmap.bmp")
'    Set sect = Nothing

End Sub

Public Sub cetakBukti(strNorec As String, User As String, view As String)
On Error GoTo errLoad
Set frmCetakStrukNonLayan = Nothing
Dim strSQL As String
Dim strSQL2 As String
Dim str1 As String
bolBuktiPendaftaran = True
Dim NamaPetugas As String
Dim alamatRs As String
Dim namaRs As String
Dim Apoteker As String
    
    'Call openConnection
    With Report
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            strSQL = " SELECT pp.norec,pm.nocm,pm.namapasien,to_char(pd.tglregistrasi, 'DD/MM/YYYY HH24:MI:SS') AS tglregistrasi, " & _
                     " to_char(pm.tgllahir, 'DD/MM/YYYY') AS tgllahir,alm.alamatlengkap,kp.kelompokpasien, " & _
                     " ru.namaruangan || ' (Perawat)' AS ruangan,pg.namalengkap,pr.namaproduk,pp.jumlah, " & _
                     " pp.hargajual,(pp.jumlah*(pp.hargajual - CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END)) AS total " & _
                     " FROM pasiendaftar_t AS pd " & _
                     " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.noregistrasifk = pd.norec " & _
                     " INNER JOIN pelayananpasien_t AS pp ON pp.noregistrasifk = apd.norec " & _
                     " INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
                     " LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id " & _
                     " LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk " & _
                     " LEFT JOIN ruangan_m AS ru ON ru.id = pd.objectruanganlastfk " & _
                     " LEFT JOIN pegawai_m AS pg ON pg.id = pd.objectpegawaifk " & _
                     " INNER JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
                     " WHERE pd.statusenabled = true AND apd.norec = '" & strNorec & "' "
            
            ReadRs strSQL
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
             .txtNamaRs.SetText UCase$(strNamaLengkapRs)
             .txtAlamatRs.SetText stralmtLengkapRs
             If rs.EOF = False Then
                .txtNmrRM.SetText IIf(IsNull(rs("nocm")), "", rs("nocm"))
                .txtNamaPasien.SetText IIf(IsNull(rs("namapasien")), "", rs("namapasien"))
                .txtTglKunjungan.SetText IIf(IsNull(rs("tglregistrasi")), "", rs("tglregistrasi"))
                .txttgllahir.SetText IIf(IsNull(rs("tgllahir")), "", rs("tgllahir"))
                .txtAlamat.SetText IIf(IsNull(rs("alamatlengkap")), "", rs("alamatlengkap"))
                .txtKelPasien.SetText IIf(IsNull(rs("kelompokpasien")), "", rs("kelompokpasien"))
                .txtNamaDokter.SetText IIf(IsNull(rs("namalengkap")), "", rs("namalengkap"))
                .txtOperatorPoli.SetText IIf(IsNull(rs("ruangan")), "", rs("ruangan"))
             End If
             .database.AddADOCommand CN_String, adoReport
             .usNorec.SetUnboundFieldSource ("{ado.norec}")
             .usProduk.SetUnboundFieldSource ("{ado.namaproduk}")
             .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargajual}")
             .usJml.SetUnboundFieldSource ("{ado.jumlah}")
             .unjml.SetUnboundFieldSource ("{ado.jumlah}")
             .ucTotalHarga.SetUnboundFieldSource ("{ado.total}")
             .ucWjbBayar.SetUnboundFieldSource ("{ado.total}")
            
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "NotaLayanan")
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

    MsgBox Err.Number & " " & Err.Description
End Sub
