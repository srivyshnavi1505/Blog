import { useForm } from "react-hook-form";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import { useNavigate, NavLink } from "react-router";
import { toast } from "react-hot-toast";

function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const Error = useAuth((state) => state.error);
  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (currentUser.role === "USER") {
        toast.success("Logged in successfully");
        navigate("/user-profile");
      }
      if (currentUser.role === "AUTHOR") {
        toast.success("Logged in successfully");
        navigate("/author-profile");
      }
    }
  }, [isAuthenticated, currentUser]);

  const onSubmit = (data) => {
    onUserLogin(data);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">

      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            ink IT<span className="text-teal-400">.</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-5"
        >
          {Error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {Error}
            </p>
          )}

          <div>
            <label className="text-zinc-400 text-sm mb-1.5 block">Email</label>
            <input
              placeholder="you@example.com"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-teal-500 focus:outline-none text-white placeholder-zinc-500 px-4 py-2.5 rounded-lg transition-colors"
              {...register("email", { required: "Email is required" })}
            />
            <p className="text-red-400 text-xs mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <label className="text-zinc-400 text-sm mb-1.5 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-teal-500 focus:outline-none text-white placeholder-zinc-500 px-4 py-2.5 rounded-lg transition-colors"
              {...register("password", { required: "Password is required" })}
            />
            <p className="text-red-400 text-xs mt-1">{errors.password?.message}</p>
          </div>

          <button className="w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">
            Sign In
          </button>

          <p className="text-zinc-500 text-sm text-center">
            Don't have an account?{" "}
            <NavLink to="/register" className="text-teal-400 hover:text-teal-300">
              Register
            </NavLink>
          </p>

        </form>
      </div>

    </div>
  );
}

export default Login;
