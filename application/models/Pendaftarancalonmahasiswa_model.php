<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Objek Model untuk daftar mahasiswa
 */
class Pendaftarancalonmahasiswa_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}

    public function dapatkanBiodataDenganIdPendaftaran($id_pendaftaran_calon_mahasiswa, $select = '*')
    {
        return $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->select($select)
        ->limit(1)
        ->get('biodata_calon_mahasiswa')
        ->row();
    }

    public function dapatkanKelompokDenganIdPendaftaran($id_pendaftaran_calon_mahasiswa)
    {
        $data = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->limit(1)
        ->get('prodi_calon_mahasiswa')
        ->row();

        $data->program_studi = $this->db->where(
            'id', $data->id_program_studi
        )->limit(1)
        ->get('program_studi')
        ->row();

        $data->program_studi->kelompok = $this->db->where(
            'id', $data->program_studi->id_kelompok
        )->limit(1)
        ->get('kelompok')
        ->row();

        return $data;
    }

    public function dapatkanSemuaBank()
    {
        return $this->db->get(
            'bank'
        )->result();
    }

    public function dapatkanJadwal($waktu)
    {
        return $this->db->where(
            'tanggal_mulai <=', $waktu 
        )->where(
            'tanggal_akhir >=', $waktu
        )->limit(
            1
        )->get(
            'gelombang'
        )->row();
    }
	
	public function dapatkanSemuaProvinsi($select = '*')
    {
        return $this->db->select(
            $select
        )->get('provinsi')
        ->result();
    }

    public function dapatkanSemuaSumberInfo($select = '*')
    {
        return $this->db->select(
            $select
        )->get('sumber_informasi')
        ->result();
    }

    public function dapatkanSemuaKelompok($select = '*')
    {
        return $this->db->select(
            $select
        )->get('kelompok')
        ->result();
    }

    public function dapatkanSemuaProdi($select = '*')
    {
        return $this->db->select(
            $select
        )->get('program_studi')
        ->result();
    }

    public function dapatkanSemuaProvinsiAsalSekolah($select = '*')
    {
        return $this->db->distinct(
           'kode_prop' 
        )->select(
            $select
        )->get('sekolah')
        ->result();
    }

    public function hapusPendaftaranDenganIdCalonMahasiswaIdJadwal($id_calon_mahasiswa, $id_jadwal)
    {
        return $this->db->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'id_gelombang', $id_jadwal
        )->delete('pendaftaran_calon_mahasiswa');   
    }

    public function dapatkanPendaftaranDenganIdCalonMahasiswaIdJadwal($id_calon_mahasiswa, $id_jadwal)
    {
        return $this->db->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'id_gelombang', $id_jadwal
        )->limit(1)
        ->get('pendaftaran_calon_mahasiswa')
        ->row();
    }

    public function dapatkanBerkasPendaftaranDenganIdGelombang($id_gelombang)
    {
        $berkas_pendaftaran = $this->db->where(
            'id_gelombang', $id_gelombang
        )->get('berkas_pendaftaran')
        ->result();

        foreach ($berkas_pendaftaran as $key => $value) {
            $berkas_pendaftaran[$key]->berkas = $this->db->where(
                'id', $value->id_berkas
            )->limit(1)
            ->get('berkas')
            ->row();

            $berkas_pendaftaran[$key]->berkas->tipe_berkas = $this->db->where(
                'id_berkas', $value->id_berkas
            )->get('tipe_berkas')
            ->result();
        }

        return $berkas_pendaftaran;
    }
}
