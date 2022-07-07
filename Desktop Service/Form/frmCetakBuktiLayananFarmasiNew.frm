VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakBuktiLayananFarmasiNew 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   9075
   Icon            =   "frmCetakBuktiLayananFarmasiNew.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7005
   ScaleWidth      =   9075
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
End
Attribute VB_Name = "frmCetakBuktiLayananFarmasiNew"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim ReportResep As New cetakBuktiLayananResep

Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String

Dim bolStrukResep As Boolean


Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String

Dim adoReport As New ADODB.Command

Private Sub cmdCetak_Click()
  If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
    If bolStrukResep = True Then
        ReportResep.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
        PrinterNama = cboPrinter.Text
        ReportResep.PrintOut False
    
    End If
End Sub

Private Sub CmdOption_Click()
    
    If bolStrukResep = True Then
        ReportResep.PrinterSetup Me.hwnd
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
    
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)

    Set frmCetakBuktiLayananFarmasiNew = Nothing

End Sub

Public Sub cetakStrukResep(strNores As String, view As String, strUser As String, counterId As String)
'On Error GoTo errLoad
Set frmCetakBuktiLayananFarmasiNew = Nothing
Dim strSQL As String

bolStrukResep = True
    
    
        With ReportResep
            Set adoReport = New ADODB.Command
            adoReport.ActiveConnection = CN_String
            
            If Left(strNores, 10) = "NonLayanan" Then
                strNores = Replace(strNores, "NonLayanan", "")
                strSQL = " select spd.norec,sp.nostruk as noresep, '-' as noregistrasi,sp.nostruk_intern as nocm,tglfaktur as tglregistrasi, sp.tglstruk as tgl, " & _
                          " sp.namapasien_klien as namapasienjk,pg.namalengkap,'-' as alergi,sp.noteleponfaks,sp.namatempattujuan as alamat, " & _
                          " ru.namaruangan,ru.namaruangan as ruanganpasien,'-' as kamar,'-' as bed, sp.namarekanan as penjamin,'' as Umur,sp.tglfaktur as tgllahir,((spd.hargasatuan-spd.hargadiscount)*spd.qtyproduk)+spd.hargatambahan as totalharga, " & _
                          " ((spd.hargasatuan-spd.hargadiscount)*spd.qtyproduk)+spd.hargatambahan as totalbiaya, " & _
                          " pr.id as kdproduk,'rke-' || spd.resepke || ' ' || pr.namaproduk as namaprodukstandar, spd.qtyproduk as qtyhrg,spd.qtyproduk as jumlah, " & _
                          " CASE when spd.hargadiscount isnull then 0 ELSE  spd.hargadiscount * spd.qtyproduk end as totaldiscound, " & _
                          " spd.resepke as rke,jkm.jeniskemasan,spd.qtyproduk as qtydetailresep,spd.qtydetailresep,'' AS alamatpasien,'' AS noantri, case when pp.hargasatuan =0 then 0 else" & _
                          " (CASE WHEN spd.hargadiscount IS NULL THEN 0 ELSE spd.hargadiscount END/spd.hargasatuan)*100 end AS disc,spd.hargasatuan " & _
                          " from strukpelayanan_t sp " & _
                          " INNER JOIN strukpelayanandetail_t spd on spd.nostrukfk=sp.norec " & _
                          " left JOIN pegawai_m pg on pg.id=sp.objectpegawaipenanggungjawabfk " & _
                          " left JOIN ruangan_m ru on ru.id=sp.objectruanganfk " & _
                          " left JOIN produk_m pr on pr.id=spd.objectprodukfk " & _
                          " left JOIN jeniskemasan_m jkm on jkm.id=spd.objectjeniskemasanfk " & _
                          " where sp.norec = '" & strNores & "'"
            Else
                strSQL = " SELECT pp.norec,pd.noregistrasi,ps.nocm,'=' AS umur,ps.namapasien || ' ( ' || jk.reportdisplay || ' )' AS namapasienjk, " & _
                         " kpp.kelompokpasien || ' ( ' || rek.namarekanan || ' ) ' AS penjamin,ps.nohp AS noteleponfaks, " & _
                         " al.alamatlengkap AS alamat,ps.tgllahir,pd.tglregistrasi,ru.namaruangan AS ruanganpasien, " & _
                         " '-' AS alergi,sr.noresep,ru2.namaruangan,pp.tglpelayanan AS tgl,pp.rke,pr. ID AS kdproduk, " & _
                         " 'rke-' || pp.rke || ' ' || pr.namaproduk AS namaprodukstandar,pp.jumlah, " & _
                         " CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa END AS jasa,pp.hargasatuan, " & _
                         " pp.jumlah AS qtyhrg,(pp.jumlah * (pp.hargasatuan-(case when pp.hargadiscount is null then 0 else pp.hargadiscount end )) )+case when pp.jasa is null then 0 else pp.jasa end as totalharga,jnskem.jeniskemasan,pgw.namalengkap, " & _
                         " CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount * pp.jumlah END AS totaldiscound, " & _
                         " ((pp.jumlah * pp.hargasatuan ) - (CASE when pp.hargadiscount isnull then 0 ELSE  pp.hargadiscount * pp.jumlah end))+case when pp.jasa is null then 0 else pp.jasa end as totalbiaya,pp.qtydetailresep,ap.jenis ||'-'||ap.noantri AS noantri, case when pp.hargasatuan =0 then 0 else(CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount END/pp.hargasatuan)*100 end AS disc " & _
                         " FROM pelayananpasien_t AS pp INNER JOIN antrianpasiendiperiksa_t AS apdp ON pp.noregistrasifk = apdp.norec " & _
                         " INNER JOIN pasiendaftar_t AS pd ON apdp.noregistrasifk = pd.norec " & _
                         " INNER JOIN pasien_m AS ps ON pd.nocmfk = ps.id " & _
                         " left join alamat_m as al on al.nocmfk=ps.id " & _
                         " INNER JOIN produk_m AS pr ON pp.produkfk = pr.id " & _
                         " INNER JOIN ruangan_m AS ru ON apdp.objectruanganfk = ru.id " & _
                         " INNER JOIN strukresep_t AS sr ON pp.strukresepfk = sr.norec " & _
                         " INNER JOIN ruangan_m AS ru2 ON sr.ruanganfk = ru2.id " & _
                         " INNER JOIN jeniskemasan_m AS jnskem ON pp.jeniskemasanfk = jnskem.id " & _
                         " INNER JOIN pegawai_m AS pgw ON sr.penulisresepfk = pgw.id " & _
                         " INNER JOIN satuanstandar_m AS sstd ON pp.satuanviewfk = sstd.id " & _
                         " INNER JOIN jeniskelamin_m AS jk ON ps.objectjeniskelaminfk = jk.id " & _
                         " INNER JOIN kelompokpasien_m AS kpp ON pd.objectkelompokpasienlastfk = kpp.id " & _
                         " left JOIN rekanan_m as rek on rek.id=pd.objectrekananfk " & _
                         " LEFT JOIN antrianapotik_t AS ap ON ap.noresep = sr.noresep " & _
                         " WHERE sr.norec='" & strNores & "'"
            End If
            
            ReadRs strSQL
             adoReport.CommandText = strSQL
             adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            .txtNamaRs.SetText strNamaLengkapRs
            .txtAlamatRs.SetText stralmtLengkapRs
            If Not rs.EOF Then
                .txtNmrRM.SetText IIf(IsNull(rs("nocm")), "", rs("nocm"))
                .txtNamaPasien.SetText IIf(IsNull(rs("namapasienjk")), "", rs("namapasienjk"))
                .txtAlamat.SetText IIf(IsNull(rs("alamat")), "", rs("alamat"))
                .txtNmrAntrian.SetText IIf(IsNull(rs("noantri")), "", rs("noantri"))
                .txtKelPasien.SetText IIf(IsNull(rs("penjamin")), "", rs("penjamin"))
                .usNorec.SetUnboundFieldSource ("{ado.norec}")
                .usProduk.SetUnboundFieldSource ("{ado.namaprodukstandar}")
                .ucHargaSatuan.SetUnboundFieldSource ("{ado.hargasatuan}")
                .unjml.SetUnboundFieldSource ("{ado.jumlah}")
                .usJml.SetUnboundFieldSource ("{ado.jumlah}")
                .ucTotalHarga.SetUnboundFieldSource ("{ado.totalharga}")
                .usDiskon.SetUnboundFieldSource ("{ado.disc}")
            End If
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "CetakResep")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = ReportResep
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

