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
    console.log('Denuncia seleccionada:', selectedClient);
  }, [selectedClient]);

  const options = clients.map((client) => ({
    value: client._id,
    label: `${client.responsables}`, // Puedes personalizar cómo se muestra el nombre del cliente
  }));

  return (
    <div>
      <div className="form-group col-sm-12">
        <label>Seleccionar la denuncia:</label>
        <Select
          value={selectedClient}
          onChange={handleClientChange}
          options={options}
          placeholder="Buscar denuncia"
          isClearable
        />
      </div>
    </div>
  );
};

export default SearchClient;
