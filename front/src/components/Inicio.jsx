// Importa los componentes necesarios de react-router-dom para la navegación y la gestión de ubicaciones
import { Outlet, Link, useLocation } from "react-router-dom";

// Define el componente Inicio, una función que será exportada para su uso en otros archivos
export function Inicio() {
    // Utiliza useLocation para obtener información sobre la ubicación actual en la que se encuentra el usuario
    const location = useLocation();

    // Retorna el JSX para renderizar el componente
    return (
        <div className="container d-flex flex-column min-vh-100">
            {/* Define un elemento de navegación con clases de Bootstrap para el estilo*/}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                {/* Contenedor fluido para asegurar que el contenido del nav se ajuste al ancho del contenedor padre*/}
                <div className="container-fluid">
                    {/* Div contenedor para el logo con enlace a la página principal*/}
                    <div className="navbar-logo col-md-3">
                        <Link to="/">
                            {/* Imagen del logo con su ruta y clases para el estilo*/}
                            <img src="/img/logo500x500.png" alt="Logo" className="logo-img" />
                        </Link>
                    </div>
                    {/* Div contenedor para el título de la página, con estilos de Bootstrap para centrarlo*/}
                    <div className="navbar-title d-lg-flex justify-content-center align-items-center col-md-4 text-center">
                        {/* Elemento span que contiene el título de la página en un elemento h1*/}
                        <span><p><h1>Build Private</h1></p><h1>Ethereum Networks</h1></span>
                    </div>
                    {/* Contenedor para los botones de navegación con un botón toggler para dispositivos móviles*/}
                    <div className="navbar-buttons col-md-3">
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                            {/* Icono del botón toggler*/}
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        {/*  Div que se colapsará en dispositivos móviles, contiene los enlaces de navegación*/}
                        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                            {/*  Navegación con enlaces a diferentes rutas de la aplicación*/}
                            <div className="navbar-nav">
                                {/*  Condición para mostrar el enlace a Inicio solo si la ruta actual no es la página principal*/}
                                {location.pathname !== "/" && (
                                    <Link className="nav-item nav-link" to="/">Inicio</Link>
                                )}
                                {/*  Enlaces a las diferentes secciones de la aplicación*/}
                                <Link className="nav-item nav-link" to="/perfil">Perfil</Link>
                                <Link className="nav-item nav-link" to="/redes">Redes</Link>
                                <Link className="nav-item nav-link" to="/nodos">Nodos</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Outlet actúa como un marcador de posición para los componentes hijos que se renderizan en esta ruta */}
            {/* El componente Outlet y su contenido se expandirán para llenar el espacio disponible, empujando el footer hacia abajo*/}
            <main className="flex-grow-1">
                <Outlet />
            </main>
            {/* Componente Footer para ser usado en toda la aplicación */}
            <footer className="footer mt-auto py-3">
                <div className="container">
                    {/* Usa flexbox para alinear los elementos en filas y permitir una distribución responsiva */}
                    <div className="row justify-content-between">
                        {/* Columna para enlaces rápidos con ajustes de responsividad y alineación */}
                        <div className="col-md-4 text-center text-md-left mb-3 mb-md-0">
                            <h5>Enlaces Rápidos</h5>
                            {/* Lista de enlaces rápidos para navegación interna usando Link de React Router */}
                            <ul className="list-unstyled">
                                <li><Link to="quienes-somos" className="text-dark">Quiénes somos</Link></li>
                                <li><Link to="privacidad" className="text-dark">Privacidad</Link></li>
                                <li><Link to="terminos-y-condiciones" className="text-dark">Términos y condiciones</Link></li>
                            </ul>
                        </div>
                        {/* Columna central para información de contacto */}
                        <div className="col-md-4 text-center">
                            <h5>Contacto</h5>
                            {/* Dirección de correo electrónico como punto de contacto */}
                            <p className="mb-0">contacto@bpen.com</p>
                            {/* Logo de la empresa */}
                            <img src="/img/logo500x500.png" alt="Logo" />
                        </div>
                        {/* Columna para iconos de redes sociales con enlaces externos */}
                        <div className="col-md-4 d-flex justify-content-center align-items-center mb-3 mb-md-0">
                            {/* Enlaces a redes sociales que abren en una nueva pestaña para mantener al usuario en la página */}
                            <a href="https://www.tiktok.com/@cryptospace_es" target="_blank" rel="noopener noreferrer">
                                <p><img className="icono-social" src="/img/TIK-full.png" alt="Tiktok" /></p>
                            </a>
                            <a href="https://twitter.com/cryptospace_es" target="_blank" rel="noopener noreferrer">
                                <p><img className="icono-social" src="/img/x-full.png" alt="X" /></p>
                            </a>
                            <a href="https://t.me/CryptoSpace_ES_Portal" target="_blank" rel="noopener noreferrer">
                                <p><img className="icono-social" src="/img/TG-full.png" alt="Telegram" /></p>
                            </a>
                            <a href="https://instagram.com/cryptospace_es" target="_blank" rel="noopener noreferrer">
                                <p><img className="icono-social" src="/img/I-full.png" alt="Instagram" /></p>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}
