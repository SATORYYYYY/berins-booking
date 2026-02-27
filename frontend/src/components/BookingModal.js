import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ruLocale from 'date-fns/locale/ru';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const BookingModal = ({ open, onClose, selectedTable, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formData, setFormData] = useState({
    table: selectedTable?.id || '',
    date: new Date(),
    time_start: new Date(),
    time_end: new Date(new Date().setHours(new Date().getHours() + 2)), 
    customer_name: '',
    customer_phone: '',
    customer_email: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        table: selectedTable.id,
        date: formData.date.toISOString().split('T')[0],
        time_start: formData.time_start.toTimeString().slice(0, 5),
        time_end: formData.time_end.toTimeString().slice(0, 5),
      };
      await axios.post('http://localhost:8000/api/bookings/', payload);
      enqueueSnackbar('Столик успешно забронирован!', { variant: 'success' });
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        enqueueSnackbar('Ошибка при бронировании', { variant: 'error' });
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Бронирование столика №{selectedTable?.number}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <DatePicker
                label="Дата"
                value={formData.date}
                onChange={(newDate) => handleChange('date', newDate)}
                renderInput={(params) => <TextField {...params} fullWidth error={!!errors.date} helperText={errors.date} />}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Начало"
                value={formData.time_start}
                onChange={(newTime) => handleChange('time_start', newTime)}
                renderInput={(params) => <TextField {...params} fullWidth error={!!errors.time_start} helperText={errors.time_start} />}
              />
            </Grid>
            <Grid item xs={6}>
              <TimePicker
                label="Конец"
                value={formData.time_end}
                onChange={(newTime) => handleChange('time_end', newTime)}
                renderInput={(params) => <TextField {...params} fullWidth error={!!errors.time_end} helperText={errors.time_end} />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ваше имя"
                value={formData.customer_name}
                onChange={(e) => handleChange('customer_name', e.target.value)}
                fullWidth
                error={!!errors.customer_name}
                helperText={errors.customer_name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Телефон"
                value={formData.customer_phone}
                onChange={(e) => handleChange('customer_phone', e.target.value)}
                fullWidth
                error={!!errors.customer_phone}
                helperText={errors.customer_phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                value={formData.customer_email}
                onChange={(e) => handleChange('customer_email', e.target.value)}
                fullWidth
                error={!!errors.customer_email}
                helperText={errors.customer_email}
              />
            </Grid>
            {errors.non_field_errors && (
              <Grid item xs={12}>
                <Alert severity="error">{errors.non_field_errors[0]}</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Забронировать
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default BookingModal;