import React, { useEffect, useState } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const RestaurantListPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/api/restaurants/`)
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки ресторанов:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700 }}>
        Наши рестораны
      </Typography>
      <Grid container spacing={4}>
        {restaurants.map(restaurant => {
          const imageUrl = restaurant.image && restaurant.image.startsWith('http')
            ? restaurant.image
            : `${API_BASE}${restaurant.image || ''}`;

          return (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                  }
                }}
              >
                {restaurant.image ? (
                  <Box sx={{ position: 'relative', width: '100%', paddingTop: '66.67%' }}>
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt={restaurant.name}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',  
                        backgroundColor: '#f8f8f8',
                        padding: 1, 
                      }}
                    />
                  </Box>
                ) : (
                  <Box 
                    sx={{ 
                      width: '100%', 
                      paddingTop: '66.67%', 
                      backgroundColor: '#e0e0e0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                      Нет фото
                    </Typography>
                  </Box>
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ fontFamily: '"Playfair Display", serif' }}>
                    {restaurant.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {restaurant.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Адрес:</strong> {restaurant.address}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Часы работы:</strong> {restaurant.opening_time.slice(0,5)} – {restaurant.closing_time.slice(0,5)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Телефон:</strong> {restaurant.phone}
                  </Typography>
                </CardContent>
                <Button
                  component={Link}
                  to={`/restaurant/${restaurant.id}`}
                  variant="contained"
                  color="primary"
                  sx={{ m: 2, mt: 0 }}
                >
                  Выбрать столик
                </Button>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default RestaurantListPage;