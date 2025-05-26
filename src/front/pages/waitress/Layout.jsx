import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Container } from '../../components/common';
import { colors, typography, spacing } from '../../theme';

const Layout = () => {
    const location = useLocation();

    const navStyles = {
        backgroundColor: colors.primary.main,
        padding: `${spacing.md} 0`,
        marginBottom: spacing.xl,
    };

    const navContainerStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    };

    const linkStyles = {
        color: colors.neutral.white,
        textDecoration: 'none',
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.medium,
        padding: spacing.sm,
        borderRadius: '4px',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: colors.primary.dark,
        },
    };

    const activeLinkStyles = {
        ...linkStyles,
        backgroundColor: colors.primary.dark,
    };

    return (
        <div>
            <nav style={navStyles}>
                <Container>
                    <div style={navContainerStyles}>
                        <div>
                            <Link
                                to="/waitress/orders"
                                style={location.pathname === '/waitress/orders' ? activeLinkStyles : linkStyles}
                            >
                                Órdenes
                            </Link>
                            <Link
                                to="/waitress/tables"
                                style={location.pathname === '/waitress/tables' ? activeLinkStyles : linkStyles}
                            >
                                Mesas
                            </Link>
                        </div>
                        <div>
                            <span style={{ color: colors.neutral.white }}>
                                Modo Mesero
                            </span>
                        </div>
                    </div>
                </Container>
            </nav>
            <Outlet />
        </div>
    );
};

export default Layout; 