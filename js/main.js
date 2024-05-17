document.addEventListener("DOMContentLoaded", () => {
  const letra = document.getElementById("letra"); // Obtener el valor del campo de texto letra
  const vidasElement = document.querySelector("#vidas"); // Obtener el elemento que muestra las vidas
  const botonEnviar = document.getElementById("boton"); // Obtener el elemento del boton de envío
  const puntosElement = document.querySelector("#puntos"); // Obtener el elemento que muestra la puntuación
  const contenedorElement = document.getElementById("contenedor"); // Obtener el elemento contenedor
  let listaIncorrectas = document.getElementById("listaIncorrectas"); // Obtener elemento lista incorrectas
  let textoIncorrectas = document.querySelector('#textoIncorrectas'); // Obtener el elemento p con ID textoInorrectas

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

  function inicio(listadoPalabras) {
    let vidas = 5;
    let letrasIncorrectas = [];
    let mostrarIncorrectas;

    textoIncorrectas.textContent = 0; // Cantida de letras incorrectas al iniciar juego 

    // Funcion para generar palabras aleatorias con los datos traidos de palabras.js
    function palabrasAleatorias() {
      let indice = Math.floor(Math.random() * listadoPalabras.length);
      return String(listadoPalabras[indice].palabra);
    }

    // Recuperar datos de vidas
    let vidasAnteriores = JSON.parse(localStorage.getItem("vidas"));
    // mostrar puntos según si juega por primera vez , termina la partida o pierde la partida
    let puntosAlmacenados = JSON.parse(localStorage.getItem("puntos"));
    let puntos =
      vidasAnteriores === 0 || vidasAnteriores === null ? 0 : puntosAlmacenados;
    //Mostrar Vidas
    vidasElement.textContent = "❤️".repeat(vidas);
    puntosElement.textContent = puntos;

    // Genero la palabra oculta
    let palabraOculta = palabrasAleatorias();

    // crear elemento párrafo html: palabra 
    let textoPalabra = document.createElement('p');
    textoPalabra.innerHTML = '<p>Palabra: </p>';
    document.body.appendChild(textoPalabra);

    // plabra oculta
    let palabra = ""; // palabra que se muestra con '_' la inicializo vacia

    // Recorro el cada letra de la palabra oculta y la reempalazo por '_ '
    for (let i = 0; i < palabraOculta.length; i++) {
      palabra += palabraOculta.replace(palabraOculta, "_");
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


    // Crear elemento botón terminar la partida
    const botonTerminar = document.createElement('button');
    botonTerminar.innerText = 'Terminar Partida';
    botonTerminar.className = 'boton_terminar';
    document.body.appendChild(botonTerminar);

    // LLamar a función finalizarPartida al hacer click
    botonTerminar.addEventListener('click', () => finalizarPartida(puntos));

    // Escuchar evento click botón enviar

    botonEnviar.addEventListener("click", (e) => {
      const arrayPalabraOculta = palabraOculta.split("");
      palabra = [...palabra];
      let noCoincidencias = 0;

      if (palabra.includes(letra.value.toLowerCase())) {
        const mensaje = document.createElement("p");
        mensaje.innerHTML =
          "<span class='text_error'>La letra ya existe en la palabra</span>";
        document.body.appendChild(mensaje);
        botonEnviar.disabled = true;
        setTimeout(() => {
          document.body.removeChild(mensaje);
          botonEnviar.disabled = false;
        }, 3000);
        letra.value = "";
        return;
      }

      if (!letrasCorrectas.includes(letra.value.toLowerCase())) {
        const ingresoIncorrecto = document.createElement("p");
        ingresoIncorrecto.innerHTML =
          "<span class='text_error'>Ingresa una letra correcta</span>";
        document.body.appendChild(ingresoIncorrecto);
        botonEnviar.disabled = true;
        setTimeout(() => {
          document.body.removeChild(ingresoIncorrecto);
          botonEnviar.disabled = false;
        }, 3000);
        letra.value = "";
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
          // Si adivina la palabra muestra el mensaje y finaliza ó repite la partida
          if (palabra.join("").toLowerCase() === palabraOculta.toLowerCase()) {
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
              letra.value = "";
              const mensajeIncorrectas = document.createElement("p");
              mensajeIncorrectas.innerHTML =
                "<span class='text_error'>La letra ya existe en letras incorrectas</span>";
              document.body.appendChild(mensajeIncorrectas);
              botonEnviar.disabled = true;
              setTimeout(() => {
                document.body.removeChild(mensajeIncorrectas);
                botonEnviar.disabled = false;
              }, 3000);
              return;
            }
            letrasIncorrectas = [
              ...letrasIncorrectas,
              letra.value.toLowerCase(),
            ];

            textoIncorrectas.textContent = letrasIncorrectas.length; // Mostrar la cantidad de letras incorrectas

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
    const finalizarPartida = (puntos) => {
      contenedorElement.style.display = "none";
      ocultarPalabra.style.display = "none";
      document.body.removeChild(textoPalabra);
      if (document.contains(botonTerminar)) {
        document.body.removeChild(botonTerminar);
      };
      const h1 = document.createElement("h1");
      h1.innerText = "Gracias por jugar Adivina la palabra 🎆🫡";
      h1.className = "text_fin_juego";
      document.body.appendChild(h1);
      const p = document.createElement("p");
      p.innerHTML = `Puntuación: <strong class="text_loser-puntos">${puntos}</strong>`;
      document.body.appendChild(p);
      // Crear botón para ir a pagina de inicio
      const botonInicio = document.createElement('button');
      botonInicio.innerHTML = '<span><i class="fa-solid fa-house"></i> Página Inicio</span>';
      botonInicio.className = 'boton_inicio';
      document.body.appendChild(botonInicio);

      botonInicio.addEventListener('click', () => location.href = '/game'); // Ir a página de inicio

      localStorage.removeItem("puntos"); // Borrar puntos almacenados en localStorage
      localStorage.removeItem("vidas"); // Borrar vidas almacenadas en localStorage
    }

    // Repetir partida
    function repetirPartida() {
      location.reload();
    }

    // Función para repetir o finalizar la partida

    function repetirFinalizarPartida(clase, texto) {
      document.body.removeChild(botonTerminar); // remover botón terminar partida
      const p2 = document.createElement("p");
      p2.className = clase;
      p2.innerText = texto;
      botonEnviar.setAttribute("disabled", true);
      letra.setAttribute("disabled", true);
      document.body.appendChild(p2);
      const p3 = document.createElement("p");
      p3.innerText = "¿Quieres jugar de nuevo?";
      p3.className = "texto_repetir";
      document.body.appendChild(p3);
      const btnSi = document.createElement("button");
      btnSi.innerHTML = '<i class="fa-solid fa-check"></i>';
      btnSi.className = "btn_finalizar btn-si";
      document.body.appendChild(btnSi);
      btnSi.addEventListener("click", () => {
        localStorage.setItem("vidas", JSON.stringify(vidas)); // Guardar vidas anteriores
        localStorage.setItem("puntos", JSON.stringify(puntos)); // Guardar puntos anteriores

        repetirPartida();
      });
      const btnNo = document.createElement("button");
      btnNo.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      btnNo.className = "btn_finalizar btn-no";
      document.body.appendChild(btnNo); //Opcion cuando no se quiera jugar de nuevo
      btnNo.addEventListener("click", () => {
        ocultarPalabra.style.display = "none";
        document.body.removeChild(p2);
        document.body.removeChild(p3);
        letrasIncorrectas = [];
        document.body.removeChild(btnSi);
        document.body.removeChild(btnNo);
        finalizarPartida(puntos);
      });
    }
  }


  async function getDatos() {
    try {
      let data = await fetch("data/palabras.json");
      let getPalabras = data.json();
      return getPalabras;
    } catch (error) {
      console.log('Error de comununicacion con el servidor', error)
    }

  };

  (async () => {
    try {
      let listadoPalabras = await getDatos();
      inicio(listadoPalabras);
    } catch (error) {
      console.log('Error en conexion a la obtencion de datos', error)
    }
  })();

});
