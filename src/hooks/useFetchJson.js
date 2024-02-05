export async function fetchJson(url, requestData, additionalOptions = {}) {
  console.log("URL OFICIAL");
  console.log(requestData);
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${requestData.accessToken}`,
        ...additionalOptions.headers, // Incluir encabezados personalizados si se proporcionan
      },
      body: JSON.stringify(requestData),

      ...additionalOptions, // Incluir otros parámetros de solicitud personalizados
    };
    console.log(requestData.accessToken);
    const response = await fetch(url, options);
    console.log("RESPUESTA OFICIAL");
    // const response2 = await response.json();
    // console.log(response2);
    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        console.error("Error 400: ", errorData);
        throw new Error("Error en la solicitud: " + JSON.stringify(errorData));
      } else {
        throw new Error(
          "Error al enviar la solicitud, codigo de estado: " + response.status
        );
      }
    }

    const responseData = await response.json();

    // Validar la respuesta según el formato y los datos esperados
    if (!responseData || (responseData.error && !responseData.data)) {
      throw new Error("Respuesta inválida de la API");
    }

    return responseData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Relanzar el error para que pueda ser manejado externamente
  }
}
