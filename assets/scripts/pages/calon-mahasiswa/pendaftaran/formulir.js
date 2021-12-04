var baseURL = $('meta[name="url"]').attr('content');
var ajaxURL = baseURL + 'calon-mahasiswa/ajax_pendaftaran/';

var classAlurAktif = 'col-2 pt-1 bg-primary position-relative d-flex align-items-center alur-pendaftaran';
var classAlurNomorAktif = 'position-absolute end-0 bg-primary text-white text-center rounded-circle p-1';

var classAlurMati = 'col-2 pt-1 border-left border-top border-bottom position-relative d-flex align-items-center alur-pendaftaran';
var classAlurNomorMati = 'position-absolute end-0 border bg-white text-center rounded-circle p-1';

var bioLocked = false;

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

function dapatkanBiodata(callback) {
    $.ajax({
        url: ajaxURL + 'dapatkan_biodata',
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            callback = data;
        }
    });
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

function pengendaliTombolSelajutnyaBiodata() {
    matikanFormulir(0);

    aktifkanLoader();

    sembunyikanPeringatanFormulir();

    // Dapatkan isian
    var input = {};

    input.nama = $('#nama-sesuai-ijazah').val();
    input.nama_ibu = $('#nama-ibu-kandung').val();
    input.nomor_pengenal = $('#nomor-ktp-nik').val();
    input.tempat_lahir = $('#tempat-lahir').val();
    input.tanggal_lahir = $('#tanggal-lahir').val();
    input.nisn = $('#nomor-induk-siswa-nasional').val();
    input.nomor_ukg = $('#nomor-ukg').val();
    input.dusun = $('#dusun').val();
    input.rt = $('#rt').val();
    input.rw = $('#rw').val();
    input.kode_pos = $('#kode-pos').val();
    input.jalan = $('#alamat-jalan').val();
    input.kelurahan = $('#desa').val();
    input.telepon = $('#telepon').val();
    input.hp = $('#hp').val();

    input.kewarnegaraan = $('#kewarnegaraan').find('option:selected').val();
    input.jenis_kelamin = $('#jenis-kelamin').find('option:selected').val();
    input.agama = $('#agama').find('option:selected').val();
    input.id_kecamatan = $('#kecamatan').find('option:selected').val();

    input.sumber_informasi = [];

    var sumberInformasiElements = $('.sumber-informasi');

    $.each(sumberInformasiElements, function (key, value) {
        var sumberInformasiElement = sumberInformasiElements.eq(key);

       if (sumberInformasiElement[0].checked) {
           input.sumber_informasi.push(
                sumberInformasiElement.val()
           );
       } 
    });

    // Kirim input
    $.ajax({
        method: 'POST',
        url: ajaxURL + 'buat_biodata',
        data: JSON.stringify(input),
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, jqXHR) {
            $('#nama-lengkap-di-prodi').text(input.nama);
            $('#nama-di-cetak-kartu-ujian').text(input.nama);
            inisiasiFormulirUnggahBerkas();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            matikanLoader();
            aktifkanFormulir(0);
            if (jqXHR.status === 400) {
                tampilkanPeringatanFormulir();
                $('#alert-danger-form').empty();
                $('#alert-danger-form').append(jqXHR.responseText);
            }
        }
    })
}

function inisiasiFormulirUnggahBerkas() {
    var lihatBerkasElement = $('.lihat-berkas');

    $.each(lihatBerkasElement, function (key, value) {
        lihatBerkasElement.eq(key).addClass('d-none');
    });

    $.ajax({
        url: ajaxURL + 'dapatkan_berkas',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            if (data != null) {
                $.each(data, function (key, value) {
                    $('.lihat-berkas[data-id="' + value.id_berkas_pendaftaran + '"]').prop(
                        'href', baseURL + value.alamat
                    );

                    $('.lihat-berkas[data-id="' + value.id_berkas_pendaftaran + '"]').removeClass(
                        'd-none'
                    );
                });
            }
            
            aktifkanFormulir(1);
            matikanFormulir(0);
            aktifkanAlur(1)
            matikanLoader();
        }
    })
}

