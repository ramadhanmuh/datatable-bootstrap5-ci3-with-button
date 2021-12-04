<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Ajaxpendaftaranmahasiswa_model extends CI_Model {

	public function __construct() {
		parent::__construct();
	}

    public function dapatkanBiodataDenganIdCalonMahasiswaIdGelombang($id_calon_mahasiswa, $id_gelombang)
    {
        $data = $this->db->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'id_gelombang', $id_gelombang
        )->limit(1)
        ->get('pendaftaran_calon_mahasiswa')
        ->row();

        if (empty($data)) {
            return null;
        }

        $data->biodata = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $data->id
        )->limit(1)
        ->get('biodata_calon_mahasiswa')
        ->row();

        $data->alamat = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $data->id
        )->limit(1)
        ->get('alamat_calon_mahasiswa')
        ->row();

        if (!empty($data->alamat)) {
            $data->alamat->kecamatan = $this->db->where(
                'id', $data->alamat->id_kecamatan
            )->limit(1)
            ->get('kecamatan')
            ->row();
        }


        $data->sumber_informasi = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $data->id
        )->get('sumber_info_calon_mahasiswa')
        ->result();

        return $data;
    }

    public function dapatkanProdiDenganIdCalonMahasiswaIdGelombang($id_calon_mahasiswa, $id_gelombang)
    {
        $data = $this->db->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'id_gelombang', $id_gelombang
        )->limit(1)
        ->get('pendaftaran_calon_mahasiswa')
        ->row();

        if (empty($data)) {
            return null;
        }

        $data->program_studi = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $data->id
        )->limit(1)
        ->get('prodi_calon_mahasiswa')
        ->row();

        if (empty($data->program_studi)) {
            return null;
        }

        $data->program_studi->program_studi = $this->db->where(
            'id', $data->program_studi->id_program_studi
        )->limit(1)
        ->get('program_studi')
        ->row();

        $data->program_studi->kelas = $this->db->where(
            'id', $data->program_studi->id_kelas
        )->limit(1)
        ->get('kelas')
        ->row();

        $data->asal_sekolah = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $data->id
        )->limit(1)
        ->get('asal_sekolah_calon_mahasiswa')
        ->row();

        if (empty($data->asal_sekolah)) {
            return null;
        }

        $data->asal_sekolah->sekolah = $this->db->where(
            'id', $data->asal_sekolah->id_sekolah
        )->limit(1)
        ->get('sekolah')
        ->row();

        return $data;
    }

    public function dapatkanBerkasDenganIdCalonMahasiswaIdGelombang($id_calon_mahasiswa, $id_gelombang)
    {
        return $this->db->from(
            'pendaftaran_calon_mahasiswa as a'
        )->join(
            'berkas_calon_mahasiswa as b',
            'b.id_pendaftaran_calon_mahasiswa = a.id',
            'inner'
        )->select(
            'b.id_berkas_pendaftaran,b.alamat'
        )->where(
            'a.id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'a.id_gelombang', $id_gelombang
        )->get()
        ->result();
    }

    public function dapatkanPendaftaranDenganIdCalonMahasiswaIdGelombang($id_calon_mahasiswa, $id_gelombang)
    {
        return $this->db->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'id_gelombang', $id_gelombang
        )->limit(1)
        ->get('pendaftaran_calon_mahasiswa')
        ->row();
    }

    public function buatPendaftaran($input)
    {
        $this->db->insert(
            'pendaftaran_calon_mahasiswa', $input
        );

        return $this->db->insert_id();
    }

    public function buatBiodataAlamatSumberInformasi($input)
    {
        $this->db->insert(
            'biodata_calon_mahasiswa', $input['biodata']
        );

        $this->db->insert(
            'alamat_calon_mahasiswa', $input['alamat']
        );

        $dataSumberInfo = [];

        foreach ($input['sumber_informasi'] as $key => $value) {
            array_push($dataSumberInfo, [
                'id_pendaftaran_calon_mahasiswa' => $input['biodata']['id_pendaftaran_calon_mahasiswa'],
                'id_sumber_informasi' => $value
            ]);
        }

        $this->db->insert_batch('sumber_info_calon_mahasiswa', $dataSumberInfo);
    }

    public function ubahBiodataAlamatSumberInformasi($input, $id_pendaftaran)
    {
        $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran
        )->update(
            'biodata_calon_mahasiswa', $input['biodata']
        );

        $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran
        )->update(
            'alamat_calon_mahasiswa', $input['alamat']
        );

        $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran
        )->delete('sumber_info_calon_mahasiswa');

        $dataSumberInfo = [];

        foreach ($input['sumber_informasi'] as $key => $value) {
            array_push($dataSumberInfo, [
                'id_pendaftaran_calon_mahasiswa' => $id_pendaftaran,
                'id_sumber_informasi' => $value
            ]);
        }

        $this->db->insert_batch('sumber_info_calon_mahasiswa', $dataSumberInfo);
    }
    
    public function dapatkanPendaftaranCalonMahasiswa()
    {
        return $this->db->where(
            'id_calon_mahasiswa',
            $this->session->calon_mahasiswa->id
        )->get(
            'pendaftaran_calon_mahasiswa'
        )->row();
    }

    public function dapatkanBiodata()
    {
        return $this->db->select(
            'b.nama,b.nama_ibu,b.nomor_pengenal,b.kewarnegaraan,' .
            'b.jenis_kelamin,b.agama,b.tempat_lahir,b.tanggal_lahir,' .
            'b.nisn,b.nomor_ukg'
        )->from(
            'pendaftaran_calon_mahasiswa as a'
        )->join(
            'biodata_calon_mahasiswa as b',
            'b.id = a.id_biodata_calon_mahasiswa',
            'inner'
        )->limit(
            1
        )->get()
        ->row();
    }

    public function dapatkanGelombang($tanggal)
    {
        return $this->db->where(
            'tanggal_mulai <=', $tanggal 
        )->where(
            'tanggal_akhir >=', $tanggal
        )->limit(
            1
        )->get(
            'gelombang'
        )->row();
    }

    public function dapatkanBerkasPendaftaranDenganIdJadwalIdBerkasPendaftaran($id_jadwal, $id_gelombang)
    {
        return $this->db->where(
            'id_gelombang', $id_jadwal
        )->where(
            'id', $id_gelombang
        )->limit(1)
        ->get('berkas_pendaftaran')
        ->row();
    }

    public function dapatkanBerkasDenganId($id)
    {
        return $this->db->where(
            'id', $id
        )->limit(1)
        ->get('berkas')
        ->row();
    }

    public function hapusBerkasCalonMahasiswaDenganIdCalonMahasiswa()
    {
        $this->db->where(
            'id_calon_mahasiswa', $this->session->calon_mahasiswa->id
        )->delete('berkas_calon_mahasiswa');
    }

    public function dapatkanTipeBerkasDenganIdBerkas($id_berkas)
    {
        return $this->db->where(
            'id_berkas', $id_berkas
        )->get('tipe_berkas')
        ->result();
    }

    public function dapatkanBerkasCalonMahasiswa($id_berkas_pendaftaran, $id_pendaftaran_calon_mahasiswa)
    {
        return $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->where(
            'id_berkas_pendaftaran', $id_berkas_pendaftaran
        )->limit(1)
        ->get('berkas_calon_mahasiswa')
        ->row();
    }

    public function buatBerkasCalonMahasiswa($input)
    {
        $this->db->insert(
            'berkas_calon_mahasiswa', $input
        );
    }

    public function ubahBerkasCalonMahasiswa($input, $id)
    {
        $this->db->where(
            'id', $id
        )->update(
            'berkas_calon_mahasiswa', $input
        );
    }

    public function dapatkanBerkasPendaftaranDenganIdJadwal($id_jadwal)
    {
        return $this->db->where(
            'id_gelombang', $id_jadwal
        )->get('berkas_pendaftaran')
        ->result();
    }

    public function dapatkanKabupatenSekolahDenganKodeProp($kode_prop)
    {
        return $this->db->distinct(
            'kode_kab_kota'
        )->select(
            'kabupaten_kota,kode_kab_kota'
        )->where('kode_prop', $kode_prop)
        ->order_by('kabupaten_kota', 'ASC')
        ->get('sekolah')
        ->result();
    }

    public function dapatkanKecamatanSekolahDenganKodeKab($kode_kab)
    {
        return $this->db->distinct(
            'kode_kec'
        )->select(
            'kecamatan,kode_kec'
        )->where('kode_kab_kota', $kode_kab)
        ->order_by('kecamatan', 'ASC')
        ->get('sekolah')
        ->result();
    }

    public function dapatkanSekolahDenganKodeKec($kode_kec)
    {
        return $this->db->select(
            'id,sekolah'
        )->where('kode_kec', $kode_kec)
        ->where('bentuk', 'SMA')
        ->or_where('bentuk', 'SMK')
        ->order_by('sekolah', 'ASC')
        ->get('sekolah')
        ->result();
    }

    public function dapatkanProdiDenganIdKelompok($id_kelompok)
    {
        return $this->db->select(
            'id,nama'
        )->where('id_kelompok', $id_kelompok)
        ->get('program_studi')
        ->result();
    }

    public function dapatkanPendaftaranDengenIdMahasiswaIdGelombang($id_calon_mahasiswa, $id_gelombang)
    {
        return $this->db->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'id_gelombang', $id_gelombang
        )->get(
            'pendaftaran_calon_mahasiswa'
        )->row();
    }

    public function hapusBerkasCalonMahasiswaDenganIdPendaftaranIdBerkasPendaftaran($id_pendaftaran, $id_berkas_pendaftaran)
    {   
        $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran
        )->where(
            'id_berkas_pendaftaran', $id_berkas_pendaftaran
        )->delete('berkas_calon_mahasiswa');
    }

    public function dapatkanBerkasCalonMahasiswaDenganIdPendaftaranIdBerkasPendaftaran($id_pendaftaran, $id_berkas_pendaftaran)
    {
        return $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran
        )->where(
            'id_berkas_pendaftaran', $id_berkas_pendaftaran
        )->limit(1)
        ->get('berkas_calon_mahasiswa')
        ->row();
    }

    public function dapatkanProdiDenganId($id)
    {
        return $this->db->where(
            'id', $id
        )->limit(1)
        ->get('program_studi')
        ->row();
    }

    public function dapatkanSekolahDenganId($id)
    {
        return $this->db->where(
            'id', $id
        )->limit(1)
        ->get('sekolah')
        ->row();
    }

    public function dapatkanProdiDenganIdPendaftaran($id_pendaftaran_calon_mahasiswa)
    {
        return $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran_calon_mahasiswa
        )->limit(1)
        ->get('prodi_calon_mahasiswa')
        ->row();
    }

    public function buatProgramStudi($input)
    {
        $this->db->insert(
            'prodi_calon_mahasiswa', $input['prodi']
        );

        $this->db->insert(
            'asal_sekolah_calon_mahasiswa', $input['asal_sekolah']
        );
    }

    public function ubahProgramStudi($input)
    {
        $this->db->where(
            'id_pendaftaran_calon_mahasiswa',
            $input['prodi']['id_pendaftaran_calon_mahasiswa']
        )->update(
            'prodi_calon_mahasiswa', $input['prodi']
        );

        $this->db->where(
            'id_pendaftaran_calon_mahasiswa',
            $input['asal_sekolah']['id_pendaftaran_calon_mahasiswa']
        )->update(
            'asal_sekolah_calon_mahasiswa', $input['asal_sekolah']
        );
    }

    public function hitungJumlahPendaftaranDenganIdGelombang($id_gelombang)
    {
        return $this->db->where(
            'id_gelombang', $id_gelombang
        )->count_all_results('pendaftaran_calon_mahasiswa');
    }

    public function dapatkanSlipPembayaranDenganIdGelombangIdCalonMahasiswa($id_gelombang, $id_calon_mahasiswa)
    {
        return $this->db->from(
            'pendaftaran_calon_mahasiswa as a'
        )->join(
            'slip_pembayaran_calon_mahasiswa as b',
            'b.id_pendaftaran_calon_mahasiswa = a.id',
            'inner'
        )->select(
            'b.id,b.id_bank,b.tanggal_bayar,b.berkas'
        )->where(
            'a.id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'a.id_gelombang', $id_gelombang
        )->limit(1)
        ->get()
        ->row();
    }

    public function dapatkanKelompokBerdasarkanIdGelombangIdCalonMahasiswa($id_gelombang, $id_calon_mahasiswa)
    {
        $data = $this->db->where(
            'id_gelombang', $id_gelombang
        )->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->limit(1)
        ->get('pendaftaran_calon_mahasiswa')
        ->row();

        if (empty($data)) {
            return null;
        }

        $data->prodi = $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $data->id
        )->limit(1)
        ->get('prodi_calon_mahasiswa')
        ->row();

        $data->prodi->prodi = $this->db->where(
            'id', $data->prodi->id_program_studi
        )->limit(1)
        ->get('program_studi')
        ->row();

        $data->prodi->prodi->kelompok = $this->db->where(
            'id', $data->prodi->prodi->id_kelompok
        )->limit(1)
        ->get('kelompok')
        ->row();

        return $data;
    }

    public function dapatkanSlipPembayaranDenganIdPendaftaran($id_pendaftaran)
    {
        return $this->db->where(
            'id_pendaftaran_calon_mahasiswa', $id_pendaftaran
        )->limit(1)
        ->get('slip_pembayaran_calon_mahasiswa')
        ->row();
    }

    public function buatSlipPembayaran($input)
    {
        $this->db->insert('slip_pembayaran_calon_mahasiswa', $input);
    }

    public function ubahSlipPembayaran($input, $id)
    {
        $this->db->where(
            'id', $id
        )->update(
            'slip_pembayaran_calon_mahasiswa', $input
        );
    }

    public function dapatkanPendaftaranDenganNomorPraRegistrasiIDGelombangIdCalonMahasiswa($nomor_pra_registrasi, $id_gelombang, $id_calon_mahasiswa)
    {
        return $this->db->where(
            'id_gelombang', $id_gelombang   
        )->where(
            'id_calon_mahasiswa', $id_calon_mahasiswa
        )->where(
            'nomor_pra_registrasi', $nomor_pra_registrasi
        )->limit(1)
        ->get('pendaftaran_calon_mahasiswa')
        ->row();
    }

    public function UbahPendaftaranCalonMahasiswa($id, $input)
    {
        return $this->db->where(
            'id', $id
        )->update('pendaftaran_calon_mahasiswa', $input);
    }
}
