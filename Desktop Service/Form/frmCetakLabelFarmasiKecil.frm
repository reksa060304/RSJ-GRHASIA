VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakLabelFarmasiKecil 
   Caption         =   "Transmedic"
   ClientHeight    =   7170
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5775
   Icon            =   "frmCetakLabelFarmasiKecil.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7170
   ScaleWidth      =   5775
   WindowState     =   2  'Maximized
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
      TabIndex        =   3
      Top             =   600
      Width           =   2775
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
      Left            =   3720
      TabIndex        =   2
      Top             =   600
      Width           =   975
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
      Left            =   4680
      TabIndex        =   1
      Top             =   600
      Width           =   1095
   End
   Begin CRVIEWERLibCtl.CRViewer CRViewer1 
      Height          =   7215
      Left            =   0
      TabIndex        =   0
      Top             =   0
      Width           =   5775
      DisplayGroupTree=   -1  'True
      DisplayToolbar  =   -1  'True
      EnableGroupTree =   -1  'True
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
      EnableSelectExpertButton=   0   'False
      EnableToolbar   =   -1  'True
      DisplayBorder   =   -1  'True
      DisplayTabs     =   -1  'True
      DisplayBackgroundEdge=   -1  'True
      SelectionFormula=   ""
      EnablePopupMenu =   -1  'True
      EnableExportButton=   0   'False
      EnableSearchExpertButton=   0   'False
      EnableHelpButton=   0   'False
   End
End
Attribute VB_Name = "frmCetakLabelFarmasiKecil"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
'Dim Report As New Cr_cetakLabelFarmasi
'Dim Report As New Cr_cetakLabelFarmasiNew
'Dim bolSuppresDetailSection10 As Boolean
'Dim Report As New Cr_cetakLabelObatBaru
Dim Report As New Cr_cetakLabelKecil
'Dim ii As Integer
'Dim tempPrint1 As String
'Dim p As Printer
'Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim strView As String

Private Sub cmdCetak_Click()
    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
    Report.PrinterSetup Me.hwnd
    CRViewer1.Refresh
End Sub


Private Sub Form_Activate()
    If strView = "false" Then
        Unload Me
    End If
End Sub

Private Sub Form_Load()
    Dim p As Printer
    cboPrinter.Clear
    For Each p In Printers
        cboPrinter.AddItem p.DeviceName
    Next
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "LabelFarmasi")
    
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakLabelFarmasiKecil = Nothing
End Sub

Public Sub CetakLabelFarmasi(Norec As String, view As String)
On Error GoTo errLoad
On Error Resume Next
strView = view
Dim adocmd As New ADODB.Command
Dim str1, str2 As String
Dim Apoteker As String
Set frmCetakLabelFarmasiKecil = Nothing

If Norec <> "" Then
    str1 = "sr.norec='" & Norec & "'"
    ReadRs2 "select pg.namalengkap from logginguser_t as lg " & _
            "INNER JOIN loginuser_s as lu on lu.id = lg.objectloginuserfk " & _
            "INNER JOIN pegawai_m as pg on pg.id = lu.objectpegawaifk " & _
            "where lg.noreff = '" & Norec & "'"
End If

If RS2.EOF = False Then
   Apoteker = "Apoteker : " & RS2!namalengkap
Else
   Apoteker = "Apoteker : -"
End If
    
'    If norecDetail <> "" Then
'        str2 = " and sr.norec='" & norec & "'"
'    End If
    
