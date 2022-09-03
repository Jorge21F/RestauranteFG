let listaProductos = [];
let listaCarrito = [];

// Revisa si ya hay una imagen con el id 'activa'.
// Si existe, al seleccionar otra, le quitara el id y se lo dara a la nueva.
function seleccionIMG(seleccion) {
    let activa = document.getElementById('activa');

    if(activa!=null){
        activa.removeAttribute("id");
        seleccion.id = 'activa';
    }
    else {
        seleccion.id = 'activa';
    }
}

// Valida que los controles contengan informacion.
function validarDatos(codigo, nombre, precio, imagen) {
    if (codigo == '') {
        alert('No se ha ingresado el codigo');
        return false;
    }

    if (nombre == '') {
        alert('No se ha ingresado el nombre');
        return false;
    }

    if (precio == '') {
        alert('No se ha ingresado el precio');
        return false;
    }

    if (imagen == null) {
        alert('No se ha seleccionado una imagen');
        return false;
    }

    return true;
}

// Funcion para validar que no se ingresen Productos repetidos, tanto al catalogo como al carrito.
function validarRepetidos(codigo, nombre, tipo) {
    if (tipo==0) {
        // Valida para el catalogo
        let lista = obtenerDeLocal(0);     

        for (let i = 0; i < lista.length; i++) {          
            if (codigo === lista[i].codigo) {
                alert ('ERROR: Codigo ya ingresado')
                return false;
            } else
            if (nombre === lista[i].nombre) {
                alert ('ERROR: Nombre ya ingresado')
                return false;
            }
        }
    } else 
    if (tipo==1) {
        // Valida para el carrito
        let lista = obtenerDeLocal(1);

        for (let i = 0; i < lista.length; i++) {          
            if (codigo === lista[i].codigo) {
                alert ('ERROR: Producto ya ingresado')
                return false;
            } else
            if (nombre === lista[i].nombre) {
                alert ('ERROR: Producto ya ingresado')
                return false;
            }
        }
    }
}

// Limpia los controles para agilizar el proceso de agregar mas productos.
function limpiarControles() {
    document.getElementById('codigo').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('precio').value = '';
    // Elimina el id de la imagen activa, esto para obligar a volver a seleccionar una.
    document.getElementById('activa').removeAttribute("id");
}

// Agrega un producto al catalogo.
function agregarProducto(codigo, nombre, precio, imagen) {
    // Crea un objeto 'producto'
    let nuevoProducto = {
        codigo: codigo,
        nombre: nombre,
        precio: precio,
        imagen: imagen
    };
    console.log(nuevoProducto);
    
    // Agrega el nuevo producto a la lista de productos
    listaProductos.push(nuevoProducto);
    
    // Envia la lista a la funcion para guardar en localStorage.
    let tipo=0;
    guardarEnLocal(listaProductos, tipo);
}

// Recibe los valores de los controles, verifica que sean validos y los manda a la funcion para agregarlos.
function guardarProducto() {
    // Recibe los valores desde el document.
    let codigo = document.getElementById('codigo').value;
    let nombre = document.getElementById('nombre').value;
    let precio = document.getElementById('precio').value;
    let imagen = document.getElementById('activa');
    
    // Verifica que si exista una imagen seleccionada antes de tomar su 'src'.
    if (imagen != null) {
        imagen = imagen.getAttribute("src");        
    }

    // Envia los datos para verificar que tengan informacion.
    if (validarDatos(codigo, nombre, precio, imagen) == false) {
        return;
    }

    // Envia los datos para verificar que no esten repetidos.
    let tipo = 0;
    if (validarRepetidos(codigo, nombre, tipo) == false){
        return;
    }

    // Hace el llamado para agregar los productos, luego limpia los controles e imprime la tabla
    agregarProducto(codigo, nombre, precio, imagen);
    limpiarControles();
    imprimirTabla();
}

