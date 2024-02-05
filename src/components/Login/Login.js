import React, { useState, useContext } from "react";
import { fetchJson } from "../../hooks/useFetchJson";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);
  const { updateLoginData } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const requestData = {
        email: email,
        password: password,
      };

      const apiUrl = "https://backendcidhu.onrender.com/api/v1/auth/login";
      const apiUrlme = "https://backendcidhu.onrender.com/api/v1/user/me";
      const responseData = await fetchJson(apiUrl, requestData);
      if (
        responseData.message === "Correo electrónico o contraseña incorrectos"
      ) {
        console.log("El usuario no existe");
      } else if (responseData.message === "Usuario logueado correctamente") {
        //console.log('Usuario válido. ID:', responseData.userSecId);
        const responseData2 = await fetchJson(apiUrlme, {accessToken: responseData.accessToken});
        await updateLoginData({
          accessToken: responseData.accessToken,
          refreshToken: responseData.refreshToken,
          _id: responseData2._id
        });
        setIsLoggedIn(true);
        navigate("/main");
      } else {
        console.log("Respuesta inesperada de la API:", responseData);
      }
      setIsLoggedIn(true);
      navigate("/main");
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: "495.6px" }}>
      <div className="login-box">
        <div className="login-logo">
          <a href="/login">
            <b>CIDHU </b>Abogados
          </a>
        </div>

        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">
              Ingrese las credenciales para iniciar sesión
            </p>
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  value={email} // Asigna el valor de email al input
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password} // Asigna el valor de password al input
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Recordar credenciales</label>
                  </div>
                </div>

                <div className="col-4">
                  <button type="submit" className="btn btn-primary btn-block">
                    Sign In
                  </button>
                </div>
              </div>
            </form>

            <p className="mb-1">
              <a href="forgot-password.html">Olvidé mi contraseña</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