function pengendaliProvinsiBerubah(element) {
    var selectedValue = element.find('option:selected').val();

    $.ajax({
        url: ajaxURL + 'dapatkan_kabupaten?id_provinsi=' + selectedValue ,
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $('#kabupaten').empty();
            $('#kabupaten').append(
                '<option value="">-- Pilih --</option>'
            );

            if (data === null) {
                return;
            }

            $.each(data, function (key, value) {
                $('#kabupaten').append(
                    '<option value="' + value.id + '">' +
                        value.nama +
                    '</option>'
                ) 
            });
        }
    });
}

function pengendaliKabupatenBerubah(element) {
    var selectedValue = element.find('option:selected').val();

    $.ajax({
        url: ajaxURL + 'dapatkan_kecamatan?id_kabupaten=' + selectedValue ,
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $('#kecamatan').empty();
            $('#kecamatan').append(
                '<option value="">-- Pilih --</option>'
            );

            if (data === null) {
                return;
            }

            $.each(data, function (key, value) {
                $('#kecamatan').append(
                    '<option value="' + value.id + '">' +
                        value.nama +
                    '</option>'
                ) 
            });
        }
    });
}

function pengendaliUnggahBerkasInputBerubah(element) {
    aktifkanLoader();
    matikanFormulir(1);
    sembunyikanPeringatanFormulir();

    var fd = new FormData();
    var files = element[0].files;
    var id_berkas_pendaftaran = element.attr('data-id');

    $('.lihat-berkas[data-id="' + id_berkas_pendaftaran + '"]')
        .addClass('d-none')

    if (files.length < 1) {
        matikanLoader();
        return;
    }

    fd.append('file', files[0]);

    $.ajax({
        url: ajaxURL + 'buat_berkas?id_berkas_pendaftaran=' + id_berkas_pendaftaran,
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response){
            console.log(response)
            aktifkanFormulir(1);
            matikanLoader();
            $('.lihat-berkas[data-id="' + id_berkas_pendaftaran + '"]')
                .removeClass('d-none')
                .attr('href', baseURL + response);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                aktifkanFormulir(1);
                tampilkanPeringatanFormulir();
                matikanLoader();
                $('#alert-danger-form').empty();
                $('#alert-danger-form').append(jqXHR.responseText);   
            }
        }
    });
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

function pengendaliTombolBerkasSelanjutnya() {
    sembunyikanPeringatanFormulir();
    aktifkanLoader();
    $.ajax({
        url: ajaxURL + 'validasi_input_unggah_berkas' ,
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $.ajax({
                url: ajaxURL + 'dapatkan_pendaftaran' ,
                cache: false,
                dataType: 'json',
                success: function (data, textStatus, jqXHR) {
                    if (data.nomor_pra_registrasi == null) {
                        inisiasiFormulirProgramStudi();
                    } else {
                        aktifkanAlur(2);
                        aktifkanAlur(3);
                        matikanFormulir(1);
                        aktifkanFormulir(3);  
                        matikanLoader();         
                    }

                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                aktifkanFormulir(1);
                tampilkanPeringatanFormulir();
                matikanLoader();
                $('#alert-danger-form').empty();
                $('#alert-danger-form').append(
                    'Berkas belum lengkap.'
                );   
            }
        }
    });
}

function pengendaliProvinsiAsalSekolahBerubah(element) {
    var kode_prop = element.find('option:selected').val();
    
    $.ajax({
        url: ajaxURL + 'dapatkan_kabupaten_asal_sekolah?kode_prop=' + kode_prop ,
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $('#kabupaten-asal-sekolah').empty();
            $('#kabupaten-asal-sekolah').append(
                '<option value="">-- Pilih --</option>'
            );

            if (data === null) {
                return;
            }

            $.each(data, function (key, value) {
                $('#kabupaten-asal-sekolah').append(
                    '<option value="' + value.kode_kab_kota + '">' +
                        value.kabupaten_kota +
                    '</option>'
                ) 
            });
        }
    })
}

function pengendaliKabupatenAsalSekolahBerubah(element) {
    var selectedValue = element.find('option:selected').val();
    
    $.ajax({
        url: ajaxURL + 'dapatkan_kecamatan_asal_sekolah?kode_kab=' + selectedValue ,
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $('#kecamatan-asal-sekolah').empty();
            $('#kecamatan-asal-sekolah').append(
                '<option value="">-- Pilih --</option>'
            );

            if (data === null) {
                return;
            }

            $.each(data, function (key, value) {
                $('#kecamatan-asal-sekolah').append(
                    '<option value="' + value.kode_kec + '">' +
                        value.kecamatan +
                    '</option>'
                ) 
            });
        }
    })
}

