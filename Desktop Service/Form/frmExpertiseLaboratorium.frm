VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmExpertiseLaboratorium 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmExpertiseLaboratorium.frx":0000
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
Attribute VB_Name = "frmExpertiseLaboratorium"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crHasillabHaji
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim bolStrukResep As Boolean
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String
Dim adoReport As New ADODB.Command


'setting printer
'Dim prn As Printer
'Dim sizepaper As CRPaperSize
'Dim duplexpaper As CRPrinterDuplexType
'Dim sPrinter As String, sDriver As String, sUkuranKertas As String
'Dim sDuplex As String, sOrientasKertas As String
'Dim tmpOrien As String

Private Sub cmdCetak_Click()
 Report.PrintOut False
'    crHasillabHaji.PrinterSetup Me.hwnd
    crHasillabHaji.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    PrinterNama = cboPrinter.Text
    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
 crHasillabHaji.PrinterSetup Me.hwnd
End Sub

Private Sub cmdTutup_Click()
Unload Me
End Sub
Private Sub Addcbo(cbo As ComboBox, Name As String, Index As Integer)
    cbo.AddItem Name                        ' Add the name of the item to the combo box
    cbo.ItemData(cbo.NewIndex) = Index      ' Set the .itemdata(.listindex) for later retrieval
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
    Set frmExpertiseLaboratorium = Nothing
End Sub

