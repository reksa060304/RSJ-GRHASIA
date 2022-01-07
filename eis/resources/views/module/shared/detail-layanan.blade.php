<div class="table-responsive" style="height: 450px">

        <table id="tbl2" class="table  table-striped table-sm table-styling"
        style="width:100%">
        <thead class="table-default">
            <tr>
                <th style="color:black;width: 10%">No </th>
                <th style="color:black">Tgl  </th>
                <th style="color:black">Nama Layanan </th>
                <th style="color:black">No RM  </th>
                <th style="color:black">Nama Pasien </th>
                <th style="color:black">Tarif  </th>
                <th style="color:black">Jumlah  </th>
                <th style="color:black">Sub Total  </th>
            </tr>
            </thead>
        <tbody>
         @php
            $total = 0;
         @endphp
        @foreach($data as $key => $d)
             @php
                $total = $total + (float) $d->totall;
            @endphp
            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $d->tglpelayanan }}</td>
                <td>{{ $d->layanan }}</td>
                <td>{{ $d->nocm }}</td>
                <td>{{ $d->namapasien }}</td>
                <td  style="text-align:right">{{App\Http\Controllers\MainController::formatRp($d->tariff)}}</td>
                <td>{{ $d->count }}</td>
                <td  style="text-align:right">{{App\Http\Controllers\MainController::formatRp($d->totall)}}</td>
             
            </tr>

        @endforeach

        </tbody>
        <tfoot>
            <tr>
                <th style="color:black;font-weight:bold;" colspan="7">TOTAL </th>
                <th style="color:black;font-weight:bold;text-align:right">{{App\Http\Controllers\MainController::formatRp($total)}} </th>
            </tr>
        </tfoot>
    </table>
</div>
<script type="text/javascript">
    $(function(){
        $("#tbl2").dataTable();
    });
</script>