function pengendaliKecamatanAsalSekolahBerubah(element) {
    var selectedValue = element.find('option:selected').val();
    
    $.ajax({
        url: ajaxURL + 'dapatkan_sekolah?kode_kec=' + selectedValue ,
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $('#nama-asal-sekolah').empty();
            $('#nama-asal-sekolah').append(
                '<option value="">-- Pilih --</option>'
            );

            if (data === null) {
                return;
            }

            $.each(data, function (key, value) {
                $('#nama-asal-sekolah').append(
                    '<option value="' + value.id + '">' +
                        value.sekolah +
                    '</option>'
                ) 
            });
        }
    })
}

function pengendaliKelompokProdiBerubah(element) {
    var selectedValue = element.find('option:selected').val();
    
    $.ajax({
        url: ajaxURL + 'dapatkan_program_studi?id_kelompok=' + selectedValue ,
        cache: false,
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            $('#program-studi').empty();
            $('#program-studi').append(
                '<option value="">-- Pilih --</option>'
            );

            if (data === null) {
                return;
            }

            $.each(data, function (key, value) {
                $('#program-studi').append(
                    '<option value="' + value.id + '">' +
                        value.nama +
                    '</option>'
                ) 
            });
        }
    })
}

function pengendaliTombolProdiSelanjutnyaDitekan() {
    sembunyikanPeringatanFormulir();
    aktifkanLoader();
    
    var input = {
        id_program_studi: $('#program-studi').find('option:selected').val(),
        id_kelas: $('#kelas').find('option:selected').val(),
        id_sekolah: $('#nama-asal-sekolah').find('option:selected').val(),
        tanggal_lulus: $('#tanggal-lulus-asal-sekolah').val(),
        nomor_ijazah: $('#nomor-ijazah-asal-sekolah').val(),
    };

    $.ajax({
        method: 'POST',
        url: ajaxURL + 'buat_program_studi',
        data: JSON.stringify(input),
        contentType: "application/json; charset=utf-8",
        success: function (data, textStatus, jqXHR) {
            aktifkanFormulir(3);
            matikanFormulir(2);
            aktifkanAlur(3)
            matikanLoader();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                matikanLoader();
                aktifkanFormulir(2);
                tampilkanPeringatanFormulir();
                $('#alert-danger-form').empty();
                $('#alert-danger-form').append(jqXHR.responseText);
            }
        }
    })
}

function inisiasiFormulirBiodata() {
    matikanFormulir(0);
    aktifkanLoader();

    $.ajax({
        url: ajaxURL + 'dapatkan_biodata',
        dataType: 'json',
        success: function (data, textStatus, jqXHR) {
            if (data == null) {
                aktifkanFormulir(0)
                matikanLoader();
                return;            
            }

            $('#nama-sesuai-ijazah').val(data.biodata.nama);
            $('#nama-ibu-kandung').val(data.biodata.nama_ibu);
            $('#nomor-ktp-nik').val(data.biodata.nomor_pengenal);
            $('#kewarnegaraan').val(data.biodata.kewarnegaraan);
            $('#jenis-kelamin').val(data.biodata.jenis_kelamin);
            $('#agama').val(data.biodata.agama);
            $('#tempat-lahir').val(data.biodata.tempat_lahir);
            $('#tanggal-lahir').val(data.biodata.tanggal_lahir);
            $('#nomor-induk-siswa-nasional').val(data.biodata.nisn);
            $('#nomor-ukg').val(data.biodata.nomor_ukg);

            $('#alamat-jalan').val(data.alamat.jalan);
            $('#dusun').val(data.alamat.dusun);
            $('#rt').val(data.alamat.rt);
            $('#rw').val(data.alamat.rw);
            $('#desa').val(data.alamat.kelurahan);
            $('#kecamatan').append(
                '<option value="' + data.alamat.id_kecamatan + '" selected>' +
                    data.alamat.kecamatan.nama +
                '</option>'
            );
            $('#kode-pos').val(data.alamat.kode_pos);
            $('#telepon').val(data.alamat.telepon);
            $('#hp').val(data.alamat.hp);

            $.each(data.sumber_informasi, function (key, value) {
                $('.sumber-informasi[value="'+ value.id_sumber_informasi +'"]').prop(
                    'checked', true
                );
            });

            aktifkanFormulir(0);
            matikanLoader();
        }
    })
}

