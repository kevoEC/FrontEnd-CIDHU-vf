import React, { useState, useEffect, useContext } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import { UpdateComplaintUser } from "./UpdateComplaintUser";
import { InsertComplaintUser } from "./InsertComplaintUser";
import { ProcesosDenuncias } from "./ProcesosDenuncias";
import SearchClient from "./SearchComplaintUser";
import { AuthContext } from "../Context/AuthContext";
import { Dropdown } from "bootstrap";
import Select from 'react-select';

export const ComplaintUser = () => {
  //Varibles de clientes y tabla
  const [clients, setComplaints] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const { loginData } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  //variable de Modales
  const [showModalUpdateClient, setshowModalUpdateClient] = useState(false);
  const [showModalInsertClient, setshowModalInsertClient] = useState(false);
  const [showModalProcesosDenuncias, setshowModalProcesosDenuncias] = useState(false);

  //Varible Denuncia selecionado
    const [selectedClient, setSelectedDenuncia] = useState(null);
    const [selectedCaracter, setSelectedCaracter] = useState(null);
    const [selectedInstancia, setSelectedInstancia] = useState(null);
    const [selectedEstado, setSelectedEstado] = useState({ value: true, label: 'Activo' });

  useEffect(() => {
    fetchDataListClient();
  }, []);

  const fetchDataListClient = async () => {
    try {
      const requestData = {
        accessToken: loginData.accessToken,
      };

      const responseData = await fetchJson(
        "https://backendcidhu.onrender.com/api/v1/user/me",
        requestData
      );

      if (
        Array.isArray(responseData.denuncias) &&
        responseData.denuncias.length > 0
      ) {
        setComplaints(responseData.denuncias);
        setFilteredClients(responseData.denuncias);
      } else {
        setComplaints([]);
        setFilteredClients([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredClients.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleUpdateClientButtonClick = (client) => {
    setSelectedDenuncia(client);
    setshowModalUpdateClient(true);
  };

  const closeModalUpdateClient = () => {
    setshowModalUpdateClient(false);
    fetchDataListClient();
  };

  const handleInsertClientButtonClick = (client) => {
    setshowModalInsertClient(true);
  };

  const closeModalInsertClient = () => {
    setshowModalInsertClient(false);
    fetchDataListClient();
  };

  const handleProcesosDenunciasButtonClick = (client) => {
    setSelectedDenuncia(client);
    setshowModalProcesosDenuncias(true);
  };

  const closeModalProcesosDenuncias = () => {
    setshowModalProcesosDenuncias(false);
    fetchDataListClient();
  };

  useEffect(() => {
    let filtered = clients;
  
    if (selectedCaracter) {
      filtered = filtered.filter(client => client.caracter === selectedCaracter.value);
    }
  
    if (selectedInstancia !== null) {
      filtered = filtered.filter(client => client.instancia === selectedInstancia.value);
    }

    if (selectedEstado !== null) {
      filtered = filtered.filter(client => client.activo === selectedEstado.value);
    }
  
    setFilteredClients(filtered);
  }, [clients, selectedCaracter, selectedInstancia, selectedEstado]);

  const onChangeFilter = (selectedOption) => {
    if (selectedOption) {
      const filteredClients = clients.filter(
        (client) => client._id === selectedOption.value
      );
      setFilteredClients(filteredClients);
    } else {
      setFilteredClients(clients); // Muestra todos los clientes si no hay selección
    }
    setCurrentPage(1);
  };


    
  const styles = {
    inactiveRow: {
      backgroundColor: 'rgba(254, 132, 132, 0.5)',
    },
  };

  return (
    <div>
      <section className="content-header ">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Crea tu denuncia</h1>
            </div>
          </div>
        </div>
      </section>
      <div className="row">
  <div className="col-sm-12 col-md-4">
    <div className="form-group">
     <label className="ml-2">Caracter:</label>
      <Select
        value={selectedCaracter}
        onChange={(option) => setSelectedCaracter(option)}
        options={[
          { value: 'personal', label: 'Personal' },
          { value: 'familiar', label: 'Familiar' },
          { value: 'asociacion', label: 'Asociación' },
          { value: 'institucion', label: 'Institución' },
          { value: 'grupo', label: 'Grupo' },
          { value: 'empresa', label: 'Empresa' },
          { value: 'estado', label: 'Estado' },
          { value: 'gobierno autonomo', label: 'Gobierno Autónomo' },
        ]}
        placeholder="Filtrar por Caracter..."
        isClearable
      />
    </div>
  </div>
  <div className="col-sm-12 col-md-4">
    <div className="form-group">
      <label>Instancia</label>
      <Select
        value={selectedInstancia}
        onChange={(option) => setSelectedInstancia(option)}
        options={[
          { value: 'nacional', label: 'Nacional' },
          { value: 'internacional', label: 'Internacional' },
          { value: 'territorial', label: 'Territorial' },
        ]}
        placeholder="Filtrar por Instancia..."
        isClearable
      />
    </div>
  </div>
  <div className="col-sm-12 col-md-4">
    <div className="form-group">
      <label>Estado</label>
      <Select
        value={selectedEstado}
        onChange={(option) => setSelectedEstado(option)}
        options={[
          { value: true, label: 'Activo' },
          { value: false, label: 'Inactivo' },
        ]}
        placeholder="Filtrar por Estado..."
        isClearable
      />
    </div>
  </div>
</div>

      <section className="content ">
        <div className="card card-solid">
          <div className="card card-success">
            <div className="card-header">
              <h3 className="card-title">Lista de denuncias</h3>
            </div>
            <div className="card-body">
              <div
                id="example1_wrapper"
                className="dataTables_wrapper dt-bootstrap4 "
              >
                <div className="row">
                  <div className="col-sm-12 col-md-6 ">
                    <div className="dt-buttons btn-group flex-wrap">
                      <button
                        className="btn btn-secondary"
                        tabIndex={0}
                        aria-controls="tbActiveClients"
                        type="button"
                        onClick={handleInsertClientButtonClick}
                      >
                        <span>
                          Nueva denuncia  &nbsp;
                          <i className="nav-icon fas fa-file-signature"></i>
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                    <div
                      id="example1_filter"
                      className="dataTables_filter"
                    ></div>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-sm-12">
                    <table
                      id="example1"
                      className="table table-bordered table-striped dataTable dtr-inline "
                      role="grid"
                      aria-describedby="example1_info"
                    >
                      <thead>
                        <tr role="row">
                          <th
                            className="sorting_asc"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-sort="ascending"
                            aria-label="Rendering engine: activate to sort column descending"
                          >
                            CARACTER
                          </th>
                          
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            INSTANCIA
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            RESUMEN HECHOS
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            RESPONSABLES
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            ASISTENCIA
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            CARACTER PERSONAL
                          </th>

                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            ESTADO
                          </th>
                          
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            EDITAR
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            CITAS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.map((client) => (
                          <tr key={client._id} style={client.activo ? {} : styles.inactiveRow}>
                            <td>{client.caracter === 'personal' ? 'Personal' :
                                 client.caracter === 'familiar' ? 'Familiar' : 
                                 client.caracter === 'asociacion' ? 'Asociación' : 
                                 client.caracter === 'institucion' ? 'Institución' : 
                                 client.caracter === 'grupo' ? 'Grupo' : 
                                 client.caracter === 'empresa' ? 'Empresa' : 
                                 client.caracter === 'estado' ? 'Estado' : 
                                 client.caracter === 'gobierno autonomo' ? 'Gobierno Autónomo' : client.caracter
                            }</td>
                            <td>{client.instancia === 'nacional' ? 'Nacional' :
                                 client.instancia === 'internacional' ? 'Internacional' :
                                 client.instancia === 'territorial' ? 'Territorial' : client.instancia
                            }</td>
                            <td>{client.resumenHechos}</td>
                            <td>{client.nombresResponsables}</td>
                            <td>{client.asistencia ? 'SI' : 'NO' }</td>
                            <td>{client.caracterPersonal ? 'SI' : 'NO'}</td>
                            <td>{client.activo ? 'ACTIVO' : 'INACTIVO'}</td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btnEdit btn btn-sm btn-outline-primary mr-1"
                                title="Editar"
                                onClick={() => handleUpdateClientButtonClick(client)}
                              >
                                <i className="nav-icon far fa-edit" aria-hidden="true"></i>
                              </button>
                            </td>
                            <td style={{ display: "none" }}>
                              {client.status_id}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btnEdit btn btn-sm btn-outline-primary mr-1"
                                title="Editar"
                                onClick={() => handleProcesosDenunciasButtonClick(client)}
                              >
                                <i className="nav-icon fas fa-cog" aria-hidden="true"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-5">
                    <div
                      className="dataTables_info"
                      id="example1_info"
                      role="status"
                      aria-live="polite"
                    >
                      Mostrando {indexOfFirstRecord + 1} a{" "}
                      {Math.min(indexOfLastRecord, filteredClients.length)} de{" "}
                      {filteredClients.length} registros
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-7">
                    <div
                      className="dataTables_paginate paging_simple_numbers"
                      id="example1_paginate"
                    >
                      <ul className="pagination">
                        <li
                          className={`paginate_button page-item ${
                            currentPage === 1 ? "disabled" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            Anterior
                          </button>
                        </li>
                        {Array.from(
                          {
                            length: Math.ceil(
                              filteredClients.length / recordsPerPage
                            ),
                          },
                          (_, i) => (
                            <li
                              className={`paginate_button page-item ${
                                currentPage === i + 1 ? "active" : ""
                              }`}
                              key={i}
                            >
                              <button
                                className="page-link"
                                onClick={() => handlePageChange(i + 1)}
                              >
                                {i + 1}
                              </button>
                            </li>
                          )
                        )}
                        <li
                          className={`paginate_button page-item ${
                            currentPage ===
                            Math.ceil(filteredClients.length / recordsPerPage)
                              ? "disabled"
                              : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            Siguiente
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showModalUpdateClient && (
        <UpdateComplaintUser
          selectedClient={selectedClient}
          closeModalUpdateClient={closeModalUpdateClient}
        />
      )}
      {showModalInsertClient && (
        <InsertComplaintUser closeModalInsertClient={closeModalInsertClient} />
      )}
      {showModalProcesosDenuncias && (
        <ProcesosDenuncias
        selectedClient = {selectedClient}
        closeModalProcesosDenuncias={closeModalProcesosDenuncias}
        />
      )}
    </div>
  );
};

const caracterPersonalOptions = [
  {
    key: "asistencia",
    text: "Personal",
    value: "true",
  },
  {
    key: "asistencia",
    text: "No-Personal",
    value: "false",
  },
];
