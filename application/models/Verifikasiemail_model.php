<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Objek Model untuk daftar mahasiswa
 */
class Verifikasiemail_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}

    public function dapatkanPengguna($email, $kode)
    {
        return $this->db->select(
            'calon_mahasiswa.id,verifikasi_email.waktu_akhir'
        )->join(
            'verifikasi_email',
            'verifikasi_email.id_calon_mahasiswa = calon_mahasiswa.id',
            'inner'
        )->where(
            'calon_mahasiswa.email', $email
        )->where(
            'verifikasi_email.kode', $kode
        )
        ->limit(
            1
        )->order_by(
            'waktu_akhir', 'desc'
        )->get(
            'calon_mahasiswa'
        )->row();
    }

    public function hapusVerifikasiEmail($id_pengguna)
    {
        return $this->db->where(
            'id_calon_mahasiswa', $id_pengguna
        )->delete('verifikasi_email');
    }

    public function ubahPengguna($id_pengguna)
    {
        return $this->db->where(
            'id', $id_pengguna
        )->update('calon_mahasiswa', [
            'waktu_verifikasi' => date('Y-m-d H:i:s')
        ]);
    }
}
