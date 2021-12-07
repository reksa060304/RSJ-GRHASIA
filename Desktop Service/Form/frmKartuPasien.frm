VERSION 5.00
Object = "{F9043C88-F6F2-101A-A3C9-08002B2F49FB}#1.2#0"; "comdlg32.ocx"
Begin VB.Form frmKartuPasien 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Foto"
   ClientHeight    =   6135
   ClientLeft      =   2415
   ClientTop       =   3165
   ClientWidth     =   14445
   Icon            =   "frmKartuPasien.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   6135
   ScaleWidth      =   14445
   Begin VB.PictureBox Picture1 
      AutoRedraw      =   -1  'True
      BackColor       =   &H00FFFFFF&
      Height          =   525
      Left            =   240
      ScaleHeight     =   31
      ScaleMode       =   3  'Pixel
      ScaleWidth      =   149
      TabIndex        =   0
      TabStop         =   0   'False
      Top             =   3240
      Width           =   2295
   End
   Begin MSComDlg.CommonDialog Dialog 
      Left            =   240
      Top             =   2640
      _ExtentX        =   847
      _ExtentY        =   847
      _Version        =   393216
   End
   Begin VB.PictureBox Picture3 
      Height          =   9570
      Left            =   360
      Picture         =   "frmKartuPasien.frx":0CCA
      ScaleHeight     =   9510
      ScaleWidth      =   15105
      TabIndex        =   1
      Top             =   120
      Width           =   15165
      Begin VB.PictureBox Picture2 
         Height          =   3045
         Left            =   6120
         ScaleHeight     =   2985
         ScaleWidth      =   4980
         TabIndex        =   2
         Top             =   360
         Width           =   5040
      End
      Begin VB.Image Image1 
         Height          =   3045
         Left            =   960
         Picture         =   "frmKartuPasien.frx":ABB10
         Stretch         =   -1  'True
         Top             =   360
         Width           =   5040
      End
   End
End
Attribute VB_Name = "frmKartuPasien"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

Dim strDeviceName As String
Dim strDriverName As String
Dim strPort As String
Dim bolStrukResep As Boolean

'Private Sub cmdCetak_Click()
' If cboPrinter.Text = "" Then MsgBox "Printer belum dipilih", vbInformation, ".: Information": Exit Sub
'    If bolStrukResep = True Then
'        Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
'        PrinterNama = cboPrinter.Text
'        Report.PrintOut False
'  Report.PrintOut False
'    End If
'    Report.SelectPrinter "winspool", cboPrinter.Text, "Ne00:"
    'PrinterNama = cboPrinter.Text
'    Report.PrintOut False
'End Sub

'Private Sub CmdOption_Click()
'    If bolStrukResep = True Then
'        Report.PrinterSetup Me.hwnd
'    End If
'    CRViewer1.Refresh
'End Sub

Private Sub Form_Load()
'    Dim p As Printer
'    cboPrinter.Clear
'    For Each p In Printers
'        cboPrinter.AddItem p.DeviceName
'    Next
'    cboPrinter.Text = GetTxt("Setting.ini", "Printer", "KartuPasien")
End Sub

'Private Sub Form_Resize()
'    CRViewer1.Top = 0
'    CRViewer1.Left = 0
'    CRViewer1.Height = ScaleHeight
'    CRViewer1.Width = ScaleWidth
'End Sub

Private Sub Form_Unload(Cancel As Integer)
    Set frmKartuPasien = Nothing
