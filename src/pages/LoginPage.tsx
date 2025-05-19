import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaUnlockAlt, FaUser } from "react-icons/fa";
import { useMutation } from '@tanstack/react-query';
import { setToken } from '../features/auth/authSlice';
import type { AuthCredentials, LoginResponse } from '../types/user';
import { login } from '../api/auth/auth';
import { useAppDispatch } from '../hooks/reduxHook';


function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const mutation = useMutation<LoginResponse, Error, AuthCredentials>({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      dispatch(setToken(data.token));
      navigate('/');
    },
    onError: () => {
      setErrorMessage("Incorrect data, please try again")
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please enter both username and password");
      return;
    }

    mutation.mutate({ username, password });

    setUsername("");
    setPassword("");
    setErrorMessage("");
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrorMessage("");
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrorMessage("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900">
      <div className='flex flex-col justify-center items-center px-4 py-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg'>
        <h2 className="text-[28px] font-bold text-[#333] mb-14">
          Welcome Back!
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-10 w-[350px] px-2"
        >
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={handleEmail}
              className="border-b border-white p-2 w-full outline-none text-[18px]"
              placeholder="Username"
              autoComplete="username"
            />
            <FaUser className="absolute right-0 top-1/3 text-[#333]/40" />
          </div>

          <div className='relative'>
            <input
              type="password"
              value={password}
              onChange={handlePassword}
              className="border-b border-white p-2 w-full outline-none text-[18px]"
              placeholder="Password"
              autoComplete="current-password"
            />
            <FaUnlockAlt className="absolute right-0 top-1/3 text-[#333]/40" />
          </div>

          <button
            type="submit"
            className='bg-[#FAC786]/70 rounded py-1 font-medium text-[18px] active:scale-90 hover:bg-white/50 transition-transform duration-200 ease-in-out cursor-pointer'
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Logging in..." : "Log in"}
          </button>
        </form>
        {
          errorMessage && (
            <p className="text-red-500 font-medium mt-4">{errorMessage}</p>
          )
        }
        <p className="mt-8">
          Don't have an account?
          <span>
            <Link to="/register" className="font-bold underline ml-2 text-[#ED5B1E]">Register</Link>
          </span>
        </p>
      </div>
    </div>
  )
};

export default LoginPage;
