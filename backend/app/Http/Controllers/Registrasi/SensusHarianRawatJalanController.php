<?php

namespace App\Http\Controllers\Registrasi;
use App\Http\Controllers\ApiController;


use Illuminate\Http\Request;
use App\Master\Pegawai;
use App\Http\Requests;
use Illuminate\Support\Facades\DB;
class SensusHarianRawatJalanController extends ApiController
{

    public function __construct() {
        parent::__construct($skip_authentication=false);
    }
    public function getSensusHarianRawatJalan(Request $request)
    {
        $rajal = $request['rajal'];
        $ranap = $request['ranap'];
        $tglAwal= $request['tglAwal'];
        $tglAkhir= $request['tglAkhir'];
        $ruangan = "";
        $wherenya = "";
        if($rajal == true){
            $ruangan = DB::select(DB::Raw("
            SELECT ru.id, ru.namaruangan FROM ruangan_m ru 
            where 
            ru.objectdepartemenfk in(18, 27, 3) and ru.statusenabled=true and ru.kdprofile=30 order by ru.objectdepartemenfk asc
            "));
            $wherenya = "and ru.objectdepartemenfk not in(16,27,3)";
        }else if($ranap == true){
            $ruangan = DB::select(DB::Raw("
            SELECT ru.id, ru.namaruangan FROM ruangan_m ru 
            where 
            ru.objectdepartemenfk in(16) and ru.statusenabled=true and ru.kdprofile=30 order by ru.objectdepartemenfk asc
        "));
            $wherenya = "and ru.objectdepartemenfk = 16";

        }
        else{
            $ruangan = DB::select(DB::Raw("
            SELECT ru.id, ru.namaruangan FROM ruangan_m ru 
            where 
            ru.id in(752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576);
        "));
            $wherenya = "and ru.objectdepartemenfk not in(16,27,3)";


        }
        

        $statuspasien= DB::select(DB::raw("/*status pasien*/
            WITH periode as (
                select '$tglAwal'::date as tglawal, '$tglAkhir'::date as tglakhir
            ),
            pasiendaftarnonlabrad AS ( 
	            SELECT 
		            pd.tglregistrasi, ru.id,pd.norec, pd.nocmfk, pd.statuspasien, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                FROM pasiendaftar_t pd
                    inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                    inner join periode on true
                WHERE 
                    pd.kdprofile = 30
                    and pd.statusenabled = TRUE 
                    and apd.kdprofile = 30
                    and apd.statusenabled = true
                    AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                    $wherenya
                    /*
                    16 = ranap
                    27 = 
                    3 =
                    */
                group by pd.tglregistrasi, pd.norec, pd.nocmfk, pd.statuspasien, apd.tglmasuk::date,apd.objectruanganfk,ru.id,ru.objectdepartemenfk
            ),
            pasiendaftarlabrad AS ( 
                SELECT 
                    pd.tglregistrasi,ru.id, pd.norec, pd.nocmfk, pd.statuspasien, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                FROM pasiendaftar_t pd
                    inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                    inner join pelayananpasien_t pp on apd.norec = pp.noregistrasifk
                    inner join periode on true
                WHERE 
                    pd.kdprofile = 30
                    and pd.statusenabled = TRUE 
                    and apd.kdprofile = 30
                    and apd.statusenabled = true
                    AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                    and ru.objectdepartemenfk in(27,3)
                    /*
                    16 = ranap
                    27 = lab
                    3 = radiologi
                    */
                group by ru.id,pd.tglregistrasi, pd.norec, pd.nocmfk, pd.statuspasien,pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.objectdepartemenfk
                
            )

            SELECT
                pd.id,pd.namaruangan, 
                count(pd.statuspasien) filter(where pd.statuspasien ilike 'LAMA') as LAMA,
                count(pd.statuspasien) filter(where pd.statuspasien ilike 'BARU') as BARU
            FROM
                pasiendaftarnonlabrad pd
                INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
            GROUP BY pd.namaruangan, pd.id

            union ALL

            SELECT
                pd.id, pd.namaruangan, 
                count(*) filter(where pd.statuspasien ilike 'LAMA') LAMA,
                count(pd.statuspasien) filter(where pd.statuspasien ilike 'BARU') BARU
            FROM
                pasiendaftarlabrad pd
                INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
            GROUP BY pd.namaruangan, pd.id"));

        $jeniskelamin = DB::select(DB::raw("
            with periode as
            (
                select '$tglAwal'::date tglawal, '$tglAkhir'::date tglakhir
            ),
            pasiendaftarnonlabrad AS ( 
                SELECT 
                ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, pd.statuspasien, 
                apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
            FROM pasiendaftar_t pd
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                inner join periode on true
            WHERE 
                pd.kdprofile = 30
                and pd.statusenabled = TRUE 
                and apd.kdprofile = 30
                and apd.statusenabled = true
                AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                $wherenya
                /*
                16 = ranap
                27 = 
                3 =
                */
            group by ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, pd.statuspasien, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
        ),
        pasiendaftarlabrad AS ( 
            SELECT 
                ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectjeniskelaminfk, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
            FROM pasiendaftar_t pd
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            inner join pelayananpasien_t pp on apd.norec = pp.noregistrasifk
            inner join periode on true
            WHERE 
                pd.kdprofile = 30
                and pd.statusenabled = TRUE 
                and apd.kdprofile = 30
                and apd.statusenabled = true
                AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                and ru.objectdepartemenfk in(27,3)
                /*
                16 = ranap
                27 = lab
                3 = radiologi
                */
            group by ru.id , pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectjeniskelaminfk,pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
        )  	
        SELECT
            pd.id,pd.namaruangan as ruangan, count(ps.objectjeniskelaminfk) filter(where ps.objectjeniskelaminfk =1) lk,count(ps.objectjeniskelaminfk) filter(where ps.objectjeniskelaminfk = 2) pr
        FROM
            pasiendaftarnonlabrad pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
        GROUP BY pd.namaruangan, pd.id

        union ALL

        SELECT
            pd.id,pd.namaruangan as ruangan, count(ps.objectjeniskelaminfk) filter(where ps.objectjeniskelaminfk =1) LK,count(ps.objectjeniskelaminfk) filter(where ps.objectjeniskelaminfk =2) PR
        FROM
            pasiendaftarlabrad pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
        GROUP BY pd.namaruangan,pd.id"));

        $umur = DB::select(DB::raw("with periode as
        (
            select '$tglAwal'::date tglawal, '$tglAkhir'::date tglakhir
        ),pasiendaftarnonlabrad AS ( 
	SELECT 
		ru.id,pd.tglregistrasi, pd.norec, pd.nocmfk, ps.tgllahir, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
	FROM pasiendaftar_t pd
	inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
	INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
	inner join pasien_m ps on ps.id=pd.nocmfk
	inner join periode on true
	WHERE 
		pd.kdprofile = 30
		and pd.statusenabled = TRUE 
		and apd.kdprofile = 30
		and apd.statusenabled = true
		AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
		$wherenya
		/*
		16 = ranap
		27 = 
		3 =
		*/
	group by ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, ps.tgllahir, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
),
pasiendaftarlabrad AS ( 
	SELECT 
		ru.id,pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectjeniskelaminfk, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
	FROM pasiendaftar_t pd
	INNER JOIN pasien_m ps on ps.id=pd.nocmfk
	inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
	INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
	inner join pelayananpasien_t pp on apd.norec = pp.noregistrasifk
	inner join periode on true
	WHERE 
		pd.kdprofile = 30
		and pd.statusenabled = TRUE 
		and apd.kdprofile = 30
		and apd.statusenabled = true
		AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
		and ru.objectdepartemenfk in(27,3)
		/*
		16 = ranap
		27 = lab
		3 = radiologi
		*/
	group by ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectjeniskelaminfk,pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
)  	
SELECT
pd.id,
	pd.namaruangan,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 0 and 4) u0sampai4,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 5 AND 14) u5sampai14,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 15 AND 24) u15sampai24,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 25 AND 44) u25sampai44,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 45 AND 64) u45sampai64,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) > 64) lebih64
FROM
	pasiendaftarnonlabrad pd
	INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
	inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
	inner join periode on true
GROUP BY pd.namaruangan, pd.id

union ALL

SELECT
pd.id,
	pd.namaruangan,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 0 and 4) u0sampai4,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 5 AND 14) u5sampai14,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 15 AND 24) u15sampai24,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 25 AND 44) u25sampai44,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) BETWEEN 45 AND 64) u45sampai64,
	count(DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date)) filter(where DATE_PART('year', periode.tglawal) - DATE_PART('year', ps.tgllahir::date) > 64) lebih64

