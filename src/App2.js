import React from "react";
import { v4 as uuid } from "uuid";

const ToasterContext = React.createContext();

function ToasterProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const value = {
    toasts,
    setToasts,
  };

  return (
    <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>
  );
}

function useCreateToast() {
  const toastContext = React.useContext(ToasterContext);

  const { setToasts } = toastContext;
  const id = uuid();

  return function (options) {
    setToasts((t) => [...t, { ...options, id }]);
  };
}

function useClearToast() {
  const { setToasts } = React.useContext(ToasterContext);

  return function (removeId) {
    setToasts((t) => t.filter(({ id }) => id !== removeId));
  };
}

function useToasts() {
  const { toasts } = React.useContext(ToasterContext);
  return toasts;
}

function Toaster({ children, duration }) {
  const { toasts } = React.useContext(ToasterContext);
  const close = useClearToast();

  if (!toasts || toasts.length === 0) {
    return null;
  }

  return (
    <>
      {[...toasts].reverse().map(({ render, data, id }) => {
        return (
          <React.Fragment key={id}>
            {render({ id, data, close })}
          </React.Fragment>
        );
      })}
    </>
  );
}

function Sourdough() {}

function AddToastButton() {
  const addToast = useCreateToast();

  return (
    <button
      onClick={() =>
        addToast({
          data: {
            date: new Date().toISOString(),
          },
          render: ({ id, close, data }) => {
            return (
              <div
                css={`
                  border: 1px solid black;
                `}
              >
                <p>something happened at {data.date}</p>
                <button onClick={() => close(id)}>close this toast</button>
              </div>
            );
          },
        })
      }
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

export default function App() {
  return (
    <ToasterProvider>
      <AddToastButton />
      <Count />
      <hr />
      <Toaster />
    </ToasterProvider>
  );
}
