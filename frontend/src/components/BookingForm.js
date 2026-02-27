import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem } from '@mui/material';
import axios from 'axios';

const BookingForm = ({ tables, onBookingSuccess }) => {
    const [formData, setFormData] = useState({
        table: '',
        date: '',
        time_start: '',
        time_end: '',
        customer_name: '',
        customer_phone: '',
        customer_email: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/bookings/', formData)
            .then(res => {
                alert('Бронь успешно создана!');
                onBookingSuccess();
            })
            .catch(err => {
                alert('Ошибка: ' + err.response.data.non_field_errors[0]);
            });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
                select
                name="table"
                label="Столик"
                value={formData.table}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            >
                {tables.map(table => (
                    <MenuItem key={table.id} value={table.id}>
                        Столик №{table.number} ({table.capacity} чел.)
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                name="date"
                label="Дата"
                type="date"
                value={formData.date}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                name="time_start"
                label="Время начала"
                type="time"
                value={formData.time_start}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                name="time_end"
                label="Время окончания"
                type="time"
                value={formData.time_end}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                name="customer_name"
                label="Ваше имя"
                value={formData.customer_name}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                name="customer_phone"
                label="Телефон"
                value={formData.customer_phone}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            />
            <TextField
                name="customer_email"
                label="Email"
                type="email"
                value={formData.customer_email}
                onChange={handleChange}
                fullWidth
                required
                margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Забронировать
            </Button>
        </Box>
    );
};

export default BookingForm;