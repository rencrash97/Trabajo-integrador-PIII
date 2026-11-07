import "./userManagement.css";
import { useState, useEffect, useContext } from "react";
import { Container, Table, Button, Badge, Form } from "react-bootstrap";
import EditUserModal from "./EditUserModal.jsx";
import { JsonAuthContext } from "../general/authContext.js";
import { apiRequest } from "../general/api.js";
import { errorToast, successToast } from "../general/toast.js";

const UserManagement = () => {
    const { token } = useContext(JsonAuthContext);
    const [users, setUsers] = useState([]);
    const [rolFiltrado, setRolFiltrado] = useState("todos");

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchAllUsers = (token) =>
        apiRequest("/api/admin/usuarios", { token });

    const loadUsers = () => {
        if (!token) return;
        fetchAllUsers(token)
            .then((data) => setUsers(data))
            .catch((err) => errorToast(err.message || "Error al cargar los usuarios."));
    };

    useEffect(() => {
        loadUsers();
    }, [token]);


    const handleRoleChange = async (idUsuario, nuevoRol) => {
        try {
            await apiRequest(`/api/admin/usuarios/${idUsuario}/rol`, {
                method: "PATCH",
                token,
                body: { rol: nuevoRol }
            });
            successToast("Rol de usuario actualizado con éxito.");
            loadUsers();
        } catch (err) {
            errorToast(`Error al cambiar el rol: ${err.message}`);
        }
    };

    const handleToggleStatus = async (idUsuario, currentStatus) => {
        try {
            const nuevoEstado = currentStatus === 1 ? false : true;

            await apiRequest(`/api/admin/usuarios/${idUsuario}/estado`, {
                method: "PATCH",
                token,
                body: { activo: nuevoEstado }
            });

            successToast(nuevoEstado === true ? "Perfil habilitado." : "Perfil deshabilitado.");
            loadUsers();
        } catch (err) {
            errorToast(`Error al modificar el estado: ${err.message}`);
        }
    };

    const handleSaveUserData = async (formData) => {
        if (!selectedUser) return;
        try {
            await apiRequest(`/api/admin/usuarios/${selectedUser.id_usuario}`, {
                method: "PATCH",
                token,
                body: {
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    mail: formData.mail
                }
            });

            successToast("Datos de perfil actualizados correctamente.");
            setShowEditModal(false);
            setSelectedUser(null);
            loadUsers();
        } catch (err) {
            errorToast(`Error al actualizar datos: ${err.message}`);
        }
    };

    const handleOpenEditModal = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const usuariosFiltrados = users.filter((u) => {
        if (rolFiltrado === "todos") return true;
        return u.rol?.toLowerCase() === rolFiltrado.toLowerCase();
    });

    return (
        <div style={{ minHeight: "100vh" }} className="bg-light py-5">
            <Container>
                <div className="mb-4">
                    <h2 className="fw-bold text-dark mb-1">Gestión de Usuarios</h2>
                    <p className="text-muted small mb-0">Control de perfiles, permisos y rangos del sistema</p>
                </div>

                <Form.Group className="mb-4" style={{ maxWidth: "260px" }}>
                    <Form.Label className="fw-semibold small">Filtrar por rango</Form.Label>
                    <Form.Select
                        value={rolFiltrado}
                        onChange={(e) => setRolFiltrado(e.target.value)}
                    >
                        <option value="todos">Todos los rangos</option>
                        <option value="cliente">Clientes</option>
                        <option value="admin">Administradores</option>
                        <option value="super_admin">Super Admins</option>
                    </Form.Select>
                </Form.Group>

                <div className="bg-white border rounded shadow-sm p-3">
                    <Table hover responsive className="align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Correo Electrónico</th>
                                <th className="text-center">Asignar Rango (Rol)</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length > 0 ? (
                                usuariosFiltrados.map((u) => {
                                    const isActivo = Number(u.activo) === 1;
                                    const rolActual = u.rol?.toLowerCase() || "cliente";

                                    return (
                                        <tr
                                            key={u.id_usuario}
                                        >
                                            <td className="text-muted fw-semibold">#{u.id_usuario}</td>
                                            <td>
                                                <div className="fw-bold text-dark">
                                                    {u.apellido}, {u.nombre}
                                                </div>
                                            </td>
                                            <td>{u.mail}</td>
                                            <td className="text-center" style={{ maxWidth: "180px" }}>
                                                <Form.Select
                                                    size="sm"
                                                    value={rolActual}
                                                    onChange={(e) => handleRoleChange(u.id_usuario, e.target.value)}
                                                    disabled={!isActivo}
                                                >
                                                    <option value="cliente">Cliente</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="super_admin">Super Admin</option>
                                                </Form.Select>
                                            </td>
                                            <td className="text-center">
                                                <Badge bg={isActivo ? "success" : "secondary"}>
                                                    {isActivo ? "ACTIVO" : "INACTIVO"}
                                                </Badge>
                                            </td>
                                            <td className="text-center">
                                                <div className="d-flex flex-column align-items-center gap-1.5 mx-auto" style={{ maxWidth: "105px" }}>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="fw-semibold w-100 py-1"
                                                        onClick={() => handleOpenEditModal(u)}
                                                    >
                                                        Editar
                                                    </Button>
                                                    <Button
                                                        variant={isActivo ? "outline-danger" : "success"}
                                                        size="sm"
                                                        className="fw-semibold w-100 py-1"
                                                        onClick={() => handleToggleStatus(u.id_usuario, Number(u.activo))}
                                                    >
                                                        {isActivo ? "Deshabilitar" : "Habilitar"}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted py-4">
                                        No se encontraron usuarios con el rango seleccionado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </Container>

            <EditUserModal
                show={showEditModal}
                onHide={() => { setShowEditModal(false); setSelectedUser(null); }}
                onSave={handleSaveUserData}
                userToEdit={selectedUser}
            />
        </div>
    );
};

export default UserManagement;
