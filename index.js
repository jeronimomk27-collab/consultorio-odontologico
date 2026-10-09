const readline = require("readline");

const lector = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let pacientes = [];
let pilaUrgente = [];
let filaPacientes = [];

function pedirDato(mensaje) {
    return new Promise(resolve => {
        lector.question(mensaje, resolve);
    });
}

async function ingresarPacientes() {
    let total = parseInt(
        await pedirDato("Ingrese el numero de pacientes: ")
    );

    if (isNaN(total) || total <= 0) {
        console.log("Debe ingresar una cantidad valida.");
        return;
    }

    for (let i = 0; i < total; i++) {
        console.log("\n--- PACIENTE " + (i + 1) + " ---");

        let nombre = await pedirDato("Nombre completo: ");
        let cedula = await pedirDato("Numero de cedula: ");
        let telefono = await pedirDato("Telefono: ");
        let servicio = await pedirDato(
            "Servicio (Limpieza, Calzas, Extraccion, Diagnostico): "
        );
        let prioridad = await pedirDato("Prioridad (Normal/Urgente): ");
        let fecha = await pedirDato("Fecha de cita (AAAA-MM-DD): ");

        pacientes.push({
            nombre: nombre,
            cedula: cedula,
            telefono: telefono,
            servicio: servicio.trim().toLowerCase(),
            prioridad: prioridad.trim().toLowerCase(),
            fecha: fecha,
            atendido: false
        });

        console.log("Paciente agregado a la agenda.");
    }
}

function organizarUrgencias() {
    let urgencias = pacientes.filter(p =>
        p.servicio === "extraccion" &&
        p.prioridad === "urgente" &&
        !p.atendido
    );

    urgencias.sort((a, b) => a.fecha.localeCompare(b.fecha));

    pilaUrgente = urgencias.reverse();

    console.log("\n===== PILA DE EXTRACCIONES URGENTES =====");

    if (pilaUrgente.length === 0) {
        console.log("No existen extracciones urgentes pendientes.");
        return;
    }

    console.log("La cita mas cercana se encuentra en la cima:");

    for (let i = pilaUrgente.length - 1; i >= 0; i--) {
        console.log(
            "\nNombre: " + pilaUrgente[i].nombre +
            "\nCedula: " + pilaUrgente[i].cedula +
            "\nFecha: " + pilaUrgente[i].fecha
        );
    }
}

function organizarFila() {
    filaPacientes = pacientes.filter(p => !p.atendido);

    console.log("\n===== COLA DE ATENCION =====");

    if (filaPacientes.length === 0) {
        console.log("Todos los pacientes han sido atendidos.");
        return;
    }

    filaPacientes.forEach((p, indice) => {
        console.log(
            (indice + 1) + ". " + p.nombre +
            " | Servicio: " + p.servicio +
            " | Fecha: " + p.fecha
        );
    });
}

function atenderSiguiente() {
    let paciente = pacientes.find(p => !p.atendido);

    if (!paciente) {
        console.log("\nNo hay pacientes pendientes.");
        return;
    }

    paciente.atendido = true;

    console.log("\nPaciente atendido:");
    console.log("Nombre: " + paciente.nombre);
    console.log("Servicio: " + paciente.servicio);
    console.log("Fecha: " + paciente.fecha);
}

function consultarPacientes() {
    console.log("\n===== LISTADO DE PACIENTES =====");

    if (pacientes.length === 0) {
        console.log("No se han registrado pacientes.");
        return;
    }

    pacientes.forEach((p, indice) => {
        console.log(
            "\nPaciente " + (indice + 1) +
            "\nNombre: " + p.nombre +
            "\nCedula: " + p.cedula +
            "\nTelefono: " + p.telefono +
            "\nServicio: " + p.servicio +
            "\nPrioridad: " + p.prioridad +
            "\nFecha: " + p.fecha +
            "\nEstado: " + (p.atendido ? "Atendido" : "Pendiente")
        );
    });
}

async function iniciarMenu() {
    let opcion;

    do {
        console.log("\n==============================");
        console.log(" CONSULTORIO ODONTOLOGICO");
        console.log("==============================");
        console.log("1. Registrar pacientes");
        console.log("2. Ver pila de urgencias");
        console.log("3. Ver cola de atencion");
        console.log("4. Atender siguiente paciente");
        console.log("5. Consultar todos los pacientes");
        console.log("6. Terminar programa");

        opcion = await pedirDato("Elija una opcion: ");

        switch (opcion.trim()) {
            case "1":
                await ingresarPacientes();
                break;
            case "2":
                organizarUrgencias();
                break;
            case "3":
                organizarFila();
                break;
            case "4":
                atenderSiguiente();
                break;
            case "5":
                consultarPacientes();
                break;
            case "6":
                console.log("Programa terminado.");
                break;
            default:
                console.log("Opcion no valida.");
        }
    } while (opcion.trim() !== "6");

    lector.close();
}

iniciarMenu();
