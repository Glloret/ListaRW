$(document).ready(function(){
    let socket = io();
    $("#inputText").on('keypress', function (e) {
        if (e.keyCode === 13) {
            //console.log($(this).val());
            socket.emit('addProduct', {"nombre": $(this).val()  } );
            $(this).val('');

        } 
        // else {
        //     console.log(e.keyCode);
        // }
    });
    $("#inputText").keyup(function(){ 
        $(".tachado").removeClass('hidden');
        $("#filter").removeClass('filteron');
        var searchText = $(this).val();        
        $('ul > li').each(function(){            
            var currentLiText = $(this).text(),
                showCurrentLi = currentLiText.indexOf(searchText) !== -1;
            $(this).toggle(showCurrentLi);            
        });     
    });

    $("#filter").click(function() {
        $(this).toggleClass('filteron');
        $(".tachado").toggleClass('hidden');
        console.log('sdfasdf');
    });
    // $(".ui-btn-inner").click( () => {
    //     console.log('pulsado check');
    // });

    socket.on('lista', (lista) => {
        // console.log(lista);
        $("#lista").empty().ready(renderList(lista));        
    });

    function renderList(lista) {
 
        lista.forEach(element => {
            // console.log(element.nombre);
            let clase =' '
            if (element.comprado) {
                clase = 'tachado';
            }
            $("#lista").append("<li class='"  + clase + "'>"+  element.nombre +"</li>");
        });

        $('ul>li').click( function () {
            // console.log($(this).text());
            $(this).toggleClass("tachado");
            let producto = {};
            producto["nombre"] = $(this).text();
            producto["comprado"] =$(this).hasClass("tachado");
            socket.emit('updateProduct', producto);
            $("#inputText").val('');
        }); 
        $('ul>li').on("taphold",function(){
            let producto = {};
            producto["nombre"] = $(this).text();
            producto["comprado"] =$(this).hasClass("tachado");        
            socket.emit('deleteProduct', producto);
            console.log('sdfasdf');
          });

    
        
    }
});