document.addEventListener("DOMContentLoaded", () => {
  let puntos = 0;

  const letra = document.getElementById("letra"); // Obtener el valor del campo de texto letra
  const vidasElement = document.querySelector("#vidas"); // Obtener el elemento que muestra las vidas
  const botonEnviar = document.getElementById("boton"); // Obtener el elemento del boton de envío
  const puntosElement = document.querySelector("#puntos"); // Obtener el elemento que muestra la puntuación
  const contenedorElement = document.getElementById("contenedor"); // Obtener el elemento contenedor
  const listaIncorrectas = document.querySelector("#listaIncorrectas"); // Obtener elemento de listas de letras incorrectas

  function inicio(puntos, finalizo) {
    let vidas = 5;
    let letrasIncorrectas = [];
    let textIncorrectas;
    let mostrarIncorrectas;
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

      if (palabra.includes(letra.value)) {
        const mensaje = document.createElement("p");
        mensaje.innerHTML = "La letra ya existe en la palabra";
        document.body.appendChild(mensaje);
        letra.value = "";
        setTimeout(() => {
          document.body.removeChild(mensaje);
        }, 2000);
        return;
      }
      arrayPalabraOculta.forEach((caracter, index) => {
        if (letra.value === caracter) {
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
            // if (letrasIncorrectas.length === 0) {
            //   textIncorrectas = document.createElement("p");
            //   textIncorrectas.innerHTML = "Letras incorrectas: ";
            //   document.body.appendChild(textIncorrectas);
            // }
            if (letrasIncorrectas.includes(letra.value)) {
              return;
            }
            letrasIncorrectas = [...letrasIncorrectas, letra.value];
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
            // console.log(vidas);
          }

          // console.log("no existe la letra");
          // console.log(palabraOculta[index]);
        }
        // console.log("letra: " + letra.value);
        // console.log("caracter: " + palabraOculta[index]);
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
    }

    // Repetir partida
    function repetirPartida(puntos) {
      finalizo = true;
      inicio(puntos);
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
        letra.removeAttribute("disabled");
        botonEnviar.removeAttribute("disabled");
        document.body.removeChild(p2);
        document.body.removeChild(p3);
        ocultarPalabra.style.display = "none";
        document.body.removeChild(btnSi);
        document.body.removeChild(btnNo);
        repetirPartida(vidas === 0 ? 0 : puntos);
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
  inicio(puntos);
});
