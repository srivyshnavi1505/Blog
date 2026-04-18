import { useAuth } from "../store/authStore.js"

import {  Navigate, redirect } from "react-router";


function ProtectedRoute({children, allowedRoles}) {

const {loading, currentUser, isAuthenticated}  = useAuth();

//loading state 

if(loading){
    return <p>Loading..</p>

}
//if user is not logged in 
if(!isAuthenticated){
    //redirect to log in 
    return <Navigate to = "/login" replace/>
}
//check roles
if(allowedRoles && !allowedRoles.includes(currentUser?.role)){
  
  return <Navigate to="/unauthorized" replace state={{redirectTo: "/login"}} />;
}


  return children
}

export default ProtectedRoute 