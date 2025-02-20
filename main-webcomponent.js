class CustomValidationButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Crear el botón
        this.button = document.createElement("button");
        this.button.innerText = "Validar Datos";
        this.button.addEventListener("click", () => this.validateData());

        this.shadowRoot.appendChild(this.button);
    }

    validateData() {
     // Obtener la tabla del DOM
let table = document.querySelector("table");

if (table) {
    let rows = table.querySelectorAll("tbody tr"); // Seleccionar las filas del cuerpo de la tabla
    let mensaje = TextArea_1.getValue() + "\n";

    rows.forEach(row => {
        let cells = row.querySelectorAll("td"); // Obtener todas las celdas de la fila

        // Asegurar que las celdas tengan los valores correctos
        if (cells.length >= 4) { 
            let libreDisposicion = parseFloat(cells[2].innerText.replace(",", ".")) || 0; // Ajusta el índice si la columna cambia
            let techoGasto = parseFloat(cells[3].innerText.replace(",", ".")) || 0; 

            if (libreDisposicion > techoGasto) {
                let economica = cells[0].innerText.trim(); // Ajusta el índice si la columna cambia
                let funcional = cells[1].innerText.trim(); 

                mensaje += `Económica y Funcional donde se ha excedido el techo de gasto: ${economica} ${funcional}\n`;
            }
        }
    });

    // Mostrar mensaje si hay excedentes
    if (mensaje !== TextArea_1.getValue() + "\n") {
        alert(mensaje);
    }
} else {
    console.error("Tabla no encontrada: #__table5");
}

    }
}

// Definir el widget personalizado
customElements.define("custom-validation-button", CustomValidationButton);
