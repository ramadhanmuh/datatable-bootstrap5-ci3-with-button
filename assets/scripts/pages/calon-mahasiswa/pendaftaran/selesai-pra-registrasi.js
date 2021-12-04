var baseURL = $('meta[name="url"]').attr('content');
var ajaxURL = baseURL + 'calon-mahasiswa/ajax_pendaftaran/';

var classAlurAktif = 'col-2 pt-1 bg-primary position-relative d-flex align-items-center alur-pendaftaran';
var classAlurNomorAktif = 'position-absolute end-0 bg-primary text-white text-center rounded-circle p-1';

var classAlurMati = 'col-2 pt-1 border-left border-top border-bottom position-relative d-flex align-items-center alur-pendaftaran';
var classAlurNomorMati = 'position-absolute end-0 border bg-white text-center rounded-circle p-1';

var bioLock = false;

function aktifkanAlur(key) {
    $('.alur-pendaftaran').eq(key).attr(
        'class', classAlurAktif
    );

    $('.alur-pendaftaran').eq(key).find(
        '.position-absolute'
    ).attr(
        'class', classAlurNomorAktif
    );
}

function matikanAlur(key) {
    $('.alur-pendaftaran').eq(key).attr(
        'class', classAlurMati
    );

    $('.alur-pendaftaran').eq(key).find(
        '.position-absolute'
    ).attr(
        'class', classAlurNomorMati
    );
}

function aktifkanFormulir(key) {
    $('.card-form').eq(key).removeClass('d-none')
}

function matikanFormulir(key) {
    $('.card-form').eq(key).addClass('d-none')
}

function aktifkanLoader() {
    $('#form-loader').removeClass('d-none');
}

function matikanLoader() {
    $('#form-loader').addClass('d-none');
}

function sembunyikanPeringatanFormulir() {
    $('#alert-danger-form').addClass('d-none');
}

function tampilkanPeringatanFormulir() {
    $('#alert-danger-form').removeClass('d-none');
}

function pengendaliBerkasSlipSetorBerubah(element) {
    aktifkanLoader();
    matikanFormulir(4);
    sembunyikanPeringatanFormulir();

    $('#slip-setor-tidak-ada').removeClass('d-none');

    $('#url-slip-setor').addClass('d-none');

    var fd = new FormData();
    var files = element[0].files;
    var id_berkas_pendaftaran = element.attr('data-id');

    $('#slip-setor-tidak-ada').removeClass('d-none');
    $('#input-berkas-alamat-slip-pembayaran').val('');

    if (files.length < 1) {
        matikanLoader();
        aktifkanFormulir(4);
        return;
    }

    fd.append('file', files[0]);

    $.ajax({
        url: ajaxURL + 'buat_berkas_slip_setor',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response){
            $('#slip-setor-tidak-ada').addClass('d-none');

            $('#url-slip-setor').removeClass('d-none');
            $('#url-slip-setor').prop('href', baseURL + response);

            $('#input-berkas-alamat-slip-pembayaran').val(
                response
            );

            aktifkanFormulir(4);
            matikanLoader();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                aktifkanFormulir(4);
                tampilkanPeringatanFormulir();
                matikanLoader();
                $('#alert-danger-form').empty();
                $('#alert-danger-form').append(jqXHR.responseText);   
            }
        }
    });
}

function inisiasiFormulirProgramStudi() {
    $.ajax({
        url: ajaxURL + 'dapatkan_prodi',
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            if (data != null) {
                $('#program-studi').append(
                    '<option value="' + data.program_studi.id_program_studi + '" selected>' +
                        data.program_studi.program_studi.nama +
                    '</option>'
                );
                
                $('#kelas').find(
                    'option[value="' + data.program_studi.id_kelas + '"]'
                ).prop('selected', true);

                $('#nama-asal-sekolah').append(
                    '<option value="' + data.asal_sekolah.id_sekolah + '" selected>' +
                        data.asal_sekolah.sekolah.sekolah +
                    '</option>'
                );

                $('#tanggal-lulus-asal-sekolah').val(
                    data.asal_sekolah.tanggal_lulus
                );
                
                $('#nomor-ijazah-asal-sekolah').val(
                    data.asal_sekolah.nomor_ijazah
                );
            }

            aktifkanAlur(2);
            matikanFormulir(1);
            aktifkanFormulir(2);
            matikanLoader();
        }
    })
}

