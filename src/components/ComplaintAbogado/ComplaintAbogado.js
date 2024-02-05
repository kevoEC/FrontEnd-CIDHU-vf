import React, { useState, useEffect, useContext } from 'react';
import { fetchJson } from '../../hooks/useFetchJson';
import { AuthContext } from '../Context/AuthContext';
import { FaUser, FaFileAlt } from 'react-icons/fa';

export const ComplaintAbogado = () => {
    const { loginData } = useContext(AuthContext);
    const [relaciones, setRelaciones] = useState([]);

    useEffect(() => {
        fetchRelaciones();
    }, []);

    const fetchRelaciones = async () => {
        try {
            const requestData = {
                accessToken: loginData.accessToken,
            };

            const responseData = await fetchJson(
                'https://backendcidhu.onrender.com/api/v1/relaciones',
                requestData
            );

            if (Array.isArray(responseData.data) && responseData.data.length > 0) {
                setRelaciones(responseData.data);
            } else {
                setRelaciones([]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Relaciones de Denuncias</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Usuario</th>
                        <th>Denuncia</th>
                        <th>Fecha de Creación</th>
                        <th>Fecha de Actualización</th>
                    </tr>
                </thead>
                <tbody>
                    {relaciones.map((relacion) => (
                        <>
                            <tr key={relacion._id}>
                                <td>{relacion._id}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaUser size={24} style={{ marginRight: '8px' }} />
                                        <div>
                                            <div>{`${relacion.user.firstname} ${relacion.user.lastname}`}</div>
                                            <div>{relacion.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FaFileAlt size={24} style={{ marginRight: '8px' }} />
                                        <div>
                                            <div>Carácter: {relacion.denuncia.caracter}</div>
                                            <div>Instancia: {relacion.denuncia.instancia}</div>
                                            <div>Resumen de Hechos: {relacion.denuncia.resumenHechos}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{relacion.createdAt}</td>
                                <td>{relacion.updatedAt}</td>
                            </tr>
                            <hr />
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
