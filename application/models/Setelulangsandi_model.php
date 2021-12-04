<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Objek Model untuk daftar mahasiswa
 */
class Setelulangsandi_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}

    public function dapatkanPengguna($email, $kode)
    {
        return $this->db->select(
            'calon_mahasiswa.id,lupa_kata_sandi.waktu_akhir,calon_mahasiswa.email'
        )->join(
            'lupa_kata_sandi',
            'lupa_kata_sandi.id_calon_mahasiswa = calon_mahasiswa.id',
            'inner'
        )->where(
            'calon_mahasiswa.email', $email
        )->where(
            'lupa_kata_sandi.kode', $kode
        )
        ->limit(
            1
        )->order_by(
            'waktu_akhir', 'desc'
        )->get(
            'calon_mahasiswa'
        )->row();
    }

    public function ubahPengguna($email, $kata_sandi)
    {
        return $this->db->where(
            'email', $email
        )->update('calon_mahasiswa', [
            'kata_sandi' => $kata_sandi
        ]);
    }

    public function hapusLupaSandi($id_calon_mahasiswa)
    {
        return $this->db->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->delete('lupa_kata_sandi');
    }
}
