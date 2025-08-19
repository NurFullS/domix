'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Input, Button, FormControlLabel, Checkbox } from '@mui/material';

interface FormFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, type = "text", value, onChange, placeholder, error }) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-[#4b3f33] font-medium">{label}</label>
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      sx={{
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '1rem',
        backgroundColor: '#d6c7a1',
        color: '#4b3f33',
        '&:focus': { boxShadow: '0 0 0 3px rgba(184, 143, 92, 0.4)' }
      }}
    />
    {error && <span className="text-red-600 text-sm">{error}</span>}
  </div>
);

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const navigate = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const validate = () => {
    if (username.length < 3) return 'Имя должно содержать минимум 3 символа';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Некорректный email';
    if (password.length < 6) return 'Пароль должен быть минимум 6 символов';
    if (!agree) return 'Необходимо согласиться с условиями';
    return '';
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setError('');
    };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/users/register`, {
        username,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      navigate.replace('/');
    } catch (error: any) {
      let msg = 'Ошибка регистрации';
      if (error.response?.data) {
        msg = typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data);
      }
      setError(msg);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate.replace('/main');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0d6c3] p-6">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg p-10 rounded-3xl bg-[#cbbf9f]/90 backdrop-blur-md shadow-md flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-[#4b3f33] text-center mb-6">
          Регистрация
        </h2>

        <FormField
          label="Email"
          type="email"
          value={email}
          onChange={handleChange(setEmail)}
          placeholder="Введите email"
          error={error.includes('email') ? error : ''}
        />

        <div className="flex justify-between gap-4">
          <FormField
            label="Имя пользователя"
            value={username}
            onChange={handleChange(setUsername)}
            placeholder="Введите имя"
            error={error.includes('Имя') ? error : ''}
          />

          <FormField
            label="Пароль"
            type="password"
            value={password}
            onChange={handleChange(setPassword)}
            placeholder="Введите пароль"
            error={error.includes('Пароль') ? error : ''}
          />
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              sx={{
                color: '#4b3f33',
                '&.Mui-checked': { color: '#b99f75' }
              }}
            />
          }
          label={<span className="text-[#4b3f33] text-sm">Я согласен с <a href="/terms" className="underline">условиями</a> и <a href="/privacy" className="underline">политикой конфиденциальности</a></span>}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!agree}
          sx={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            backgroundColor: agree ? '#b99f75' : '#a88e64',
            color: '#fff6e5',
            '&:hover': { backgroundColor: agree ? '#a88e64' : '#a88e64' },
          }}
        >
          Зарегистрироваться
        </Button>

        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        <p className="text-center text-[#4b3f33] text-sm">
          Уже есть аккаунт?{' '}
          <a href="/login" className="hover:underline font-medium">
            Войти
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
