import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import API from "../config/axiosConfig";
import { useNavigate } from "react-router";

function Register() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const OnUserRegister = async (newUser) => {
    setLoading(true);

    const formData = new FormData();
    let { role, ProfileImageUrl, ...userObj } = newUser;

    Object.keys(userObj).forEach((key) => {
      formData.append(key, userObj[key]);
    });
    formData.append("role", role);

    if (ProfileImageUrl && ProfileImageUrl.length > 0) {
      formData.append("ProfileImageUrl", ProfileImageUrl[0]);
    }

    try {
      const url = role === "USER" ? "/user-api/users" : "/author-api/users";
      const resObj = await API.post(url, formData);

      if (resObj.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    OnUserRegister(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 text-lg">Creating your account...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            ink IT<span className="text-teal-400">.</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-5"
        >
          {/* API ERROR */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded">
              {error}
            </p>
          )}

          {/* FILE ERROR */}
          {fileError && (
            <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded">
              {fileError}
            </p>
          )}

          {/* ROLE */}
          <div>
            <label className="text-zinc-400 text-sm mb-2 block">I am a</label>
            <div className="flex gap-4">
              {["USER", "AUTHOR"].map((r) => (
                <label key={r} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={r}
                    {...register("role", { required: "Role is required" })}
                    className="accent-teal-500"
                  />
                  <span className="text-zinc-300 text-sm">
                    {r === "USER" ? "User" : "Author"}
                  </span>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="text-red-400 text-xs">{errors.role.message}</p>
            )}
          </div>

          {/* NAME */}
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                placeholder="First Name"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                {...register("firstName", { required: "First name is required" })}
              />
              <p className="text-red-400 text-xs mt-1">{errors.firstName?.message}</p>
            </div>
            <div className="flex-1">
              <input
                placeholder="Last Name"
                className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
                {...register("lastName", { required: "Last name is required" })}
              />
              <p className="text-red-400 text-xs mt-1">{errors.lastName?.message}</p>
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <input
              placeholder="Email"
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Invalid email format",
                },
              })}
            />
            <p className="text-red-400 text-xs mt-1">{errors.email?.message}</p>
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full bg-zinc-800 border border-zinc-700 text-white px-4 py-2.5 rounded-lg focus:border-teal-500 focus:outline-none transition-colors"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            <p className="text-red-400 text-xs mt-1">{errors.password?.message}</p>
          </div>

          {/* FILE */}
          <div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-400 px-4 py-2.5 rounded-lg"
              {...register("ProfileImageUrl")}
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setFileError("Only JPG or PNG allowed");
                    return;
                  }
                  if (file.size > 2 * 1024 * 1024) {
                    setFileError("File size must be less than 2MB");
                    return;
                  }
                  setPreview(URL.createObjectURL(file));
                  setFileError(null);
                }
              }}
            />
          </div>

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-20 h-20 rounded-full border-2 border-teal-500 object-cover"
              />
            </div>
          )}

          {/* BUTTON */}
          <button className="w-full bg-teal-500 hover:bg-teal-400 text-white py-2.5 rounded-lg font-semibold transition-colors">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
