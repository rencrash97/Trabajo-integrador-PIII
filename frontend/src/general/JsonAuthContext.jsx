import { createContext, useContext, useState } from "react";

export const JsonAuthContext = createContext();

export const JsonAuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => {
        localStorage.getItem("ADO_token")
    });     // habria que hacer que se venza después de un tiempo, no?

    const [user, setUser] = useState(() => {
        const localUser = localStorage.getItem("ADO_user");

        return (localUser ? JSON.parse(localUser) : null);
    });

    const localLogin = (localUserData, localToken) => {
        localStorage.setItem("ADO_token", localToken);
        localStorage.setItem("ADO_user", JSON.stringify(localUserData));
        setToken(localToken);
        setUser(localUserData);
    };

    const localLogout = () => {
        localStorage.removeItem("ADO_token");
        localStorage.removeItem("ADO_user");
        setToken(null);
        setUser(null);
    };

    // Helper rápido para saber si está firmado ??????????
    const isSignedIn = !!token;

    // Helper rápido para obtener el rol directamente ??????????
    const userRole = user?.rol || null;

    return (
        <JsonAuthContext.Provider value={{ token, user, userRole, isSignedIn, localLogin, localLogout }}>
            {children}
        </JsonAuthContext.Provider>
    );
};