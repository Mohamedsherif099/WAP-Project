import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Container component="main" sx={{ flexGrow: 1 }}>
                {children}
            </Container>
        </Box>
    );
} 