{{-- @extends('report.dom') --}}
@php
    function toUppercase($string) {
        if(is_null($string)) return '';
        $string = str_replace(['-', '_'], ' ', $string); 
        return ucwords(strtolower($string));
    }
    
    function getVal($item, ...$ids) {
        foreach ($ids as $id) {
            if ($id !== null && isset($item[$id]) && $item[$id] !== '' && $item[$id] !== null) {
                return is_array($item[$id]) ? ($item[$id]['text'] ?? '') : $item[$id];
            }
        }
        return '';
    }

    function isChecked($item, ...$ids) {
        foreach ($ids as $id) {
            if ($id !== null && isset($item[$id])) {
                $v = $item[$id];
                if (!empty($v) && $v != '0' && $v !== 'false' && $v !== false && $v !== 'undefined' && $v !== 'null') {
                    return true;
                }
            }
        }
        return false;
    }

    function renderCB($item, ...$ids) {
        if (isChecked($item, ...$ids)) {
            return '<span class="cb-box" style="font-family: DejaVu Sans;">&#10003;</span>';
        }
        return '<span class="cb-box" style="font-family: DejaVu Sans;">&nbsp;</span>';
    }

    function getCheckBox($value) {
        if (!empty($value) && $value != '0' && $value !== 'false' && $value !== false) {
            return '<span class="cb-box">&#10003;</span>';
        }
        return '<span class="cb-box">&nbsp;</span>';
    }

    // $emrFields = [
    // 3018100 => ['caption' => "Tanggal dan Jam", 'type' => "datetime"],
    // 3018101 => ['caption' => "Keluhan / Alasan Masuk ", 'type' => "textarea"],
    // 3018102 => ['caption' => "Tanda Vital", 'type' => "label4"],
    // 3018103 => ['caption' => "TD", 'type' => "textbox"],
    // 3018104 => ['caption' => "N", 'type' => "textbox"],
    // 3018105 => ['caption' => "RR", 'type' => "textbox"],
    // 3018106 => ['caption' => "T", 'type' => "textbox"],
    // 3018107 => ['caption' => "SaO2", 'type' => "textbox"],
    // 3018108 => ['caption' => "PEMERIKSAAN FISIK ", 'type' => "labelc"],
    // 3018109 => ['caption' => "DISABILITY", 'type' => "label4"],
    // 3018110 => ['caption' => "GCS :", 'type' => "textbox"],
    // 3018111 => ['caption' => "E :", 'type' => "textbox"],
    // 3018112 => ['caption' => "V :", 'type' => "textbox"],
    // 3018113 => ['caption' => "M :", 'type' => "textbox"],
    // 3018114 => ['caption' => "Kesadaran", 'type' => "label4"],
    // 3018115 => ['caption' => "Composmentis", 'type' => "checkbox6"],
    // 3018116 => ['caption' => "Apatis", 'type' => "checkbox6"],
    // 3018117 => ['caption' => "Somnolen", 'type' => "checkbox6"],
    // 3018118 => ['caption' => "Stupor", 'type' => "checkbox6"],
    // 3018119 => ['caption' => "Delirium", 'type' => "checkbox6"],
    // 3018120 => ['caption' => "Coma", 'type' => "checkbox6"],
    // 3018121 => ['caption' => "LiLA :", 'type' => "textbox"],
    // 3018122 => ['caption' => "LD :", 'type' => "textbox"],
    // 3018123 => ['caption' => "LK :", 'type' => "textbox"],
    // 3018124 => ['caption' => "BB : ", 'type' => "textbox"],
    // 3018125 => ['caption' => "TB :", 'type' => "textbox"],
    // 3018126 => ['caption' => "BB/U :", 'type' => "textbox"],
    // 3018127 => ['caption' => "PB /U :", 'type' => "textbox"],
    // 3018128 => ['caption' => "BB/PB :", 'type' => "textbox"],
    // 3018129 => ['caption' => "SKRINING NYERI", 'type' => "labelc"],
    // 3018130 => ['caption' => "Keluhan nyeri", 'type' => "label4"],
    // 3018131 => ['caption' => "Tidak ada", 'type' => "checkbox12"],
    // 3018132 => ['caption' => "Ada", 'type' => "checkbox12"],
    // 3018133 => ['caption' => "Lokasi", 'type' => "textbox"],
    // 3018134 => ['caption' => "Durasi", 'type' => "textbox"],
    // 3018135 => ['caption' => "SKRINING FUNGSIONAL", 'type' => "labelc"],
    // 3018136 => ['caption' => "Alat bantu : ", 'type' => "textbox"],
    // 3018137 => ['caption' => "Prothesa : ", 'type' => "textbox"],
    // 3018138 => ['caption' => "ADL", 'type' => "textbox"],
    // 3018139 => ['caption' => "mandiri", 'type' => "checkbox"],
    // 3018140 => ['caption' => "dibantu", 'type' => "checkbox"],
    // 3018142 => ['caption' => "0 -  < 1 tahun", 'type' => "checkbox4"],
    // 3018143 => ['caption' => "1 - 7 tahun", 'type' => "checkbox4"],
    // 3018144 => ['caption' => "> 7 tahun", 'type' => "checkbox4"],
    // 3018145 => ['caption' => "NIPS", 'type' => "label4"],
    // 3018146 => ['caption' => "(FLACC PAIN SCALE)", 'type' => "label4"],
    // 3018147 => ['caption' => "WONG BAKER FACES/NUMERIC)", 'type' => "label4"],
    // 3018148 => ['caption' => "0  (tidak nyeri)", 'type' => "checkbox4"],
    // 3018149 => ['caption' => "0  (tidak nyeri)", 'type' => "checkbox4"],
    // 3018150 => ['caption' => "0  (tidak nyeri)", 'type' => "checkbox4"],
    // 3018151 => ['caption' => "1 - 2 (Ringan)", 'type' => "checkbox4"],
    // 3018152 => ['caption' => "1 -3 (Ringan)", 'type' => "checkbox4"],
    // 3018153 => ['caption' => "1 - 3 (Ringan)", 'type' => "checkbox4"],
    // 3018154 => ['caption' => "3 - 4 (Sedang)", 'type' => "checkbox4"],
    // 3018155 => ['caption' => "4 - 6 (Sedang)", 'type' => "checkbox4"],
    // 3018156 => ['caption' => "4 - 6 (Sedang)", 'type' => "checkbox4"],
    // 3018157 => ['caption' => "7 - 10 (Berat)", 'type' => "checkbox4"],
    // 3018158 => ['caption' => "7 - 10 (Berat)", 'type' => "checkbox4"],
    // 3018159 => ['caption' => "7 - 10 (Berat)", 'type' => "checkbox4"],
    // 3018160 => ['caption' => "NUMERIC DAN WONG BAKER", 'type' => "labelc"],
    // 3018161 => ['caption' => "", 'type' => "baker"],
    // 3018162 => ['caption' => "0  Tidak Nyeri", 'type' => "checkbox"],
    // 3018163 => ['caption' => "1 - 3 Ringan", 'type' => "checkbox"],
    // 3018164 => ['caption' => "4 - 6 Sedang", 'type' => "checkbox"],
    // 3018165 => ['caption' => "7 -10 Berat", 'type' => "checkbox"],
    // 3018166 => ['caption' => "Wong Baker Tidak Nyeri", 'type' => "checkbox"],
    // 3018167 => ['caption' => "Sedikit Nyeri", 'type' => "checkbox"],
    // 3018168 => ['caption' => "Agak Mengganggu", 'type' => "checkbox"],
    // 3018169 => ['caption' => "Mengganggu aktivitas", 'type' => "checkbox"],
    // 3018170 => ['caption' => "Sangat mengganggu", 'type' => "checkbox"],
    // 3018171 => ['caption' => "Tak tertahankan", 'type' => "checkbox"],
    // 3018172 => ['caption' => "NYERI ANAK 1", 'type' => "checkbox"],
    // 3018173 => ['caption' => "2", 'type' => "checkbox"],
    // 3018174 => ['caption' => "3", 'type' => "checkbox"],
    // 3018175 => ['caption' => "4", 'type' => "checkbox"],
    // 3018176 => ['caption' => "5", 'type' => "checkbox"],
    // 3018177 => ['caption' => "6", 'type' => "checkbox"],
    // 3018178 => ['caption' => "SKRINING RISIKO JATUH", 'type' => "labelc"],
    // 3018179 => ['caption' => "", 'type' => "jatuh"],
    // 3018180 => ['caption' => "ya ", 'type' => "checkbox"],
    // 3018181 => ['caption' => "Tidak", 'type' => "checkbox"],
    // 3018182 => ['caption' => "ya ", 'type' => "checkbox"],
    // 3018183 => ['caption' => "Tidak", 'type' => "checkbox"],
    // 3018184 => ['caption' => "ya ", 'type' => "checkbox"],
    // 3018185 => ['caption' => "Tidak", 'type' => "checkbox"],
    // 3018186 => ['caption' => "Tidak Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point 1 / 2 ", 'type' => "checkbox12"],
    // 3018187 => ['caption' => "Ada Risiko Jatuh, bila ditemukan salah satu dari point 1 / 2 ", 'type' => "checkbox12"],
    // 3018188 => ['caption' => "Risiko Jatuh Tinggi, bila ditemukan 1 dan 2 ", 'type' => "checkbox12"],
    // 3018189 => ['caption' => "Tindakan :", 'type' => "label4"],
    // 3018190 => ['caption' => "Edukasi", 'type' => "checkbox12"],
    // 3018191 => ['caption' => "Pemberian Tanda Risiko Jatuh", 'type' => "checkbox12"],
    // 3018192 => ['caption' => "Pemberian Tempat Duduk Prioritas", 'type' => "checkbox12"],
    // 3018193 => ['caption' => "DATA FOKUS", 'type' => "labelc"],
    // 3018194 => ['caption' => "Batuk tidak efektif / tidak mampu batuk", 'type' => "checkbox6"],
    // 3018195 => ['caption' => "Penggunaan otot bantu nafas", 'type' => "checkbox6"],
    // 3018196 => ['caption' => "Sianosis", 'type' => "checkbox6"],
    // 3018197 => ['caption' => "Hiperglikemi", 'type' => "checkbox6"],
    // 3018198 => ['caption' => "Hipoglikemi", 'type' => "checkbox6"],
    // 3018199 => ['caption' => "Mengantuk", 'type' => "checkbox6"],
    // 3018200 => ['caption' => "Lesu", 'type' => "checkbox6"],
    // 3018201 => ['caption' => "Nadi perifier menurun / tidak teraba ", 'type' => "checkbox6"],
    // 3018202 => ['caption' => "Mengeluh mual dan muntah", 'type' => "checkbox6"],
    // 3018203 => ['caption' => "BAB cair > 3 kali/24 jam", 'type' => "checkbox6"],
    // 3018204 => ['caption' => "Turgor kulit menurun", 'type' => "checkbox6"],
    // 3018283 => ['caption' => "", 'type' => "textbox3"],
    // 3018205 => ['caption' => "Volume urin menurun ", 'type' => "checkbox6"],
    // 3018206 => ['caption' => "Rasa haus meningkat", 'type' => "checkbox6"],
    // 3018207 => ['caption' => "Status kesadaran ", 'type' => "checkbox6"],
    // 3018213 => ['caption' => "DIAGNOSIS KEPERAWATAN", 'type' => "labelc"],
    // 3018214 => ['caption' => "", 'type' => "label4"],
    // 3018215 => ['caption' => "Diagnosis Keperawatan", 'type' => "label4"],
    // 3018216 => ['caption' => "berhubungan dengan", 'type' => "label4"],
    // 3018217 => ['caption' => "ditandai dengan", 'type' => "label4"],
    // 3018218 => ['caption' => "Diare ", 'type' => "checkbox4"],
    // 3018219 => ['caption' => "", 'type' => "textbox3"],
    // 3018220 => ['caption' => "", 'type' => "textbox3"],
    // 3018221 => ['caption' => "Intoleransi Aktifitas", 'type' => "checkbox4"],
    // 3018222 => ['caption' => "", 'type' => "textbox3"],
    // 3018223 => ['caption' => "", 'type' => "textbox3"],
    // 3018224 => ['caption' => "Defisit Nutrisi ", 'type' => "checkbox4"],
    // 3018225 => ['caption' => "", 'type' => "textbox3"],
    // 3018226 => ['caption' => "", 'type' => "textbox3"],
    // 3018227 => ['caption' => "Waham", 'type' => "checkbox4"],
    // 3018228 => ['caption' => "", 'type' => "textbox3"],
    // 3018229 => ['caption' => "", 'type' => "textbox3"],
    // 3018230 => ['caption' => "Gangguan Integritas Kulit Jaringan", 'type' => "checkbox4"],
    // 3018231 => ['caption' => "", 'type' => "textbox3"],
    // 3018232 => ['caption' => "", 'type' => "textbox3"],
    // 3018233 => ['caption' => "Gangguan Mobilitas Fisik ", 'type' => "checkbox4"],
    // 3018234 => ['caption' => "", 'type' => "textbox3"],
    // 3018235 => ['caption' => "", 'type' => "textbox3"],
    // 3018236 => ['caption' => "Risiko Bunuh Diri", 'type' => "checkbox4"],
    // 3018237 => ['caption' => "", 'type' => "textbox3"],
    // 3018238 => ['caption' => "", 'type' => "textbox3"],
    // 3018239 => ['caption' => "Berduka ", 'type' => "checkbox4"],
    // 3018240 => ['caption' => "", 'type' => "textbox3"],
    // 3018241 => ['caption' => "", 'type' => "textbox3"],
    // 3018242 => ['caption' => "Risiko Perilaku Kekerasan", 'type' => "checkbox4"],
    // 3018243 => ['caption' => "", 'type' => "textbox3"],
    // 3018244 => ['caption' => "", 'type' => "textbox3"],
    // 3018245 => ['caption' => "Risiko Gangguan Intrigitas Kulit / Jaringan ", 'type' => "checkbox4"],
    // 3018246 => ['caption' => "", 'type' => "textbox3"],
    // 3018247 => ['caption' => "", 'type' => "textbox3"],
    // 3018248 => ['caption' => "Resiko Cidera ", 'type' => "checkbox4"],
    // 3018249 => ['caption' => "", 'type' => "textbox3"],
    // 3018250 => ['caption' => "", 'type' => "textbox3"],
    // 3018251 => ['caption' => "Pola Nafas Tidak Efektif", 'type' => "checkbox4"],
    // 3018252 => ['caption' => "", 'type' => "textbox3"],
    // 3018253 => ['caption' => "", 'type' => "textbox3"],
    // 3018254 => ['caption' => "Ketidakmampuan Koping Keluarga", 'type' => "checkbox4"],
    // 3018255 => ['caption' => "", 'type' => "textbox3"],
    // 3018256 => ['caption' => "", 'type' => "textbox3"],
    // 3018257 => ['caption' => "Ketegangan Peran Pemberi Asuhan", 'type' => "checkbox4"],
    // 3018258 => ['caption' => "", 'type' => "textbox3"],
    // 3018259 => ['caption' => "", 'type' => "textbox3"],
    // 3018260 => ['caption' => "Ansietas", 'type' => "checkbox4"],
    // 3018261 => ['caption' => "", 'type' => "textbox3"],
    // 3018262 => ['caption' => "", 'type' => "textbox3"],
    // 3018263 => ['caption' => "Harga Diri Rendah Situasional", 'type' => "checkbox4"],
    // 3018264 => ['caption' => "", 'type' => "textbox3"],
    // 3018265 => ['caption' => "", 'type' => "textbox3"],
    // 3018209 => ['caption' => "P", 'type' => "checkbox"],
    // 3018210 => ['caption' => "V", 'type' => "checkbox"],
    // 3018211 => ['caption' => "U", 'type' => "checkbox"],
    // 3018266 => ['caption' => "Gangguan Persepsi Sensori", 'type' => "checkbox4"],
    // 3018267 => ['caption' => "", 'type' => "textbox3"],
    // 3018268 => ['caption' => "", 'type' => "textbox3"],
    // 3018269 => ['caption' => "Ganggguan Citra Tubuh", 'type' => "checkbox4"],
    // 3018270 => ['caption' => "", 'type' => "textbox3"],
    // 3018271 => ['caption' => "", 'type' => "textbox3"],
    // 3018272 => ['caption' => "Gangguan Rasa Nyaman", 'type' => "checkbox4"],
    // 3018273 => ['caption' => "", 'type' => "textbox3"],
    // 3018274 => ['caption' => "", 'type' => "textbox3"],
    // 3018275 => ['caption' => "Keputusasaan", 'type' => "checkbox4"],
    // 3018276 => ['caption' => "", 'type' => "textbox3"],
    // 3018277 => ['caption' => "", 'type' => "textbox3"],
    // 3018278 => ['caption' => "Ketidakberdayaan ", 'type' => "checkbox4"],
    // 3018279 => ['caption' => "", 'type' => "textbox3"],
    // 3018280 => ['caption' => "", 'type' => "textbox3"],
    // 3018281 => ['caption' => "Distres Spiritual", 'type' => "checkbox4"],
    // 3018282 => ['caption' => "", 'type' => "textbox3"],
    // 3018284 => ['caption' => "Penampilan Peran Tidak Efektif", 'type' => "checkbox4"],
    // 3018285 => ['caption' => "", 'type' => "textbox3"],
    // 3018286 => ['caption' => "", 'type' => "textbox3"],
    // 3018287 => ['caption' => "Gangguan Memori", 'type' => "checkbox4"],
    // 3018288 => ['caption' => "", 'type' => "textbox3"],
    // 3018289 => ['caption' => "", 'type' => "textbox3"],
    // 3018290 => ['caption' => "Perilaku Kekerasan", 'type' => "checkbox4"],
    // 3018291 => ['caption' => "", 'type' => "textbox3"],
    // 3018292 => ['caption' => "", 'type' => "textbox3"],
    // 3018293 => ['caption' => "Isoloasi Sosial", 'type' => "checkbox4"],
    // 3018294 => ['caption' => "", 'type' => "textbox3"],
    // 3018295 => ['caption' => "", 'type' => "textbox3"],
    // 3018296 => ['caption' => "Harga Diri Rendah Kronis", 'type' => "checkbox4"],
    // 3018297 => ['caption' => "", 'type' => "textbox3"],
    // 3018298 => ['caption' => "", 'type' => "textbox3"],
    // 3018299 => ['caption' => "Defisit Perawatan Diri", 'type' => "checkbox4"],
    // 3018300 => ['caption' => "", 'type' => "textbox3"],
    // 3018301 => ['caption' => "", 'type' => "textbox3"],
    // 3018302 => ['caption' => "Gangguan Komunikasi Verbal", 'type' => "checkbox4"],
    // 3018303 => ['caption' => "", 'type' => "textbox3"],
    // 3018304 => ['caption' => "", 'type' => "textbox3"],
    // 3018305 => ['caption' => "Manajemen Kesehatan Tidak Efektif", 'type' => "checkbox4"],
    // 3018306 => ['caption' => "", 'type' => "textbox3"],
    // 3018307 => ['caption' => "", 'type' => "textbox3"],
    // 3018308 => ['caption' => "Deprivasitidur", 'type' => "checkbox4"],
    // 3018309 => ['caption' => "", 'type' => "textbox3"],
    // 3018310 => ['caption' => "", 'type' => "textbox3"],
    // 3018311 => ['caption' => "Koping Tidak Efektif", 'type' => "checkbox4"],
    // 3018312 => ['caption' => "", 'type' => "textbox3"],
    // 3018313 => ['caption' => "", 'type' => "textbox3"],
    // 3018314 => ['caption' => "Kesiapan Peningkatan Manajemen Kesehatan", 'type' => "checkbox4"],
    // 3018315 => ['caption' => "", 'type' => "textbox3"],
    // 3018316 => ['caption' => "", 'type' => "textbox3"],
    // 3018317 => ['caption' => "Kesiapan Peningkatan Konsep Diri", 'type' => "checkbox4"],
    // 3018318 => ['caption' => "", 'type' => "textbox3"],
    // 3018319 => ['caption' => "", 'type' => "textbox3"],
    // 3018320 => ['caption' => "Defisit Pengetahuan", 'type' => "checkbox4"],
    // 3018321 => ['caption' => "", 'type' => "textbox3"],
    // 3018322 => ['caption' => "", 'type' => "textbox3"],
    // 3018323 => ['caption' => "Penurunan Curah Jantung", 'type' => "checkbox4"],
    // 3018324 => ['caption' => "", 'type' => "textbox3"],
    // 3018325 => ['caption' => "", 'type' => "textbox3"],
    // 3018326 => ['caption' => "Manajemen Kesehatan Keluarga Tidak Efektif", 'type' => "checkbox4"],
    // 3018327 => ['caption' => "", 'type' => "textbox3"],
    // 3018328 => ['caption' => "", 'type' => "textbox3"],
    // 3018329 => ['caption' => "Hipotermia", 'type' => "checkbox4"],
    // 3018330 => ['caption' => "", 'type' => "textbox3"],
    // 3018331 => ['caption' => "", 'type' => "textbox3"],
    // 3018332 => ['caption' => "Bersihan Jalan Nafas Tidak Efektif", 'type' => "checkbox4"],
    // 3018333 => ['caption' => "", 'type' => "textbox3"],
    // 3018334 => ['caption' => "", 'type' => "textbox3"],
    // 3018335 => ['caption' => "Ketidakstabilan Kadar Glukosa Darah", 'type' => "checkbox4"],
    // 3018336 => ['caption' => "", 'type' => "textbox3"],
    // 3018337 => ['caption' => "", 'type' => "textbox3"],
    // 3018338 => ['caption' => "Perfusi Perifer Tidak Efektif", 'type' => "checkbox4"],
    // 3018339 => ['caption' => "", 'type' => "textbox3"],
    // 3018340 => ['caption' => "", 'type' => "textbox3"],
    // 3018341 => ['caption' => "Naussea", 'type' => "checkbox4"],
    // 3018342 => ['caption' => "", 'type' => "textbox3"],
    // 3018343 => ['caption' => "", 'type' => "textbox3"],
    // 3018344 => ['caption' => "Risiko Infeksi", 'type' => "checkbox4"],
    // 3018345 => ['caption' => "", 'type' => "textbox3"],
    // 3018346 => ['caption' => "", 'type' => "textbox3"],
    // 3018347 => ['caption' => "Sindrom Putus Zat Akut", 'type' => "checkbox4"],
    // 3018348 => ['caption' => "", 'type' => "textbox3"],
    // 3018349 => ['caption' => "", 'type' => "textbox3"],
    // 3018350 => ['caption' => "Kunfusi Akut", 'type' => "checkbox4"],
    // 3018351 => ['caption' => "", 'type' => "textbox3"],
    // 3018352 => ['caption' => "", 'type' => "textbox3"],
    // 3018353 => ['caption' => "Ketidakpatuhan", 'type' => "checkbox4"],
    // 3018354 => ['caption' => "", 'type' => "textbox3"],
    // 3018355 => ['caption' => "", 'type' => "textbox3"],
    // 3018356 => ['caption' => "Koping Tidak Efektif", 'type' => "checkbox4"],
    // 3018357 => ['caption' => "", 'type' => "textbox3"],
    // 3018358 => ['caption' => "", 'type' => "textbox3"],
    // 3018359 => ['caption' => "Risiko Jatuh", 'type' => "checkbox4"],
    // 3018360 => ['caption' => "", 'type' => "textbox3"],
    // 3018361 => ['caption' => "", 'type' => "textbox3"],
    // 3018362 => ['caption' => "Hipovolemia", 'type' => "checkbox4"],
    // 3018363 => ['caption' => "", 'type' => "textbox3"],
    // 3018364 => ['caption' => "", 'type' => "textbox3"],
    // 3018365 => ['caption' => "Hipertermia", 'type' => "checkbox4"],
    // 3018366 => ['caption' => "", 'type' => "textbox3"],
    // 3018367 => ['caption' => "", 'type' => "textbox3"],
    // 3018368 => ['caption' => "Hipervolemia", 'type' => "checkbox4"],
    // 3018369 => ['caption' => "", 'type' => "textbox3"],
    // 3018370 => ['caption' => "", 'type' => "textbox3"],
    // 3018371 => ['caption' => "Nyeri Akut", 'type' => "checkbox4"],
    // 3018372 => ['caption' => "", 'type' => "textbox3"],
    // 3018373 => ['caption' => "", 'type' => "textbox3"],
    // 3018374 => ['caption' => "Nyeri Kronis", 'type' => "checkbox4"],
    // 3018375 => ['caption' => "", 'type' => "textbox3"],
    // 3018376 => ['caption' => "", 'type' => "textbox3"],
    // 3018377 => ['caption' => "Inkontinensia Urin Fungsional", 'type' => "checkbox4"],
    // 3018378 => ['caption' => "", 'type' => "textbox3"],
    // 3018379 => ['caption' => "", 'type' => "textbox3"],
    // 3018380 => ['caption' => "Inkontinensia Fekal", 'type' => "checkbox4"],
    // 3018381 => ['caption' => "", 'type' => "textbox3"],
    // 3018382 => ['caption' => "", 'type' => "textbox3"],
    // 3018383 => ['caption' => "Risiko Gangguan Perkembangan", 'type' => "checkbox4"],
    // 3018384 => ['caption' => "", 'type' => "textbox3"],
    // 3018385 => ['caption' => "", 'type' => "textbox3"],
    // 3018386 => ['caption' => "Gangguan Tumbuh Kembang", 'type' => "checkbox4"],
    // 3018387 => ['caption' => "", 'type' => "textbox3"],
    // 3018388 => ['caption' => "", 'type' => "textbox3"],
    // 3018389 => ['caption' => "Risiko Gangguan Pertumbuhan ", 'type' => "checkbox4"],
    // 3018390 => ['caption' => "", 'type' => "textbox3"],
    // 3018391 => ['caption' => "", 'type' => "textbox3"],
    // 3018392 => ['caption' => "Paraf DPJP", 'type' => "combobox"],
    // 3018393 => ['caption' => "SKRINING RISIKO NUTRISIONAL", 'type' => "labelc"],
    // 3018394 => ['caption' => "", 'type' => "mst"],
    // 3018395 => ['caption' => "Tidak 0", 'type' => "checkbox"],
    // 3018396 => ['caption' => "Ya 2", 'type' => "checkbox"],
    // 3018397 => ['caption' => "Tidak 0", 'type' => "checkbox"],
    // 3018398 => ['caption' => "Ya 1", 'type' => "checkbox"],
    // 3018399 => ['caption' => "Tidak 0", 'type' => "checkbox"],
    // 3018400 => ['caption' => "Ya 1", 'type' => "checkbox"],
    // 3018401 => ['caption' => "Tidak 0", 'type' => "checkbox"],
    // 3018402 => ['caption' => "Ya 1", 'type' => "checkbox"],
    // 3018403 => ['caption' => "Tidak 0 ", 'type' => "checkbox"],
    // 3018404 => ['caption' => "Ya 1", 'type' => "checkbox"],
    // 3018405 => ['caption' => "Tidak 0", 'type' => "checkbox"],
    // 3018406 => ['caption' => "Ya 1", 'type' => "checkbox"],
    // 3018407 => ['caption' => "Tidak 0", 'type' => "checkbox"],
    // 3018408 => ['caption' => "Ya 1", 'type' => "checkbox"],
    // 3018409 => ['caption' => "total skor", 'type' => "textbox"],
    // 3018410 => ['caption' => "6", 'type' => "checkbox"],
    // 3018411 => ['caption' => "", 'type' => "barthel"],
    // 3018412 => ['caption' => "SKRINING GIZI DEWASA", 'type' => "label"],
    // 3018413 => ['caption' => "Tidak 0", 'type' => "checkbox"],
    // 3018414 => ['caption' => "ragu 2", 'type' => "checkbox"],
    // 3018415 => ['caption' => "1", 'type' => "checkbox"],
    // 3018416 => ['caption' => "2", 'type' => "checkbox"],
    // 3018417 => ['caption' => "3", 'type' => "checkbox"],
    // 3018418 => ['caption' => "4", 'type' => "checkbox"],
    // 3018419 => ['caption' => "1", 'type' => "checkbox"],
    // 3018420 => ['caption' => "tidak 0", 'type' => "checkbox"],
    // 3018421 => ['caption' => "ragu 2", 'type' => "checkbox"],
    // 3018422 => ['caption' => "total skor", 'type' => "textbox"],
    // 3018423 => ['caption' => "diagnosa ya", 'type' => "checkbox"],
    // 3018424 => ['caption' => "tidak", 'type' => "checkbox"],
    // 3018425 => ['caption' => "dewasa DM", 'type' => "checkbox"],
    // 3018426 => ['caption' => "Hipertensi", 'type' => "checkbox"],
    // 3018427 => ['caption' => "Geriarti", 'type' => "checkbox"],
    // 3018428 => ['caption' => "Infeksi TB", 'type' => "checkbox"],
    // 3018429 => ['caption' => "Infeksi Hepatitis", 'type' => "checkbox"],
    // 3018430 => ['caption' => "Lain lain", 'type' => "checkbox"],
    // 3018431 => ['caption' => "Sebutkan", 'type' => "textbox"],
    // 3018432 => ['caption' => "Perawat", 'type' => "combobox"],
    // 3018433 => ['caption' => "", 'type' => "humpty"],
    // 3018434 => ['caption' => "TUJUAN", 'type' => "label"],
    // 3018435 => ['caption' => "Jam", 'type' => "textbox"],
    // 3018436 => ['caption' => "Bersihan jalan meningkat", 'type' => "checkbox"],
    // 3018437 => ['caption' => "Ventilasi adekuat", 'type' => "checkbox"],
    // 3018438 => ['caption' => "Curah jantung meningkat", 'type' => "checkbox"],
    // 3018439 => ['caption' => "Kadar glukosa darah dalam rentang normal", 'type' => "checkbox"],
    // 3018440 => ['caption' => "Perfusi perifer meningkat", 'type' => "checkbox"],
    // 3018441 => ['caption' => "Nausea menurun", 'type' => "checkbox"],
    // 3018442 => ['caption' => "Status nutrisi membaik", 'type' => "checkbox"],
    // 3018443 => ['caption' => "Defekasi normal", 'type' => "checkbox"],
    // 3018444 => ['caption' => "Integritas kulit", 'type' => "checkbox"],
    // 3018445 => ['caption' => "Status cairan membaik ", 'type' => "checkbox"],
    // 3018446 => ['caption' => "Suhu dalam rentang normal", 'type' => "checkbox"],
    // 3018447 => ['caption' => "Keseimbangan cairan meningkat", 'type' => "checkbox"],
    // 3018448 => ['caption' => "Tingkat nyeri menurun", 'type' => "checkbox"],
    // 3018449 => ['caption' => "Kontinensia urine / vekal membaik", 'type' => "checkbox"],
    // 3018451 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018452 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018453 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018454 => ['caption' => "lain lain ", 'type' => "textbox"],
    // 3018455 => ['caption' => "TINDAKAN", 'type' => "label"],
    // 3018456 => ['caption' => "Latihan batuk efektif", 'type' => "checkbox"],
    // 3018457 => ['caption' => "Manajemen jalan nafas", 'type' => "checkbox"],
    // 3018458 => ['caption' => "Pemantauan respirasi", 'type' => "checkbox"],
    // 3018459 => ['caption' => "Manajemen ashma", 'type' => "checkbox"],
    // 3018460 => ['caption' => "Edukasi keluarga tentang ", 'type' => "checkbox"],
    // 3018461 => ['caption' => "isian", 'type' => "textbox"],
    // 3018462 => ['caption' => "Edukasi pasien tentang", 'type' => "checkbox"],
    // 3018463 => ['caption' => "isian", 'type' => "textbox"],
    // 3018464 => ['caption' => "Dukungan Ventilasi", 'type' => "checkbox"],
    // 3018465 => ['caption' => "Perawatan Jantung", 'type' => "checkbox"],
    // 3018466 => ['caption' => "Resusitasi jantung paru", 'type' => "checkbox"],
    // 3018467 => ['caption' => "Manajemen hiperglikemi", 'type' => "checkbox"],
    // 3018468 => ['caption' => "Manajemen hipoglikemi", 'type' => "checkbox"],
    // 3018469 => ['caption' => "Perawatan sirkulasi", 'type' => "checkbox"],
    // 3018470 => ['caption' => "Manajemen mual", 'type' => "checkbox"],
    // 3018471 => ['caption' => "Manajemen muntah", 'type' => "checkbox"],
    // 3018472 => ['caption' => "Manajemen nutrisi ", 'type' => "checkbox"],
    // 3018473 => ['caption' => "isian", 'type' => "textbox"],
    // 3018474 => ['caption' => "Manajemen diare", 'type' => "checkbox"],
    // 3018475 => ['caption' => "Pemantauan cairan", 'type' => "checkbox"],
    // 3018476 => ['caption' => "Perawatan luka", 'type' => "checkbox"],
    // 3018477 => ['caption' => "Penjahitan luka", 'type' => "checkbox"],
    // 3018478 => ['caption' => "Manajemen kesehatan lingkungan", 'type' => "checkbox"],
    // 3018479 => ['caption' => "isian", 'type' => "textbox"],
    // 3018480 => ['caption' => "Manajemen kejang", 'type' => "checkbox"],
    // 3018481 => ['caption' => "Manajemen hipovolemia / syok hipovolemia", 'type' => "checkbox"],
    // 3018482 => ['caption' => "Manajemen hipertermi / hipotermia", 'type' => "checkbox"],
    // 3018483 => ['caption' => "Manajemen hipervolemia", 'type' => "checkbox"],
    // 3018484 => ['caption' => "Manajemen nyeri", 'type' => "checkbox"],
    // 3018485 => ['caption' => "Pemberian analgetik", 'type' => "checkbox"],
    // 3018486 => ['caption' => "Terapi relaxasi", 'type' => "checkbox"],
    // 3018487 => ['caption' => "Manajemen inkontinensia urine / vekal", 'type' => "checkbox"],
    // 3018488 => ['caption' => "Lain ", 'type' => "textbox"],
    // 3018489 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018490 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018491 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018492 => ['caption' => "IMPLEMENTASI ", 'type' => "label"],
    // 3018493 => ['caption' => "Tanggal", 'type' => "datetime"],
    // 3018494 => ['caption' => "Latihan batuk efektif", 'type' => "checkbox"],
    // 3018495 => ['caption' => "Manajemen jalan nafas", 'type' => "checkbox"],
    // 3018496 => ['caption' => "Pemantauan respirasi", 'type' => "checkbox"],
    // 3018497 => ['caption' => "Manajemen ashma", 'type' => "checkbox"],
    // 3018498 => ['caption' => "Edukasi keluarga tentang ", 'type' => "checkbox"],
    // 3018499 => ['caption' => "isian", 'type' => "textbox"],
    // 3018500 => ['caption' => "Edukasi pasien tentang", 'type' => "checkbox"],
    // 3018501 => ['caption' => "isian", 'type' => "textbox"],
    // 3018502 => ['caption' => "Dukungan Ventilasi", 'type' => "checkbox"],
    // 3018503 => ['caption' => "Perawatan Jantung", 'type' => "checkbox"],
    // 3018504 => ['caption' => "Resusitasi jantung paru", 'type' => "checkbox"],
    // 3018505 => ['caption' => "Manajemen hiperglikemi", 'type' => "checkbox"],
    // 3018506 => ['caption' => "Manajemen hipoglikemi", 'type' => "checkbox"],
    // 3018507 => ['caption' => "Perawatan sirkulasi", 'type' => "checkbox"],
    // 3018508 => ['caption' => "Manajemen mual", 'type' => "checkbox"],
    // 3018509 => ['caption' => "Manajemen muntah", 'type' => "checkbox"],
    // 3018510 => ['caption' => "Manajemen nutrisi ", 'type' => "checkbox"],
    // 3018511 => ['caption' => "isian", 'type' => "textbox"],
    // 3018512 => ['caption' => "Manajemen diare", 'type' => "checkbox"],
    // 3018513 => ['caption' => "Pemantauan cairan", 'type' => "checkbox"],
    // 3018514 => ['caption' => "Perawatan luka", 'type' => "checkbox"],
    // 3018515 => ['caption' => "Penjahitan luka", 'type' => "checkbox"],
    // 3018516 => ['caption' => "Manajemen kesehatan lingkungan", 'type' => "checkbox"],
    // 3018517 => ['caption' => "isian", 'type' => "textbox"],
    // 3018518 => ['caption' => "Manajemen kejang", 'type' => "checkbox"],
    // 3018519 => ['caption' => "Manajemen hipovolemia / syok hipovolemia", 'type' => "checkbox"],
    // 3018520 => ['caption' => "Manajemen hipertermi / hipotermia", 'type' => "checkbox"],
    // 3018521 => ['caption' => "Manajemen hipervolemia", 'type' => "checkbox"],
    // 3018522 => ['caption' => "Manajemen nyeri", 'type' => "checkbox"],
    // 3018523 => ['caption' => "Pemberian analgetik", 'type' => "checkbox"],
    // 3018524 => ['caption' => "Terapi relaxasi", 'type' => "checkbox"],
    // 3018525 => ['caption' => "Manajemen inkontinensia urine / vekal", 'type' => "checkbox"],
    // 3018526 => ['caption' => "Lain ", 'type' => "textbox"],
    // 3018527 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018528 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018529 => ['caption' => "lain ", 'type' => "textbox"],
    // 3018530 => ['caption' => "perawat", 'type' => "combobox"],
    // 3018531 => ['caption' => "Tanggal", 'type' => "datetime"],
    // 3018532 => ['caption' => "Evaluasi ", 'type' => "textbox"],
    // 3018533 => ['caption' => "Perawat", 'type' => "combobox"],
    // 3018534 => ['caption' => "Identifikasi perilaku jenis bunuh diri", 'type' => "checkbox"],
    // 3018450 => ['caption' => "Tidak terjadi cidera", 'type' => "checkbox"],
    // 3018141 => ['caption' => "SKOR NYERI ", 'type' => "labelc"],
    // 3018208 => ['caption' => "A", 'type' => "checkbox"],
    // 3018212 => ['caption' => "Lainnya", 'type' => "textarea"],
    // 3018536 => ['caption' => "Diagnosis Lainnya", 'type' => "textbox"],
    // 3018535 => ['caption' => "IMT :", 'type' => "textbox"],
    // 3018537 => ['caption' => "SKRINING GIZI MINI NUTRISIONAL ASSESMENT (MNA) UNTUK PASIEN GERIATRI (USIA > 60 TAHUN)", 'type' => "mna"],
    // 3018538 => ['caption' => "A. Apakah asupan makanan berkurang selama 3 bulan terakhir?", 'type' => "label"],
    // 3018539 => ['caption' => "0 = Asupan makanan sangat berkurang", 'type' => "checkbox"],
    // 3018540 => ['caption' => "1 = Asupan makanan agak berkurang", 'type' => "checkbox"],
    // 3018541 => ['caption' => "2 = Asupan makanan tidak berkurang", 'type' => "checkbox"],
    // 3018542 => ['caption' => "B. Berat badan turun selama 3 bulan terakhir?", 'type' => "label"],
    // 3018543 => ['caption' => "0 = Berat badan turun lebih dari 3 kg", 'type' => "checkbox"],
    // 3018544 => ['caption' => "1 = Tidak tahu", 'type' => "checkbox"],
    // 3018545 => ['caption' => "2 = Berat badan turun antara 1 hingga 3 kg", 'type' => "checkbox"],
    // 3018546 => ['caption' => "3 = Berat badan tidak turun", 'type' => "checkbox"],
    // 3018547 => ['caption' => "C. Pergerakan atau Mobilitas?", 'type' => "label"],
    // 3018548 => ['caption' => "0 = Terbatas di tempat tidur atau kursi", 'type' => "checkbox"],
    // 3018549 => ['caption' => "1 = Mampu bangun dari tempat tidur/kursi, tapi tidak bisa keluar", 'type' => "checkbox"],
    // 3018550 => ['caption' => "2 = Dapat bepergian ke luar rumah", 'type' => "checkbox"],
    // 3018551 => ['caption' => "D. Mengalami tekanan psikologis atau penyakit akut (3 bln terakhir)?", 'type' => "label"],
    // 3018552 => ['caption' => "0 = Ya", 'type' => "checkbox"],
    // 3018553 => ['caption' => "2 = Tidak", 'type' => "checkbox"],
    // 3018554 => ['caption' => "E. Gangguan neuropsikologis", 'type' => "label"],
    // 3018555 => ['caption' => "0 = Demensia berat atau depresi", 'type' => "checkbox"],
    // 3018557 => ['caption' => "2 = Tidak ada gangguan psikologis", 'type' => "checkbox"],
    // 3018558 => ['caption' => "F1. Indeks Massa Tubuh (IMT)", 'type' => "label"],
    // 3018559 => ['caption' => "0 = IMT kurang dari 19", 'type' => "checkbox"],
    // 3018560 => ['caption' => "1 = IMT 19 hingga kurang dari 21", 'type' => "checkbox"],
    // 3018561 => ['caption' => "2 = IMT 21 hingga kurang dari 23", 'type' => "checkbox"],
    // 3018562 => ['caption' => "3 = IMT 23 atau lebih besar", 'type' => "checkbox"],
    // 3018563 => ['caption' => "F2. Lingkar lengan atas (LiLA) - Jika IMT tidak dapat diukur", 'type' => "label"],
    // 3018564 => ['caption' => "0,0 = LiLA kurang dari 21", 'type' => "checkbox"],
    // 3018565 => ['caption' => "0,5 = LiLA 21 hingga 22", 'type' => "checkbox"],
    // 3018566 => ['caption' => "1,0 = LiLA lebih dari 22", 'type' => "checkbox"],
    // 3018567 => ['caption' => "Total Skor Skrining", 'type' => "textbox"],
    // 3018556 => ['caption' => "1 = Demensia ringan", 'type' => "checkbox"],
    // 1901310025 => ['caption' => "Masalah Keperawatan", 'type' => "textarea"],
    // ];

    $diagnoses = [
        ['cb' => 3018218, 'bd' => 3018219, 'dd' => 3018220, 'name' => 'Diare'],
        ['cb' => 3018221, 'bd' => 3018222, 'dd' => 3018223, 'name' => 'Intoleransi Aktifitas'],
        ['cb' => 3018224, 'bd' => 3018225, 'dd' => 3018226, 'name' => 'Defisit Nutrisi'],
        ['cb' => 3018227, 'bd' => 3018228, 'dd' => 3018229, 'name' => 'Waham'],
        ['cb' => 3018230, 'bd' => 3018231, 'dd' => 3018232, 'name' => 'Gangguan Integritas Kulit Jaringan'],
        ['cb' => 3018233, 'bd' => 3018234, 'dd' => 3018235, 'name' => 'Gangguan Mobilitas Fisik'],
        ['cb' => 3018236, 'bd' => 3018237, 'dd' => 3018238, 'name' => 'Risiko Bunuh Diri'],
        ['cb' => 3018239, 'bd' => 3018240, 'dd' => 3018241, 'name' => 'Berduka'],
        ['cb' => 3018242, 'bd' => 3018243, 'dd' => 3018244, 'name' => 'Risiko Perilaku Kekerasan'],
        ['cb' => 3018245, 'bd' => 3018246, 'dd' => 3018247, 'name' => 'Risiko Gangguan Intrigitas Kulit / Jaringan'],
        ['cb' => 3018248, 'bd' => 3018249, 'dd' => 3018250, 'name' => 'Resiko Cidera'],
        ['cb' => 3018251, 'bd' => 3018252, 'dd' => 3018253, 'name' => 'Pola Nafas Tidak Efektif'],
        ['cb' => 3018254, 'bd' => 3018255, 'dd' => 3018256, 'name' => 'Ketidakmampuan Koping Keluarga'],
        ['cb' => 3018257, 'bd' => 3018258, 'dd' => 3018259, 'name' => 'Ketegangan Peran Pemberi Asuhan'],
        ['cb' => 3018260, 'bd' => 3018261, 'dd' => 3018262, 'name' => 'Ansietas'],
        ['cb' => 3018263, 'bd' => 3018264, 'dd' => 3018265, 'name' => 'Harga Diri Rendah Situasional'],
        ['cb' => 3018266, 'bd' => 3018267, 'dd' => 3018268, 'name' => 'Gangguan Persepsi Sensori'],
        ['cb' => 3018269, 'bd' => 3018270, 'dd' => 3018271, 'name' => 'Ganggguan Citra Tubuh'],
        ['cb' => 3018272, 'bd' => 3018273, 'dd' => 3018274, 'name' => 'Gangguan Rasa Nyaman'],
        ['cb' => 3018275, 'bd' => 3018276, 'dd' => 3018277, 'name' => 'Keputusasaan'],
        ['cb' => 3018278, 'bd' => 3018279, 'dd' => 3018280, 'name' => 'Ketidakberdayaan'],
        ['cb' => 3018281, 'bd' => 3018282, 'dd' => 3018283, 'name' => 'Distres Spiritual'],
        ['cb' => 3018284, 'bd' => 3018285, 'dd' => 3018286, 'name' => 'Penampilan Peran Tidak Efektif'],
        ['cb' => 3018287, 'bd' => 3018288, 'dd' => 3018289, 'name' => 'Gangguan Memori'],
        ['cb' => 3018290, 'bd' => 3018291, 'dd' => 3018292, 'name' => 'Perilaku Kekerasan'],
        ['cb' => 3018293, 'bd' => 3018294, 'dd' => 3018295, 'name' => 'Isoloasi Sosial'],
        ['cb' => 3018296, 'bd' => 3018297, 'dd' => 3018298, 'name' => 'Harga Diri Rendah Kronis'],
        ['cb' => 3018299, 'bd' => 3018300, 'dd' => 3018301, 'name' => 'Defisit Perawatan Diri'],
        ['cb' => 3018302, 'bd' => 3018303, 'dd' => 3018304, 'name' => 'Gangguan Komunikasi Verbal'],
        ['cb' => 3018305, 'bd' => 3018306, 'dd' => 3018307, 'name' => 'Manajemen Kesehatan Tidak Efektif'],
        ['cb' => 3018308, 'bd' => 3018309, 'dd' => 3018310, 'name' => 'Deprivasitidur'],
        ['cb' => [3018311, 3018356], 'bd' => [3018312, 3018357], 'dd' => [3018313, 3018358], 'name' => 'Koping Tidak Efektif'],
        ['cb' => 3018314, 'bd' => 3018315, 'dd' => 3018316, 'name' => 'Kesiapan Peningkatan Manajemen Kesehatan'],
        ['cb' => 3018317, 'bd' => 3018318, 'dd' => 3018319, 'name' => 'Kesiapan Peningkatan Konsep Diri'],
        ['cb' => 3018320, 'bd' => 3018321, 'dd' => 3018322, 'name' => 'Defisit Pengetahuan'],
        ['cb' => 3018323, 'bd' => 3018324, 'dd' => 3018325, 'name' => 'Penurunan Curah Jantung'],
        ['cb' => 3018326, 'bd' => 3018327, 'dd' => 3018328, 'name' => 'Manajemen Kesehatan Keluarga Tidak Efektif'],
        ['cb' => 3018329, 'bd' => 3018330, 'dd' => 3018331, 'name' => 'Hipotermia'],
        ['cb' => 3018332, 'bd' => 3018333, 'dd' => 3018334, 'name' => 'Bersihan Jalan Nafas Tidak Efektif'],
        ['cb' => 3018335, 'bd' => 3018336, 'dd' => 3018337, 'name' => 'Ketidakstabilan Kadar Glukosa Darah'],
        ['cb' => 3018338, 'bd' => 3018339, 'dd' => 3018340, 'name' => 'Perfusi Perifer Tidak Efektif'],
        ['cb' => 3018341, 'bd' => 3018342, 'dd' => 3018343, 'name' => 'Naussea'],
        ['cb' => 3018344, 'bd' => 3018345, 'dd' => 3018346, 'name' => 'Risiko Infeksi'],
        ['cb' => 3018347, 'bd' => 3018348, 'dd' => 3018349, 'name' => 'Sindrom Putus Zat Akut'],
        ['cb' => 3018350, 'bd' => 3018351, 'dd' => 3018352, 'name' => 'Kunfusi Akut'],
        ['cb' => 3018353, 'bd' => 3018354, 'dd' => 3018355, 'name' => 'Ketidakpatuhan'],
        ['cb' => 3018359, 'bd' => 3018360, 'dd' => 3018361, 'name' => 'Risiko Jatuh'],
        ['cb' => 3018362, 'bd' => 3018363, 'dd' => 3018364, 'name' => 'Hipovolemia'],
        ['cb' => 3018365, 'bd' => 3018366, 'dd' => 3018367, 'name' => 'Hipertermia'],
        ['cb' => 3018368, 'bd' => 3018369, 'dd' => 3018370, 'name' => 'Hipervolemia'],
        ['cb' => 3018371, 'bd' => 3018372, 'dd' => 3018373, 'name' => 'Nyeri Akut'],
        ['cb' => 3018374, 'bd' => 3018375, 'dd' => 3018376, 'name' => 'Nyeri Kronis'],
        ['cb' => 3018377, 'bd' => 3018378, 'dd' => 3018379, 'name' => 'Inkontinensia Urin Fungsional'],
        ['cb' => 3018380, 'bd' => 3018381, 'dd' => 3018382, 'name' => 'Inkontinensia Fekal'],
        ['cb' => 3018383, 'bd' => 3018384, 'dd' => 3018385, 'name' => 'Risiko Gangguan Perkembangan'],
        ['cb' => 3018386, 'bd' => 3018387, 'dd' => 3018388, 'name' => 'Gangguan Tumbuh Kembang'],
        ['cb' => 3018389, 'bd' => 3018390, 'dd' => 3018391, 'name' => 'Risiko Gangguan Pertumbuhan'],
    ];
