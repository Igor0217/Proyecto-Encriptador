//---seleccion de todos los elementos---//
const btnEncriptar = document.querySelector(".btn-encriptar");
const txtEncriptar = document.querySelector(".encriptar");
const aviso = document.querySelector(".texto-aviso");
const imgAviso = document.querySelector(".img-aviso");
const respuesta = document.querySelector(".evaluar");
const contenido = document.querySelector(".tarjeta-contenedor");
const btnCopiar = document.querySelector(".btn-copiar");
const btnDesencriptar = document.querySelector(".btn-desencriptar")
const videoContainer = document.getElementById("videoContainer");
const video = document.getElementById("encryptionVideo");
const encriptando = document.querySelector(".mensaje-encriptando");
const closeBtn = document.querySelector(".close-btn");
const tryAgain = document.querySelector(".okBtn");
const modal = document.querySelector(".modal");
const msgAviso = document.querySelector(".msg")
const alert = document.querySelector(".alert");
const confirmado = document.querySelector(".continuar-btn");
const msgModal = document.querySelector(".msgModal");
let textoCopiado = false;
let contador = 0;


function mostrarAlerta(mensaje) {
    msgAviso.textContent = mensaje;
    alert.classList.add("show", "active");
    alert.classList.remove("hide");
}

function cerrarAlerta() {
    alert.classList.remove("show");
    alert.classList.add("hide");
}

function mostrarModal(mensaje, mostrarConfirmado = true) {
    msgModal.textContent = mensaje;
    modal.classList.add("active");
    confirmado.style.display = mostrarConfirmado ? "block" : "none";
}

function cerrarModal() {
    modal.classList.remove("active");
}

function mostrarPopup() {
    let popup = document.getElementById("popup");
    popup.style.position = "absolute";
    popup.style.display = 'flex';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
}

function cerrarPopup() {
    let popup = document.getElementById("popup");
    popup.style.visibility = 'hidden';
    popup.style.top = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.1)';
}

document.addEventListener("DOMContentLoaded", function() {
    txtEncriptar.addEventListener('focus', function() {
        txtEncriptar.placeholder = '';
        alert.classList.remove("show");
        alert.classList.add("hide");
        if (textoCopiado) {
            respuesta.innerHTML = '';
        }
    });

    txtEncriptar.addEventListener('blur', function() {
        if (txtEncriptar.value === '') {
            txtEncriptar.placeholder = 'Ingrese el texto aqui';
        }
    });
});