End Sub
Private Sub make128(angka As Double)
Dim x As Long, Y As Long, pos As Long
Dim Bardata As String
Dim Cur As String
Dim CurVal As Long
Dim chksum As Long
Dim temp As String
Dim bc(106) As String
    'code 128 is basically the ASCII chr set.
    '4 element sizes : 1=narrowest, 4=widest
    bc(0) = "212222" '<SPC>
    bc(1) = "222122" '!
    bc(2) = "222221" '"
    bc(3) = "121223" '#
    bc(4) = "121322" '$
    bc(5) = "131222" '%
    bc(6) = "122213" '&
    bc(7) = "122312" ''
    bc(8) = "132212" '(
    bc(9) = "221213" ')
    bc(10) = "221312" '*
    bc(11) = "231212" '+
    bc(12) = "112232" ',
    bc(13) = "122132" '-
    bc(14) = "122231" '.
    bc(15) = "113222" '/
    bc(16) = "123122" '0
    bc(17) = "123221" '1
    bc(18) = "223211" '2
    bc(19) = "221132" '3
    bc(20) = "221231" '4
    bc(21) = "213212" '5
    bc(22) = "223112" '6
    bc(23) = "312131" '7
    bc(24) = "311222" '8
    bc(25) = "321122" '9
    bc(26) = "321221" ':
    bc(27) = "312212" ';
    bc(28) = "322112" '<
    bc(29) = "322211" '=
    bc(30) = "212123" '>
    bc(31) = "212321" '?
    bc(32) = "232121" '@
    bc(33) = "111323" 'A
    bc(34) = "131123" 'B
    bc(35) = "131321" 'C
    bc(36) = "112313" 'D
    bc(37) = "132113" 'E
    bc(38) = "132311" 'F
    bc(39) = "211313" 'G
    bc(40) = "231113" 'H
    bc(41) = "231311" 'I
    bc(42) = "112133" 'J
    bc(43) = "112331" 'K
    bc(44) = "132131" 'L
    bc(45) = "113123" 'M
    bc(46) = "113321" 'N
    bc(47) = "133121" 'O
    bc(48) = "313121" 'P
    bc(49) = "211331" 'Q
    bc(50) = "231131" 'R
    bc(51) = "213113" 'S
    bc(52) = "213311" 'T
    bc(53) = "213131" 'U
    bc(54) = "311123" 'V
    bc(55) = "311321" 'W
    bc(56) = "331121" 'X
    bc(57) = "312113" 'Y
    bc(58) = "312311" 'Z
    bc(59) = "332111" '[
    bc(60) = "314111" '\
    bc(61) = "221411" ']
    bc(62) = "431111" '^
    bc(63) = "111224" '_
    bc(64) = "111422" '`
    bc(65) = "121124" 'a
    bc(66) = "121421" 'b
    bc(67) = "141122" 'c
    bc(68) = "141221" 'd
    bc(69) = "112214" 'e
    bc(70) = "112412" 'f
    bc(71) = "122114" 'g
    bc(72) = "122411" 'h
    bc(73) = "142112" 'i
    bc(74) = "142211" 'j
    bc(75) = "241211" 'k
    bc(76) = "221114" 'l
    bc(77) = "413111" 'm
    bc(78) = "241112" 'n
    bc(79) = "134111" 'o
    bc(80) = "111242" 'p
    bc(81) = "121142" 'q
    bc(82) = "121241" 'r
    bc(83) = "114212" 's
    bc(84) = "124112" 't
    bc(85) = "124211" 'u
    bc(86) = "411212" 'v
    bc(87) = "421112" 'w
    bc(88) = "421211" 'x
    bc(89) = "212141" 'y
    bc(90) = "214121" 'z
    bc(91) = "412121" '{
    bc(92) = "111143" '|
    bc(93) = "111341" '}
    bc(94) = "131141" '~
    bc(95) = "114113" '<DEL>        *not used in this sub
    bc(96) = "114311" 'FNC 3        *not used in this sub
    bc(97) = "411113" 'FNC 2        *not used in this sub
    bc(98) = "411311" 'SHIFT        *not used in this sub
    bc(99) = "113141" 'CODE C       *not used in this sub
    bc(100) = "114131" 'FNC 4       *not used in this sub
    bc(101) = "311141" 'CODE A      *not used in this sub
    bc(102) = "411131" 'FNC 1       *not used in this sub
    bc(103) = "211412" 'START A     *not used in this sub
    bc(104) = "211214" 'START B
    bc(105) = "211232" 'START C     *not used in this sub
    bc(106) = "2331112" 'STOP

    Picture1.Cls
'    If Text1.Text = "" Then Exit Sub
    pos = 20
    Bardata = angka 'Text1.Text

    'Check for invalid characters, calculate check sum & build temp string
    For x = 1 To Len(Bardata)
        Cur = Mid$(Bardata, x, 1)
        If Cur < " " Or Cur > "~" Then
            Picture1.Print "Invalid Character(s)"
            Exit Sub
        End If
        CurVal = Asc(Cur) - 32
        temp = temp + bc(CurVal)
        chksum = chksum + CurVal * x
    Next
    
    'Add start, stop & check characters
    chksum = (chksum + 104) Mod 103
    temp = bc(104) & temp & bc(chksum) & bc(106)

    'Generate Barcode
    For x = 1 To Len(temp)
        If x Mod 2 = 0 Then
                'SPACE
                pos = pos + (Val(Mid$(temp, x, 1))) + 1
        Else
                'BAR
                For Y = 1 To (Val(Mid$(temp, x, 1)))
                    Picture1.Line (pos, 1)-(pos, 58 - 0 * 8)
                    pos = pos + 1
                Next
        End If
    Next

    'Add Label?
'    If Check1(1).Value Then
'        Picture1.CurrentX = 30 + Len(Bardata) * (3 + 1 * 2) 'kinda center
'        Picture1.CurrentY = 50
'        Picture1.Print Bardata;
'    End If
End Sub

