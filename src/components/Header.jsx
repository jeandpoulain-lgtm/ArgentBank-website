import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// Assure-toi d'importer l'action de déconnexion selon ton architecture (par exemple depuis ton authSlice)
// import { logout } from "../redux/authSlice"; 

export default function Header() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // On récupère le token et les infos utilisateur depuis le store Redux
    const token = useSelector((state) => state.auth?.token);
    const userName = useSelector((state) => state.auth?.user?.userName);

    const handleSignOut = (e) => {
        e.preventDefault();
        // 1. Dispatch l'action de déconnexion (ou vide le state auth)
        // dispatch(logout());
        
        // 2. Nettoie le stockage local si tu stockes le token dedans
        localStorage.clear();
        sessionStorage.clear();

        // 3. Redirige vers la page d'accueil
        navigate("/");
        // Optionnel : un petit rechargement si nécessaire pour tout réinitialiser proprement
        window.location.reload();
    };

    return (
        <nav className="main-nav">
            <Link className="main-nav-logo" to="/">
                <img
                    className="main-nav-logo-image"
                    src="./img/argentBankLogo.webp"
                    alt="Argent Bank Logo"
                />
                <h1 className="sr-only">Argent Bank</h1>
            </Link>
            <div>
                {token ? (
                    // Si l'utilisateur est CONNECTÉ
                    <div>
                        <Link className="main-nav-item" to="/user">
                            <i className="fa fa-user-circle"></i>
                            {userName || "Mon Profil"}
                        </Link>
                        <Link className="main-nav-item" to="/" onClick={handleSignOut}>
                            <i className="fa fa-sign-out"></i>
                            Sign Out
                        </Link>
                    </div>
                ) : (
                    // Si l'utilisateur est DÉCONNECTÉ
                    <Link className="main-nav-item" to="/login">
                        <i className="fa fa-user-circle"></i>
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
