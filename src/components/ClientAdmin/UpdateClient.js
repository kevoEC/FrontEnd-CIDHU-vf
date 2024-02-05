import { React, useContext, useEffect, useState } from 'react'
import { fetchJson } from '../../hooks/useFetchJson';
import Modal from '../Modal/Modal';
import Select from 'react-select';
import { Notify } from '../Modal/Notify';
import { AuthContext } from "../Context/AuthContext";


export const UpdateClient = ({ selectedClient, closeModalUpdateClient }) => {

    const [showNotifyError, setNotifyError] = useState(false);
    const [showNotifySuccess, setNotifySuccess] = useState(false);
    const [selectedDataReference, setSelectedDataReference] = useState({ value: selectedClient.status_id, label: selectedClient.reference_name });
    const { loginData } = useContext(AuthContext);
    const [references, setReferences] = useState([]);
    const selectedRoleOption = roleOptions.find(option => option.value === selectedClient.role);
    const selectedActiveOption = activeOptions.find(option => option.value === selectedClient.active);

    const [clientData, setClientData] = useState({
        _id: selectedClient._id,
        firstname: selectedClient.firstname,
        lastname: selectedClient.lastname,
        email: selectedClient.email,
        role: selectedClient.role,
        active: selectedClient.active,
        accessToken: loginData.accessToken,
    });


    const fetchDataReference = async () => {

        try {
            const requestData = {
                referenceTableName: 'common.client',
                referenceField: 'client_status_id',
                accessToken: loginData.accessToken,
            };

            const responseData = await fetchJson(
                'http://localhost:3000/app/apiReference/apiReference.php/listReference',
                requestData
            );

            setReferences(responseData.data);
        } catch (error) {
            console.error(error);
            // Maneja el error de la manera que prefieras
        }
    };

    useEffect(() => {
        fetchDataReference();
    }, []);

    const handleUpdateClientAdmin = async () => {

        if (
            clientData.firstname === '' || 
            clientData.lastname === '' || 
            clientData.email === '' ||
            clientData.role === '' || 
            clientData.active === ''
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
                active: clientData.active,
                accessToken: loginData.accessToken,
            };

            const responseData = await fetchJson(
                `https://backendcidhu.onrender.com/api/v1/userU/${clientData._id}`,
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


    const handleChangeFirstName = (event) => {
        setClientData({ ...clientData, lastNameClient: event.target.value });
    };

    const handleChangeLastName = (event) => {
        setClientData({ ...clientData, lastNameClient: event.target.value });
    };

    const handleChangeEmail = (event) => {
        setClientData({ ...clientData, email: event.target.value });
    };

    const handleChangeRole = (event) => {
        setSelectedDataReference(event || '');
        if (event && event.value) {
            setClientData({ ...clientData, role: event.value });
        }
    };

    const handleChangeStatus = (event) => {
        setSelectedDataReference(event || '');
        if (event && event.value) {
            setClientData({ ...clientData, active: event.value });
        }
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
            title="Editar Cliente"
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
                                        <label>Id</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={selectedClient._id}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={selectedClient.firstname}
                                            placeholder="Ingresar nombre"
                                            onChange={handleChangeFirstName}
                                        />
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label>Ruc</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            defaultValue={selectedClient.lastname}
                                            placeholder="Ingresar RUC"
                                            onChange={handleChangeLastName}
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
                                            defaultValue={selectedClient.email}
                                            onChange={handleChangeEmail}
                                        />
                                    </div>
                                </div>


                                <div className="form-group col-sm-12">
                                <label>Rol</label>
                                    <Select
                                        placeholder='Selecciona el rol del usuario'
                                        options={roleOptions}
                                        onChange={handleChangeRole}
                                        defaultValue={selectedRoleOption}
                                    />
                                
                                </div>


                                <div className="form-group col-sm-12">
                                <label>Estado</label>
                                    <Select
                                        placeholder='Selecciona el estado del usuario'
                                        options={activeOptions}
                                        onChange={handleChangeStatus}
                                        defaultValue={selectedActiveOption}
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
            handleButton2Click={handleUpdateClientAdmin}
            closeModalUpdateClient={closeModalUpdateClient}
        />
    )  
}


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






