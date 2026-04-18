import { useEffect } from "react";
import { useNavigate } from "react-router";

const Unauthorized = ({ redirectTo = "/login", delay = 2000 }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(redirectTo, { replace: true });
    }, delay);

    return () => clearTimeout(timer);
  }, [navigate, redirectTo, delay]);

 return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center">
      <p className="text-teal-400 text-sm font-semibold uppercase tracking-widest mb-3">403</p>
      <h1 className="text-4xl font-bold text-white mb-3">Unauthorized</h1>
      <p className="text-zinc-500 mb-2">You don't have permission to access this page.</p>
      <p className="text-zinc-600 text-sm">Redirecting you back...</p>
    </div>
  );
};

export default Unauthorized;