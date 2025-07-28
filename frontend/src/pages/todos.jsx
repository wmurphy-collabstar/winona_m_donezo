import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function Todos(){

  function NewTodoButton(){
    return (
      <button className="btn btn-primary" onClick={() => toggleNewTodoModal()}>
        New Todo
      </button>
    );
  }

  return (
    <>
      <NewTodoButton/>
    </>
  )
}