Public Sub Cetak(strNorec As String, jenisKelamin As String, umur As String, User As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmExpertiseLaboratorium = Nothing
Dim strSQL As String
Dim StrFilter As String
Dim noorder As String
Dim stringExp As String
Dim Expertise As String
Dim strUmur As Integer
If umur <> "" Then
    strUmur = umur
End If
'If strNorec <> "" Then
''    noorder = " (" & Left(strNorec, Len(strNorec) - 1) & ")"
'    noorder = strNorec
'End If

    With Report
                    
'        strSQL = "select pd.noregistrasi,pd.tglregistrasi,ps.nocm,ps.namapasien,ps.tempatlahir,ps.tgllahir, " & _
'                     "   jk.jeniskelamin,alm.alamatlengkap,so.noorder as nolab, hitungUmurNew(ps.tgllahir,now) as umur,  " & _
'                     " kp.kelompokpasien pg.namalengkap as pengorder ,jk.id as KdJk " & _
'                     "    from pasiendaftar_t as pd  " & _
'                     "   join pasien_m as ps on ps.id = pd.nocmfk  " & _
'                     "   left join jeniskelamin_m as jk on jk.id =ps.objectjeniskelaminfk  " & _
'                     "   left join alamat_m as alm on alm.nocmfk=ps.id  " & _
'                     "   LEFT JOIN strukorder_t as so on pd.norec=so.noregistrasifk  " & _
'                     "   left join pegawai_m as pg on so.objectpegawaiorderfk =pg.id  " & _
'                     "   left join kelompokpasien_m as kp on pd.objectkelompokpasienlastfk=kp.id  " & _
'                     "   where so.noregistrasifk='" & strNorec & "'"
            strSQL = " SELECT pm.nocm,pd.noregistrasi,so.noorder,pm.namapasien,alm.alamatlengkap,kp.kelompokpasien,rkn.namarekanan,pd.tglregistrasi,to_char(pd.tglregistrasi, 'DD-MM-YYYY') AS tglRegiss, " & _
                     " pg.namalengkap,pm.tgllahir,to_char(pm.tgllahir, 'DD-MM-YYYY') AS tglLahirs,pp.noregistrasifk AS norec_apd,djp.detailjenisproduk,pp.produkfk,prd.namaproduk, " & _
                     " maps.detailpemeriksaan,CASE WHEN maps.memohasil IS NULL THEN '' ELSE maps.memohasil END AS memohasil,maps.nourutdetail,maps.satuanstandarfk,ss.satuanstandar,nn.nilaitext,nn.nilaimin,nn.nilaimax,CASE WHEN hh.hasil IS NULL THEN '' ELSE hh.hasil END AS hasil,maps.id AS map_id, " & _
                     " hh.norec AS norec_hasil,jk.jeniskelamin,to_char(apd.tglmasuk, 'DD-MM-YYYY') AS tglverif FROM pelayananpasien_t  as pp " & _
                     " INNER JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
                     " INNER JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
                     " LEFT JOIN strukorder_t AS so ON so.norec = apd.objectstrukorderfk " & _
                     " INNER JOIN pasien_m AS pm ON pm.id = pd.nocmfk " & _
                     " LEFT JOIN jeniskelamin_m AS jk ON jk.id = pm.objectjeniskelaminfk " & _
                     " LEFT JOIN alamat_m AS alm ON alm.nocmfk = pm.id " & _
                     " LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk " & _
                     " LEFT JOIN rekanan_m AS rkn ON rkn.id = pd.objectrekananfk LEFT JOIN pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk " & _
                     " INNER JOIN produk_m as prd on prd.id = pp.produkfk " & _
                     " INNER JOIN detailjenisproduk_m as djp on djp.id = prd.objectdetailjenisprodukfk " & _
                     " INNER JOIN maphasillab_m  as maps on maps.produkfk = prd.id " & _
                     " INNER JOIN maphasillabdetail_m  as maps2 on maps2.maphasilfk = maps.id " & _
                     " and maps2.jeniskelaminfk ='" & jenisKelamin & "' " & _
                     " and maps2.kelompokumurfk in (select id from kelompokumur_m kuu where " & strUmur & " BETWEEN kuu.umurmin and kuu.umurmax) " & _
                     " INNER JOIN nilainormal_m  as nn on nn.id = maps2.nilainormalfk " & _
                     " LEFT JOIN satuanstandar_m  as ss on ss.id = maps.satuanstandarfk " & _
                     " LEFT JOIN hasillaboratorium_t  as hh on hh.produkfk = prd.id " & _
                     " and pp.noregistrasifk=hh.noregistrasifk " & _
                     " and maps.detailpemeriksaan = hh.detailpemeriksaan " & _
                     " where pp.noregistrasifk = '" & strNorec & "' " & _
                     " order by  prd.namaproduk asc"
            
            ReadRs strSQL
            Dim Umurs As String
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            If rs.EOF = False Then
                Umurs = hitungUmurNew(rs("tgllahir").Value, rs("tglregistrasi").Value)
               'header
                .Text2.SetText stralmtLengkapRs & " , " & strNamaKota & ","
                .Text1.SetText strNamaLengkapRs
                .Text3.SetText strWebSite & ", " & strEmail
                .txtNoCM.SetText IIf(IsNull(rs("nocm")), "", rs("nocm"))
                .txtNoregis.SetText IIf(IsNull(rs("noregistrasi")), "", rs("noregistrasi"))
                .txtNamaPasien.SetText IIf(IsNull(rs("namapasien")), "", rs("namapasien"))
                .txtAlamat.SetText IIf(IsNull(rs("alamatlengkap")), "", rs("alamatlengkap"))
                .txtJenisKelamin.SetText IIf(IsNull(rs("jeniskelamin")), "", rs("jeniskelamin"))
                .txtNoOrder.SetText IIf(IsNull(rs("noorder")), "", rs("noorder"))
                .txtUmur.SetText Umurs
                .txtTglRegis.SetText IIf(IsNull(rs("tglRegiss")), "", rs("tglRegiss"))
                .txtLahir.SetText IIf(IsNull(rs("tglLahirs")), "", rs("tglLahirs"))
                .txtDokterOrder.SetText IIf(IsNull(rs("namalengkap")), "", rs("namalengkap"))
                .txtNamaPenjamin.SetText IIf(IsNull(rs("kelompokpasien")), "", rs("kelompokpasien"))
                .txtRekanan.SetText IIf(IsNull(rs("namarekanan")), "", IIf(IsNull(rs("kelompokpasien")), "", rs("kelompokpasien")))
               'header
             
                .udTglHasil.SetUnboundFieldSource ("{ado.tglverif}")
                .usKeteranganHasil.SetUnboundFieldSource ("{ado.memohasil}")
                .Hasil.SetUnboundFieldSource ("{ado.hasil}")
                .NilaiNormal.SetUnboundFieldSource ("{ado.nilaitext}")
                .NamaPemeriksaan.SetUnboundFieldSource ("{ado.namaproduk}")
                .SatuanHasil.SetUnboundFieldSource ("{ado.satuanstandar}")
                .jenisspesimen.SetUnboundFieldSource ("{ado.detailjenisproduk}")
                .usDetailPemeriksaan.SetUnboundFieldSource ("{ado.detailpemeriksaan}")
                    
        If view = "false" Then
            strPrinter1 = GetTxt("Setting.ini", "Printer", "ExpertiseRadiologi")
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
            End If
        
    End With
Exit Sub
errLoad:
End Sub


'Public Property Get OrienKertas() As String
'    OrienKertas = tmpOrien
'End Property
'
'Public Property Let OrienKertas(ByVal vNewValue As String)
'    tmpOrien = vNewValue
'End Property
'setting printer


