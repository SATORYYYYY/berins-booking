import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import FilterBar from '../components/FilterBar';
import TableMap from '../components/TableMap';
import BookingModal from '../components/BookingModal';

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [filters, setFilters] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    capacity: null,
  });
  const [selectedTable, setSelectedTable] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/restaurants/${id}/`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error(err));
  }, [id]);

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

  if (!restaurant) return <Typography>Загрузка...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mr: 2 }}>
          Назад к ресторанам
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 300 }}>
          {restaurant.name}
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary' }}>
        {restaurant.address}
      </Typography>

      <FilterBar onFilterChange={handleFilterChange} restaurantId={id} />

      <TableMap
        filters={filters}
        onTableSelect={handleTableClick}
        restaurantId={id}  
      />

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

export default RestaurantDetailPage;