btnEncriptar.addEventListener('click', function(e) {
    e.preventDefault();    
    const button = this;
    button.classList.add("clicked");
    contador++;
    setTimeout(() => {
        button.classList.remove("clicked");
    }, 500);

    let texto = txtEncriptar.value;
    respuesta.innerHTML = '';

    if(texto === "") {
        mostrarModal("Favor ingrese el texto para encriptar", false);
        return;
    }

    let txt = texto.normalize("NFD").replace(/[$\.¿\?~!\¡@#%^&*()_|}\{[\]>\<:"`;,\u0300-\u036f']/g, "");

    if(texto !== txt) {
        mostrarAlerta("El texto no debe tener acentos y/o caracteres especiales");
        return;
    }

    if(texto !== texto.toLowerCase()) {
        mostrarAlerta("El texto no debe contener mayúsculas");
        closeBtn.addEventListener("click", cerrarAlerta);
        return;
    }

    // Proceso de encriptado
    iniciarEncriptacion(texto);
});

function iniciarEncriptacion(texto) {
    videoContainer.style.display = 'block';
    encriptando.style.display = 'block';
    video.play(); 
    texto = texto.replace(/e/mg, "enter")
                 .replace(/i/mg, "imes")
                 .replace(/a/mg, "ai")
                 .replace(/o/mg, "ober")
                 .replace(/u/mg, "ufat");

    setTimeout(()=>{    
        respuesta.innerHTML = texto;
    }, 3500); 
    video.onended = function() {
        videoContainer.style.display = 'none';
        btnCopiar.style.visibility = "inherit";
    };
}

btnDesencriptar.addEventListener('click', function(e) {
    e.preventDefault();
    const button = this;
    button.classList.add("clicked");

    setTimeout(() => {
        button.classList.remove("clicked");
    }, 500);

    let texto = txtEncriptar.value;
    const textoEncriptado = /enter|imes|ai|ober|ufat/.test(texto);

    if(texto === "") {
        mostrarModal("Favor ingrese el texto a desencriptar", false);
        return;
    }

    if (contador === 0) {
        mostrarModal("¿Está seguro de que desea desencriptar el texto?", true);

        // Remover cualquier evento anterior para evitar duplicación
        confirmado.removeEventListener("click", confirmarDesencriptacion);

        // Agregar un solo evento de click para confirmar la desencriptación
        confirmado.addEventListener("click", confirmarDesencriptacion);
    } else {
        desencriptarTexto(texto);
    }
});

function confirmarDesencriptacion() {
    cerrarModal();
    desencriptarTexto(txtEncriptar.value);
}

function mostrarModal(mensaje, mostrarConfirmado = true) {
    msgModal.textContent = mensaje;
    modal.classList.add("active");
    confirmado.style.display = mostrarConfirmado ? "block" : "none";
    
    // Asegurarnos de que el botón "Intentar de nuevo" cierre el modal correctamente
    tryAgain.removeEventListener("click", cerrarModal);
    tryAgain.addEventListener("click", cerrarModal);
}

function cerrarModal() {
    modal.classList.remove("active");
}

function desencriptarTexto(texto) {
    btnCopiar.style.visibility = "hidden";
    videoContainer.style.display = 'block';
    encriptando.style.display = 'block';
    encriptando.textContent = "Desencriptando texto";
    video.play();

    texto = texto.replace(/enter/mg, "e")
                 .replace(/imes/mg, "i")
                 .replace(/ai/mg, "a")
                 .replace(/ober/mg, "o")
                 .replace(/ufat/mg, "u");

    setTimeout(() => {
        respuesta.innerHTML = texto;
    }, 3500);

    video.onended = function() {
        videoContainer.style.display = 'none';
        btnCopiar.style.visibility = "inherit";
        contador = 0;
    };
}

//--boton copiar---//
btnCopiar.addEventListener("click", e => {
    e.preventDefault();
    navigator.clipboard.writeText(respuesta.textContent)
        .then(() => {
            txtEncriptar.value = "";
            txtEncriptar.placeholder = "Ingrese el texto aqui";
            textoCopiado = true;
            mostrarPopup();
        })
        .catch(err => console.error('Error al copiar el texto:', err));
});



const resetBtn = document.querySelector(".resetBtn");

resetBtn.addEventListener('click', function(e) {
    e.preventDefault();

    // Reiniciar el texto ingresado
    txtEncriptar.value = "";
    txtEncriptar.placeholder = "Ingrese el texto aqui";

    // Reiniciar la respuesta
    respuesta.innerHTML = "";
    respuesta.classList.remove('mover-abajo-arriba');

    // Ocultar video y mensajes de encriptación/desencriptación
    videoContainer.style.display = 'none';
    encriptando.style.display = 'none';
    
    // Detener y reiniciar el video si estaba en reproducción
    video.pause();
    video.currentTime = 0;

    // Ocultar botones como el de copiar
    btnCopiar.style.visibility = "hidden";

    // Reiniciar el estado del popup y alertas
    let popup = document.getElementById("popup");
    popup.style.display = 'none';
    popup.style.top = '0';
    popup.style.transform = 'translate(-50%, -50%) scale(0.1)';

    alert.classList.remove("show");
    alert.classList.add("hide");

    // Reiniciar otros estados visuales o clases si es necesario
    btnEncriptar.classList.remove("clicked");
    btnDesencriptar.classList.remove("clicked");
    modal.classList.remove("active");
    contador = 0;    
});