Set Report = New Cr_cetakLabelKecil
    strSQL = " SELECT distinct ps.nocm, ps.namapasien,to_char(ps.tgllahir, 'DD-MM-YYYY') as tgllahir,sr.noresep AS noresep, " & _
             " to_char(sr.tglresep, 'DD-MM-YYYY') as tglresep,pr.namaproduk || ' (' || CAST(pp.jumlah as varchar) || ')' AS namaproduk,CASE WHEN pp.aturanpakai IS NULL THEN '1X1' WHEN pp.aturanpakai = '' THEN '1X1' ELSE pp.aturanpakai END AS aturanpakai,pp.rke, " & _
             " CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah, " & _
             " CASE WHEN pp.issiang = 't' THEN 'Siang' ELSE '-' END AS siang, CASE WHEN pp.ispagi = 't' THEN 'Pagi' ELSE '-' END AS pagi, " & _
             " CASE WHEN pp.ismalam = 't' THEN 'Malam' ELSE '-' END as malam, CASE WHEN pp.issore = 't' THEN 'Sore' ELSE '-' END as sore, " & _
             " CASE WHEN pp.keteranganpakai  = '' OR pp.keteranganpakai IS NULL THEN 'Semoga Lekas Sembuh' else pp.keteranganpakai END AS keteranganpakai,CASE WHEN sn.satuanresep IS NOT NULL THEN sn.satuanresep ELSE '' END AS satuanresep " & _
             " from pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
             " inner join produk_m as pr on pr.id = pp.produkfk " & _
             " inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
             " inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
             " inner join pasien_m as ps on ps.id = pd.nocmfk " & _
             " left join alamat_m as alm on alm.nocmfk = ps.id " & _
             " INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
             " LEFT JOIN antrianapotik_t as aa on aa.noresep = sr.noresep " & _
             " LEFT JOIN satuanresep_m AS sn ON sn.id = pp.satuanresepfk " & _
             " where pp.jeniskemasanfk = 2 and " & _
             str1 & _
             ""
    strSQL = strSQL & " union all select distinct ps.nocm,ps.namapasien,to_char(ps.tgllahir, 'DD-MM-YYYY') as tgllahir,sr.noresep AS noresep,to_char(sr.tglresep, 'DD-MM-YYYY') as tglresep, " & _
             " ' Racikan' || ' (' || CAST(((CAST(pp.qtydetailresep as float)/CAST(pp.dosis as float))*CAST(pro.kekuatan as float))as varchar) || ')' AS namaproduk,CASE WHEN pp.aturanpakai IS NULL THEN '1X1' WHEN pp.aturanpakai = '' THEN '1X1' ELSE pp.aturanpakai END AS aturanpakai,pp.rke, " & _
             " case when alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar, " & _
             " ((CAST(pp.qtydetailresep as float)/CAST(pp.dosis as float))*CAST(pro.kekuatan as float)) as jumlah, " & _
             " CASE WHEN pp.issiang = 't' THEN 'Siang' ELSE '-' END AS siang, CASE WHEN pp.ispagi = 't' THEN 'Pagi' ELSE '-' END AS pagi, " & _
             " CASE WHEN pp.ismalam = 't' THEN 'Malam' ELSE '-' END as malam, CASE WHEN pp.issore = 't' THEN 'Sore' ELSE '-' END as sore, " & _
             " CASE WHEN pp.keteranganpakai  = '' OR pp.keteranganpakai IS NULL THEN 'Semoga Lekas Sembuh' else pp.keteranganpakai END AS keteranganpakai,CASE WHEN sn.satuanresep IS NOT NULL THEN sn.satuanresep ELSE '' END AS satuanresep " & _
             " from strukresep_t as sr  " & _
             " inner join pelayananpasien_t as pp on sr.norec= pp.strukresepfk " & _
             " inner join antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
             " inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
             " inner join pasien_m as ps on ps.id = pd.nocmfk " & _
             " left join alamat_m as alm on alm.nocmfk = ps.id " & _
             " INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
             " INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
             " INNER JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk " & _
             " LEFT JOIN antrianapotik_t as aa on aa.noresep = sr.noresep " & _
             " LEFT JOIN satuanresep_m AS sn ON sn.id = pp.satuanresepfk " & _
             " where pp.jeniskemasanfk =1 and " & _
             str1 & _
             ""
    ReadRs3 strSQL
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    
    Dim aturan() As String
    aturan = Split(LCase(RS3!aturanpakai), "x")
        
    With Report
        .database.AddADOCommand CN_String, adocmd
        If RS3.EOF = False Then
            .txtRS.SetText strNamaRS
            .txtAlamat.SetText strAlamatRS
            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .udtTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usNamaProduk.SetUnboundFieldSource ("{ado.namaproduk}")
            .usCaraPakai.SetUnboundFieldSource ("{ado.aturanpakai}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usTelp.SetUnboundFieldSource ("{ado.notelepon}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamat}")
