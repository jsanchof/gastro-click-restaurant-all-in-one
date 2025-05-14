import React, { useState } from 'react';
import { showError, showSuccess } from '../utils/toastUtils';

export const Reservas = () => {
    const [form, setForm] = useState({
        guest_name: '',
        guest_phone: '',
        email: '',
        quantity: 1,
        start_date_time: '',
        additional_details: ''
    });

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();

        const formCopy = { ...form };
        formCopy.start_date_time = new Date(form.start_date_time).toISOString().slice(0, 19).replace('T', ' ');

        try {
            const res = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formCopy)
            });

            const result = await res.json();

            if (res.ok) {
                showSuccess('¡Reserva enviada con éxito!');
                setForm({
                    guest_name: '',
                    guest_phone: '',
                    email: '',
                    quantity: 1,
                    start_date_time: '',
                    additional_details: ''
                });
            } else {
                showError(result.error || 'Error al enviar la reserva');
            }
        } catch (error) {
            console.error(error);
            showError('Error al conectar con el servidor');
        }
    };

    return (
        <div className="container mt-4">
            <form className="p-4 border rounded shadow" onSubmit={handleSubmit}>
                <h4 className="mb-3">Reservar una Mesa</h4>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={form.guest_name} name="guest_name" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" value={form.guest_phone} name="guest_phone" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico</label>
                    <input type="email" className="form-control" value={form.email} name="email" onChange={handleChange} required/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Cantidad de personas</label>
                    <input type="number" className="form-control" value={form.quantity} name="quantity" min="1" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha y hora</label>
                    <input type="datetime-local" className="form-control" value={form.start_date_time} name="start_date_time" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Detalles adicionales</label>
                    <textarea className="form-control" value={form.additional_details} name="additional_details" onChange={handleChange} />
                </div>
                <button type="submit" className="btn bg-red">Reservar</button>
            </form>
        </div>
    );
};
