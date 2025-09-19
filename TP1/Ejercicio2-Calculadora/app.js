// Importamos el módulo readline para leer entrada del usuario
const readline = require('readline');

// Creamos la interfaz para leer desde la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función principal que coordina todo el programa
function iniciarCalculadora() {
    console.log("=== CALCULADORA BÁSICA ===");
    console.log("Operaciones disponibles: +, -, *, /");
    console.log("---------------------------");
    
    // Pedimos los datos al usuario
    pedirDatos();
}

// Función para pedir los datos al usuario
function pedirDatos() {
    rl.question('Ingrese el primer número: ', (primerNumero) => {
        rl.question('Ingrese el operador (+, -, *, /): ', (operador) => {
            rl.question('Ingrese el segundo número: ', (segundoNumero) => {
                // Convertimos los números y realizamos la operación
                calcularOperacion(primerNumero, operador, segundoNumero);
            });
        });
    });
}

// Función para calcular la operación matemática
function calcularOperacion(num1Str, operador, num2Str) {
    // Convertimos los strings a números
    const num1 = parseFloat(num1Str);
    const num2 = parseFloat(num2Str);
    
    // Validamos que los números sean válidos
    if (isNaN(num1) || isNaN(num2)) {
        console.log("Error: Por favor ingrese números válidos");
        reiniciarCalculadora();
        return;
    }
    
    let resultado;
    let operacionValida = true;
    
    // Realizamos la operación según el operador
    switch (operador) {
        case '+':
            resultado = sumar(num1, num2);
            break;
        case '-':
            resultado = restar(num1, num2);
            break;
        case '*':
            resultado = multiplicar(num1, num2);
            break;
        case '/':
            if (num2 === 0) {
                console.log("Error: No se puede dividir por cero");
                reiniciarCalculadora();
                return;
            }
            resultado = dividir(num1, num2);
            break;
        default:
            console.log("Error: Operador no válido. Use +, -, *, /");
            operacionValida = false;
    }
    
    // Mostramos el resultado si la operación fue válida
    if (operacionValida) {
        console.log(`\nResultado: ${num1} ${operador} ${num2} = ${resultado}`);
    }
    
    reiniciarCalculadora();
}

// Funciones para las operaciones matemáticas
function sumar(n1, n2) {
    return n1 + n2;
}

function restar(n1, n2) {
    return n1 - n2;
}

function multiplicar(n1, n2) {
    return n1 * n2;
}

function dividir(n1, n2) {
    return n1 / n2;
}

// Función para preguntar si desea realizar otra operación
function reiniciarCalculadora() {
    rl.question('\n¿Desea realizar otra operación? (s/n): ', (respuesta) => {
        if (respuesta.toLowerCase() === 's' || respuesta.toLowerCase() === 'si') {
            console.log('\n');
            pedirDatos();
        } else {
            console.log('¡Gracias por usar la calculadora!');
            rl.close();
        }
    });
}

// Iniciamos la calculadora
iniciarCalculadora();