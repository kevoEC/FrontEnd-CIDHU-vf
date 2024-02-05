import { React, useContext, useEffect, useState } from 'react';
import { fetchJson } from '../../hooks/useFetchJson';
import Modal from '../Modal/Modal';
import { Notify } from '../Modal/Notify';
import Select from 'react-select';
import { AuthContext } from "../Context/AuthContext";

export const InsertClient = ({ closeModalInsertClient }) => {
    const [references, setReferences] = useState([]);
    const [selectedDataReference, setSelectedDataReference] = useState(null);
    const [clientData, setClientData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        role: '',
        active: '',
    });
    const [showNotifyError, setNotifyError] = useState(false);
    const [showNotifySuccess, setNotifySuccess] = useState(false);
    const { loginData } = useContext(AuthContext);

    const handleInsertClient = async () => {
        if (
            clientData.firstname === "" ||
            clientData.lastname === "" ||
            clientData.email === "" ||
            clientData.role === ""
          ) {
            handleShowError();
            return;
        }
        try {
            const requestData = {
                firstname: clientData.firstname,
                lastname: clientData.lastname,
                email: clientData.email,
                role: clientData.role,
                active: false,
                accessToken: loginData.accessToken,
            };

            const responseData = await fetchJson(
                "https://backendcidhu.onrender.com/api/v1/user",
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

    const handleChangeFirstName = (event) => {
        setClientData({ ...clientData, firstname: event.target.value });
    };

    const handleChangeLastName = (event) => {
        setClientData({ ...clientData, lastname: event.target.value });
    };

    const handleChangeEmail = (event) => {
        setClientData({ ...clientData, email: event.target.value });
    };

    // const handleChangeRole = (selectedOption) => {
    //     setClientData({ ...clientData, role: selectedOption.value });
    // };

    const handleChangeRole = (event) => {
        setSelectedDataReference(event || '');
        if (event && event.value) {
            setClientData({ ...clientData, role: event.value });
        }
    };

    // const handleChangeActive = (event) => {
    //     setClientData({ ...clientData, active: event.target.value });
    // };

    const handleChangeActive = (event) => {
        setSelectedDataReference(event || '');
        if (event && event.value) {
            setClientData({ ...clientData, active: event.value });
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

    const optionsReference = references.map((data) => ({
        value: data.reference_id,
        label: data.reference_name,
    }));

    return (
        <Modal
            title="Insertar nuevo cliente"
            body={
                <div className="card card-primary">
                    <div className="card-header">
                        <h3 className="card-title">Datos del cliente</h3>
                        {showNotifyError && <Notify message="Todos los campos son obligatorios" type="error" />}
                        {showNotifySuccess && <Notify message="Datos guardados" type="success" />}
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ingresar nombre"
                                            onChange={handleChangeFirstName}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Apellidos</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ingresar el pellido"
                                            onChange={handleChangeLastName}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Correo Electronico</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ingresa el correo electronico"
                                            onChange={handleChangeEmail}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group col-sm-12">
                                <label>Rol</label>
                                    <Select
                                        placeholder='Selecciona un rol'
                                        options={roleOptions}
                                        onChange={handleChangeRole}
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

const roleOptions = [
    {
        label: "Administrador",
        value: "admin",
    },
    {
        label: "Usuario",
        value: "user",
    },
    {
        label: "Abogado",
        value: "abogado",
    },
]; 

const activeOptions = [
    {
        label: "Activo",
        value: true,
    },
    {
        label: "Inactivo",
        value: false,
    }
]   