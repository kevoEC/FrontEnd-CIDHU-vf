import { useContext, useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { AuthContext } from "../Context/AuthContext";
import { fetchJson } from "../../hooks/useFetchJson";
import { FaCheck, FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import Citas from "./Citas"; // Asegúrate de que la ruta sea correcta



export const ProcesosDenuncias = ({ selectedClient, closeModalProcesosDenuncias }) => {
  const [showNotifyError, setNotifyError] = useState(false);
  const [showNotifySuccess, setNotifySuccess] = useState(false);
  const { loginData } = useContext(AuthContext);
  const [showCitas, setShowCitas] = useState(false);
  const [procesosVisibles, setProcesosVisibles] = useState({}); 
  const [references, setReferences] = useState([]);
  const [clientData, setClientData] = useState({
    _id: selectedClient._id,
    accessToken: loginData.accessToken,
  });
  const [procesosData, setProcesosData] = useState([]);

  useEffect(() => {
    handleListProcesos();
  }, []); // Se ejecuta solo una vez al montar el componente

  const handleListProcesos = async () => {
    try {
      const requestData = {
        accessToken: clientData.accessToken,
      };
      const responseData = await fetchJson(
        `https://backendcidhu.onrender.com/api/v1/procesos/`,
        requestData
      );
      setProcesosData(responseData.data);
    } catch (error) {
      console.error(error);
      handleShowError();
    }
  };

  const handleShowError = () => {
    setNotifyError(true);
    setTimeout(() => {
      setNotifyError(false);
    }, 5000);
  };

  const handleShowSuccess = () => {
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifySuccess(false);
    }, 2000);
  };

  const handleFilterProcesos = (idDenuncia) => {
    return procesosData.filter((proceso) => proceso.denuncia === idDenuncia);
  };

  // Filtrar los procesos que tienen el ID de denuncia especificado
  const procesosFiltrados = handleFilterProcesos(selectedClient._id);

    // Función para alternar la visibilidad de las citas
    const toggleCitas = () => {
      setShowCitas(!showCitas);
    };

    // Función para alternar la visibilidad de un proceso específico
    const toggleProceso = (procesoId) => {
      setProcesosVisibles((prevState) => ({
        ...prevState,
        [procesoId]: !prevState[procesoId]
      }));
    };

  return (
    <Modal
      title="Procesos de Denuncia"
      body={
        <div>
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Agenda del caso</h3>
              {showNotifyError && <div>Error en la solicitud</div>}
              {showNotifySuccess && <div>Procesos actualizados</div>}
            </div>
            <div className="card-body">
              <form>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Id Denuncia</label>
                    <input
                      type="text"
                      value={selectedClient._id}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </form>
                            <div className="row">
                {procesosFiltrados.map((proceso) => (
                  <div className="col-md-6" key={proceso._id}>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="card-title">
                          {proceso.activo ? (
                            <>
                              <FaCheck style={{ color: "green", marginRight: "5px" }} />
                              Proceso: {proceso.tipo}
                            </>
                          ) : (
                            <>
                              <FaTimes style={{ color: "red", marginRight: "5px" }} />
                              Proceso: {proceso.tipo}
                            </>
                          )}
                        </h5>
                      </div>
                      <div className="card-body">
                        <p>Descripción: {proceso.descripcion}</p>
                        <p>Estado: {proceso.activo ? 'Activo' : 'Inactivo'}</p>
                        <p>Citas Anexadas: {proceso.fechas.length}</p>
                        <button
                          className="btn btn-link"
                          onClick={() => toggleProceso(proceso._id)}
                        >
                          {procesosVisibles[proceso._id] ? (
                            <>
                              <FaChevronUp style={{ marginRight: "2px" }} />
                              Ocultar Citas
                            </>
                          ) : (
                            <>
                              <FaChevronDown style={{ marginRight: "2px" }} />
                              Mostrar Citas
                            </>
                          )}
                        </button>
                        {procesosVisibles[proceso._id] && (
                          <Citas procesoId={proceso._id} accessToken={clientData.accessToken} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      }
      
      button2Name="Cerrar"
      handleButton1Click={closeModalProcesosDenuncias}
      handleButton2Click={closeModalProcesosDenuncias}
    />
  );
};
