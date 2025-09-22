// src/pages/Client/Profile.tsx
import React, { useState, useEffect } from 'react';
import {
  User,
  Envelope,
  Phone,
  Lock,
  Camera,
  Pencil,
  Check,
  X,
  Eye,
  EyeSlash,
  Calendar,
  Star,
  Heart
} from '@phosphor-icons/react';
import { useAuth } from '../../contexts/AuthContext';
import Notification from '../../components/UI/Notification';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { NotificationProps } from '../../types';
import { clienteService, ClienteProfile } from '../../services/clienteService';

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<ClienteProfile>({
    id: '',
    name: '',
    login: '',
    phone: '',
    memberSince: '',
    totalAppointments: 0,
    favoriteServices: [],
    averageRating: 0
  });
  const [notification, setNotification] = useState<NotificationProps>({ 
    isVisible: false, 
    type: 'success', 
    message: '', 
    onClose: () => {} 
  });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    login: user?.login || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const statsData = await clienteService.getProfileStats();
      setUserStats(statsData);
    } catch {
      console.error('Erro ao carregar estatísticas');
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await clienteService.updateProfile(formData);
      
      updateUser(formData);
      setIsEditing(false);
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Perfil atualizado com sucesso!',
        onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
      });
    } catch (error) {
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Erro ao atualizar perfil. Tente novamente.',
        onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'As senhas não coincidem',
        onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'A nova senha deve ter pelo menos 6 caracteres',
        onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
      });
      return;
    }

    setIsLoading(true);
    try {
      await clienteService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setIsChangingPassword(false);
      setNotification({
        isVisible: true,
        type: 'success',
        message: 'Senha alterada com sucesso!',
        onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
      });
    } catch {
      setNotification({
        isVisible: true,
        type: 'error',
        message: 'Erro ao alterar senha. Verifique a senha atual.',
        onClose: () => setNotification(prev => ({ ...prev, isVisible: false }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
            setFormData({
          name: user?.name || '',
          login: user?.login || '',
          phone: user?.phone || ''
        });
    setIsEditing(false);
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="p-4 space-y-6 max-w-4xl mx-auto">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-bolt-neutral-900 mb-2">Meu Perfil</h1>
        <p className="text-bolt-neutral-600">Gerencie suas informações pessoais</p>
      </div>

      {/* Foto e informações básicas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="w-24 h-24 bg-gradient-to-br from-bolt-primary-400 to-bolt-secondary-400 rounded-full flex items-center justify-center">
              <User size={32} className="text-white" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-bolt-primary-500 rounded-full flex items-center justify-center text-white hover:bg-bolt-primary-600 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-bolt-neutral-900">{user?.name}</h2>
          <p className="text-bolt-neutral-600">{user?.login}</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-bolt-neutral-50 rounded-xl">
            <Calendar size={24} className="mx-auto mb-2 text-bolt-primary-500" />
            <p className="text-lg font-bold text-bolt-neutral-900">{userStats.totalAppointments}</p>
            <p className="text-sm text-bolt-neutral-600">Agendamentos</p>
          </div>
          <div className="text-center p-4 bg-bolt-neutral-50 rounded-xl">
            <Star size={24} className="mx-auto mb-2 text-bolt-yellow-500" />
            <p className="text-lg font-bold text-bolt-neutral-900">{userStats.averageRating}</p>
            <p className="text-sm text-bolt-neutral-600">Avaliação</p>
          </div>
          <div className="text-center p-4 bg-bolt-neutral-50 rounded-xl">
            <Heart size={24} className="mx-auto mb-2 text-bolt-red-500" />
            <p className="text-lg font-bold text-bolt-neutral-900">{userStats.favoriteServices.length}</p>
            <p className="text-sm text-bolt-neutral-600">Favoritos</p>
          </div>
        </div>

        <div className="text-center text-sm text-bolt-neutral-600">
          Membro desde {new Date(userStats.memberSince).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long'
          })}
        </div>
      </div>

      {/* Informações pessoais */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-bolt-neutral-900">Informações Pessoais</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 text-bolt-primary-600 hover:bg-bolt-primary-50 rounded-xl transition-colors"
            >
              <Pencil size={16} className="mr-2" />
              Editar
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-bolt-neutral-700 mb-2">Nome completo</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-bolt-neutral-300 rounded-xl ${
                  isEditing ? 'input-focus' : 'bg-bolt-neutral-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-bolt-neutral-700 mb-2">Login</label>
            <div className="relative">
              <Envelope size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
              <input
                type="text"
                value={formData.login}
                onChange={(e) => setFormData(prev => ({ ...prev, login: e.target.value }))}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-bolt-neutral-300 rounded-xl ${
                  isEditing ? 'input-focus' : 'bg-bolt-neutral-50'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-bolt-neutral-700 mb-2">Telefone</label>
            <div className="relative">
              <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!isEditing}
                className={`w-full pl-10 pr-4 py-3 border border-bolt-neutral-300 rounded-xl ${
                  isEditing ? 'input-focus' : 'bg-bolt-neutral-50'
                }`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleSaveProfile}
              disabled={isLoading}
              className="flex-1 btn-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : <Check size={16} className="mr-2" />}
              {isLoading ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 bg-bolt-neutral-100 text-bolt-neutral-700 py-3 rounded-xl font-medium hover:bg-bolt-neutral-200 transition-colors flex items-center justify-center"
            >
              <X size={16} className="mr-2" />
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Alterar senha */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-bolt-neutral-900">Segurança</h3>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="flex items-center px-4 py-2 text-bolt-primary-600 hover:bg-bolt-primary-50 rounded-xl transition-colors"
            >
              <Lock size={16} className="mr-2" />
              Alterar senha
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-bolt-neutral-700 mb-2">Senha atual</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-bolt-neutral-300 rounded-xl input-focus"
                  placeholder="Digite sua senha atual"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400 hover:text-bolt-neutral-600"
                >
                  {showCurrentPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-bolt-neutral-700 mb-2">Nova senha</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 border border-bolt-neutral-300 rounded-xl input-focus"
                  placeholder="Digite a nova senha"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400 hover:text-bolt-neutral-600"
                >
                  {showNewPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-bolt-neutral-700 mb-2">Confirmar nova senha</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bolt-neutral-400" />
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-bolt-neutral-300 rounded-xl input-focus"
                  placeholder="Confirme a nova senha"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={isLoading}
                className="flex-1 btn-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? <LoadingSpinner size="sm" color="text-white" /> : <Check size={16} className="mr-2" />}
                {isLoading ? 'Alterando...' : 'Alterar senha'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 bg-bolt-neutral-100 text-bolt-neutral-700 py-3 rounded-xl font-medium hover:bg-bolt-neutral-200 transition-colors flex items-center justify-center"
              >
                <X size={16} className="mr-2" />
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-bolt-neutral-600">
            <p>Sua senha foi alterada pela última vez em 15 de dezembro de 2023</p>
          </div>
        )}
      </div>

      {/* Serviços favoritos */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-bolt-neutral-900 mb-4">Serviços Favoritos</h3>
        <div className="flex flex-wrap gap-2">
          {userStats.favoriteServices.map((service, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gradient-to-r from-bolt-primary-100 to-bolt-secondary-100 text-bolt-primary-800 rounded-xl text-sm font-medium"
            >
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Sair da conta */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-bolt-neutral-900 mb-4">Conta</h3>
        <button
          onClick={logout}
          className="w-full bg-bolt-red-50 text-bolt-red-700 py-3 rounded-xl font-medium hover:bg-bolt-red-100 transition-colors"
        >
          Sair da conta
        </button>
      </div>
    </div>
  );
};

export default Profile;