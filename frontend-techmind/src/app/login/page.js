'use client';
import { useState } from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import api from '../../lib/api';
import useAuth from '../../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/Ui/ToastProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();
  const { show } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login({ token: res.data.token, user: res.data.user });
      show('Login efetuado', 'success');
      router.push('/');
    } catch (err) {
      show(err.message || 'Erro ao efetuar login', 'error');
    }
  };

  return (
    <Container maxWidth="xs">
      <Card sx={{ mt: 12 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Entrar
          </Typography>
          <form onSubmit={onSubmit}>
            <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Senha" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}