// Haciendo uso de la lista de productos, imprime los datos en el body de la tabla.
function imprimirTabla(){
    // Obtiene una lista de productos.
    let lista = obtenerDeLocal(0); 
    // Variable que sirve como atajo para añadir al body de la tabla.
    let tbody = document.getElementById('detalle');
    tbody.innerHTML = '';

    // Ciclo para imprimir los datos
    for (let i = 0; i < lista.length; i++) {
        // Atajo para crear una fila en el body de la tabla.
        let fila = tbody.insertRow(i);
        
        // Variables atajo para insertar datos en las celdas (columnas) de la tabla.
        let codCelda = fila.insertCell(0);
        let nomCelda = fila.insertCell(1);
        let preCelda = fila.insertCell(2);
        let imgCelda = fila.insertCell(3);
        let carritoCelda = fila.insertCell(4);
        let borrarCelda = fila.insertCell(5);

        // Inserta el contenido en la celda.
        codCelda.innerHTML = lista[i].codigo;
        nomCelda.innerHTML = lista[i].nombre;
        // Agrega la divisa antes del precio
        preCelda.innerHTML = 'Q.' + lista[i].precio;
        // Crea la etiqueta de img, el src es el que se le pasa con el atributo de imagen.
        imgCelda.innerHTML = '<img class="imgTabla" src=' + lista[i].imagen + '>';
        // Crea el boton para agregar al carrito, se le da un id incrementable que servira para identificar el numero de fila. Solo sera visible en el apartado de ver catalogo.
        carritoCelda.innerHTML = '<input type="button" id="agregar'+ i + '" name="agregar" value="Agregar al carrito" onclick="agregarAlCarrito(this.id)">';

        // Boton para eliminar producto del catalogo, solo sera visible en el apartado de gestion.
        borrarCelda.innerHTML = '<input type="button" class="borrar" id="borrar'+ i + '" name="borrar" value="X" onclick="borrarProdCatalogo('+lista[i].codigo+')">';

        // Agrega la fila al body de la tabla.
        tbody.appendChild(fila);
    }
}

// Consulta si hay datos guardados en el localStorage.
// En caso de que haya, parsea el texto y retorna los datos almacenados.
function obtenerDeLocal(tipo){
    if (tipo==0) {
        let listaGuardada = localStorage.getItem('localLista');
        if(listaGuardada == null){
            listaProductos = [];
        } else {
            listaProductos = JSON.parse(listaGuardada);
        }
        return listaProductos;
    } else
    if (tipo==1) {
        let listaGuardada = localStorage.getItem('localCarrito');
        if(listaGuardada == null){
            listaCarrito = [];
        } else {
            listaCarrito = JSON.parse(listaGuardada);
        }
        return listaCarrito;
    }
}

// Guarda en el localstorage, segun si es para catalogo o carrito
function guardarEnLocal(lista, tipo){
    if (tipo==0) {
        // Guarda en catalogo
        localStorage.setItem('localLista', JSON.stringify(lista));   
        console.log("Catalogo actualizado");
    } else
    if (tipo==1) {
        // Guarda en carrito
        localStorage.setItem('localCarrito', JSON.stringify(lista));
        console.log("Carrito actualizado");
    }
}

// Elimina todo el local para iniciar de nuevo.
function borrarLocal() {
    let confirmacion = confirm('¿Esta seguro de querer reiniciar el catalogo?');
    if (confirmacion == true) {
        alert('Catalogo Reiniciado');
        // limpiarControlesCliente();
        localStorage.clear();
        window.location.reload();
    }
}

// Borra el producto seleccionado de la lista de productos.
// Esta accion hara que se borre el carrito si este esta acitvo, para evitar que se solicite un producto eliminado.
function borrarProdCatalogo(codigo) {
    let confirmacion = confirm('¿Esta seguro de querer eliminar este producto? \nDicha accion cancelara el carrito activo');
    if (confirmacion == true) {
        let lista = obtenerDeLocal(0);
        console.log(lista);
        console.log(lista[1].codigo);
        for (let i = 0; i < lista.length+1; i++) {
            if (codigo == lista[i].codigo) {
                // Borra de la lista, guarda cambios en el localstorage y vuelve a imprimir el catalogo para mostrar cambios.
                listaProductos.splice(i, 1);
                guardarEnLocal(listaProductos, 0);
                imprimirTabla();
                localStorage.removeItem('localCarrito');
                return;
            } 
        }
    }
}



//              Funciones del carrito

