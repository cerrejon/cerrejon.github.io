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
        var table = document.querySelector("#__table5"); // Asegurar que la tabla es encontrada

        if (!table) {
            console.error("No se encontró la tabla con ID '__table5'");
            return;
        }

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
            this.showPopup(mensajes);
        } else {
            this.showMessageToast("Validación completada sin errores.", "Success");
        }
    }

    parseNumber(value) {
        if (!value || value === "–") return 0; // Si no hay valor, devolver 0
        return Number.parseFloat(value.replace(".", "").replace(",", "."));
    }

    showPopup(message) {
        const dialog = document.createElement("div");
        dialog.innerHTML = `
            <style>
                .overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .popup {
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
                    text-align: center;
                }
                .popup textarea {
                    width: 100%;
                    height: 100px;
                    border: 1px solid #ccc;
                    padding: 10px;
                }
                .popup button {
                    margin-top: 10px;
                    padding: 10px;
                    cursor: pointer;
                }
            </style>
            <div class="overlay">
                <div class="popup">
                    <h3 style="color: red;">Económicas Erróneas</h3>
                    <textarea readonly>${message}</textarea>
                    <br>
                    <button onclick="document.body.removeChild(this.closest('.overlay'))">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(dialog);
    }

    showMessageToast(message, type) {
        const toast = document.createElement("div");
        toast.innerText = message;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = type === "Success" ? "green" : "red";
        toast.style.color = "white";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "5px";
        toast.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
        document.body.appendChild(toast);

        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }
}

customElements.define("custom-validation-button", CustomValidationButton);
