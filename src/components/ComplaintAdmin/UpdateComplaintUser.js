import { React, useEffect, useState, useContext } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import Modal from "../Modal/Modal";
import Select from "react-select";
import { Notify } from "../Modal/Notify";
import { AuthContext } from "../Context/AuthContext";

export const UpdateClient = ({
  selectedClient,
  closeModalUpdateClient,
}) => {
  const [showNotifyError, setNotifyError] = useState(false);
  const [showNotifySuccess, setNotifySuccess] = useState(false);
  const [selectedDataReference, setSelectedDataReference] = useState({
    value: selectedClient.status_id,
    label: selectedClient.reference_name,
  });
  const selectedCaracter = caracterOptions.find(option => option.value === selectedClient.caracter);
  const selectedInstancia = instanciaOptions.find(option => option.value === selectedClient.instancia);
  const selectedCP = CPOptions.find(option => option.value === selectedClient.caracterPersonal);
  const selectedAsistencia = asistenciaOptions.find(option => option.value === selectedClient.asistencia);
  const selectedStatus = statusOptions.find(option => option.value === selectedClient.activo);
  const { loginData } = useContext(AuthContext);
  const [references, setReferences] = useState([]);
  const [clientData, setClientData] = useState({
    _id: selectedClient._id,
    caracter: selectedClient.caracter,
    instancia: selectedClient.instancia,
    caracterPersonal: selectedClient.caracterPersonal, //clientData.caracterPersonal
    asistencia: selectedClient.asistencia, //clientData.asistencia
    resumenHechos: selectedClient.resumenHechos,
    nombresResponsables: selectedClient.nombresResponsables,
    activo : selectedClient.activo,
    user: loginData._id,
    accessToken: loginData.accessToken,
  });

  const handleUpdateClient = async () => {
    if (
      clientData.caracter === "" ||
      clientData.instancia === "" ||
      clientData.caracterPersonal === "" ||
      clientData.asistencia === "" ||
      clientData.resumenHechos === "" ||
      clientData.activo === "" ||
      clientData.nombresResponsables === ""
    ) {
      handleShowError();
      return;
    }

    try {
      const requestData = {
        caracter: clientData.caracter,
        instancia: clientData.instancia,
        caracterPersonal: clientData.caracterPersonal, //clientData.caracterPersonal
        asistencia: clientData.asistencia, //clientData.asistencia
        resumenHechos: clientData.resumenHechos,
        nombresResponsables: clientData.nombresResponsables,
        activo: clientData.activo,
        user: loginData._id,
        accessToken: loginData.accessToken,
      };

      const responseData = await fetchJson(
        `https://backendcidhu.onrender.com/api/v1/denunciaU/${clientData._id}`,
        requestData
      );

      handleShowSuccess();
      setTimeout(() => {
        closeModalUpdateClient();
      }, 2000);
    } catch (error) {
      console.error(error);
      // Maneja el error de la manera que prefieras
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

const handleChangeStatus = (selectedOption) => {
    if (selectedOption) {
      setClientData({ ...clientData, activo: selectedOption.value });
    } else {
      // Si no hay ninguna opción seleccionada, establece el valor como vacío
      setClientData({ ...clientData, activo: "" });
    }
  }; 

const handleChangeresumenHechos = (event) => {
  setClientData({ ...clientData, resumenHechos: event.target.value });
};

const handleChangenombresResponsables = (event) => {
  setClientData({ ...clientData, nombresResponsables: event.target.value });
};

  const optionsReference = references.map((data) => ({
    value: data.reference_id,
    label: data.reference_name,
  }));

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
      title="Editar Denuncia"
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
              {/* Campo oculto para el valor de "activo" */}
              <input type="hidden" name="activo" value={selectedClient.activo} />
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
                </div>
                <div className="form-group col-sm-12">
                  <label>Caracter de la denuncia</label>
                  <Select
                      placeholder='Selecciona el caracter de la denuncia'
                      defaultValue={selectedCaracter}
                      options={caracterOptions}
                      onChange={handleChangeCaracter}
                  />
                </div>
                <div className="form-group col-sm-12">
                  <label>Instancia de la denuncia</label>
                  <Select
                      placeholder='Selecciona la instancia de la denuncia'
                      defaultValue={selectedInstancia}
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
                      defaultValue={selectedClient.nombresResponsables}
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
                      defaultValue={selectedClient.resumenHechos}
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
                      defaultValue={selectedCP}
                      options={CPOptions}
                      onChange={handleChangecaracterPersonal}
                  />
                </div>
                <div className="form-group col-sm-12">
                  <label>¿Recibió asistencia personal del CIDHU?</label>
                  <Select
                      placeholder='Selecciona su respuesta'
                      defaultValue={selectedAsistencia}
                      options={asistenciaOptions}
                      onChange={handleChangeAsistencia}
                  />
                </div>
                <div className="form-group col-sm-12">
                  <label>Estado de la denuncia</label>
                  <Select
                      placeholder='Selecciona su respuesta'
                      defaultValue={selectedStatus}
                      options={statusOptions}
                      onChange={handleChangeStatus}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      } // Aquí puedes pasar el contenido que desees
      button1Name="Cerrar"
      button2Name="Guardar Cambios"
      handleButton1Click={closeModalUpdateClient}
      handleButton2Click={handleUpdateClient}
      closeModalUpdateClient={closeModalUpdateClient}
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

const statusOptions = [
    {
        label: "ACTIVO",
        value: true,
    },
    {
        label: "INACTIVO",
        value: false,
    }
  ] 