// Agrega el producto al carrito.
function agregarProdACarrito(codigo, nombre, precio, imagen, cantidad){
    // Crea el objeto con los datos del producto
    let nuevaCompra = {
        codigo: codigo,
        nombre: nombre,
        precio: precio,
        imagen: imagen,
        cantidad: cantidad
    };
    console.log(nuevaCompra);
    
    // Valida que el producto no se haya agregado antes.
    let tipo = 1;
    if (validarRepetidos(codigo, nombre, tipo) == false){
        return;
    }

    // Agrega el producto al carrito
    listaCarrito.push(nuevaCompra);
    
    // Envia la lista a la funcion para guardar en localStorage.
    guardarEnLocal(listaCarrito, tipo);
    alert("Producto añadido al carrito");
}

// Recibe los valores y los manda a la funcion para guardarlos en el carrito.
function agregarAlCarrito(posicion) {
    // Codigo auxiliar para obtener el numero de fila (index) y poder obtener los datos.
        // Recibe el id del boton, "agregar#" quita la palabra 'agregar' y se crea un arreglo. 
        let auxIndex = posicion.split("agregar");
        // Este arreglo tiene la forma de: ['', 'numero']
            // Para poder utilizarlo como index, se convierte en entero la parte del numero, [1].
        // Se le suma 1 para que ignore la fila de encabezados.
    let index = parseInt(auxIndex[1])+1;

    // Selecciona la fila (index) y columna (numero).
    let codigo = document.querySelector("#detalle > tr:nth-child(" + index + ") > td:nth-child(1)").innerHTML;
    let nombre = document.querySelector("#detalle > tr:nth-child(" + index + ") > td:nth-child(2)").innerHTML;
    
    // Codigo auxiliar para obtener el precio sin la divisa
        let precAux = document.querySelector("#detalle > tr:nth-child(" + index +") > td:nth-child(3)").innerHTML;
        let precAux2 = precAux.split("Q."); 
        let precio = parseInt(precAux2[1]);
    console.log("precio:", precio);

    // Codigo auxiliar para obtener la direcion de la imagen
        let auxIMG = document.querySelector("#detalle > tr:nth-child("+index+") > td:nth-child(4)").innerHTML;
        console.log("auxImagen:", auxIMG);
        imagen = auxIMG;
    console.log("Imagen:", imagen);

    let cantidad = 1;
    agregarProdACarrito(codigo, nombre, precio, imagen, cantidad);
}

// Imprime el carrito (el codigo esta ampliamente basado en el de imprimirTabla())
function imprimirCarrito() {
    // Obtiene la lista de productos en el carrito.
    let lista = obtenerDeLocal(1); 
    // Variable que sirve como atajo para añadir al body de la tabla.
    let tbody = document.getElementById('detalle');
    tbody.innerHTML = '';

    // variable para guardar el precio total del pedido
    let total = 0;

    // Ciclo para imprimir los datos
    for (let i = 0; i < lista.length; i++) { 
        // Atajo para crear una fila en el body de la tabla.
        let fila = tbody.insertRow(i);
        
        // Variables atajo para insertar datos en las celdas (columnas) de la tabla.
        let codCelda = fila.insertCell(0);
        let nomCelda = fila.insertCell(1);
        let imgCelda = fila.insertCell(2);
        let preCelda = fila.insertCell(3);
        let canCelda = fila.insertCell(4);
        let subCelda = fila.insertCell(5);

        // Inserta el contenido en la celda.
        codCelda.innerHTML = lista[i].codigo;
        nomCelda.innerHTML = lista[i].nombre;
           
        // Como ya recibe toda la etiqueta para crear la imagen, incluido su src y clase, no es necesario tocar mas.
        imgCelda.innerHTML = lista[i].imagen;
        // Agrega la divisa antes del precio
        preCelda.innerHTML = 'Q.' + lista[i].precio;

        // Inserta la celda con la cantidad y los botones para manipularla
        canCelda.innerHTML = 
            '<input type="button" class="menos" value="-" onclick="actualizarCantidad(' + lista[i].codigo + ', 0' + ')"> ' 
            + lista[i].cantidad
            + ' <input type="button" class="mas" value="+" onclick="actualizarCantidad(' + lista[i].codigo + ', 1' + ')"> '
            + '<br> <input type="button" class="borrar" value="X" onclick="actualizarCantidad(' + lista[i].codigo + ', 2' + 
        ')"> ' 

        // variable auxiliar para obtener el sub total (total por producto)
        let subTotal = lista[i].precio * lista[i].cantidad;
        
        // Agrega la divisa antes del sub total.
        subCelda.innerHTML = 'Q.' + subTotal;

        // Agrega la fila al body de la tabla.            
        tbody.appendChild(fila);

        // Actualiza el precio total a pagar.
        total = total + subTotal;

        // Muestra la cantidad a pagar abajo de la tabla.
        document.getElementById('totalCaption').innerHTML = '<hr> Total:  Q.' + total;
    }
}

