---settingdatafixed_m
select * from settingdatafixed_m order by id desc limit 1;
INSERT INTO "public"."settingdatafixed_m" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fieldkeytabelrelasi", "fieldreportdisplaytabelrelasi", 
"keteranganfungsi", "namafield", "nilaifield", "tabelrelasi", "typefield", "kelompok", "gambar") VALUES (1590, 30, 't', NULL, NULL, NULL, '', NULL, NULL, 'Base Url', 'base_url_IHS', 
'https://api-satusehat-dev.dto.kemkes.go.id/fhir-r4/v1/', NULL, 'string', 'IHS Kemkes', NULL);
INSERT INTO "public"."settingdatafixed_m" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fieldkeytabelrelasi", "fieldreportdisplaytabelrelasi", 
"keteranganfungsi", "namafield", "nilaifield", "tabelrelasi", "typefield", "kelompok", "gambar") VALUES (1591, 30, 't', NULL, NULL, NULL, '', NULL, NULL, 'Auth Url', 'auth_url_IHS', 
'https://api-satusehat-dev.dto.kemkes.go.id/oauth2/v1/accesstoken', NULL, 'string', 'IHS Kemkes', NULL);
INSERT INTO "public"."settingdatafixed_m" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fieldkeytabelrelasi", "fieldreportdisplaytabelrelasi", 
"keteranganfungsi", "namafield", "nilaifield", "tabelrelasi", "typefield", "kelompok", "gambar") VALUES (1592, 30, 't', NULL, NULL, NULL, '', NULL, NULL, 'Organization ID (Induk)', 
'organization_id_IHS', '10080028', NULL, 'string', 'IHS Kemkes', NULL);
INSERT INTO "public"."settingdatafixed_m" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fieldkeytabelrelasi", "fieldreportdisplaytabelrelasi", 
"keteranganfungsi", "namafield", "nilaifield", "tabelrelasi", "typefield", "kelompok", "gambar") VALUES (1593, 30, 't', NULL, NULL, NULL, '', NULL, NULL, 'Client Secret', 'client_secret_IHS', 
'TgWgsS2ZUYj5wwLbpbFTsxKOlfFYm160G6hrCtXDEDroQ7vnhELC2eXQF0C1VzcJ', NULL, 'string', 'IHS Kemkes', NULL);
INSERT INTO "public"."settingdatafixed_m" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fieldkeytabelrelasi", "fieldreportdisplaytabelrelasi", 
"keteranganfungsi", "namafield", "nilaifield", "tabelrelasi", "typefield", "kelompok", "gambar") VALUES (1594, 30, 't', NULL, NULL, NULL, '', NULL, NULL, 'Client ID', 'client_id_IHS', 
'AAiMIfcAkUSVRahOkAWhb224zVnFNJKjo9dNOc6YG29vNspz', NULL, 'string', 'IHS Kemkes', NULL);
INSERT INTO "public"."settingdatafixed_m" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fieldkeytabelrelasi", "fieldreportdisplaytabelrelasi", 
"keteranganfungsi", "namafield", "nilaifield", "tabelrelasi", "typefield", "kelompok", "gambar") VALUES (1595, 30, 't', NULL, NULL, NULL, '', NULL, NULL, 'SATUSEHAT Enabled', 
'SATUSEHAT_enabled', 'true', NULL, 'string', 'IHS Kemkes', NULL);


---add TABLE
ALTER TABLE "public"."pasien_m" 
  ADD COLUMN "ihs_number" varchar(255) COLLATE "pg_catalog"."default";
	
ALTER TABLE "public"."pasiendaftar_t" 
  ADD COLUMN "ihs_id" varchar COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_condition" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_observation" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_in_progress" timestamp(0),
  ADD COLUMN "ihs_finished" timestamp(0),
  ADD COLUMN "ihs_diagnosis" text COLLATE "pg_catalog"."default",
  ADD COLUMN "tglselesai" timestamp(6);
	
ALTER TABLE "public"."detaildiagnosatindakanpasien_t" 
  ADD COLUMN "ihs_id" varchar COLLATE "pg_catalog"."default";
	
ALTER TABLE "public"."detaildiagnosapasien_t" 
  ADD COLUMN "ihs_id" varchar(255) COLLATE "pg_catalog"."default";
	
ALTER TABLE "public"."emrpasiend_t" 
  ADD COLUMN "ihs_id" varchar COLLATE "pg_catalog"."default";
	
ALTER TABLE "public"."orderpelayanan_t" 
  ADD COLUMN "ihs_id" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_noorder" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_specimen" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_diagnosticreport" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_observation_lab" varchar(255) COLLATE "pg_catalog"."default";
	
ALTER TABLE "public"."strukpelayanandetail_t" 
  ADD COLUMN "ihs_id" varchar(255);
	
ALTER TABLE "public"."produk_m" 
  ADD COLUMN "ihs_id" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_kfa_code" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_sediaan" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_numerator_value" float8,
  ADD COLUMN "ihs_numerator_code" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_denominator_value" float8,
  ADD COLUMN "ihs_denominator_code" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  ADD COLUMN "ihs_kfa_display" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_kfa_code_brand" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_kfa_code_kemasan" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_loinc_id" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_loinc_common_name" varchar(255) COLLATE "pg_catalog"."default";
/*
 Navicat Premium Data Transfer

 Source Server         : postgres_rsjpparamarta_public
 Source Server Type    : PostgreSQL
 Source Server Version : 100019 (100019)
 Source Host           : 103.166.210.122:3131
 Source Catalog        : rsjp_paramarta_dev_new
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100019 (100019)
 File Encoding         : 65001

 Date: 10/11/2022 11:55:38
*/


