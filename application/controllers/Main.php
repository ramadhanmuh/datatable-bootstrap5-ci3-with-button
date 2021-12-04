<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Objek untuk masuk mahasiswa
 */
class Main extends CI_Controller {

	public function __construct() {
		parent::__construct();
        $this->load->model('Main_model', 'model');
	}
	
	/**
	 * Menampilkan halaman masuk mahasiswa
	 */
	public function index()
	{
        $this->load->view('main');
	}

	public function get_data() {
        $lists = $this->model->get_datatables();
        $data = [];
        $no = $this->input->get('start');
        //looping data mahasiswa
        foreach ($lists as $list) {
            $no++;
            $row = [];
            //row pertama akan kita gunakan untuk btn edit dan delete
            // $row[] =  '<a class="btn btn-success btn-sm"><i class="fa fa-edit"></i> </a>
            // <a class="btn btn-danger btn-sm "><i class="fa fa-trash"></i> </a>';
            $row[] = $no;
            $row[] = $list->nama;
            $row[] = $this->gettipeberkasbyidberkas($list->id);
            $row[] = $list->id;
            $row[] = $list->id;
            $data[] = $row;
        }

        $output = [
            "draw" => $this->input->get('draw'),
            "recordsTotal" => $this->model->count_all(),
            "recordsFiltered" => $this->model->count_filtered(),
            "data" => $data,
        ];

        //output to json format
        $this->output->set_output(json_encode($output));
    }

    public function gettipeberkasbyidberkas($id_berkas)
    {
        $data = $this->db->where(
            'id_berkas', $id_berkas
        )->get('tipe_berkas')
        ->result();

        return $data;
    }
}