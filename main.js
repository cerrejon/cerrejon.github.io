class CustomValidationButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        this.button = document.createElement("button");
        this.button.innerText = "Validar Datos";
        this.button.addEventListener("click", () => this.validateData());

        this.shadowRoot.appendChild(this.button);
    }

    validateData() {
        const table = "__table5";
        
        const cells = Array.from(table.querySelectorAll(".tableCell"));
        const rows = {};

        // Agrupar celdas en filas
        cells.forEach(cell => {
            const rowIndex = cell.getAttribute("aria-rowindex");
            if (rowIndex) {
                if (!rows[rowIndex]) {
                    rows[rowIndex] = [];
                }
                const textValue = cell.querySelector(".textValue")?.innerText.trim() || "";
                rows[rowIndex].push(textValue);
            }
        });

        const tableData = Object.keys(rows).sort((a, b) => a - b).map(key => rows[key]);
        console.log("Datos extraídos por filas:", tableData);

        let errores = 0;
        let mensajes = "";

        // Recorrer las filas y validar
        for (let i = 3; i < tableData.length; i++) {
            const [economica, funcional, libreDisposicion, techoGasto] = tableData[i];

            // Convertir los valores en números, manejar valores vacíos o con guiones
            const libre = this.parseNumber(libreDisposicion);
            const techo = this.parseNumber(techoGasto);

            if (libre > techo) {
                errores++;
                mensajes += `\nEconómica y Funcional donde se ha excedido el techo de gasto: ${economica} ${funcional}`;
            }
        }

        if (errores > 0) {
            console.log("Errores encontrados:", mensajes);
            alert(`Se han encontrado ${errores} errores:\n${mensajes}`);
        } else {
            alert("Validación completada sin errores.");
        }
    }

    parseNumber(value) {
        if (!value || value === "–") return 0; // Si no hay valor, devolver 0
        return Number.parseFloat(value.replace(".", "").replace(",", "."));
    }
}

customElements.define("custom-validation-button", CustomValidationButton);
