VERSION 5.00
Begin VB.Form frmRekamMedisElektronik 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "Elektronik RekamMedis"
   ClientHeight    =   960
   ClientLeft      =   45
   ClientTop       =   375
   ClientWidth     =   5040
   Icon            =   "frmRekamMedisElektronik.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MinButton       =   0   'False
   ScaleHeight     =   960
   ScaleWidth      =   5040
   StartUpPosition =   3  'Windows Default
End
Attribute VB_Name = "frmRekamMedisElektronik"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Public Function Fungsi(ByVal QueryText As String) As Byte()
    On Error Resume Next
    Dim Root As JNode
    Dim Param1() As String
    Dim Param2() As String
    Dim Param3() As String
    Dim Param4() As String
    Dim Param5() As String
    Dim arrItem() As String
   
    If CN.State = adStateClosed Then Call openConnection
        
    If Len(QueryText) > 0 Then
        arrItem = Split(QueryText, "&")
        Param1 = Split(arrItem(0), "=")
        Param2 = Split(arrItem(1), "=")
        Param3 = Split(arrItem(2), "=")
        Param4 = Split(arrItem(3), "=")
        Param5 = Split(arrItem(4), "=")
        
        Select Case Param1(0)

            Case "cek-konek"
                Set Root = New JNode
                Root("Status") = "Ok!!"

            Case "cetak-tindakan-anastersi-Umum"
                Call frmCetakTindakanAnastesiUmum.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-anastersi-Umum&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"

            Case "cetak-tindakan-fiksasi-mekanik"
                Call frmCetakTindakanFiksasi.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-fiksasi-mekanik&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-injeksi"
                Call frmCetakTindakanInjeksi.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-injeksi&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-ECT"
                Call frmCetakTindakanECT.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-ECT&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                           
            Case "cetak-surat-pernyataan-penolakan"
                Call frmCetakSuratPernyataanPenolakan.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-pernyataan-penolakan&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                           
            Case "cetak-pemberian-informasi"
                Call frmCetakPemberianInformasi.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-pemberian-informasi&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                                   
            Case "cetak-barang-milik-pasien"
                Call frmCetakSuratBarangMilikPasien.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-barang-milik-pasien&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-kebutuhan-rencana-pulang"
                Call frmCetakKebutuhanRencanaPulang.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-kebutuhan-rencana-pulang&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-infus"
                Call frmCetakTindakanInfus.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-infus&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-tindakan-kateter"
                Call frmCetakTindakanKateter.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-tindakan-kateter&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
             Case "cetak-surat-permintaan-ri"
                Call frmCetakSuratPermintaanRawatInap.cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-surat-permintaan-ri&id=048792&emr=b1275960-1a9d-11ea-9c77-5f6e48d8&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
           
             Case "cetak-emr-asesmen-gd"
                Call frmCetakEmrAsesmenMedisGadar.cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-gd&id=035221&emr=34bc5f00-1a8a-11ea-a8df-3353a270&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
           
             Case "cetak-emr-asesmen-rj"
                Call frmCetakEmrAsesmenMedisRaJal.cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-rj&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
             Case "cetak-emr-asesmen-keperawatan-jiwa-anakremaja-rj"
                Call frmCetakEmrAsesmenKeperawatanJiwaARRaJal.cetak(Param2(1), Param3(1), Param4(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-asesmen-keperawatan-jiwa-anakremaja-rj&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-emr-hasilrad"
                Call frmCetakEmrHasilRad.cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-emr-hasilrad&id=051804&emr=5fd2af30-1e48-11ea-bb29-13774045&view=true&idemr=373
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
            Case "cetak-Keterangan-sehat"
                Call frmCetakSuratIstirahat.cetak(Param2(1), Param3(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-barang-milik-pasien&id=341928&view=true
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
            Case "cetak-spk-lab"
                Call frmCetakBuktiOrderLab.cetak(Param2(1), Param3(1), Param4(1), Param5(1))
                'http://127.0.0.1:1237/printvb/e-rekammedis?cetak-spk-lab&norec=:norecso&view=true&strIdPegawai=:idPegawai
                Set Root = New JNode
                Root("Status") = "Sedang Dicetak!!"
                Root("by") = "grh@epic"
                
           Case Else
                Set Root = New JNode
                Root("Status") = "Error"


        End Select

       
        
    End If
    
    With GossRESTMain.STM
        .Open
        .Type = adTypeText
        .CharSet = "utf-8"
        .WriteText Root.JSON, adWriteChar
        .Position = 0
        .Type = adTypeBinary
        farmasiApotik = .Read(adReadAll)
        .Close
    End With
    If CN.State = adStateOpen Then CN.Close
    Unload Me
    Exit Function
errLoad:
End Function


