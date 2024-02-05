import React, { useState, useEffect, useContext } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import { AuthContext } from "../Context/AuthContext";
import Select from 'react-select';

export const CoreDefensa = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const { loginData } = useContext(AuthContext);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedCaracter, setSelectedCaracter] = useState(null);
  const [selectedInstancia, setSelectedInstancia] = useState(null);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [relationData, setRelationData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalJuicios, setTotalJuicios] = useState(0);
  const [totalMediaciones, setTotalMediaciones] = useState(0);
  const [selectedProcessType, setSelectedProcessType] = useState(null);

  useEffect(() => {
    fetchDataListClient();
  }, []);

  const fetchDataListClient = async () => {
    try {
      const requestData = {
        accessToken: loginData.accessToken,
      };
      const responseData = await fetchJson(
        "https://backendcidhu.onrender.com/api/v1/denuncias",
        requestData
      );
      if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        setClients(responseData.data);
        setFilteredClients(responseData.data);
      } else {
        setClients([]);
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

  const fetchProcessDetails = async () => {
    const requestData = {
        accessToken: loginData.accessToken,
      };
    try {
      const responseData = await fetchJson(
        `https://backendcidhu.onrender.com/api/v1/procesos/`,
        requestData
      );
      return responseData.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProcesses = async () => {
      const processes = await fetchProcessDetails();
      setRelationData(processes);
    };
    fetchProcesses();
  }, []);

  const styles = {
    inactiveRow: {
      backgroundColor: 'rgba(254, 132, 132, 0.5)',
    },
  };

  useEffect(() => {
    let totalJuiciosEnTablaFiltrada = 0;
    let totalMediacionesEnTablaFiltrada = 0;
  
    filteredClients.forEach((client) => {
      // Verificar si el cliente actual cumple con los filtros seleccionados
      const clientDate = new Date(client.createdAt);
      const startRange = new Date(startDate);
      const endRange = new Date(endDate);
  
      const juiciosFiltrados = client.procesos.filter(
        (proceso) => proceso.tipo.toLowerCase() === "juicio"
      );
      const mediacionesFiltradas = client.procesos.filter(
        (proceso) =>
          proceso.tipo.toLowerCase() === "mediacion" ||
          proceso.tipo === "Mediación"
      );
  
      if (
        (!selectedCaracter || client.caracter.toLowerCase() === selectedCaracter.value) &&
        (!selectedInstancia || client.instancia.toLowerCase() === selectedInstancia.value) &&
        (selectedEstado === null || client.activo === selectedEstado.value) &&
        (!startDate || !endDate || (clientDate >= startRange && clientDate <= endRange)) &&
        (!selectedProcessType || client.procesos.some(proceso => proceso.tipo.toLowerCase() === selectedProcessType.value))
      ) {
        totalJuiciosEnTablaFiltrada += juiciosFiltrados.length;
        totalMediacionesEnTablaFiltrada += mediacionesFiltradas.length;
      }
    });
  
    // Asignando los totales a las variables de estado
    setTotalJuicios(totalJuiciosEnTablaFiltrada);
    setTotalMediaciones(totalMediacionesEnTablaFiltrada);
  }, [filteredClients, selectedCaracter, selectedInstancia, selectedEstado, startDate, endDate, selectedProcessType]);


  return (
    <div>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Crea tu denuncia</h1>
            </div>
          </div>
        </div>
      </section>
      <div className="row">
        <div className="col-sm-4">
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
                { value: 'gobierno autonomo', label: 'Gobierno Autónomo' }
              ]}
              placeholder="Filtrar por Caracter..."
              isClearable
            />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="form-group">
            <label className="ml-2">Instancia:</label>
            <Select
              value={selectedInstancia}
              onChange={(option) => setSelectedInstancia(option)}
              options={[
                { value: 'nacional', label: 'Nacional' },
                { value: 'internacional', label: 'Internacional' },
                { value: 'territorial', label: 'Territorial' }
              ]}
              placeholder="Filtrar por Instancia..."
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
        <div className="col-sm-4">
          <div className="form-group">
            <label className="ml-2">Fecha de inicio:</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="form-group">
            <label className="ml-2">Fecha de fin:</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="col-sm-4">
          <div className="form-group">
            <label className="ml-2">Tipo de Proceso:</label>
            <Select
              value={selectedProcessType}
              onChange={(option) => setSelectedProcessType(option)}
              options={[
                { value: 'juicio', label: 'Juicio' },
                { value: 'mediacion', label: 'Mediación' }
              ]}
              placeholder="Filtrar por Tipo de Proceso..."
              isClearable
            />
          </div>
        </div>
        <div>
        {/* Tarjetas de totales */}
              <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">JUICIOS</h3>
            </div>
            <div className="card-body text-center">
              <p className="mb-0">{totalJuicios}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">MEDIACIONES</h3>
            </div>
            <div className="card-body text-center">
              <p className="mb-0">{totalMediaciones}</p>
            </div>
          </div>
        </div>
      </div>

        </div>
      </div>
      <section className="content">
        <div className="card card-solid">
          <div className="card card-success">
            <div className="card-header">
              <h3 className="card-title">Lista de denuncias</h3>
            </div>
            <div className="card-body">
              <div
                id="example1_wrapper"
                className="dataTables_wrapper dt-bootstrap4"
              >
                <div className="row">
                  <div className="col-sm-12 col-md-6 d-flex justify-content-end">
                    <div
                      id="example1_filter"
                      className="dataTables_filter"
                    ></div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12">
                    <table
                      id="example1"
                      className="table table-bordered table-striped dataTable dtr-inline"
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
                          <th>NUMERO DE PROCESOS</th>
                          <th>JUICIOS</th>
                          <th>MEDIACION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients
                          .filter(client => {
                            if (selectedProcessType) {
                              return client.procesos.some(proceso => proceso.tipo.toLowerCase() === selectedProcessType.value);
                            }
                            return true;
                          })
                          .filter(client => {
                            if (selectedCaracter) {
                              return client.caracter.toLowerCase() === selectedCaracter.value;
                            }
                            return true;
                          })
                          .filter(client => {
                            if (selectedInstancia) {
                              return client.instancia.toLowerCase() === selectedInstancia.value;
                            }
                            return true;
                          })
                          .filter(client => {
                            if (selectedEstado !== null) {
                              return client.activo === selectedEstado.value;
                            }
                            return true;
                          })
                          .filter(client => {
                            if (startDate && endDate) {
                              const clientDate = new Date(client.createdAt);
                              const startRange = new Date(startDate);
                              const endRange = new Date(endDate);
                              return clientDate >= startRange && clientDate <= endRange;
                            }
                            return true;
                          })
                          .map((client) => (
                            <tr key={client._id} style={client.activo ? {} : styles.inactiveRow}>
                              <td>
                                {client.caracter === "personal"
                                  ? "Personal"
                                  : client.caracter === "familiar"
                                  ? "Familiar"
                                  : client.caracter === "asociacion"
                                  ? "Asociación"
                                  : client.caracter === "institucion"
                                  ? "Institución"
                                  : client.caracter === "grupo"
                                  ? "Grupo"
                                  : client.caracter === "empresa"
                                  ? "Empresa"
                                  : client.caracter === "estado"
                                  ? "Estado"
                                  : client.caracter === "gobierno autonomo"
                                  ? "Gobierno Autónomo"
                                  : client.caracter}
                              </td>
                              <td>
                                {client.instancia === "nacional"
                                  ? "Nacional"
                                  : client.instancia === "internacional"
                                  ? "Internacional"
                                  : client.instancia === "territorial"
                                  ? "Territorial"
                                  : client.instancia}
                              </td>
                              <td>{client.resumenHechos}</td>
                              <td>{client.nombresResponsables}</td>
                              <td>{client.asistencia ? "SI" : "NO"}</td>
                              <td>{client.caracterPersonal ? "SI" : "NO"}</td>
                              <td>{client.activo ? "ACTIVO" : "INACTIVO"}</td>
                              <td>{client.procesos.length}</td>
                              <td>{client.procesos.filter(proceso => proceso.tipo.toLowerCase() === "juicio").length}</td>
                              <td>{client.procesos.filter(proceso => proceso.tipo.toLowerCase() === "mediacion" || proceso.tipo === "Mediación").length}</td>
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
    </div>
  );
};

export default CoreDefensa;