function inisiasiFormulirSlipPembayaran() {
    aktifkanLoader();
    $.ajax({
        url: ajaxURL + 'inisiasi_form_slip_pembayaran',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            if (data.slip_pembayaran != null) {
                $('#slip-setor-tidak-ada').addClass('d-none');
                $('#url-slip-setor').prop(
                    'href', baseURL + data.slip_pembayaran.berkas
                );
                $('#url-slip-setor').removeClass('d-none');

                $("#input-berkas-alamat-slip-pembayaran").val(
                    data.slip_pembayaran.berkas
                )

                $('#kode-bank-slip-pembayaran').find(
                    'option[value="' + data.slip_pembayaran.id_bank + '"]'
                ).prop('selected', true);

                $('#id-setor').val(data.slip_pembayaran.id_setor);

                $('#tanggal-bayar-slip-pembayaran').val(
                    data.slip_pembayaran.tanggal_bayar
                );
            }

            var nominal = formatRupiah(
                data.kelas.prodi.prodi.kelompok.biaya.split('.')[0]
            );

            $('#nominal-slip-pembayaran').text(nominal);

            aktifkanFormulir(1);
            matikanFormulir(0);
            aktifkanAlur(4);
            matikanLoader();
        }
    });
}

function formatRupiah(angka, prefix){
    var number_string = angka.replace(/[^,\d]/g, '').toString(),
    split   		= number_string.split(','),
    sisa     		= split[0].length % 3,
    rupiah     		= split[0].substr(0, sisa),
    ribuan     		= split[0].substr(sisa).match(/\d{3}/gi);

    // tambahkan titik jika yang di input sudah menjadi angka ribuan
    if(ribuan){
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

function pengendaliTombolSlipPembayaranSelanjutnyaDitekan() {
    matikanFormulir(4);
    aktifkanLoader();

    var input = {
        id_bank: $('#kode-bank-slip-pembayaran').find('option:selected').val(),
        tanggal_bayar: $('#tanggal-bayar-slip-pembayaran').val(),
        id_setor: $('#id-setor').val(),
        berkas: $('#input-berkas-alamat-slip-pembayaran').val()
    };

    $.ajax({
        method: "POST",
        url: ajaxURL + 'buat_slip_pembayaran',
        data: JSON.stringify(input),
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, jqXHR) {
            aktifkanFormulir(2);
            matikanFormulir(1);
            aktifkanAlur(5)
            matikanLoader();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                matikanLoader();
                aktifkanFormulir(1);
                tampilkanPeringatanFormulir();
                $('#alert-danger-form').empty();
                $('#alert-danger-form').append(jqXHR.responseText);
            }
        }
    });
}

$(document).ready(function () {

    $('#tombol-praregistrasi-kembali').click(function () {
        pengendaliTombolPraRegistrasiKembaliDitekan();
    });

    $('#tombol-praregistrasi-selanjutnya').click(function () {
        matikanFormulir(3);
        inisiasiFormulirSlipPembayaran();
    });

    $('#tombol-slip-pembayaran-kembali').click(function () {
        matikanAlur(4);
        matikanFormulir(1);
        aktifkanFormulir(0);
    });

    $('#tombol-slip-pembayaran-selanjutnya').click(function () {
        pengendaliTombolSlipPembayaranSelanjutnyaDitekan();
    });

    $('#berkas-slip-setor').change(function () {
       pengendaliBerkasSlipSetorBerubah($(this)); 
    });

    $('#tombol-sebelumnya-cetak-kartu-ujian').click(function () {
       matikanFormulir(2); 
       matikanAlur(5); 
       aktifkanFormulir(1); 
    });

    $("#tombol-cetak-kartu-ujian").click(function () {
        aktifkanLoader();
        $.ajax({
            url: ajaxURL + 'cetak_kartu_ujian',
            success: function (data, textStatus, jqXHR) {
                matikanLoader();
                window.open(baseURL + 'kartuuj');
            }
        })
    });
});

function konfirmasiTombolCetakPraRegistrasi(element) {
    var url = element.getAttribute('href');
        
    window.open(url);
}