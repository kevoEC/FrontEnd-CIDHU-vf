import { React, useEffect, useState, useContext } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import Modal from "../Modal/Modal";
import { Notify } from "../Modal/Notify";
import Select from "react-select";
import { AuthContext } from "../Context/AuthContext";

export const InsertComplaintUser = ({ closeModalInsertClient }) => {
  const [references, setReferences] = useState([]);
  const [selectedDataReference, setSelectedDataReference] = useState(null);
  const [clientData, setClientData] = useState({
    caracter: "",
    instancia: "",
    caracterPersonal: "",
    asistencia: "",
    resumenHechos: "",
    nombresResponsables: "",
    activo: false,
    user: "",
  });
  const [showNotifyError, setNotifyError] = useState(false);
  const [showNotifySuccess, setNotifySuccess] = useState(false);
  const { loginData } = useContext(AuthContext);

  const handleInsertClient = async () => {
    if (
      clientData.caracter === "" ||
      clientData.instancia === "" ||
      clientData.caracterPersonal === "" ||
      clientData.asistencia === "" ||
      clientData.resumenHechos === "" ||
      clientData.nombresResponsables === ""
    ) {
      handleShowError();
      return;
    }
    try {
      console.log("ESTE ES EL USUARIO")
      console.log(loginData)
      const requestData = {
        caracter: clientData.caracter,
        instancia: clientData.instancia,
        caracterPersonal: clientData.caracterPersonal, // Asegúrate de que este sea el valor correcto
        asistencia: clientData.asistencia,             // Asegúrate de que este sea el valor correcto
        resumenHechos: clientData.resumenHechos,
        nombresResponsables: clientData.nombresResponsables,
        activo: false, 
        user: loginData._id,     // Debe ser un valor aceptado por la API
        accessToken: loginData.accessToken,
      };

      const responseData = await fetchJson(
        "https://backendcidhu.onrender.com/api/v1/denuncia",
        requestData
      );

      handleShowSuccess();
      setTimeout(() => {
        closeModalInsertClient();
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

    const handleChangeCaracter = (event) => {
      setSelectedDataReference(event || '');
      if (event && event.value) {
          setClientData({ ...clientData, caracter: event.value });
      }
  };

    const handleChangeInstancia = (event) => {
      setSelectedDataReference(event || '');
      if (event && event.value) {
          setClientData({ ...clientData, instancia: event.value });
      }
  };

  const handleChangecaracterPersonal = (selectedOption) => {
    if (selectedOption) {
      setClientData({ ...clientData, caracterPersonal: selectedOption.value });
    } else {
      // Si no hay ninguna opción seleccionada, establece el valor como vacío
      setClientData({ ...clientData, caracterPersonal: "" });
    }
  };

  
  const handleChangeAsistencia = (selectedOption) => {
    if (selectedOption) {
      setClientData({ ...clientData, asistencia: selectedOption.value });
    } else {
      // Si no hay ninguna opción seleccionada, establece el valor como vacío
      setClientData({ ...clientData, asistencia: "" });
    }
  };

  const handleChangeresumenHechos = (event) => {
    setClientData({ ...clientData, resumenHechos: event.target.value });
  };

  const handleChangenombresResponsables = (event) => {
    setClientData({ ...clientData, nombresResponsables: event.target.value });
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

  const optionsReference = references.map((data) => ({
    value: data.reference_id,
    label: data.reference_name,
  }));

  return (
    <Modal
      title="Insertar nueva Denuncia"
      body={
        <div className="card card-primary">
          <div className="card-header">
            <h3 className="card-title">Datos de la denuncia</h3>
            {showNotifyError && (
              <Notify
                message="Todos los campos son obligatorios"
                type="error"
              />
            )}
            {showNotifySuccess && (
              <Notify message="Datos guardados" type="success" />
            )}
          </div>
          <div className="card-body">
            <form>
              <div className="row">
                <div className="col-sm-12">
                </div>
                <div className="form-group col-sm-12">
                  <label>Caracter de la denuncia</label>
                  <Select
                      placeholder='Selecciona el caracter de la denuncia'
                      options={caracterOptions}
                      onChange={handleChangeCaracter}
                  />
                </div>
                <div className="form-group col-sm-12">
                  <label>Instancia de la denuncia</label>
                  <Select
                      placeholder='Selecciona la instancia de la denuncia'
                      options={instanciaOptions}
                      onChange={handleChangeInstancia}
                  />
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Nombres de los Responsables</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ingrese el nombre de la empresa o persona responsable"
                      onChange={handleChangenombresResponsables}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label>Resumen de los hechos</label>
                    <textarea
                      className="form-control"
                      placeholder="Ingresar nombres de los responsables"
                      onChange={handleChangeresumenHechos}
                      rows={4} // Establece el número de líneas visibles
                      required
                    />
                  </div>
                </div>
                <div className="form-group col-sm-12">
                  <label>¿La denuncia es de asunto personal?</label>
                  <Select
                      placeholder='Selecciona su respuesta'
                      options={CPOptions}
                      onChange={handleChangecaracterPersonal}
                  />
                </div>
                <div className="form-group col-sm-12">
                  <label>¿Recibió asistencia personal del CIDHU?</label>
                  <Select
                      placeholder='Selecciona su respuesta'
                      options={asistenciaOptions}
                      onChange={handleChangeAsistencia}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      }
      button1Name="Cerrar"
      button2Name="Guardar Cambios"
      handleButton1Click={closeModalInsertClient}
      handleButton2Click={handleInsertClient}
      closeModalInsertClient={closeModalInsertClient}
    />
  );
};

const caracterOptions = [
  {
      label: "Personal",
      value: "personal",
  },
  {
      label: "Familiar",
      value: "Organización",
  },
  {
      label: "Asociación",
      value: "asociacion",
  },
  {
      label: "Institución",
      value: "institucion",
  },
  {
      label: "Grupo",
      value: "grupo",
  },
  {
      label: "Empresa",
      value: "empresa",
  },
  {
      label: "Estado",
      value: "estado",
  },
  {
      label: "Gobierno Autónomo",
      value: "gobierno autonomo",
  },
];

const instanciaOptions = [
  {
      label: "Territorial",
      value: "territorial",
  },
  {
      label: "Nacional",
      value: "nacional",
  },
  {
      label: "Internacional",
      value: "internacional",
  },
];

const CPOptions = [
  {
      label: "SI",
      value: true,
  },
  {
      label: "NO",
      value: false,
  }
]   

const asistenciaOptions = [
  {
      label: "SI",
      value: true,
  },
  {
      label: "NO",
      value: false,
  }
] 