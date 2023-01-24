<div class="table-responsive" style="height: 450px">
    <table class="table  table-striped table-sm table-styling" id="tbl2" style="width:100%">
        <thead>
        <tr class="table-default">
            <th>No </th>
            <th>NIP </th>
            <th>Nama Lengkap </th>
            <th>Pangkat & Golongan </th>
            <th>Jabatan Fungsional </th>
            <th>Jabatan Struktural </th>
        </tr>
        </thead>
        <tbody>

        @foreach($data as $key => $d)

            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $d->nip }}</td>
                <td>{{ $d->namalengkap }}</td>
                <td>{{ $d->golongan }}</td>
                <td>{{ $d->jbfungsional }}</td>
                <td>{{ $d->jbstruktural }}</td>
            </tr>

        @endforeach

        </tbody>
    </table>
</div>
<script type="text/javascript">
    $(function(){
        $("#tbl2").dataTable();
    });
</script>