'            .unjml.SetUnboundFieldSource ("{ado.jumlah}")
            .usaturan.SetUnboundFieldSource ("{ado.aturanpakai}")
            .usss.SetUnboundFieldSource ("{ado.satuanresep}")
            .usWaktuMinumS.SetUnboundFieldSource ("{ado.siang}")
            .usWaktuMinumM.SetUnboundFieldSource ("{ado.malam}")
            .usWaktuMinumP.SetUnboundFieldSource ("{ado.pagi}")
            .usWaktuMinumSr.SetUnboundFieldSource ("{ado.sore}")
'            .txtKeterangan.SetText RS3!keteranganpakai
            .usKeteranganPakai.SetUnboundFieldSource ("{ado.keteranganpakai}")
'            .txtApoteker.SetText Apoteker
            .txtAturanPakai.SetText aturan(0) & " x Sehari " & aturan(1) & " " & RS3!satuanstandar
'            If view = "false" Then
             
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LabelFarmasi")
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
            
            
            
        End If
'            Else
'                With CRViewer1
'                    .ReportSource = Report
'                    .ViewReport
'                    .Zoom 1
'                End With
'                Me.Show
'            End If
        'End If
    End With
Exit Sub
errLoad:
End Sub
Public Sub CetakLabelKecilCeklis(Norec As String, ProdukFk As String, view As String, User As String)
On Error GoTo errLoad
On Error Resume Next
    Dim str1, str2 As String
    
    If Norec <> "" Then
        str1 = "sr.norec='" & Norec & "'"
    End If
    If ProdukFk <> "" Then
        str2 = " and pp.produkfk in (" & Right(ProdukFk, Len(ProdukFk) - 1) & ")"
    End If
Set frmCetakLabelFarmasi = Nothing
Dim adocmd As New ADODB.Command
    
