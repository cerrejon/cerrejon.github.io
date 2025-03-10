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
        const table = __table5;

        if (table) {
            // Obtiene todas las celdas de la tabla
            const cells = Array.from(table.querySelectorAll(".tableCell"));
        
            // Agrupar celdas en filas basándonos en su índice de fila
            const rows = {};
        
            cells.forEach(cell => {
                // Obtiene el índice de la fila basado en el atributo 'aria-rowindex'
                const rowIndex = cell.getAttribute("aria-rowindex");
                
                if (rowIndex) {
                    if (!rows[rowIndex]) {
                        rows[rowIndex] = [];
                    }
                    // Extrae el texto de la celda
                    const textValue = cell.querySelector(".textValue")?.innerText.trim() || "Sin texto";
                    rows[rowIndex].push(textValue);
                }
            });
        
            // Convertimos el objeto en un array ordenado y lo mostramos
            const tableData = Object.keys(rows).sort((a, b) => a - b).map(key => rows[key]);
            
            console.log("Datos extraídos por filas:", tableData);
        } else {
            console.log("No se encontró la tabla.");
        }

}
}

// Definir el widget personalizado
customElements.define("custom-validation-button", CustomValidationButton);
