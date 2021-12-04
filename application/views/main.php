<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="description"
            content="Masuk calon mahasiswa situs. <?= $this->config->item('nama_situs') ?>" />
        <meta name="author" content="<?= $this->config->item('author') ?>" />
        <meta name="url" content="<?= base_url('') ?>" />

        <link href="<?= base_url('vendor/sb-admin/') ?>css/styles.css" rel="stylesheet" />
        <link rel="stylesheet" href="<?= base_url('vendor/datatables/datatables/css/dataTables.bootstrap5.min.css') ?>">
        <link rel="stylesheet" href="<?= base_url('vendor/datatables/buttons/css/buttons.bootstrap5.min.css') ?>">

        <title>Halaman Main</title>
        
    </head>
    <body class="bg-light">
        <div class="container">
            <div class="row justify-content-center bg-white py-5">
                <div class="col-12">
                    <div class="table-responsive"
                        id="main">
                        <table class="table table-bordered w-100"
                            id="main-table">
                            <thead>
                                <tr>
                                    <th style="width: 10px"
                                        class="text-center">No</th>
                                    <th>Nama</th>
                                    <th>Tipe</th>
                                    <th>Edit</th>
                                    <th>
                                        <input type="checkbox" class="form-check-input datatable-checkbox-all">
                                    </th>
                                </tr>
                            </thead>
                            <body>
                            </body>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <script src="<?= base_url('vendor/jquery/jquery.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/datatables/js/jquery.dataTables.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/datatables/js/dataTables.bootstrap5.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/buttons/js/dataTables.buttons.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/buttons/js/buttons.bootstrap5.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/jszip/jszip.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/pdfmake/pdfmake.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/pdfmake/vfs_fonts.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/buttons/js/buttons.html5.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/buttons/js/buttons.print.min.js') ?>"></script>
        <script src="<?= base_url('vendor/datatables/buttons/js/buttons.colVis.min.js') ?>"></script>

        <script>
            $(document).ready(function () {

                $('body').on('click', '.datatable-checkbox', function () {
                    console.log('tets');
                });

                $('body').on('click', '.datatable-checkbox', function () {
                    console.log('tets');
                });

                var table = $('#main-table').DataTable({ 
                    // "lengthChange": false,
                    // 'dom': 'lfrip',
                    // 'dom': 'Blfrtip',
                    'dom': "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
                                "<'row'<'col-sm-12'tr>>" +
                                "<'row'<'col-sm-5'i><'col-sm-7'p>>",
                    "buttons": [
                        {
                            extend: 'copy',
                            exportOptions: {
                                columns: [0, 1, 2]
                            }
                        },
                        {
                            extend: 'excel',
                            exportOptions: {
                                columns: [1, 2]
                            }
                        },
                        {
                            extend: 'print',
                            exportOptions: {
                                columns: [1, 2]
                            }
                        },
                        {
                            extend: 'pdfHtml5',
                            exportOptions: {
                                columns: [1, 2]
                            },
                            customize: function (doc) {
                                console.log(doc);
                                doc.content[1].table.widths = 
                                    Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                            }
                        }
                    ],
                    "searchDelay": 350,
                    // "language": {
                    //     "url": "//cdn.datatables.net/plug-ins/1.10.24/i18n/Indonesian.json"
                    // },
                    "processing": true, 
                    "serverSide": true, 
                    "order": [], 
                    
                    "ajax": {
                        "url": "<?php echo base_url('main/get_data')?>",
                        "type": "GET"
                    },

                    
                    "columnDefs": [
                        { 
                            "targets": [ 0 ], 
                            "orderable": false, 
                            "class": 'text-center align-middle',
                        },
                        { 
                            "targets": [ 1 ], 
                            "orderable": true, 
                            "class": 'align-middle',
                        },
                        { 
                            "targets": [ 2 ], 
                            "orderable": false, 
                            "class": 'text-center align-middle',
                            'render': function (data, type, row) {
                                if (data.length > 0) {
                                    var html = '';
                                    $.each(data, function (key, value) {
                                        html += '<span class="badge rounded-pill bg-info text-white">';
                                        html +=  value.nama;
                                        html += '</span> ';
                                    });

                                    return html;
                                }

                                return '-';
                            }
                        },
                        { 
                            "targets": [ 3 ], 
                            "orderable": false,
                            "class": 'text-center align-middle',
                            'render': function (data, type, row) {
                                var html = '<a href="<?=base_url('main/edit/')?>' + data +  '" class="btn btn-warning text-white">';
                                html += 'Ubah';
                                html += '</a>';

                                return html
                            }
                        },
                        { 
                            "targets": [ 4 ], 
                            "orderable": false, 
                            "class": 'text-center align-middle',
                            'render': function (data, type, row) {
                                var html = '<input type="checkbox" class="form-check-input datatable-checkbox" data-id="' + data + '">'
                                return html;
                            }
                        },
                    ],

                });

                table.buttons().container()
                    .appendTo( '#main-table_wrapper .col-md-6:eq(0)' );

            })

            // t.on( 'order.dt search.dt', function () {
            //     t.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            //         cell.innerHTML = i+1;
            //     } );
            // } ).draw();
        </script>
    </body>
</html>
