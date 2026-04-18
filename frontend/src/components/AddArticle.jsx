import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";

function AddArticle(){

const {register,handleSubmit,formState:{errors},reset} = useForm();

const [loading,setLoading] = useState(false);
const navigate = useNavigate();
const currentUser = useAuth(state => state.currentUser);

const onSubmit = async(data)=>{

  setLoading(true);

  // add author id
  data.author = currentUser._id;

  try{
    await axios.post(
      "http://localhost:4000/author-api/articles",
      data,
      { withCredentials: true }
    );

    toast.success("Article published successfully!");

    reset();
    navigate("/author-profile");

  }catch(err){
    toast.error(err.response?.data?.error || "Failed to publish article");
  }finally{
    setLoading(false);
  }
}

if(loading){
  return <p className="text-2xl text-center mt-10">Publishing...</p>
}

return(

<div className="flex justify-center items-center min-h-screen bg-slate-100">

<form onSubmit={handleSubmit(onSubmit)} className="bg-teal-50 p-8 w-96 shadow-md rounded">

<h2 className="text-xl font-bold text-center mb-4">Add Article</h2>

{/* TITLE */}

<input
placeholder="Title"
className="w-full border p-2 mb-2 rounded"
{...register("title",{required:"Title is required"})}
/>

<p className="text-red-500 text-sm">{errors.title?.message}</p>


{/* CATEGORY */}

<input
placeholder="Category"
className="w-full border p-2 mb-2 rounded"
{...register("category",{required:"Category is required"})}
/>

<p className="text-red-500 text-sm">{errors.category?.message}</p>


{/* CONTENT */}

<textarea
placeholder="Content"
rows="4"
className="w-full border p-2 mb-4 rounded"
{...register("content",{required:"Content is required"})}
/>

<p className="text-red-500 text-sm">{errors.content?.message}</p>


<button 
className="bg-teal-500 hover:bg-teal-600 text-white w-full py-2 rounded-xl cursor-pointer"
disabled={loading}
>
{loading ? "Publishing..." : "Publish Article"}
</button>

</form>

</div>
)
}

export default AddArticle;