-- ----------------------------
-- Table structure for ihs_bahanzat
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_bahanzat";
CREATE TABLE "public"."ihs_bahanzat" (
  "id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "nama" varchar(255) COLLATE "pg_catalog"."default",
  "keterangan" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."ihs_bahanzat" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_bahanzat
-- ----------------------------
BEGIN;
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000328', 'Isoniazid', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000329', 'Pyrazinamide', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000293', 'Streptomycin', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000288', 'Ethambutol', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000136', 'Levofloxacin', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000585', 'Moxifloxacin', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000287', 'Bedaquiline', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000330', 'Rifampin', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000404', 'Amikacin', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000505', 'Rifapentine', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000397', 'Amlodipine', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000261', 'Nifedipine', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000362', 'Bisoprolol', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000537', 'Propranolol', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000273', 'Carvedilol', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000262', 'Diltiazem', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000194', 'Verapamil', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000602', 'Hydrochlorothiazide', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000571', 'Imidapril', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000340', 'Captopril', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000267', 'Lisinopril', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000418', 'Perindopril', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000303', 'Ramipril', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000159', 'Irbesartan', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000635', 'Candesartan', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000125', 'Telmisartan', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000377', 'Valsartan', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000596', 'Clonidine', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000587', 'Methyldopa', NULL);
INSERT INTO "public"."ihs_bahanzat" ("id", "nama", "keterangan") VALUES ('91000101', 'Paracetamol', NULL);
COMMIT;

-- ----------------------------
-- Table structure for ihs_denom_satuan
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_denom_satuan";
CREATE TABLE "public"."ihs_denom_satuan" (
  "id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "nama" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."ihs_denom_satuan" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_denom_satuan
-- ----------------------------
BEGIN;
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('APPFUL', 'Applicatorful');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('DROP', 'Drops');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('NDROP', 'Nasal Drops');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OPDROP', 'Ophthalmic Drops');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORDROP', 'Oral Drops');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OTDROP', 'Otic Drops');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PUFF', 'Puff');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SCOOP', 'Scoops');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SPRY', 'Sprays');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('GASINHL', 'Gas for Inhalation');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('AER', 'Aerosol');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('BAINHL', 'Breath Activated Inhaler');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('INHLSOL', 'Inhalant Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('MDINHL', 'Metered Dose Inhaler');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('NASSPRY', 'Nasal Spray');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('DERMSPRY', 'Dermal Spray');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('FOAM', 'Foam');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('FOAMAPL', 'Foam with Applicator');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECFORM', 'Rectal foam');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGFOAM', 'Vaginal foam');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGFOAMAPL', 'Vaginal foam with applicator');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECSPRY', 'Rectal Spray');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGSPRY', 'Vaginal Spray');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('INHL', 'Inhalant');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('BAINHLPWD', 'Breath Activated Powder Inhaler');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('INHLPWD', 'Inhalant Powder');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('MDINHLPWD', 'Metered Dose Powder Inhaler');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('NASINHL', 'Nasal Inhalant');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORINHL', 'Oral Inhalant');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PWDSPRY', 'Powder Spray');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SPRYADAPT', 'Spray with Adaptor');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('LIQCLN', 'Liquid Cleanser');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('LIQSOAP', 'Medicated Liquid Soap');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SHMP', 'Shampoo');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OIL', 'Oil');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TOPOIL', 'Topical Oil');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SOL', 'Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('IPSOL', 'Intraperitoneal Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('IRSOL', 'Irrigation Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('DOUCHE', 'Douche');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ENEMA', 'Enema');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OPIRSOL', 'Ophthalmic Irrigation Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('IVSOL', 'Intravenous Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORALSOL', 'Oral Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ELIXIR', 'Elixir');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RINSE', 'Mouthwash/Rinse');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SYRUP', 'Syrup');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECSOL', 'Rectal Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TOPSOL', 'Topical Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('LIN', 'Liniment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('MUCTOPSOL', 'Mucous Membrane Topical Solution');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TINC', 'Tincture');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CRM', 'Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('NASCRM', 'Nasal Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OPCRM', 'Ophthalmic Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORCRM', 'Oral Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OTCRM', 'Otic Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECCRM', 'Rectal Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TOPCRM', 'Topical Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGCRM', 'Vaginal Cream');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGCRMAPL', 'Vaginal Cream with Applicator');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('LTN', 'Lotion');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TOPLTN', 'Topical Lotion');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OINT', 'Ointment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('NASOINT', 'Nasal Ointment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OINTAPL', 'Ointment with Applicator');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OPOINT', 'Ophthalmic Ointment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OTOINT', 'Otic Ointment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECOINT', 'Rectal Ointment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TOPOINT', 'Topical Ointment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGOINT', 'Vaginal Ointment');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGOINTAPL', 'Vaginal Ointment with Applicator');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('GEL', 'Gel');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('GELAPL', 'Gel with Applicator');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('NASGEL', 'Nasal Gel');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OPGEL', 'Ophthalmic Gel');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OTGEL', 'Otic Gel');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TOPGEL', 'Topical Gel');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('URETHGEL', 'Urethral Gel');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGGEL', 'Vaginal Gel');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VGELAPL', 'Vaginal Gel with Applicator');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PASTE', 'Paste');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PUD', 'Pudding');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TPASTE', 'Toothpaste');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SUSP', 'Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ITSUSP', 'Intrathecal Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OPSUSP', 'Ophthalmic Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORSUSP', 'Oral Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERSUSP', 'Extended-Release Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERSUSP12', '12 Hour Extended-Release Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERSUSP24', '24 Hour Extended Release Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('OTSUSP', 'Otic Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECSUSP', 'Rectal Suspension');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('BAR', 'Bar');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('BARSOAP', 'Bar Soap');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('MEDBAR', 'Medicated Bar Soap');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CHEWBAR', 'Chewable Bar');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('BEAD', 'Beads');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CAKE', 'Cake');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CEMENT', 'Cement');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CRYS', 'Crystals');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('DISK', 'Disk');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('FLAKE', 'Flakes');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('GRAN', 'Granules');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('GUM', 'ChewingGum');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PAD', 'Pad');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('MEDPAD', 'Medicated Pad');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PATCH', 'Patch');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TPATCH', 'Transdermal Patch');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TPATH16', '16 Hour Transdermal Patch');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TPATH24', '24 Hour Transdermal Patch');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TPATH2WK', 'Biweekly Transdermal Patch');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TPATH72', '72 Hour Transdermal Patch');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TPATHWK', 'Weekly Transdermal Patch');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PELLET', 'Pellet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('PILL', 'Pill');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CAP', 'Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORCAP', 'Oral Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ENTCAP', 'Enteric Coated Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERENTCAP', 'Extended Release Enteric Coated Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERCAP', 'Extended Release Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERCAP12', '12 Hour Extended Release Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERCAP24', '24 Hour Extended Release Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERECCAP', 'Extended Release Enteric Coated Capsule');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TAB', 'Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORTAB', 'Oral Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('BUCTAB', 'Buccal Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SRBUCTAB', 'Sustained Release Buccal Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CAPLET', 'Caplet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CHEWTAB', 'Chewable Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('CPTAB', 'Coated Particles Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('DISINTAB', 'Disintegrating Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('DRTAB', 'Delayed Release Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ECTAB', 'Enteric Coated Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERECTAB', 'Extended Release Enteric Coated Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERTAB', 'Extended Release Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERTAB12', '12 Hour Extended Release Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ERTAB24', '24 Hour Extended Release Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('ORTROCHE', 'Lozenge/Oral Troche');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SLTAB', 'Sublingual Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGTAB', 'Vaginal Tablet');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('POWD', 'Powder');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('TOPPWD', 'Topical Powder');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECPWD', 'Rectal Powder');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGPWD', 'Vaginal Powder');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SUPP', 'Suppository');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('RECSUPP', 'Rectal Suppository');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('URETHSUPP', 'Urethral suppository');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('VAGSUPP', 'Vaginal Suppository');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('SWAB', 'Swab');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('MEDSWAB', 'Medicated swab');
INSERT INTO "public"."ihs_denom_satuan" ("id", "nama") VALUES ('WAFER', 'Wafer');
COMMIT;

