<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Objek Model untuk daftar mahasiswa
 */
class Lupakatasandi_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}
	
	public function dapatkanAkunPerEmail($email, $select = '*')
    {
        return $this->db->select(
            $select
        )->where(
            'email', $email
        )->limit(1)
        ->get('calon_mahasiswa')
        ->row();
    }

    public function buatDataLupaSandi($data)
    {
        return $this->db->insert(
            'lupa_kata_sandi', $data
        );
    }
}
