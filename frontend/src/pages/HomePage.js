import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import FilterBar from '../components/FilterBar';
import TableMap from '../components/TableMap';
import BookingModal from '../components/BookingModal';

const HomePage = () => {
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    capacity: null,
  });
  const [selectedTable, setSelectedTable] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setFilters({ ...filters });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 300, color: 'primary.main' }}>
        Бронирование столиков
      </Typography>
      <FilterBar onFilterChange={handleFilterChange} />
      <TableMap filters={filters} onTableSelect={handleTableClick} />
      {selectedTable && (
        <BookingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedTable={selectedTable}
          onSuccess={handleBookingSuccess}
        />
      )}
    </Container>
  );
};

export default HomePage;