import React, { useState } from "react"

function BookingForm({ onClose, onSave, reservaToEdit = null }) {
    const [formData, setFormData] = useState({
        guest_name: reservaToEdit ? reservaToEdit.guest_name : "",
        guest_phone: reservaToEdit ? reservaToEdit.guest_phone : "",
        email: reservaToEdit ? reservaToEdit.email : "",
        quantity: reservaToEdit ? reservaToEdit.quantity : 1,
        start_date_time: reservaToEdit ? reservaToEdit.start_date_time : "",
        additional_details: reservaToEdit ? reservaToEdit.additional_details : "",
        status: reservaToEdit ? reservaToEdit.status : "PENDIENTE",
    })

    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.guest_name.trim()) newErrors.guest_name = "El nombre es requerido"
        if (!formData.guest_phone.trim()) newErrors.guest_phone = "El teléfono es requerido"
        if (!formData.quantity) newErrors.quantity = "Cantidad de personas requerida"
        if (!formData.start_date_time) newErrors.start_date_time = "Fecha de reserva requerida"
        if (!formData.status) newErrors.status = "El estado es requerido"
        if (!formData.email.trim()) newErrors.email = "El correo electrónico es requerido"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "El correo electrónico no es válido"
        return newErrors
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     const newErrors = validate()

    //     if (Object.keys(newErrors).length === 0) {
    //         onSave(formData)
    //         onClose()
    //     } else {
    //         setErrors(newErrors)
    //     }
    // }

    const handleSubmit = async e => {
        e.preventDefault();
        const validationErrors = validate()
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return;
        }

        // Definimos URL y método dependiendo si es edición o creación
        const url = reservaToEdit
            ? `${import.meta.env.VITE_BACKEND_URL}/api/reservations/${reservaToEdit.id}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/reservations`;

        const method = reservaToEdit ? 'PUT' : 'POST';

        const formCopy = { ...formData };
        formCopy.start_date_time = new Date(formData.start_date_time).toISOString().slice(0, 19).replace('T', ' ');

        console.log("Enviando datos:", formCopy);

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formCopy)
            });

            const result = await res.json();

            if (!res.ok) throw new Error("Error al guardar la reserva");

            // onSave();  // Para actualizar la lista en AdminReservas
            // onClose(); // Para cerrar el modal

            alert('¡Reserva enviada con éxito!');
            // if (res.ok) {
            //     alert('¡Reserva enviada con éxito!');
            setFormData({
                guest_name: '',
                guest_phone: '',
                email: '',
                quantity: 1,
                start_date_time: '',
                additional_details: '',
                status: ''
            });

            onSave(formCopy) // por si quieres actualizar lista de reservas en padre
            onClose()        // cerrar modal solo después de éxito

            // } else {
            //     alert(result.error || 'Error al enviar la reserva');
            // }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{reservaToEdit ? "Editar Reserva" : "Reservar una Mesa"}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">
                                <label htmlFor="guest_name" className="form-label">
                                    Nombre del Invitado
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.guest_name ? "is-invalid" : ""}`}
                                    id="guest_name"
                                    name="guest_name"
                                    value={formData.guest_name}
                                    onChange={handleChange}
                                />
                                {errors.guest_name && <div className="invalid-feedback">{errors.guest_name}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            {/* {!reservaToEdit && (
                                <> */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    className={`form-control ${errors.guest_phone ? "is-invalid" : ""}`}
                                    id="guest_phone"
                                    name="guest_phone"
                                    value={formData.guest_phone}
                                    onChange={handleChange}
                                />
                                {errors.guest_phone && <div className="invalid-feedback">{errors.guest_phone}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Cantidad Personas
                                </label>
                                <input
                                    type="number"
                                    className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
                                    id="quantity"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                                {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    Fecha de Reserva
                                </label>
                                <input
                                    type="datetime-local"
                                    className={`form-control ${errors.start_date_time ? "is-invalid" : ""}`}
                                    name="start_date_time"
                                    value={formData.start_date_time}
                                    onChange={handleChange}
                                />
                                {errors.start_date_time && <div className="invalid-feedback">{errors.start_date_time}</div>}
                            </div>



                            <div className="mb-3">
                                <label htmlFor="reserva" className="form-label">
                                    Detalles Adicionales
                                </label>
                                <textarea
                                    className="form-control"
                                    name="additional_details"
                                    id="additional_details"
                                    value={formData.additional_details}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            {/* </>
                            )} */}

                            <div className="mb-3">
                                <label htmlFor="" className="form-label">
                                    Estado
                                </label>
                                <select
                                    className="form-select"
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="PENDIENTE">Pendiente</option>
                                    <option value="CONFIRMADA">Confirmada</option>
                                    <option value="CANCELADA">Cancelada</option>
                                    <option value="COMPLETADA">Completada</option>
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={onClose}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {reservaToEdit ? "Actualizar" : "Crear Reserva"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BookingForm
