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
        var table = __table3;

        if (!table) {
            console.log("No se encontró la tabla.");
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
            var [economica, funcional, libre, techo] = rows[i];
            if(libre==="–"){libre=0;}
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
