VERSION 5.00
Object = "{C4847593-972C-11D0-9567-00A0C9273C2A}#8.0#0"; "crviewer.dll"
Begin VB.Form frmCetakLabelGizi 
   Caption         =   "Transmedic"
   ClientHeight    =   7245
   ClientLeft      =   60
   ClientTop       =   345
   ClientWidth     =   5790
   Icon            =   "frmCetakLabelGizi.frx":0000
   LinkTopic       =   "Form1"
   ScaleHeight     =   7245
   ScaleWidth      =   5790
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
Attribute VB_Name = "frmCetakLabelGizi"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Dim reportLabel As New Cr_cetakLabelGiziRevSatu 'Cr_cetakLabelGiziNew
Dim ii As Integer
Dim tempPrint1 As String
Dim p As Printer
Dim p2 As Printer
Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim strPrinter As String
Dim strPrinter1 As String
Dim PrinterNama As String
Dim adoReport As New ADODB.Command
Private Sub cmdCetak_Click()
    reportLabel.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
    reportLabel.PrintOut False
End Sub

Private Sub CmdOption_Click()
    reportLabel.PrinterSetup Me.hwnd
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

    Set frmCetakLabelGizi = Nothing
'    fso.DeleteFile (App.Path & "\tempbitmap.bmp")
'    Set sect = Nothing

End Sub

Public Sub Cetak(Noregistrasi As String, view As String, qty As String)
'On Error GoTo errLoad
Set frmCetakLabelGizi = Nothing
Dim strSQL As String
Dim i As Integer
Dim str As String
Dim jml As Integer
    
    If Noregistrasi <> "" Then
        str = " op.norec in (" & Right(Noregistrasi, Len(Noregistrasi) - 1) & ")ORDER BY ps.namapasien ) as x where x.rownum = 1"
    End If

    With reportLabel
            Set adoReport = New ADODB.Command
             adoReport.ActiveConnection = CN_String
            
'            strSQL = "select pd.noregistrasi, sk.nokirim, sk.qtyproduk as qtykirim,op.keteranganlainnya as keteranganlainnyakirim,op.qtyprodukinuse as cc  ,op.jumlah as volume , pd.tglregistrasi, " & _
'                     "to_char(ps.tgllahir, 'DD/MM/YYYY') as tgllahir,ps.namapasien, ps.nocm, ru.namaruangan as ruanganasal, " & _
'                     "jw.jeniswaktu,jd.jenisdiet,  op.qtyproduk,kls.namakelas, kd.kategorydiet,to_char(so.tglorder,'DD-MM-YYYY') AS tglorder, " & _
'                     "CASE WHEN jw.jeniswaktu = 'Pagi' THEN '09:00' WHEN jw.jeniswaktu = 'Siang' THEN '14:00' WHEN jw.jeniswaktu = 'Sore' THEN '19:00' " & _
'                     "WHEN jw.jeniswaktu = 'Snack Pagi' THEN '12:00' WHEN jw.jeniswaktu = 'Snack Sore' THEN '19:00' END  as jammakan, " & _
'                     "jd.jenisdiet || ', ' || CASE WHEN op.keteranganlainnya IS NULL THEN '-' ELSE op.keteranganlainnya END AS keterangan,op.arrjenisdiet " & _
'                     "from orderpelayanan_t as op " & _
'                     "inner join pasiendaftar_t as pd on pd.norec = op.noregistrasifk " & _
'                     "inner join ruangan_m as ru on ru.id = op.objectruanganfk " & _
'                     "inner join pasien_m as ps on ps.id = op.nocmfk " & _
'                     "left join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk " & _
'                     "inner join strukorder_t as so on so.norec = op.strukorderfk " & _
'                     "left join strukkirim_t as sk on  sk.norec = op.strukkirimfk " & _
'                     "inner join jeniswaktu_m as jw on jw.id = op.objectjeniswaktufk " & _
'                     "left join jenisdiet_m as jd on jd.id = op.objectjenisdietfk " & _
'                     "inner join kategorydiet_m as kd on kd.id = op.objectkategorydietfk " & _
'                     "left join kelas_m as kls on kls.id = op.objectkelasfk " & _
'                     "where " & str
'                     "where op.norec= '" & Noregistrasi & "'
             strSQL = "select * from (select so.keteranganlainnya,pd.noregistrasi, sk.nokirim, sk.qtyproduk as qtykirim,(SELECT string_agg(jm.jenisdiet, ', ') as arrjenisdietket From jenisdiet_m jm WHERE jm.id::varchar IN (  select unnest(string_to_array(op.arrjenisdiet,',')))) as keteranganlainnyakirim,op.qtyprodukinuse as cc  ,op.jumlah as volume,pd.tglregistrasi, " & _
                    " ps.namapasien || ' ['|| jk.reportdisplay ||']' AS namapasien, ps.nocm, ru.namaruangan AS ruanganasal, " & _
                    " jw.jeniswaktu,jd.jenisdiet,  op.qtyproduk,kls.namakelas, kd.kategorydiet,to_char(so.tglorder,'DD-MM-YYYY') AS tglorder, " & _
                    " CASE WHEN jw.jeniswaktu = 'Pagi' THEN '09:00' WHEN jw.jeniswaktu = 'Siang' THEN '14:00' WHEN jw.jeniswaktu = 'Sore' THEN '19:00' " & _
                    " WHEN jw.jeniswaktu = 'Snack Pagi' THEN '12:00' WHEN jw.jeniswaktu = 'Snack Sore' THEN '19:00' END  as jammakan, " & _
                    " jd.jenisdiet || ', ' || CASE WHEN op.keteranganlainnya IS NULL THEN '-' ELSE op.keteranganlainnya END AS keteranganlainnya, " & _
                    " to_char(ps.tgllahir, 'DD-MM-YYYY') as tgllahir,op.arrjenisdiet, " & _
                    " (SELECT string_agg(jm.jenisdiet, ', ') as arrjenisdietket From jenisdiet_m jm WHERE jm.id::varchar IN ( " & _
                    " select unnest(string_to_array(op.arrjenisdiet,','))))as arrjenisdietket, " & _
                    " ps.namapasien || '/ ' || to_char(ps.tgllahir, 'DD/MM/YYYY') || ' / ' || ps.nocm AS datapasien,'MAKAN ' || UPPER(jw.jeniswaktu) || ' ' || CASE WHEN sk.tglkirim IS NULL THEN to_char(so.tglorder, 'DD/MM/YYYY') " & _
                    " ELSE to_char(sk.tglkirim, 'DD/MM/YYYY') END AS makan,row_number() over (partition by pd.noregistrasi order by so.tglorder desc) as rownum " & _
                    " from orderpelayanan_t as op " & _
                    " inner join pasiendaftar_t as pd on pd.norec = op.noregistrasifk inner join antrianpasiendiperiksa_t as apd on apd.noregistrasifk = pd.norec" & _
                    " inner join ruangan_m as ru on ru.id = op.objectruanganfk " & _
                    " inner join pasien_m as ps on ps.id = op.nocmfk " & _
                    " left join jeniskelamin_m as jk on jk.id = ps.objectjeniskelaminfk " & _
                    " inner join strukorder_t as so on so.norec = op.strukorderfk " & _
                    " left join strukkirim_t as sk on  sk.norec = op.strukkirimfk " & _
                    " inner join jeniswaktu_m as jw on jw.id = op.objectjeniswaktufk " & _
                    " left join jenisdiet_m as jd on jd.id = op.objectjenisdietfk " & _
                    " inner join kategorydiet_m as kd on kd.id = op.objectkategorydietfk " & _
                    " left join kelas_m as kls on kls.id = op.objectkelasfk left join tempattidur_m as tete on tete.id = apd.nobed where apd.objectruanganfk = op.objectruanganfk " & _
                    " and " & str
