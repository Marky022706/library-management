import { Menu } from 'lucide-react';
import { NotificationsDropdown } from './NotificationsDropdown';
import { UserProfile } from './UserProfile';

interface TopHeaderProps {
  userName: string;
  onOpenMenu: () => void;
}

export function TopHeader({ userName, onOpenMenu }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white px-4 sm:px-7">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Open navigation menu"
        title="Menu"
        className="rounded-lg p-2 text-muted hover:bg-gray-100 hover:text-ink lg:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationsDropdown />
        <div className="hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
        <UserProfile name={userName} compact />
      </div>
    </header>
  );
}
