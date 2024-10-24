import { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import toast from "react-hot-toast";

import Breadcrumbs from "../../components/Breadcrumbs ";

import { useNavigate, Link } from "react-router-dom";

import useToastStore from "../../store/toastStore";
import useStoreCliente from "../../store/useStoreClientes";

// Yup
const schema = yup.object().shape({
  nombreCompleto: yup.string().required("El nombre es obligatorio."),
  email: yup.string().email("El correo no es valido."),
  telefono: yup.string().required("El teléfono es obligatorio."),
  direccion: yup.string(),
});

export default function CreateCliente() {
  const navigate = useNavigate();

  // Stores
  const crearCliente = useStoreCliente((state) => state.createCliente);
  const { fetchClientes } = useStoreCliente();
  const showToast = useToastStore((state) => state.showToast);

  // React-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // UseEffect
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const onSubmit = async (data) => {
    const nuevoCliente = {
      ...data,
    };

    toast.promise(
      crearCliente(nuevoCliente),
      {
          loading: 'Creando producto...',
          success: () => {
              fetchClientes()
              showToast('Cliente creado con éxito!', 'success');
              navigate('/clientes'); 
              return 'Cliente creado con éxito!';
          },
          error: () => {
              showToast('No se pudo crear el cliente.', 'error');
              return 'No se pudo crear el cliente.'; 
          },
      }
    );
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <div className="mt-6 h-[600px] overflow-y-auto">
        <Breadcrumbs
          items={[
            { label: "Clientes", link: "/clientes" },
            { label: "Crear Cliente", link: "/clientes/createcliente" },
          ]}
        />

        <div>
          <h2 className="font-bold text-3xl text-gray-500">Crear Cliente</h2>
          <p className="text-gray-600">
            Complete el formulario para agregar un nuevo cliente.
          </p>
        </div>

        <form
          className="mt-6 grid grid-cols-2 row items-start gap-4 bg-white rounded-lg shadow-lg p-6"
          onSubmit={handleSubmit((data) => {
            console.log(data)
            onSubmit(data);
          })}
        >
          <div>
            <label className="block text-gray-700 font-semibold">Nombre:</label>
            <input
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ingresa el nombre del cliente"
              type="text"
              {...register("nombreCompleto")}
            />
            {errors.nombreCompleto && (
              <p className="text-red-500">{errors.nombreCompleto.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Correo:</label>
            <input
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ingresar correo electronico"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Telefono:
            </label>
            <input
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ingresar numero de telefono"
              type="tel"
              {...register("telefono")}
            />
            {errors.telefono && (
              <p className="text-red-500">{errors.telefono.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">
              Direccion:
            </label>
            <input
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Ingresar direccion del cliente"
              type="direccion"
              {...register("direccion")}
            />
            {errors.direccion && (
              <p className="text-red-500">{errors.direccion.message}</p>
            )}
          </div>
          <div className="w-full mt-4 col-span-3">
            <button
              type="submit"
              className="w-full p-2 bg-green-400 text-white rounded hover:bg-green-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-200"
            >
              Crear Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
