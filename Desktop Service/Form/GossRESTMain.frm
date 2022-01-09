VERSION 5.00
Begin VB.Form GossRESTMain 
   BackColor       =   &H00FFFFFF&
   BorderStyle     =   3  'Fixed Dialog
   Caption         =   "Desktop Service"
   ClientHeight    =   630
   ClientLeft      =   45
   ClientTop       =   690
   ClientWidth     =   5790
   Icon            =   "GossRESTMain.frx":0000
   LinkTopic       =   "GossRESTMain"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   OLEDropMode     =   1  'Manual
   ScaleHeight     =   630
   ScaleWidth      =   5790
   ShowInTaskbar   =   0   'False
   StartUpPosition =   2  'CenterScreen
   Begin VB.CheckBox Check1 
      Appearance      =   0  'Flat
      BackColor       =   &H80000005&
      ForeColor       =   &H80000008&
      Height          =   495
      Left            =   2520
      TabIndex        =   10
      Top             =   50
      Value           =   1  'Checked
      Width           =   255
   End
   Begin VB.Timer Timer1 
      Interval        =   1000
      Left            =   3600
      Top             =   4560
   End
   Begin VB.ComboBox cbReader 
      Height          =   315
      Left            =   1560
      TabIndex        =   7
      Top             =   3960
      Width           =   3015
   End
   Begin VB.TextBox tbBlockNo 
      Height          =   315
      Left            =   1560
      MaxLength       =   3
      TabIndex        =   6
      Text            =   "4"
      Top             =   4440
      Width           =   375
   End
   Begin VB.TextBox tbAuthenKeyNum 
      Height          =   315
      Left            =   1560
      MaxLength       =   2
      TabIndex        =   5
      Text            =   "1"
      Top             =   4920
      Width           =   375
   End
   Begin VB.Frame Frame3 
      Caption         =   "Key Type"
      Height          =   1095
      Left            =   2040
      TabIndex        =   2
      Top             =   4440
      Width           =   1575
      Begin VB.OptionButton rKeyB 
         Caption         =   "Key B"
         Height          =   375
         Left            =   360
         TabIndex        =   4
         Top             =   600
         Width           =   855
      End
      Begin VB.OptionButton rKeyA 
         Caption         =   "Key A"
         Height          =   255
         Left            =   360
         TabIndex        =   3
         Top             =   360
         Width           =   855
      End
   End
   Begin DesktopService.Gossamer Gossamer1 
      Left            =   720
      Top             =   120
      _ExtentX        =   741
      _ExtentY        =   741
      VDir            =   "VDir"
   End
   Begin VB.Label lblmc 
      BackStyle       =   0  'Transparent
      Caption         =   "MC"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   1920
      TabIndex        =   9
      Top             =   120
      Width           =   735
   End
   Begin VB.Label LblNFC 
      BackStyle       =   0  'Transparent
      Caption         =   "NFC"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   14.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   495
      Left            =   1320
      TabIndex        =   8
      Top             =   120
      Width           =   735
   End
   Begin VB.Image Image1 
      Height          =   600
      Left            =   3600
      Picture         =   "GossRESTMain.frx":0CCA
      Top             =   0
      Width           =   1875
   End
   Begin VB.Label Label2 
      Caption         =   "."
      Height          =   375
      Left            =   3480
      TabIndex        =   1
      Top             =   -120
      Width           =   375
   End
   Begin VB.Label Label1 
      BackStyle       =   0  'Transparent
      Caption         =   "@Epic"
      BeginProperty Font 
         Name            =   "Tahoma"
         Size            =   9.75
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   -1  'True
         Strikethrough   =   0   'False
      EndProperty
      Height          =   255
      Left            =   0
      OLEDropMode     =   1  'Manual
      TabIndex        =   0
      Top             =   360
      Width           =   855
   End
   Begin VB.Menu mnFile 
      Caption         =   "File"
      Begin VB.Menu mnuSettingPrinter 
         Caption         =   "Printer"
      End
      Begin VB.Menu mnuKoneksi 
         Caption         =   "Koneksi"
      End
      Begin VB.Menu fgdgdfg 
         Caption         =   "Version 20171116.1"
      End
      Begin VB.Menu asdasdasdsa 
         Caption         =   "-"
      End
      Begin VB.Menu mnuExit 
         Caption         =   "Exit"
      End
   End
