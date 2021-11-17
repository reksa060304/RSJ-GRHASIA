<html>
<head>
    <title>
       {!! $sk->nosurat .' ' .$sk->namasurat !!}
    </title>

</head>
<style>

</style>
<!--  -->
<body style="margin: 0">
<embed src="{{ $sourcePdf }}"  style="width:100%; height:100%;" frameborder="0">
</body>
</html>
