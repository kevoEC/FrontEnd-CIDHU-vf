import React, { useEffect, useState } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import { FaCheck, FaTimes } from 'react-icons/fa';



const Citas = ({ procesoId, accessToken }) => {
  const [citasData, setCitasData] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestData = {
          accessToken,
        };
  
        const responseData = await fetchJson(
          `https://backendcidhu.onrender.com/api/v1/fechas`,
          requestData
        );  
  
        if (responseData.status) {
          setCitasData(responseData.data);
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error(error);
        setShowError(true);
      }
    };
  
    fetchData();
  }, [procesoId, accessToken]);
  
  const handleFilterCitas = (procesoId) => {
    return citasData.filter((cita) => {
      if (cita.procesos) {
        return cita.procesos._id === procesoId;
      }
      return false;
    });
  };
  
  
  const citasFiltradas = handleFilterCitas(procesoId);
  return (
<div>
  {citasFiltradas.map((cita) => (
    <div key={cita._id} className="card">
      <div className="card-header">
        <h5 className="card-title">
          {cita.activo ? (
            <>
              <FaCheck style={{ color: "green", marginRight: "5px" }} />
              Activa
            </>
          ) : (
            <>
              <FaTimes style={{ color: "red", marginRight: "5px" }} />
              Cerrada
            </>
          )}
        </h5>
      </div>
      <div className="card-body">
        <p>Fecha de inicio: {new Date(cita.fechaInicio).toLocaleDateString()}</p>
        {cita.activo ? (
          null
        ) : (
          <p>Fecha de cierre: {new Date(cita.fechaFin).toLocaleDateString()}</p>
        )}
        <p>Asunto: {cita.asunto}</p>
        <p>Estado: {cita.activo ? 'Activo' : 'Inactivo'}</p>

        {/* Aquí puedes mostrar otros detalles de la cita */}
      </div>
    </div>
  ))}
</div>




  );
};


export default Citas;
