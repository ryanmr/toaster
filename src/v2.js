import React from "react";
import { v4 as uuid } from "uuid";

const ToasterContext = React.createContext();

export function ToasterProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);

  const value = {
    toasts,
    setToasts,
  };

  return (
    <ToasterContext.Provider value={value}>{children}</ToasterContext.Provider>
  );
}

export function useCreateToast() {
  const toastContext = React.useContext(ToasterContext);

  const { setToasts } = toastContext;
  const id = uuid();

  return function (options) {
    setToasts((t) => [...t, { ...options, id }]);
  };
}

export function useClearToast() {
  const { setToasts } = React.useContext(ToasterContext);

  return function (removeId) {
    setToasts((t) => t.filter(({ id }) => id !== removeId));
  };
}

export function useToasts() {
  const { toasts } = React.useContext(ToasterContext);
  return toasts;
}

// const ToastContext = React.createContext();

export function Toaster({ container = null, children }) {
  const { toasts } = React.useContext(ToasterContext);
  const close = useClearToast();

  if (!toasts || toasts.length === 0) {
    return null;
  }

  const Container = container ? container : React.Fragment;

  return (
    <>
      {[...toasts].reverse().map(({ component: Component, id, ...other }) => {
        const props = { id, close, ...other };
        return (
          <Container key={id}>
            {/* <ToastContext.Provider value={other}> */}
            <Component {...props} />
            {/* </ToastContext.Provider> */}
          </Container>
        );
      })}
    </>
  );
}
