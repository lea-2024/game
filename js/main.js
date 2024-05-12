document.addEventListener("DOMContentLoaded", () => {
  const letra = document.getElementById("letra"); // Obtener el valor del campo de texto letra
  const vidasElement = document.querySelector("#vidas"); // Obtener el elemento que muestra las vidas
  const botonEnviar = document.getElementById("boton"); // Obtener el elemento del boton de envío
  const puntosElement = document.querySelector("#puntos"); // Obtener el elemento que muestra la puntuación
  const contenedorElement = document.getElementById("contenedor"); // Obtener el elemento contenedor
  let listaIncorrectas = document.getElementById("listaIncorrectas");

  let letrasCorrectas = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];

  function inicio() {
    let vidas = 5;
    let letrasIncorrectas = [];
    let textIncorrectas;
    let mostrarIncorrectas;

    // Recuperar datos de vidas
    let vidasAnteriores = JSON.parse(localStorage.getItem("vidas"));
    // mostrar puntos según si juega por primera vez , termina la partida o pierde la partida
    let puntosAlmacenados = JSON.parse(localStorage.getItem("puntos"));
    let puntos =
      vidasAnteriores === 0 || vidasAnteriores === null ? 0 : puntosAlmacenados;
    //Mostrar Vidas
    vidasElement.textContent = "❤️".repeat(vidas);
    puntosElement.textContent = puntos;

    let palabraOculta = "adivinanza"; // plabra oculta
    let palabra = ""; // palabra que se muestra con '_' la inicializo vacia

    // Recorro el cada letra de la palabra oculta y la reempalazo por '_ '
    for (let i = 0; i < palabraOculta.length; i++) {
      palabra += palabraOculta[i] = "_";
    }

    // Crear el elemento parrafo que muestre la cantida de caracteres ocultando las letras con '_'
    const p = document.createElement("p");
    p.id = "palabra";
    p.className = "palabra";
    p.innerText = palabra;

    document.body.appendChild(p); // agregar el elemento parrafo

    // Obtener el campo palabra oculta que se muestra con '_'
    const ocultarPalabra = document.querySelector("#palabra");

    // Evento submit formulario
    document.getElementById("formLetra").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    // Escuchar evento click botón enviar

    botonEnviar.addEventListener("click", (e) => {
      const arrayPalabraOculta = palabraOculta.split("");
      // console.log(arrayPalabraOculta);
      palabra = [...palabra];
      let noCoincidencias = 0;

      if (palabra.includes(letra.value.toLowerCase())) {
        const mensaje = document.createElement("p");
        mensaje.className = "text_error";
        mensaje.innerHTML = "La letra ya existe en la palabra";
        document.body.appendChild(mensaje);
        botonEnviar.disabled = true;
        letra.value = "";
        setTimeout(() => {
          document.body.removeChild(mensaje);
          botonEnviar.disabled = false;
        }, 2000);
        return;
      }

      console.log(letra.value.toLowerCase());

      if (!letrasCorrectas.includes(letra.value.toLowerCase())) {
        const ingresoIncorrecto = document.createElement("p");
        ingresoIncorrecto.innerHTML =
          "<span class='text_error'>Ingresa una letra correcta</span>";
        document.body.appendChild(ingresoIncorrecto);
        botonEnviar.disabled = true;
        setTimeout(() => {
          document.body.removeChild(ingresoIncorrecto);
        }, 2000);
        botonEnviar.disabled = false;
        return;
      }
      arrayPalabraOculta.forEach((caracter, index) => {
        // Comprobar que se ingrese una letra
        if (letra.value.toLowerCase() === caracter) {
          /* por cada letra correct se suman 10 puntos, si se repite la letra suma igual 10
          por cada una */
          puntos += 10;
          puntosElement.textContent = puntos; // Mostrar puntos por cada acierto en pantalla
          // verifica si la letra existe en la palabra
          palabra.splice(index, 1, letra.value);
          // letraExistente = true;}
          // Si adivina la palabra muestra el mensaje y finaliza ó repite la partida
          if (palabra.join("") === palabraOculta) {
            puntos += 250;
            puntosElement.textContent = puntos; // Mostrar puntos por cada acierto en pantalla
            repetirFinalizarPartida(
              "text-winner",
              "FELICITACIONES 🥳🎉🎊🎆!! Has adivinado la palabra"
            );
          }
        } else {
          noCoincidencias++;
          if (noCoincidencias === arrayPalabraOculta.length) {
            if (letrasIncorrectas.includes(letra.value.toLowerCase())) {
              const mensajeIncorrectas = document.createElement("p");
              mensajeIncorrectas.innerHTML =
                "<span class='text_error'>La letra ya existe en letras incorrectas</span>";
              document.body.appendChild(mensajeIncorrectas);
              botonEnviar.disabled = true;
              letra.value = "";
              setTimeout(() => {
                document.body.removeChild(mensajeIncorrectas);
                botonEnviar.disabled = false;
              }, 2000);
              return;
            }
            letrasIncorrectas = [
              ...letrasIncorrectas,
              letra.value.toLowerCase(),
            ];
            console.log(letrasIncorrectas);
            mostrarIncorrectas = document.createElement("span");
            for (let letra of letrasIncorrectas) {
              mostrarIncorrectas.innerHTML = `<strong> ${letra.toUpperCase()} </strong> `;
            }
            listaIncorrectas.appendChild(mostrarIncorrectas);
            vidas--;
            vidasElement.textContent = "❤️".repeat(vidas);
            if (vidas === 0) {
              repetirFinalizarPartida("text-loser", "GAME OVER 😒😢😵!!");
            }
          }
        }
      });

      ocultarPalabra.innerText = palabra.join("").toUpperCase();

      letra.value = "";
    });

    // Función para finalizar la partida
    function finalizarPartida(puntos) {
      contenedorElement.style.display = "none";
      const h1 = document.createElement("h1");
      h1.innerText = "Gracias por jugar Adivina la palabra 🎆🫡";
      document.body.appendChild(h1);
      const p = document.createElement("p");
      p.innerHTML = `Puntuación: <strong>${puntos}</strong>`;
      document.body.appendChild(p);
      localStorage.removeItem("puntos"); // Borrar puntos almacenados en localStorage
      localStorage.removeItem("vidas"); // Borrar vidas almacenadas en localStorage
    }

    // Repetir partida
    function repetirPartida() {
      location.reload();
    }

    // Función para repetir o finalizar la partida
    function repetirFinalizarPartida(clase, texto) {
      const p2 = document.createElement("p");
      p2.className = clase;
      p2.innerText = texto;
      botonEnviar.setAttribute("disabled", true);
      letra.setAttribute("disabled", true);
      document.body.appendChild(p2);
      const p3 = document.createElement("p");
      p3.innerText = "¿Quieres jugar de nuevo?";
      document.body.appendChild(p3);
      const btnSi = document.createElement("button");
      btnSi.innerText = "Si";
      document.body.appendChild(btnSi);
      btnSi.addEventListener("click", () => {
        localStorage.setItem("vidas", JSON.stringify(vidas)); // Guardar vidas anteriores
        localStorage.setItem("puntos", JSON.stringify(puntos)); // Guardar puntos anteriores

        repetirPartida();
      });
      const btnNo = document.createElement("button");
      btnNo.innerText = "No";
      document.body.appendChild(btnNo); //Opcion cuando no se quiera jugar de nuevo
      btnNo.addEventListener("click", () => {
        ocultarPalabra.style.display = "none";
        document.body.removeChild(p2);
        document.body.removeChild(p3);
        letrasIncorrectas = [];
        document.body.removeChild(textIncorrectas);
        document.body.removeChild(btnSi);
        document.body.removeChild(btnNo);
        finalizarPartida(puntos);
      });
    }
  }
  inicio();
});