-- ----------------------------
-- Table structure for ihs_kode_kf_a
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_kode_kf_a";
CREATE TABLE "public"."ihs_kode_kf_a" (
  "id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "namaproduk" varchar(255) COLLATE "pg_catalog"."default",
  "keterangan" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."ihs_kode_kf_a" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_kode_kf_a
-- ----------------------------
BEGIN;
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000116', 'Telmisartan 40 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000117', 'Telmisartan 80 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000150', 'Levofloxacin Hemihydrate 250 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000164', 'Irbesartan 150 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000165', 'Irbesartan 300 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000187', 'Verapamil 240 mg Kaplet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000257', 'Nifedipine 30 mg Tablet Pelepasan Lambat', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000258', 'Diltiazem Hydrochloride 100 mg Kapsul Pelepasan Lambat', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000259', 'Diltiazem Hydrochloride 200 mg Kapsul Pelepasan Lambat', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000268', 'Lisinopril Dihydrate 10 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000269', 'Lisinopril Dihydrate 5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000280', 'Carvedilol 25 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000288', 'Streptomycin Sulfate 1000 mg Serbuk Injeksi', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000290', 'Bedaquiline Fumarate 100 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000298', 'Ethambutol 400 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000307', 'Diltiazem Hydrochloride 30 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000344', 'Captopril 25 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000368', 'Ramipril 2,5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000383', 'Bisoprolol Fumarate 10 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000407', 'Amlodipine Besilate 10 mg Kaplet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000423', 'Amikacin 250 mg/ml Injeksi', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000428', 'Isoniazid 100 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000440', 'Perindopril Arginine 5 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000452', 'Ramipril 10 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000454', 'Amlodipine Besilate 5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000457', 'Pyrazinamide 500 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000474', 'Valsartan 160 mg Kaplet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000475', 'Valsartan 160 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000526', 'Bisoprolol Fumarate 5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000581', 'Bisoprolol Fumarate 2.5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000587', 'Propranolol 10 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000622', 'Imidapril 10 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000689', 'Isoniazid 300 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000710', 'Obat Anti Tuberculosis / Rifampicin 75 mg / Isoniazid 50 mg / Pyrazinamide 150 mg Tablet 
Dispersibel', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000715', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 150 mg Tablet Salut Selaput', '6.2 Lampiran 
2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000716', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 75 mg / Pyrazinamide 400 mg / Ethambutol 275 
mg Kaplet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000717', 'Obat Anti Tuberculosis / Rifampicin 75 mg / Isoniazid 50 mg Tablet Dispersibel', '6.2 Lampiran 2  
Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000738', 'Methyldopa 250 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000746', 'Moxifloxacin 400 mg Kaplet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000758', 'Clonidine Hydrochloride 0,15 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000760', 'Rifampicin 450 mg Kaplet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000761', 'Rifampicin 600 mg Kaplet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000769', 'Imidapril 5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000773', 'Captopril 12,5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000778', 'Hydrochlorothiazide 25 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000780', 'Bisoprolol Fumarate 1,25 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000794', 'Carvedilol 6,25 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000801', 'Rifapentine 150 mg Tablet Salut Selaput', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000833', 'Propanolol 40 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000834', 'Candesartan Cilexetil 16 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000836', 'Candesartan Cilexetil 8 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000837', 'Ramipril 5 mg Tablet', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000848', 'Clonidine Hydrochloride 150 mcg/mL Cairan Injeksi', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92000861', 'Diltiazem Hydrochloride 50 mg / mL Serbuk Injeksi', '6.2 Lampiran 2  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001078', 'Pyrazinamide 500 mg Tablet (SANBE FARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001079', 'Pyrazinamide 500 mg Tablet (KIMIA FARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000147', 'Levofloxacin Hemihydrate 250 mg Tablet Salut Selaput (KIMIA FARMA)', '6.3 Lampiran 3  Kode Kf+a 
Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000402', 'Bedaquiline Fumarate 100 mg Tablet (SIRTURO)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001021', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 75 mg / Pyrazinamide 400 mg / Ethambutol 275 
mg Kaplet Salut Selaput (PHAPROS)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001017', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 150 mg Tablet Salut Selaput (KIMIA FARMA)', 
'6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001025', 'Obat Anti Tuberculosis / Rifampicin 75 mg / Isoniazid 50 mg / Pyrazinamide 150 mg Tablet 
Dispersibel (INDOFARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001022', 'Obat Anti Tuberculosis / Rifampicin 75 mg / Isoniazid 50 mg Tablet Dispersibel (INDOFARMA)', '6.3 
Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000761', 'Amikacin 250 mg/ml Injeksi (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000832', 'Isoniazid 100 mg Tablet (KIMIA FARMA Tbk.)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000483', 'Amlodipine Besilate 10 mg Kaplet (SAMPHARINDO PERDANA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000702', 'Amlodipine Besilate 5 mg Tablet (TEMPO SCAN PACIFIC Tbk)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001077', 'Pyrazinamide 500 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000400', 'Streptomycin Sulfate 1000 mg Serbuk Injeksi (KIMIA FARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000703', 'Valsartan 160 mg Kaplet Salut Selaput (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001019', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 75 mg / Pyrazinamide 400 mg / Ethambutol 275 
mg Kaplet Salut Selaput (KIMIA FARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001162', 'Rifapentine 150 mg Tablet Salut Selaput (PRIFTIN)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000896', 'Amlodipine Besilate 5 mg Tablet (MERSIFARMA TIRMAKU MERCUSANA)', '6.3 Lampiran 3  Kode Kf+a 
Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001357', 'Amlodipine Besilate 5 mg Tablet (KIMIA FARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000329', 'Nifedipine 30 mg Tablet Pelepasan Lambat (ADALAT OROS)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001345', 'Bisoprolol Fumarate 1,25 mg Tablet Salut Selaput (CONCOR)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000461', 'Bisoprolol Fumarate 10 mg Tablet Salut Selaput (Concor)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001323', 'Bisoprolol Fumarate 2.5 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000732', 'Bisoprolol Fumarate 5 mg Tablet (DEXA MEDICA - Indonesia - -)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000733', 'Bisoprolol Fumarate 5 mg Tablet (B-BETA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000734', 'Bisoprolol Fumarate 5 mg Tablet (BETA-ONE)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000735', 'Bisoprolol Fumarate 5 mg Tablet (BISCOR)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000736', 'Bisoprolol Fumarate 5 mg Tablet (BISOVELL)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000737', 'Bisoprolol Fumarate 5 mg Tablet (BIPRO)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000738', 'Bisoprolol Fumarate 5 mg Tablet (CARBISOL)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000739', 'Bisoprolol Fumarate 5 mg Tablet (MINITEN)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000740', 'Bisoprolol Fumarate 5 mg Tablet (MAINTATE 5)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000741', 'Bisoprolol Fumarate 5 mg Tablet (SELBIX)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000742', 'Bisoprolol Fumarate 5 mg Tablet (OPIPROL 5)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000743', 'Bisoprolol Fumarate 5 mg Tablet (BIOFIN)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000744', 'Bisoprolol Fumarate 5 mg Tablet (HAPSEN)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000745', 'Bisoprolol Fumarate 5 mg Tablet (TENCARD)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000746', 'Bisoprolol Fumarate 5 mg Tablet (CONCOR)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000747', 'Bisoprolol Fumarate 5 mg Tablet (KONBLOBET)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000748', 'Bisoprolol Fumarate 5 mg Tablet (HEXPHARM JAYA LABORATORIES - Indonesia - -)', '6.3 Lampiran 3  
Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000749', 'Bisoprolol Fumarate 5 mg Tablet (NOVELL PHARMACEUTICAL LAB. - Indonesia - -)', '6.3 Lampiran 3  
Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000750', 'Bisoprolol Fumarate 5 mg Tablet (BETA PHARMACON - Indonesia - -)', '6.3 Lampiran 3  Kode Kf+a 
Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000751', 'Bisoprolol Fumarate 5 mg Tablet (KIMIA FARMA Tbk. - Indonesia - -)', '6.3 Lampiran 3  Kode Kf+a 
Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001417', 'Propanolol 40 mg Tablet (HOLI PHARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000780', 'Propranolol 10 mg Tablet (DEXA MEDICA - Indonesia - -)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000784', 'Propranolol 10 mg Tablet (HOLI PHARMA - Indonesia - -)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000382', 'Carvedilol 25 mg Tablet (V-BLOC)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001335', 'Carvedilol 6,25 mg Tablet (DARYA-VARIA LABORATORIA TBK)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000330', 'Diltiazem Hydrochloride 100 mg Kapsul Pelepasan Lambat (HERBESSER CD 100)', '6.3 Lampiran 3  Kode 
Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000331', 'Diltiazem Hydrochloride 200 mg Kapsul Pelepasan Lambat (HERBESSER CD 200)', '6.3 Lampiran 3  Kode 
Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000421', 'Diltiazem Hydrochloride 30 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001509', 'Diltiazem Hydrochloride 50 mg / mL Serbuk Injeksi (HERBESSER)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000266', 'Verapamil 240 mg Kaplet Salut Selaput (ISOPTIN SR)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001356', 'Hydrochlorothiazide 25 mg Tablet (KIMIA FARMA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001238', 'Imidapril 10 mg Tablet (TANAPRESS)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001350', 'Captopril 12,5 mg Tablet (PHAPROS Tbk)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001349', 'Captopril 25 mg Tablet (PHAPROS Tbk)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000677', 'Perindopril Arginine 5 mg Tablet Salut Selaput (BIOPREXUM)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000541', 'Ramipril 10 mg Tablet (NOVELL PHARMACEUTICAL LABORATORIES)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000569', 'Ramipril 2,5 mg Tablet (HYPERIL)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001421', 'Ramipril 5 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000272', 'Irbesartan 150 mg Tablet (IRETENSA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000273', 'Irbesartan 150 mg Tablet (IRTAN)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001497', 'Irbesartan 300 mg Tablet (IRETENSA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001496', 'Irbesartan 300 mg Tablet (IRBESAL)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001420', 'Candesartan Cilexetil 8 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001107', 'Telmisartan 40 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001108', 'Telmisartan 80 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000704', 'Valsartan 160 mg Kaplet Salut Selaput (PYRIDAM FARMA TBK)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000613', 'Valsartan 160 mg Tablet Salut Selaput (HEXPHARM JAYA LABORATORIES)', '6.3 Lampiran 3  Kode Kf+a 
Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000617', 'Valsartan 160 mg Tablet Salut Selaput (NULAB PHARMACEUTICAL INDONESIA)', '6.3 Lampiran 3  Kode Kf+a 
Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000619', 'Valsartan 160 mg Tablet Salut Selaput (VALTENSI)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000620', 'Valsartan 160 mg Tablet Salut Selaput (DIOVAN)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001455', 'Clonidine Hydrochloride 150 mcg/mL Cairan Injeksi (CATAPRES)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001456', 'Clonidine Hydrochloride 150 mcg/mL Cairan Injeksi (PYRIDAM FARMA TBK)', '6.3 Lampiran 3  Kode Kf+a 
Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001372', 'Imidapril 5 mg Tablet (TANAPRESS)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001023', 'Captopril 25 mg Tablet (RAMA EMERALD MULTI SUKSES)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000568', 'Ramipril 2,5 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000271', 'Irbesartan 150 mg Tablet (IKAPHARMINDO PUTRAMAS)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001498', 'Irbesartan 300 mg Tablet (IRTAN)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001418', 'Candesartan Cilexetil 16 mg Tablet (DEXA MEDICA)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93000614', 'Valsartan 160 mg Tablet Salut Selaput (KIMIA FARMA Tbk)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001382', 'Clonidine Hydrochloride 0,15 mg Tablet (KIMIA FARMA Tbk.)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('93001401', 'Methyldopa 250 mg Tablet Salut Selaput (DOPAMET)', '6.3 Lampiran 3  Kode Kf+a Produ');
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92001267', 'Paracetamol 500 mg Tablet', NULL);
INSERT INTO "public"."ihs_kode_kf_a" ("id", "namaproduk", "keterangan") VALUES ('92002047', 'Ethambutol HCl 500 mg / Pyridoxine HCl 10 mg / Isoniazid 200 mg', NULL);
COMMIT;

-- ----------------------------
-- Table structure for ihs_kode_kf_a_brand
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_kode_kf_a_brand";
CREATE TABLE "public"."ihs_kode_kf_a_brand" (
  "id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "namaproduk" varchar(255) COLLATE "pg_catalog"."default",
  "keterangan" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."ihs_kode_kf_a_brand" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_kode_kf_a_brand
-- ----------------------------
BEGIN;
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001077', 'Pyrazinamide 500 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001078', 'Pyrazinamide 500 mg Tablet (SANBE FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001079', 'Pyrazinamide 500 mg Tablet (KIMIA FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000400', 'Streptomycin Sulfate 1000 mg Serbuk Injeksi (KIMIA FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000147', 'Levofloxacin Hemihydrate 250 mg Tablet Salut Selaput (KIMIA FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000402', 'Bedaquiline Fumarate 100 mg Tablet (SIRTURO)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001019', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 75 mg / Pyrazinamide 400 mg / 
Ethambutol 275 mg Kaplet Salut Selaput (KIMIA FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001021', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 75 mg / Pyrazinamide 400 mg / 
Ethambutol 275 mg Kaplet Salut Selaput (PHAPROS)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001017', 'Obat Anti Tuberculosis / Rifampicin 150 mg / Isoniazid 150 mg Tablet Salut Selaput (KIMIA 
FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001025', 'Obat Anti Tuberculosis / Rifampicin 75 mg / Isoniazid 50 mg / Pyrazinamide 150 mg Tablet 
Dispersibel (INDOFARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001022', 'Obat Anti Tuberculosis / Rifampicin 75 mg / Isoniazid 50 mg Tablet Dispersibel (INDOFARMA)', 
NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000761', 'Amikacin 250 mg/ml Injeksi (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000832', 'Isoniazid 100 mg Tablet (KIMIA FARMA Tbk.)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001162', 'Rifapentine 150 mg Tablet Salut Selaput (PRIFTIN)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000483', 'Amlodipine Besilate 10 mg Kaplet (SAMPHARINDO PERDANA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000702', 'Amlodipine Besilate 5 mg Tablet (TEMPO SCAN PACIFIC Tbk)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000896', 'Amlodipine Besilate 5 mg Tablet (MERSIFARMA TIRMAKU MERCUSANA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001357', 'Amlodipine Besilate 5 mg Tablet (KIMIA FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000329', 'Nifedipine 30 mg Tablet Pelepasan Lambat (ADALAT OROS)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001345', 'Bisoprolol Fumarate 1,25 mg Tablet Salut Selaput (CONCOR)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000461', 'Bisoprolol Fumarate 10 mg Tablet Salut Selaput (Concor)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001323', 'Bisoprolol Fumarate 2.5 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000732', 'Bisoprolol Fumarate 5 mg Tablet (DEXA MEDICA - Indonesia - -)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000733', 'Bisoprolol Fumarate 5 mg Tablet (B-BETA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000734', 'Bisoprolol Fumarate 5 mg Tablet (BETA-ONE)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000735', 'Bisoprolol Fumarate 5 mg Tablet (BISCOR)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000736', 'Bisoprolol Fumarate 5 mg Tablet (BISOVELL)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000737', 'Bisoprolol Fumarate 5 mg Tablet (BIPRO)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000738', 'Bisoprolol Fumarate 5 mg Tablet (CARBISOL)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000739', 'Bisoprolol Fumarate 5 mg Tablet (MINITEN)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000740', 'Bisoprolol Fumarate 5 mg Tablet (MAINTATE 5)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000741', 'Bisoprolol Fumarate 5 mg Tablet (SELBIX)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000742', 'Bisoprolol Fumarate 5 mg Tablet (OPIPROL 5)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000743', 'Bisoprolol Fumarate 5 mg Tablet (BIOFIN)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000744', 'Bisoprolol Fumarate 5 mg Tablet (HAPSEN)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000745', 'Bisoprolol Fumarate 5 mg Tablet (TENCARD)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000746', 'Bisoprolol Fumarate 5 mg Tablet (CONCOR)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000747', 'Bisoprolol Fumarate 5 mg Tablet (KONBLOBET)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000748', 'Bisoprolol Fumarate 5 mg Tablet (HEXPHARM JAYA LABORATORIES - Indonesia - -)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000749', 'Bisoprolol Fumarate 5 mg Tablet (NOVELL PHARMACEUTICAL LAB. - Indonesia - -)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000750', 'Bisoprolol Fumarate 5 mg Tablet (BETA PHARMACON - Indonesia - -)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000751', 'Bisoprolol Fumarate 5 mg Tablet (KIMIA FARMA Tbk. - Indonesia - -)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001417', 'Propanolol 40 mg Tablet (HOLI PHARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000780', 'Propranolol 10 mg Tablet (DEXA MEDICA - Indonesia - -)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000784', 'Propranolol 10 mg Tablet (HOLI PHARMA - Indonesia - -)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000382', 'Carvedilol 25 mg Tablet (V-BLOC)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001335', 'Carvedilol 6,25 mg Tablet (DARYA-VARIA LABORATORIA TBK)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000330', 'Diltiazem Hydrochloride 100 mg Kapsul Pelepasan Lambat (HERBESSER CD 100)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000331', 'Diltiazem Hydrochloride 200 mg Kapsul Pelepasan Lambat (HERBESSER CD 200)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000421', 'Diltiazem Hydrochloride 30 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001509', 'Diltiazem Hydrochloride 50 mg / mL Serbuk Injeksi (HERBESSER)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000266', 'Verapamil 240 mg Kaplet Salut Selaput (ISOPTIN SR)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001356', 'Hydrochlorothiazide 25 mg Tablet (KIMIA FARMA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001238', 'Imidapril 10 mg Tablet (TANAPRESS)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001372', 'Imidapril 5 mg Tablet (TANAPRESS)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001350', 'Captopril 12,5 mg Tablet (PHAPROS Tbk)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001023', 'Captopril 25 mg Tablet (RAMA EMERALD MULTI SUKSES)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001349', 'Captopril 25 mg Tablet (PHAPROS Tbk)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000677', 'Perindopril Arginine 5 mg Tablet Salut Selaput (BIOPREXUM)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000541', 'Ramipril 10 mg Tablet (NOVELL PHARMACEUTICAL LABORATORIES)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000568', 'Ramipril 2,5 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000569', 'Ramipril 2,5 mg Tablet (HYPERIL)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001421', 'Ramipril 5 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000271', 'Irbesartan 150 mg Tablet (IKAPHARMINDO PUTRAMAS)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000272', 'Irbesartan 150 mg Tablet (IRETENSA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000273', 'Irbesartan 150 mg Tablet (IRTAN)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001497', 'Irbesartan 300 mg Tablet (IRETENSA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001498', 'Irbesartan 300 mg Tablet (IRTAN)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001496', 'Irbesartan 300 mg Tablet (IRBESAL)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001418', 'Candesartan Cilexetil 16 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001420', 'Candesartan Cilexetil 8 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001107', 'Telmisartan 40 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001108', 'Telmisartan 80 mg Tablet (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000703', 'Valsartan 160 mg Kaplet Salut Selaput (DEXA MEDICA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000704', 'Valsartan 160 mg Kaplet Salut Selaput (PYRIDAM FARMA TBK)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000613', 'Valsartan 160 mg Tablet Salut Selaput (HEXPHARM JAYA LABORATORIES)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000614', 'Valsartan 160 mg Tablet Salut Selaput (KIMIA FARMA Tbk)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000617', 'Valsartan 160 mg Tablet Salut Selaput (NULAB PHARMACEUTICAL INDONESIA)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000619', 'Valsartan 160 mg Tablet Salut Selaput (VALTENSI)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93000620', 'Valsartan 160 mg Tablet Salut Selaput (DIOVAN)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001382', 'Clonidine Hydrochloride 0,15 mg Tablet (KIMIA FARMA Tbk.)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001455', 'Clonidine Hydrochloride 150 mcg/mL Cairan Injeksi (CATAPRES)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001456', 'Clonidine Hydrochloride 150 mcg/mL Cairan Injeksi (PYRIDAM FARMA TBK)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93001401', 'Methyldopa 250 mg Tablet Salut Selaput (DOPAMET)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93002785', 'Paracetamol 500 mg Tablet (PANADOL)', NULL);
INSERT INTO "public"."ihs_kode_kf_a_brand" ("id", "namaproduk", "keterangan") VALUES ('93005793', 'Ethambutol HCl 500 mg / Pyridoxine HCl 10 mg / Isoniazid 200 mg (PULNA FORTE)', NULL);
COMMIT;

-- ----------------------------
-- Table structure for ihs_kode_kf_a_kemasan
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_kode_kf_a_kemasan";
CREATE TABLE "public"."ihs_kode_kf_a_kemasan" (
  "id" int4 NOT NULL,
  "produkfk" int4,
  "ihs_bahanzat" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."ihs_kode_kf_a_kemasan" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_kode_kf_a_kemasan
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for ihs_map_bahanzat
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_map_bahanzat";
CREATE TABLE "public"."ihs_map_bahanzat" (
  "id" int4 NOT NULL,
  "produkfk" int4,
  "ihs_bahanzat" varchar(255) COLLATE "pg_catalog"."default",
  "qtynum" float8,
  "qtydenom" float8,
  "denomsatuanfk" varchar(255) COLLATE "pg_catalog"."default",
  "numerartorsatuanfk" varchar(255) COLLATE "pg_catalog"."default",
  "norec" varchar(255) COLLATE "pg_catalog"."default",
  "aktif" bool
)
;
ALTER TABLE "public"."ihs_map_bahanzat" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_map_bahanzat
-- ----------------------------
BEGIN;
INSERT INTO "public"."ihs_map_bahanzat" ("id", "produkfk", "ihs_bahanzat", "qtynum", "qtydenom", "denomsatuanfk", "numerartorsatuanfk", "norec", "aktif") VALUES (1, 5001053, '91000303', NULL, 
NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ihs_map_bahanzat" ("id", "produkfk", "ihs_bahanzat", "qtynum", "qtydenom", "denomsatuanfk", "numerartorsatuanfk", "norec", "aktif") VALUES (2, 17232, '91000340', NULL, 
NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."ihs_map_bahanzat" ("id", "produkfk", "ihs_bahanzat", "qtynum", "qtydenom", "denomsatuanfk", "numerartorsatuanfk", "norec", "aktif") VALUES (3, 5010592, '91000101', 1, 
500, 'TAB', 'mg', '062c7fb0-58cc-11ed-b0a6-b7f024ea', NULL);
INSERT INTO "public"."ihs_map_bahanzat" ("id", "produkfk", "ihs_bahanzat", "qtynum", "qtydenom", "denomsatuanfk", "numerartorsatuanfk", "norec", "aktif") VALUES (4, 5010723, '91000288', 500, 
1, 'TAB', 'mg', '5585a8a0-58cd-11ed-a766-e59e06d8', NULL);
COMMIT;

-- ----------------------------
-- Table structure for ihs_numerator_satuan
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_numerator_satuan";
CREATE TABLE "public"."ihs_numerator_satuan" (
  "id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "nama" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."ihs_numerator_satuan" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_numerator_satuan
-- ----------------------------
BEGIN;
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('m', 'meter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('s', 'detik');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('g', 'gram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[pi]', 'pi');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('%', 'persen');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[ppth]', 'bagian per seribu');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[ppm]', 'bagian per sejuta');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[ppb]', 'bagian per semilyar');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[pptr]', 'parts per trillion');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('mol', 'mol');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('Cel', 'derajat Celcius');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('L', 'Liter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('min', 'menit');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('h', 'jam');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('d', 'hari');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('a', 'tahun');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('wk', 'minggu');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('mo', 'bulan');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('t', 'ton');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('bar', 'bar');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[in_i]', 'inci');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[mil_i]', 'mil');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('cal', 'kalori');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[mesh_i]', 'mesh');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('eq', 'equivalent');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('osm', 'osmol');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[pH]', 'pH');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('g%', 'gram persen');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('U', 'enzim unit');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[IU]', 'internasional unit');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[tb''U]', 'tuberculin unit');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[CCID_50]', '50% cell culture infectious dose');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[PFU]', 'plaque forming units');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[CFU]', 'colony forming units');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[Lf]', 'Limit of flocculation');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('[D''ag''U]', 'D-antigen unit (polio)');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/d', 'per hari');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/g', 'per gram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/kg', 'per kilogram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/L', 'per liter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/m2', 'per meter persegi');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/m3', 'per meter kubik');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/mg', 'per milligram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/min', 'per menit');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/mL', 'per milliliter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/mm', 'per millimeter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/s', 'per detik');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('/U', 'per unit enzim');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('10*3', '10^3 (jumlah cell)');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('10*5', '10^5');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('10*6', '10^6');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('cg', 'sentigram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('cL', 'sentiliter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('cm', 'sentimeter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('cm2', 'sentimeter persegi');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('kcal', 'kilokalori');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('kg', 'kilogram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('kL', 'kiloliter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('km', 'kilometer');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('mg', 'milligram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('mL', 'milliliter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('mm', 'millimeter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('mmol', 'millimol');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('ng', 'nanogram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('ug', 'mikrogram');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('uL', 'mikroliter');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('10*9', '10^9');
INSERT INTO "public"."ihs_numerator_satuan" ("id", "nama") VALUES ('10*10', '10^10');
COMMIT;

-- ----------------------------
-- Table structure for ihs_sediaan
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_sediaan";
CREATE TABLE "public"."ihs_sediaan" (
  "id" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "nama" varchar(255) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."ihs_sediaan" OWNER TO "postgres";

-- ----------------------------
-- Records of ihs_sediaan
-- ----------------------------
BEGIN;
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS001', 'Aerosol Foam');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS002', 'Aerosol Metered Dose');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS003', 'Aerosol Spray');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS004', 'Oral Spray');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS005', 'Buscal Spray');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS006', 'Transdermal Spray');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS007', 'Topical Spray');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS008', 'Serbuk Spray');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS009', 'Eliksir');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS010', 'Emulsi');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS011', 'Enema');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS012', 'Gas');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS013', 'Gel');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS014', 'Gel Mata');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS015', 'Granul Effervescent');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS016', 'Granula');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS017', 'Intra Uterine Device (IUD)');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS018', 'Implant');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS019', 'Kapsul');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS020', 'Kapsul Lunak');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS021', 'Kapsul Pelepasan Lambat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS022', 'Kaplet');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS023', 'Kaplet Salut Selaput');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS024', 'Kaplet Salut Enterik');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS025', 'Kaplet Salut Gula');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS026', 'Kaplet Pelepasan Lambat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS027', 'Kaplet Pelepasan Cepat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS028', 'Kaplet Kunyah');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS029', 'Kaplet Kunyah Salut Selaput');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS030', 'Krim');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS031', 'Krim Lemak');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS032', 'Larutan');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS033', 'Larutan Inhalasi');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS034', 'Larutan Injeksi');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS035', 'Infus');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS036', 'Obat Kumur');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS037', 'Ovula');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS038', 'Pasta');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS039', 'Pil');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS040', 'Patch');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS041', 'Pessary');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS042', 'Salep');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS043', 'Salep Mata');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS044', 'Sampo');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS045', 'Semprot Hidung');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS046', 'Serbuk Aerosol');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS047', 'Serbuk Oral');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS048', 'Serbuk Inhaler');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS049', 'Serbuk Injeksi');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS050', 'Serbuk Injeksi Liofilisasi');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS051', 'Serbuk Infus');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS052', 'Serbuk Obat Luar / Serbuk Tabur');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS053', 'Serbuk Steril');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS054', 'Serbuk Effervescent');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS055', 'Sirup');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS056', 'Sirup Kering');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS057', 'Sirup Kering Pelepasan Lambat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS058', 'Subdermal Implants');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS059', 'Supositoria');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS060', 'Suspensi');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS061', 'Suspensi Injeksi');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS062', 'Suspensi / Cairan Obat Luar');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS063', 'Cairan Steril');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS064', 'Cairan Mata');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS065', 'Cairan Diagnostik');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS066', 'Tablet');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS067', 'Tablet Effervescent');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS068', 'Tablet Hisap');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS069', 'Tablet Kunyah');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS070', 'Tablet Pelepasan Cepat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS071', 'Tablet Pelepasan Lambat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS072', 'Tablet Disintegrasi Oral');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS073', 'Tablet Dispersibel');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS074', 'Tablet Cepat Larut');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS075', 'Tablet Salut Gula');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS076', 'Tablet Salut Enterik');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS077', 'Tablet Salut Selaput');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS078', 'Tablet Sublingual');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS079', 'Tablet Sublingual Pelepasan Lambat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS080', 'Tablet Vaginal');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS081', 'Tablet Lapis');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS082', 'Tablet Lapis Lepas Lambat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS083', 'Chewing Gum');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS084', 'Tetes Mata');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS085', 'Tetes Hidung');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS086', 'Tetes Telinga');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS087', 'Tetes Oral (Oral Drops)');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS088', 'Tetes Mata Dan Telinga');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS089', 'Transdermal');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS090', 'Transdermal Urethral');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS091', 'Tulle/Plester Obat');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS092', 'Vaginal Cream');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS093', 'Vaginal Gel');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS094', 'Vaginal Douche');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS095', 'Vaginal Ring');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS096', 'Vaginal Tissue');
INSERT INTO "public"."ihs_sediaan" ("id", "nama") VALUES ('BS097', 'Suspensi Inhalasi');
COMMIT;