Public Sub CetakKartu(strNocm As String)
'On Error GoTo errLoad
Set frmKartuPasien = Nothing
Dim strPrinter As String
Dim prn As Printer
Dim strPT As String
strPT = App.Path & "\other\KIB CETAK.jpg"
Image1.Picture = LoadPicture(strPT, vbLPLarge, vbLPColor)


'UrlFile = App.Path & "\other\KartuFix.jpeg"
strSQL = "SELECT ps.namapasien  ||  ' ( '  ||   jk.reportdisplay  ||  ' ) ' as namapasien ,ps.nocm, ps.tgllahir," & _
            " ps.namaayah, case when ps.namakeluarga is null then '-' else ps.namakeluarga end as namakeluarga,ps.namasuamiistri ,ps.objectjeniskelaminfk,ps.objectstatusperkawinanfk, " & _
            " alm.alamatlengkap from pasien_m ps INNER JOIN jeniskelamin_m jk on jk.id=ps.objectjeniskelaminfk " & _
            " INNER JOIN alamat_m as alm on alm.nocmfk=ps.id " & _
            " where ps.id=" & strNocm & " "
      
     ReadRs strSQL
      
    strPrinter = GetTxt("Setting.ini", "Printer", "KartuPasien")
    If Printers.count > 0 Then
        For Each prn In Printers
            If prn.DeviceName = strPrinter Then
                Set Printer = prn
                Exit For
            End If
        Next prn
    End If
    
'    Call DrawBarcode(Text1, Picture2)
    
'    Dim msg As String
    Dim ayah As String
    Dim ayah2 As String
    Dim TglLahir1 As String
    Dim Tgl As String
    Dim bulan As String
    Dim Tahun As String
    Dim splt() As String
    Dim Inisial, underline, tgllahir, alamat As String
    Inisial = "" '"KARTU PASIEN"
    If IsNull(rs!objectjeniskelaminfk) <> 1 Then
        If rs!objectstatusperkawinanfk = 2 Then 'kawin
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        Else
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        End If
    Else
        If rs!objectstatusperkawinanfk = 2 Then 'kawin
            ayah = ""
        Else
            ayah = IIf(IsNull(rs!namakeluarga) = True, "", rs!namakeluarga)
        End If
    End If
    
    If ayah <> "" Then
        splt = Split(ayah, " ")
        ayah = splt(0)
    End If
     TglLahir1 = IIf(IsNull(rs!tgllahir) = True, "", Format(rs!tgllahir, "dd-MM-yyyy"))
     Tgl = IIf(IsNull(rs!tgllahir) = True, "", Format(rs!tgllahir, "dd"))
     bulan = getBulan(Format(TglLahir1, "dd-MM-yyyy"))
     Tahun = IIf(IsNull(rs!tgllahir) = True, "", Format(rs!tgllahir, "yyyy"))
     ayah2 = Tgl & " " & bulan & " " & Tahun
     alamat = IIf(IsNull(rs!tgllahir) = True, "", rs!alamatlengkap)

      ' Resize the picture.
'      Picture2.AutoRedraw = True
'      Picture2.PaintPicture Picture3.Picture, _
'        Picture2.ScaleLeft, Picture2.ScaleTop, Picture2.ScaleWidth, Picture2.ScaleHeight, _
'        Picture3.ScaleLeft, Picture3.ScaleTop, Picture3.ScaleWidth, Picture3.ScaleHeight
'      Picture2.Picture = Picture2.Image
     Printer.PaintPicture Image1.Picture, 0, 0
     Printer.FontName = "Tahoma"
     Printer.fontSize = 6
     Printer.Print ""
     Printer.Print ""
     Printer.Print "       " & "KARTU IDENTITAS BEROBAT (KIB)"
     Printer.Print ""
     Printer.FontBold = True
     Printer.Print "       " & rs!noCm
     Printer.fontSize = 8
     Printer.Print ""
     Printer.Print "    " & rs!namapasien
     Printer.fontSize = 6
     Printer.FontBold = False
     Printer.FontItalic = True
     Printer.Print ""
     Printer.Print "     " & ayah2
     Printer.Print ""
     Printer.Print "     " & alamat
     Printer.Print ""
     Call make128(rs!noCm)
     Printer.PaintPicture Picture1.Image, 65, 1850
     Printer.FontBold = True
     Printer.FontName = "Tahoma"
     Printer.fontSize = 17
     Printer.CurrentX = 15165
     Printer.CurrentY = 9570
     Printer.EndDoc

Exit Sub
errLoad:

    MsgBox Err.Number & " " & Err.Description
End Sub
