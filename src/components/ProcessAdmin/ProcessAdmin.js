import React, { useState, useEffect, useContext } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import Select from 'react-select';
import { AuthContext } from "../Context/AuthContext";
import { InsertCita } from "./InsertCita";
import { UpdateProcess } from "./UpdateProcess";

export const ProcessAdmin = () => {
  const [processes, setProcesses] = useState([]);
  const [filteredProcesses, setFilteredProcesses] = useState([]);
  const [showModalInsertCita, setShowModalInsertCita] = useState(false);
  const [showModalUpdateProcess, setShowModalUpdateProcess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState({ value: true, label: 'Activo' });
  const [filteredClients, setFilteredClients] = useState([]);
  const { loginData } = useContext(AuthContext); 

  const fetchDataListProcesses = async () => {
    try {
      const requestData = {
        accessToken: loginData.accessToken,
      };
      const responseData = await fetchJson(
        "https://backendcidhu.onrender.com/api/v1/procesos",
        requestData
      );
      if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        setProcesses(responseData.data);
        setFilteredProcesses(responseData.data);
      } else {
        setProcesses([]);
        setFilteredProcesses([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDataListProcesses();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredProcesses.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCitaButtonClick = (client) => {
    setSelectedClient(client);
    setShowModalInsertCita(true);
  };

  const handleProcessButtonClick = (client) => {
    setSelectedClient(client);
    setShowModalUpdateProcess(true);
  };

  const closeModalInsertCita = () => {
    setShowModalInsertCita(false);
    fetchDataListProcesses();
  };

  const closeModalUpdateProcess = () => {
    setShowModalUpdateProcess(false);
    fetchDataListProcesses();
  }


  const styles = {
    inactiveRow: {
      backgroundColor: 'rgba(254, 132, 132, 0.5)',
    },
  };

  useEffect(() => {
    let filtered = processes;
  
    if (selectedTipo) {
      filtered = filtered.filter(process => process.tipo === selectedTipo.value);
    }
  
    if (selectedEstado !== null) {
      filtered = filtered.filter(process => process.activo === selectedEstado.value);
    }
  
    setFilteredProcesses(filtered); // Ajusta aquí para actualizar el estado correcto
  }, [processes, selectedTipo, selectedEstado]);
  

  
  const onChangeFilter = (selectedOption) => {
    if (selectedOption) {
      const filtered = processes.filter(process => process._id === selectedOption.value);
      setFilteredProcesses(filtered); // Asegúrate de actualizar el estado correcto
    } else {
      setFilteredProcesses(processes); // Resetea a todos los procesos si no hay selección
    }
    setCurrentPage(1); // Reinicia la paginación
  };
  

  return (
    <div>
      <section className="content-header ">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Administración de Procesos</h1>
            </div>
          </div>
        </div>
      </section>
      <div className="row">
  <div className="col-sm-4">
    <div className="form-group">
    <label className="ml-2">Caracter:</label>
      <Select
        value={selectedTipo}
        onChange={(option) => setSelectedTipo(option)}
        options={[
          { value: 'juicio', label: 'Juicio' },
          { value: 'mediacion', label: 'Mediación' },
        ]}
        placeholder="Tipo"
        isClearable
      />
    </div>
  </div>
  <div className="col-sm-4">
    <div className="form-group">
      <label className="ml-2">Estado:</label>
      <Select
        value={selectedEstado}
        onChange={(option) => setSelectedEstado(option)}
        options={[
          { value: true, label: 'Activo' },
          { value: false, label: 'Inactivo' }
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
              <h3 className="card-title">Lista de procesos</h3>
            </div>
            <div className="card-body">
              <div
                id="example1_wrapper"
                className="dataTables_wrapper dt-bootstrap4 "
              >
                <div className="row">
                  <div className="col-sm-12 col-md-6 ">
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
                            TIPO
                          </th>
                          
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            DESCRIPCION
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
                            CITA
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentRecords.map((client) => (
                          <tr key={client._id} style={client.activo ? {} : styles.inactiveRow}>
                            <td>{client.tipo === 'juicio' ? 'Juicio' :
                                 client.tipo === 'mediacion' ? 'Mediación' :  client.tipo
                            }</td>
                            <td>{client.descripcion}</td>
                            <td>{client.activo ? 'ACTIVO' : 'INACTIVO'}</td>

                            <td className="text-center">
                              <button
                                type="button"
                                className="btnEdit btn btn-sm btn-outline-primary mr-1"
                                title="Editar"
                                onClick={() => handleProcessButtonClick(client)}
                              >
                                <i className="nav-icon far fa-edit" aria-hidden="true"></i>
                              </button>
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btnEdit btn btn-sm btn-outline-primary mr-1"
                                title="Editar"
                                onClick={() => handleCitaButtonClick(client)}
                              >
                                <i className="nav-icon fas fa-calendar-alt" aria-hidden="true"></i>

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
      {showModalInsertCita && (
        <InsertCita 
        selectedProcess = {selectedClient}
        closeModalInsertCita={closeModalInsertCita} />
      )}

      {showModalUpdateProcess && (
              <UpdateProcess 
              procesoData = {selectedClient}
              closeModalUpdateProcess={closeModalUpdateProcess} />
      )}
    </div>
  );
};

