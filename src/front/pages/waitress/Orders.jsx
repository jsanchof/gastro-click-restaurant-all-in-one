import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Modal, Input, Alert } from '../../components/common';
import { colors } from '../../theme';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [alert, setAlert] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [availableTables, setAvailableTables] = useState([]);
    const [menu, setMenu] = useState({ dishes: [], drinks: [] });

    useEffect(() => {
        fetchOrders();
        fetchTables();
        fetchMenu();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data.items);
        } catch (error) {
            setAlert({
                variant: 'error',
                title: 'Error',
                message: 'No se pudieron cargar las órdenes'
            });
        }
    };

    const fetchTables = async () => {
        try {
            const response = await fetch('/api/tables');
            const data = await response.json();
            setAvailableTables(data);
        } catch (error) {
            setAlert({
                variant: 'error',
                title: 'Error',
                message: 'No se pudieron cargar las mesas'
            });
        }
    };

    const fetchMenu = async () => {
        try {
            const response = await fetch('/api/productos');
            const data = await response.json();
            setMenu(data);
        } catch (error) {
            setAlert({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo cargar el menú'
            });
        }
    };

    const handleCreateOrder = async () => {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    table_id: selectedTable,
                    dishes: orderItems.filter(item => item.type === 'dish'),
                    drinks: orderItems.filter(item => item.type === 'drink'),
                }),
            });

            if (!response.ok) throw new Error('Error al crear la orden');

            setAlert({
                variant: 'success',
                title: 'Éxito',
                message: 'Orden creada correctamente'
            });
            setIsNewOrderModalOpen(false);
            fetchOrders();
        } catch (error) {
            setAlert({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo crear la orden'
            });
        }
    };

    const handleMarkAsPaid = async (orderId) => {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'PAGADA'
                }),
            });

            if (!response.ok) throw new Error('Error al actualizar la orden');

            setAlert({
                variant: 'success',
                title: 'Éxito',
                message: 'Orden marcada como pagada'
            });
            fetchOrders();
        } catch (error) {
            setAlert({
                variant: 'error',
                title: 'Error',
                message: 'No se pudo actualizar la orden'
            });
        }
    };

    const columns = [
        { id: 'id', label: 'Orden #' },
        { id: 'table', label: 'Mesa', render: (row) => `Mesa ${row.table_id}` },
        { id: 'items', label: 'Items', render: (row) => row.details.length },
        { id: 'total', label: 'Total', render: (row) => `$${row.total.toFixed(2)}` },
        { id: 'status', label: 'Estado' },
        {
            id: 'actions',
            label: 'Acciones',
            render: (row) => (
                <Button
                    variant="primary"
                    size="small"
                    onClick={() => handleMarkAsPaid(row.id)}
                    disabled={row.status === 'PAGADA'}
                >
                    Marcar como pagada
                </Button>
            ),
        },
    ];

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2>Órdenes</h2>
                    <Button
                        variant="primary"
                        onClick={() => setIsNewOrderModalOpen(true)}
                    >
                        Nueva Orden
                    </Button>
                </div>

                <Table
                    columns={columns}
                    data={orders}
                    striped
                    hoverable
                />
            </Card>

            <Modal
                isOpen={isNewOrderModalOpen}
                onClose={() => setIsNewOrderModalOpen(false)}
                title="Nueva Orden"
                size="large"
            >
                <div>
                    <Input
                        label="Mesa"
                        type="select"
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        fullWidth
                    >
                        <option value="">Seleccionar mesa</option>
                        {availableTables.map((table) => (
                            <option key={table.id} value={table.id}>
                                Mesa {table.number}
                            </option>
                        ))}
                    </Input>

                    <div style={{ marginTop: '1rem' }}>
                        <h4>Platos</h4>
                        {menu.dishes.map((dish) => (
                            <div key={dish.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span>{dish.name} - ${dish.price}</span>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => setOrderItems([...orderItems, { ...dish, type: 'dish' }])}
                                    style={{ marginLeft: '1rem' }}
                                >
                                    Agregar
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <h4>Bebidas</h4>
                        {menu.drinks.map((drink) => (
                            <div key={drink.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span>{drink.name} - ${drink.price}</span>
                                <Button
                                    variant="outline"
                                    size="small"
                                    onClick={() => setOrderItems([...orderItems, { ...drink, type: 'drink' }])}
                                    style={{ marginLeft: '1rem' }}
                                >
                                    Agregar
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem' }}>
                        <h4>Items Seleccionados</h4>
                        {orderItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span>{item.name} - ${item.price}</span>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => setOrderItems(orderItems.filter((_, i) => i !== index))}
                                    style={{ marginLeft: '1rem', color: colors.status.error }}
                                >
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button
                            variant="outline"
                            onClick={() => setIsNewOrderModalOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleCreateOrder}
                            disabled={!selectedTable || orderItems.length === 0}
                        >
                            Crear Orden
                        </Button>
                    </div>
                </div>
            </Modal>
        </Container>
    );
};

export default Orders; 