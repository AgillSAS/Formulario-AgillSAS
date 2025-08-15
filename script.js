const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
};
const date = new Date().toLocaleDateString("es", options);
const form = document.getElementById("formulario-peligros");
const actualDate = document.getElementById("fecha-envio");
const fileInput = document.getElementById("evidencia");
const submitButton = document.getElementById("submit-btn");
const message = document.getElementById("message");
const cancelButton = document.getElementById("cancel-btn");
const confidential = document.getElementById("confidencial");
const name = document.getElementById("nombre");

actualDate.value = date;

// Function to handle file upload
async function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => {
            const data = e.target.result.split(",")[1];
            const mimeType = file.type;
            console.log(data);
            const obj = {
                fileName: file.name,
                mimeType: mimeType,
                data: data,
            };
            resolve(obj);
        };
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    message.textContent = "Enviando...";
    message.style.display = "block";
    message.style.backgroundColor = "#fff8c4";
    message.style.color = "#585858";
    message.style.border = "1px solid #ffe68c";
    submitButton.disabled = true;
    submitButton.value = "Cargando...";
    submitButton.style.background = "";
    submitButton.classList.add("Cargando");

    try {
        const formData = new FormData(this);
        const formDataObj = {};

        for (let [key, value] of formData.entries()) {
            formDataObj[key] = value;
        }

        // Handle file upload if a file is selected
        if (fileInput.files.length > 0) {
            const fileObj = await uploadFile(fileInput.files[0]);
            formDataObj.fileData = fileObj; // Add file data to form data
        }

        const scriptURL =
            "https://script.google.com/macros/s/AKfycbxVw4m3YNIpVW1Sg9NW-OdDfq1e9g0QEAssJ4snVSr2_G25z1JTRezuCXToMn3MS7fhxg/exec";

        const response = await fetch(scriptURL, {
            redirect: "follow",
            method: "POST",
            body: JSON.stringify(formDataObj),
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        });

        const data = await response.json();

        if (data.status === "success") {
            message.textContent = data.message || "Enviado con exito!";
            message.style.backgroundColor = "#ccfcee";
            message.style.color = "#585858";
            message.style.border = "1px, solid, #a9e0d4";
        } else {
            throw new Error(data.message || "No se pudo enviar la información");
        }
        form.reset();
        actualDate.value = date;
    } catch (error) {
        console.error("Error", error);
        message.textContent = "Error" + error.message;
        message.style.backgroundColor = "#ffecec";
        message.style.color = "#585858";
        message.style.border = "1px solid #facfcd";
    } finally {
        submitButton.disabled = false;
        submitButton.classList.remove("is-loading");

        setTimeout(() => {
            message.textContent = "";
            message.style.display = "none";
        }, 4000);
    }
});

cancelButton.addEventListener("click", function () {
    form.reset();
    message.style.display = "none";
    actualDate.value = date;
});

confidential.addEventListener("change", function () {
    if (this.checked) {
        name.value = "*******";
        name.disabled = true;
    } else {
        name.value = "";
        name.disabled = false;
    }
});
