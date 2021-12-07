VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCRCetakRekapRincianBiaya 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmCRCetakRekapRincianBiaya.frx":0000
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
Attribute VB_Name = "frmCRCetakRekapRincianBiaya"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crRekapRincianBiaya
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

    Set frmCRCetakRekapRincianBiaya = Nothing
End Sub

Public Sub Cetak(strNoregistrasi As String, strNoStruk As String, strNoKwitansi As String, strIdPegawai As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmCRCetakRekapRincianBiaya = Nothing
Dim adocmd As New ADODB.Command
Dim StrFilter As String
Dim kamar As String
Dim kelas As String
StrFilter = ""

Set Report = New crRekapRincianBiaya

'    SQLSERVER
'    strSQL = " SELECT '-' AS norec_pp,* FROM (SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
'             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
'             " x.namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah,SUM (x.total) AS total, " & _
'             " '-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
'             " x.namauser,'RAWAT INAP' AS grouping " & _
'             " FROM (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
'             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
'             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
'             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
'             " tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
'             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
'             " FROM temp_billing_t AS tb " & _
'             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
'             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
'             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
'             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
'             " AND tb.jenisprodukmaster IS NULL AND dp.id IN (16, 25) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
'             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
'             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
'             " tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
'             " tb.total_kelasasal,dp.namadepartemen) AS x " & _
'             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
'             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
'             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
'             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namaproduk"

'    strSQL = strSQL & " UNION ALL SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
'             " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
'             " x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
'             " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
'             " x.totalppenjamin,x.totalbiayatambahan,'RAWAT JALAN' AS grouping " & _
'             " FROM (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
'             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
'             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
'             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
'             " tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
'             " tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
'             " FROM temp_billing_t AS tb " & _
'             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
'             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
'             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
'             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
'             " AND tb.jenisprodukmaster IS NULL AND dp.id NOT IN (16, 25) Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
'             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
'             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
'             " tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
'             " tb.total_kelasasal,dp.namadepartemen) AS x " & _
'             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm, " & _
'             " x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
'             " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar, " & _
'             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan"

'    strSQL = strSQL & " UNION ALL SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
'             " 'Instalasi Farmasi' AS namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd, " & _
'             " 'Pemakaian Obat & Alkes' AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk, " & _
'             " 0 AS jumlah,SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar, " & _
'             " x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,'FARMASI' AS grouping " & _
'             " FROM (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
'             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
'             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
'             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
'             " tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
'             " tb.total_kelasasal,'Instalasi Farmasi' AS namadepartemen,USER AS namauser " & _
'             " FROM temp_billing_t AS tb " & _
'             " WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tb.tglpelayanan IS NOT NULL " & _
'             " AND tb.namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
'             " AND tb.jenisprodukmaster = 'Jenis Barang Farmasi' Group By tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
'             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual, " & _
'             " tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin, " & _
'             " tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal, " & _
'             " tb.total_kelasasal) AS x " & _
'             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
'             " x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.tipepasien, " & _
'             " x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
'             " x.namakelaspd) AS t"

'    SQLSERVER
     strSQL = " SELECT '-' AS norec_pp ,* FROM ( SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
              " x.namadepartemen,x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd,x.namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah,SUM (x.total) AS total, " & _
              " '-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,'RAWAT INAP' AS GROUPING " & _
              " FROM  (SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk, " & _
              " tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan,tb.tglpelayanan,tb.ruangantindakan, " & _
              " tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual,tb.diskon,tb.total,tb.namakamar,tb.tipepasien, " & _
              " tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin,tb.totalbiayatambahan,tb.namakelaspd, " & _
              " tb.nama_kelasasal,tb.hargajual_kelasasal,tb.total_kelasasal,dp.namadepartemen,USER AS namauser " & _
              " FROM temp_billing_t AS tb " & _
              " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
              " LEFT JOIN departemen_m AS dp ON dp. ID = ru.objectdepartemenfk " & _
              " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
              " AND dp. ID IN (16, 25) " & _
              " GROUP BY tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk, " & _
              " tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan,tb.tglpelayanan,tb.ruangantindakan, " & _
              " tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual,tb.diskon,tb.total,tb.namakamar,tb.tipepasien, " & _
              " tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin,tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal, " & _
              " tb.hargajual_kelasasal,tb.total_kelasasal,dp.namadepartemen) AS x " & _
              " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
              " x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
              " x.namauser,x.namaproduk "
    strSQL = strSQL & " UNION ALL SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj,x.tglregistrasi, " & _
             " x.tglpulang,x.namarekanan,x.namakelaspd,x.namadepartemen AS namaproduk,'-' AS penulisresep,'-' AS jenisproduk,SUM (x.jumlah) AS jumlah, " & _
             " SUM (x.total) AS total,'-' AS namakamar,x.tipepasien,x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan, " & _
             " x.namauser,'RAWAT JALAN' AS GROUPING " & _
             " FROM ( SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk,tb.namakelas, " & _
             " tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan,tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep, " & _
             " tb.jenisproduk,tb.jumlah,tb.hargajual,tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan, " & _
             " tb.totalppenjamin,tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal,tb.total_kelasasal, " & _
             " dp.namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " LEFT JOIN ruangan_m AS ru ON ru.namaruangan = tb.ruangantindakan " & _
             " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
             " WHERE noregistrasi = '" & strNoregistrasi & "' AND tglpelayanan IS NOT NULL " & _
             " AND namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND dp. ID NOT IN (16, 25) " & _
             " GROUP BY tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk, " & _
             " tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan,tb.tglpelayanan,tb.ruangantindakan, " & _
             " tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual,tb.diskon,tb.total,tb.namakamar,tb.tipepasien, " & _
             " tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin,tb.totalbiayatambahan,tb.namakelaspd, " & _
             " tb.nama_kelasasal,tb.hargajual_kelasasal,tb.total_kelasasal,dp.namadepartemen) AS x " & _
             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,x.namadepartemen,x.dokterpj, " & _
             " x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             " x.totalppenjamin,x.totalbiayatambahan,x.namauser "
             
    strSQL = strSQL & " UNION ALL SELECT x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit,'Instalasi Farmasi' AS namadepartemen, " & _
             " x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.namakelaspd,'Pemakaian Obat & Alkes' AS namaproduk, " & _
             " '-' AS penulisresep,'-' AS jenisproduk,0 AS jumlah,SUM (x.total) AS total,'-' AS namakamar,x.tipepasien, " & _
             " x.totalharusdibayar,x.totalprekanan,x.totalppenjamin,x.totalbiayatambahan,x.namauser,'FARMASI' AS GROUPING " & _
             " FROM ( SELECT tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit,tb.objectdepartemenfk, " & _
             " tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan,tb.tglpelayanan,tb.ruangantindakan, " & _
             " tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah,tb.hargajual,tb.diskon,tb.total,tb.namakamar, " & _
             " tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan,tb.totalppenjamin,tb.totalbiayatambahan, " & _
             " tb.namakelaspd,tb.nama_kelasasal,tb.hargajual_kelasasal,tb.total_kelasasal, " & _
             " 'Instalasi Farmasi' AS namadepartemen,USER AS namauser " & _
             " FROM temp_billing_t AS tb " & _
             " WHERE tb.noregistrasi = '" & strNoregistrasi & "' AND tb.tglpelayanan IS NOT NULL " & _
             " AND tb.namaproduk NOT IN ('Biaya Administrasi','Biaya Materai') " & _
             " AND tb.jenisprodukmaster = 'Jenis Barang Farmasi' " & _
             " GROUP BY tb.tglstruk,tb.nobilling,tb.nokwitansi,tb.noregistrasi,tb.nocm,tb.namapasienjk,tb.unit, " & _
             " tb.objectdepartemenfk,tb.namakelas,tb.dokterpj,tb.tglregistrasi,tb.tglpulang,tb.namarekanan, " & _
             " tb.tglpelayanan,tb.ruangantindakan,tb.namaproduk,tb.penulisresep,tb.jenisproduk,tb.jumlah, " & _
             " tb.hargajual,tb.diskon,tb.total,tb.namakamar,tb.tipepasien,tb.totalharusdibayar,tb.totalprekanan, " & _
             " tb.totalppenjamin,tb.totalbiayatambahan,tb.namakelaspd,tb.nama_kelasasal, " & _
             " tb.hargajual_kelasasal,tb.total_kelasasal) AS x " & _
             " GROUP BY x.tglstruk,x.nobilling,x.nokwitansi,x.noregistrasi,x.nocm,x.namapasienjk,x.unit, " & _
             " x.dokterpj,x.tglregistrasi,x.tglpulang,x.namarekanan,x.tipepasien,x.totalharusdibayar,x.totalprekanan, " & _
             " x.totalppenjamin,x.totalbiayatambahan,x.namauser,x.namakelaspd ) AS T "

    'strSQL = "select nobilling,nocm,noregistrasi,nocm,namapasienjk,unit,objectdepartemenfk,namakelas,dokterpj,tglregistrasi, " & _
    '         "tglpulang,namarekanan,tglpelayanan,ruangantindakan,namaproduk,penulisresep,jenisproduk,dokter,jumlah, " & _
    '         "hargajual,diskon,total,namakamar,tipepasien,totalharusdibayar,totalprekanan,totalppenjamin,totalbiayatambahan,user, " & _
    '         "namakelaspd,hargajual_kelasasal,total_kelasasal,norec,norec_pp,tglstruk,(total-diskon) as totalsetelahdiskon " & _
    '         "from temp_billing_t where noregistrasi='" & strNoregistrasi & "' " & _
    '         "and tglpelayanan is not null and namaproduk not in ('Biaya Administrasi','Biaya Materai') order by tglpelayanan, namaproduk"
        
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
      
      'ReadRs3 "select ppd.hargadiscount,ppd.hargajual,ppd.komponenhargafk from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611  "
            
    ReadRs3 "select sum(ppd.hargadiscount) as hargadiscount,ppd.komponenhargafk from pasiendaftar_t pd " & _
            "INNER JOIN antrianpasiendiperiksa_t apd on apd.noregistrasifk=pd.norec " & _
            "INNER JOIN pelayananpasien_t pp on pp.noregistrasifk=apd.norec " & _
            "INNER JOIN pelayananpasiendetail_t ppd on ppd.pelayananpasien=pp.norec " & _
            "where pd.noregistrasi='" & strNoregistrasi & "' and pp.produkfk<>402611 group by ppd.komponenhargafk "
    
    ReadRs4 "select namakamar,namakelaspd from temp_billing_t where noregistrasi = '" & strNoregistrasi & "' limit 1"
    If RS4.EOF = False Then
        kamar = RS4!namakamar
        kelas = RS4!namakelaspd
    Else
        kamar = "-"
        kelas = "-"
    End If
                
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
            .txtNamaKota.SetText strNamaKota & ", "
            .usNoregistrasi.SetUnboundFieldSource ("{ado.noregistrasi}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasienjk}")
            .usRuangan.SetUnboundFieldSource ("{ado.unit}")
'            .usKamar.SetUnboundFieldSource IIf(IsNull("{ado.namakamar}") = True, "-", ("{ado.namakamar}"))
            .usKelasH.SetUnboundFieldSource ("{ado.namakelaspd}")
            .usDokterPJawab.SetUnboundFieldSource ("{ado.dokterpj}")
            .udTglMasuk.SetUnboundFieldSource ("{ado.tglregistrasi}")
            .udTglPlng.SetUnboundFieldSource IIf(IsNull("{ado.tglpulang}") = True, "-", ("{ado.tglpulang}"))
            .usPenjamin.SetUnboundFieldSource IIf(IsNull("{ado.namarekanan}") = True, ("-"), ("{ado.namarekanan}"))
            .usTipe.SetUnboundFieldSource ("{ado.tipepasien}")
'            .usNomor.SetUnboundFieldSource ("{ado.nomor}")
            .usNorecpp.SetUnboundFieldSource ("{ado.norec_pp}")
            .usPenulisResep.SetUnboundFieldSource ("{ado.penulisresep}")
            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
'            .usKelas.SetUnboundFieldSource ("{ado.namakelaspd}")
            .unQty.SetUnboundFieldSource ("{ado.jumlah}")
            .usJmlQty.SetUnboundFieldSource ("{ado.jumlah}")
            .ucTotal.SetUnboundFieldSource ("{ado.total}")
            .usRuanganTindakan.SetUnboundFieldSource ("{ado.grouping}")
            .usNoStruk.SetUnboundFieldSource ("{ado.nobilling}")
            .txtKamar.SetText kamar
            .txtKls.SetText kelas
            .Text30.SetText UCase(strIdPegawai)
'            .usJenisProduk.SetUnboundFieldSource ("{ado.jenisproduk}")
'            .udTanggal.SetUnboundFieldSource ("{ado.tglpelayanan}")
'            .usTglPelayanan.SetUnboundFieldSource ("{ado.tglpelayanan}"
'            .usDokter.SetUnboundFieldSource ("{ado.dokter}")
'            .ucTarif.SetUnboundFieldSource ("{ado.hargajual}")
'            .ucDiskon.SetUnboundFieldSource ("{ado.diskon}")
'            .ucDepartemen.SetUnboundFieldSource ("{ado.objectdepartemenfk}")
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
'            .usUser.SetUnboundFieldSource ("{ado.namauser}")
            
            .txtVersi.SetText App.Comments
            
            
            
'            ReadRs2 "SELECT namalengkap FROM pegawai_m where id='" & strIdPegawai & "' "
'            If RS2.BOF Then
'                .txtUser.SetText "-"
'            Else
'                .txtUser.SetText UCase(IIf(isnull(RS2("namalengkap")), "-", RS2("namalengkap")))
'            End If
            .txtUser.SetText UCase(strIdPegawai)
            
        ReadRs2 "select 'Piutang' as jenis, sp.nostruk ,rk.namarekanan,sp.tglstruk,sppd.totalppenjamin " & _
                               "from pasiendaftar_t as pd " & _
                               "INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is NULL " & _
                               "INNER JOIN strukpelayananpenjamindetail_t as sppd on sppd.nostrukfk=sp.norec " & _
                               "INNER JOIN rekanan_m as rk on rk.id=sppd.kdrekananpenjamin " & _
                               "where pd.noregistrasi='" & strNoregistrasi & "';"
        If RS2.RecordCount <> 0 Then
            Report.Subreport1.Suppress = False
            Dim adojenis As New ADODB.Command
            Set adojenis = New ADODB.Command
            adojenis.CommandText = "select 'Piutang' as jenis, sp.nostruk ,rk.namarekanan,sp.tglstruk,sppd.totalppenjamin " & _
                                   "from pasiendaftar_t as pd " & _
                                   "INNER JOIN strukpelayanan_t as sp on sp.noregistrasifk=pd.norec and sp.statusenabled is NULL " & _
                                   "INNER JOIN strukpelayananpenjamindetail_t as sppd on sppd.nostrukfk=sp.norec " & _
                                   "INNER JOIN rekanan_m as rk on rk.id=sppd.kdrekananpenjamin " & _
                                   "where pd.noregistrasi='" & strNoregistrasi & "';"
    
            adojenis.CommandType = adCmdText
            'Report.Subreport1.OpenSubreport.database.AddADOCommand dbConn, adojenis
            Report.Subreport1.OpenSubreport.database.AddADOCommand CN_String, adojenis
            
    
            With Report
                .Subreport1_usJenis.SetUnboundFieldSource ("{ado.jenis}")
                .Subreport1_usNoStruk.SetUnboundFieldSource ("{ado.nostruk}")
                .Subreport1_usDesk.SetUnboundFieldSource ("{ado.namarekanan}")
                .Subreport1_udTgl.SetUnboundFieldSource ("{ado.tglstruk}")
                .Subreport1_ucJumlah.SetUnboundFieldSource ("{ado.totalppenjamin}")
            End With
        Else
            Report.Subreport1.Suppress = True
        End If
        CRViewer1.ReportSource = Report
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "RincianBiayaRekap")
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
