import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Tech Mind',
  description: 'Sistema de chamados',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
