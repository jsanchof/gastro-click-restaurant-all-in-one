import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from '../../components/common';
import { colors, spacing } from '../../theme';

const Tables = () => {
    const [tables, setTables] = useState([]);
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        fetchTables();
    }, []);

    const fetchTables = async () => {
        try {
            const response = await fetch('/api/tables');
            const data = await response.json();
            setTables(data);
        } catch (error) {
            setAlert({
                variant: 'error',
                title: 'Error',
                message: 'No se pudieron cargar las mesas'
            });
        }
    };

    const handleTableStatusChange = async (tableId, newStatus) => {
        try {
            const response = await fetch(`/api/tables/${tableId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus
                }),
            });

            if (!response.ok) throw new Error('Error al actualizar la mesa');

            setAlert({
                variant: 'success',
                title: 'Éxito',
                message: 'Estado de la mesa actualizado'
            });
            fetchTables();
        } catch (error) {
            setAlert({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo actualizar el estado de la mesa'
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'LIBRE':
                return colors.status.success;
            case 'OCUPADA':
                return colors.status.warning;
            case 'RESERVADA':
                return colors.status.info;
            default:
                return colors.neutral.gray;
        }
    };

    const tableStyles = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: spacing.lg,
        padding: spacing.md,
    };

    const tableCardStyles = {
        padding: spacing.lg,
        textAlign: 'center',
        border: `2px solid ${colors.neutral.lightGray}`,
        borderRadius: '8px',
        transition: 'all 0.3s ease',
    };

    return (
        <Container maxWidth="xl">
            {alert && (
                <Alert
                    variant={alert.variant}
                    title={alert.title}
                    message={alert.message}
                    onClose={() => setAlert(null)}
                />
            )}

            <Card>
                <h2>Mesas del Restaurante</h2>
                <div style={tableStyles}>
                    {tables.map((table) => (
                        <div
                            key={table.id}
                            style={{
                                ...tableCardStyles,
                                borderColor: getStatusColor(table.status),
                            }}
                        >
                            <h3>Mesa {table.number}</h3>
                            <p>Capacidad: {table.capacity} personas</p>
                            <p style={{ color: getStatusColor(table.status) }}>
                                {table.status}
                            </p>
                            <div style={{ display: 'flex', gap: spacing.sm, justifyContent: 'center' }}>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => handleTableStatusChange(table.id, 'LIBRE')}
                                    disabled={table.status === 'LIBRE'}
                                >
                                    Liberar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => handleTableStatusChange(table.id, 'OCUPADA')}
                                    disabled={table.status === 'OCUPADA'}
                                >
                                    Ocupar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </Container>
    );
};

export default Tables; 