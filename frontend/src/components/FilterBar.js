import React, { useState } from 'react';
import { Paper, Grid, TextField, MenuItem, Button } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import ruLocale from 'date-fns/locale/ru';

const FilterBar = ({ onFilterChange }) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [capacity, setCapacity] = useState('');

  const handleApply = () => {
    onFilterChange({
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().slice(0, 5),
      capacity: capacity ? parseInt(capacity) : null,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ruLocale}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <DatePicker
              label="Дата"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TimePicker
              label="Время"
              value={time}
              onChange={(newTime) => setTime(newTime)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              label="Вместимость"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Любая</MenuItem>
              <MenuItem value="2">2 человека</MenuItem>
              <MenuItem value="4">4 человека</MenuItem>
              <MenuItem value="6">6 человек</MenuItem>
              <MenuItem value="8">8+ человек</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleApply}
            >
              Показать столики
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </LocalizationProvider>
  );
};

export default FilterBar;