-- ----------------------------
-- Primary Key structure for table ihs_bahanzat
-- ----------------------------
ALTER TABLE "public"."ihs_bahanzat" ADD CONSTRAINT "ihs_bahanzat_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ihs_denom_satuan
-- ----------------------------
ALTER TABLE "public"."ihs_denom_satuan" ADD CONSTRAINT "ihs_denom_satuan_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ihs_kode_kf_a
-- ----------------------------
ALTER TABLE "public"."ihs_kode_kf_a" ADD CONSTRAINT "ihs_kode_kf_a_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ihs_kode_kf_a_brand
-- ----------------------------
ALTER TABLE "public"."ihs_kode_kf_a_brand" ADD CONSTRAINT "ihs_kode_kf_a_brand_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ihs_kode_kf_a_kemasan
-- ----------------------------
ALTER TABLE "public"."ihs_kode_kf_a_kemasan" ADD CONSTRAINT "ihs_map_bahanzat_copy1_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ihs_map_bahanzat
-- ----------------------------
ALTER TABLE "public"."ihs_map_bahanzat" ADD CONSTRAINT "ihs_map_bahanzat_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ihs_numerator_satuan
-- ----------------------------
ALTER TABLE "public"."ihs_numerator_satuan" ADD CONSTRAINT "ihs_numerator_satuan_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table ihs_sediaan
-- ----------------------------
ALTER TABLE "public"."ihs_sediaan" ADD CONSTRAINT "ihs_sediaan_pkey" PRIMARY KEY ("id");



