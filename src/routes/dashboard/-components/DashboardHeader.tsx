import { Link, useRouter } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
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
import { Settings, Bell, User, Home, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { BankConnection } from "@/features/banking/BankConnection";
import { NotificationCenter } from "@/features/dashboard/NotificationCenter";
import { Account } from "@/lib/types";
import { useState } from "react";

interface DashboardHeaderProps {
  onAccountAdded?: (account: Account) => void;
}

export function DashboardHeader({ onAccountAdded }: DashboardHeaderProps) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const getMobileNavLinkClasses = (path: string) => {
    return isActivePath(path)
      ? "block px-4 py-3 text-base font-medium text-blue-600 bg-blue-50 border-r-4 border-blue-600"
      : "block px-4 py-3 text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.header
        className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 relative z-50"
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
                <h1 className="text-xl font-bold text-gray-900">
                  FinanzPlaner
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <Separator orientation="vertical" className="h-6" />
              <nav className="flex items-center gap-6">
                <Link
                  to="/dashboard"
                  className={getNavLinkClasses("/dashboard")}
                >
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
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Controls */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              {onAccountAdded && (
                <BankConnection onAccountAdded={onAccountAdded} />
              )}
              <NotificationCenter />
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>

            {/* User Dropdown */}
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-white shadow-xl z-50 lg:hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Home className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Menu
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeMobileMenu}
                    className="p-2"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 py-4">
                  <Link
                    to="/dashboard"
                    className={getMobileNavLinkClasses("/dashboard")}
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/transactions"
                    className={getMobileNavLinkClasses("/transactions")}
                    onClick={closeMobileMenu}
                  >
                    Transaktionen
                  </Link>
                  <a
                    href="/dashboard/budget"
                    className={getMobileNavLinkClasses("/dashboard/budget")}
                    onClick={closeMobileMenu}
                  >
                    Budgets
                  </a>
                  <Link
                    to="/dashboard/goals"
                    className={getMobileNavLinkClasses("/dashboard/goals")}
                    onClick={closeMobileMenu}
                  >
                    Ziele
                  </Link>
                  <Link
                    to="/dashboard/education"
                    className={getMobileNavLinkClasses("/dashboard/education")}
                    onClick={closeMobileMenu}
                  >
                    Lernen
                  </Link>
                </nav>

                {/* Mobile Menu Footer */}
                <div className="border-t border-gray-200 p-4 space-y-2">
                  {onAccountAdded && (
                    <div className="mb-4">
                      <BankConnection onAccountAdded={onAccountAdded} />
                    </div>
                  )}
                  <div className="mb-4">
                    <NotificationCenter className="w-full" />
                  </div>
                  <button className="flex items-center gap-3 w-full p-3 text-left text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                    <Settings className="h-5 w-5" />
                    <span>Einstellungen</span>
                  </button>
                  <button
                    className="flex items-center gap-3 w-full p-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    onClick={() => {
                      signOut();
                      closeMobileMenu();
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Abmelden</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
