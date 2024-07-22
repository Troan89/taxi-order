import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
    message: string;
}

export const OrderModal = ({ isOpen, onRequestClose, message }:Props) => {
    return (
        <Dialog open={isOpen} onClose={onRequestClose}>
            <DialogTitle>Статус заказа</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onRequestClose} color="primary">
                    Закрыть
                </Button>
            </DialogActions>
        </Dialog>
    );
};
