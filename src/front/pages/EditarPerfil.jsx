import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const EditarPerfil = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        telephone: "",
        address: "",
        personalInfo: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        oldEmail: "",
        newEmail: "",
        confirmNewEmail: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    //   const handleSave = () => {
    //     // Aquí podrías hacer una validación previa o llamada a API
    //     toast.success("¡Perfil actualizado correctamente!");
    //   };


    const handleSave = (e) => {
        e.preventDefault();
        console.log(formData);
        toast.success('Cambios guardados');

        // Ejemplo simple de validación
        // if (!formData.name || !formData.lastName) {
        //     toast.error('Por favor completa todos los campos obligatorios.');
        //     return;
        // }

        if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
            toast.error("Las contraseñas no coinciden.");
            return;
          }
          
          if (formData.newEmail && formData.newEmail !== formData.confirmNewEmail) {
            toast.error("Los emails no coinciden.");
            return;
          }

        toast.success('Perfil actualizado correctamente 🎉');
    };


    return (
        <>
            <div className="container mt-5">
                <div className="card-header fw-bold">
                    <h2 className="mb-4 text-center"><i className="fa fa-user me-2"></i> Editar Perfil</h2>
                </div>

                <div className="card shadow-sm p-5 mb-5">
                    <form>
                        <div className="card shadow-sm">
                            <div className="card-header fw-bold">
                                <i className="fa-solid fa-user"></i> Detalles de tu perfil
                            </div>
                            <div className="p-3">
                                {/* Nombre */}
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} placeholder="Ingresa tu nombre" />
                                </div>

                                {/* Apellido */}
                                <div className="mb-3">
                                    <label className="form-label">Apellido</label>
                                    <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ingresa tu apellido" />
                                </div>

                                {/* Teléfono */}
                                <div className="mb-3">
                                    <label className="form-label">Teléfono</label>
                                    <input type="tel" className="form-control" name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Ingresa tu número de teléfono" />
                                </div>

                                {/* Dirección */}
                                <div className="mb-3">
                                    <label className="form-label">Dirección</label>
                                    <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} placeholder="Ingresa tu dirección" />
                                </div>

                                {/* Información adicional */}
                                <div className="mb-3">
                                    <label className="form-label">Información adicional</label>
                                    <textarea className="form-control" rows="3" name="personalInfo" value={formData.personalInfo} onChange={handleChange} placeholder="Detalles adicionales (opcional)"></textarea>
                                </div>

                                {/* Foto de perfil */}
                                <div className="mb-3">
                                    <label className="form-label">Foto de perfil</label>
                                    <input type="file" className="form-control" />
                                </div>
                            </div>
                        </div>

                        <hr />

                        {/* Contraseña y Correo Electrónico */}
                        <div className="d-flex justify-content-center gap-3">
                            <div className="col-md-6 mb-3 card shadow-sm">
                                <div className="card-header fw-bold">
                                    <i className="fa fa-lock me-2"></i> Cambia tu contraseña
                                </div>
                                <div className="p-3">
                                    {/* Contraseña actual */}
                                    <div className="mb-3">
                                        <label className="form-label">Contraseña actual</label>
                                        <input type="password" className="form-control" name="oldPassword" value={formData.oldPassword} onChange={handleChange} placeholder="Ingresa tu contraseña actual" />
                                    </div>

                                    {/* Nueva contraseña */}
                                    <div className="mb-3">
                                        <label className="form-label">Nueva contraseña</label>
                                        <input type="password" className="form-control" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="Ingresa una nueva contraseña" />
                                    </div>

                                    {/* Confirmar nueva contraseña */}
                                    <div className="mb-3">
                                        <label className="form-label">Confirmar nueva contraseña</label>
                                        <input type="password" className="form-control" name="confirmNewPassword" value={formData.confirmNewPassword} onChange={handleChange} placeholder="Confirma tu nueva contraseña" />
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6 mb-3 card shadow-sm">
                                <div className="card-header fw-bold">
                                    <i className="fa fa-envelope me-2"></i> Cambia tu Email
                                </div>
                                <div className="p-3">
                                    {/* Correo Electrónico Actual*/}
                                    <div className="mb-3">
                                        <label className="form-label">Email actual</label>
                                        <input type="text" className="form-control" name="oldEmail" value={formData.oldEmail} onChange={handleChange} placeholder="Ingresa tu email actual" />
                                    </div>

                                    {/* Nuevo Correo Electrónico */}
                                    <div className="mb-3">
                                        <label className="form-label">Nuevo email</label>
                                        <input type="text" className="form-control" name="newEmail" value={formData.newEmail} onChange={handleChange} placeholder="Ingresa una nuevo email" />
                                    </div>

                                    {/* Confirmar nueva contraseña */}
                                    <div className="mb-3">
                                        <label className="form-label">Confirmar nuevo email</label>
                                        <input type="text" className="form-control" name="confirmNewEmail" value={formData.confirmNewEmail} onChange={handleChange} placeholder="Confirma tu nuevo email" />
                                    </div>
                                </div>
                            </div>

                        </div>

                        <button type="submit" className="btn bg-red px-4 rounded-pill" onClick={handleSave}>
                            <i className="fa fa-save me-2"></i> Guardar cambios
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
};