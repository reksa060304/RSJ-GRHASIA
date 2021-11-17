<?php
namespace App\Traits;

//use Illuminate\Http\Request;
use App\Master\LoginUser;
use App\Master\SettingDataFixed;
use App\Transaksi\SeqNumberSurat;
use App\Master\Pasien;
use Carbon\Carbon;
use DB;
use App\Transaksi\SeqNumber;
use Illuminate\Http\Request;
Trait Valet {
    protected function generateCodeBySeqTable($objectModel, $atrribute, $length=8, $prefix='',$idProfile){
        DB::beginTransaction();
        try {
            $result = SeqNumber::where('seqnumber', 'LIKE', $prefix.'%')
                ->where('seqname',$atrribute)
                ->where('kdprofile',$idProfile)
                ->max('seqnumber');
            $prefixLen = strlen($prefix);
            $subPrefix = substr(trim($result),$prefixLen);
            $SN = $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));

            $newSN = new SeqNumber();
            $newSN->kdprofile = $idProfile;
            $newSN->seqnumber = $SN;
            $newSN->tgljamseq = date('Y-m-d H:i:s');;
            $newSN->seqname = $atrribute;
            $newSN->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            return $SN;
        } else {
            DB::rollBack();
            return '';
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }
    protected function generateCode($objectModel, $atrribute, $length=8, $prefix='',$idProfile){
        $result = $objectModel->where($atrribute, 'LIKE', $prefix.'%')->where('kdprofile',$idProfile)->max($atrribute);
        $prefixLen = strlen($prefix);
        $subPrefix = substr(trim($result),$prefixLen);
        return $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));
    }

    protected function generateCodeDibelakang($objectModel, $atrribute, $length=8, $prefix=''){
        $result = $objectModel->where($atrribute, 'LIKE', '%'.$prefix)->max($atrribute);
        $prefixLen = strlen($prefix);
        $subPrefix = substr(trim($result),$prefixLen);
        return (str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT)).$prefix;
    }

    protected function generateCode2($objectModel, $atrribute, $length=0, $prefix=''){
        $result = $objectModel->where($atrribute, 'LIKE', $prefix.'%')->max($atrribute);
        $prefixLen = strlen($prefix);
        $subPrefix = substr(trim($result),$prefixLen);
        return $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));
    }

    protected function getCountArray($objectArr){
        $counting =0 ;
        foreach ($objectArr as $hint){
            $counting = $counting +1 ;
        }
        return $counting;
    }

    protected function getSequence($name='hibernate_sequence'){
        $result=null;
        if(\DB::connection()->getName() == 'pgsql'){
            $next_id = \DB::select("select nextval('".$name."')");
            $result = $next_id['0']->nextval;
        }
        return $result;
    }

    protected function getDateTime(){
        return Carbon::now();
    }

    protected function terbilang($number){
            $x = abs($number);
            $angka = array("", "satu", "dua", "tiga", "empat", "lima",
                "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas");
            $temp = "";
            if ($number <12) {
                $temp = " ". $angka[$number];
            } else if ($number <20) {
                $temp = $this->terbilang($number - 10). " belas";
            } else if ($number <100) {
                $temp = $this->terbilang($number/10)." puluh". $this->terbilang($number % 10);
            } else if ($number <200) {
                $temp = " seratus" . $this->terbilang($number - 100);
            } else if ($number <1000) {
                $temp = $this->terbilang($number/100) . " ratus" . $this->terbilang($number % 100);
            } else if ($number <2000) {
                $temp = " seribu" . $this->terbilang($number - 1000);
            } else if ($number <1000000) {
                $temp = $this->terbilang($number/1000) . " ribu" . $this->terbilang($number % 1000);
            } else if ($number <1000000000) {
                $temp = $this->terbilang($number/1000000) . " juta" . $this->terbilang($number % 1000000);
            } else if ($number <1000000000000) {
                $temp = $this->terbilang($number/1000000000) . " milyar" . $this->terbilang(fmod($number,1000000000));
            } else if ($number <1000000000000000) {
                $temp = $this->terbilang($number/1000000000000) . " trilyun" . $this->terbilang(fmod($number,1000000000000));
            }
            return $temp;
    }

    protected function makeTerbilang($number, $prefix=' rupiah', $suffix=''){
        if($number<0) {
            $hasil = "negatif ". trim($this->terbilang($number));
        } else {
            $hasil = trim($this->terbilang($number));
        }
        return $suffix.$hasil.$prefix;
    }

    public function getMoneyFormatString($number){
        return number_format($number,2,",",".");
    }

    public function getQtyFormatString($number){
        return str_replace(',00', '',number_format($number,2,",","."));
    }

    public function getDateReport($objectCarbonDate){
        $tahun=$objectCarbonDate->year;
        $bulan=$objectCarbonDate->month;
        $tanggal=$objectCarbonDate->day;
        $labelBulan = array('', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des');
        return $tanggal." ".$labelBulan[$bulan]." ".$tahun;
    }

    public function getDateTimeReport($objectCarbonDate){
        $dateString = $this->getDateReport($objectCarbonDate);
        return $dateString." ".$objectCarbonDate->hour.":".$objectCarbonDate->minute.":".$objectCarbonDate->second;
    }

    public function getBiayaMaterai($total){
        $biayaMaterai = 0;
        if($total > 1000000.99 ){
            $biayaMaterai =6000;
        }elseif($total > 500000.99){
            $biayaMaterai = 3000;
        }
        return $biayaMaterai;
    }

    public function hitungUmur($params){
            $tahun=(int)date('Y', strtotime($params));
            $bulan=(int)date('m', strtotime($params));
            $tanggal=(int)date('d', strtotime($params));
            $selisih_bulan=0;
            $selisih_tahun=0;

            $selisih_tanggal = (int)date('d')-$tanggal;
            if($selisih_tanggal<0){
                $selisih_bulan--;
                $selisih_tanggal+= 30;
            }

            $selisih_bulan += (int)date('m')-$bulan;
            if($selisih_bulan<0){
                $selisih_tahun--;
                $selisih_bulan += 12;
            }


            $selisih_tahun += (int)date('Y') - $tahun;
            $result = "";
            if($selisih_tahun>0){
                $result = abs($selisih_tahun).' Tahun, ';
            }
            if($selisih_bulan>0){
                $result .= abs($selisih_bulan).' Bulan, ';
            }
            if($selisih_tanggal>0){
                $result .= abs($selisih_tanggal).' Hari. ';
            }

            return $result;
    }

    protected function subDateTime($string){
        return substr($string, 0, 19);
    }

    protected function isPasienRawatInap($pasienDaftar){
        if($pasienDaftar->objectruanganlastfk!=null){
            if((int)$pasienDaftar->ruangan->objectdepartemenfk==16){
                return true;
            }
        }
        return false;
    }
    protected function isPasienRawatInap2($pasienDaftar){
        if($pasienDaftar->objectruanganlastfk!=null){
            if((int)$pasienDaftar->objectdepartemenfk==16){
                return true;
            }
        }
        return false;
    }

    protected function KonDecRomawi($angka)
    {
        $hsl = "";
        if ($angka == 1) {
            $hsl='I';
        };
        if ($angka == 2) {
            $hsl='II';
        };
        if ($angka == 3) {
            $hsl='III';
        };
        if ($angka == 4) {
            $hsl='IV';
        };
        if ($angka == 5) {
            $hsl='V';
        };
        if ($angka == 6) {
            $hsl='VI';
        };
        if ($angka == 7) {
            $hsl='VII';
        };
        if ($angka == 8) {
            $hsl='VIII';
        };
        if ($angka == 9) {
            $hsl='IX';
        };
        if ($angka == 10) {
            $hsl='X';
        };
        if ($angka == 11) {
            $hsl='XI';
        };
        if ($angka == 12) {
            $hsl='XII';
        };
        return ($hsl);
    }

    protected function genCode2($objectModel, $atrribute, $length=4, $prefix=''){

        $result = $objectModel->where($atrribute, 'LIKE', '%'.'/RSM/'.'%')->max($atrribute);
        $bln2 = Carbon::now()->format('Y/m');
        $a=substr(trim($result),0,7);

        if($a!=$bln2){
            $subPrefix = '000';
        }else{
            $subPrefix = substr(trim($result),8,11);
        }
        $prefixLen = strlen($prefix);


        return $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));
    }

    public function settingDataFixed($NamaField, $KdProfile){
        $Query = DB::table('settingdatafixed_m')
            ->where('namafield', '=', $NamaField);
        if($KdProfile){
            $Query->where('kdprofile', '=', $KdProfile);
        }
        $settingDataFixed = $Query->first();
        if(!empty($settingDataFixed)){
            return $settingDataFixed->nilaifield;
        }else{
            return null;
        }
    }

    public function getAge($tgllahir,$now){
        $datetime = new \DateTime(date($tgllahir));
        return $datetime->diff(new \DateTime($now))
            ->format('%ythn %mbln %dhr');
    }

    public function getDataKdProfile(Request $request){
        $dataLogin = $request->all();
        $idUser = $dataLogin['userData']['id'];
        $data = LoginUser::where('id', $idUser)->first();
       if(!empty($data)){
            $idKdProfile = (int)$data->kdprofile;
            $Query = DB::table('profile_m')
                ->where('id', '=', $idKdProfile)
                ->first();
            $Profile = $Query;
            return (int)$Profile->id;
        }else{
            $data = Pasien::where('id', $idUser)->first();
            if(!empty($data)){
                $idKdProfile = (int)$data->kdprofile;
                $Query = DB::table('profile_m')
                    ->where('id', '=', $idKdProfile)
                    ->first();
                $Profile = $Query;
                return (int)$Profile->id;
            }else{
                return null;
            }

        }
    }
    public static  function getDateIndo($date2) { // fungsi atau method untuk mengubah tanggal ke format indonesia
        // variabel BulanIndo merupakan variabel array yang menyimpan nama-nama bulan
        $BulanIndo2 = array("Januari", "Februari", "Maret",
            "April", "Mei", "Juni",
            "Juli", "Agustus", "September",
            "Oktober", "November", "Desember");

        $tahun2 = substr($date2, 0, 4); // memisahkan format tahun menggunakan substring
        $bulan2 = substr($date2, 5, 2); // memisahkan format bulan menggunakan substring
        $tgl2   = substr($date2, 8, 2); // memisahkan format tanggal menggunakan substring

        $result = $tgl2 . " " . $BulanIndo2[(int)$bulan2-1] . " ". $tahun2;
        return($result);
    }
    protected function sendBridgingCurl($headers , $dataJsonSend = null, $url,$method,$tipe = null){
        $curl = curl_init();
        if($dataJsonSend == null){
            curl_setopt_array($curl, array(
                CURLOPT_URL=> $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_HTTPHEADER => $headers
            ));
        }else{
            curl_setopt_array($curl, array(
                CURLOPT_URL=> $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => "",
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_SSL_VERIFYHOST => 0,
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_POSTFIELDS => $dataJsonSend,
                CURLOPT_HTTPHEADER => $headers
            ));
        }

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            // return $this->setStatusCode(500)->respond([], $err);
            $result = "Terjadi Kesalahan #:" . $err;
        } else {
                if ($this->isJson($response)) {
                    $result = json_decode($response);
                } else {
                    $result = $response;
                }
        }
        return $result ;
    }
    function isJson($string)
    {
        json_decode($string);
        return json_last_error() === JSON_ERROR_NONE;
    }
    public static function getRomawi($angka)
    {
        $hsl = "";
        if ($angka == 1) {
            $hsl='I';
        };
        if ($angka == 2) {
            $hsl='II';
        };
        if ($angka == 3) {
            $hsl='III';
        };
        if ($angka == 4) {
            $hsl='IV';
        };
        if ($angka == 5) {
            $hsl='V';
        };
        if ($angka == 6) {
            $hsl='VI';
        };
        if ($angka == 7) {
            $hsl='VII';
        };
        if ($angka == 8) {
            $hsl='VIII';
        };
        if ($angka == 9) {
            $hsl='IX';
        };
        if ($angka == 10) {
            $hsl='X';
        };
        if ($angka == 11) {
            $hsl='XI';
        };
        if ($angka == 12) {
            $hsl='XII';
        };
        return ($hsl);
    }
    public  function hari_ini($date){
         $hari = date("D",strtotime($date));
         
         switch($hari){
             case 'Sun':
             $hari_ini = "Minggu";
             break;
             
             case 'Mon': 
             $hari_ini = "Senin";
             break;
             
             case 'Tue':
             $hari_ini = "Selasa";
             break;
             
             case 'Wed':
             $hari_ini = "Rabu";
             break;
             
             case 'Thu':
             $hari_ini = "Kamis";
             break;
             
             case 'Fri':
             $hari_ini = "Jumat";
             break;
             
             case 'Sat':
             $hari_ini = "Sabtu";
             break;
             
             default:
             $hari_ini = "Tidak di ketahui"; 
             break;
         }
         
         return "" . $hari_ini . "";
         
        }

    public function PasscodeAuthorization($NamaAutorisasi, $KdProfile){
        $Query = DB::table('passwordautorisasi_s')
            ->where('namaautorisasi', '=', $NamaAutorisasi);
        if($KdProfile){
            $Query->where('kdprofile', '=', $KdProfile);
        }
        $PasscodeAuthorization = $Query->first();
        if(!empty($PasscodeAuthorization)){
            return $PasscodeAuthorization->namaautorisasi;
        }else{
            return null;
        }
    }
     public function getKdProfilePasien(Request $request){
        $dataLogin = $request->all();
        $idUser = $dataLogin['userData']['id'];
        $data = Pasien::where('id', $idUser)->first();
        $idKdProfile = (int)$data->kdprofile;
        $Query = DB::table('profile_m')
            ->where('id', '=', $idKdProfile)
            ->first();
        $Profile = $Query;
        if(!empty($Profile)){
            return (int)$Profile->id;
        }else{
            return null;
        }
    }

    protected function generateCodeBySeqSuratTable($objectModel, $atrribute, $prefix, $dat, $idProfile, $length=4){
        DB::beginTransaction();
        try {
            $result = SeqNumberSurat::where('seqnumber', 'ILIKE', $prefix.'%')
                ->where('kdjenissuratfk', $dat['jenissurat'])
                ->where('seqname', $atrribute)
                ->where('kdprofile', $idProfile);
            if (isset($dat['deptid'])){
                $result = $result->where('departemenfk',$dat['deptid']);
            }
            if (isset($dat['subjenissurat'])){
                $result = $result->where('kdsubjenissuratfk', $dat['subjenissurat']);
            }
            $result = $result->max('seqnumber');
            $nomor = "0000";
            if (isset($result) && $result != ""){
                $nomor = $result;
            }

//            $prefixLen = strlen($prefix);
//            $subPrefix = substr(trim($result),$prefixLen-1);
//            $SN = $prefix.(str_pad((int)$subPrefix+1, $length-$prefixLen, "0", STR_PAD_LEFT));
            $no = 0;
            $SN = "";
            if (substr(trim($nomor),0,3) == "000"){
                $no = substr(trim($nomor),3)+1;
                $SN = substr(trim($nomor),0,3).$no;
            }elseif (substr(trim($nomor),0,2) == "00"){
                $no = substr(trim($nomor),2)+1;
                $SN = substr(trim($nomor),0,2) .$no;
            }elseif (substr(trim($nomor),0,1) == "0" && substr(trim($nomor),0,2) != "00"){
                $no = substr(trim($nomor),1)+1;
                $SN = substr(trim($nomor),0,1) .$no;
            }
            $newSN = new SeqNumberSurat();
            $newSN->kdprofile = $idProfile;
            $newSN->seqnumber = $SN;
            $newSN->kdjenissuratfk = $dat['jenissurat'];
            if (isset($dat['subjenissurat'])){
                $newSN->kdsubjenissuratfk = $dat['subjenissurat'];
            }
            if (isset($dat['subjenissurat']) && $dat['subjenissurat'] != "19"){
                if (isset($dat['deptid'])){
                    $newSN->departemenfk = $dat['deptid'];
                }
            }
            $newSN->tgljamseq = date('Y-m-d H:i:s');;
            $newSN->seqname = $atrribute;
            $newSN->save();

            $transStatus = 'true';
        } catch (\Exception $e) {
            $transStatus = 'false';
        }

        if ($transStatus == 'true') {
            DB::commit();
            return $SN;
        } else {
            DB::rollBack();
            return '';
        }

        return $this->setStatusCode($result['status'])->respond($result, $transMessage);
    }

    protected function getUrlBios()
    {
        $set = 'http://training-bios2.kemenkeu.go.id/api/';
        return $set;
    }
    protected function getSatker()
    {
        $set = '648261';
        return $set;
    }
    protected function getPasswordConsumerBios()
    {
        $set = 'ueyX84m1MZdSESlc3Ky3YRJ6eah3tjjA';
        return $set;
    }
}