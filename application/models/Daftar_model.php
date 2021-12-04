<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Objek Model untuk daftar mahasiswa
 */
class Daftar_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}
	
	public function buatPengguna($input)
    {
        if ($this->db->insert('calon_mahasiswa', $input)) {
            return $this->db->insert_id();
        }

        return 0;
    }

    public function buatVerifikasi($id_mahasiswa, $kode)
    {
        $input = [
            'id_calon_mahasiswa' => $id_mahasiswa,
            'kode' => $kode,
            'waktu_akhir' => time() + (24 * 60 * 60) // 1x24 jam
        ];

        if ($this->db->insert('verifikasi_email', $input)) {
            return 1;
        }   

        return 0;
    }

    public function hapusMahasiswa($id_mahasiswa)
    {
        $this->db->where('id', $id_mahasiswa)
            ->delete('calon_mahasiswa');
    }
}
