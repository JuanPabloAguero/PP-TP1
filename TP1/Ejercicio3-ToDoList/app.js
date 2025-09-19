/*Una clienta nos solicitó una app a medida para registrar tareas diarias.
Necesito que todas las tareas tengan un Título (string max 100 caracteres, no vacio), para poder identificarlas en la lista. Además, algunas de ellas, deberían tener una descripción (string max 500 caracteres, puede estar vacio) para poder agregar información que me sirva cuando las vea en detalle.
Cuando creo una tarea, debería ponerse en estado pendiente, pues aún no la he empezado a hacer. Luego, me gustaría poder cambiar su esta a en curso o terminada. A veces, las tareas pierden sentido y me gustaría poder cambiarlas a canceladas.
Además, cuando creo una tarea, tendría que cargarse automáticamente la fecha y hora actuales como fecha de creación (Date, cualquier fecha valida, puede ser vacio, si se usa debe cargarse automáticamente la fecha en que se generó la tarea.).
En algunas tareas, voy a querer poner un vencimiento (Date, cualquier fecha valida, puede ser vacio), para recordar que debo hacerlas antes de que expiren.
Por último, para todas las tareas, necesito saber cuál es el costo que tengo. Por defecto, si no pongo nada, una tarea debería ser dificultad fácil. Pero me gustaría poder cambiar ese valor a medio o difícil.*/

const prompt = require('prompt-sync')({sigint: true});

// Array global para almacenar las tareas
const tareas = []; // const es más seguro que let porque previene re-asignaciones accidentales. No limita las operaciones normales del array

function menuPrincipal() {
    let opcion;
    do {
        console.log("\nMenú Principal");
        console.log("[1] Ver mis tareas");
        console.log("[2] Buscar una tarea");
        console.log("[3] Agregar una tarea");
        console.log("[0] Salir");

        opcion = prompt("Opción: ");

        switch(opcion) {
            case "1":
                console.log("Ver mis tareas");
                verTareas();
                break;
            case "2":
                console.log("Buscar una tarea");
                buscarTarea();
                break;
            case "3":
                console.log("Agregar una tarea");
                agregarTarea();
                break;
            case "0":
                console.log("Salir");
                return; // salir del bucle y la aplicación
            default:
                console.log("Opción inválida");
                break;
        }
    } while(opcion != "0")
}

function agregarTarea() {
    let titulo = prompt("Título: ");
    if (titulo.length > 100 || titulo.trim() === "") {
        console.log("Título inválido. Debe tener un máximo de 100 caracteres y no puede estar vacío.");
        agregarTarea();
        return;
    }

    let descripcion = prompt("Descripción (opcional): ");
    if (descripcion.length > 500) {
        console.log("Descripción inválida. Debe tener un máximo de 500 caracteres.");
        agregarTarea();
        return;
    }

    let estado = prompt("Estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada) / (default Pendiente): ");
    const estadosValidos = { "P": "Pendiente", "E": "En curso", "T": "Terminada", "C": "Cancelada" };
    if (estado === "") {
        estado = "Pendiente";
    } else if (!estadosValidos[estado.toUpperCase()]) {
        console.log("Estado inválido. Se establecerá como Pendiente.");
        estado = "Pendiente";
    } else {
        estado = estadosValidos[estado.toUpperCase()];
    }

    let dificultad = prompt("Dificultad (1: Fácil / 2: Medio / 3: Difícil) / (default Fácil): ");
    const dificultadesValidas = { "1": "Fácil", "2": "Medio", "3": "Difícil" };
    if (dificultad === "") {
        dificultad = "Fácil";
    } else if (!dificultadesValidas[dificultad]) {
        console.log("Dificultad inválida. Se establecerá como Fácil.");
        dificultad = "Fácil";
    } else {
        dificultad = dificultadesValidas[dificultad];
    }

    let fechaVencimiento = prompt("Fecha de vencimiento (DD/MM/YYYY) (opcional): ");
    if (fechaVencimiento.trim() === "") {
        fechaVencimiento = null;
    } else {
        const partesFecha = fechaVencimiento.split("/");
        if (partesFecha.length !== 3) {
            console.log("Fecha inválida. Se establecerá como nula.");
            fechaVencimiento = null;
        } else {
            const dia = parseInt(partesFecha[0]);
            const mes = parseInt(partesFecha[1]);
            const anio = parseInt(partesFecha[2]);
            fechaVencimiento = new Date(anio, mes - 1, dia); // -1 porque los meses en JS van de 0 a 11
            if (isNaN(fechaVencimiento)) {
                console.log("Fecha inválida. Se establecerá como nula.");
                fechaVencimiento = null;
            }
        }
    }

    const nuevaTarea = {
        titulo: titulo,
        descripcion: descripcion,
        estado: estado,
        fechaCreacion: new Date(),
        fechaUltimaEdicion: new Date(),
        fechaVencimiento: fechaVencimiento,
        dificultad: dificultad
    };

    tareas.push(nuevaTarea);
    console.log("Tarea agregada: ", nuevaTarea);
}

