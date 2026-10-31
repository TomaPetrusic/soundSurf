import FilterWave from "../components/FilterWave";
import LoginButton from "../components/LoginButton";
import "./Login.css";

export default function Login() {
  return (
    <div className="login">
      <FilterWave />
      <header className="login-header">SoundSurf / Prijava</header>

      <main className="login-main">
        <h1 className="login-title">
          <span>Sound</span>
          <span>Surf</span>
        </h1>
        <p className="login-slogan">
          Surfaj preko valova, surfaj preko neta, surfaj po muzici iz cijeloga
          svijeta.
        </p>
        <LoginButton />
        <p className="login-note">
          Prvi put ovdje? Račun se otvara automatski pri prvoj prijavi.
        </p>
      </main>
    </div>
  );
}
