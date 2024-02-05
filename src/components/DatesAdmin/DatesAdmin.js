import React, { useState, useEffect, useContext } from 'react';
import { fetchJson } from '../../hooks/useFetchJson';
import { AuthContext } from '../Context/AuthContext';
import { UpdateDate } from './UpdateDate';
import Select from 'react-select';

export const DatesAdmin = () => {

    const { loginData } = useContext(AuthContext);

    const [citasData, setCitasData] = useState([]);
    const [filteredCitasData, setFilteredCitasData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const [filteredProcesses, setFilteredProcesses] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);

    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [showModalInsert, setShowModalInsert] = useState(false);
    const [selectedCita, setSelectedCita] = useState(null);
    const [selectedEstado, setSelectedEstado] = useState({ value: true, label: 'ABIERTO' });
    const [fechaInicioFilter, setFechaInicioFilter] = useState('');
    const [fechaFinFilter, setFechaFinFilter] = useState('');
    const [estadoFilter, setEstadoFilter] = useState('');

    useEffect(() => {
        fetchDataList();
    }, []);

    const fetchDataList = async () => {
        try {
            const requestData = {
                accessToken: loginData.accessToken
            };
            const responseData = await fetchJson(
                'https://backendcidhu.onrender.com/api/v1/fechas/',
                requestData
            );
            if (Array.isArray(responseData.data) && responseData.data.length > 0) {
                setCitasData(responseData.data);
                setFilteredCitasData(responseData.data);
            } else {
                setCitasData([]);
                setFilteredCitasData([]);
            }
        } catch (error) {
            console.error(error);
            // Maneja el error de la manera que prefieras
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredProcesses.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );

    const handleEditButtonClick = (cita) => {
        setSelectedCita(cita);
        setShowModalUpdate(true);
    };

    const closeModalEdit = () => {
        setShowModalUpdate(false);
        fetchDataList();
    };

    const handleInsertButtonClick = () => {
        setShowModalInsert(true);
    };

    const closeModalInsert = () => {
        setShowModalInsert(false);
        fetchDataList();
    };

    const styles = {
      inactiveRow: {
        backgroundColor: 'rgba(254, 132, 132, 0.5)',
      },
    };

        // Funciones para manejar cambios en los filtros
        const handleFechaInicioChange = (event) => {
          setFechaInicioFilter(event.target.value);
      };
  
      const handleFechaFinChange = (event) => {
          setFechaFinFilter(event.target.value);
      };
  
      const handleEstadoChange = (event) => {
          setEstadoFilter(event.target.value);
      };

      useEffect(() => {
        fetchDataList();
    }, []);
    
    useEffect(() => {
        let filtered = citasData;
      
        if (fechaInicioFilter) {
            filtered = filtered.filter(cita => cita.fechaInicio === fechaInicioFilter.value);
        }
      
        if (fechaFinFilter) {
            filtered = filtered.filter(cita => cita.fechaFin === fechaFinFilter.value);
        }
    
        if (selectedEstado) {
            filtered = filtered.filter(cita => cita.activo === selectedEstado.value);
        }
      
        setFilteredProcesses(filtered); 
    }, [fechaInicioFilter, fechaFinFilter, selectedEstado]);
    


const onChangeFilter = (selectedOption) => {
  if (selectedOption) {
    const filtered = citasData.filter(cita => cita._id === selectedOption.value);
    setFilteredProcesses(filtered); // Asegúrate de actualizar el estado correcto
  } else {
    setFilteredProcesses(citasData); // Resetea a todos los procesos si no hay selección
  }
  setCurrentPage(1); // Reinicia la paginación
};



    return (
        <div>
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Administración de Citas</h1>
                        </div>
                    </div>
                </div>
                <div className="row">
            <div className="col-sm-4">
                <div className="form-group">
                    <label className="ml-2">Fecha de Inicio:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaInicioFilter}
                        onChange={(e) => setFechaInicioFilter(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-sm-4">
                <div className="form-group">
                    <label className="ml-2">Fecha de Fin:</label>
                    <input
                        type="date"
                        className="form-control"
                        value={fechaFinFilter}
                        onChange={(e) => setFechaFinFilter(e.target.value)}
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
                    { value: true, label: 'ABIERTO' },
                    { value: false, label: 'CERRADO' }
                  ]}
                  placeholder="Filtrar por Estado..."
                  isClearable
                />
              </div>
          </div>

        </div>
            </section>
            <section className="content">
                <div className="card card-solid">
                    <div className="card card-danger">
                        <div className="card-header">
                            <h3 className="card-title">Lista de Citas</h3>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-12 col-md-6 ">
                                </div>
                                <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                                    <div
                                        id="example1_filter"
                                        className="dataTables_filter"
                                    >
                                        {/* Filtro de búsqueda */}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 table-responsive">
                                    <table
                                        id="example1"
                                        className="table table-bordered table-striped dataTable dtr-inline"
                                        role="grid"
                                        aria-describedby="example1_info"
                                    >
                                        <thead>
                                            <tr role="row">
                                                <th>Fecha de Inicio</th>
                                                <th>Fecha de Fin</th>
                                                <th>Asunto</th>
                                                <th>Activo</th>
                                                <th>Editar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentRecords.map((cita) => (
                                                <tr key={cita._id} style={cita.activo ? {} : styles.inactiveRow}>
                                                    <td>{new Date(cita.fechaInicio).toLocaleDateString("es-ES")}</td>
                                                    <td>{cita.fechaFin ? new Date(cita.fechaFin).toLocaleDateString("es-ES") : "-"}</td>


                                                    <td>{cita.asunto}</td>
                                                    <td>{cita.activo ? "ABIERTO" : "CERRADO"}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary mr-1"
                                                            title="Editar"
                                                            onClick={() => handleEditButtonClick(cita)}
                                                        >
                                                            <i className="nav-icon far fa-edit" aria-hidden="true"></i>
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
            </section>
            {showModalUpdate && (
                <UpdateDate selectedDate={selectedCita} closeModalUpdateDate={closeModalEdit} />
            )}

            
        </div >
    );
};
