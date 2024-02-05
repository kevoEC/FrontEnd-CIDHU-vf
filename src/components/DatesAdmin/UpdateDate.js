import { React, useContext, useEffect, useState } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import Modal from "../Modal/Modal";
import { Notify } from "../Modal/Notify";
import Select from "react-select";
import { AuthContext } from "../Context/AuthContext";

export const UpdateDate = ({ selectedDate, closeModalUpdateDate }) => {
  const [showNotifyError, setNotifyError] = useState(false);
  const { loginData } = useContext(AuthContext);
  const [showNotifySuccess, setNotifySuccess] = useState(false);
  const [dateData, setDateData] = useState({
    _id: selectedDate._id,
    fechaInicio: selectedDate.fechaInicio,
    fechaFin: selectedDate.fechaFin,
    asunto: selectedDate.asunto,
    activo: selectedDate.activo,
    accessToken: loginData.accessToken,
    procesos: loginData._id,
  });
  const selectedStatusOptions = activoOptions.find(option => option.value === selectedDate.activo);

  const handleUpdateDate = async () => {
    if (dateData.asunto === "") {
      handleShowError();
      return;
    }

    try {
      const requestData = {
        fechaInicio: dateData.fechaInicio,
        fechaFin: dateData.fechaFin,
        asunto: dateData.asunto,
        activo: dateData.activo,
        accessToken: loginData.accessToken,
        procesos: loginData._id,
      };

      const responseData = await fetchJson(
        `https://backendcidhu.onrender.com/api/v1/fechaU/${dateData._id}`,
        requestData
      );

      handleShowSuccess();
      setTimeout(() => {
        closeModalUpdateDate();
      }, 2000);
    } catch (error) {
      console.error(error);
      // Maneja el error de la manera que prefieras
    }
  };

  const handleChangeFechaInicio = (event) => {
    setDateData({ ...dateData, fechaInicio: event.target.value });
  };

  const handleChangeFechaFin = (event) => {
    setDateData({ ...dateData, fechaFin: event.target.value });
  };

  const handleChangeAsunto = (event) => {
    setDateData({ ...dateData, asunto: event.target.value });
  };

  const handleChangeStatus = (selectedOption) => {
    if (selectedOption) {
      setDateData({ ...dateData, activo: selectedOption.value });
    } else {
      // Si no hay ninguna opción seleccionada, establece el valor como vacío
      setDateData({ ...dateData, activo: "" });
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

  return (
    <Modal
      title="Editar Fecha"
      body={
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Datos de la fecha</h3>
            {showNotifyError && (
              <Notify message="El asunto es obligatorio" type="error" />
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
                    <label>ID</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={selectedDate._id}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Fecha de Inicio</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={dateData.fechaInicio}
                      placeholder="Ingrese la fecha de inicio"
                      onChange={handleChangeFechaInicio}
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Fecha de Fin</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={dateData.fechaFin}
                      placeholder="Ingrese la fecha de fin"
                      onChange={handleChangeFechaFin}
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Asunto</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={dateData.asunto}
                      placeholder="Ingrese el asunto"
                      onChange={handleChangeAsunto}
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                    <div className="form-group col-sm-12">
                                    <label>Estado</label>
                                    <Select
                                        options={activoOptions}
                                        onChange={handleChangeStatus}
                                        defaultValue={selectedStatusOptions}
                                        placeholder={'Seleccione un estado'}
                                    ></Select>
                    </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      }
      button1Name="Cerrar"
      button2Name="Guardar Cambios"
      handleButton1Click={closeModalUpdateDate}
      handleButton2Click={handleUpdateDate}
      closeModalUpdateDate={closeModalUpdateDate}
    />
  );
};


const activoOptions = [

    {
        label: "ABIERTO",
        value: true,
    },
    {
        label: "CERRADO",
        value: false,
    },
];