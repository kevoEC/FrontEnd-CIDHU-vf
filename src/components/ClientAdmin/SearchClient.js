import React, { useState, useEffect } from 'react';
import Select from 'react-select';

const SearchClient = ({ clients, onChangeFilter }) => {
  const [selectedClient, setSelectedClient] = useState(null);

  const handleClientChange = (selectedOption) => {
    setSelectedClient(selectedOption);
    if (selectedOption) {
      onChangeFilter(selectedOption);
    } else {
      onChangeFilter(null); // O considera mantener la lista completa si no hay selección
    }
  };

  useEffect(() => {
    console.log('Cliente seleccionado:', selectedClient);
  }, [selectedClient]);

  const options = clients.map((client) => ({
    value: client._id,
    label: `${client.firstname} ${client.lastname}`, // Puedes personalizar cómo se muestra el nombre del cliente
  }));

  return (
    <div>
      <div className="form-group col-sm-12">
        <label>Seleccionar el Usuario:</label>
        <Select
          value={selectedClient}
          onChange={handleClientChange}
          options={options}
          placeholder="Buscar cliente..."
          isClearable
        />
      </div>
    </div>
  );
};

export default SearchClient;
