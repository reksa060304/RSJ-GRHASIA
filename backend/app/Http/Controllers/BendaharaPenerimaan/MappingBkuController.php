<?php

namespace App\Http\Controllers\BendaharaPenerimaan;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\CodeGenerator;
use DB;
use App\Master\CharAkunPendapatan;
use Webpatser\Uuid\Uuid;

class MappingBkuController extends Controller
{
    /**
     * 
     */
    public function getMappingBKU(Request $request)
    {
        $kdProfile = 30;

        // Tipe 1: General (mapbkuakun_t)
        $tipe1 = DB::select("
            SELECT mba.id, mba.objectakunpendapatanfk, mba.objectkelompokpasienfk, mba.objectruanganfk, mba.objectkelasfk, mba.isobat,
                cap.koderekening, cap.namarekening
            FROM mapbkuakun_t mba
            INNER JOIN char_akun_pendapatan_m cap ON cap.id = mba.objectakunpendapatanfk
            WHERE mba.kdprofile = :kdProfile AND mba.statusenabled = TRUE
            ORDER BY mba.id DESC
        ", ['kdProfile' => $kdProfile]);

        // Tipe 2: Produk Spesifik (mapbkuakun3_t)
        $tipe2 = DB::select("
            SELECT mba.id, mba.objectakunpendapatanfk, mba.objectprodukfk,
                cap.koderekening, cap.namarekening
            FROM mapbkuakun3_t mba
            INNER JOIN char_akun_pendapatan_m cap ON cap.id = mba.objectakunpendapatanfk
            WHERE mba.kdprofile = :kdProfile AND mba.statusenabled = TRUE
            ORDER BY mba.id DESC
        ", ['kdProfile' => $kdProfile]);

        // Tipe 3: Non-Layanan (mapbkuakun2_t)
        $tipe3 = DB::select("
            SELECT mba.id, mba.objectakunpendapatanfk, mba.objectprodukfk,
                cap.koderekening, cap.namarekening
            FROM mapbkuakun2_t mba
            INNER JOIN char_akun_pendapatan_m cap ON cap.id = mba.objectakunpendapatanfk
            WHERE mba.kdprofile = :kdProfile AND mba.statusenabled = TRUE
            ORDER BY mba.id DESC
        ", ['kdProfile' => $kdProfile]);

        // Hellper perbaikan pemanggilan nama 
        $this->resolveNames($tipe1, 'objectruanganfk', 'ruangan_m', 'namaruangan');
        $this->resolveNames($tipe1, 'objectkelompokpasienfk', 'kelompokpasien_m', 'kelompokpasien');
        $this->resolveNames($tipe1, 'objectkelasfk', 'kelas_m', 'namakelas');
        
        $this->resolveNames($tipe2, 'objectprodukfk', 'produk_m', 'namaproduk');
        $this->resolveNames($tipe3, 'objectprodukfk', 'produk_m', 'namaproduk');

        return response()->json([
            'tipe1' => $tipe1,
            'tipe2' => $tipe2,
            'tipe3' => $tipe3,
            'message' => 'Success'
        ], 200);
    }

    /**
     * 
     */
    private function resolveNames(&$collection, $idField, $tableName, $nameField)
    {
        foreach ($collection as $item) {
            if (!$item->$idField) {
                $item->{$idField . '_names'} = '-';
                $item->{$idField . '_array'} = [];
                continue;
            }

            $ids = explode(',', $item->$idField);
            $names = DB::table($tableName)->whereIn('id', $ids)->pluck($nameField);
            $item->{$idField . '_names'} = implode(', ', $names);
            $item->{$idField . '_array'} = $ids;
        }
    }


    public function getComboMappingBKU(Request $request)
    {
        $kdProfile = 30;

        $rekening = DB::select("
            SELECT id, koderekening || ' - ' || namarekening AS text 
            FROM char_akun_pendapatan_m 
            WHERE statusenabled = TRUE AND headfk IS NOT NULL
            ORDER BY koderekening ASC
        ");

        $ruangan = DB::select("SELECT id, namaruangan AS text FROM ruangan_m WHERE statusenabled = TRUE ORDER BY namaruangan");
        $kelompokPasien = DB::select("SELECT id, kelompokpasien AS text FROM kelompokpasien_m WHERE statusenabled = TRUE ORDER BY kelompokpasien");
        $kelas = DB::select("SELECT id, namakelas AS text FROM kelas_m WHERE statusenabled = TRUE ORDER BY namakelas");
        $produk = DB::select("SELECT id, namaproduk AS text FROM produk_m WHERE statusenabled = TRUE ORDER BY namaproduk");

        return response()->json([
            'rekening' => $rekening,
            'ruangan' => $ruangan,
            'kelompokpasien' => $kelompokPasien,
            'kelas' => $kelas,
            'produk' => $produk,
        ], 200);
    }

    public function saveMappingBKU(Request $request)
    {
        $kdProfile = 30;
        $type = $request->input('type'); // 1, 2, or 3
        $data = $request->input('data');

        DB::beginTransaction();
        try {
            $tableName = '';
            $columns = [
                'kdprofile' => $kdProfile,
                'statusenabled' => true,
                'objectakunpendapatanfk' => $data['objectakunpendapatanfk'],
            ];

            if ($type == 1) {
                $tableName = 'mapbkuakun_t';
                $columns['objectkelompokpasienfk'] = is_array($data['objectkelompokpasienfk']) ? implode(',', $data['objectkelompokpasienfk']) : $data['objectkelompokpasienfk'];
                $columns['objectruanganfk'] = is_array($data['objectruanganfk']) ? implode(',', $data['objectruanganfk']) : $data['objectruanganfk'];
                $columns['objectkelasfk'] = is_array($data['objectkelasfk']) ? implode(',', $data['objectkelasfk']) : $data['objectkelasfk'];
                $columns['isobat'] = isset($data['isobat']) ? $data['isobat'] : null;
            } elseif ($type == 2) {
                $tableName = 'mapbkuakun3_t';
                $columns['objectprodukfk'] = is_array($data['objectprodukfk']) ? implode(',', $data['objectprodukfk']) : $data['objectprodukfk'];
            } elseif ($type == 3) {
                $tableName = 'mapbkuakun2_t';
                $columns['objectprodukfk'] = is_array($data['objectprodukfk']) ? implode(',', $data['objectprodukfk']) : $data['objectprodukfk'];
            }

            if (isset($data['id']) && $data['id']) {
                DB::table($tableName)->where('id', $data['id'])->update($columns);
            } else {
                DB::table($tableName)->insert($columns);
            }

   
            if (($type == 2 || $type == 3) && isset($columns['objectprodukfk'])) {
                $prodIds = explode(',', $columns['objectprodukfk']);
                foreach ($prodIds as $pid) {
                    $pid = trim($pid);
                    if (!$pid) continue;

                    $exist = DB::table('mapststoruangan_m')
                        ->where('kdprofile', $kdProfile)
                        ->where('produkfk', $pid)
                        ->where('departemenfk', 0)
                        ->whereNull('ruanganfk')
                        ->first();

                    if ($exist) {
                        DB::table('mapststoruangan_m')
                            ->where('norec', $exist->norec)
                            ->update([
                                'statusenabled' => true,
                                'objecturaianpendapatanfk' => $columns['objectakunpendapatanfk']
                            ]);
                    } else {
                        DB::table('mapststoruangan_m')->insert([
                            'norec' => $this->genUuid(),
                            'kdprofile' => $kdProfile,
                            'statusenabled' => true,
                            'produkfk' => $pid,
                            'departemenfk' => 0,
                            'ruanganfk' => null,
                            'objecturaianpendapatanfk' => $columns['objectakunpendapatanfk']
                        ]);
                    }
                }
            }

            DB::commit();
            return response()->json(['message' => 'Simpan Berhasil'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Gagal Simpan!', 'error' => $e->getMessage()], 400);
        }
    }


    public function deleteMappingBKU(Request $request)
    {
        $type = $request->input('type');
        $id = $request->input('id');

        $tableName = '';
        if ($type == 1) $tableName = 'mapbkuakun_t';
        elseif ($type == 2) $tableName = 'mapbkuakun3_t';
        elseif ($type == 3) $tableName = 'mapbkuakun2_t';

        try {
            DB::table($tableName)->where('id', $id)->update(['statusenabled' => false]);
            return response()->json(['message' => 'Hapus Berhasil'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Gagal Hapus!', 'error' => $e->getMessage()], 400);
        }
    }

    public function checkUnmappedTariffs(Request $request)
    {
        $kdProfile = 30;
        $noclosing = $request->input('noclosing'); // array of nopenerimaan

        if (empty($noclosing)) {
            return response()->json(['unmapped' => [], 'hasUnmapped' => false], 200);
        }

        $transactions = DB::select("
            SELECT DISTINCT 
                pr.id as produkfk, pr.namaproduk,
                pd.objectkelompokpasienlastfk as kelompokpasienfk, kp.kelompokpasien as namakelompokpasien,
                pd.objectruanganlastfk as ruanganfk, ru.namaruangan,
                ru.objectdepartemenfk as departemenfk,
                sbmcr.objectcarabayarfk as carabayarfk,
                apd.objectkelasfk as kelasfk, kl.namakelas,
                pp.isobat,
                COALESCE(SUM(
                    ((CASE WHEN pp.hargajual IS NULL THEN 0 ELSE pp.hargajual::float8 END 
                    - CASE WHEN pp.hargadiscount IS NULL THEN 0 ELSE pp.hargadiscount::float8 END) * pp.jumlah) 
                    + CASE WHEN pp.jasa IS NULL THEN 0 ELSE pp.jasa::float8 END
                ), 0) as total
            FROM strukclosing_t sc
            INNER JOIN strukbuktipenerimaan_t sbm ON sbm.noclosingfk = sc.norec
            INNER JOIN strukpelayanan_t sp ON sbm.nostrukfk = sp.norec
            INNER JOIN pasiendaftar_t pd ON sp.noregistrasifk = pd.norec
            INNER JOIN antrianpasiendiperiksa_t apd ON pd.norec = apd.noregistrasifk
            INNER JOIN pelayananpasien_t pp ON apd.norec = pp.noregistrasifk
            LEFT JOIN strukbuktipenerimaancarabayar_t sbmcr ON sbmcr.nosbmfk = sbm.norec
            LEFT JOIN produk_m pr ON pr.id = pp.produkfk
            LEFT JOIN kelompokpasien_m kp ON kp.id = pd.objectkelompokpasienlastfk
            LEFT JOIN ruangan_m ru ON ru.id = pd.objectruanganlastfk
            LEFT JOIN kelas_m kl ON kl.id = apd.objectkelasfk
            WHERE sc.noclosing IN('" . implode("','", $noclosing) . "')
            AND pd.statusenabled = TRUE
            AND sbm.statusenabled = TRUE
            GROUP BY pr.id, pr.namaproduk, pd.objectkelompokpasienlastfk, kp.kelompokpasien,
                pd.objectruanganlastfk, ru.namaruangan, ru.objectdepartemenfk, sbmcr.objectcarabayarfk, apd.objectkelasfk, kl.namakelas, pp.isobat
        ");

        $nonLayanan = DB::select("
            SELECT DISTINCT 
                pr.id as produkfk, pr.namaproduk,
                NULL as kelompokpasienfk, NULL as namakelompokpasien,
                NULL as ruanganfk, NULL as namaruangan, NULL as departemenfk,
                sck.carabayarfk,
                NULL as kelasfk, NULL as namakelas,
                NULL as isobat,
                COALESCE(SUM(spd.qtyproduk * spd.hargasatuan * spd.qtyoranglast), 0) as total
            FROM strukclosing_t sc
            INNER JOIN strukbuktipenerimaan_t sbm ON sbm.noclosingfk = sc.norec
            INNER JOIN strukpelayanan_t sp ON sbm.nostrukfk = sp.norec
            INNER JOIN strukpelayanandetail_t spd ON sp.norec = spd.nostrukfk
            INNER JOIN strukclosingkasir_t sck ON sc.norec = sck.noclosingfk
            LEFT JOIN produk_m pr ON pr.id = spd.objectprodukfk
            WHERE sc.noclosing IN('" . implode("','", $noclosing) . "')
            AND (sbm.keteranganlainnya = 'Pembayaran Tagihan Non Layanan' OR sbm.keteranganlainnya = 'Pembayaran Diklat')
            AND sbm.statusenabled = TRUE
            AND (sbm.keteranganlainnya = 'Pembayaran Tagihan Non Layanan' OR sbm.keteranganlainnya = 'Pembayaran Diklat')
            AND sbm.statusenabled = TRUE
            GROUP BY pr.id, pr.namaproduk, sck.carabayarfk
        ");

        $unmapped = [];
        
        foreach ($transactions as $trx) {
            $isMapped = false;

            if ($trx->produkfk) {
                $map2 = DB::selectOne("
                    SELECT id FROM mapbkuakun3_t 
                    WHERE statusenabled = TRUE 
                    AND kdprofile = ?
                    AND ?::VARCHAR = ANY(string_to_array(objectprodukfk, ','))
                ", [$kdProfile, $trx->produkfk]);
                if ($map2) $isMapped = true;
            }

            $trxRuangan = isset($trx->ruanganfk) ? $trx->ruanganfk : null;
            $trxKp = isset($trx->kelompokpasienfk) ? $trx->kelompokpasienfk : null;

            if (!$isMapped && $trxKp && $trxRuangan) {
                $map1Query = "
                    SELECT id FROM mapbkuakun_t 
                    WHERE statusenabled = TRUE 
                    AND kdprofile = ?
                    AND ?::VARCHAR = ANY(string_to_array(objectkelompokpasienfk, ','))
                    AND ?::VARCHAR = ANY(string_to_array(objectruanganfk, ','))
                ";
                $params = [$kdProfile, $trxKp, $trxRuangan];
                
                if ($trx->isobat === true || $trx->isobat === 't') {
                    $map1Query .= " AND isobat = TRUE";
                } else {
                    $map1Query .= " AND (isobat IS NULL OR isobat = FALSE)";
                }

                $map1 = DB::selectOne($map1Query, $params);
                if ($map1) $isMapped = true;
            }

            if ($trx->produkfk) {
                $isStsMapped = false;
                $isBypassed = false;
                
                $kp = isset($trx->kelompokpasienfk) ? $trx->kelompokpasienfk : 0;
                $dept = isset($trx->departemenfk) ? $trx->departemenfk : 0;
                $cb = isset($trx->carabayarfk) ? $trx->carabayarfk : 0;
                $ruanganPk = isset($trx->ruanganfk) ? $trx->ruanganfk : null;
                
                // Bypass warning if payment method is unidentified (likely not for STS)
                if ($cb == 0) {
                    $isBypassed = true;
                }

                // Logic bypass jika sudah ada mapping
                // 1. BPJS Rajal (KP != 0,1,12,18,8 && Dept != 0,16)
                if ($kp != 0 && $kp != 1 && $kp != 12 && $kp != 18 && $kp != 8 && $dept != 0 && $dept != 16) {
                    $isBypassed = true;
                }
                // 2. BPJS Ranap (KP != ... && Dept == 16)
                else if ($kp != 0 && $kp != 1 && $kp != 12 && $kp != 18 && $kp != 8 && $dept == 16) {
                    $isBypassed = true;
                }
                // 3. Jamkesos Rajal (KP == 18 && Dept != 16)
                else if ($kp == 18 && $dept != 0 && $dept != 16) {
                    $isBypassed = true;
                }
                // 4. Jamkesos Ranap (KP == 18 && Dept == 16)
                else if ($kp == 18 && $dept == 16) {
                    $isBypassed = true;
                }
                // 5. Jamkesda Rajal (KP == 8 && Dept != 16)
                else if ($kp == 8 && $dept != 0 && $dept != 16) {
                    $isBypassed = true;
                }
                // 6. Jamkesda Ranap (KP == 8 && Dept == 16)
                else if ($kp == 8 && $dept == 16) {
                    $isBypassed = true;
                }
                // 7. Tunai Rajal (KP 1/12 && Dept != 16 && CB == 1)
                else if (($kp == 1 || $kp == 12) && $dept != 16 && $cb == 1) {
                    $isBypassed = true;
                }
                // 8. Tunai Ranap (KP 1/12 && Dept == 16 && CB == 1)
                else if (($kp == 1 || $kp == 12) && $dept == 16 && $cb == 1) {
                    $isBypassed = true;
                }
                // 9. Transfer Rajal (KP 1/12 && Dept != 16 && CB == 3)
                else if (($kp == 1 || $kp == 12) && $dept != 16 && $cb == 3) {
                    $isBypassed = true;
                }
                // 10. Transfer Ranap (KP 1/12 && Dept == 16 && CB == 3)
                else if (($kp == 1 || $kp == 12) && $dept == 16 && $cb == 3) {
                    $isBypassed = true;
                }

                if ($isBypassed) {
                    $isMapped = true; // Auto-map if bypassed
                    $isStsMapped = true;
                } else {
                    // Check mapststoruangan_m
                    $stsMap = DB::selectOne("
                        SELECT norec FROM mapststoruangan_m 
                        WHERE statusenabled = TRUE 
                        AND kdprofile = ?
                        AND produkfk = ?
                        AND (
                            (departemenfk = ?) OR
                            (ruanganfk = ?) OR
                            (ruanganfk IS NULL)
                        )
                    ", [$kdProfile, $trx->produkfk, $dept, $ruanganPk]);
                    
                    if ($stsMap) $isStsMapped = true;
                }
                
                if (!$isStsMapped) {
                    $isMapped = false; 
                }
            }

            if (!$isMapped) {
                $unmapped[] = [
                    'produk' => $trx->namaproduk ?: '-',
                    'kelompokpasien' => $trx->namakelompokpasien ?: '-',
                    'ruangan' => $trx->namaruangan ?: '-',
                    'kelas' => $trx->namakelas ?: '-',
                    'isobat' => ($trx->isobat === true || $trx->isobat === 't') ? 'Ya' : '-',
                    'total' => $trx->total,
                    'tipe' => 'Layanan'
                ];
            }
        }

        foreach ($nonLayanan as $trx) {
            $isMapped = false;

            if ($trx->produkfk) {
                $map3 = DB::selectOne("
                    SELECT id FROM mapbkuakun2_t 
                    WHERE statusenabled = TRUE 
                    AND kdprofile = ?
                    AND ?::VARCHAR = ANY(string_to_array(objectprodukfk, ','))
                ", [$kdProfile, $trx->produkfk]);
                if ($map3) $isMapped = true;
            }

            if ($isMapped && $trx->produkfk) {
                 $stsMap = DB::selectOne("
                    SELECT norec FROM mapststoruangan_m 
                    WHERE statusenabled = TRUE 
                    AND kdprofile = ?
                    AND produkfk = ?
                    AND (
                        (departemenfk = 0) OR
                        (ruanganfk IS NULL)
                    )
                ", [$kdProfile, $trx->produkfk]);
                
                if (!$stsMap) {
                    $isMapped = false;
                }
            }

            if (!$isMapped) {
                $unmapped[] = [
                    'produk' => $trx->namaproduk ?: '-',
                    'kelompokpasien' => '-',
                    'ruangan' => '-',
                    'ruangan' => '-',
                    'kelas' => '-',
                    'isobat' => '-',
                    'total' => $trx->total,
                    'tipe' => 'Non-Layanan'
                ];
            }
        }

        return response()->json([
            'unmapped' => $unmapped,
            'hasUnmapped' => count($unmapped) > 0,
            'totalUnmapped' => count($unmapped)
        ], 200);
    }
    private function genUuid()
    {
        return substr(Uuid::generate(), 0, 32);
    }
}
