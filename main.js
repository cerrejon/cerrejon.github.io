class CustomValidationButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });

        // Crear el botón en UI5
        this.button = new sap.m.Button({
            text: "Validar Datos",
            press: () => this.validateData()
        });

        // Crear un contenedor UI5 para renderizar el botón dentro del shadow DOM
        this.ui5Container = document.createElement("div");
        this.shadowRoot.appendChild(this.ui5Container);

        // Renderizar el botón en el contenedor
        this.button.placeAt(this.ui5Container);
    }

    validateData() {
        var table = sap.ui.getCore().byId("__table3"); // Obtener la tabla en UI5

        if (!table) {
            console.log("No se encontró la tabla.");
            return;
        }

        const rows = [];
        const items = table.getItems(); // Obtener filas de la tabla

        items.forEach(item => {
            const cells = item.getCells(); // Obtener celdas de cada fila
            if (cells.length >= 4) {
                rows.push([
                    cells[0].getText(), // Económica
                    cells[1].getText(), // Funcional
                    this.parseNumber(cells[2].getText()), // Libre disposición
                    this.parseNumber(cells[3].getText()) // Techo de gasto
                ]);
            }
        });

        console.log("Datos extraídos por filas:", rows);

        let errores = 0;
        let mensajes = "";

        // Validación de los datos
        for (let i = 3; i < rows.length; i++) {
            const [economica, funcional, libre, techo] = rows[i];

            if (libre > techo) {
                errores++;
                mensajes += `\nEconómica y Funcional donde se ha excedido el techo de gasto: ${economica} ${funcional}`;
            }
        }

        if (errores > 0) {
            this.showPopup(mensajes);
        } else {
            sap.m.MessageToast.show("Validación completada sin errores.", {
                duration: 3000
            });
        }
    }

    parseNumber(value) {
        if (!value || value === "–") return 0; // Si no hay valor, devolver 0
        return Number.parseFloat(value.replace(".", "").replace(",", "."));
    }

    showPopup(message) {
        var dialog = new sap.m.Dialog({
            title: "Económicas Erróneas",
            type: "Message",
            content: new sap.m.VBox({
                items: [
                    new sap.m.Text({ text: "Se han encontrado los siguientes errores:" }),
                    new sap.m.TextArea({
                        value: message,
                        rows: 5,
                        width: "100%",
                        editable: false
                    })
                ]
            }),
            beginButton: new sap.m.Button({
                text: "Cerrar",
                press: function () {
                    dialog.close();
                }
            }),
            afterClose: function () {
                dialog.destroy();
            }
        });

        dialog.open();
    }
}

// Definir el Web Component
customElements.define("custom-validation-button", CustomValidationButton);
