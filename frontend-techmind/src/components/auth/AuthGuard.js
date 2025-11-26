'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { CircularProgress, Box, Typography } from '@mui/material';
import useAuth from '../../hooks/authContext';
import { TIPO_USUARIO } from '../../lib/constants';

export default function AuthGuard({ children }) {
  const { user, loading, signed } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const verifyAccess = () => {
      const publicRoutes = ['/login', '/cadastro_usuario'];
      if (publicRoutes.includes(pathname)) {
        if (!loading && signed) {
           const tipoId = user?.tipoUsuario?.id || user?.tipo_usuario_id;
           if (tipoId === TIPO_USUARIO.SOLICITANTE) router.replace('/solicitante/dashboard');
           else if (tipoId === TIPO_USUARIO.ATENDENTE) router.replace('/atendente/dashboard');
           else if (tipoId === TIPO_USUARIO.ADMINISTRADOR) router.replace('/admin/dashboard');
           return;
        }
        setAuthorized(true);
        return;
      }

      if (loading) return;

      if (!signed) {
        setAuthorized(false);
        router.replace('/login');
        return;
      }

      const userTypeId = Number(user?.tipoUsuario?.id || user?.tipo_usuario_id);

      if (pathname.startsWith('/admin') && userTypeId !== TIPO_USUARIO.ADMINISTRADOR) {
        setAuthorized(false);
        router.replace('/');
        return;
      }

      if (pathname.startsWith('/atendente') && userTypeId !== TIPO_USUARIO.ATENDENTE && userTypeId !== TIPO_USUARIO.ADMINISTRADOR) {
        setAuthorized(false);
        router.replace('/');
        return;
      }

      if (pathname.startsWith('/solicitante') && userTypeId !== TIPO_USUARIO.SOLICITANTE && userTypeId !== TIPO_USUARIO.ADMINISTRADOR) {
         setAuthorized(false);
         router.replace('/');
         return;
      }

      setAuthorized(true);
    };

    verifyAccess();
    
  }, [isMounted, loading, signed, pathname, user, router]);

  if (!isMounted) return null;

  const publicRoutes = ['/login', '/cadastro_usuario'];
  if (publicRoutes.includes(pathname) && !signed) {
      return <>{children}</>;
  }

  if (loading || !authorized) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        bgcolor: '#f5f5f5'
      }}>
        <CircularProgress sx={{ color: '#00b65e' }} />
        <Typography variant="caption" sx={{ mt: 2, color: 'text.secondary' }}>
          Verificando permissões...
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}