function verTareas() {
    if (tareas.length === 0) {
        console.log("No hay tareas registradas.");
        return; // regresar al bucle principal
    }

    console.log("Qué tareas deseas ver?");
    console.log("[1] Todas");
    console.log("[2] Pendientes");
    console.log("[3] En curso");
    console.log("[4] Terminadas");
    console.log("[0] Volver");

    const opcion = prompt("Opción: ");
    let tareasFiltradas = [];

    switch(opcion) {
        case "1":
            tareasFiltradas = listadoTituloTodasTareas();
            break;
        case "2":
            tareasFiltradas = listadoTituloTareasPorEstado("Pendiente");
            break;
        case "3":
            tareasFiltradas = listadoTituloTareasPorEstado("En curso");
            break;
        case "4":
            tareasFiltradas = listadoTituloTareasPorEstado("Terminada");
            break;
        case "0":
            return;
            break;
        default:
            console.log("Opción inválida.");
            return;
            break;
    }
    
    // Si las tareas filtradas no son 0, ofrecerle al usuario detalles de una tarea específica o volver
    if (tareasFiltradas.length <= 0) {
        return;
    }

    let num = prompt("\nIngrese el número de la tarea para ver detalles o presione 0 para volver: ");
    let indice = parseInt(num) - 1;
    
    if (num === "0") {
        return;
    }
    
    if (isNaN(indice) || indice < 0 || indice >= tareasFiltradas.length) {
        console.log("Número inválido.");
        return;
    }
    
    let tareaSeleccionada = tareasFiltradas[indice]; // tareasFiltradas es un array que contiene referencias a los mismos objetos que están en el array original (tareas). No crea copias independientes. Por lo tanto, cualquier cambio que hagas a una tarea filtrada afecta directamente al objeto en el array principal.
    console.log("Detalles de la tarea seleccionada: ");
    console.log(tareaSeleccionada);

    // Si el usuario ingresa una tarea válida, darle la opción de editarla
    let opEditar = prompt("\nSi deseas editarla, presione E, o presiona 0 para volver: ");
    
    if (opEditar.toUpperCase() === "E") {
        editarTarea(tareaSeleccionada);
    } else if (opEditar === "0") {
        return;
    } else {
        console.log("Opción inválida.");
        return;
    }
}

function listadoTituloTodasTareas() { // Muestra el indice en el arreglo y el título de todas las tareas, retorna el array completo
    if (tareas.length === 0) {
        console.log("No hay tareas registradas.");
        return [];
    } else {
        console.log("Listado de todas las tareas:");
        tareas.forEach((tarea, indice) => {
            console.log(`[${indice + 1}] ${tarea.titulo}`);
        });
    }
    return tareas;
}

function listadoTituloTareasPorEstado(estado) { // Muestra el indice en el arreglo y el título de las tareas según su estado, retorna un array filtrado por estado
    if (tareas.length === 0) {
        console.log("No hay tareas registradas.");
        return []; // array vacio
    }
    console.log(`Listado de tareas con estado "${estado}": `);
    let tareasFiltradas = tareas.filter(t => t.estado === estado); //  si editas una tarea en el array que retorna listadoTareasPorEstado, también se modifica en el array tareas. Esto ocurre porque listadoTareasPorEstado utiliza el método .filter(), que retorna referencias a los mismos objetos que están en el array original (tareas). No crea copias independientes. Por lo tanto, cualquier cambio que hagas a una tarea filtrada afecta directamente al objeto en el array principal.
    tareasFiltradas.forEach((tarea, indice) => {
        console.log(`[${indice + 1}] ${tarea.titulo}`);
    });
    return tareasFiltradas;
}

