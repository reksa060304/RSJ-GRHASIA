@extends('report.print')
@section('content')
    <center>
        <br><br>
        <a href="{{ url('/service/medifirst2000/report/prnpriview') }}" class="btnprn btn">Print Preview</a></center>
    <script type="text/javascript">
        $(document).ready(function(){
            $('.btnprn').printPage();
        });
    </script>
    <center>
        <h1> Pasien List </h1>
        <table class="table" >
            <tr>
                <th>Norm</th>
                <th>Nama Pasien</th>
            </tr>
            @foreach($students as $student)
                <tr>
                    <td>{{ $student->nocm }}</td>
                    <td>{{ $student->namapasien }}</td>
                </tr>
        </table>
        @endforeach
    </center>
@endsection