FROM
	pasiendaftarlabrad pd
	INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
	inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
	inner join periode on true
GROUP BY pd.namaruangan, pd.id"));


        $agama = DB::select(DB::raw("with periode as
                (
                    select '$tglAwal'::date tglawal, '$tglAkhir'::date tglakhir
                ),

        pasiendaftarnonlabrad AS ( 
            SELECT 
                ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
            FROM pasiendaftar_t pd
            inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            inner join periode on true
            WHERE 
                pd.kdprofile = 30
                and pd.statusenabled = TRUE 
                and apd.kdprofile = 30
                and apd.statusenabled = true
                AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                $wherenya
                /*
                16 = ranap
                27 = 
                3 =
                */
            group by ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
        ),
        pasiendaftarlabrad AS ( 
            SELECT 
                ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
            FROM pasiendaftar_t pd
            inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            inner join pelayananpasien_t pp on apd.norec = pp.noregistrasifk
            inner join periode on true
            WHERE 
                pd.kdprofile = 30
                and pd.statusenabled = TRUE 
                and apd.kdprofile = 30
                and apd.statusenabled = true
                AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                and ru.objectdepartemenfk in(27,3)
                /*
                16 = ranap
                27 = lab
                3 = radiologi
                */
            group by ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk,pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
        ) 
        SELECT
            pd.id,
            pd.namaruangan, 
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 1 ) islam,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 2 ) kristen,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 3 ) katholik,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 4 ) hindu,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 5 ) budha,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk not in(1,2,3,4,5) ) lainnya
            
        FROM
            pasiendaftarnonlabrad pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
        GROUP BY pd.id, pd.namaruangan

        union ALL

        SELECT
            pd.id,
            pd.namaruangan, 
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 1 ) islam,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 2 ) kristen,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 3 ) katholik,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 4 ) hindu,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk = 5 ) budha,
            COUNT ( ps.objectagamafk ) filter (where ps.objectagamafk not in(1,2,3,4,5) ) lainnya
        FROM
            pasiendaftarlabrad pd
            INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
            inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
        GROUP BY pd.id, pd.namaruangan"));


        $alamat = DB::select(DB::raw("WITH periode as
                (
                    select '$tglAwal'::date tglawal, '$tglAkhir'::date tglakhir
                ),
                pasiendaftarnonlabrad AS ( 
                SELECT 
                    ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, al.objectkotakabupatenfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                FROM pasiendaftar_t pd
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                INNER JOIN pasien_m ps on ps.id= pd.nocmfk
                LEFT JOIN alamat_m al ON ps.ID = al.nocmfk
                LEFT JOIN kotakabupaten_m ko ON ko.ID = al.objectkotakabupatenfk	
                inner join periode on true
                WHERE 
                    pd.kdprofile = 30
                    and pd.statusenabled = TRUE 
                    and apd.kdprofile = 30
                    and apd.statusenabled = true
                    AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                    $wherenya
                    /*
                    16 = ranap
                    27 = 
                    3 =
                    */
                group by ru.id,pd.tglregistrasi, pd.norec, pd.nocmfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk,al.objectkotakabupatenfk
            ),
            pasiendaftarlabrad AS ( 
                SELECT 
                    ru.id,pd.tglregistrasi, pd.norec, pd.nocmfk, al.objectkotakabupatenfk, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                FROM pasiendaftar_t pd
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                INNER JOIN pasien_m ps on ps.id= pd.nocmfk
                inner join pelayananpasien_t pp on apd.norec = pp.noregistrasifk
                LEFT JOIN alamat_m al ON ps.ID = al.nocmfk
                LEFT JOIN kotakabupaten_m ko ON ko.ID = al.objectkotakabupatenfk	
                inner join periode on true
                WHERE 
                    pd.kdprofile = 30
                    and pd.statusenabled = TRUE 
                    and apd.kdprofile = 30
                    and apd.statusenabled = true
                    AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                    and ru.objectdepartemenfk in(27,3)
                    /*
                    16 = ranap
                    27 = lab
                    3 = radiologi
                    */
                group by ru.id, pd.tglregistrasi, pd.norec, al.objectkotakabupatenfk, pd.nocmfk, pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
            ) 
            SELECT
            pd.id,
                pd.namaruangan,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 227 ) yogyakarta,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 224 ) bantul,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 223 ) kulonprogo,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 225 ) gunungkidul,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 226 ) sleman,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk not in(227,224,223,225,226) ) luardiy
            FROM
                pasiendaftarnonlabrad pd
                INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
            GROUP BY pd.namaruangan, pd.id

            union ALL

            SELECT
            pd.id,
                pd.namaruangan,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 227 ) yogyakarta,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 224 ) bantul,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 223 ) kulonprogo,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 225 ) gunungkidul,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk = 226 ) sleman,
                COUNT ( pd.objectkotakabupatenfk) filter (where pd.objectkotakabupatenfk not in(227,224,223,225,226) ) luardiy
            FROM
                pasiendaftarlabrad pd
                INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
            GROUP BY pd.id,pd.namaruangan"));


            $pendidikan = DB::select(DB::raw("WITH periode AS (
                select '$tglAwal'::date tglawal, '$tglAkhir'::date tglakhir
                        ),
                        pasiendaftarnonlabrad AS ( 
                SELECT 
                    ru.id,pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectpendidikanfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                FROM pasiendaftar_t pd
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                INNER JOIN pasien_m ps on ps.id= pd.nocmfk
                
                LEFT JOIN pendidikan_m pdk ON pdk.ID = ps.objectpendidikanfk
                
                inner join periode on true
                WHERE 
                    pd.kdprofile = 30
                    and pd.statusenabled = TRUE 
                    and apd.kdprofile = 30
                    and apd.statusenabled = true
                    AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                    $wherenya
                    /*
                    16 = ranap
                    27 = 
                    3 =
                    */
                group by ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk,ps.objectpendidikanfk
            ),
            pasiendaftarlabrad AS ( 
                SELECT 
                    ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectpendidikanfk, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                FROM pasiendaftar_t pd
                inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                INNER JOIN pasien_m ps on ps.id= pd.nocmfk
                inner join pelayananpasien_t pp on apd.norec = pp.noregistrasifk

                LEFT JOIN pendidikan_m pdk ON pdk.ID = ps.objectpendidikanfk
                
                inner join periode on true
                WHERE 
                    pd.kdprofile = 30
                    and pd.statusenabled = TRUE 
                    and apd.kdprofile = 30
                    and apd.statusenabled = true
                    AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                    and ru.objectdepartemenfk in(27,3)
                    /*
                    16 = ranap
                    27 = lab
                    3 = radiologi
                    */
                group by ru.id, pd.tglregistrasi, pd.norec, ps.objectpendidikanfk, pd.nocmfk, pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
            ) 
            SELECT
            pd.id,
                pd.namaruangan,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk BETWEEN 0 and 1 ) tstk,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk = 2 ) sd,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk = 3 ) sltp,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk = 4) slta,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk BETWEEN 5 and 11 ) d1sds3
                
            FROM
                pasiendaftarnonlabrad pd
                INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
            GROUP BY pd.namaruangan, pd.id

            union ALL

            SELECT
            pd.id,
                pd.namaruangan,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk BETWEEN 0 and 1 ) tstk,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk = 2 ) sd,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk = 3 ) sltp,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk = 4) slta,
                COUNT ( pd.objectpendidikanfk ) filter (where pd.objectpendidikanfk BETWEEN 5 and 11 ) d1sds3
                
            FROM
                pasiendaftarlabrad pd
                INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
            GROUP BY pd.namaruangan,pd.id
                        "));

                $pekerjaan = DB::select(DB::raw("WITH periode AS (
                select '$tglAwal'::date tglawal, '$tglAkhir'::date tglakhir
                        ),
                        pasiendaftarnonlabrad AS ( 
                    SELECT 
                        ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectpekerjaanfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                    FROM pasiendaftar_t pd
                    inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                    INNER JOIN pasien_m ps on ps.id= pd.nocmfk
                    
                    
                    inner join periode on true
                    WHERE 
                        pd.kdprofile = 30
                        and pd.statusenabled = TRUE 
                        and apd.kdprofile = 30
                        and apd.statusenabled = true
                        AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                        $wherenya
                        /*
                        16 = ranap
                        27 = 
                        3 =
                        */
                    group by ru.id, pd.tglregistrasi, pd.norec, pd.nocmfk, apd.tglmasuk::date,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk,ps.objectpekerjaanfk
                ),
                pasiendaftarlabrad AS ( 
                    SELECT 
                        ru.id,pd.tglregistrasi, pd.norec, pd.nocmfk, ps.objectpekerjaanfk, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                    FROM pasiendaftar_t pd
                    inner join antrianpasiendiperiksa_t apd on pd.norec=apd.noregistrasifk
                    INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
                    INNER JOIN pasien_m ps on ps.id= pd.nocmfk
                    inner join pelayananpasien_t pp on apd.norec = pp.noregistrasifk
                    
                    inner join periode on true
                    WHERE 
                        pd.kdprofile = 30
                        and pd.statusenabled = TRUE 
                        and apd.kdprofile = 30
                        and apd.statusenabled = true
                        AND apd.tglmasuk :: DATE BETWEEN periode.tglawal AND periode.tglakhir
                        and ru.objectdepartemenfk in(27,3)
                        /*
                        16 = ranap
                        27 = lab
                        3 = radiologi
                        */
                    group by ru.id,pd.tglregistrasi, pd.norec, ps.objectpekerjaanfk, pd.nocmfk, pp.norec, pp.tglpelayanan,apd.objectruanganfk,ru.namaruangan,ru.objectdepartemenfk
                ) 
                SELECT
                pd.id,
                    pd.namaruangan,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 11 ) tani,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 15 ) buruh,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 16 ) pns,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk in(28,25)) abripolri,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 4 ) swasta,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 1 ) takbekerja,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk in(20,26,3) ) pelajarmahasiswa
                    
                FROM
                    pasiendaftarnonlabrad pd
                    INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                    inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
                GROUP BY pd.id,pd.namaruangan

                union ALL
                -- 
                SELECT
                pd.id,
                    pd.namaruangan,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 11 ) tani,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 15 ) buruh,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 16 ) pns,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk in(28,25)) abripolri,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 4 ) swasta,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk = 1 ) takbekerja,
                    COUNT ( pd.objectpekerjaanfk ) filter (where pd.objectpekerjaanfk in(20,26,3) ) pelajarmahasiswa
                    
                FROM
                    pasiendaftarlabrad pd
                    INNER JOIN pasien_m ps ON ps.ID = pd.nocmfk
                    inner join departemen_m dpm on dpm.id = pd.objectdepartemenfk
                GROUP BY pd.id, pd.namaruangan"));
        $jmlpasienbaru = 0;
        $jmlpasienlama = 0;
        $jmlpasienlk = 0;
        $jmlpasienpr = 0;
        //jml umur
        $jmlpasien0sampai4 = 0;
        $jmlpasien5sampai14 = 0;
        $jmlpasien15sampai24 = 0;
        $jmlpasien25sampai44 = 0;
        $jmlpasien45sampai64 = 0;
        $jmlpasienlebih64 = 0;
        //jml agama
        $jmlislam = 0;
        $jmlkristen = 0;
        $jmlkatholik = 0;
        $jmlhindu = 0;
        $jmlbudha = 0;
        $jmllainnya = 0;
        //jml alamat
        $jmlyogyakarta = 0;
        $jmlbantul = 0;
        $jmlkulonprogo = 0;
        $jmlgunungkidul = 0;
        $jmlsleman = 0;
        $jmlluardiy = 0;
        //jml pendidikan
        $jmltstk=0;
        $jmlsd=0;
        $jmlsltp=0;
        $jmlslta=0;
        $jmld1sds3=0;
        //jml pekerjaan
        $jmltani=0;
        $jmlburuh=0;
        $jmlpns=0;
        $jmlabripolri=0;
        $jmlswasta=0;
        $jmltakbekerja=0;
        $jmlpelajarmahasiswa=0;
        $totalpasien = 0;
        $totaljk = 0;
        $totalumur = 0;
        $totalagama = 0;
        $totalalamat = 0;
        $totalpendidikan = 0;
        $totalpekerjaan = 0;






        $detail = [];
        //var_dump($ruangan);
        foreach ($ruangan as $ru) {
            // var_dump($ru);
            $jmlpasienbaru = 0;
            $jmlpasienlama = 0;
            $jmlpasienlk = 0;
            $jmlpasienpr = 0;
            //jml umur
            $jmlpasien0sampai4 = 0;
            $jmlpasien5sampai14 = 0;
            $jmlpasien15sampai24 = 0;
            $jmlpasien25sampai44 = 0;
            $jmlpasien45sampai64 = 0;
            $jmlpasienlebih64 = 0;
            //jml agama
            $jmlislam = 0;
            $jmlkristen = 0;
            $jmlkatholik = 0;
            $jmlhindu = 0;
            $jmlbudha = 0;
            $jmllainnya = 0;
            //jml alamat
            $jmlyogyakarta = 0;
            $jmlbantul = 0;
            $jmlkulonprogo = 0;
            $jmlgunungkidul = 0;
            $jmlsleman = 0;
            $jmlluardiy = 0;
            //jml pekerjaan
            $jmltani=0;
            $jmlburuh=0;
            $jmlpns=0;
            $jmlabripolri=0;
            $jmlswasta=0;
            $jmltakbekerja=0;
            $jmlpelajarmahasiswa=0;
            //total
            $totalpasien = 0;
            $totaljk = 0;
            $totalumur = 0;
            $totalagama = 0;
            $totalalamat = 0;
            $totalpendidikan = 0;
            $totalpekerjaan = 0;
            
            
            
            foreach ($statuspasien as $sttspasien) {
                if ($ru->id == $sttspasien->id) {
                    $jmlpasienbaru = $sttspasien->baru;
                    $jmlpasienlama = $sttspasien->lama;
                    break;
                } else {
                    $jmlpasienbaru = 0;
                    $jmlpasienlama = 0;
                }
            }
            foreach ($jeniskelamin as $jk) {
                if ($ru->id == $jk->id) {
                    $jmlpasienlk = $jk->lk;
                    $jmlpasienpr = $jk->pr;
                    break;
                } else {
                    $jmlpasienlk = 0;
                    $jmlpasienpr = 0;
                }
            }
            foreach ($umur as $um) {
                if ($ru->id == $um->id) {
                    $jmlpasien0sampai4 = $um->u0sampai4;
                    $jmlpasien5sampai14 = $um->u5sampai14;
                    $jmlpasien15sampai24 = $um->u15sampai24;
                    $jmlpasien25sampai44 = $um->u25sampai44;
                    $jmlpasien45sampai64 = $um->u45sampai64;
                    $jmlpasienlebih64 = $um->lebih64;
                    break;
                } else {
                    $jmlpasien0sampai4 = 0;
                    $jmlpasien5sampai14 = 0;
                    $jmlpasien15sampai24 = 0;
                    $jmlpasien25sampai44 = 0;
                    $jmlpasien45sampai64 = 0;
                    $jmlpasienlebih64 = 0;
                }
            }
            
            foreach ($agama as $ag) {
                if ($ru->id == $ag->id) {
                    $jmlislam = $ag->islam;
                    $jmlkristen = $ag->kristen;
                    $jmlkatholik = $ag->katholik;
                    $jmlhindu = $ag->hindu;
                    $jmlbudha = $ag->budha;
                    $jmllainnya = $ag->lainnya;
                    break;
                } else {
                    $jmlislam = 0;
                    $jmlkristen = 0;
                    $jmlkatholik = 0;
                    $jmlhindu = 0;
                    $jmlbudha = 0;
                    $jmllainnya = 0;
                }
            }

            foreach ($alamat as $al) {
                if ($ru->id == $al->id) {
                $jmlyogyakarta = $al->yogyakarta;
                $jmlbantul = $al->bantul;
                $jmlkulonprogo = $al->kulonprogo;
                $jmlgunungkidul = $al->gunungkidul;
                $jmlsleman = $al->sleman;
                $jmlluardiy = $al->luardiy;
                break;
                } else {
                $jmlyogyakarta = 0;
                $jmlbantul = 0;
                $jmlkulonprogo = 0;
                $jmlgunungkidul = 0;
                $jmlsleman = 0;
                $jmlluardiy = 0;
                }
            }

            foreach ($pendidikan as $pd) {
                if ($ru->id == $pd->id) {
                    $jmltstk = $pd->tstk;
                    $jmlsd = $pd->sd;
                    $jmlsltp = $pd->sltp;
                    $jmlslta = $pd->slta;
                    $jmld1sds3 = $pd->d1sds3;
                    break;
                } else {
                    $jmltstk = 0;
                    $jmlsd = 0;
                    $jmlsltp = 0;
                    $jmlslta = 0;
                    $jmld1sds3 = 0;
                }
            }

            foreach ($pekerjaan as $pk) {
                if ($ru->id == $pk->id) {
                    $jmltani=$pk->tani;
                    $jmlburuh=$pk->buruh;
                    $jmlpns=$pk->pns;
                    $jmlabripolri=$pk->abripolri;
                    $jmlswasta=$pk->swasta;
                    $jmltakbekerja=$pk->takbekerja;
                    $jmlpelajarmahasiswa=$pk->pelajarmahasiswa;
                    break;
                } else {
                    $jmltani=0;
                    $jmlburuh=0;
                    $jmlpns=0;
                    $jmlabripolri=0;
                    $jmlswasta=0;
                    $jmltakbekerja=0;
                    $jmlpelajarmahasiswa=0;
                }
            }

            $totalpasien = $jmlpasienbaru + $jmlpasienlama;
            $totaljk = $jmlpasienlk + $jmlpasienpr;
            $totalumur = $jmlpasien0sampai4 + $jmlpasien5sampai14 + $jmlpasien15sampai24 + $jmlpasien25sampai44 + $jmlpasien45sampai64 + $jmlpasienlebih64;
            $totalagama = $jmlislam + $jmlkristen + $jmlkatholik + $jmlhindu + $jmlbudha + $jmllainnya;
            $totalalamat = $jmlyogyakarta + $jmlbantul + $jmlkulonprogo + $jmlgunungkidul + $jmlsleman + $jmlluardiy;
            $totalpendidikan = $jmltstk + $jmlsd + $jmlsltp + $jmlslta + $jmld1sds3;
            $totalpekerjaan = $jmltani + $jmlburuh + $jmlpns + $jmlabripolri + $jmlswasta + $jmltakbekerja + $jmlpelajarmahasiswa;


            $detail[] = array(
                'ruangan' => $ru->namaruangan,
                'jmlpasienbaru' => $jmlpasienbaru,
                'jmlpasienlama' => $jmlpasienlama,
                'jmlpasienlk' => $jmlpasienlk,
                'jmlpasienpr' => $jmlpasienpr,
                'jmlpasien0sampai4' => $jmlpasien0sampai4,
                'jmlpasien5sampai14' => $jmlpasien5sampai14,
                'jmlpasien15sampai24' => $jmlpasien15sampai24,
                'jmlpasien25sampai44' => $jmlpasien25sampai44,
                'jmlpasien45sampai64' => $jmlpasien45sampai64,
                'jmlpasienlebih64' => $jmlpasienlebih64,
                'jmlislam' => $jmlislam,
                'jmlkristen' => $jmlkristen,
                'jmlkatholik' => $jmlkatholik,
                'jmlhindu' => $jmlhindu,
                'jmlbudha' => $jmlbudha,
                'jmllainnya' => $jmllainnya,
                'jmlyogyakarta' => $jmlyogyakarta,
                'jmlbantul' => $jmlbantul,
                'jmlkulonprogo' => $jmlkulonprogo,
                'jmlgunungkidul' => $jmlgunungkidul,
                'jmlsleman' => $jmlsleman,
                'jmlluardiy' => $jmlluardiy,
                'jmltstk' => $jmltstk,
                'jmlsd' => $jmlsd,
                'jmlsltp' => $jmlsltp,
                'jmlslta' => $jmlslta,
                'jmld1sds3' => $jmld1sds3,
                'jmltani' => $jmltani,
                'jmlburuh' => $jmlburuh,
                'jmlpns' => $jmlpns,
                'jmlabripolri' => $jmlabripolri,
                'jmlswasta' => $jmlswasta,
                'jmltakbekerja' => $jmltakbekerja,
                'jmlpelajarmahasiswa' => $jmlpelajarmahasiswa,
                'totalpasien' => $totalpasien,
                'totaljk' => $totaljk,
                'totalumur' => $totalumur,
                'totalagama' => $totalagama,
                'totalalamat' => $totalalamat,
                'totalpendidikan' => $totalpendidikan,
                'totalpekerjaan' => $totalpekerjaan
                



                
            );
        }

        $result = array(
            'detail' => $detail,
            'ruangan' => $ruangan,
            'statuspasien' => $statuspasien,
            // 'jeniskelamin' => $jeniskelamin,
            'message' => 'faz@epic',
        );

        return $this->respond($result);
    }

        public function getDataCombo(Request $request) {
        $kdProfile = $this->getDataKdProfile($request);
        $idProfile = (int) $kdProfile;
        $dataLogin = $request->all();
        $dataPenulis = Pegawai::where('statusenabled',true)
            ->where('objectjenispegawaifk',1)
            ->get();
        
        $dataSigna = \DB::table('stigma as st')
            ->select('st.id','st.name')
            ->orderBy('st.name')
            ->get();
        $dataRuangan =[];
        $dataRuangan = \DB::table('maploginusertoruangan_s as mlu')
            ->JOIN('ruangan_m as ru','ru.id','=','mlu.objectruanganfk')
            ->select('ru.id','ru.namaruangan')
            ->where('mlu.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->where('mlu.objectloginuserfk',$request['userData']['id'])
            ->get();
        $dataRuanganFamasi=[];

        $dataRuanganFamasi = \DB::table('ruangan_m as ru')
            ->select('ru.id','ru.namaruangan')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.objectdepartemenfk',$this->settingDataFixed('kdDepartemenFarmasi',$idProfile))
            ->where('ru.statusenabled',true)
            ->orderBy('ru.namaruangan')
            ->get();

        $dataJenisKemasan = \DB::table('jeniskemasan_m as jk')
            ->select('jk.id','jk.jeniskemasan')
            ->where('jk.statusenabled',true)
            ->get();
        $dataJenisRacikan = \DB::table('jenisracikan_m as jk')
            ->select('jk.id','jk.jenisracikan')
            ->where('jk.statusenabled',true)
            ->get();

        //        foreach ($dataRuangan as $lalala){
        //            $ruFilter[]=array($lalala->id);
        //        }
        $kdjenisobat = explode (',',$this->settingDataFixed('kdJenisProdukObat',$idProfile));
        $arrkdjenisobat = [];
        foreach ($kdjenisobat as $it){
            $arrkdjenisobat []=  (int)$it;
        }
     
        $dataProduk = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.kdprofile', $idProfile)
            ->where('pr.statusenabled',true)
            // ->whereIn('jp.id',[97,283])
            ->whereIn('jp.id',$arrkdjenisobat)
            ->where('spd.qtyproduk','>',0)
            ->groupBy('pr.id','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        $dataProduk1 = \DB::table('produk_m as pr')
            ->JOIN('detailjenisproduk_m as djp','djp.id','=','pr.objectdetailjenisprodukfk')
            ->JOIN('jenisproduk_m as jp','jp.id','=','djp.objectjenisprodukfk')
            ->leftJOIN('satuanstandar_m as ss','ss.id','=','pr.objectsatuanstandarfk')
            ->JOIN('stokprodukdetail_t as spd','spd.objectprodukfk','=','pr.id')
            ->select('pr.id','pr.namaproduk','ss.id as ssid','ss.satuanstandar')
            ->where('pr.kdprofile', $idProfile)
            ->where('pr.statusenabled',true)
            ->whereIn('jp.id',[97,283])
        //	         ->where('spd.qtyproduk','>',0)
            ->groupBy('pr.id','pr.namaproduk','ss.id','ss.satuanstandar')
            ->orderBy('pr.namaproduk')
            ->get();

        $dataAsalProduk = \DB::table('asalproduk_m as ap')
            ->JOIN('stokprodukdetail_t as spd','spd.objectasalprodukfk','=','ap.id')
            ->select('ap.id','ap.asalproduk')
            ->where('ap.statusenabled',true)
            ->orderBy('ap.id')
            ->groupBy('ap.id','ap.asalproduk')
            ->get();

        $dataRoute = \DB::table('routefarmasi as rt')
            ->select('rt.id','rt.name')
            ->where('rt.statusenabled',true)
            ->orderBy('rt.id')
            ->get();
        $dataKelas = \DB::table('kelas_m as rt')
            ->select('rt.id','rt.namakelas')
            ->where('rt.statusenabled',true)
            ->orderBy('rt.id')
            ->get();

        $dataKonversiProduk = \DB::table('konversisatuan_t as ks')
            ->JOIN('satuanstandar_m as ss','ss.id','=','ks.satuanstandar_asal')
            ->JOIN('satuanstandar_m as ss2','ss2.id','=','ks.satuanstandar_tujuan')
            ->select('ks.objekprodukfk','ks.satuanstandar_asal','ss.satuanstandar','ks.satuanstandar_tujuan','ss2.satuanstandar as satuanstandar2',
                'ks.nilaikonversi')
            ->where('ks.kdprofile', $idProfile)
            ->where('ks.statusenabled',true)
            ->get();

        $dataTarifAdminResep = \DB::table('settingdatafixed_m as rt')
            ->select('rt.namafield','rt.nilaifield')
            ->where('rt.statusenabled',true)
            ->where('rt.namafield','tarifadminresep')
            ->orderBy('rt.id')
            ->first();


        $dataProdukResult=[];
        foreach ($dataProduk as $item){
            $satuanKonversi=[];
            foreach ($dataKonversiProduk  as $item2){
                if ($item->id == $item2->objekprodukfk){
                    $satuanKonversi[] =array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult[]=array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }
        $dataProdukResult1=[];
        foreach ($dataProduk1 as $item){
            $satuanKonversi=[];
            foreach ($dataKonversiProduk  as $item2){
                if ($item->id == $item2->objekprodukfk){
                    $satuanKonversi[] =array(
                        'ssid' =>   $item2->satuanstandar_tujuan,
                        'satuanstandar' =>   $item2->satuanstandar2,
                        'nilaikonversi' =>   $item2->nilaikonversi,
                    );
                }
            }

            $dataProdukResult1[]=array(
                'id' =>   $item->id,
                'namaproduk' =>   $item->namaproduk,
                'ssid' =>   $item->ssid,
                'satuanstandar' =>   $item->satuanstandar,
                'konversisatuan' => $satuanKonversi,
            );
        }

        $dataPegawaiUser = DB::select(DB::raw("select pg.id,pg.namalengkap from loginuser_s as lu
                INNER JOIN pegawai_m as pg on lu.objectpegawaifk=pg.id
                where lu.kdprofile = $idProfile and lu.id=:idLoginUser"),
            array(
                'idLoginUser' => $dataLogin['userData']['id'],
            )
        );
        
        $dataDokter = \DB::table('pegawai_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->where('ru.objectjenispegawaifk', 1)
            ->orderBy('ru.namalengkap')
            ->get();

        $dataPenyekrining = \DB::table('pegawai_m as pw')
            ->select('pw.id','pw.namalengkap')
            ->where('pw.kdprofile', $idProfile)
            ->where('pw.statusenabled', true)
            ->where('pw.objectjenispegawaifk', 14)
            ->orderBy('pw.namalengkap')
            ->get();

        $dataKelompok = \DB::table('kelompokpasien_m as kp')
            ->select('kp.id', 'kp.kelompokpasien')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.kelompokpasien')
            ->get();

        $dataSatuanResep = \DB::table('satuanresep_m as kp')
            ->select('kp.id', 'kp.satuanresep')
            ->where('kp.statusenabled', true)
            ->orderBy('kp.satuanresep')
            ->get();
        $dataRuanganAll = \DB::table('ruangan_m as ru')
            ->where('ru.kdprofile', $idProfile)
            ->where('ru.statusenabled', true)
            ->whereIn('ru.objectdepartemenfk', [16,25,18])
            ->orderBy('ru.namaruangan')
            ->get();

        $result = array(
            'ruangan' => $dataRuangan,
            'ruanganfarmasi' => $dataRuanganFamasi,
            'jeniskemasan' => $dataJenisKemasan,
            'asalproduk' => $dataAsalProduk,
            'route' => $dataRoute,
            'kelas' => $dataKelas,
            'signa' => $dataSigna,
            'jenisracikan' => $dataJenisRacikan,
            'detaillogin' => $dataPegawaiUser,
            'tarifadminresep' =>$dataTarifAdminResep,
            'dokter'=>$dataDokter,
            'kelompokpasien'=>$dataKelompok,
            'satuanresep'=>$dataSatuanResep,
            'ruanganall'=>$dataRuanganAll,
            'penyekrining'=>$dataPenyekrining,
            'message' => 'as@epic',
        //            'asdas' => $ruFilter,
        );

        return $this->respond($result);
    }

    public function Grafikrajal(Request $request)
    {
        $tglawal = $request->tglawal;
        $tglakhir = $request->tglakhir;
        $tahun = $request->tahun;
        $jenislaporan = $request->jenislaporan;
        $departemen = $request->departemen;
        $ruangan = $request->ruangan;
        $tempTahun = '';
        if ($tahun != '') {
            $tempTahun = "AND date_part('year', apd.tglkeluar:: DATE) = '$tahun'";
        }$tempTanggal = "";

        if (isset($tglawal) && isset($tglakhir)) {
            $tempTanggal="AND apd.tglkeluar:: DATE BETWEEN '$tglawal' AND '$tglakhir'";
        }

        $paramLap = '';
        if (isset($jenislaporan) && $jenislaporan != "" && $jenislaporan == 1) {
            $paramLap = ' and ru.objectdepartemenfk = 16  ';
        }
        if (isset($jenislaporan) && $jenislaporan != "" && $jenislaporan == 2) {
            $paramLap = ' and ru.objectdepartemenfk <> 16  ';
        }
        $paramDep = '';
        if (isset($departemen) && $departemen != "" ) {
            $paramDep = ' and ru.objectdepartemenfk =' . $departemen;
        }
        $paramRuangan = '';
        if (isset($ruangan) && $ruangan != "" ) {
            $paramRuangan = ' and ru.id =' . $ruangan ;
        }
        $data= DB::select(DB::raw(
            "
            WITH grafik AS (
            SELECT DISTINCT
            apd.tglregistrasi,
            pd.tglregistrasi,
            pd.norec AS norec_pd,
            apd.norec AS norec_apd,
            pd.nocmfk,
            ps.nocm,
            pd.statuspasien,
            ru.namaruangan,
            apd.tglkeluar :: DATE ,
            pd.tglpulang
            FROM
            pasiendaftar_t pd
            INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
            INNER JOIN pasien_m ps on ps.id=pd.nocmfk
            INNER JOIN ruangan_m ru ON ru.ID = apd.objectruanganfk
            WHERE
            pd.kdprofile = 30
            AND pd.statusenabled = TRUE
            AND apd.kdprofile = 30
            AND apd.statusenabled = TRUE
            $tempTahun
            $tempTanggal
            $paramLap
            $paramDep
            $paramRuangan

                ) SELECT distinct
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 1 )as januari,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 2 )as februari,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 3 )as maret,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 4 )as april,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 5 )as mei,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 6 )as juni,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 7 )as juli,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 8 )as agustus,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 9 )as september,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 10 )as oktober,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 11 )as november,
                COUNT( pd.norec_apd ) FILTER(where date_part('month', pd.tglkeluar:: DATE) = 12 )as desember
                FROM
                grafik pd
            "
        ));
        $januari= 0;
        $februari= 0;
        $maret= 0;
        $april= 0;
        $mei= 0;
        $juni= 0;
        $juli= 0;
        $agustus= 0;
        $september= 0;
        $oktober= 0;
        $november= 0;
        $desember= 0;
        $detail = [];
        foreach ($data as $dt) {
            if ($dt->januari != 0) {
                $januari = $dt->januari;
            }
            if ($dt->februari != 0) {
                $februari = $dt->februari;
            }
            if ($dt->maret != 0) {
                $maret = $dt->maret;
            }
            if ($dt->april != 0) {
                $april = $dt->april;
            }
            if ($dt->mei != 0) {
                $mei = $dt->mei;
            }
            if ($dt->juni != 0) {
                $juni = $dt->juni;
            }
            if ($dt->juli != 0) {
                $juli = $dt->juli;
            }
            if ($dt->agustus != 0) {
                $agustus = $dt->agustus;
            }
            if ($dt->september != 0) {
                $september = $dt->september;
            }
            if ($dt->oktober != 0) {
                $oktober = $dt->oktober;
            }
            if ($dt->november != 0) {
                $november = $dt->november;
            }
            if ($dt->desember != 0) {
                $desember = $dt->desember;
            }
            
        }
        $detail[] = array(
                'januari' => $januari,
                'februari' => $februari,
                'maret' => $maret,
                'april' => $april,
                'mei' => $mei,
                'juni' => $juni,
                'juli' => $juli,
                'agustus' => $agustus,
                'september' => $september,
                'oktober' => $oktober,
                'november' => $november,
                'desember' => $desember
            );
            $result = array('data' => $detail);
            return $this->respond($result);

    }
    public function getLaporanSensusHarianRawatJalan(Request $request)
    {
        $tglawal = $request['tglawal'];
        $tglakhir = $request['tglakhir'];
        $main = \DB::select(DB::raw("SELECT date_part('day', i )as tgl FROM generate_series('$tglawal'::date,'$tglakhir'::date, '1 day')i;"));
        $data = \DB::select(DB::raw("SELECT * FROM (
        SELECT date_part('day', apd.tglmasuk::date)::integer as tgl, 
        count(apd.statuskunjungan)filter(where apd.statuskunjungan = 'BARU')as br,
        count(apd.statuskunjungan)filter(where apd.statuskunjungan = 'LAMA')as lm
        FROM antrianpasiendiperiksa_t apd 
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
        where pd.statusenabled = true and apd.statusenabled = true and apd.kdprofile = 30 and ru.id in(29,752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576) and apd.tglmasuk::date BETWEEN '$tglawal' and '$tglakhir' GROUP BY apd.tglmasuk::date)as status

        left join (
        SELECT date_part('day', apd.tglmasuk::date)::integer as tgl, 
        count(ps.objectjeniskelaminfk)filter(where ps.objectjeniskelaminfk = 1)as lk,
        count(ps.objectjeniskelaminfk)filter(where ps.objectjeniskelaminfk = 2)as pr
        FROM antrianpasiendiperiksa_t apd 
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
        inner join pasien_m ps on ps.id = pd.nocmfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        where pd.statusenabled = true and apd.statusenabled = true and apd.kdprofile = 30 and ru.id in(29,752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576)and apd.tglmasuk::date BETWEEN '$tglawal' and '$tglakhir' GROUP BY apd.tglmasuk::date
        )as jeniskelamin on jeniskelamin.tgl = status.tgl

        left join (
        SELECT date_part('day', apd.tglmasuk::date)::integer as tgl, 
        count(EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date)))filter(where EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date))between 0 and 4)as umur1,
        count(EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date)))filter(where EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date))between 5 and 14)as umur2,
        count(EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date)))filter(where EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date))between 15 and 24)as umur3,
        count(EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date)))filter(where EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date))between 25 and 44)as umur4,
        count(EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date)))filter(where EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date))between 45 and 64)as umur5,
        count(EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date)))filter(where EXTRACT(year  from age(apd.tglmasuk::date, ps.tgllahir::date))>64)as umur6
        FROM antrianpasiendiperiksa_t apd 
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
        inner join pasien_m ps on ps.id = pd.nocmfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        where pd.statusenabled = true and apd.statusenabled = true and apd.kdprofile = 30 and ru.id in(29,752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576) and apd.tglmasuk::date BETWEEN '$tglawal' and '$tglakhir' GROUP BY apd.tglmasuk::date
        )as umur on umur.tgl = status.tgl


        left join (
        SELECT date_part('day', apd.tglmasuk::date)::integer as tgl, 
        count(ps.objectagamafk)filter(where ps.objectagamafk=1)as agama1,
        count(ps.objectagamafk)filter(where ps.objectagamafk=2)as agama2,
        count(ps.objectagamafk)filter(where ps.objectagamafk=3)as agama3,
        count(ps.objectagamafk)filter(where ps.objectagamafk=4)as agama4,
        count(ps.objectagamafk)filter(where ps.objectagamafk=5)as agama5
        FROM antrianpasiendiperiksa_t apd 
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
        inner join pasien_m ps on ps.id = pd.nocmfk
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        where pd.statusenabled = true and apd.statusenabled = true and apd.kdprofile = 30 and ru.id in(29,752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576) and apd.tglmasuk::date BETWEEN '$tglawal' and '$tglakhir' GROUP BY apd.tglmasuk::date
        )as agama on agama.tgl = status.tgl


        left join (
        SELECT date_part('day', apd.tglmasuk::date)::integer as tgl, 
        count(al.namakotakabupaten)filter(where al.objectkotakabupatenfk = 227)as alamat1,
        count(al.namakotakabupaten)filter(where al.objectkotakabupatenfk = 224)as alamat2,
        count(al.namakotakabupaten)filter(where al.objectkotakabupatenfk = 223)as alamat3,
        count(al.namakotakabupaten)filter(where al.objectkotakabupatenfk = 225)as alamat4,
        count(al.namakotakabupaten)filter(where al.objectkotakabupatenfk = 226)as alamat5,
        count(al.namakotakabupaten)filter(where al.objectkotakabupatenfk not in (223,224,225,226,227))as alamat6
        FROM antrianpasiendiperiksa_t apd 
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
        inner join pasien_m ps on ps.id = pd.nocmfk
        left join alamat_m al on al.nocmfk = ps.id
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        where pd.statusenabled = true and apd.statusenabled = true and apd.kdprofile = 30 and ru.id in(29,752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576) and apd.tglmasuk::date BETWEEN '$tglawal' and '$tglakhir' GROUP BY apd.tglmasuk::date
        )as alamat on alamat.tgl = status.tgl

        left join (
        SELECT date_part('day', apd.tglmasuk::date)::integer as tgl, 
        count(ps.objectpendidikanfk)filter(where ps.objectpendidikanfk in (0,1,17))as pendidikan1,
        count(ps.objectpendidikanfk)filter(where ps.objectpendidikanfk in (2))as pendidikan2,
        count(ps.objectpendidikanfk)filter(where ps.objectpendidikanfk in (3))as pendidikan3,
        count(ps.objectpendidikanfk)filter(where ps.objectpendidikanfk in (4))as pendidikan4,
        count(ps.objectpendidikanfk)filter(where ps.objectpendidikanfk in (5,6,7,8,9,10,11))as pendidikan5
        FROM antrianpasiendiperiksa_t apd 
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
        inner join pasien_m ps on ps.id = pd.nocmfk
        left join alamat_m al on al.nocmfk = ps.id
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        where pd.statusenabled = true and apd.statusenabled = true and apd.kdprofile = 30 and ru.id in(29,752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576) and apd.tglmasuk::date BETWEEN '$tglawal' and '$tglakhir' GROUP BY apd.tglmasuk::date
        )as pendidikan on pendidikan.tgl = status.tgl

        left join (
        SELECT date_part('day', apd.tglmasuk::date)::integer as tgl, 
        count(ps.objectpekerjaanfk)filter(where ps.objectpekerjaanfk in (11))as pekerjaan1,
        count(ps.objectpekerjaanfk)filter(where ps.objectpekerjaanfk in (15))as pekerjaan2,
        count(ps.objectpekerjaanfk)filter(where ps.objectpekerjaanfk in (16))as pekerjaan3,
        count(ps.objectpekerjaanfk)filter(where ps.objectpekerjaanfk in (16,18,25,28))as pekerjaan4,
        count(ps.objectpekerjaanfk)filter(where ps.objectpekerjaanfk in (17))as pekerjaan5,
        count(ps.objectpekerjaanfk)filter(where ps.objectpekerjaanfk in (1,12,23))as pekerjaan6,
        count(ps.objectpekerjaanfk)filter(where ps.objectpekerjaanfk in (3,20,26))as pekerjaan7
        FROM antrianpasiendiperiksa_t apd 
        inner join pasiendaftar_t pd on pd.norec = apd.noregistrasifk
        inner join pasien_m ps on ps.id = pd.nocmfk
        left join alamat_m al on al.nocmfk = ps.id
        inner join ruangan_m ru on ru.id = apd.objectruanganfk
        where pd.statusenabled = true and apd.statusenabled = true and apd.kdprofile = 30 and ru.id in(29,752,753,755,756,757,758,759,761,762,764,765,29,767,768,769,770,771,772,773,774,777,782,575,576) and apd.tglmasuk::date BETWEEN '$tglawal' and '$tglakhir' GROUP BY apd.tglmasuk::date
        )as pekerjaan on pekerjaan.tgl = status.tgl;
        "));
        // variable
        $tgl = 0;
        $br=0;
        $lm = 0;
        $lk = 0;
        $pr = 0;
        $umur1 = 0;
        $umur2 = 0;
        $umur3 = 0;
        $umur4 = 0;
        $umur5 = 0;
        $umur6 = 0;
        $agama1 = 0;
        $agama2 = 0;
        $agama3 = 0;
        $agama4 = 0;
        $agama5 = 0;
        $alamat1 = 0;
        $alamat2 = 0;
        $alamat3 = 0;
        $alamat4 = 0;
        $alamat5 = 0;
        $alamat6 = 0;
        $pendidikan1 = 0;
        $pendidikan2 = 0;
        $pendidikan3 = 0;
        $pendidikan4 = 0;
        $pendidikan5 = 0;
        $pekerjaan1 = 0;
        $pekerjaan2 = 0;
        $pekerjaan3 = 0;
        $pekerjaan4 = 0;
        $pekerjaan5 = 0;
        $pekerjaan6 = 0;
        $pekerjaan7 = 0;
        $detail = [];
        foreach ($main as $m) {
            $tgl = 0;
            $br=0;
            $lm = 0;
            $lk = 0;
            $pr = 0;
            $umur1 = 0;
            $umur2 = 0;
            $umur3 = 0;
            $umur4 = 0;
            $umur5 = 0;
            $umur6 = 0;
            $agama1 = 0;
            $agama2 = 0;
            $agama3 = 0;
            $agama4 = 0;
            $agama5 = 0;
            $alamat1 = 0;
            $alamat2 = 0;
            $alamat3 = 0;
            $alamat4 = 0;
            $alamat5 = 0;
            $alamat6 = 0;
            $pendidikan1 = 0;
            $pendidikan2 = 0;
            $pendidikan3 = 0;
            $pendidikan4 = 0;
            $pendidikan5 = 0;
            $pekerjaan1 = 0;
            $pekerjaan2 = 0;
            $pekerjaan3 = 0;
            $pekerjaan4 = 0;
            $pekerjaan5 = 0;
            $pekerjaan6 = 0;
            $pekerjaan7 = 0;
            
            foreach ($data as $dt) {
                if($m->tgl == $dt->tgl){
                    $tgl = $m->tgl;
                    $br=$dt->br;
                    $lm = $dt->lm;
                    $lk = $dt->lk;
                    $pr = $dt->pr;
                    $umur1 = $dt->umur1;
                    $umur2 = $dt->umur2;
                    $umur3 = $dt->umur3;
                    $umur4 = $dt->umur4;
                    $umur5 = $dt->umur5;
                    $umur6 = $dt->umur6;
                    $agama1 = $dt->agama1;
                    $agama2 = $dt->agama2;
                    $agama3 = $dt->agama3;
                    $agama4 = $dt->agama4;
                    $agama5 = $dt->agama5;
                    $alamat1 = $dt->alamat1;
                    $alamat2 = $dt->alamat2;
                    $alamat3 = $dt->alamat3;
                    $alamat4 = $dt->alamat4;
                    $alamat5 = $dt->alamat5;
                    $alamat6 = $dt->alamat6;
                    $pendidikan1 = $dt->pendidikan1;
                    $pendidikan2 = $dt->pendidikan2;
                    $pendidikan3 = $dt->pendidikan3;
                    $pendidikan4 = $dt->pendidikan4;
                    $pendidikan5 = $dt->pendidikan5;
                    $pekerjaan1 = $dt->pekerjaan1;
                    $pekerjaan2 = $dt->pekerjaan2;
                    $pekerjaan3 = $dt->pekerjaan3;
                    $pekerjaan4 = $dt->pekerjaan4;
                    $pekerjaan5 = $dt->pekerjaan5;
                    $pekerjaan6 = $dt->pekerjaan6;
                    $pekerjaan7 = $dt->pekerjaan7;
                    break;
                } else{
                    $tgl = $m->tgl;
                    $br=0;
                    $lm = 0;
                    $lk = 0;
                    $pr = 0;
                    $umur1 = 0;
                    $umur2 = 0;
                    $umur3 = 0;
                    $umur4 = 0;
                    $umur5 = 0;
                    $umur6 = 0;
                    $agama1 = 0;
                    $agama2 = 0;
                    $agama3 = 0;
                    $agama4 = 0;
                    $agama5 = 0;
                    $alamat1 = 0;
                    $alamat2 = 0;
                    $alamat3 = 0;
                    $alamat4 = 0;
                    $alamat5 = 0;
                    $alamat6 = 0;
                    $pendidikan1 = 0;
                    $pendidikan2 = 0;
                    $pendidikan3 = 0;
                    $pendidikan4 = 0;
                    $pendidikan5 = 0;
                    $pekerjaan1 = 0;
                    $pekerjaan2 = 0;
                    $pekerjaan3 = 0;
                    $pekerjaan4 = 0;
                    $pekerjaan5 = 0;
                    $pekerjaan6 = 0;
                    $pekerjaan7 = 0;
                }
            }
            $detail[] = array(
                'tgl'=>$tgl,
                'br'=>$br,
                'lm'=>$lm,
                'lk'=>$lk,
                'pr'=>$pr,
                'umur1'=>$umur1,
                'umur2'=>$umur2,
                'umur3'=>$umur3,
                'umur4'=>$umur4,
                'umur5'=>$umur5,
                'umur6'=>$umur6,
                'agama1'=>$agama1,
                'agama2'=>$agama2,
                'agama3'=>$agama3,
                'agama4'=>$agama4,
                'agama5'=>$agama5,
                'alamat1'=>$alamat1,
                'alamat2'=>$alamat2,
                'alamat3'=>$alamat3,
                'alamat4'=>$alamat4,
                'alamat5'=>$alamat5,
                'alamat6'=>$alamat6,
                'pendidikan1'=>$pendidikan1,
                'pendidikan2'=>$pendidikan2,
                'pendidikan3'=>$pendidikan3,
                'pendidikan4'=>$pendidikan4,
                'pendidikan5'=>$pendidikan5,
                'pekerjaan1'=>$pekerjaan1,
                'pekerjaan2'=>$pekerjaan2,
                'pekerjaan3'=>$pekerjaan3,
                'pekerjaan4'=>$pekerjaan4,
                'pekerjaan5'=>$pekerjaan5,
                'pekerjaan6'=>$pekerjaan6,
                'pekerjaan7'=>$pekerjaan7,
            );
        }
        $result = array(
            'data'=> $detail,
            'as'=> 'Fizi'
        );
        return $this->respond($result);
    }
}