function pengendaliTombolPraRegistrasiKembaliDitekan() {
    sembunyikanPeringatanFormulir();
    aktifkanLoader();

    matikanAlur(3);
    matikanFormulir(3);
    inisiasiFormulirProgramStudi();


    // $.ajax({
    //     url: ajaxURL + 'dapatkan_pendaftaran' ,
    //     cache: false,
    //     dataType: 'json',
    //     success: function (data, textStatus, jqXHR) {

    //         if (data.nomor_pra_registrasi == null) {
    //             matikanAlur(3);
    //             matikanFormulir(3);
    //             inisiasiFormulirProgramStudi();
    //             return;
    //         }


    //         matikanAlur(2);
    //         matikanAlur(3);
    //         matikanFormulir(2);
    //         matikanFormulir(3);
    //     }
    // });
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

            aktifkanFormulir(4);
            matikanFormulir(3);
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
            aktifkanFormulir(5);
            matikanFormulir(4);
            aktifkanAlur(5)
            matikanLoader();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status === 400) {
                matikanLoader();
                aktifkanFormulir(4);
                tampilkanPeringatanFormulir();
                $('#alert-danger-form').empty();
                $('#alert-danger-form').append(jqXHR.responseText);
            }
        }
    });
}

$(document).ready(function () {
    inisiasiFormulirBiodata();

    $('#tombol-selanjutnya-biodata').click(function () {
        pengendaliTombolSelajutnyaBiodata();
    });
    
    $('#tombol-berkas-selanjutnya').click(function () {
        pengendaliTombolBerkasSelanjutnya();
    });

    $('#tombol-berkas-kembali').click(function () {
        matikanAlur(1);
        matikanFormulir(1);
        aktifkanFormulir(0);
    });

    $('#tombol-prodi-kembali').click(function () {
        matikanAlur(2);
        matikanFormulir(2);
        aktifkanFormulir(1);
    });

    $('#tombol-prodi-selanjutnya').click(function () {
        pengendaliTombolProdiSelanjutnyaDitekan();
    });

    $('#tombol-praregistrasi-kembali').click(function () {
        pengendaliTombolPraRegistrasiKembaliDitekan();
    });

    $('#tombol-praregistrasi-selanjutnya').click(function () {
        matikanFormulir(3);
        inisiasiFormulirSlipPembayaran();
    });

    $('#tombol-slip-pembayaran-kembali').click(function () {
        matikanAlur(4);
        matikanFormulir(4);
        aktifkanFormulir(3);
    });

    $('#tombol-slip-pembayaran-selanjutnya').click(function () {
        pengendaliTombolSlipPembayaranSelanjutnyaDitekan();
    });

    $('#provinsi').change(function () {
       pengendaliProvinsiBerubah($(this)); 
    });

    $('#kabupaten').change(function () {
        pengendaliKabupatenBerubah($(this)); 
    });

    $('.unggah-berkas-input').change(function () {
        pengendaliUnggahBerkasInputBerubah($(this));
    });

    $('#provinsi-asal-sekolah').change(function () {
        pengendaliProvinsiAsalSekolahBerubah($(this));
    });

    $('#kabupaten-asal-sekolah').change(function () {
        pengendaliKabupatenAsalSekolahBerubah($(this));
    });

    $('#kecamatan-asal-sekolah').change(function () {
        pengendaliKecamatanAsalSekolahBerubah($(this));
    });

    $('#kelompok-pilihan').change(function () {
        pengendaliKelompokProdiBerubah($(this));
    });

    $('#berkas-slip-setor').change(function () {
       pengendaliBerkasSlipSetorBerubah($(this)); 
    });

    $('#tombol-sebelumnya-cetak-kartu-ujian').click(function () {
       matikanFormulir(5); 
       matikanAlur(5); 
       aktifkanFormulir(4); 
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

    if (bioLocked) {
        window.open(url);
        return;
    }

    var confirmation = confirm('Data sebelumnya tidak bisa diubah kembali setelah ini. Lanjutkan ?');

    if (!confirmation) {
        return;
    }

    $('#tombol-praregistrasi-kembali').remove();
    
    window.open(url);

    bioLocked = true;
}