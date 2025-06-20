import { Link, useRouter } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Bell, User, Home, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BankConnection } from "@/features/banking/BankConnection";
import { Account } from "@/lib/types";

interface DashboardHeaderProps {
  onAccountAdded?: (account: Account) => void;
}

export function DashboardHeader({ onAccountAdded }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  // Get current path to highlight active nav item
  const currentPath = router.state.location.pathname;

  const isActivePath = (path: string) => {
    if (path === "/dashboard" && currentPath === "/dashboard/") return true;
    if (path !== "/dashboard" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavLinkClasses = (path: string) => {
    return isActivePath(path)
      ? "text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-1"
      : "text-sm font-medium text-gray-600 hover:text-gray-900";
  };

  return (
    <motion.header
      className="bg-white border-b border-gray-200 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="h-5 w-5 text-white" />
            </div>
            <Link to="/">
              <h1 className="text-xl font-bold text-gray-900">FinanzPlaner</h1>
            </Link>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className={getNavLinkClasses("/dashboard")}>
              Dashboard
            </Link>
            <Link
              to="/transactions"
              className={getNavLinkClasses("/transactions")}
            >
              Transaktionen
            </Link>
            <a
              href="/dashboard/budget"
              className={getNavLinkClasses("/dashboard/budget")}
            >
              Budgets
            </a>
            <Link
              to="/dashboard/goals"
              className={getNavLinkClasses("/dashboard/goals")}
            >
              Ziele
            </Link>
            <Link
              to="/dashboard/education"
              className={getNavLinkClasses("/dashboard/education")}
            >
              Lernen
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {onAccountAdded && <BankConnection onAccountAdded={onAccountAdded} />}
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Abmelden</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
