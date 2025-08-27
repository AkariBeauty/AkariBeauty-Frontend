import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, CaretRight } from '@phosphor-icons/react';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
}

export default function Breadcrumb({ items = [], showHome = true }: BreadcrumbProps) {
  const location = useLocation();
  
  // Se não foram fornecidos itens, gerar automaticamente baseado na rota
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    if (showHome) {
      breadcrumbs.push({
        label: 'Início',
        path: '/',
        isActive: location.pathname === '/'
      });
    }
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Mapear segmentos para labels mais amigáveis
      let label = segment;
      switch (segment) {
        case 'cliente':
          label = 'Área do Cliente';
          break;
        case 'dashboard':
          label = 'Dashboard';
          break;
        case 'booking':
          label = 'Agendamento';
          break;
        case 'appointments':
          label = 'Meus Agendamentos';
          break;
        case 'profile':
          label = 'Meu Perfil';
          break;
        case 'login':
          label = 'Login';
          break;
        case 'login-bolt':
          label = 'Login Cliente';
          break;
        case 'singupCliente':
          label = 'Cadastro Cliente';
          break;
        case 'singupEmpresa':
          label = 'Cadastro Empresa';
          break;
        default:
          // Capitalizar primeira letra
          label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isActive: index === pathSegments.length - 1
      });
    });
    
    return breadcrumbs;
  };
  
  const breadcrumbItems = items.length > 0 ? items : generateBreadcrumbs();
  
  if (breadcrumbItems.length <= 1) {
    return null;
  }
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-bolt-neutral-600 mb-6">
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <CaretRight size={16} className="text-bolt-neutral-400" />
          )}
          
          {item.isActive ? (
            <span className="text-bolt-primary-600 font-medium">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-bolt-primary-600 transition-colors flex items-center space-x-1"
            >
              {index === 0 && showHome && <House size={16} />}
              <span>{item.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

