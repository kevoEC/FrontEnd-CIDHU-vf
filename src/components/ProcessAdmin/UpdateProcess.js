import { React, useContext, useState } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import Modal from "../Modal/Modal";
import { Notify } from "../Modal/Notify";
import Select from "react-select";
import { AuthContext } from "../Context/AuthContext";

export const UpdateProcess = ({ procesoData, closeModalUpdateProcess }) => {
  const [showNotifyError, setNotifyError] = useState(false);
  const { loginData } = useContext(AuthContext);
  const [showNotifySuccess, setNotifySuccess] = useState(false);
  const [processData, setProcessData] = useState({
    _id: procesoData._id,
    tipo: procesoData.tipo,
    descripcion: procesoData.descripcion,
    activo: procesoData.activo,
    denuncia: procesoData.denuncia,
    accessToken: loginData.accessToken,
  });
  const selectedStatusOptions = activoOptions.find(option => option.value === procesoData.activo);

  const handleUpdateProcess = async () => {
    if (processData.tipo === "" || processData.descripcion === "") {
      handleShowError();
      return;
    }

    try {
      const requestData = {
        tipo: processData.tipo,
        descripcion: processData.descripcion,
        activo: processData.activo,
        denuncia: processData.denuncia,
        accessToken: loginData.accessToken,
      };

      const responseData = await fetchJson(
        `https://backendcidhu.onrender.com/api/v1/proceso/${processData._id}`,
        requestData
      );

      handleShowSuccess();
      setTimeout(() => {
        closeModalUpdateProcess();
      }, 2000);
    } catch (error) {
      console.error(error);
      // Maneja el error de la manera que prefieras
    }
  };

  const handleChangeTipo = (event) => {
    setProcessData({ ...processData, tipo: event.target.value });
  };

  const handleChangeDescripcion = (event) => {
    setProcessData({ ...processData, descripcion: event.target.value });
  };

  const handleChangeStatus = (selectedOption) => {
    if (selectedOption) {
      setProcessData({ ...processData, activo: selectedOption.value });
    } else {
      // Si no hay ninguna opción seleccionada, establece el valor como vacío
      setProcessData({ ...processData, activo: "" });
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
      title="Editar Proceso"
      body={
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Datos del proceso</h3>
            {showNotifyError && (
              <Notify message="El tipo y la descripción son obligatorios" type="error" />
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
                      defaultValue={processData._id}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Tipo</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue={processData.tipo}
                      placeholder="Ingrese el tipo"
                      onChange={handleChangeTipo}
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Descripción</label>
                    <textarea
                      className="form-control"
                      defaultValue={processData.descripcion}
                      placeholder="Ingrese la descripción"
                      onChange={handleChangeDescripcion}
                    ></textarea>
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Estado</label>
                    <Select
                      options={activoOptions}
                      onChange={handleChangeStatus}
                      defaultValue={selectedStatusOptions}
                      placeholder="Seleccione un estado"
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
      handleButton1Click={closeModalUpdateProcess}
      handleButton2Click={handleUpdateProcess}
      closeModalUpdateProcess={closeModalUpdateProcess}
    />
  );
};

const activoOptions = [
  {
    label: "Activo",
    value: true,
  },
  {
    label: "Inactivo",
    value: false,
  },
];