Set Report = New Cr_cetakLabelKecil
    strSQL = " select distinct ps.nocm, ps.namapasien,to_char(ps.tgllahir, 'DD-MM-YYYY') as tgllahir,sr.noresep,sr.tglresep,pr.namaproduk || ' (' || CAST(pp.jumlah as varchar) || ')' AS namaproduk,CASE WHEN pp.aturanpakai IS NULL THEN '1X1' WHEN pp.aturanpakai = '' THEN '1X1' ELSE pp.aturanpakai END AS aturanpakai,pp.rke, " & _
             " case when pp.keteranganpakai is null then '' else pp.keteranganpakai end as keteranganpakai, case when alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,ss.satuanstandar,pp.jumlah, " & _
             " CASE WHEN pp.issiang = 't' THEN 'Siang' ELSE '-' END AS siang, CASE WHEN pp.ispagi = 't' THEN 'Pagi' ELSE '-' END AS pagi, " & _
             " CASE WHEN pp.ismalam = 't' THEN 'Malam' ELSE '-' END as malam, CASE WHEN pp.issore = 't' THEN 'Sore' ELSE '-' END as sore, " & _
             " CASE WHEN pp.keteranganpakai  = '' OR pp.keteranganpakai IS NULL THEN 'Semoga Lekas Sembuh' else pp.keteranganpakai END AS keteranganpakai,CASE WHEN sn.satuanresep IS NOT NULL THEN sn.satuanresep ELSE '' END AS satuanresep " & _
             " from pelayananpasien_t as pp inner join strukresep_t as sr on sr.norec= pp.strukresepfk " & _
             " inner join produk_m as pr on pr.id = pp.produkfk " & _
             " inner join antrianpasiendiperiksa_t as apd on apd.norec = pp.noregistrasifk " & _
             " inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
             " inner join pasien_m as ps on ps.id = pd.nocmfk " & _
             " left join alamat_m as alm on alm.nocmfk = ps.id " & _
             " INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
             " LEFT JOIN satuanresep_m AS sn ON sn.id = pp.satuanresepfk " & _
             " where pp.jeniskemasanfk =2 and " & _
            str1 & _
            str2 & _
            ""
    strSQL = strSQL & " union all select distinct ps.nocm,ps.namapasien,to_char(ps.tgllahir, 'DD-MM-YYYY') as tgllahir,sr.noresep,sr.tglresep,pro.namaproduk || ' (' || CAST(pp.jumlah as varchar) || ')' AS namaproduk,CASE WHEN pp.aturanpakai IS NULL THEN '1X1' WHEN pp.aturanpakai = '' THEN '1X1' ELSE pp.aturanpakai END AS aturanpakai,pp.rke, " & _
            " case when pp.keteranganpakai is null then '' else pp.keteranganpakai end as keteranganpakai,CASE WHEN alm.alamatlengkap is null then '-' else alm.alamatlengkap end as alamat,ps.notelepon,CASE when jr.jenisracikan IS NULL THEN '' ELSE jr.jenisracikan END AS satuanstandar,((CAST(pp.qtydetailresep as float)/CAST(pp.dosis as float))*CAST(pro.kekuatan as float)) as jumlah, " & _
            " CASE WHEN pp.issiang = 't' THEN 'Siang' ELSE '-' END AS siang, CASE WHEN pp.ispagi = 't' THEN 'Pagi' ELSE '-' END AS pagi, " & _
            " CASE WHEN pp.ismalam = 't' THEN 'Malam' ELSE '-' END as malam, CASE WHEN issore = 't' THEN 'Sore' ELSE '-' END as sore, " & _
            " CASE WHEN pp.keteranganpakai  = '' OR pp.keteranganpakai IS NULL THEN 'Semoga Lekas Sembuh' else pp.keteranganpakai END AS keteranganpakai,CASE WHEN sn.satuanresep IS NOT NULL THEN sn.satuanresep ELSE '' END AS satuanresep " & _
            " from strukresep_t as sr  " & _
            " inner join pelayananpasien_t as pp on sr.norec= pp.strukresepfk " & _
            " inner join antrianpasiendiperiksa_t as apd on apd.norec = sr.pasienfk " & _
            " inner join pasiendaftar_t as pd on pd.norec=apd.noregistrasifk " & _
            " inner join pasien_m as ps on ps.id = pd.nocmfk " & _
            " left join alamat_m as alm on alm.nocmfk = ps.id " & _
            " INNER JOIN produk_m as pro on pro.id = pp.produkfk " & _
            " INNER JOIN satuanstandar_m as ss on ss.id = pp.satuanviewfk " & _
            " left JOIN jenisracikan_m as jr on jr.id = pp.jenisobatfk " & _
            " LEFT JOIN satuanresep_m AS sn ON sn.id = pp.satuanresepfk " & _
            " where pp.jeniskemasanfk =1 and " & _
            str1 & _
            str2 & _
            ""
    
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
        
    With Report
        .database.AddADOCommand CN_String, adocmd
            .txtRS.SetText strNamaRS
            .txtAlamat.SetText strAlamatRS
            .udtTglResep.SetUnboundFieldSource ("{ado.tglresep}")
            .usNoResep.SetUnboundFieldSource ("{ado.noresep}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .udtTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usNamaProduk.SetUnboundFieldSource ("{ado.namaproduk}")
            .usCaraPakai.SetUnboundFieldSource ("{ado.aturanpakai}")
            .usNoCm.SetUnboundFieldSource ("{ado.nocm}")
            .usTelp.SetUnboundFieldSource ("{ado.notelepon}")
            .usAlamat.SetUnboundFieldSource ("{ado.alamat}")
            .usss.SetUnboundFieldSource ("{ado.keteranganpakai}")
'            .unjml.SetUnboundFieldSource ("{ado.jumlah}")
            .usWaktuMinumS.SetUnboundFieldSource ("{ado.siang}")
            .usWaktuMinumM.SetUnboundFieldSource ("{ado.malam}")
            .usWaktuMinumP.SetUnboundFieldSource ("{ado.pagi}")
            .usWaktuMinumSr.SetUnboundFieldSource ("{ado.sore}")
'            .usKeteranganPakai.SetUnboundFieldSource ("{ado.keteranganpakai}")
            
            If view = "false" Then
                Dim strPrinter As String
'
                strPrinter = GetTxt("Setting.ini", "Printer", "LabelFarmasi")
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

