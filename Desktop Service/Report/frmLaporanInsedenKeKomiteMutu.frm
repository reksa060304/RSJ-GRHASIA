VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmLaporanInsedenKeKomiteMutu 
   Caption         =   "Transmedic"
   ClientHeight    =   7005
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5820
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
Attribute VB_Name = "frmLaporanInsedenKeKomiteMutu"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit
Dim Report As New crLaporanInsidenKeKomiteMutu

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
    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "PasienDaftar")
End Sub

Private Sub Form_Resize()
    CRViewer1.Top = 0
    CRViewer1.Left = 0
    CRViewer1.Height = ScaleHeight
    CRViewer1.Width = ScaleWidth
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmLaporanInsedenKeKomiteMutu = Nothing
End Sub

Public Sub Cetak(Norec As String, view As String)
'On Error GoTo errLoad
'On Error Resume Next

Set frmLaporanInsedenKeKomiteMutu = Nothing
Dim adocmd As New ADODB.Command
Dim strFilter, strFilter1 As String
Dim namaUser As String
Set Report = New crLaporanInsidenKeKomiteMutu
Dim strNorec As String
If Norec <> "" Then
    strNorec = Norec
End If

            
     strSQL = " SELECT rii.*,jk.jeniskelamin,ru.namaruangan,kp.kelompokpasien,to_char(rii.tglahir,'DD-MM-YYYY') AS tglLahir, " & _
              " to_char(rii.tglmasuk,'DD-MM-YYYY') AS tglMasuk,to_char(rii.tglmasuk,'HH:MI:SS') AS JamMasuk,to_char(rii.tglinsiden,'DD-MM-YYYY') AS tglInsiden, " & _
              " to_char(rii.tglinsiden,'HH:MI:SS') AS JamInsiden,to_char(rii.tgllapor,'DD-MM-YYYY') AS tglLapor,to_char(rii.tglterima,'DD-MM-YYYY') AS tglTerima " & _
              " FROM laporaninsideninternal_t AS rii " & _
              " INNER JOIN jeniskelamin_m AS jk ON jk.id = rii.jeniskelaminfk " & _
              " INNER JOIN ruangan_m AS ru ON ru.id = rii.ruanganfk " & _
              " LEFT JOIN kelompokpasien_m AS kp ON kp.id = rii.penanggungbiayapasienfk " & _
              " WHERE rii.norec = '" & strNorec & "' "
    adocmd.CommandText = strSQL
    adocmd.CommandType = adCmdText
    ReadRs2 strSQL
    With Report
        .database.AddADOCommand CN_String, adocmd
        If RS2.BOF = False Then
            .txtNamaRs.SetText strNamaLengkapRs
            .txtNamaPasien.SetText RS2!namapasien
            .txtNoMr.SetText RS2!noCm
            .txtTglLahir.SetText RS2!tgllahir
            .txtNamaRuangan.SetText RS2!namaruangan
            .txtJamMasuk.SetText RS2!JamMasuk
            .txtTglMasuk.SetText RS2!tglmasuk
            .txtTglInsiden.SetText RS2!tglInsiden
            .txtJamInsiden.SetText RS2!JamInsiden
            .txtNamaInsiden.SetText RS2!insiden
            .txtKronologiInsiden.SetText RS2!kronologisinsiden
            .txtLokasi.SetText RS2!tempatinsiden
            .txtUnitPenyebab.SetText RS2!unitterkait
            .txtTindakan.SetText RS2!penanganan
            .txtLangkah.SetText RS2!langkahpenanganan
            .txtPelapor.SetText RS2!pembuatlaporan
            .txtPenerima.SetText RS2!penerimalaporan
            .txtTglLapor.SetText RS2!tglLapor
            .txtTglLaporpenerima.SetText RS2!tglTerima
            
            If RS2!umur = 1 Then
               .txtNol.SetText "V"
            ElseIf RS2!umur = 2 Then
               .txtSatu.SetText "V"
            ElseIf RS2!umur = 3 Then
               .txtDua.SetText "V"
            ElseIf RS2!umur = 4 Then
               .txtTiga.SetText "V"
            ElseIf RS2!umur = 5 Then
               .txtEmpat.SetText "V"
            ElseIf RS2!umur = 6 Then
               .txtLima.SetText "V"
            ElseIf RS2!umur = 7 Then
               .txtEnam.SetText "V"
            End If
            
            If RS2!jeniskelamin = "LAKI-LAKI" Then
               .txtPria.SetText "V"
            ElseIf RS2!jeniskelamin = "PEREMPUAN" Then
               .txtPerempuan.SetText "V"
            End If
            
            If RS2!KelompokPasien = "Umum/Pribadi" Then
               .txtPribadi.SetText "V"
            ElseIf RS2!KelompokPasien = "BPJS" Then
               .txtBpjs.SetText "V"
            ElseIf RS2!KelompokPasien = "BPJS Non PBI " Then
               .txtBpjs.SetText "V"
            ElseIf RS2!KelompokPasien = "BPJS PBI" Then
               .txtBpjs.SetText "V"
            ElseIf RS2!KelompokPasien = "Asuransi lain" Then
               .txtAsuransi.SetText "V"
            ElseIf RS2!KelompokPasien = "Jamkesda" Then
               .txtAsuLainnya.SetText "V"
            Else
                .txtAsuLainnya.SetText "V"
            End If
            
            If RS2!jenisinsiden = 1 Or RS2!jenisinsiden = "1" Then
               .txtJISatu.SetText "V"
            ElseIf RS2!jenisinsiden = 2 Or RS2!jenisinsiden = "2" Then
               .txtJIDua.SetText "V"
            ElseIf RS2!jenisinsiden = 3 Or RS2!jenisinsiden = "3" Then
               .txtJITiga.SetText "V"
            ElseIf RS2!jenisinsiden = 4 Or RS2!jenisinsiden = "4" Then
               .txtJIEmpat.SetText "V"
            End If
            
            If RS2!pelaporinsiden = 1 Then
               .txtOpSatu.SetText "V"
            ElseIf RS2!pelaporinsiden = 2 Then
               .txtOpDua.SetText "V"
            ElseIf RS2!pelaporinsiden = 3 Then
               .txtOpTiga.SetText "V"
            ElseIf RS2!pelaporinsiden = 4 Then
               .txtOpEmpat.SetText "V"
            ElseIf RS2!pelaporinsiden = 5 Then
               .txtOpLima.SetText "V"
            End If
            
            If RS2!insidenpenyangkut = 1 Or RS2!insidenpenyangkut = "1" Then
               .txtImSatu.SetText "V"
            ElseIf RS2!insidenpenyangkut = 2 Or RS2!insidenpenyangkut = "2" Then
               .txtImDua.SetText "V"
            ElseIf RS2!insidenpenyangkut = 3 Or RS2!insidenpenyangkut = "3" Then
               .txtImTiga.SetText "V"
            ElseIf RS2!insidenpenyangkut = 4 Or RS2!insidenpenyangkut = "4" Then
               .txtImEmpat.SetText "V"
            End If
                        
            If RS2!jiwa = 1 Then
               .txtItSatu.SetText "V"
            ElseIf RS2!jiwa = 2 Then
               .txtItDua.SetText "V"
            ElseIf RS2!jiwa = 3 Then
               .txtItTiga.SetText "V"
            ElseIf RS2!jiwa = 4 Then
               .txtItEmpat.SetText "V"
            ElseIf RS2!jiwa = 5 Then
               .txtItLima.SetText "V"
            ElseIf RS2!jiwa = 6 Then
               .txtItEnam.SetText "V"
            ElseIf RS2!jiwa = 7 Then
               .txtItTujuh.SetText "V"
            End If
                        
            If RS2!akibatinsiden = 1 Then
               .txtAiSatu.SetText "V"
            ElseIf RS2!akibatinsiden = 2 Then
               .txtAiDua.SetText "V"
            ElseIf RS2!akibatinsiden = 3 Then
               .txtAiTiga.SetText "V"
            ElseIf RS2!akibatinsiden = 4 Then
               .txtAiEmpat.SetText "V"
            ElseIf RS2!akibatinsiden = 5 Then
               .txtAiLima.SetText "V"
            End If
                                        
            If RS2!dilakukanoleh = 1 Or RS2!dilakukanoleh = "1" Then
               .txtTdSatu.SetText "V"
            ElseIf RS2!dilakukanoleh = 2 Or RS2!dilakukanoleh = "2" Then
               .txtTdDua.SetText "V"
            ElseIf RS2!dilakukanoleh = 3 Or RS2!dilakukanoleh = "3" Then
               .txtTdTiga.SetText "V"
            ElseIf RS2!dilakukanoleh = 4 Or RS2!dilakukanoleh = "4" Then
               .txtTdEmpat.SetText "V"
            End If
            
            If RS2!kejadiansama = 1 Or RS2!kejadiansama = "1" Then
               .txtStatSatu.SetText "V"
            ElseIf RS2!kejadiansama = 2 Or RS2!kejadiansama = "2" Then
               .txtStatDua.SetText "V"
            End If
                                
            If RS2!grading = 1 Or RS2!grading = "1" Then
               .txtBiru.SetText "V"
            ElseIf RS2!grading = 2 Or RS2!grading = "2" Then
               .txtHijau.SetText "V"
            ElseIf RS2!grading = 3 Or RS2!grading = "3" Then
               .txtKuning.SetText "V"
            ElseIf RS2!grading = 4 Or RS2!grading = "4" Then
               .txtMerah.SetText "V"
            End If
            
            
             
            If view = "false" Then
                Dim strPrinter As String
                strPrinter = GetTxt("Setting.ini", "Printer", "PasienDaftar")
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
    End With
Exit Sub
errLoad:
End Sub
