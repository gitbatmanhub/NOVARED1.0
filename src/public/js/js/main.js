const btn_agregar = document.getElementById('agregar');
/*
btn_agregar.addEventListener("click", function () {
    //crear el div que contiene los 2 sub-divs
    const div_principal = D.create('div');
    //crear el div para el span e input del nombre
    const div_nombre = D.create('div');
    //crear el div para el span e input del apellido
    const div_apellido = D.create('div');
    //crear los span de nombre y apellido
    const span_nombre = D.create('span', {innerHTML: 'Nombre'});
    const span_apellido = D.create('span', {innerHTML: 'Apellido'});
    //crear los inputs de nombre y apellido
    const input_nombre = D.create('input', {
        type: 'text',
        name: 'nombres',
        autocomplete: 'off',
        placeholder: 'Nombre del usuario'
    });
    const input_apellido = D.create('input', {
        type: 'text',
        name: 'apellidos',
        autocomplete: 'off',
        placeholder: 'Apellido del usuario'
    });
    //crear un botoncito de eliminar este div
    const borrar = D.create('a', {
        href: 'javascript:void(0)', innerHTML: 'x', onclick: function () {
            D.remove(div_principal);
        }
    });
    //agregar cada etiqueta a su nodo padre
    D.append(span_nombre, div_nombre);
    D.append(input_nombre, div_nombre);
    D.append([span_apellido, input_apellido], div_apellido);
    D.append([div_nombre, div_apellido, borrar], div_principal);
    //agregar el div del primer comentario al contenedor con id #container
    D.append(div_principal, D.id('divPrincipal'));
});
*/
//var cantidad = 0;
function agregarHijo() {
    const nombre = document.getElementById('nombre').value;
    if (nombre.length != 0) {
       // cantidad++;
        var divpadre = document.createElement('div');
        divpadre.id = 'divPadre';
        divpadre.classList.add("divPadre")
        var nuevohijo = document.createElement('input');
        nuevohijo.value = nombre;
        nuevohijo.type = 'text';
        nuevohijo.name = 'nombre';
        nuevohijo.id = 'nombre';

        var clase = document.createElement("button");
        clase.innerText = "X"
        clase.type = 'button'
        clase.classList.add("btn", "btn-danger", "delete")

        document.getElementById('divTecnicos').appendChild(divpadre).appendChild(document.createElement("div").appendChild(nuevohijo)).after(clase);

        $(document).on('click', '.delete', function () {
            $(this).parent().remove();
            $(this).remove();

        });
    } else {
        alert("Ingresa el nombre del tecnico")
    }

}


/*

function ShowSelected() {

    var cod = document.getElementById("tecnicos").value;

    var combo = document.getElementById("tecnicos");
    var name = combo.options[combo.selectedIndex].text;
    //console.log(name);
    if (name.length !=0){
        cantidad++;
        const divpadre = document.createElement('div');
        divpadre.id = 'divPadre';
        divpadre.classList.add("divPadre")
        const nuevohijo = document.createElement('input');
        nuevohijo.innerHTML="";
        nuevohijo.placeholder = name;
        nuevohijo.name = 'nombre';
        nuevohijo.classList.add('nombre');
        const clase = document.createElement("button");
        clase.innerText = "X"
        clase.type = 'button'
        clase.classList.add("btn", "btn-danger", "delete")

        document.getElementById('divTecnicos').appendChild(divpadre).appendChild(document.createElement("div").appendChild(nuevohijo)).after(clase);

        $(document).on('click', '.delete', function () {
            $(this).parent().remove();
            $(this).remove();

        });
    }






}

 */










/*

function init() {

    let select = document.createElement("select");
    select.name="selectname";
    select.value="name";

    let option1 = document.createElement("option");
    option1.setAttribute("value", {{idUser}});
    let option1Texto = document.createTextNode("opcion 1");
    option1.appendChild(option1Texto);


    select.appendChild(option1);

const div =  document.getElementById('divTecnicos');
    div.appendChild(select);

}

*/


