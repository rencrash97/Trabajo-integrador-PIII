const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export const SESSION_EXPIRED_MESSAGE_KEY = "ADO_session_expired_message";

export async function apiRequest(path, options = {}) {
    const { method = "GET", body, token } = options;
    const headers = {};

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data = await response.json().catch(() => null);

    if (response.status === 401 && token) {
        localStorage.removeItem("ADO_token");
        localStorage.removeItem("ADO_user");
        sessionStorage.setItem(
            SESSION_EXPIRED_MESSAGE_KEY,
            "Tu sesión expiró. Volvé a iniciar sesión.",
        );
        window.location.replace("/login");

        throw new Error("Tu sesión expiró. Volvé a iniciar sesión.");
    }

    if (!response.ok) {
        throw new Error(data?.error || data?.message || "No se pudo completar la solicitud.");
    }

    return data;
}
