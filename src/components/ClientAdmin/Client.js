import React, { useState, useEffect, useContext } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import { AuthContext } from "../Context/AuthContext";
import { UpdateClient } from "./UpdateClient";
import { InsertClient } from "./InsertClient";
import  SearchClient  from "./SearchClient";
import Select from 'react-select';


export const ClientAdmin = () => {
  //Varibles de clientes y tabla
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const { loginData } = useContext(AuthContext);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  //variable de Modales
  const [showModalUpdateClient, setshowModalUpdateClient] = useState(false);
  const [showModalInsertClient, setshowModalInsertClient] = useState(false);
  //Varible Cliente selecionado
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    fetchDataListClient();
  }, []);

  const fetchDataListClient = async () => {
    try {
      const requestData = {
        accessToken: loginData.accessToken,
      };

      const responseData = await fetchJson(
        "https://backendcidhu.onrender.com/api/v1/users",
        requestData
      );

      if (Array.isArray(responseData.data) && responseData.data.length > 0) {
        const sortedClients = responseData.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setClients(sortedClients);
        setFilteredClients(sortedClients);
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
  const currentRecords = filteredClients.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const handleUpdateClientButtonClick = (client) => {
    setSelectedClient(client);
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

  useEffect(() => {
    let filtered = clients;
  
    if (selectedRole) {
      filtered = filtered.filter(client => client.role === selectedRole.value);
    }
  
    if (selectedStatus !== null) {
      filtered = filtered.filter(client => client.active === selectedStatus.value);
    }
  
    setFilteredClients(filtered);
  }, [clients, selectedRole, selectedStatus]);

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
              <h1>Administración de usuarios</h1>
            </div>
          </div>
        </div>
      </section>
      <div className="row">
      <div className="col-sm-12 col-md-6">
        <SearchClient clients={clients} onChangeFilter={onChangeFilter} />
        <div className="form-group">
          <div className="ml-2">
            <label>Rol:</label>
          </div>
          <Select
            value={selectedRole}
            onChange={(option) => setSelectedRole(option)}
            options={[
              { value: 'user', label: 'CLIENTE' },
              { value: 'admin', label: 'ADMINISTRADOR' },
              { value: 'abogado', label: 'ABOGADO' },
            ]}
            placeholder="Filtrar por Rol..."
            isClearable
          />
        </div>
      </div>
      <div className="col-sm-12 col-md-6">
        <div className="form-group">
          <label>Estado:</label>
          <Select
            value={selectedStatus}
            onChange={(option) => setSelectedStatus(option)}
            options={[
              { value: true, label: 'ACTIVO' },
              { value: false, label: 'INACTIVO' },
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
              <h3 className="card-title">Lista de usuarios</h3>
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
                          Nuevo usuario &nbsp;
                          <i className="nav-icon fas fa-user-plus"></i>
                        </span>
                      </button>
                    </div>
                  </div>

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
                            NOMBRE COMPLETO
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            CORREO ELECTRONICO
                          </th>
                          <th
                            className="sorting"
                            tabIndex="0"
                            aria-controls="example1"
                            rowSpan="1"
                            colSpan="1"
                            aria-label="Browser: activate to sort column ascending"
                          >
                            ROL
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
                        </tr>
                      </thead>
                      <tbody>
                      {currentRecords.map((client) => (
                        <tr key={client._id} style={client.active ? {} : styles.inactiveRow}>
                          <td>{`${client.firstname} ${client.lastname}`}</td>
                          <td>{client.email}</td>
                          <td>{
                            client.role === 'user' ? 'CLIENTE' :
                            client.role === 'admin' ? 'ADMINISTRADOR' :
                            client.role === 'abogado' ? 'ABOGADO' : client.role
                          }</td>
                          <td>{client.active ? 'ACTIVO' : 'INACTIVO'}</td>
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
        <UpdateClient
          selectedClient={selectedClient}
          closeModalUpdateClient={closeModalUpdateClient}
        />
      )}
      {showModalInsertClient && (
        <InsertClient closeModalInsertClient={closeModalInsertClient} />
      )}
    </div>
  );
};
