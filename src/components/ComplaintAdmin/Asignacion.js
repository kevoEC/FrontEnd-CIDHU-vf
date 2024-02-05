import { useContext, useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import { AuthContext } from "../Context/AuthContext";
import { fetchJson } from "../../hooks/useFetchJson";
import Select from "react-select";
import { FaUser, FaUserCog  } from "react-icons/fa";
import { Notify } from '../Modal/Notify';

export const Asignacion = ({ selectedClient, closeModalAsignacion }) => {
  const [showNotifyError, setNotifyError] = useState(false);
  const [showNotifySuccess, setNotifySuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const { loginData } = useContext(AuthContext);
  const [clientData, setClientData] = useState({
    _id: selectedClient._id,
    accessToken: loginData.accessToken,
    
  });
  const [usersWithRoles, setUsersWithRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleUserChange = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    const fetchUsersWithRoles = async () => {
      try {
        const requestData = {
          accessToken: clientData.accessToken, // Utiliza clientData.accessToken en lugar de accessToken
        };
  
        const responseData = await fetchJson(
          `http://localhost:3977/api/v1/users`,
          requestData
        );
  
        if (responseData.status) {
          // Filtra la lista para obtener solo los usuarios con roles "abogado" o "admin"
          const filteredUsers = responseData.data.filter(
            (user) => user.role === "abogado" || user.role === "admin"
          );
          setUsersWithRoles(filteredUsers);
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error(error);
        setShowError(true);
      }
    };
  
    fetchUsersWithRoles();
  }, [selectedClient, clientData.accessToken]); // Asegúrate de incluir clientData.accessToken en las dependencias
  

  

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


  const handleCreateOrUpdateRelacion = async () => {
    try {
      // Realiza una solicitud para obtener todas las relaciones
      const allRelacionesResponse = await fetchJson(
        "https://backendcidhu.onrender.com/api/v1/relaciones",
        { accessToken: loginData.accessToken }
      );
  
      if (allRelacionesResponse.status) {
        // Busca la relación que coincida con la denuncia seleccionada
        const relacionParaActualizar = allRelacionesResponse.data.find(
          (relacion) => relacion.denuncia === selectedClient._id
        );
  
        if (relacionParaActualizar) {
          // Si se encuentra una relación, actualiza esa relación
          const updateRelacionResponse = await fetchJson(
            `https://backendcidhu.onrender.com/api/v1/relacionU/${relacionParaActualizar._id}`,
            {
              accessToken: loginData.accessToken,
              user: selectedUser.value,
              denuncia: selectedClient._id,
            }
          );
  
          if (updateRelacionResponse.status) {
            handleShowSuccess();
          } else {
            handleShowError();
          }
        } else {
          // Si no se encuentra una relación, crea una nueva relación
          const createRelacionResponse = await fetchJson(
            "https://backendcidhu.onrender.com/api/v1/relacion",
            {
              accessToken: loginData.accessToken,
              user: selectedUser.value,
              denuncia: selectedClient._id,
            }
          );
  
          if (createRelacionResponse.status) {
            handleShowSuccess();
          } else {
            handleShowError();
          }
        }
      } else {
        handleShowError();
      }
    } catch (error) {
      console.error(error);
      handleShowError();
    }
  };
  
  
  
  
  

  return (
    <Modal
      title="Asignación de Abogado"
      body={
        <div>
          <div className="card card-primary">
            <div className="card-header">
              <h3 className="card-title">Selecciona el responsable del caso</h3>
              {showNotifyError && <div>Error en la solicitud</div>}
              {showNotifySuccess && <div>Procesos actualizados</div>}
              {showNotifyError && <Notify message="Seleccione un abogado" type="error" />}
              {showNotifySuccess && <Notify message="Asignación Actualizada" type="success" />}
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
                <div className="col-sm-12">
                <div className="form-group">
                    <label>Seleccionar Abogado</label>
                    <Select
                      value={selectedUser}
                      onChange={handleUserChange}
                      options={usersWithRoles.map((user) => ({
                        value: user._id,
                        label: `${user.firstname} ${user.lastname}`,
                        subLabel: user.email,
                        icon: user.role === "abogado" ? <FaUser /> : <FaUserCog />,
                      }))}
                      placeholder="Seleccionar Abogado"
                      isClearable
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          display: "flex",
                          alignItems: "center",
                        }),
                        option: (styles, { isFocused }) => ({
                          ...styles,
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: isFocused ? "lightgray" : "white",
                        }),
                      }}
                      formatOptionLabel={({ label, subLabel, icon }) => (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div style={{ marginRight: "8px" }}>{icon}</div>
                          <div>
                            <div>{label}</div>
                            <div style={{ fontSize: "12px", color: "gray" }}>{subLabel}</div>
                          </div>
                        </div>
                      )}
                    />

                </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      }
      button1Name={"Cerrar"}
      button2Name="Asignar Caso"
      handleButton1Click={closeModalAsignacion}
      handleButton2Click={handleCreateOrUpdateRelacion}
    />
  );
};
