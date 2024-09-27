<div class="table-responsive" style="height: 450px">
    <table class="table  table-striped table-sm table-styling" id="tbl" style="width:100%">
        <thead>
        <tr class="table-inverse">
            <th>No </th>
            <th>Ruangan </th>
            <th>Total pasien </th>
        </tr>
        </thead>
        <tbody>

        @foreach($data as $key => $d)
                <tr>
                    <td>{{ $key + 1 }}</td>
                    <td>{{ $d->namaruangan }}</td>
                    <td>{{ $d->total }}</td>
                </tr>
        @endforeach
        </tbody>
    </table>
</div>
<script type="text/javascript">
    $(function(){
        $("#tbl").dataTable();
    });
</script>
