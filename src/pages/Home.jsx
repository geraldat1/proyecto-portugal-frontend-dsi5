import React, { useEffect, useState } from 'react';
import { FiUsers, FiUserCheck, FiClipboard, FiFileText, FiDollarSign, FiAward } from 'react-icons/fi';
import { obtenerClientes } from '../services/clienteService';
import { obtenerEntrenadores } from '../services/entrenadorService';
import { obtenerAsistencias } from '../services/asistenciaService';
import { obtenerPlanes } from '../services/planService';
import { obtenerPagoplanes } from '../services/pagosplanesService'; 
import { obtenerDetalleplanes } from '../services/detalleplanesService';


const Home = () => {
  const [clientes, setClientes] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [totalPagosHoy, setTotalPagosHoy] = useState(0);
  const [planesMasComprados, setPlanesMasComprados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const todosClientes = await obtenerClientes();
      setClientes(todosClientes.filter(c => c.estado === 1));

      const todosEntrenadores = await obtenerEntrenadores();
      setEntrenadores(todosEntrenadores.filter(e => e.estado === 1));

      const todasAsistencias = await obtenerAsistencias();
      const obtenerFechaPeru = () => {
        const fechaUtc = new Date();
        const fechaPeru = new Date(fechaUtc.getTime() - 5 * 60 * 60 * 1000);
        return fechaPeru.toISOString().split('T')[0];
      };

      const formatoFecha = obtenerFechaPeru();

      setAsistencias(
        todasAsistencias.filter(a => 
          (a.estado === 0 || a.estado === 1) &&
          a.fecha &&
          a.fecha.startsWith(formatoFecha)
        )
      );

      const todosPlanes = await obtenerPlanes();
      setPlanes(todosPlanes.filter(p => p.estado === 1));

      const todosPagos = await obtenerPagoplanes();
      const pagosHoy = todosPagos.filter(p => 
        p.fecha && p.fecha.startsWith(formatoFecha)
      );
      
      const sumaPagos = pagosHoy.reduce((total, pago) => total + (parseFloat(pago.precio) || 0), 0);
      setTotalPagosHoy(sumaPagos);

      const detallesPlanes = await obtenerDetalleplanes();
      


const conteoPlanes = {};
detallesPlanes.forEach(detalle => {
  // Solo procesar si el estado es 2
  if (detalle.estado === 2) {
    const idPlan = detalle.id_plan;
    if (idPlan) {
      if (!conteoPlanes[idPlan]) {
        const planCorrespondiente = todosPlanes.find(p => p.id === idPlan);
        
        conteoPlanes[idPlan] = {
          count: 0,
          nombre: planCorrespondiente?.plan || 'Plan Desconocido',
          precio: planCorrespondiente?.precio_plan || 0
        };
      }
      conteoPlanes[idPlan].count += 1;
    }
  }
});

// Convertir a array y ordenar
const planesPopulares = Object.keys(conteoPlanes).map(id => ({
  id,
  nombre: conteoPlanes[id].nombre,
  cantidad: conteoPlanes[id].count,
  precio: parseFloat(conteoPlanes[id].precio).toFixed(2) // Asegura formato de 2 decimales
})).sort((a, b) => b.cantidad - a.cantidad);

setPlanesMasComprados(planesPopulares.slice(0, 3));
    };

    fetchData();
  }, []);


  // Meta diaria para el gráfico (puedes ajustar este valor)
  const metaDiaria = 3000;

  return (
    <div style={{
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      width: '100%',
      minHeight: '100vh',
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
          gap: '1rem',
          width: '100%',
          marginBottom: '1rem'
        }}>
          <Card
            icon={<FiUsers />}
            title="Total Clientes"
            value={clientes.length}
            backgroundColor="#111111"
            textColor="#FFD700"
            accentColor="#FFD700"
          />
          <Card
            icon={<FiUserCheck />}
            title="Entrenadores"
            value={entrenadores.length}
            backgroundColor="#FFD700"
            textColor="#111111"
            accentColor="#111111"
          />
          <Card
            icon={<FiClipboard />}
            title="Asistencias de Hoy"
            value={asistencias.length}
            backgroundColor="#ffffff"
            textColor="#111111"
            accentColor="#FFD700"
            borderColor="#FFD700"
          />
          <Card
            icon={<FiFileText />}
            title="Planes Disponibles"
            value={planes.length}
            backgroundColor="#111111"
            textColor="#ffffff"
            accentColor="#FFD700"
          />
        </div>

        {/* Sección de estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {/* Gráfico de planes populares */}
           <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px', // Más pequeño
            padding: '1rem', // Menos padding
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Sombra más sutil
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '1rem',
              marginBottom: '1rem',
              color: '#111111',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FiAward style={{ color: '#FFD700' }} /> Planes más comprados
            </h3>
            
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'conic-gradient(#FFD700 0% 33%, #111111 33% 66%, #FF6B6B 66% 100%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              marginBottom: '1rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111111' }}>
                  Top 3
                </span>
                <span style={{ fontSize: '1rem', color: '#666666' }}>
                  Más populares
                </span>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem',
              width: '100%'
            }}>
              {planesMasComprados.map((plan, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0.3rem 0.5rem',
                  backgroundColor: index === 0 ? '#FFF8E1' : '#f9f9f9',
                  borderRadius: '6px'
                }}>
                  <div>
                    <div style={{ fontWeight: '500' }}>{plan.nombre}</div>
                    <div style={{ fontSize: '0.7rem', color: '#666' }}>S/. {plan.precio}</div>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#85c1e9' }}>{plan.cantidad} compras</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gráfico de Ingresos de Hoy - Versión mejorada */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '1rem',
              marginBottom: '1rem',
              color: '#111111',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FiDollarSign style={{ color: '#4CAF50' }} /> Ingresos de Hoy
            </h3>
            
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: `conic-gradient(#4CAF50 0% ${(totalPagosHoy/metaDiaria)*100}%, #E0E0E0 ${(totalPagosHoy/metaDiaria)*100}% 100%)`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              marginBottom: '1.5rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#4CAF50' }}>
                  S/. {totalPagosHoy.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#666666' }}>
                  Total recaudado
                </span>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
              marginTop: '0.5rem'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#4CAF50',
                  borderRadius: '50%',
                  margin: '0 auto 0.5rem'
                }} />
                <span style={{ fontSize: '0.9rem' }}>
                  {Math.round((totalPagosHoy/metaDiaria)*100)}% Meta
                </span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#E0E0E0',
                  borderRadius: '50%',
                  margin: '0 auto 0.5rem'
                }} />
                <span style={{ fontSize: '0.9rem' }}>
                  {Math.round(100-(totalPagosHoy/metaDiaria)*100)}% Restante
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const Card = ({ 
  icon, 
  title, 
  value, 
  backgroundColor, 
  textColor, 
  accentColor,
  borderColor = 'transparent'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Clonamos el icono para aplicar estilos avanzados
  const coloredIcon = React.cloneElement(icon, {
    style: { 
      color: accentColor,
      fontSize: '2rem',
      transition: 'all 0.3s ease',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
    }
  });

  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: '16px',
        backgroundColor: backgroundColor,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxSizing: 'border-box',
        boxShadow: isHovered
          ? `0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)`
          : `0 8px 25px rgba(0,0,0,0.15)`,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: isHovered ? 'translateY(-7px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        height: '100%',
        border: `1px solid ${borderColor}`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Contenedor de icono con diseño premium */}
      <div style={{
        position: 'relative',
        padding: '20px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
        transition: 'all 0.4s ease',
        zIndex: 1,
        background: `linear-gradient(145deg, ${backgroundColor}88, ${backgroundColor}00)`,
        boxShadow: `
          0 0 0 2px ${accentColor}80,
          0 8px 20px rgba(0,0,0,0.2),
          inset 0 -4px 10px ${accentColor}20
        `,
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `${accentColor}20`,
          filter: 'blur(8px)',
          zIndex: -1,
          opacity: isHovered ? 0.8 : 0.4,
          transition: 'opacity 0.3s ease'
        }} />
        {coloredIcon}
      </div>

      {/* Contenido */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontSize: '1.1rem',
          marginBottom: '10px',
          color: textColor,
          fontWeight: '600',
          letterSpacing: '0.3px',
          opacity: 0.9,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          {title}
        </h3>
        <p style={{
          fontSize: '2.5rem',
          margin: 0,
          fontWeight: '800',
          color: textColor,
          lineHeight: 1,
          textShadow: isHovered ? `0 0 12px ${accentColor}50` : '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'text-shadow 0.4s ease'
        }}>
          {value}
        </p>
        <div style={{
          width: '40px',
          height: '4px',
          backgroundColor: accentColor,
          borderRadius: '2px',
          marginTop: '15px',
          transform: isHovered ? 'scaleX(1.8)' : 'scaleX(1)',
          transition: 'transform 0.4s ease',
          boxShadow: `0 0 12px ${accentColor}40`
        }} />
      </div>
      
      {/* Efecto de brillo al pasar el mouse */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at ${isHovered ? '50% 30%' : '50% 10%'}, ${accentColor}10, transparent 70%)`,
        zIndex: 0,
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.4s ease, background 0.4s ease'
      }} />
      
      {/* Patrón de puntos decorativo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `radial-gradient(${accentColor}15 1px, transparent 2px)`,
        backgroundSize: '20px 20px',
        opacity: isHovered ? 0.3 : 0.1,
        transition: 'opacity 0.4s ease',
        zIndex: 0
      }} />
    </div>
  );
};

export default Home;