function duplicar1() {
    const itm = document.getElementById("divPadre");
    const cln = itm.cloneNode(true);

    const close = document.createElement("button");
    close.innerText = "X"
    close.type = 'button'
    close.classList.add("btn", "btn-danger", "delete")
    close.id="cerrar"

    document.getElementById("selectsTecnico").appendChild(cln).appendChild(close);



    $(document).on('click', '.delete', function () {
        $(this).parent().remove();
        $(this).remove();

    });
}
(function () {
    "use strict";

    const select = (el, all = false) => {
        el = el.trim()
        if (all) {
            return [...document.querySelectorAll(el)]
        } else {
            return document.querySelector(el)
        }
    }


    const on = (type, el, listener, all = false) => {
        if (all) {
            select(el, all).forEach(e => e.addEventListener(type, listener))
        } else {
            select(el, all).addEventListener(type, listener)
        }
    }

    /**
     * Easy on scroll event listener
     */
    const onscroll = (el, listener) => {
        el.addEventListener('scroll', listener)
    }

    /**
     * Sidebar toggle
     */
    if (select('.toggle-sidebar-btn')) {
        on('click', '.toggle-sidebar-btn', function (e) {
            select('body').classList.toggle('toggle-sidebar')
        })
    }

    /**
     * Search bar toggle
     */
    if (select('.search-bar-toggle')) {
        on('click', '.search-bar-toggle', function (e) {
            select('.search-bar').classList.toggle('search-bar-show')
        })
    }

    /**
     * Navbar links active state on scroll
     */
    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
        let position = window.scrollY + 200
        navbarlinks.forEach(navbarlink => {
            if (!navbarlink.hash) return
            let section = select(navbarlink.hash)
            if (!section) return
            if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
                navbarlink.classList.add('active')
            } else {
                navbarlink.classList.remove('active')
            }
        })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    /**
     * Toggle .header-scrolled class to #header when page is scrolled
     */
    let selectHeader = select('#header')
    if (selectHeader) {
        const headerScrolled = () => {
            if (window.scrollY > 100) {
                selectHeader.classList.add('header-scrolled')
            } else {
                selectHeader.classList.remove('header-scrolled')
            }
        }
        window.addEventListener('load', headerScrolled)
        onscroll(document, headerScrolled)
    }

    /**
     * Back to top button
     */
    let backtotop = select('.back-to-top')
    if (backtotop) {
        const toggleBacktotop = () => {
            if (window.scrollY > 100) {
                backtotop.classList.add('active')
            } else {
                backtotop.classList.remove('active')
            }
        }
        window.addEventListener('load', toggleBacktotop)
        onscroll(document, toggleBacktotop)
    }

    /**
     * Initiate tooltips
     */
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    /**
     * Initiate quill editors
     */
    if (select('.quill-editor-default')) {
        new Quill('.quill-editor-default', {
            theme: 'snow'
        });
    }

    if (select('.quill-editor-bubble')) {
        new Quill('.quill-editor-bubble', {
            theme: 'bubble'
        });
    }

    if (select('.quill-editor-full')) {
        new Quill(".quill-editor-full", {
            modules: {
                toolbar: [
                    [{
                        font: []
                    }, {
                        size: []
                    }],
                    ["bold", "italic", "underline", "strike"],
                    [{
                        color: []
                    },
                        {
                            background: []
                        }
                    ],
                    [{
                        script: "super"
                    },
                        {
                            script: "sub"
                        }
                    ],
                    [{
                        list: "ordered"
                    },
                        {
                            list: "bullet"
                        },
                        {
                            indent: "-1"
                        },
                        {
                            indent: "+1"
                        }
                    ],
                    ["direction", {
                        align: []
                    }],
                    ["link", "image", "video"],
                    ["clean"]
                ]
            },
            theme: "snow"
        });
    }

    /**
     * Initiate TinyMCE Editor
     */
    const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;

    tinymce.init({
        selector: 'textarea.tinymce-editor',
        plugins: 'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        editimage_cors_hosts: ['picsum.photos'],
        menubar: 'file edit view insert format tools table help',
        toolbar: 'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
        toolbar_sticky: true,
        toolbar_sticky_offset: isSmallScreen ? 102 : 108,
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        link_list: [{
            title: 'My page 1',
            value: 'https://www.tiny.cloud'
        },
            {
                title: 'My page 2',
                value: 'http://www.moxiecode.com'
            }
        ],
        image_list: [{
            title: 'My page 1',
            value: 'https://www.tiny.cloud'
        },
            {
                title: 'My page 2',
                value: 'http://www.moxiecode.com'
            }
        ],
        image_class_list: [{
            title: 'None',
            value: ''
        },
            {
                title: 'Some class',
                value: 'class-name'
            }
        ],
        importcss_append: true,
        file_picker_callback: (callback, value, meta) => {
            /* Provide file and text for the link dialog */
            if (meta.filetype === 'file') {
                callback('https://www.google.com/logos/google.jpg', {
                    text: 'My text'
                });
            }

            /* Provide image and alt text for the image dialog */
            if (meta.filetype === 'image') {
                callback('https://www.google.com/logos/google.jpg', {
                    alt: 'My alt text'
                });
            }

            /* Provide alternative source and posted for the media dialog */
            if (meta.filetype === 'media') {
                callback('movie.mp4', {
                    source2: 'alt.ogg',
                    poster: 'https://www.google.com/logos/google.jpg'
                });
            }
        },
        templates: [{
            title: 'New Table',
            description: 'creates a new table',
            content: '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>'
        },
            {
                title: 'Starting my story',
                description: 'A cure for writers block',
                content: 'Once upon a time...'
            },
            {
                title: 'New list with dates',
                description: 'New List with dates',
                content: '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>'
            }
        ],
        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        height: 600,
        image_caption: true,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image table',
        skin: useDarkMode ? 'oxide-dark' : 'oxide',
        content_css: useDarkMode ? 'dark' : 'default',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
    });

    /**
     * Initiate Bootstrap validation check
     */
    var needsValidation = document.querySelectorAll('.needs-validation')

    Array.prototype.slice.call(needsValidation)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })

    /**
     * Initiate Datatables
     */
    const datatables = select('.datatable', true)
    datatables.forEach(datatable => {
        new simpleDatatables.DataTable(datatable);
    })

    /**
     * Autoresize echart charts
     */
    const mainContainer = select('#main');
    if (mainContainer) {
        setTimeout(() => {
            new ResizeObserver(function () {
                select('.echart', true).forEach(getEchart => {
                    echarts.getInstanceByDom(getEchart).resize();
                })
            }).observe(mainContainer);
        }, 200);
    }

})();

