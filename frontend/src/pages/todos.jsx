import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import getAxiosClient from "../axios-instance.js";

export default function Todos(){

  const modalRef = useRef();

  const { mutate: createNewTodo } = useMutation({
    // The key used to identify this mutation in React Query's cache
    mutationKye: ["newTodo"],

    // The function that performs the mutation (i.e., creating a new to-do)
    mutationFn: async (newTodo) => {
      const axiosInstance = await getAxiosClient();

      // use the Axios instance to make a POST request to the server, sending the new to-do data
      const { data } = await axiosInstance.post("http://localhost:8080/todos", newTodo);

      // Return the response data (e.g., the newly created to-do object)
      return data;
    }
  })

  const { data, isError, isLoading } = useQuery({
    // A unique key to identify this query in React Query's cache
    queryKey: ["todos"],

    // The function responsible for fetching the data
    queryFn: async () => {
      const axiosInstance = await getAxiosClient();

      // Use the Axios instance to send a GET request to fetch the list of todos
      const { data } = await axiosInstance.get("http://localhost:8080/todos");

      //Return the fetched data (React Query will cache it under the querKey)
      return data;
    }
  });

  const toggleNewTodoModal = () => {
    // Check if the modal is currently open by accessing the `open` property of `modalRef`.
    if (modalRef.current.open){
      // If the modal is open, close it by calling the `close()` method
      modalRef.current.close();
    } else {
      // If the modal is not open, open it by calling the `showModal()` method.
      modalRef.current.showModal();
    }
  }

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      description: ""
    }
  });

  const handleNewTodo = (values) => {
    console.log(values);
    toggleNewTodoModal();
  }

  function NewTodoButton(){
    return (
      <button className="btn btn-primary" onClick={() => toggleNewTodoModal()}>
        New Todo
      </button>
    );
  }

  function TodoModal() {
    return (
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">New Todo</h3>
          <form onSubmit={handleSubmit(handleNewTodo)}>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Name of Todo</span>
              </div>
              <input 
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                { ...register("name")}
              />
            </label>
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Description
                </span>
              </div>
              <input
                type="text"
                placeholder="Type here"
                className="input input-bordered w-full"
                { ...register("description")}
              />
            </label>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Create Todo
              </button>
              <button type="button" className="btn btn-ghost" onClick={toggleNewTodoModal}>
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>
    );
  }

  function TodoItemList() {
    return (
      <div className="w-lg h-sm flex column items-center justify-center gap-4">
        {data.success && data.todos && data.todos.length >= 1 ? (
          <ul className="flex column items-center justify-center gap-4">
            {
              data.todos.map(todo => (
                <li className="inline-flex items-center gap-4">
                  <div className="w-md">
                    <h3 className="text-lg">
                      {todo.name}
                    </h3>
                    <p className="text-sm">{todo.description}</p>
                  </div>
                  <div className="w-md">
                    <label className="swap">
                      <input type="checkbox" onClick={() => markAsCompleted(todo.id)} />
                      <div className="swap-on">
                        Yes
                      </div>
                      <div className="swap-off">
                        No
                      </div>
                    </label>
                  </div>
                </li>
              ))
            }
          </ul>
        ) : <p>There are currently no to-dos in your Todo list. Go add one right now... Get to it!</p>}
      </div>
    );
  }

  if (isLoading){
    return (
      <div>Loading Todos...</div>
    );
  }

  if (isError){
    return (
      <div>There was an error</div>
    );
  }

  return (
    <>
      <NewTodoButton/>
      <TodoItemList/>
      <TodoModal/>
    </>
  )
}
