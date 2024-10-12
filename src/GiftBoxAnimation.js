import React, { useReducer, useRef, useState, useEffect } from "react";
import "./styles.css";

import entradaRosi from "./images/entrada rosi.jpeg"; // La imagen completa
import box from "./images/box.png";
import boxLid from "./images/box-lid.png";
import kuku from "./images/jump-character.png";
import Confetti from "./confetti/Confetti";
import heartIcon from "./images/image.png";
import audioFile from "./cancion.mp3";

const init_state = {
  move: "move",
  jump: "",
  rotated: "",
  rotating: "",
  revealed: false,
};

// Texto para el efecto de máquina de escribir
const typewriterText = `
¡FELIZ CUMPLEAÑOS PEDS!

Gracias por los besos y los abrazos,
por las palabras que confortan y los silencios que hablan.
Gracias por las risas y los llantos compartidos,
por cada momento que me hace sonreír.
Por las prácticas, las enseñanzas y los aprendizajes.
Por las conversaciones sinceras, aunque a veces surjan del miedo o del enojo,
siempre con un fondo de comprensión.
Gracias por escucharme, por tu empatía,
por tomarte de mi mano en mis momentos de incertidumbre,
por estar siempre a mi lado cuando siento que no puedo más.
Gracias por tus ocurrencias, por los chistes cotidianos
y las locuras que compartimos, por el amor que inunda cada día.
Gracias por existir en esta vida y permitirme ser parte de ella,
por elegir siempre la libertad, dándome un espacio dentro de ella para amarnos.
Deseo de todo corazón tu felicidad, y espero ser una de las luces
que iluminen tus días.
`;

export default function GiftBoxAnimation() {
  const [state, setState] = useReducer(
    (state, new_state) => ({
      ...state,
      ...new_state,
    }),
    init_state
  );

  const { move, rotating, rotated, jump, revealed } = state;
  const [showAnimation, setShowAnimation] = useState(false);
  const [displayedText, setDisplayedText] = useState(""); // Para el texto tipo máquina
  const audioRef = useRef(new Audio(audioFile)); // Crear el objeto Audio

  // Reproducir audio cuando se muestra la animación
  useEffect(() => {
    const handlePlay = async () => {
      try {
        // Agregar un retraso de 2 segundos
        await new Promise((resolve) => setTimeout(resolve, 1300));
        await audioRef.current.play();
      } catch (error) {
        console.error("Error al reproducir audio:", error);
      }
    };

    handlePlay();
  }, []);

  // Efecto tipo máquina de escribir
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index < typewriterText.length) {
        setDisplayedText((prev) => prev + typewriterText[index]);
        index++;
      } else {
        clearInterval(intervalId);
      }
    }, 40); // Ajusta la velocidad aquí

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, [showAnimation]);

  function animate() {
    let isDone = rotated === "rotated";

    if (!isDone) {
      setState({ rotating: "rotating" });
      setTimeout(() => {
        setState({ jump: "jump" });
      }, 300);
      setTimeout(() => {
        setState({ rotated: "rotated" });
        setState({ revealed: true }); // Marcar como reveladas
      }, 5000);
    } else {
      setState(init_state);
    }

    let moving = move === "move" ? "" : "move";
    setState({ move: moving });
  }

  const handleSorpresaClick = () => {
    setShowAnimation(true);
    document.body.classList.add("split-screen");
    setTimeout(() => {
      document.body.classList.remove("split-screen");
    }, 500);
  };

  return (
    <div className="App">
      {!showAnimation ? (
        <div className="typewriter-container">
          <div className="type-writer-text">
            {displayedText}
            <span className="cursor" /> {/* Cursor parpadeante */}
          </div>
          <button className="sorpresa-button" onClick={handleSorpresaClick}>
            Sorpresa
          </button>
        </div>
      ) : (
        <div className="animation-container">
          <Confetti open={jump === "jump"} />
          <div className="img-container">
            <img className={`kuku ${jump}`} src={kuku} alt="kuku" />
            <button className="box" onClick={animate}>
              <img className="img-caja" src={box} alt="box" />
            </button>
            <img
              className={`lid ${move} ${rotating} ${rotated}`}
              src={boxLid}
              alt="box-lid"
            />
          </div>

          {jump === "jump" && (
            <div className="message">
              <h1>¡Feliz Cumple Rosita!</h1>
              <h2>
                Te amo{" "}
                <img
                  src={heartIcon}
                  alt="Corazón"
                  style={{
                    width: "100px",
                    heigth: "100px",
                    verticalAlign: "middle",
                  }}
                />
              </h2>
              <div>
                <div
                  className={`card ${revealed ? "flipped" : ""}`}
                  onClick={() => setState({ revealed: true })}
                >
                  <div className="card-face card-front"></div>
                  <div className="card-face card-back">
                    <img
                      className="entrada"
                      src={entradaRosi}
                      alt="Entrada Rosi"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
