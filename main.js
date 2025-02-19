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
        Application.showBusyIndicator();

        // Acceder al widget de área de texto
        const textArea = Application.getWidget(this.getAttribute("messageArea"));
        textArea.setValue("");  // Limpiar el área de texto

        // Acceder al control de la tabla de SAPUI5
        const table = sap.ui.getCore().byId(this.getAttribute("tableAlias"));
        
        // Obtener los datos del modelo asociado a la tabla
        const oModel = table.getModel(); // Obtener el modelo de la tabla
        const aData = oModel.getData(); // Obtener los datos del modelo (puede ser un array de objetos)

        let errores = 0;

        // Iterar sobre las filas de los datos y hacer las validaciones
        for (let i = 0; i < aData.length - 1; i++) {
            if (
                aData[i].MeasureDimension.description === "Libre Disposición" &&
                aData[i + 1].MeasureDimension.description === "Techo Gasto" &&
                Number.parseFloat(aData[i].MeasureDimension.rawValue) >
                Number.parseFloat(aData[i + 1].MeasureDimension.rawValue)
            ) {
                errores++;
                textArea.setValue(
                    textArea.getValue() +
                    "\n" +
                    "Económica y Funcional donde se ha excedido el techo de gasto: " +
                    aData[i]["economica"].id +
                    " " +
                    aData[i]["funcional"].id
                );
            }
        }

        // Acceder a los botones y el popup
        const successButton = Application.getWidget(this.getAttribute("buttonSuccess"));
        const errorButton = Application.getWidget(this.getAttribute("buttonError"));
        const popup = Application.getWidget(this.getAttribute("popup"));

        if (errores === 0) {
            // Si no hay errores, mostrar el mensaje de éxito
            errorButton.setVisible(false);
            successButton.setVisible(true);
            Application.showMessage(ApplicationMessageType.Success, "No se han encontrado errores");
        } else {
            // Si hay errores, mostrar el popup con los errores
            successButton.setVisible(false);
            errorButton.setVisible(true);
            popup.open();
        }

        Application.hideBusyIndicator();
    }
}

// Definir el widget personalizado
customElements.define("custom-validation-button", CustomValidationButton);
