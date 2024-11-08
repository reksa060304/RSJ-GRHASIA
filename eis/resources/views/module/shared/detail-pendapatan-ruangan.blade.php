<div class="table-responsive" style="height: 450px">
    <table class="table  table-striped table-sm table-styling" id="tbl" style="width:100%">
        <thead>
        <tr class="table-inverse">
            <th>No </th>
            <th>Ruangan </th>
            <th>Total  </th>
        </tr>
        </thead>
        <tbody>

            @php
            $total =0;
            @endphp
        @foreach($data as $key => $d)
        @php
        $total =(float)$d->total +$total;
        @endphp
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $d->namaruangan }}</td>
                    <td>{{App\Http\Controllers\MainController::formatRp($d->total)}}</td>
                </tr>
        @endforeach
        <tr style="background:rgba(0,0,0,.3);">
            <td colspan="2">TOTAL</td>
            <td style="text-align: right">{{App\Http\Controllers\MainController::formatRp($total)}}</td>
        </tr>
        </tbody>
    </table>
</div>
<script type="text/javascript">
    $(function(){
        $("#tbl").dataTable();
    });
</script>
