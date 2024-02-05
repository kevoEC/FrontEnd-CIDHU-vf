import React, { useState, useContext, useEffect } from 'react';
import Select from "react-select";
import { fetchJson } from '../../hooks/useFetchJson';
import { AuthContext } from '../Context/AuthContext';
import Modal from '../Modal/Modal';
import { Notify } from "../Modal/Notify";

export const InsertProcess = ({ selectedClient, closeModalInsertProceso }) => {
  const { loginData } = useContext(AuthContext);
  const [references, setReferences] = useState([]);
  const [processData, setProcessData] = useState({
    tipo: "", // Tipo inicialmente vacío
    descripcion: "",
    activo: true, // Valor predeterminado
    denuncia: selectedClient._id, // Usar el ID de la denuncia del usuario actual
  });
  const [showNotifyError, setNotifyError] = useState(false);
  const [showNotifySuccess, setNotifySuccess] = useState(false);

  // Define las opciones para los campos de tipo y estado
  const tipoOptions = [
    {
      label: "Juicio",
      value: "juicio",
    },
    {
      label: "Mediación",
      value: "mediacion",
    },
  ];

  const statusOptions = [
    {
      label: "ACTIVO",
      value: true,
    },
    {
      label: "INACTIVO",
      value: false,
    },
  ];

  // Manejar el envío del formulario
  const handleInsertProcess = async () => {
    if (
      processData.tipo === "" ||
      processData.descripcion === "" ||
      processData.activo === "" ||
      processData.denuncia === ""
    ) {
      handleShowError();
      return;
    }
    try {
      const requestData = {
        tipo: processData.tipo,
        descripcion: processData.descripcion,
        activo: processData.activo,
        denuncia: processData.denuncia, // Usar el valor almacenado en processData
        accessToken: loginData.accessToken,
      };

      const responseData = await fetchJson(
        'https://backendcidhu.onrender.com/api/v1/proceso', // Asume la URL de tu API para insertar un proceso
        requestData
      );

      handleShowSuccess();
      setTimeout(() => {
        closeModalInsertProceso();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowSuccess = () => {
    setNotifySuccess(true);
    setTimeout(() => {
      setNotifySuccess(false);
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProcessData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleShowError = () => {
    setNotifyError(true);
    setTimeout(() => {
      setNotifyError(false);
    }, 5000);
  };

  return (
    <Modal
      title="Insertar nuevo Proceso"
      body={
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Datos de la denuncia</h3>
            {showNotifyError && (
              <Notify message="Todos los campos son obligatorios" type="error" />
            )}
            {showNotifySuccess && (
              <Notify message="Datos guardados" type="success" />
            )}
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Id Denuncia</label>
                    <input
                      type="text"
                      defaultValue={selectedClient._id}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="form-group col-sm-12">
                    <label>Tipo de proceso</label>
                    <Select
                      placeholder="Selecciona el tipo de proceso"
                      options={tipoOptions}
                      onChange={(selectedOption) =>
                        setProcessData((prevState) => ({
                          ...prevState,
                          tipo: selectedOption.value,
                        }))
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Resumen del proceso</label>
                    <textarea
                      name="descripcion"
                      className="form-control"
                      placeholder="Ingresar una pequeña descripción del proceso"
                      onChange={handleChange}
                      rows={4}
                      required
                    />
                  </div>
                  <div className="form-group col-sm-12">
                    <label>Estado del proceso</label>
                    <Select
                      placeholder="Selecciona el estado del proceso"
                      options={statusOptions}
                      onChange={(selectedOption) =>
                        setProcessData((prevState) => ({
                          ...prevState,
                          activo: selectedOption.value,
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      }
      button1Name="Cerrar"
      button2Name="Crear Proceso"
      handleButton1Click={closeModalInsertProceso}
      handleButton2Click={handleInsertProcess}
      closeModalInsertProceso={closeModalInsertProceso}
    />
  );
};