End
Attribute VB_Name = "GossRESTMain"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Option Explicit

'Initialized during Form_Load via SanitizeInit, used during Sanitize:

Private Const FROM_CHARS As String = "[]\[\]\'\;\%\_\#"
Private Const TO_CHARS As String = "[[]]\[[]\[]]\['']\\[%]\[_]\[#]"
Private FromChars() As String
Private ToChars() As String

Dim nid As NOTIFYICONDATA ' deklarasi variable

Public STM As ADODB.Stream
Private LogFile As Integer
Private graphicSDKVersion   As String
Private prnSDKVersion       As String
Public urlLengkap As String
Dim fso As New FileSystemObject

Dim nfcInit As Boolean
Dim nfcConnect As Boolean
Dim wkt As Integer
Const INVALID_SW1SW2 = -450

Dim retCode, Protocol, hContext, hCard, ReaderCount As Long
Dim sReaderList As String * 256
Dim sReaderGroup As String
Dim ConnActive, autoDet As Boolean
Dim ioRequest As SCARD_IO_REQUEST
Dim RdrState As SCARD_READERSTATE
Dim SendLen, RecvLen As Long
Dim SendBuff(0 To 255) As Byte
Dim RecvBuff(0 To 255) As Byte


Private Sub SanitizeInit()
    FromChars = Split(FROM_CHARS, "\")
    ToChars = Split(TO_CHARS, "\")
End Sub

Private Function Sanitize(ByVal Arg As String) As String
    'Attempt to "sanitize" argument Arg against SQL Injection errors.
    Dim i As Long
    
    For i = 0 To UBound(FromChars)
        Arg = Replace$(Arg, FromChars(i), ToChars(i))
    Next
    Sanitize = Arg
End Function

Private Sub TerminateProcess(app_exe As String)
    Dim Process As Object
    For Each Process In GetObject("winmgmts:").ExecQuery("Select Name from Win32_Process Where Name = '" & app_exe & "'")
        Process.Terminate
    Next
End Sub

Private Sub Check1_Click()
    If Check1.Value = vbChecked Then
        Timer1.Enabled = True
        SaveTxt "Setting.ini", "NFC", "ON", "1"
    Else
         Timer1.Enabled = False
         SaveTxt "Setting.ini", "NFC", "ON", "0"
    End If
End Sub

Private Sub Form_DblClick()
Call minimize_to_tray
End Sub

Private Sub Form_Initialize()
On Error Resume Next
Dim msg As String
    
    fgdgdfg.Caption = App.Comments
    

'    TerminateProcess ("Desktop ServiceC.exe")
'    TerminateProcess ("Desktop ServiceD.exe")
'    TerminateProcess ("Desktop ServiceE.exe")
    
    GossRESTDB.InitializeDB
    GetGraphicsDllVersion graphicSDKVersion
    
    If graphicSDKVersion <> "" Then
        msg = "Graphics: " & graphicSDKVersion & "; "
    End If
        
    ' Gets printer dll version
    '     and if present enables the magnetic encoding frame
    
    GetPrinterDllVersion prnSDKVersion

    If prnSDKVersion <> "" Then
        msg = msg & "Printer: " & prnSDKVersion & "; "
    End If
    
    ' Displays dll versions
     Label2.ToolTipText = msg
     
     Shell App.Path & "/decimalFormat.bat", vbHide
    
End Sub

Private Sub Form_Load()
'    Call openConnection
    serverBackEnd = GetTxt("Setting.ini", "Koneksi", "f")
    Label1.ToolTipText = StatusCN
    SanitizeInit
'    Set CN = New ADODB.Connection
'    CN.Open GossRESTDB.ConnectionString
'    Set RS = New ADODB.Recordset
'    'Set up as a high-performance server-side cursor with the ability to
'    'be data-bound to an MSHFlexGrid:
'    With RS
'        .CursorLocation = adUseServer
'        .CursorType = adOpenKeyset
'        .LockType = adLockReadOnly
'        .ActiveConnection = CN
'        .Properties("IRowsetIdentity") = True
'    End With
    Set STM = New ADODB.Stream
    
    LogFile = FreeFile(0)
    
    Open UCase(fso.GetDriveName(App.Path)) & "/log.txt" For Append As #LogFile
    Gossamer1.StartListening
    
    'Set Profile RS
    Call openConnection
    
    Dim rsProfile As New ADODB.Recordset
       
    strSQL = "select namaexternal,namapemerintahan, namalengkap, alamatlengkap, fixedphone, faksimile, website, kodepos, alamatemail, namakota from profile_m where  statusenabled='t'"
    
    rsProfile.Open strSQL, CN, adOpenStatic, adLockReadOnly

    
    strNamaRS = rsProfile("namaexternal")
    strNamaLengkapRs = rsProfile("namalengkap")
    strAlamatRS = IIf(IsNull(rsProfile("alamatlengkap")), "-", rsProfile("alamatlengkap"))
    strNoTlpn = "Tlpn. " + IIf(IsNull(rsProfile("fixedphone")), "-", rsProfile("fixedphone"))
    strNoFax = "Fax. " + IIf(IsNull(rsProfile("faksimile")), "-", rsProfile("faksimile"))
    strNamaPemerintah = IIf(IsNull(rsProfile("namapemerintahan")), "-", rsProfile("namapemerintahan"))
    strWebSite = "Website " + IIf(IsNull(rsProfile("website")), "-", rsProfile("website"))
    strKodePos = IIf(IsNull(rsProfile("kodepos")), "-", rsProfile("kodepos"))
    stralmtLengkapRs = strAlamatRS + " " + strKodePos
    strEmail = "Email. " + IIf(IsNull(rsProfile("alamatemail")), "-", rsProfile("alamatemail"))
    strNamaKota = IIf(IsNull(rsProfile("namakota")), "-", rsProfile("namakota"))
    stralmtLengkapRs = strAlamatRS + " Kode Pos : " + strKodePos + " " + strNoTlpn + " " + strNoFax
    
    
    Call autoON_NFC
    
    'Show
    WindowState = vbHide
    Call minimize_to_tray
    If CN.State = adStateOpen Then CN.Close
End Sub

Private Sub autoON_NFC()
On Error GoTo handap
Dim txton As String
   txton = GetTxt("Setting.ini", "NFC", "ON")
    If txton = "1" Then
        Timer1.Enabled = True
         Check1.Value = vbChecked
        
        nfcInit = False
        nfcConnect = False
        Call init_nfc(8)
    Else
         Timer1.Enabled = False
         Check1.Value = vbUnchecked
    End If
    Exit Sub
handap:
    SaveTxt "Setting.ini", "NFC", "ON", "0"
    Timer1.Enabled = False
    Check1.Value = vbUnchecked
End Sub

Private Sub Form_Unload(Cancel As Integer)
    Gossamer1.StopListening
    
    Close #LogFile
    'To Tray
    Shell_NotifyIcon NIM_DELETE, nid
    If CN.State = adStateOpen Then CN.Close
End Sub
Private Sub Form_MouseMove(Button As Integer, Shift As Integer, x As Single, Y As Single)
    Dim msg As Long
    Dim sFilter As String
    
    msg = x / Screen.TwipsPerPixelX
    Select Case msg
        Case WM_LBUTTONDOWN
            Me.Show ' tampilkan form
            Shell_NotifyIcon NIM_DELETE, nid
        Case WM_LBUTTONUP
        
        Case WM_LBUTTONDBLCLK
        
        Case WM_RBUTTONDOWN
        
        Case WM_RBUTTONUP
'            Me.Show
'            Shell_NotifyIcon NIM_DELETE, nid
            PopupMenu mnFile
        Case WM_RBUTTONDBLCLK
    End Select
End Sub

Sub minimize_to_tray()
    Me.Hide
    nid.cbSize = Len(nid)
    nid.hwnd = Me.hwnd
    nid.uId = vbNull
    nid.uFlags = NIF_ICON Or NIF_TIP Or NIF_MESSAGE
    nid.uCallBackMessage = WM_MOUSEMOVE
    nid.hIcon = Me.Icon
    nid.szTip = strNamaRS & vbNullChar
    Shell_NotifyIcon NIM_ADD, nid
End Sub

Private Sub Gossamer1_DynamicRequest( _
    ByVal Method As String, _
    ByVal URI As String, _
    ByVal Params As String, _
    ByVal ReqHeaders As Collection, _
    ByRef RespStatus As Single, _
    ByRef RespStatusText As String, _
    ByRef RespMIME As String, _
    ByRef RespExtraHeaders As String, _
    ByRef RespBody() As Byte, _
    ByVal ClientIndex As Integer)
    On Error Resume Next
    
    Dim ErrNumber As Long
    Dim ErrDescription As String
    'selalu reconnect karena jaringan grhasia ga stabil
    openConnection
    If Method = "GET" Then
        'We'll assume URI = "/query" but we'll take any as "/query" in this program.
        On Error Resume Next

        Dim Itm As Variant
        For Each Itm In ReqHeaders
            Debug.Print Itm(0), Itm(1)
        Next Itm
        urlLengkap = URI
        If URI = "\printvb\query" Then RespBody = Query(Gossamer1.URLDecode(Params))
        If URI = "\printvb\cetak-antrian" Then RespBody = frmCetakAntrian.CetakAntrian(Gossamer1.URLDecode(Params))
        If URI = "\printvb\kasir" Then RespBody = frmKasir.Kasir(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\tata-rekening" Then RespBody = frmTataRekening.TataRekening(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\Pendaftaran" Then RespBody = frmPendaftaran.Pendaftaran(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\farmasiApotik" Then RespBody = frmFarmasiApotik.farmasiApotik(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\laporanPelayanan" Then RespBody = frmLaporanPelayanan.laporanPelayanan(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\formvb\rawat-jalan" Then RespBody = frmRajal.RawatJalan(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\farmasi" Then RespBody = FormFarmasi.Farmasi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\Piutang" Then RespBody = frmPiutang.Piutang(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\akuntansi" Then RespBody = frmAkuntansi.akuntansi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\logistik" Then RespBody = frmLogistik.Logistik(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\simakbmn" Then RespBody = frmSimakBmn.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\rekammedis" Then RespBody = frmRekamMedis.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\sdm" Then RespBody = frmSdm.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\cetak-antrian-online" Then RespBody = frmCetakAntrian.CetakAntrianOnline(Gossamer1.URLDecode(Params))
        If URI = "\printvb\jenazah" Then RespBody = frmJenazah.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\remun" Then RespBody = frmRemun.Remun(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\gizi" Then RespBody = frmGizi.gizi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\e-rekammedis" Then RespBody = frmRekamMedisElektronik.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\bridging" Then RespBody = frmBridging.Fungsi(Gossamer1.URLDecode(Params)) 'XX
        If URI = "\printvb\pmkp" Then RespBody = frmPmkp.pmkp(Gossamer1.URLDecode(Params)) 'XX
       
'        If Err Then
'            ErrNumber = Err.Number
'            ErrDescription = Err.Description
'            On Error GoTo 0
'            RespStatus = 500
'            RespStatusText = "Internal Server Error"
'            Print #LogFile, _
'                  "Error "; _
'                  CStr(ErrNumber); _
'                  " (&H"; Right$("0000000" & Hex$(ErrNumber), 8); ") "; _
'                  ErrDescription
'            Exit Sub
'        End If
'        On Error GoTo 0
        RespStatus = 200
        RespStatusText = "ok"
        RespMIME = "application/json; charset=utf-8"
        RespExtraHeaders = "Allow: GET" & vbCrLf
        RespExtraHeaders = "Status Code: 200"
'        RespExtraHeaders = "Request Method: GET"
'        RespExtraHeaders = "Host: 172.16.16.14:8200"
        
        
    Else
        RespStatus = 405
        RespStatusText = "Method Not Allowed"
        RespExtraHeaders = "Allow: GET" & vbCrLf
        
    End If
End Sub

Private Sub Gossamer1_LogEvent(ByVal GossEvent As GossEvent, ByVal ClientIndex As Integer)
    With GossEvent
        Print #LogFile, _
              Format$(.Timestamp, "YYYY-MM-DD HH:NN:SS, "); _
              CStr(ClientIndex); ", "; _
              ", "; _
              CStr(.EventType); ", "; _
              CStr(.EventSubtype); ", "; _
              .Method; ", "; _
              .IP + ":1237" + Replace(urlLengkap, "\", "/") + .Text
    End With
End Sub
Private Function Query(ByVal QueryText As String) As Byte()
'    Const QUERY_TEMPLATE As String = _
'            "SELECT * FROM [Movies] " _
'          & "WHERE " _
'          & "[Title] = '$1$' OR " _
'          & "[Title] LIKE '$1$[ ,.:?]%' OR " _
'          & "[Title] LIKE '%[ ,.:?]$1$' OR " _
'          & "[Title] LIKE '%[ ,.:?]$1$[ ,.:?]%' OR " _
'          & "[Initials1] = '$2$' OR " _
'          & "[Initials2] = '$2$' " _
'          & "ORDER BY [Title] ASC"
'    Dim ActualQuery As String
    Dim Root As JNode
'    Dim RecordIndex As Long
'    Dim FieldIndex As Long
    
'    If Len(QueryText) = 0 Then
'        'Shouldn't match anything, just get an empty Recordset so
'        'we have the field names for headings:
'        ActualQuery = Replace$(Replace$(QUERY_TEMPLATE, _
'                                        "$2$", _
'                                        vbFormFeed), _
'                               "$1$", _
'                               vbFormFeed)
'    Else
'        ActualQuery = Replace$(Replace$(QUERY_TEMPLATE, _
'                                        "$2$", _
'                                        GossRESTDB.AsInitials(QueryText)), _
'                               "$1$", _
'                               Sanitize(QueryText))
'    End If
'    Debug.Print ActualQuery
'    With RS
'        .Open ActualQuery, , , , adCmdText
'        Set Root = New JNode
'        Root("Perusahaan") = "Jasamedika"
'        Set Root("Pegawai") = New JNode
'        Root("Pegawai")(0) = "Riko"
'        Root("Pegawai")(1) = "Agus"
'        For FieldIndex = 0 To .Fields.Count - 1
'            Root("ColumnNames")(FieldIndex) = .Fields(FieldIndex).Name
'        Next
'        If RS.RecordCount > 0 Then
'            Set Root("Rows") = New JNode
'            Root("Rows").MakeArray
'            Do Until .EOF
'                Set Root("Rows")(RecordIndex) = New JNode
'                Root("Rows")(RecordIndex).MakeArray
'                For FieldIndex = 0 To .Fields.Count - 1
'                    Root("Rows")(RecordIndex).Value(FieldIndex) = .Fields(FieldIndex).Value
'                Next
'                .MoveNext
'                RecordIndex = RecordIndex + 1
'            Loop
'        End If
'        .Close
'    End With

If Len(QueryText) > 0 Then
    
    If QueryText = "cetak" Then
        Set Root = New JNode
        'MsgBox "adasdasd", vbInformation, "CETAK SERVICE"
        Root("Status") = "Sukses Dicetak"
'        Set Root("Pegawai") = New JNode
'        Root("Pegawai")(0) = "Riko"
'        Root("Pegawai")(1) = "Agus"
    Else
        Set Root = New JNode
        Root("Status") = "Error"
    End If
End If
    With STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        Query = .Read(adReadAll)
        .Close
    End With
End Function

Private Sub Image1_DblClick()
Call minimize_to_tray
End Sub

Private Sub Label1_Click()
    Call minimize_to_tray
End Sub

Private Sub LblNFC_DblClick()
    Call init_nfc(8)
End Sub

Private Sub mnuExit_Click()
    Shell_NotifyIcon NIM_DELETE, nid
    End
End Sub

Private Sub mnuKoneksi_Click()
    frmSettingKoneksi.Show vbModal
End Sub

Private Sub mnuSettingPrinter_Click()
    frmSettingPrinter.Show vbModal
End Sub

'    Public LogFile As Integer
'    LogFile = FreeFile(0)
'
'    Open "E:/txt.txt" For Append As #LogFile
'  sql
'    For i = 0 To 100
'        Print #LogFile, "|" & "024040400415582003KD" & "|,|" & "AS@EPIC" & "|,|" & i & " neng ecie|;"
'    Next
'  sql

Private Sub Picture1_Click()

End Sub

Private Sub init_nfc(blok As String)

    Dim Index As Integer
    
    For Index = 0 To 255
        sReaderList = sReaderList & vbNullChar
    Next Index
    
    ReaderCount = 255
    
    'Establish context
    retCode = SCardEstablishContext(SCARD_SCOPE_USER, 0, 0, hContext)
    
    If retCode <> SCARD_S_SUCCESS Then
'        Call DisplayOut(GetScardErrMsg(retCode), 2)
        Exit Sub
    End If
    
    'List readers
    Call cbReader.Clear
    
    retCode = SCardListReaders(hContext, _
                               sReaderGroup, _
                               sReaderList, _
                               ReaderCount)
                               
    If retCode <> SCARD_S_SUCCESS Then
'        Call DisplayOut(GetScardErrMsg(retCode), 2)
        Exit Sub
    End If
    
    'Add readers to combobox control
    Call LoadListToControl(cbReader, sReaderList)
    cbReader.ListIndex = 0
    
    'Set default reader to ACR122 NFC Reader
    For Index = 0 To cbReader.ListIndex - 1
        cbReader.ListIndex = Index
        
        If InStr(cbReader.Text, "ACR122U") > 0 Then
            Exit For
        End If
    Next Index
    
    
    
    
    
    
'    btnInit.Enabled = False
'    btnConnect.Enabled = True
    Sleep 5
    nfcInit = True
        
End Sub

Private Sub connect_NFC()
On Error GoTo hell
    'Connect to reader using a shared connection
    retCode = SCardConnect(hContext, _
                           cbReader.Text, _
                           SCARD_SHARE_SHARED, _
                           SCARD_PROTOCOL_T0 Or SCARD_PROTOCOL_T1, _
                           hCard, _
                           Protocol)
                           
    If retCode <> SCARD_S_SUCCESS Then
'        Call DisplayOut(GetScardErrMsg(retCode), 2)
        'Exit Sub
'        MsgBox "error connect NFC Device! "
         nfcConnect = False
    Else
'        Call DisplayOut("Successful connection to " & cbReader.Text, 1)
        nfcConnect = True
    End If
    
    
    If nfcConnect = True Then
        Sleep 1
        Call autentifikasi_NFC(8)
'        Sleep 1

        Dim sss As String
        sss = read_NFC(9, 16)
        AppActivate "DesktopService", 0
        AppActivate "Chrome", 0
        CreateObject("WScript.Shell").SendKeys sss
    End If
hell:
End Sub

Private Sub autentifikasi_NFC(blok As String)

    Dim tempstr As String
    Dim Index As Integer
    
    'Check if the inputs are correct
'    If tbBlockNo.text = "" Then
'        tbBlockNo.SetFocus
'        Exit Sub
'    ElseIf CInt(tbBlockNo.text) > 319 Then
'        tbBlockNo.text = "319"
'        tbBlockNo.SetFocus
'        Exit Sub
'    End If
'
'    If tbAuthenKeyNum.text = "" Then
'        tbAuthenKeyNum.SetFocus
'        Exit Sub
'    ElseIf CInt("&H" & tbAuthenKeyNum.text) > 1 Then
'        tbAuthenKeyNum.text = "1"
'        Exit Sub
'    End If
            
    Call ClearBuffers
    'Authentication command
    SendBuff(0) = &HFF                          'Class
    SendBuff(1) = &H86                          'INS
    SendBuff(2) = &H0                           'P1
    SendBuff(3) = &H0                           'P2
    SendBuff(4) = &H5                           'Lc
    SendBuff(5) = &H1                           'Byte 1 : Version number
    SendBuff(6) = &H0                           'Byte 2
    SendBuff(7) = CInt(blok)          'Byte 3 : Block number
    
'    If rKeyA.Value = True Then
        SendBuff(8) = &H60                      'Byte 4 : Key Type A
'    ElseIf rKeyB.Value = True Then
'        SendBuff(8) = &H61                      'Byte 4 : Key Type B
'    End If
    
    SendBuff(9) = CInt("&H" & tbAuthenKeyNum.Text) 'Byte 5 : Key number
    
    SendLen = 10
    RecvLen = 2
    
    retCode = SendAPDU
    If retCode <> SCARD_S_SUCCESS Then
        Exit Sub
    Else
        For Index = 0 To RecvLen - 1
            tempstr = tempstr & Right$("00" & Hex(RecvBuff(Index)), 2)
        Next Index
        'Checking for response
'        If tempstr = "9000" Then
'            Call DisplayOut("Authentication success", 1)
'        Else
'            Call DisplayOut("Authentication failed", 2)
'        End If
    End If
    
End Sub
Public Sub ClearBuffers()

    Dim Index As Integer
    
    For Index = 0 To 255
        RecvBuff(Index) = &H0
        SendBuff(Index) = &H0
    Next Index
    
End Sub
Public Function SendAPDU()

    Dim Index As Integer
    Dim tempstr As String
    
    ioRequest.dwProtocol = Protocol
    ioRequest.cbPciLength = Len(ioRequest)
    
    tempstr = ""
    
    For Index = 0 To SendLen - 1
        tempstr = tempstr & Right$("00" & Hex(SendBuff(Index)), 2) & " "
    Next Index
    
'    Call DisplayOut(tempstr, 3)
    
    retCode = SCardTransmit(hCard, _
                            ioRequest, _
                            SendBuff(0), _
                            SendLen, _
                            ioRequest, _
                            RecvBuff(0), _
                            RecvLen)
                            
    If retCode <> SCARD_S_SUCCESS Then
'        Call DisplayOut(GetScardErrMsg(retCode), 2)
        SendAPDU = retCode
        Exit Function
    End If
    
    tempstr = ""
    
    For Index = 0 To RecvLen - 1
        tempstr = tempstr & Right$("00" & Hex(RecvBuff(Index)), 2) & " "
    Next Index
    
'    Call DisplayOut(tempstr, 4)
    
    SendAPDU = retCode
    
End Function

Function read_NFC(blockNo As String, lengthData As String) As String

    Dim Index As Integer
    Dim tempstr As String
    
'    If tbBinaryBlockNo.Text = "" Then
'        tbBinaryBlockNo.SetFocus
'        Exit Sub
'    ElseIf CInt(tbBlockNo.Text) > 319 Then
'        tbBlockNo.Text = "319"
'        tbBlockNo.SetFocus
'        Exit Sub
'    End If
    
'    If tbLen.Text = "" Then
'        tbLen.SetFocus
'        Exit Sub
'    ElseIf CInt(tbLen.Text) > 16 Then
'        tbLen.Text = "16"
'        tbLen.SetFocus
'        Exit Sub
'    End If
    
    Call ClearBuffers
    'Read Binary Block command
    SendBuff(0) = &HFF                              'Class
    SendBuff(1) = &HB0                              'INS
    SendBuff(2) = &H0                               'P1
    SendBuff(3) = CInt("&H" & blockNo) 'P2 : Block number
    SendBuff(4) = CInt(lengthData)                  'Le : Number of bytes to read
    
    SendLen = 5
    RecvLen = CInt(lengthData) + 2
    
    retCode = SendAPDU
    If retCode <> SCARD_S_SUCCESS Then
        Exit Function
    Else
        For Index = RecvLen - 2 To RecvLen - 1
            tempstr = tempstr & Right$("00" & Hex(RecvBuff(Index)), 2)
        Next Index
        'Check for response
        If tempstr = "9000" Then
            tempstr = ""
            For Index = 0 To RecvLen - 3
                tempstr = tempstr & Right$(Chr(RecvBuff(Index)), 2)
            Next Index
        Else
'            Call DisplayOut("Read block error!", 2)
        End If
    End If
    Dim arr() As String
    arr = Split(tempstr, "~")
    read_NFC = arr(0)
End Function

Private Sub write_NFC(blockNo As String, lengthData As String, textInput As String)

    Dim Index As Integer
    Dim tempstr As String
    
'    If tbBinaryBlockNo.text = "" Then
'        tbBinaryBlockNo.SetFocus
'        Exit Sub
'    ElseIf CInt(tbBlockNo.text) > 319 Then
'        tbBlockNo.text = "319"
'        tbBlockNo.SetFocus
'        Exit Sub
'    End If
'
'    If tbLen.text = "" Then
'        tbLen.SetFocus
'        Exit Sub
'    ElseIf CInt(tbLen.text) > 16 Then
'        tbLen.text = "16"
'        tbLen.SetFocus
'        Exit Sub
'    End If
'
'    If CInt(tbLen.text) > 0 And tbData.text = "" Then
'        tbData.SetFocus
'        Exit Sub
'    End If
    
    Call ClearBuffers
    'Update Binary Block command
    SendBuff(0) = &HFF                              'Class
    SendBuff(1) = &HD6                              'INS
    SendBuff(2) = &H0                               'P1
    SendBuff(3) = CInt(blockNo)        'P2 : Block Number
    SendBuff(4) = CInt(lengthData)                  'Lc
    
    For Index = 0 To Len(textInput) - 1
        SendBuff(Index + 5) = Asc(Mid(textInput, Index + 1, 1)) 'Data In
    Next Index
    
    SendLen = SendBuff(4) + 5 'CInt(tbLen.Text) + 5
    RecvLen = 2
    
    retCode = SendAPDU
    If retCode <> SCARD_S_SUCCESS Then
        Exit Sub
    Else
        For Index = RecvLen - 2 To RecvLen - 1
            tempstr = tempstr & Right$("00" & Hex(RecvBuff(Index)), 2)
        Next Index
        'Check for response
        If tempstr = "9000" Then
'            tbData.text = ""
        Else
'            Call DisplayOut("Update block error!", 2)
        End If
    End If
    
End Sub

Private Sub Sleep(ByVal HowLong As Date)
    Dim endDate As Date
    endDate = DateAdd("s", HowLong, Now)
    While endDate > Now
        DoEvents
    Wend
End Sub

Private Sub Timer1_Timer()
Dim stts As String
    If nfcInit = True Then
        stts = SCardStatus(hCard, cbReader.Text, 0, 0, 0, 0, 0)
        
        If stts = "0" Then
'            retCode = SCardDisconnect(hCard, SCARD_UNPOWER_CARD)
            nfcConnect = True
        Else
            nfcConnect = False
        End If
        If nfcConnect = False Then
            Call connect_NFC
'            retCode = SCardDisconnect(hCard, SCARD_UNPOWER_CARD)
'            nfcConnect = False
        End If
        
'        wkt = wkt + 1
'        If wkt Mod 3 = 0 Then
'            retCode = SCardDisconnect(hCard, SCARD_UNPOWER_CARD)
''            retCode = SCardReleaseContext(hContext)
'            nfcConnect = False
''            nfcInit = False
''            Call init_nfc(8)
''            wkt = 0
'        End If
        
'        If wkt > 10 Then
'            retCode = SCardDisconnect(hCard, SCARD_UNPOWER_CARD)
'            retCode = SCardReleaseContext(hContext)
''            nfcConnect = False
'            nfcInit = False
'            Call init_nfc(8)
'            wkt = 0
'        End If
    Else
        Call init_nfc(8)
    End If
    If nfcInit = True Then
        LblNFC.ForeColor = vbGreen
    Else
        LblNFC.ForeColor = vbRed
    End If
    If nfcConnect = True Then
        lblmc.ForeColor = vbGreen
    Else
        lblmc.ForeColor = vbRed
    End If
End Sub


