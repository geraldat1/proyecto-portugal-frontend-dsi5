import React, { useEffect, useState } from 'react';
import { FiSearch, FiUsers, FiUserCheck, FiClipboard, FiFileText } from 'react-icons/fi';
import { obtenerClientes } from '../services/clienteService';
import { obtenerEntrenadores } from '../services/entrenadorService';
import { obtenerRutinas } from '../services/rutinaService';
import { obtenerPlanes } from '../services/planService';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clientes, setClientes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const todosClientes = await obtenerClientes();
      setClientes(todosClientes.filter(c => c.estado === 1));

      const todosEntrenadores = await obtenerEntrenadores();
      setEntrenadores(todosEntrenadores.filter(e => e.estado === 1));

      const todasRutinas = await obtenerRutinas();
      setRutinas(todasRutinas.filter(r => r.estado === 1));

      const todosPlanes = await obtenerPlanes();
      setPlanes(todosPlanes.filter(p => p.estado === 1));
    };

    fetchData();
  }, []);

  return (
    <div style={{
      padding: '2rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
        {/* Cards Grid - 2x2 layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          width: '100%',
          marginBottom: '2rem'
        }}>
          <Card
            icon={<FiUsers style={{ color: '#fff', fontSize: '1.8rem' }} />}
            title="Total Clientes"
            value={clientes.length}
            gradient="linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)" // Azul vibrante
            shadowColor="rgba(67, 97, 238, 0.4)"
          />
          <Card
            icon={<FiUserCheck style={{ color: '#fff', fontSize: '1.8rem' }} />}
            title="Entrenadores"
            value={entrenadores.length}
            gradient="linear-gradient(135deg, #7209b7 0%, #560bad 100%)" // Púrpura
            shadowColor="rgba(114, 9, 183, 0.4)"
          />
          <Card
            icon={<FiClipboard style={{ color: '#fff', fontSize: '1.8rem' }} />}
            title="Rutinas Activas"
            value={rutinas.length}
            gradient="linear-gradient(135deg, #f72585 0%, #b5179e 100%)" // Rosa magenta
            shadowColor="rgba(247, 37, 133, 0.4)"
          />
          <Card
            icon={<FiFileText style={{ color: '#fff', fontSize: '1.8rem' }} />}
            title="Planes Disponibles"
            value={planes.length}
             gradient="linear-gradient(135deg, #4cc9f0 0%, #4895ef 100%)" // Azul claro
            shadowColor="rgba(76, 201, 240, 0.4)"
          />
        </div>

        {/* Search Bar Below Cards */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '350px',
          marginBottom: '2rem'
        }}>
          <FiSearch style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#7f8c8d',
            fontSize: '1.1rem'
          }} />
          <input
            type="text"
            placeholder="Buscar en el sistema..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              padding: '12px 16px 12px 45px',
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              fontSize: '0.95rem',
              backgroundColor: '#fafafa',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 2px 12px rgba(255, 165, 0, 0.15)';
              e.target.style.borderColor = '#FFA500';
              e.target.style.backgroundColor = '#fff';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              e.target.style.borderColor = '#e0e0e0';
              e.target.style.backgroundColor = '#fafafa';
            }}
          />
        </div>

        {/* Additional content space */}
        <div style={{
          flex: 1,
          backgroundColor: '#f9f9f9',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          {/* Puedes añadir contenido adicional aquí */}
        </div>
      </div>
    </div>
  );
};

const Card = ({ icon, title, value, gradient, shadowColor }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '12px',
        background: gradient,
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        boxSizing: 'border-box',
        boxShadow: isHovered
          ? `0 12px 30px ${shadowColor}, 0 4px 12px rgba(0,0,0,0.07)`
          : `0 6px 20px ${shadowColor}`,
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Decorative background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        right: '-20%',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        transform: isHovered ? 'scale(1.5)' : 'scale(1)',
        transition: 'transform 0.4s ease'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '-10%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)',
        transform: isHovered ? 'scale(1.3)' : 'scale(1)',
        transition: 'transform 0.4s ease'
      }} />

      {/* Icon container */}
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '16px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        transform: isHovered ? 'rotate(5deg) scale(1.1)' : 'rotate(0deg) scale(1)',
        transition: 'transform 0.3s ease'
      }}>
        {icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: '1rem',
          marginBottom: '6px',
          color: 'rgba(255,255,255,0.9)',
          fontWeight: '600',
          letterSpacing: '0.3px'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '2rem',
          margin: 0,
          fontWeight: '700',
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          lineHeight: 1
        }}>
          {value}
        </p>
        <div style={{
          width: '36px',
          height: '3px',
          backgroundColor: 'rgba(255,255,255,0.6)',
          borderRadius: '2px',
          marginTop: '10px',
          transform: isHovered ? 'scaleX(1.5)' : 'scaleX(1)',
          transition: 'transform 0.3s ease'
        }} />
      </div>
    </div>
  );
};

export default Home;
