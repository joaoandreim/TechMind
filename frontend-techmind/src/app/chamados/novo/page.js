'use client';
import { useRouter } from 'next/navigation';
import ChamadoForm from '../../../components/chamados/ChamadoForm';
import { createChamado } from '../../../services/chamadoService';
import { useToast } from '../../../components/Ui/ToastProvider';

export default function NovoChamado() {
  const router = useRouter();
  const { show } = useToast();

  const onSubmit = async (data) => {
    try {
      await createChamado(data);
      show('Chamado criado', 'success');
      router.push('/chamados');
    } catch (err) {
      show(err.message || 'Erro ao criar chamado', 'error');
    }
  };

  return <ChamadoForm onSubmit={onSubmit} />;
}