'                    " to_char(ps.tgllahir, 'DD-MM-YYYY') || '(' || EXTRACT(YEAR FROM AGE(pd.tglregistrasi, ps.tgllahir)) || ' Thn ' " & _
'                    " || EXTRACT(MONTH FROM AGE(pd.tglregistrasi, ps.tgllahir)) || ' Bln ' " & _
'                    " || EXTRACT(DAY FROM AGE(pd.tglregistrasi, ps.tgllahir)) || ' Hr' || ' )' AS umur,|| ',' || kls.namakelas  || ',' || CASE WHEN apd.nobed is null THEN '-' ELSE tete.reportdisplay END " & _
'
              ReadRs strSQL
'            jml = qty - 1
             Dim strDate
'             strDate = getBulan(Format(RS!tgllahir, "yyyy/MM/dd"))
'             strDate = Format(RS!tgllahir, "yyyy/MM/dd")
             str = ""
             If Val(qty) - 1 = 0 Then
                 adoReport.CommandText = strSQL
              Else
                 For i = 1 To Val(qty) - 1
                     str = strSQL & " union all " & str
                 Next
                 
                 adoReport.CommandText = str & strSQL
            End If
          
            
            adoReport.CommandType = adCmdUnknown
            .database.AddADOCommand CN_String, adoReport
            .usNamaPasien.SetUnboundFieldSource ("{ado.namapasien}")
            .usNocm.SetUnboundFieldSource ("{ado.nocm}")
            .usTglLahir.SetUnboundFieldSource ("{ado.tgllahir}")
            .usNamaRuangan.SetUnboundFieldSource ("{ado.ruanganasal}")
            .usKelas.SetUnboundFieldSource ("{ado.namakelas}")
            .usNamaOrder.SetUnboundFieldSource ("{ado.keterangan}")
            .usWaktuMakan.SetUnboundFieldSource ("{ado.jeniswaktu}")
            .usTglOrder.SetUnboundFieldSource ("{ado.tglorder}")
            .usJamMakan.SetUnboundFieldSource ("{ado.jammakan}")
            .usDiet.SetUnboundFieldSource ("{ado.arrjenisdietket}")
            .usKeterangan.SetUnboundFieldSource ("{ado.keteranganlainnyakirim}")
            .usKeterangan1.SetUnboundFieldSource ("{ado.keteranganlainnya}")
'            view = "true"
            If view = "false" Then
                strPrinter1 = GetTxt("Setting.ini", "Printer", "LabelGizi")
                .SelectPrinter "winspool", strPrinter1, "Ne00:"
                .PrintOut False
                Unload Me
                Screen.MousePointer = vbDefault
             Else
                With CRViewer1
                    .ReportSource = reportLabel
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



