<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Kartuuj_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}

    public function dapatkanGelombangDenganWaktu($waktu)
    {
        return $this->db->where(
            'tanggal_mulai <=', $waktu
        )->where(
            'tanggal_akhir >=', $waktu
        )->limit(1)
        ->get('gelombang')
        ->row();
    }

    public function dapatkanTahunAjarDenganId($id_tahun_ajar)
    {
        return $this->db->where(
            'id', $id_tahun_ajar
        )->limit(1)
        ->get('tahun_ajar')
        ->row();
    }

    public function dapatkanPendaftaranDenganIdGelombangIdCalonMahasiswa($id_gelombang, $id_calon_mahasiswa)
    {
        return $this->db->where(
            'id_gelombang', $id_gelombang
        )->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->limit(1)
        ->get('pendaftaran_calon_mahasiswa')
        ->row();
    } 
    
    public function dapatkanAlamatDenganIdPendaftaran($id_pendaftaran_calon_mahasiswa)
    {
        return $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->limit(1)
        ->get('alamat_calon_mahasiswa')
        ->row();
    }   

    public function dapatkanBiodataDenganIdPendaftaran($id_pendaftaran_calon_mahasiswa)
    {
        return $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->limit(1)
        ->get('biodata_calon_mahasiswa')
        ->row();
    }   
	
    public function dapatkanProdiDenganIdPendaftaran($id_pendaftaran_calon_mahasiswa)
    {
        $data = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->limit(1)
        ->get('prodi_calon_mahasiswa')
        ->row();

        if (empty($data)) {
            return null;
        }

        $data->program_studi = $this->db->where(
            'id', $data->id_program_studi
        )->limit(1)
        ->get('program_studi')
        ->row();

        $data->kelas = $this->db->where(
            'id', $data->id_kelas
        )->limit(1)
        ->get('kelas')
        ->row();

        $data->program_studi->jenjang_pendidikan = $this->db->where(
            'id',
            $data->program_studi->id_jenjang_pendidikan
        )->limit(1)
        ->get('jenjang_pendidikan')
        ->row();

        return $data;
    }

    public function dapatkanAsalSekolahDenganIdPendaftaran($id_pendaftaran_calon_mahasiswa)
    {
        $data = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->limit(1)
        ->get('asal_sekolah_calon_mahasiswa')
        ->row();

        if (empty($data)) {
            return null;
        }

        $data->sekolah = $this->db->where(
            'id', $data->id_sekolah
        )->limit(1)
        ->get('sekolah')
        ->row();

        return $data;
    }

    public function dapatkanKelompokDenganID($id_kelompok)
    {
        return $this->db->where(
            'id', $id_kelompok
        )->get('kelompok')
        ->row();
    }

    public function buatNomorPraRegistrasi($id, $input)
    {
        $this->db->where(
			'id', $id
		)->update(
            'pendaftaran_calon_mahasiswa', $input
        );
    }

    public function dapatkanUniversitas()
    {
        return $this->db->limit(1)->get(
            'universitas'
        )->row();
    }
}