-- ----------------------------
-- Table structure for ihs_transaction
-- ----------------------------
DROP TABLE IF EXISTS "public"."ihs_transaction";
CREATE TABLE "public"."ihs_transaction" (
  "norec" varchar(32) COLLATE "pg_catalog"."default" NOT NULL,
  "statusenabled" bool,
  "kdprofile" int2,
  "resourcetype" varchar(255) COLLATE "pg_catalog"."default",
  "url" varchar(255) COLLATE "pg_catalog"."default",
  "method" varchar(255) COLLATE "pg_catalog"."default",
  "id" varchar COLLATE "pg_catalog"."default",
  "body" jsonb,
  "response" text COLLATE "pg_catalog"."default",
  "date" timestamp(6)
)
;
ALTER TABLE "public"."ihs_transaction" OWNER TO "postgres";

-- ----------------------------
-- Primary Key structure for table ihs_transaction
-- ----------------------------
ALTER TABLE "public"."ihs_transaction" ADD CONSTRAINT "ihs_transaction_pkey" PRIMARY KEY ("norec");


ALTER TABLE "public"."hasillaboratorium_t" 
  ADD COLUMN "ihs_id" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_diagnosticreport" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "orderpelayananfk" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "loinc_id" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "loinc_name" varchar(255) COLLATE "pg_catalog"."default";
	
