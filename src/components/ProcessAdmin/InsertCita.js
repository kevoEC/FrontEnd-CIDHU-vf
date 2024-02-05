import React, { useState, useContext, useEffect } from 'react';
import { fetchJson } from '../../hooks/useFetchJson';
import { AuthContext } from '../Context/AuthContext';
import Modal from '../Modal/Modal';
import { Notify } from "../Modal/Notify";

export const InsertCita = ({ selectedProcess, closeModalInsertCita }) => {
  const { loginData } = useContext(AuthContext);
  const [citaData, setCitaData] = useState({
    fechaInicio: "",
    fechaFin: "",
    asunto: "",
    activo: true,
    procesos: selectedProcess._id, // Suponiendo que 'selectedProcess' es el ID del proceso actual
  });
  const [showNotifyError, setShowNotifyError] = useState(false);
  const [showNotifySuccess, setShowNotifySuccess] = useState(false);

  const handleInsertCita = async () => {
    if (
      citaData.fechaInicio === "" ||
      citaData.asunto === "" ||
      citaData.activo === "" ||
      citaData.procesos === ""
    ) {
      handleShowError();
      return;
    }
    try {
      const requestData = {
        fechaInicio: citaData.fechaInicio,
        fechaFin: citaData.fechaFin,
        asunto: citaData.asunto,
        activo: citaData.activo,
        procesos: citaData.procesos, // Usar el valor almacenado en citaData
        accessToken: loginData.accessToken,
      };

      const responseData = await fetchJson(
        'https://backendcidhu.onrender.com/api/v1/fecha', // Asume la URL de tu API para insertar una cita
        requestData
      );

      handleShowSuccess();
      setTimeout(() => {
        closeModalInsertCita();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowSuccess = () => {
    setShowNotifySuccess(true);
    setTimeout(() => {
      setShowNotifySuccess(false);
    }, 2000);
  };

  const handleShowError = () => {
    setShowNotifyError(true);
    setTimeout(() => {
      setShowNotifyError(false);
    }, 5000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCitaData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Modal
      title="Insertar nueva Cita"
      body={
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Datos de la cita</h3>
            {showNotifyError && (
              <Notify message="Todos los campos son obligatorios" type="error" />
            )}
            {showNotifySuccess && (
              <Notify message="Cita guardada exitosamente" type="success" />
            )}
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Fecha Inicio</label>
                    <input
                      type="date"
                      name="fechaInicio"
                      className="form-control"
                      value={citaData.fechaInicio}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Fecha Fin</label>
                    <input
                      type="date"
                      name="fechaFin"
                      className="form-control"
                      value={citaData.fechaFin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Asunto</label>
                    <textarea
                      name="asunto"
                      className="form-control"
                      placeholder="Descripción del asunto de la cita"
                      value={citaData.asunto}
                      onChange={handleChange}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>ID Proceso</label>
                    <input
                      type="text"
                      defaultValue={selectedProcess._id}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      }
      button1Name="Cerrar"
      button2Name="Crear Cita"
      handleButton1Click={closeModalInsertCita}
      handleButton2Click={handleInsertCita}
    />
  );
};
