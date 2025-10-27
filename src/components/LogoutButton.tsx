'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

export function LogoutButton() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-100 transition-colors"
    >
      <LogOut size={20} />
      {t('logout')}
    </button>
  );
}