-- 	menua
select max(id) from modulaplikasi_s;
select max(id) from objekmodulaplikasi_s;
select max(id) from mapobjekmodulaplikasitomodulaplikasi_s;
select max(id) from  maploginusertomodulaplikasi_s;
INSERT INTO "public"."modulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "kdmodulaplikasi", "modulaplikasi", "iconimage", "nourut", 
"kdmodulaplikasihead", "moduliconimage", "modulnourut") VALUES (265, 30, 't', NULL, NULL, '1eff4ca0-586f-11ed-8852-7d5fb8ea', 'Modul', '241', 'SATUSEHAT', NULL, NULL, NULL, NULL, NULL);
INSERT INTO "public"."modulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "kdmodulaplikasi", "modulaplikasi", "iconimage", "nourut", 
"kdmodulaplikasihead", "moduliconimage", "modulnourut") VALUES (266, 30, 't', NULL, NULL, '2d17b180-586f-11ed-8c09-e9380d98', 'Menu', '242', 'SATUSEHAT', NULL, NULL, 265, NULL, NULL);
INSERT INTO "public"."objekmodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fungsi", "kdobjekmodulaplikasi", "keterangan", 
"objekmodulaplikasi", "nourut", "kdobjekmodulaplikasihead", "alamaturlform", "ishide") VALUES (10291, 30, 't', 'H', NULL, '7e51b290-586f-11ed-a4eb-5f1ef5b9', NULL, 'SATUSEHAT', '10121', 
'SATUSEHAT', 'SATUSEHAT', 1000, NULL, NULL, 'f');
INSERT INTO "public"."objekmodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fungsi", "kdobjekmodulaplikasi", "keterangan", 
"objekmodulaplikasi", "nourut", "kdobjekmodulaplikasihead", "alamaturlform", "ishide") VALUES (10292, 30, 't', NULL, NULL, '993ac240-586f-11ed-933a-811c5f99', NULL, '-', '10122', '-', 
'Resources', 1001, 10291, '#/IHS_tools', 'f');
INSERT INTO "public"."objekmodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fungsi", "kdobjekmodulaplikasi", "keterangan", 
"objekmodulaplikasi", "nourut", "kdobjekmodulaplikasihead", "alamaturlform", "ishide") VALUES (10293, 30, 't', NULL, NULL, 'bdea7e60-586f-11ed-b6e2-e3ca6541', NULL, '-', '10123', '-', 
'Struktur Organisasi', 1002, 10291, '#/TWFzdGVyUnVhbmdhbg==', 'f');
INSERT INTO "public"."objekmodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "fungsi", "kdobjekmodulaplikasi", "keterangan", 
"objekmodulaplikasi", "nourut", "kdobjekmodulaplikasihead", "alamaturlform", "ishide") VALUES (10294, 30, 't', NULL, NULL, 'cb9962f0-586f-11ed-adc6-516628de', NULL, '-', '10124', '-', 
'Produk', 1003, 10291, '#/TWFzdGVyUHJvZHVrQXBvdGlr', 'f');

