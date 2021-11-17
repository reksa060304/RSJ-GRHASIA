@extends('report.print')
@section('content')
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