@endphp
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>PENGKAJIAN AWAL KEPERAWATAN RAWAT JALAN NON JIWA</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 5mm 6mm 5mm 6mm;
        }

        body {
            margin: 3 !important;
            padding: 3 !important;
            font-family: Arial, sans-serif;
            font-size: 8.5px;
            color: #000;
            line-height: 1.2;
        }

        .page-break {
            page-break-before: always;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th, td {
            border: 1px solid #000;
            padding: 2px 3px;
            text-align: left;
            vertical-align: top;
        }

        .header-table td {
            border: none;
            padding: 1px;
        }

        .sec-header {
            font-weight: bold;
            font-size: 9px;
            padding: 3px 5px;
            background-color: #d0d0d0;
            border: 1px solid #000;
            text-align: center;
        }

        .sec-header-left {
            font-weight: bold;
            font-size: 9px;
            padding: 3px 5px;
            background-color: #d0d0d0;
            border: 1px solid #000;
            text-align: left;
        }

        .cb-box {
            display: inline-block;
            width: 10px;
            height: 10px;
            border: 1px solid #000;
            text-align: center;
            line-height: 9px;
            font-size: 8.5px;
            font-weight: bold;
            vertical-align: middle;
            margin-right: 2px;
        }

        .rm-box {
            display: inline-block;
            width: 13px;
            height: 14px;
            border: 1px solid #000;
            text-align: center;
            line-height: 14px;
            font-size: 9px;
            font-weight: bold;
            margin: 0 1px;
        }

        .no-border-table td {
            border: none;
            padding: 1px;
        }
    </style>
</head>
<body>

    <!-- ==================== HALAMAN 1 (LANDSCAPE): PENGKAJIAN AWAL & DATA FOKUS ==================== -->
    <section>
                    <div style="padding: 3px; font-size: 8px;">
                        <!-- HEADER KOP SURAT -->
                        <table cellspacing="0" cellpadding="0" border="0" class="header-table" width="100%">
                            <tr>
                                <td style="text-align: center;" width="8%">
                                    <img src="img/diy.png" alt="Logo" style="width: 65px;">
                                </td>
                                <td style="text-align: center; vertical-align: top" width="42%">
                                    <p style="margin:0; padding:0; font-size: 9px; font-weight: bold;">{{ $res['profile']->baris1 ?? '' }}</p>
                                    <p style="margin:0; padding:0; font-size: 10px; font-weight:bold;">{{ $res['profile']->baris2 ?? '' }}</p>
                                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ strtoupper($res['profile']->namalengkap ?? '') }}</p>
                                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 110px;"><br>
                                    <p style="font-size:7.5pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos ?? '' }}</p>
                                    <p style="font-size:7.5pt; margin:0;">Telp: (0274) 895143, 895297 | Faks: {{ $res['profile']->faksimile ?? '' }}</p>
                                </td>
                                <td width="20%" style="vertical-align: middle">
                                    <img src="img/logo_grhasia_full.png" alt="Logo" style="width: 120px;">
                                </td>
                                <td width="30%" style="vertical-align: top">
                                    <table width="100%" style="font-size:9px; border-collapse:collapse;" border="1">
                                        <tr>
                                            <td style="font-weight: bold; width:35%; padding:2px;">No. RM</td>
                                            <td style="padding:2px;">: {{ $data[0]->nocm ?? '' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; padding:2px;">Nama</td>
                                            <td style="padding:2px;">: {{ $data[0]->namapasien ?? '' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; padding:2px;">Tgl Lahir</td>
                                            <td style="padding:2px;">: {{ !empty($data[0]->tgllahir) ? date('d-m-Y', strtotime($data[0]->tgllahir)) : '' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; padding:2px;">Jenis Kelamin</td>
                                            <td style="padding:2px;">: {{ $data[0]->jeniskelamin ?? '' }}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <hr style="margin: 2px 0; border: 0; border-top: 1px solid #000;">

                        <!-- JUDUL FORM HALAMAN 1 -->
                    </div>
                    <div style="padding: 3px; font-size: 8px;">
                        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse; margin-top:2px;">
                            <tr>
                                <th style="font-size: 11px; font-weight: bold; text-align: center; background-color: #d0d0d0; padding: 3px;">
                                    PENGKAJIAN AWAL KEPERAWATAN RAWAT JALAN NON JIWA
                                </th>
                            </tr>
                            <tr>
                                <td style="font-size: 9px; padding: 2px 4px;">
                                    <strong>Tanggal :</strong> {{ !empty($item[3018100]) ? date('d-m-Y', strtotime($item[3018100])) : '........................' }} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <strong>Jam :</strong> {{ !empty($item[3018100]) ? date('H:i', strtotime($item[3018100])) : '........................' }}
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 9px; padding: 2px 4px;">
                                    <strong>Keluhan / alasan masuk :</strong><br>
                                    <div style="min-height: 20px; padding-top:1px;">{{ getVal($item, 3018101) }}</div>
                                </td>
                            </tr>
                            <tr>
                                <td style="font-size: 9px; padding: 2px 4px;">
                                    <strong>Tanda Vital</strong><br>
                                    TD : {{ getVal($item, 3018103) ?: '............' }} mmHg &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    N : {{ getVal($item, 3018104) ?: '............' }} x / menit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    RR : {{ getVal($item, 3018105) ?: '............' }} x / menit &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    T : {{ getVal($item, 3018106) ?: '............' }} °C &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    SaO<sub>2</sub> : {{ getVal($item, 3018107) ?: '............' }} %
                                </td>
                            </tr>
                        </table>
                    </div>
                    <!-- PEMERIKSAAN FISIK HEADER -->
                    <div class="sec-header-left">PEMERIKSAAN FISIK</div>
                    <div style="padding: 3px; font-size: 8.5px;">
                        <div style="font-weight: bold; text-decoration: underline;">DISABILITY</div>
                        <div>
                            GCS : {{ getVal($item, 3018110) ?: '........................' }}<br>
                            E : {{ getVal($item, 3018111) ?: '........' }} &nbsp;&nbsp;
                            V : {{ getVal($item, 3018112) ?: '........' }} &nbsp;&nbsp;
                            M : {{ getVal($item, 3018113) ?: '........' }}
                        </div>
                        <div style="margin-top: 2px;"><u>Kesadaran</u></div>
                        <table width="100%" border="0" class="no-border-table" style="font-size: 8.5px;">
                            <tr>
                                <td width="50%">{!! renderCB($item, 3018115) !!} Composmentis</td>
                                <td width="50%">{!! renderCB($item, 3018119) !!} Delirium</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018116) !!} Apatis</td>
                                <td>{!! renderCB($item, 3018120) !!} Coma</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018117) !!} Somnolen</td>
                                <td>{!! renderCB($item, 3018118) !!} Stupor</td>
                            </tr>
                        </table>
                        <table width="100%" border="0" class="no-border-table" style="font-size: 8.5px; margin-top:2px;">
                            <tr>
                                <td width="50%">LiLA : {{ getVal($item, 3018121) ?: '............' }}</td>
                                <td width="50%">IMT : {{ getVal($item, 3018535, 3018537) ?: '............' }}</td>
                            </tr>
                            <tr>
                                <td>LD : {{ getVal($item, 3018122) ?: '............' }}</td>
                                <td>LK : {{ getVal($item, 3018123) ?: '............' }}</td>
                            </tr>
                            <tr>
                                <td>BB : {{ getVal($item, 3018124) ?: '............' }}</td>
                                <td>TB : {{ getVal($item, 3018125) ?: '............' }}</td>
                            </tr>
                            <tr>
                                <td>BB/U : {{ getVal($item, 3018126) ?: '............' }}</td>
                                <td>PB/U : {{ getVal($item, 3018127) ?: '............' }}</td>
                            </tr>
                            <tr>
                                <td colspan="2">BB/PB : {{ getVal($item, 3018128) ?: '............' }}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- SKRINING NYERI HEADER -->
                    <div class="sec-header-left">SKRINING NYERI</div>
                    <div style="padding: 3px; font-size: 8.5px;">
                        <strong>Keluhan Nyeri:</strong><br>
                        {!! renderCB($item, 3018131) !!} Tidak ada<br>
                        {!! renderCB($item, 3018132) !!} Ada, Lokasi {{ getVal($item, 3018133) ?: '........................' }} &nbsp;&nbsp; Durasi {{ getVal($item, 3018134) ?: '........................' }}
                    </div>

                    <!-- SKOR NYERI HEADER -->
                    <div class="sec-header-left">SKOR NYERI</div>
                    <div style="padding: 3px; font-size: 8px;">
                        <table width="100%" border="1" style="border-collapse:collapse; text-align:left; font-size:8px;">
                            <tr style="background-color:#f5f5f5;">
                                <td width="33%">{!! renderCB($item, 3018142) !!} 0 - &lt; 1 tahun<br><strong>NIPS</strong></td>
                                <td width="33%">{!! renderCB($item, 3018143) !!} 1 - 7 tahun<br><strong>(FLACC PAIN SCALE)</strong></td>
                                <td width="34%">{!! renderCB($item, 3018144) !!} &gt; 7 tahun<br><strong>(WONG BAKER / NUMERIC)</strong></td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018148) !!} 0 (Tidak Nyeri)</td>
                                <td>{!! renderCB($item, 3018149) !!} 0 (Tidak Nyeri)</td>
                                <td>{!! renderCB($item, 3018150) !!} 0 (Tidak Nyeri)</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018151) !!} 1 - 2 (Ringan)</td>
                                <td>{!! renderCB($item, 3018152) !!} 1 - 3 (Ringan)</td>
                                <td>{!! renderCB($item, 3018153) !!} 1 - 3 (Ringan)</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018154) !!} 3 - 4 (Sedang)</td>
                                <td>{!! renderCB($item, 3018155) !!} 4 - 6 (Sedang)</td>
                                <td>{!! renderCB($item, 3018156) !!} 4 - 6 (Sedang)</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018157) !!} &gt;4 (Berat)</td>
                                <td>{!! renderCB($item, 3018158) !!} 7 - 10 (Berat)</td>
                                <td>{!! renderCB($item, 3018159) !!} 7 - 10 (Berat)</td>
                            </tr>
                        </table>

                        <div style="padding: 3px; font-size: 8px;">
                            <div style="text-align:center; margin-top:3px; font-weight:bold; font-size:8px;">
                                <u>NUMERIC</u>
                            </div>
                            <div style="text-align:center; margin-top:2px;">
                                <img src="img/skalanyeri/numericPainRatingScale2.png" style="height:45px; max-width:85%; vertical-align:middle;" alt="Numeric Scale">
                            </div>
                            <table width="100%" border="1" style="border-collapse:collapse; text-align:left; font-size:8px;">
                                <tr>
                                    <td>{!! renderCB($item, 3018162) !!} 0 (Tidak Nyeri)</td>
                                </tr>
                                <tr>
                                    <td>{!! renderCB($item, 3018163) !!} 1 - 3 Ringan</td>
                                </tr>
                                <tr>
                                    <td>{!! renderCB($item, 3018164) !!} 4 - 6 Sedang</td>
                                </tr>
                                <tr>
                                    <td>{!! renderCB($item, 3018165) !!} 7 -10 Berat</td>
                                </tr>
                            </table>
                        </div>

                        <div style="padding: 3px; font-size: 8px;">

                            <div style="text-align:center; margin-top:3px; font-weight:bold; font-size:8px;">
                                <u>WONG BAKER FACES</u>
                            </div>
                            <div style="text-align:center; margin-top:10px;">
                                <img src="img/skalanyeri/1.png" style="height:20px;" alt="0">
                                <img src="img/skalanyeri/2.png" style="height:20px;" alt="2">
                                <img src="img/skalanyeri/3.png" style="height:20px;" alt="4">
                                <img src="img/skalanyeri/4.png" style="height:20px;" alt="6">
                                <img src="img/skalanyeri/5.png" style="height:20px;" alt="8">
                                <img src="img/skalanyeri/6.png" style="height:20px;" alt="10">
                            </div>
                                    <table width="100%" border="1" style="border-collapse:collapse; text-align:left; font-size:8px;">
                                        <tr>
                                            <td>{!! renderCB($item, 3018166) !!} 0 (Tidak Nyeri)</td>
                                        </tr>
                                        <tr>
                                            <td>{!! renderCB($item, 3018167) !!} 1 - 3 Sedikit Nyeri</td>
                                        </tr>
                                        <tr>
                                            <td>{!! renderCB($item, 3018168) !!} 4 Agak Mengganggu</td>
                                        </tr>
                                        <tr>
                                            <td>{!! renderCB($item, 3018169) !!} 5 - 7 Mengganggu aktivitas</td>
                                        </tr>
                                        <tr>
                                            <td>{!! renderCB($item, 3018170) !!} 8 Sangat mengganggu</td>
                                        </tr>
                                        <tr>
                                            <td>{!! renderCB($item, 3018171) !!} 9 - 10 Tak tertahankan</td>
                                        </tr>
                                    </table>
                        </div>
                    </div>
                    <!-- SKRINING RISIKO JATUH HEADER -->
                    <div class="sec-header-left">SKRINING RISIKO JATUH</div>
                    <div style="padding: 3px; font-size: 8px;">
                        <table width="100%" border="1" style="border-collapse:collapse; text-align:left;">
                            <tr style="background-color:#f5f5f5; font-weight:bold; text-align:center;">
                                <td width="8%">No</td>
                                <td width="64%">Penilaian</td>
                                <td width="14%">Ya</td>
                                <td width="14%">Tidak</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">1.</td>
                                <td colspan="3">Cara berjalan pasien ( salah satu / lebih )</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>a. Tidak seimbang / sempoyongan / limbung</td>
                                <td style="text-align:center;">{!! renderCB($item, 3018180, 3016580) !!}</td>
                                <td style="text-align:center;">{!! renderCB($item, 3018181, 3016581) !!}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>b. Jalan dengan alat bantu ( kruk, tripot, kursi roda, orang lain )</td>
                                <td style="text-align:center;">{!! renderCB($item, 3018182, 3016582) !!}</td>
                                <td style="text-align:center;">{!! renderCB($item, 3018183, 3016583) !!}</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">2.</td>
                                <td>Ada keterbatasan gerak</td>
                                <td style="text-align:center;">{!! renderCB($item, 3018184, 3016584) !!}</td>
                                <td style="text-align:center;">{!! renderCB($item, 3018185, 3016585) !!}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 2px;">
                            {!! renderCB($item, 3018186) !!} Tidak Ada Risiko Jatuh, bila tidak ditemukan salah satu dari point 1 / 2<br>
                            {!! renderCB($item, 3018187) !!} Ada Risiko Jatuh, bila ditemukan salah satu dari point 1 / 2<br>
                            {!! renderCB($item, 3018188) !!} Risiko Jatuh Tinggi, bila ditemukan 1 dan 2
                        </div>
                        <div style="margin-top: 2px;">
                            Tindakan &nbsp; {!! renderCB($item, 3018190) !!} Edukasi &nbsp;&nbsp; {!! renderCB($item, 3018191) !!} Pemberian Tanda Risiko Jatuh &nbsp;&nbsp; {!! renderCB($item, 3018192) !!} Pemberian Tempat Duduk Prioritas
                        </div>
                    </div>

                    <!-- SKRINING FUNGSIONAL HEADER -->
                    <div class="sec-header-left">SKRINING FUNGSIONAL</div>
                    <div style="padding: 3px; font-size: 8.5px;">
                        <table width="100%" border="0" class="no-border-table" style="font-size:8.5px;">
                            <tr>
                                <td width="100%">
                                    Alat bantu : {{ getVal($item, 3018136) ?: '........................' }}<br>
                                    Prothesa : {{ getVal($item, 3018137) ?: '........................' }}<br>
                                    ADL : {!! renderCB($item, 3018139) !!} mandiri &nbsp;&nbsp; {!! renderCB($item, 3018140) !!} dibantu
                                </td>
                                {{-- <td width="30%" style="border:1px solid #000; text-align:center; vertical-align:middle; padding:3px;">
                                    <strong>Paraf DPJP</strong><br><br>
                                    <span style="font-size:8px;">{{ getVal($item, 3018392, 31300216) }}</span>
                                </td> --}}
                            </tr>
                        </table>
                    </div>
                    <!-- DATA FOKUS HEADER -->
                    <div class="sec-header">DATA FOKUS</div>
                    <div style="padding: 4px; font-size: 8.5px;">
                        <table width="100%" border="0" class="no-border-table" style="font-size:8.5px; line-height:1.35;">
                            <tr>
                                <td width="50%">{!! renderCB($item, 3018194) !!} Batuk tidak efektif / tidak mampu batuk</td>
                                <td width="50%">{!! renderCB($item, 3018195) !!} Penggunaan otot bantu nafas</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018196) !!} Sianosis</td>
                                <td>{!! renderCB($item, 3018197) !!} Hiperglikemi</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018198) !!} Hipoglikemi</td>
                                <td>{!! renderCB($item, 3018199) !!} Mengantuk</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018200) !!} Lesu</td>
                                <td>{!! renderCB($item, 3018201) !!} Nadi perifier menurun / tidak teraba</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018202) !!} Mengeluh mual dan muntah</td>
                                <td>{!! renderCB($item, 3018203) !!} BAB cair &gt; 3 kali/24 jam</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018204) !!} Turgor kulit menurun</td>
                                <td>{!! renderCB($item, 3018205) !!} Volume urin menurun</td>
                            </tr>
                            <tr>
                                <td>{!! renderCB($item, 3018206) !!} Rasa haus meningkat</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    {!! renderCB($item, 3018207) !!} Status kesadaran &nbsp;
                                    {!! renderCB($item, 3018208) !!} A &nbsp;&nbsp;
                                    {!! renderCB($item, 3018209) !!} P &nbsp;&nbsp;
                                    {!! renderCB($item, 3018210) !!} V &nbsp;&nbsp;
                                    {!! renderCB($item, 3018211) !!} U
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- LAINNYA HEADER -->
                    <div class="sec-header-left">Lainnya</div>
                    <div style="padding: 4px; font-size: 8.5px;">
                        <div style="min-height: 45px;">
                            {{ getVal($item, 3018212, 3018283, 3018536) }}
                        </div>
                    </div>

                    <!-- MASALAH KEPERAWATAN HEADER -->
                    <div class="sec-header-left">Masalah Keperawatan</div>
                    <div style="padding: 4px; font-size: 8.5px;">
                        <div style="min-height: 55px;">
                            {{ getVal($item, 1901310025) }}
                        </div>
                    </div>
                    <div style="padding: 3px; font-size: 8.5px;">
                        <!-- DIAGNOSIS KEPERAWATAN HEADER -->
                        <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                            <tr>
                                <th class="sec-header" style="font-size: 11px; padding: 4px;">
                                    DIAGNOSIS KEPERAWATAN
                                </th>
                            </tr>
                        </table>

                        <!-- TABEL 57 DIAGNOSIS KEPERAWATAN (Sesuai Gambar 1, 2, 3) -->
                        <table width="100%" border="1" cellspacing="0" cellpadding="2" style="border-collapse:collapse; margin-top: -1px; font-size: 8.5px;">
                            <thead>
                                <tr style="background-color: #f5f5f5; font-weight: bold;">
                                    <td width="38%" style="padding: 3px;">Diagnosis Keperawatan</td>
                                    <td width="31%" style="padding: 3px;">berhubungan dengan</td>
                                    <td width="31%" style="padding: 3px;">ditandai dengan</td>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($diagnoses as $diag)
                                    @php
                                        $cbVal = is_array($diag['cb']) ? renderCB($item, ...$diag['cb']) : renderCB($item, $diag['cb']);
                                        $bdVal = is_array($diag['bd']) ? getVal($item, ...$diag['bd']) : getVal($item, $diag['bd']);
                                        $ddVal = is_array($diag['dd']) ? getVal($item, ...$diag['dd']) : getVal($item, $diag['dd']);
                                    @endphp
                                    <tr>
                                        <td style="vertical-align: middle; padding: 2px 4px;">
                                            {!! $cbVal !!} {{ $diag['name'] }}
                                        </td>
                                        <td style="vertical-align: middle; padding: 2px 4px;">
                                            <div>{{ $bdVal }}</div>
                                        </td>
                                        <td style="vertical-align: middle; padding: 2px 4px;">
                                            <div>{{ $ddVal }}</div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>

                        <!-- PARAF DPJP DROP DOWN -->
                        <div style="margin-top: 6px; font-size: 9px;">
                            <strong>Paraf DPJP</strong><br>
                            <div style="width: 35%; margin-top: 2px;">
                                {{ getVal($item, 3018392, 31300216) }}
                            </div>
                        </div>
                    </div>
                    <!-- SKRINING RISIKO NUTRISIONAL HEADER -->
                    <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-bottom: 5px;">
                        <tr>
                            <th class="sec-header" style="font-size: 11px; padding: 4px;">
                                SKRINING RISIKO NUTRISIONAL
                            </th>
                        </tr>
                    </table>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                        <tr>
                            <!-- SKRINING NUTRISI ANAK (50%) -->
                            <td width="49%" style="vertical-align: top; padding-right: 5px;">
                                <div>
                                    <div>ANAK</div>
                                    <table width="100%" border="1" style="border-collapse:collapse; font-size:7.5px;">
                                        <tr style="background-color:#f5f5f5; font-weight:bold; text-align:center;">
                                            <td width="8%">NO</td>
                                            <td width="67%">VARIABEL</td>
                                            <td width="25%">SKOR</td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" style="font-weight:bold; background-color:#fafafa;">A. Dijawab oleh Tenaga Kesehatan</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;">1.</td>
                                            <td>Apakah ada penyakit yang mendasari dengan risiko malnutrisi atau apakah ada pembedahan besar ?</td>
                                            <td>
                                                {!! renderCB($item, 3018395, 3016795) !!} a. Tidak &nbsp;&nbsp; 0<br>
                                                {!! renderCB($item, 3018396, 3016796) !!} b. Ya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 2
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;">2.</td>
                                            <td>Apakah pasien dalam kondisi status gizi buruk berdasarkan pemeriksaan klinis secara subyektif ?</td>
                                            <td>
                                                {!! renderCB($item, 3018397, 3016797) !!} a. Tidak &nbsp;&nbsp; 0<br>
                                                {!! renderCB($item, 3018398, 3016798) !!} b. Ya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="3" style="font-weight:bold; background-color:#fafafa;">B. Dijawab oleh Pengasuh Anak</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;">1.</td>
                                            <td colspan="2">Apakah hal-hal dibawah ini ditemukan pada anak ?</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>a. Diare berlebihan &gt;5 kali/hari dan atau muntah &gt;3 kali/hari</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>b. Penurunan asupan makanan selama beberapa hari terakhir</td>
                                            <td>
                                                {!! renderCB($item, 3018401, 3016799) !!} a. Tidak &nbsp;&nbsp; 0<br>
                                                {!! renderCB($item, 3018402, 3016800) !!} b. Ya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>c. Intervensi gizi yang sudah ada sebelumnya</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>d. Ketidakcukupan asupan gizi karena sakit</td>
                                            <td></td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;">2.</td>
                                            <td>Apakah ada penurunan berat badan atau tidak adanya penambahan berat badan ( untuk bayi &lt;1 tahun ) selama beberapa minggu / bulan terakhir ?</td>
                                            <td>
                                                {!! renderCB($item, 3018407, 3016801) !!} a. Tidak &nbsp;&nbsp; 0<br>
                                                {!! renderCB($item, 3018408, 3016802) !!} b. Ya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 1
                                            </td>
                                        </tr>
                                        <tr style="font-weight:bold;">
                                            <td colspan="2" style="text-align:right;">TOTAL SCORE</td>
                                            <td style="text-align:center;">
                                                <div style="text-align:center;">{{ getVal($item, 3018409, 3016809) }}</div>
                                            </td>
                                        </tr>
                                    </table>
                                    <div style="font-size:7.5px; margin-top:4px; line-height:1.2;">
                                        <strong>KESIMPULAN :</strong><br>
                                        <strong>Skor 0</strong> = Risiko rendah, tidak ada intervensi gizi yang diperlukan<br>
                                        <strong>Skor 1 - 3</strong> = Risiko sedang, konsultasikan kepada dokter untuk diagnosis lengkap, pertimbangkan intervensi gizi dengan ahli gizi<br>
                                        <strong>Skor 4 - 5</strong> = Risiko tinggi, konsultasikan kepada dokter dan ahli gizi untuk rekomendasi gizi individu dan tindak lanjut
                                    </div>
                                </div>
                            </td>

                            <!-- SKRINING NUTRISI DEWASA (50%) -->
                            <td width="49%" style="vertical-align: top; padding-left: 5px;">
                                <div>
                                    <div>DEWASA</div>
                                    <table width="100%" border="1" style="border-collapse:collapse; font-size:7.5px;">
                                        <tr style="background-color:#f5f5f5; font-weight:bold; text-align:center;">
                                            <td width="8%">NO</td>
                                            <td width="67%">VARIABEL</td>
                                            <td width="25%">SKOR</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;">1</td>
                                            <td>
                                                Apakah anda kehilangan berat badan (BB) secara tidak sengaja ?<br>
                                                Jika Ya, berapa banyak atau berapa Kg anda kehilangan BB ?
                                            </td>
                                            <td>
                                                {!! renderCB($item, 3018413, 3016813) !!} a. Tidak &nbsp;&nbsp; 0<br>
                                                {!! renderCB($item, 3018414, 3016814) !!} b. Ragu &nbsp;&nbsp;&nbsp;&nbsp; 2
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>a. Ya, 1-5 Kg</td>
                                            <td style="text-align:center;">1 {!! renderCB($item, 3018415, 3016815) !!}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>b. 6-10 Kg</td>
                                            <td style="text-align:center;">2 {!! renderCB($item, 3018416, 3016816) !!}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>c. 11-15 Kg</td>
                                            <td style="text-align:center;">3 {!! renderCB($item, 3018417, 3016817) !!}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>d. &gt; 15 Kg</td>
                                            <td style="text-align:center;">4 {!! renderCB($item, 3018418, 3016818) !!}</td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>e. Ragu</td>
                                            <td style="text-align:center;">2 {!! renderCB($item, 3018419, 3016819) !!}</td>
                                        </tr>
                                        <tr>
                                            <td style="text-align:center;">2</td>
                                            <td>Apakah anda mengalami penurunan asupan makan karena penurunan nafsu makan atau karena tidak mampu mengunyah atau menelan ?</td>
                                            <td>
                                                {!! renderCB($item, 3018420, 3016820) !!} Tidak &nbsp;&nbsp;&nbsp;&nbsp; 0<br>
                                                {!! renderCB($item, 3018421, 3016821) !!} Ragu-ragu 2
                                            </td>
                                        </tr>
                                        <tr style="font-weight:bold;">
                                            <td colspan="2" style="text-align:right;">TOTAL SCORE</td>
                                            <td style="text-align:center;">
                                                <div style="text-align:center;">{{ getVal($item, 3018422, 3016822) }}</div>
                                            </td>
                                        </tr>
                                    </table>

                                    <div style="font-size:7.5px; margin-top:4px; line-height:1.2;">
                                        <strong>3. pasien dengan diagnosa khusus:</strong><br>
                                        {!! renderCB($item, 3018423, 3014903) !!} Ya &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {!! renderCB($item, 3018424, 3014904) !!} Tidak<br><br>
                                        {!! renderCB($item, 3018425, 3014905) !!} DM &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {!! renderCB($item, 3018426, 3014906) !!} Hipertensi<br>
                                        {!! renderCB($item, 3018427, 3014907) !!} Geriatri &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {!! renderCB($item, 3018428, 3014908) !!} Infeksi TB<br>
                                        {!! renderCB($item, 3018429, 3014909) !!} Infeksi Hepatitis &nbsp;&nbsp; {!! renderCB($item, 3018430, 3014910) !!} Lain-lain, Sebutkan<br>
                                        <div style="margin-top:2px;">{{ getVal($item, 3018431, 3014911) }}</div>
                                    </div>

                                    <div style="font-size:7.5px; margin-top:4px; line-height:1.2;">
                                        <strong>KESIMPULAN:</strong><br>
                                        *) Bila skor &ge; 2 dan atau pasien dengan diagnosis / kondisi khusus, kolaborasi dengan dokter atau dengan ahli gizi
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </table>

                    <div style="margin-top: 4px; font-size: 9px;">
                        <strong>Perawat</strong><br>
                        <div style="width: 35%; margin-top: 2px;">
                            {{ getVal($item, 3018432, 3018530, 3018533, 3016832) }}
                        </div>
                    </div>

                    <!-- SKRINING GIZI GERIATRI >= 60 TAHUN (MNA) -->
                    <div style="margin-top: 8px;">
                        <div style="text-align: center; font-weight: bold; font-size: 10px; margin-bottom: 4px;">
                            SKRINING GIZI GERIATRI &gt;= 60 TAHUN
                        </div>
                        <table width="100%" border="1" style="border-collapse:collapse; font-size:8px;">
                            <thead>
                                <tr style="background-color: #f5f5f5; font-weight: bold; text-align: center;">
                                    <td width="5%">No</td>
                                    <td width="55%">Pertanyaan Skrining</td>
                                    <td width="40%">Pilihan Jawaban (Pilih Salah Satu)</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="text-align:center;">A</td>
                                    <td>Apakah asupan makanan berkurang selama 3 bulan terakhir?</td>
                                    <td>
                                        {!! renderCB($item, 3018539, 3018538) !!} 0 = Asupan makanan sangat berkurang<br>
                                        {!! renderCB($item, 3018540, 3018539) !!} 1 = Asupan makanan agak berkurang<br>
                                        {!! renderCB($item, 3018541, 3018540) !!} 2 = Asupan makanan tidak berkurang
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">B</td>
                                    <td>Berat badan turun selama 3 bulan terakhir?</td>
                                    <td>
                                        {!! renderCB($item, 3018543, 3018542) !!} 0 = Berat badan turun lebih dari 3 kg<br>
                                        {!! renderCB($item, 3018544, 3018543) !!} 1 = Tidak tahu<br>
                                        {!! renderCB($item, 3018545, 3018544) !!} 2 = Berat badan turun antara 1 hingga 3 kg<br>
                                        {!! renderCB($item, 3018546, 3018545) !!} 3 = Berat badan tidak turun
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">C</td>
                                    <td>Pergerakan atau Mobilitas?</td>
                                    <td>
                                        {!! renderCB($item, 3018548, 3018547) !!} 0 = Terbatas di tempat tidur atau kursi<br>
                                        {!! renderCB($item, 3018549, 3018548) !!} 1 = Mampu bangun dari tempat tidur/kursi, tapi tidak bisa keluar<br>
                                        {!! renderCB($item, 3018550, 3018549) !!} 2 = Dapat bepergian ke luar rumah
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">D</td>
                                    <td>Mengalami tekanan psikologis atau penyakit akut (3 bln terakhir)?</td>
                                    <td>
                                        {!! renderCB($item, 3018552, 3018551) !!} 0 = Ya<br>
                                        {!! renderCB($item, 3018553, 3018552) !!} 2 = Tidak
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">E</td>
                                    <td>Gangguan neuropsikologis</td>
                                    <td>
                                        {!! renderCB($item, 3018555, 3018554) !!} 0 = Demensia berat atau depresi<br>
                                        {!! renderCB($item, 3018556, 3018555) !!} 1 = Demensia ringan<br>
                                        {!! renderCB($item, 3018557, 3018556) !!} 2 = Tidak ada gangguan psikologis
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">F1</td>
                                    <td>Indeks Massa Tubuh (IMT)</td>
                                    <td>
                                        {!! renderCB($item, 3018559, 3018558) !!} 0 = IMT kurang dari 19<br>
                                        {!! renderCB($item, 3018560, 3018559) !!} 1 = IMT 19 hingga kurang dari 21<br>
                                        {!! renderCB($item, 3018561, 3018560) !!} 2 = IMT 21 hingga kurang dari 23<br>
                                        {!! renderCB($item, 3018562, 3018561) !!} 3 = IMT 23 atau lebih besar
                                    </td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">F2</td>
                                    <td>Lingkar lengan atas (LiLA) - Jika IMT tidak dapat diukur</td>
                                    <td>
                                        {!! renderCB($item, 3018564, 3018563) !!} 0,0 = LiLA kurang dari 21<br>
                                        {!! renderCB($item, 3018565, 3018564) !!} 0,5 = LiLA 21 hingga 22<br>
                                        {!! renderCB($item, 3018566, 3018565) !!} 1,0 = LiLA lebih dari 22
                                    </td>
                                </tr>
                                <tr style="background-color: #e6f7ff; font-weight: bold;">
                                    <td colspan="2" style="text-align: right; padding: 3px;">TOTAL SKOR MNA (Max. 14) :</td>
                                    <td style="padding: 3px;">
                                        <div style="text-align:center; font-weight:bold;">{{ getVal($item, 3018567) ?: '0' }}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="border: 1px dashed #3b82f6; border-radius: 4px; padding: 4px; margin-top: 4px; font-size: 8px;">
                            <strong>Interpretasi Skor:</strong><br>
                            12 - 14 : Status Gizi Normal<br>
                            8 - 11 : Berisiko Malnutrisi<br>
                            0 - 7 : Malnutrisi
                        </div>
                    </div> 
                    <div style="padding: 3px; font-size: 8.5px;">
                        <table width="100%" border="0" class="no-border-table" style="font-size:8.5px;">
                            <tr>
                                <td width="70%">
                                </td>
                                <td width="30%" style="border:1px solid #000; text-align:center; vertical-align:middle; padding:3px;">
                                    <strong>Tanda Tangan Perawat</strong><br><br><br><br>
                                    <span style="font-size:8px;">{{ getVal($item, 3018392, 31300216) }}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
    </section>

    <!-- ==================== HALAMAN 4 (LANDSCAPE): PERENCANAAN IMPLEMENTASI EVALUASI ==================== -->
    <div class="page-break"></div>

    <section>
        <!-- JUDUL FORM HALAMAN 4 -->
        <div style="padding: 3px; font-size: 8px;">
                        <!-- HEADER KOP SURAT -->
                        <table cellspacing="0" cellpadding="0" border="0" class="header-table" width="100%">
                            <tr>
                                <td style="text-align: center;" width="8%">
                                    <img src="img/diy.png" alt="Logo" style="width: 65px;">
                                </td>
                                <td style="text-align: center; vertical-align: top" width="42%">
                                    <p style="margin:0; padding:0; font-size: 9px; font-weight: bold;">{{ $res['profile']->baris1 ?? '' }}</p>
                                    <p style="margin:0; padding:0; font-size: 10px; font-weight:bold;">{{ $res['profile']->baris2 ?? '' }}</p>
                                    <p style="margin:0; padding:0; font-size: 11px; font-weight:bold;">{{ strtoupper($res['profile']->namalengkap ?? '') }}</p>
                                    <img src="img/aksara_jawa-com.png" alt="Logo" style="width: 110px;"><br>
                                    <p style="font-size:7.5pt; margin:0;">Jalan Kaliurang Km 17 Sleman, Kode Pos {{ $res['profile']->kodepos ?? '' }}</p>
                                    <p style="font-size:7.5pt; margin:0;">Telp: (0274) 895143, 895297 | Faks: {{ $res['profile']->faksimile ?? '' }}</p>
                                </td>
                                <td width="20%" style="vertical-align: middle">
                                    <img src="img/logo_grhasia_full.png" alt="Logo" style="width: 120px;">
                                </td>
                                <td width="30%" style="vertical-align: top">
                                    <table width="100%" style="font-size:9px; border-collapse:collapse;" border="1">
                                        <tr>
                                            <td style="font-weight: bold; width:35%; padding:2px;">No. RM</td>
                                            <td style="padding:2px;">: {{ $data[0]->nocm ?? '' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; padding:2px;">Nama</td>
                                            <td style="padding:2px;">: {{ $data[0]->namapasien ?? '' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; padding:2px;">Tgl Lahir</td>
                                            <td style="padding:2px;">: {{ !empty($data[0]->tgllahir) ? date('d-m-Y', strtotime($data[0]->tgllahir)) : '' }}</td>
                                        </tr>
                                        <tr>
                                            <td style="font-weight: bold; padding:2px;">Jenis Kelamin</td>
                                            <td style="padding:2px;">: {{ $data[0]->jeniskelamin ?? '' }}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <hr style="margin: 2px 0; border: 0; border-top: 1px solid #000;">

                        <!-- JUDUL FORM HALAMAN 1 -->
                    </div>
        <table width="100%" border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;">
            <tr>
                <th style="font-size: 11px; font-weight: bold; text-align: center; background-color: #d0d0d0; padding: 3px;">
                    PERENCANAAN IMPLEMENTASI EVALUASI KEPERAWATAN RAWAT JALAN NON JIWA
                </th>
            </tr>
            {{-- <tr>
                <td style="font-size: 9px; padding: 3px 5px;">
                    <table width="100%" border="0" class="no-border-table" style="font-size:9px;">
                        <tr>
                            <td width="60%"><strong>Nama Pasien :</strong> {{ $data[0]->namapasien ?? '' }}</td>
                            <td width="40%" style="text-align:right;">
                                <strong>Nomor RM :</strong>
                                @php
                                    $rmDigits = str_split(str_pad(preg_replace('/[^0-9]/', '', $data[0]->nocm ?? ''), 6, '0', STR_PAD_LEFT));
                                @endphp
                                @foreach($rmDigits as $idx => $d)
                                    <span class="rm-box">{{ $d }}</span>
                                    @if(($idx+1) % 2 == 0 && $idx < 5)-@endif
                                @endforeach
                            </td>
                        </tr>
                    </table>
                </td>
            </tr> --}}
            <tr style="background-color:#f5f5f5;">
                <td style="font-size: 8px; padding: 2px 4px;">
                    INSTRUKSI : Beri tanda checklist ( &radic; ) pada kotak yang sesuai ( dapat lebih dari satu sesuai dengan diagnosa keperawatan yang ditegakkan )
                </td>
            </tr>
        </table>

        <!-- TABEL UTAMA 4 KOLOM HALAMAN 4 -->
        <table width="100%" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-top: -1px; font-size: 8px;">
            <thead>
                <tr style="background-color: #d0d0d0; text-align: center; font-weight: bold;">
                    <td colspan="2" width="50%" style="padding:3px;">PERENCANAAN</td>
                    <td width="25%" style="padding:3px;">IMPLEMENTASI</td>
                    <td width="25%" style="padding:3px;">EVALUASI<br>(SOAP)</td>
                </tr>
                <tr style="background-color: #e0e0e0; text-align: center; font-weight: bold;">
                    <td width="25%" style="padding:2px;">TUJUAN</td>
                    <td width="25%" style="padding:2px;">TINDAKAN</td>
                    <td width="25%" style="padding:2px;"></td>
                    <td width="25%" style="padding:2px;"></td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <!-- TUJUAN (KOLOM 1) -->
                    <td width="25%" style="vertical-align: top; padding: 3px; line-height: 1.25;">
                        Setelah dilakukan Intervensi Keperawatan selama {{ getVal($item, 3018435) ?: '..........' }} menit, pasien :<br>
                        {!! renderCB($item, 3018436) !!} Bersihan jalan meningkat<br>
                        {!! renderCB($item, 3018437) !!} Ventilasi adekuat<br>
                        {!! renderCB($item, 3018438) !!} Curah jantung meningkat<br>
                        {!! renderCB($item, 3018439) !!} Kadar glukosa darah dalam rentang normal<br>
                        {!! renderCB($item, 3018440) !!} Perfusi perifer meningkat<br>
                        {!! renderCB($item, 3018441) !!} Nausea menurun<br>
                        {!! renderCB($item, 3018442) !!} Status nutrisi membaik<br>
                        {!! renderCB($item, 3018443) !!} Defekasi normal<br>
                        {!! renderCB($item, 3018444) !!} Integritas kulit meningkat<br>
                        {!! renderCB($item, 3018445) !!} Status cairan membaik<br>
                        {!! renderCB($item, 3018446) !!} Suhu dalam rentang normal<br>
                        {!! renderCB($item, 3018447) !!} Keseimbangan cairan meningkat<br>
                        {!! renderCB($item, 3018448) !!} Tingkat nyeri menurun<br>
                        {!! renderCB($item, 3018449) !!} Kontinensia urine / vekal membaik<br>
                        {!! renderCB($item, 3018450) !!} Tidak terjadi cidera<br>
                        {{ getVal($item, 3018451) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018452) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018453) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018454) ?: '....................................................' }}
                    </td>

                    <!-- TINDAKAN (KOLOM 2) -->
                    <td width="25%" style="vertical-align: top; padding: 3px; line-height: 1.25;">
                        {!! renderCB($item, 3018456) !!} Latihan batuk efektif<br>
                        {!! renderCB($item, 3018457) !!} Manajemen jalan nafas<br>
                        {!! renderCB($item, 3018458) !!} Pemantauan respirasi<br>
                        {!! renderCB($item, 3018459) !!} Manajemen asthma<br>
                        {!! renderCB($item, 3018460) !!} Edukasi keluarga tentang {{ getVal($item, 3018461) ?: '....................' }}<br>
                        {!! renderCB($item, 3018462) !!} Edukasi pasien tentang {{ getVal($item, 3018463) ?: '....................' }}<br>
                        {!! renderCB($item, 3018464) !!} Dukungan ventilasi<br>
                        {!! renderCB($item, 3018465) !!} Perawatan jantung<br>
                        {!! renderCB($item, 3018466) !!} Resusitasi jantung paru<br>
                        {!! renderCB($item, 3018467) !!} Manajemen hiperglikemi<br>
                        {!! renderCB($item, 3018468) !!} Manajemen hipoglikemi<br>
                        {!! renderCB($item, 3018469) !!} Perawatan sirkulasi<br>
                        {!! renderCB($item, 3018470) !!} Manajemen mual<br>
                        {!! renderCB($item, 3018471) !!} Manajemen muntah<br>
                        {!! renderCB($item, 3018472) !!} Manajemen nutrisi {{ getVal($item, 3018473) ?: '....................' }}<br>
                        {!! renderCB($item, 3018474) !!} Manajemen diare<br>
                        {!! renderCB($item, 3018475) !!} Pemantauan cairan<br>
                        {!! renderCB($item, 3018476) !!} Perawatan luka<br>
                        {!! renderCB($item, 3018477) !!} Penjahitan luka<br>
                        {!! renderCB($item, 3018478) !!} Manajemen kesehatan lingkungan {{ getVal($item, 3018479) ?: '....................' }}<br>
                        {!! renderCB($item, 3018480) !!} Manajemen kejang<br>
                        {!! renderCB($item, 3018481) !!} Manajemen hipovolemia / syok hipovolemia<br>
                        {!! renderCB($item, 3018482) !!} Manajemen hipertermi / hipotermia<br>
                        {!! renderCB($item, 3018483) !!} Manajemen hipervolemia<br>
                        {!! renderCB($item, 3018484) !!} Manajemen nyeri<br>
                        {!! renderCB($item, 3018485) !!} Pemberian analgetik<br>
                        {!! renderCB($item, 3018486) !!} Terapi relaksasi<br>
                        {!! renderCB($item, 3018487) !!} Manajemen inkontinensia urine / vekal<br>
                        {{ getVal($item, 3018488) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018489) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018490) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018491) ?: '....................................................' }}
                    </td>

                    <!-- IMPLEMENTASI (KOLOM 3) -->
                    <td width="25%" style="vertical-align: top; padding: 3px; line-height: 1.25;">
                        Tanggal : {{ !empty($item[3018493]) ? date('d-m-Y', strtotime($item[3018493])) : '....................' }} &nbsp;&nbsp; Pukul : {{ !empty($item[3018493]) ? date('H:i', strtotime($item[3018493])) : '....................' }}<br>
                        {!! renderCB($item, 3018494) !!} Latihan batuk efektif<br>
                        {!! renderCB($item, 3018495) !!} Manajemen jalan nafas<br>
                        {!! renderCB($item, 3018496) !!} Pemantauan respirasi<br>
                        {!! renderCB($item, 3018497) !!} Manajemen asthma<br>
                        {!! renderCB($item, 3018498) !!} Edukasi keluarga tentang {{ getVal($item, 3018499) ?: '....................' }}<br>
                        {!! renderCB($item, 3018500) !!} Edukasi pasien tentang {{ getVal($item, 3018501) ?: '....................' }}<br>
                        {!! renderCB($item, 3018502) !!} Dukungan ventilasi<br>
                        {!! renderCB($item, 3018503) !!} Perawatan jantung<br>
                        {!! renderCB($item, 3018504) !!} Resusitasi jantung paru<br>
                        {!! renderCB($item, 3018505) !!} Manajemen hiperglikemi<br>
                        {!! renderCB($item, 3018506) !!} Manajemen hipoglikemi<br>
                        {!! renderCB($item, 3018507) !!} Perawatan sirkulasi<br>
                        {!! renderCB($item, 3018508) !!} Manajemen mual<br>
                        {!! renderCB($item, 3018509) !!} Manajemen muntah<br>
                        {!! renderCB($item, 3018510) !!} Manajemen nutrisi {{ getVal($item, 3018511) ?: '....................' }}<br>
                        {!! renderCB($item, 3018512) !!} Manajemen diare<br>
                        {!! renderCB($item, 3018513) !!} Pemantauan cairan<br>
                        {!! renderCB($item, 3018514) !!} Perawatan luka<br>
                        {!! renderCB($item, 3018515) !!} Penjahitan luka<br>
                        {!! renderCB($item, 3018516) !!} Manajemen kesehatan lingkungan {{ getVal($item, 3018517) ?: '....................' }}<br>
                        {!! renderCB($item, 3018518) !!} Manajemen kejang<br>
                        {!! renderCB($item, 3018519) !!} Manajemen hipovolemia / syok hipovolemia<br>
                        {!! renderCB($item, 3018520) !!} Manajemen hipertermi / hipotermia<br>
                        {!! renderCB($item, 3018521) !!} Manajemen hipervolemia<br>
                        {!! renderCB($item, 3018522) !!} Manajemen nyeri<br>
                        {!! renderCB($item, 3018523) !!} Pemberian analgetik<br>
                        {!! renderCB($item, 3018524) !!} Terapi relaksasi<br>
                        {!! renderCB($item, 3018525) !!} Manajemen inkontinensia urine / vekal<br>
                        {{ getVal($item, 3018526) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018527) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018528) ?: '....................................................' }}<br>
                        {{ getVal($item, 3018529) ?: '....................................................' }}<br><br>

                        <div style="text-align:center; margin-top:20px;">
                            ( {{ getVal($item, 3018530, 3016832) ?: '....................................' }} )<br>
                            Tandatangan &amp; Nama Jelas
                        </div>
                    </td>

                    <!-- EVALUASI (SOAP) (KOLOM 4) -->
                    <td width="25%" style="vertical-align: top; padding: 3px;">
                        Tanggal : {{ !empty($item[3018531]) ? date('d-m-Y', strtotime($item[3018531])) : '....................' }}<br>
                        Pukul : {{ !empty($item[3018531]) ? date('H:i', strtotime($item[3018531])) : '....................' }}<br><br>
                        <div style="min-height: 250px;">
                            {!! nl2br(e(getVal($item, 3018532))) !!}
                        </div>
                        <br>
                        <div style="text-align:center; margin-top:20px;">
                            ( {{ getVal($item, 3018533, 3016832) ?: '....................................' }} )<br>
                            Tandatangan &amp; Nama Jelas
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

</body>
</html>
