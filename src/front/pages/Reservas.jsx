import React, { useState } from 'react';

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
                body: JSON.stringify(form)
            });

            const result = await res.json();

            if (res.ok) {
                alert('¡Reserva enviada con éxito!');
            } else {
                alert(result.error || 'Error al enviar la reserva');
            }
        } catch (error) {
            console.error(error);
            alert('Error al conectar con el servidor');
        }
    };

    return (
        <div className="container mt-4">
            <form className="p-4 border rounded shadow" onSubmit={handleSubmit}>
                <h4 className="mb-3">Reservar una Mesa</h4>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" name="guest_name" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" className="form-control" name="guest_phone" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo electrónico (opcional)</label>
                    <input type="email" className="form-control" name="email" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Cantidad de personas</label>
                    <input type="number" className="form-control" name="quantity" min="1" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Fecha y hora</label>
                    <input type="datetime-local" className="form-control" name="start_date_time" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Detalles adicionales</label>
                    <textarea className="form-control" name="additional_details" onChange={handleChange} />
                </div>
                <button type="submit" className="btn bg-red">Reservar</button>
            </form>
        </div>
    );
};
