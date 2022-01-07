VERSION 5.00
Begin {BD4B4E61-F7B8-11D0-964D-00A0C9273C2A} Cr_cetakBuktiStrukNonLayanan 
   ClientHeight    =   9360
   ClientLeft      =   0
   ClientTop       =   0
   ClientWidth     =   15780
   OleObjectBlob   =   "Cr_cetakBuktiStrukNonLayanan.dsx":0000
End
Attribute VB_Name = "Cr_cetakBuktiStrukNonLayanan"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
'Private Sub Section6_Format(ByVal pFormattingInfo As Object)
'    Dim x As Double
'    x = ucTotal.Value ''Round(ucJumlahBill.Value)
'    'txtPembulatan.SetText Format(x, "##,##0.00")
'    txtTerbilang.SetText "# " & TerbilangDesimal(x) & " #"
'End Sub
Private Sub Section6_Format(ByVal pFormattingInfo As Object)
    Dim x As Double
    x = ucTotal.Value
    txtTotalTagihan.SetText Format(x, "##,##0.#0")
    txtTerbilang.SetText "# " & TerbilangDesimal(txtTotalTagihan.Text) & " #"
End Sub