/*
function validate(){
    const select = document.getElementById('nombreTecnico');
    if (select.value=="null")
    {
        alert("Ey");

    }else{
        alert('No ey')
    }
}

 */
/*
$('#form').submit(function(event) {
    const select = document.getElementById('nombreTecnico');
    if (select.value=='null'){
    }else {
        alert("Good")
    }
    event.preventDefault();

    window.history.back();
});




const horaInicio= document.getElementById('horaInicio').value;
console.log(horaInicio);

 */


//Petición fetch para saber si existe el codigo en la BBDD

document.getElementById('codigo').addEventListener('input', function (){
    let codigo= this.value;
    fetch('/verificar-codigo',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({codigo:codigo})
    })
        .then(response=>response.json())
        .then(data=>{
            //console.log(data)
            if (data.existe) {
                // El código existe en la base de datos
                document.getElementById('codigo').classList.remove('is-valid');
                document.getElementById('codigo').classList.add('is-invalid');
                document.getElementById('invalid-feedback').textContent = 'El código ya existe en la base de datos';
                document.getElementById('sendCodigoPorducto').classList.add('disabled')
            } else {
                // El código no existe
                document.getElementById('codigo').classList.remove('is-invalid');
                document.getElementById('codigo').classList.add('is-valid');
                document.getElementById('sendCodigoPorducto').classList.remove('disabled')
                //document.getElementById('valid-feedback').textContent = 'El código es correcto';
            }
        })
        .catch(error=>{
            console.error("Error")
        })
})


const botones = document.querySelectorAll('.codigoProducto');
//console.log(botones);
botones.forEach(function (boton) {
    boton.addEventListener('click', function () {
        let idProducto = this.getAttribute('id');
        console.log(idProducto);
        fetch('/datos-producto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({idProducto: idProducto})
        })
            .then(response => response.json())
            .then(data => {
                let DATA= data.producto;
                //console.log(DATA);
                const {idProducto, nameProducto, codigo, saldo, unidad, DetallesProducto}=DATA;
                const dataProducto={
                    idProducto: DATA.idProducto,
                    nameProducto: DATA.nameProducto,
                    codigo: DATA.codigo,
                    saldo: DATA.saldo,
                    unidad: DATA.unidad,
                    DetallesProducto: DATA.DetallesProducto
                }
                //console.log(dataProducto);
                document.getElementById('exampleModalLabel').textContent=nameProducto;
                document.getElementById('idProducto').value=idProducto;
                document.getElementById('codigoProducto').value=codigo;
                document.getElementById('saldo').value=saldo;
                document.getElementById('unidad').value=unidad;
                document.getElementById('detalles').value=DetallesProducto;
            })
            .catch(error => {
                console.error("Error")
            })
    })
})





