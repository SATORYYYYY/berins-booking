import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

const TableGrid = ({ selectedDate, selectedTime }) => {
    const [tables, setTables] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/tables/')
            .then(res => setTables(res.data));
        if (selectedDate) {
            axios.get(`http://localhost:8000/api/bookings/?date=${selectedDate}`)
                .then(res => setBookings(res.data));
        }
    }, [selectedDate, selectedTime]);

    const isTableBooked = (tableId) => {
        return bookings.some(booking => 
            booking.table === tableId &&
            booking.time_start <= selectedTime && 
            booking.time_end > selectedTime
        );
    };

    return (
        <Grid container spacing={2}>
            {tables.map(table => (
                <Grid item xs={12} sm={6} md={4} key={table.id}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 2, 
                            backgroundColor: isTableBooked(table.id) ? '#f44336' : '#4caf50',
                            color: 'white',
                            textAlign: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Typography variant="h6">Столик №{table.number}</Typography>
                        <Typography>Вместимость: {table.capacity} чел.</Typography>
                        {isTableBooked(table.id) ? 
                            <Typography>Занят</Typography> : 
                            <Typography>Свободен</Typography>
                        }
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default TableGrid;