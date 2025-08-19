'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';

type Props = {
  onSearchResult: (results: any[]) => void;
};

type User = {
  username: string;
  id?: number;
  email: string;
  avatarUrl?: string | null;
};

const Header = ({ onSearchResult }: Props) => {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSearch = () => {
    if (!query.trim()) return;

    axios
      .get(`${apiUrl}/ads/search?keyword=${query}`)
      .then((res) => {
        onSearchResult(res.data);
      })
      .catch((err) => {
        console.error('Ошибка поиска:', err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios
      .get(`${apiUrl}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error('Ошибка при получении профиля:', err.response?.status, err.response?.data);
        localStorage.removeItem('token');
      });
  }, []);

  const navProfile = () => {
    navigate.push('/profile')
  }

  return (
    <header className="w-full max-w-screen-xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#E6D8C3] h-20 rounded-2xl shadow-xl flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2 cursor-pointer">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">DomiX</h1>
          <img src="/iconsite.png" alt="logo" className="w-7 sm:w-9" />
        </div>

        <div className="w-[180px] sm:w-[300px] ml-[100px]">
          <TextField
            fullWidth
            placeholder="Поиск..."
            variant="outlined"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon className="text-gray-500 cursor-pointer" onClick={handleSearch} />
                </InputAdornment>
              ),
              style: {
                backgroundColor: 'white',
                borderRadius: '12px',
                border: 'none'
              },
            }}
          />
        </div>

        <div onClick={navProfile} className="flex items-center gap-2 sm:gap-3 cursor-pointer">
          <span className="text-xl text-gray-700 font-medium">
            {user?.username || "Профиль"}
          </span>
          <img
            src={user?.avatarUrl || "https://cdn-icons-png.flaticon.com/512/219/219983.png"}
            alt="user"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;