// Funcion para actualizar la cantidad de productos en el carrito
function actualizarCantidad(codigo, tipo) {
    let lista = obtenerDeLocal(1);

    if (tipo==0) {
        //          Disminuir la cantidad de productos.
        // Recorre la lista hasta encontrar el producto con el codigo que recibio.
        for (let i = 0; i < lista.length+1; i++) {
            if (codigo == lista[i].codigo) {
                // Disminuye en 1 la cantidad actual
                listaCarrito[i].cantidad--;
        
                // Valida si la cantidad restante quedo en 0, si es asi, lo borra.
                if (lista[i].cantidad==0) {
                    // Borra de la lista, guarda cambios en el localstorage y vuelve a imprimir el carrito para mostrar cambios.
                    listaCarrito.splice(i, 1);
                    guardarEnLocal(listaCarrito, 1);
                    imprimirCarrito();
                    return;
                } else {
                    // Guarda cambios en el localstorage y vuelve a imprimir carrito para mostrar cambios.
                    guardarEnLocal(listaCarrito, 1);
                    imprimirCarrito();
                    return;
                }
            } 
        }
    } else 
    if (tipo==1) {
        //          Aumentar la cantidad de productos.
        // Recorre la lista hasta encontrar el producto con el codigo que recibio.
        for (let i = 0; i < lista.length+1; i++) {          
            if (codigo == lista[i].codigo) {
                // Aumenta en 1 la cantidad actual
                listaCarrito[i].cantidad++;
    
                guardarEnLocal(listaCarrito, 1);
                imprimirCarrito();
                return;
            } 
        }
    } else {
        //          Borrar el producto del carrito
        // Recorre la lista hasta encontrar el producto con el codigo que recibio.
        for (let i = 0; i < lista.length+1; i++) {
            // Borra de la lista, guarda cambios en el localstorage y vuelve a imprimir el carrito para mostrar cambios.
            listaCarrito.splice(i, 1);
            guardarEnLocal(listaCarrito, 1);
            imprimirCarrito();
            return;
        }
    }
}

// Aceptar la compra
function confirmarPedido() {
    // Recibe los valores desde el document.
    let nit = document.getElementById('nit').value;
    let nombre = document.getElementById('nombre').value;
    let direccion = document.getElementById('direccion').value;
    
    // Envia los datos para verificar que tengan informacion.
    if (validarDatosCliente(nombre, direccion) == false) {
        return;
    }

    // variable para guardar el mensaje que se mostrara en pantalla para confirmar el pedido.
    let confirmacion;

    // Si hay informacion en el nit, se presentara en pantalla, si no, se omite.
    if (nit != '' ) {
        // Existe informacion del nit.
        confirmacion = confirm('¿Desea realizar el pedido? \nNIT: ' + nit +'\nNombre: ' + nombre +'\nDireccion: ' + direccion);        
    } else {
        // No existe informacion del nit.
        confirmacion = confirm('¿Desea realizar el pedido? \nnombre: ' + nombre +'\nDireccion: ' + direccion);
    }

    // Si se acepta, muestra un mensaje, limpia los controles y vacia el carrito.
    if (confirmacion == true) {
        alert('Pedido realizada con exito');
        limpiarControlesCliente();
        window.location.reload();
    }
}

// Valida que los campos requeridos tengan informacion, incluyendo el carrito.
function validarDatosCliente(nombre, direcion) {
    if (nombre == '') {
        alert('No se ha ingresado el nombre');
        return false;
    }

    if (direcion == '') {
        alert('No se ha ingresado el precio');
        return false;
    }
    
    let tbody = document.getElementById('detalle');
    if (tbody.innerHTML == '') {
        alert('No hay productos en el carrito');
        return false;
    }

    return true;
}

// Limpia los controles y vacia el carrito al momento de confirmar el pedido.
function limpiarControlesCliente() {
    document.getElementById('nit').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('direccion').value = '';

    // Vacia el carrito
    localStorage.removeItem('localCarrito');
}
