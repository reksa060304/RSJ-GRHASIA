VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmExpertiseRadiologi 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
   Icon            =   "frmExpertiseRadiologi.frx":0000
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
Attribute VB_Name = "frmExpertiseRadiologi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New Cr_cetakExpertiseRadiologi
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
' Report.PrintOut False
    Cr_cetakExpertiseRadiologi.PrinterSetup Me.hwnd
'    Cr_cetakExpertiseRadiologi.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
'    Report.PrintOut False
End Sub

Private Sub CmdOption_Click()
 Cr_cetakExpertiseRadiologi.PrinterSetup Me.hwnd
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
    Set frmExpertiseRadiologi = Nothing
End Sub

Public Sub Cetak(strNorec As String, User As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next
Set frmExpertiseRadiologi = Nothing
Dim strSQL As String
Dim umur As String
Dim StrFilter As String
Dim noorder As String
Dim stringExp As String
Dim Expertise As String
If strNorec <> "" Then
    noorder = " (" & Left(strNorec, Len(strNorec) - 1) & ")"
End If
'CRViewer1.ReportSource = Nothing
strSQL = ""
    With Report
'       CRViewer1.Refresh
            strSQL = " SELECT distinct  ps.nocm,ps.namapasien,jk.jeniskelamin,to_char(pp.tglpelayanan, 'DD-MM-YYYY HH:mm:ss') as tglverifikasi,pp.produkfk,pr.namaproduk,pp.jumlah,pp.hargasatuan,pp.hargadiscount,sp.nostruk,pd.noregistrasi,ru.namaruangan,dp.namadepartemen, " & _
                     " ps.id AS psid,apd.norec AS norec_apd,sp.norec AS norec_sp,pp.norec AS norec_pp,ru.objectdepartemenfk,so.noorder,ris.order_key AS idbridging,apd.objectruanganfk,pp.iscito,pp.jasa, " & _
                     " CASE WHEN ris.order_key IS NOT NULL THEN 'Sudah Dikirim' ELSE '-' END AS statusbridging,hr.norec AS hr_norec,pg.namalengkap as dokterperujuk,to_char(hr.tanggal, 'DD-MM-YYYY HH:mm:ss') as tglexpertise, " & _
                     " ru1.namaruangan as poli,to_char(ps.tgllahir, 'DD-MM-YYYY') as tgllahir,to_char(pd.tglregistrasi, 'DD-MM-YYYY') as tglmasuk, to_char(pd.tglpulang, 'DD-MM-YYYY') as tglkeluar, " & _
                     " kp.kelompokpasien,hr.keterangan,CASE WHEN alm.alamatlengkap IS NULL THEN '' ELSE alm.alamatlengkap END AS alamatlengkap,pg1.namalengkap AS dokterexp FROM pelayananpasien_t AS pp " & _
                     " LEFT JOIN pelayananpasienpetugas_t AS ppp ON ppp.pelayananpasien = pp.norec " & _
                     " LEFT JOIN antrianpasiendiperiksa_t AS apd ON apd.norec = pp.noregistrasifk " & _
                     " LEFT JOIN pasiendaftar_t AS pd ON pd.norec = apd.noregistrasifk " & _
                     " LEFT JOIN pasien_m AS ps ON ps.id = pd.nocmfk " & _
                     " LEFT JOIN jeniskelamin_m AS jk ON jk.id = ps.objectjeniskelaminfk " & _
                     " LEFT JOIN produk_m AS pr ON pr.id = pp.produkfk " & _
                     " LEFT JOIN ruangan_m AS ru ON ru.id = apd.objectruanganfk " & _
                     " LEFT JOIN departemen_m AS dp ON dp.id = ru.objectdepartemenfk " & _
                     " LEFT JOIN strukpelayanan_t AS sp ON sp.norec = pp.strukfk " & _
                     " LEFT JOIN strukorder_t AS so ON so.norec = pp.strukorderfk " & _
                     " LEFT JOIN ris_order AS ris ON ris.order_no = so.noorder AND ris.order_code = CAST (pp.produkfk AS TEXT) " & _
                     " LEFT JOIN hasilradiologi_t AS hr ON hr.pelayananpasienfk = pp.norec AND hr.statusenabled = true " & _
                     " LEFT JOIN pegawai_m AS pg ON pg.id = so.objectpegawaiorderfk " & _
                     " LEFT JOIN pegawai_m AS pg1 ON pg1.id = ppp.objectpegawaifk " & _
                     " LEFT JOIN alamat_m AS alm ON alm.nocmfk = ps.id " & _
                     " LEFT JOIN ruangan_m AS ru1 ON ru1.id = so.objectruanganfk " & _
                     " LEFT JOIN kelompokpasien_m AS kp ON kp.id = pd.objectkelompokpasienlastfk " & _
                     " WHERE pp.kdprofile = 15 AND pp.norec in  " & _
                       noorder
            
            ReadRs strSQL
            
            adoReport.CommandText = strSQL
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            .txtAlamatRs.SetText stralmtLengkapRs
            .txtNamaPenerintahan.SetText strNamaPemerintah
            .txtNamaRs.SetText strNamaLengkapRs
            .txtWebEmail.SetText strWebSite & ", " & strEmail
            .txtNamaKota.SetText strNamaKota & ","
            .usNoRekamMedis.SetUnboundFieldSource ("{ado.nocm}")
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usAlamatPasien.SetUnboundFieldSource ("{ado.alamatlengkap}")
            .usPenjamin.SetUnboundFieldSource ("{ado.kelompokpasien}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.poli}")
            .usNamaDokterP.SetUnboundFieldSource ("{ado.dokterperujuk}")
            .usNoOrder.SetUnboundFieldSource ("{ado.noorder}")
            .usTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usJamExpertise.SetUnboundFieldSource ("{ado.tglexpertise}")
            .usJamVerifikasi.SetUnboundFieldSource ("{ado.tglverifikasi}")
            .usTglMasuk.SetUnboundFieldSource ("{ado.tglmasuk}")
            .usTglKeluar.SetUnboundFieldSource ("{ado.tglkeluar}")
'            .usLayanan.SetUnboundFieldSource ("{ado.namaproduk}")
'            .usHasilExpertise.SetUnboundFieldSource ("{ado.keterangan}")
            
            If rs.EOF = False Then
             Dim a As Integer
             Dim Expertise1 As String
             .umur.SetText hitungUmurNew(rs("tgllahir").Value, Now)
             .txtExpertise.SetText ""
               For a = 1 To rs.RecordCount
                         .txtExpertise.Suppress = False
                         stringExp = IIf(IsNull(rs("keterangan")), "", rs("keterangan"))
                         Expertise = Replace(stringExp, "~", vbCrLf)
                        .txtNamaDokter.SetText IIf(IsNull(rs("dokterexp")), "", rs("dokterexp"))
                         Expertise1 = "=================================================================================================="
                        If a = 1 Then
                           .txtExpertise.SetText Expertise1 & vbCrLf & a & ". " & IIf(IsNull(rs("namaproduk")), "", rs("namaproduk")) & vbCrLf & Expertise1 & vbCrLf & "<= Hasil Expertise =>" & vbCrLf & vbCrLf & Expertise
                        Else
                           .txtExpertise.SetText .txtExpertise.Text & vbCrLf & vbCrLf & Expertise1 & vbCrLf & a & ". " & IIf(IsNull(rs("namaproduk")), "", rs("namaproduk")) & vbCrLf & Expertise1 & vbCrLf & "<= Hasil Expertise =>" & vbCrLf & vbCrLf & Expertise
                        End If
                        .txtUser.SetText User
                        If a = rs.RecordCount Then GoTo all:
                rs.MoveNext
'
              Next a
            End If
all:
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


