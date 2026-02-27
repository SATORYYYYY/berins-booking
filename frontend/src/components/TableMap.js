import React, { useEffect, useState, useRef } from 'react';
import { Box, Tooltip, Zoom, Typography, styled } from '@mui/material';
import axios from 'axios';

const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 600,
  backgroundColor: '#4a3f35',
  backgroundImage: 'radial-gradient(circle at 10px 10px, #5e4b3a 2px, transparent 2px), radial-gradient(circle at 30px 30px, #5e4b3a 2px, transparent 2px)',
  backgroundSize: '40px 40px',
  border: '8px solid #8b6b4d',
  borderRadius: '16px',
  boxShadow: theme.shadows[10],
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(45deg, rgba(255,215,150,0.1) 0%, rgba(210,180,140,0.05) 100%)',
    pointerEvents: 'none',
  },
}));

const CanvasOverlay = ({ tables, bookings, filters, onTableSelect, maxX, maxY }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.0005,
        speedY: (Math.random() - 0.5) * 0.0005,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    setParticles(newParticles);
  }, []);

  const isTableBooked = (tableId) => {
    if (!filters.time) return false;
    return bookings.some(booking =>
      booking.table === tableId &&
      booking.time_start <= filters.time &&
      booking.time_end > filters.time
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    tables.forEach(table => {
      const booked = isTableBooked(table.id);
      if (filters.capacity && table.capacity < filters.capacity) return;

      const x = (table.pos_x / maxX) * width * 0.9 + width * 0.05;
      const y = (table.pos_y / maxY) * height * 0.9 + height * 0.05;

      ctx.beginPath();
      ctx.arc(x, y + 5, (table.capacity <= 4 ? 30 : 40), 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.filter = 'blur(8px)';
      ctx.fill();
      ctx.filter = 'none';
    });

    tables.forEach(table => {
      const booked = isTableBooked(table.id);
      if (filters.capacity && table.capacity < filters.capacity) return;

      const x = (table.pos_x / maxX) * width * 0.9 + width * 0.05;
      const y = (table.pos_y / maxY) * height * 0.9 + height * 0.05;

      const chairCount = Math.min(table.capacity, 8);
      for (let i = 0; i < chairCount; i++) {
        const angle = (i / chairCount) * Math.PI * 2;
        const chairX = x + Math.cos(angle) * 40;
        const chairY = y + Math.sin(angle) * 40;

        ctx.beginPath();
        ctx.arc(chairX, chairY, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#8B4513';
        ctx.shadowColor = '#00000030';
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      ctx.shadowColor = '#00000050';
      ctx.shadowBlur = 10;
      if (table.capacity <= 4) {
        ctx.beginPath();
        ctx.arc(x, y, 25, 0, Math.PI * 2);
        ctx.fillStyle = booked ? '#d32f2f' : '#2e7d32';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x - 5, y - 5, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fill();
      } else {
        ctx.fillStyle = booked ? '#d32f2f' : '#2e7d32';
        ctx.fillRect(x - 35, y - 20, 70, 40);
        // Блик
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.fillRect(x - 30, y - 15, 60, 10);
      }

      ctx.shadowBlur = 0;
      ctx.font = 'bold 14px "Montserrat", sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(table.number, x, y);
    });

    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 220, 150, ${p.opacity})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffd700';
      ctx.fill();
    });

  }, [tables, bookings, filters, particles, maxX, maxY]);

  useEffect(() => {
    const animate = () => {
      setParticles(prevParticles =>
        prevParticles.map(p => {
          let newX = p.x + p.speedX;
          let newY = p.y + p.speedY;

          if (newX < 0 || newX > 1) p.speedX *= -1;
          if (newY < 0 || newY > 1) p.speedY *= -1;

          return {
            ...p,
            x: Math.max(0, Math.min(1, newX)),
            y: Math.max(0, Math.min(1, newY)),
          };
        })
      );
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    for (const table of tables) {
      if (filters.capacity && table.capacity < filters.capacity) continue;

      const x = (table.pos_x / maxX) * canvas.width * 0.9 + canvas.width * 0.05;
      const y = (table.pos_y / maxY) * canvas.height * 0.9 + canvas.height * 0.05;
      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      const threshold = table.capacity <= 4 ? 30 : 40;

      if (distance < threshold && !isTableBooked(table.id)) {
        onTableSelect(table);
        break;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      onClick={handleCanvasClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        cursor: 'pointer',
      }}
    />
  );
};

const TableMap = ({ filters, onTableSelect }) => {
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/tables/')
      .then(res => setTables(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (filters.date) {
      axios.get(`http://localhost:8000/api/bookings/?date=${filters.date}`)
        .then(res => setBookings(res.data))
        .catch(err => console.error(err));
    }
  }, [filters.date]);

  const maxX = Math.max(...tables.map(t => t.pos_x || 0), 800);
  const maxY = Math.max(...tables.map(t => t.pos_y || 0), 500);

  return (
    <MapContainer>
      <Box sx={{ position: 'absolute', top: 20, left: 20, width: 120, height: 200, background: 'linear-gradient(90deg, #c0a080 0%, #a08060 100%)', borderRadius: '8px', border: '2px solid #6b4e3a', zIndex: 1 }}>
        <Typography variant="caption" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#f0e0d0', fontWeight: 'bold' }}>Окна</Typography>
      </Box>
      
      <Box sx={{ position: 'absolute', top: 40, right: 30, width: 100, height: 150, background: '#a08060', border: '4px solid #6b4e3a', borderRadius: '4px', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: '#f5e6d3', transform: 'rotate(-90deg)' }}>Картина</Typography>
      </Box>
      
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 20, background: '#8b6b4d', zIndex: 2 }} />
      
      <Box sx={{ position: 'absolute', top: 150, left: 200, width: 30, height: 200, background: 'linear-gradient(90deg, #a08060, #6b4e3a)', borderRadius: '8px', zIndex: 2 }} />
      <Box sx={{ position: 'absolute', top: 250, right: 250, width: 30, height: 200, background: 'linear-gradient(90deg, #a08060, #6b4e3a)', borderRadius: '8px', zIndex: 2 }} />
      
      <Box sx={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', width: 400, height: 60, background: '#5d3a1a', border: '4px solid #3e2a10', borderRadius: '20px 20px 8px 8px', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" sx={{ color: '#f5e6d3', fontFamily: 'Playfair Display, serif' }}>Барная стойка</Typography>
      </Box>
      
      <Box sx={{ position: 'absolute', bottom: 100, right: 50, width: 40, height: 60, background: '#2e7d32', borderRadius: '50% 50% 0 0', border: '2px solid #1b5e20', zIndex: 2 }}>
        <Box sx={{ width: 20, height: 30, background: '#1b5e20', borderRadius: '50%', position: 'absolute', top: -20, left: 10 }} />
      </Box>

      <CanvasOverlay
        tables={tables}
        bookings={bookings}
        filters={filters}
        onTableSelect={onTableSelect}
        maxX={maxX}
        maxY={maxY}
      />
    </MapContainer>
  );
};

export default TableMap;