import React from "react";
import styled from "styled-components";
import { Toaster, ToasterProvider, useCreateToast, useToasts } from "./v2";

/**
 * Concept for v2.
 *
 * Instead having the ToasterProvider/Toaster handle the animations or things, it should handle data and state.
 * This way you could let a more advanced-than-css animator do things (like framer motion).
 *
 * This version let's you pick a component to render,
 * and it gets props that let it do things.
 *
 * The disppearing toast is done in user land vs lib land.
 *
 *
 * There could be additional ref / hooks / props that help set aria and things?
 */

const Toast = styled.div`
  border: 1px solid black;
  margin: 1rem;
  padding: 1rem;
`;

function Sourdough({ id, data, close }) {
  return (
    <Toast>
      <p>this is toast #{data.count}</p>
      <p>something happened at {data.date}</p>
      <button onClick={() => close(id)}>close this toast</button>
    </Toast>
  );
}

const DisappearingToast = styled.div`
  opacity: 0;
  max-height: 0rem;
  @keyframes fadeaway {
    0%,
    80% {
      opacity: 1;
      max-height: 10rem;
    }
    100% {
      opacity: 0;
      max-height: 0rem;
    }
  }

  animation-name: fadeaway;
  animation-duration: ${(props) => props.duration ?? "5s"};
  animation-timing-function: ease-out;
  animation-delay: 0s;
  animation-direction: normal;
  animation-iteration-count: 1;
  animation-fill-mode: none;
`;

// Do we like this better as a prop list or should it be a context?
// Props is kind of nice, but it's hard to know what's available
// Because it's sort of a magic component
function Rye({ id, data, close }) {
  const animationRef = React.useRef();

  const doClearToast = React.useCallback(() => {
    close(id);
  }, [close, id]);

  React.useLayoutEffect(() => {
    const e = animationRef.current;
    e.addEventListener("animationend", doClearToast);
    return () => e.removeEventListener("animationend", doClearToast);
  }, [doClearToast]);

  return (
    <DisappearingToast ref={animationRef}>
      <Toast>
        <p>this is toast #{data.count}</p>
        <p>something happened at {data.date}</p>
        <p>This will disappear soon!</p>
        <button onClick={() => close(id)}>close this toast</button>
      </Toast>
    </DisappearingToast>
  );
}

function AddToastButton() {
  const [counter, setCounter] = React.useState(0);
  const addToast = useCreateToast();

  return (
    <button
      onClick={() => {
        addToast({
          component: counter % 2 === 0 ? Sourdough : Rye,
          data: {
            count: counter,
            date: new Date().toISOString(),
          },
        });
        setCounter((p) => p + 1);
      }}
      style={{ fontSize: "5rem" }}
    >
      add toast
    </button>
  );
}

function Count() {
  const toasts = useToasts();
  return <div>toasts right now: {toasts.length}</div>;
}

const BreadBox = styled.div`
  width: 65ch;
  margin: 0 auto;
`;

export default function App() {
  return (
    <ToasterProvider>
      <AddToastButton />
      <Count />
      <hr />
      <Toaster container={BreadBox} />
      {/* <Toaster /> */}
    </ToasterProvider>
  );
}
