import { createContext, useState } from "react";

export const JsonAuthContext = createContext();

export const JsonAuthProvider = ({ children }) => {

    const [token, setToken] = useState(() => {
        return localStorage.getItem("ADO_token");
    });     // habria que hacer que se venza después de un tiempo, no?

    const [user, setUser] = useState(() => {
        const localUser = localStorage.getItem("ADO_user");

        return (localUser ? JSON.parse(localUser) : null);
    });

    const localLogin = (localUserData, localToken) => {
        localStorage.setItem("ADO_token", localToken);
        localStorage.setItem("ADO_user", JSON.stringify(localUserData));
        console.log(localUserData)
        setToken(localToken);
        setUser(localUserData);
    };

    const localLogout = () => {
        localStorage.removeItem("ADO_token");
        localStorage.removeItem("ADO_user");
        setToken(null);
        setUser(null);
    };

    const isSignedIn = !!token; //para verificar logueo


    const userRole = user?.rol || null; // devuelve rol

    return (
        <JsonAuthContext.Provider value={{ token, user, userRole, isSignedIn, localLogin, localLogout }}>
            {children}
        </JsonAuthContext.Provider>
    );
};