INSERT INTO "public"."mapobjekmodulaplikasitomodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "modulaplikasiid", 
"objekmodulaplikasiid") VALUES (6458, 30, 't', NULL, NULL, '7e6223f0-586f-11ed-b112-61bc4113', NULL, 266, 10291);
INSERT INTO "public"."mapobjekmodulaplikasitomodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "modulaplikasiid", 
"objekmodulaplikasiid") VALUES (6459, 30, 't', NULL, NULL, '994922b0-586f-11ed-9c75-c7826c2f', NULL, 266, 10292);
INSERT INTO "public"."mapobjekmodulaplikasitomodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "modulaplikasiid", 
"objekmodulaplikasiid") VALUES (6460, 30, 't', NULL, NULL, 'bdfbf3b0-586f-11ed-b117-c5832283', NULL, 266, 10293);
INSERT INTO "public"."mapobjekmodulaplikasitomodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "modulaplikasiid", 
"objekmodulaplikasiid") VALUES (6461, 30, 't', NULL, NULL, 'cba93890-586f-11ed-b4a4-d719fdfc', NULL, 266, 10294);
INSERT INTO "public"."maploginusertomodulaplikasi_s" ("id", "kdprofile", "statusenabled", "kodeexternal", "namaexternal", "norec", "reportdisplay", "objectmodulaplikasifk", 
"objectloginuserfk") VALUES (9838, 30, 't', NULL, NULL, 'f0c9b790-5870-11ed-9fe5-932ecbb6', NULL, 266, 30015);
update modulaplikasi_s set kdprofile = (select id from profile_m where statusenabled=true)	where kdprofile != (select id from profile_m where statusenabled=true)	;
update objekmodulaplikasi_s set kdprofile = (select id from profile_m where statusenabled=true)	where kdprofile != (select id from profile_m where statusenabled=true)	;
update mapobjekmodulaplikasitomodulaplikasi_s set kdprofile = (select id from profile_m where statusenabled=true)	where kdprofile != (select id from profile_m where statusenabled=true)	
;
update maploginusertomodulaplikasi_s set kdprofile = (select id from profile_m where statusenabled=true)	where kdprofile != (select id from profile_m where statusenabled=true)	;
update settingdatafixed_m set kdprofile = (select id from profile_m where statusenabled=true)	where kdprofile != (select id from profile_m where statusenabled=true)	;


