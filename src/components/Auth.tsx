import { useState } from "react";
import { supabase } from "../../lib/supabase";
import styles from "./Auth.module.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggle entre login e cadastro
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (isLogin) {
      // Login
      const { user, error: loginError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginError) {
        setError(loginError.message);
      } else {
        // Redirecionar ou fazer outra coisa após o login
      }
    } else {
      // Cadastro
      const { user, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signupError) {
        setError(signupError.message);
      } else {
        // Redirecionar ou fazer outra coisa após o cadastro
      }
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      setError(error.message);
    } else {
      // Redirecionar ou fazer outra coisa após login com Google
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <h2>{isLogin ? "Login" : "Cadastro"}</h2>

        <form onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}

          <input
            type="email"
            className={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className={styles.input}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Carregando..." : isLogin ? "Login" : "Cadastrar"}
          </button>
        </form>

        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          Login com Google
        </button>

        <p>
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <span className={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Cadastre-se" : "Faça login"}
          </span>
        </p>
      </div>
    </div>
  );
}