function editarTarea(tarea) {
    console.log("Estás editando la tarea: ", tarea.titulo);
    console.log("- Si deseas mantener los valores de un atributo, simplemente dejalo en blanco");
    console.log("- Si deseas dejar en blanco un atributo, escribe un espacio\n");

    // Descripción
    let descripcion = prompt(`Ingresa la descripción (actual: ${tarea.descripcion || "vacía"}): `);
    if (descripcion.trim() !== "") { // editar solo si no deja en blanco el atributo
        if (descripcion === " ") { // espacio para dejar en blanco el atributo
            tarea.descripcion = "";
        } else if (descripcion.length > 500) {
            console.log("Descripción inválida. Debe tener un máximo de 500 caracteres.");
        } else {
            tarea.descripcion = descripcion;
        }
    }

    // Estado
    let estado = prompt(`Ingresa el estado ([P]endiente / [E]n curso / [T]erminada / [C]ancelada) (actual: ${tarea.estado}): `);
    const estadosValidos = { "P": "Pendiente", "E": "En curso", "T": "Terminada", "C": "Cancelada" };
    if (estado.trim() !== "") {
        if (estadosValidos[estado.toUpperCase()]) {
            tarea.estado = estadosValidos[estado.toUpperCase()];
        } else {
            console.log("Estado inválido.");
        }
    }

    // Dificultad
    let dificultad = prompt(`Ingresa la dificultad (1: Fácil / 2: Medio / 3: Difícil) (actual: ${tarea.dificultad}): `);
    const dificultadesValidas = { "1": "Fácil", "2": "Medio", "3": "Difícil" };
    if (dificultad.trim() !== "") {
        if (dificultadesValidas[dificultad]) {
            tarea.dificultad = dificultadesValidas[dificultad];
        } else {
            console.log("Dificultad inválida.");
        }
    }

    // Fecha de vencimiento
    let fechaVencimiento = prompt(`Ingresa la fecha de vencimiento (DD/MM/YYYY) (actual: ${tarea.fechaVencimiento ? tarea.fechaVencimiento.toLocaleDateString() : "vacía"}): `);
    if (fechaVencimiento.trim() !== "") {
        if (fechaVencimiento === " ") {
            tarea.fechaVencimiento = null;
        } else {
            let partesFecha = fechaVencimiento.split("/");
            if (partesFecha.length !== 3) {
                console.log("Fecha inválida. Se mantendrá el valor actual.");
            } else {
                let dia = parseInt(partesFecha[0]);
                let mes = parseInt(partesFecha[1]);
                let anio = parseInt(partesFecha[2]);
                fechaVencimiento = new Date(anio, mes - 1, dia); // -1 porque los meses en JS van de 0 a 11
                if (isNaN(fechaVencimiento)) {
                    console.log("Fecha inválida. Se mantendrá el valor actual.");
                } else {
                    tarea.fechaVencimiento = fechaVencimiento;
                }
            }
        }
    }

    // Actualizar fecha de última edición
    tarea.fechaUltimaEdicion = new Date();
    
    console.log("Tarea editada:", tarea);
}

function buscarTarea() {
    let titulo = prompt("Introduce el título de una tarea para buscarla: ");
    let resultados = tareas.filter(t => t.titulo.toLowerCase().includes(titulo.toLowerCase())); // .filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función proporcionada. En este caso, la función verifica si el título de cada tarea (convertido a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas) incluye la cadena de búsqueda (también convertida a minúsculas). Si es así, esa tarea se incluye en el nuevo array resultados.
    
    if (resultados.length === 0) {
        console.log(`No se encontraron tareas con el título: ${titulo}.`);
        return;
    }
    
    // Mostrar títulos de las tareas encontradas
    console.log("Tareas encontradas: ");
    resultados.forEach((tarea, indice) => {
        console.log(`[${indice + 1}] ${tarea.titulo}`);
    });
    
    console.log("\n¿Deseas ver los detalles de alguna tarea?");
    let num = prompt("Introduce el número de la tarea para ver detalles o 0 para volver: ");
    let indice = parseInt(num) - 1;
    
    if (num === "0") {
        return;
    }
    
    if (isNaN(indice) || indice < 0 || indice >= resultados.length) {
        console.log("Número inválido.");
        return;
    }
    
    let tareaSeleccionada = resultados[indice];
    console.log("Detalles de la tarea seleccionada: ");
    console.log(tareaSeleccionada);

    // Si el usuario ingresa una tarea válida, darle la opción de editarla
    let opEditar = prompt("\nSi deseas editarla, presione E, o presiona 0 para volver: ");
    
    if (opEditar.toUpperCase() === "E") {
        editarTarea(tareaSeleccionada);
    } else if (opEditar === "0") {
        return;
    } else {
        console.log("Opción inválida.");
        return;
    }
}

function main() {
    menuPrincipal();
}

main();