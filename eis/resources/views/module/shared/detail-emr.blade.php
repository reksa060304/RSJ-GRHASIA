<div class="table-responsive" style="height: 450px">

    <table id="tblxxx" class="table  table-striped table-sm table-styling"
    style="width:100%">
    <thead class="table-default">
        <tr>
            <th style="color:black;width: 10%">No </th>
            <th style="color:black">Tgl EMR </th>
            <th style="color:black">No EMR </th>      
            <th style="color:black">Nama EMR </th>
            <th style="color:black">Nama Pasien </th>
            
        
        </tr>
        </thead>
    <tbody>
     @php
        $total = 0;
     @endphp
    @foreach($data as $key => $d)
         @php
            //$total = $total + (float) $d->totall;
        @endphp
        <tr>
            <td>{{ $key + 1 }}</td>
            <td>{{ $d->tglemr }}</td>
            <td>{{ $d->noemr }}</td>           
            <td>{{ $d->caption }}</td>
            <td>{{ $d->namapasien }}</td>
            {{-- <td  style="text-align:right">{{App\Http\Controllers\MainController::formatRp($d->tariff)}}</td>
            <td>{{ $d->count }}</td>
            <td  style="text-align:right">{{App\Http\Controllers\MainController::formatRp($d->totall)}}</td> --}}
         
        </tr>

    @endforeach

    </tbody>
    {{-- <tfoot>
        <tr>
            <th style="color:black;font-weight:bold;" colspan="7">TOTAL </th>
            <th style="color:black;font-weight:bold;text-align:right">{{App\Http\Controllers\MainController::formatRp($total)}} </th>
        </tr>
    </tfoot> --}}
</table>
</div>
<script type="text/javascript">
$(function(){
    $("#tblxxx").dataTable();
});
</script>