ALTER TABLE "public"."departemen_m" 
  ADD COLUMN "ihs_id" varchar(255);
	ALTER TABLE "public"."ruangan_m" 
  ADD COLUMN "ihs_id" varchar(255);
		ALTER TABLE "public"."pegawai_m" 
  ADD COLUMN "ihs_id" varchar(255);
	
	ALTER TABLE "public"."profile_m" 
  ADD COLUMN "ihs_id" varchar(50) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_province" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_city" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_district" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_village" varchar(255) COLLATE "pg_catalog"."default";
	
	ALTER TABLE "public"."rencana_t" 
  ADD COLUMN "ihs_id" varchar;
	
ALTER TABLE "public"."profile_m" 
  ADD COLUMN "whatsapp" varchar(255);
	UPDATE "public"."profile_m" SET "lat" = '-6.8959898', "lng" = '107.6356674', "whatsapp" = '08112256192', "ihs_id" = '10080028', "ihs_province" = '31', "ihs_city" = '3273', 
"ihs_district" = '327312', "ihs_village" = '3273121008' WHERE "id" = 30;
	
	ALTER TABLE "public"."maphasillab_m" 
  ADD COLUMN "loinc_id" varchar(255) COLLATE "pg_catalog"."default",
  ADD COLUMN "loinc_name" varchar(255) COLLATE "pg_catalog"."default";
	
	ALTER TABLE "public"."pelayananpasien_t" 
  ADD COLUMN "ihs_id" varchar COLLATE "pg_catalog"."default",
  ADD COLUMN "ihs_noresep" varchar(255) COLLATE "pg_catalog"."default";
	
		
	ALTER TABLE "public"."hasillaboratorium_t" 
  ADD COLUMN "nilainormal" varchar
	
;
ALTER TABLE "public"."hasillaboratorium_t" 
  ADD COLUMN "satuan" varchar;

select * from profile_m where id=30
	
