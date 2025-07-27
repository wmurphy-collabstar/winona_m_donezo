import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import supabase from "../client";

export default function ProtectedRoute({ children }){
    const [session, setSession] = useState();
    const [isSessionChecked, setIsSessionChecked] = useState(false);

}
