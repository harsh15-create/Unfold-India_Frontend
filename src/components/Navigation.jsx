import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, User, MessageSquare, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState({ avatar_url: '', full_name: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Chatbot', path: '/chatbot' },
    { name: 'Routes', path: '/routes' },
    { name: 'Translator', path: '/translator' },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-8 left-1/4 -translate-x-1/2 z-50 w-[40%] md:w-[70%] lg:w-[60%] max-w-6xl h-20"
    >
      <div className="absolute inset-0 backdrop-blur-[25px] bg-white/25 border border-white/30 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]"></div>
      <div className="flex items-center justify-between relative z-10 h-full px-4 md:px-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent whitespace-nowrap"
            >
              Unfold India
            </motion.div>
          </Link>
        </div>

        {/* Navigation Links - Centered (Desktop only) */}
        <div className="hidden lg:flex items-center justify-center space-x-6 xl:space-x-8 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="relative group"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`text-sm font-medium transition-colors duration-300 whitespace-nowrap ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.name}
              </motion.span>
              
              {/* Active indicator */}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Section - Desktop */}
        <div className="hidden lg:flex items-center justify-end flex-shrink-0 gap-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-11 w-11 rounded-full backdrop-blur-[20px] bg-white/20 hover:bg-white/30 transition-all duration-300 p-0 flex items-center justify-center"
              >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-sm font-semibold">
                      {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 backdrop-blur-xl bg-background/95 border-white/10 shadow-2xl rounded-2xl z-50" 
                align="end" 
                forceMount
                sideOffset={8}
              >
                <div className="flex items-center gap-3 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                      {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none min-w-0 flex-1">
                    {profile.full_name && (
                      <p className="font-semibold text-sm text-foreground truncate">{profile.full_name}</p>
                    )}
                    <p className="text-xs text-muted-foreground truncate max-w-full">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => navigate('/my-profile')}
                  className="cursor-pointer hover:bg-primary/10 transition-colors m-1 rounded-lg flex items-center py-3 px-3"
                >
                  <User className="mr-3 h-4 w-4" />
                  <span className="font-medium">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/my-chats')}
                  className="cursor-pointer hover:bg-primary/10 transition-colors m-1 rounded-lg flex items-center py-3 px-3"
                >
                  <MessageSquare className="mr-3 h-4 w-4" />
                  <span className="font-medium">My Chats</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors m-1 rounded-lg flex items-center py-3 px-3"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="backdrop-blur-[20px] bg-white/20 hover:bg-white/30 text-muted-foreground hover:text-foreground transition-all duration-300"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2 ml-auto flex-shrink-0">
          {/* Mobile Auth Button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full backdrop-blur-[20px] bg-white/20 hover:bg-white/30 transition-all duration-300 p-0 flex items-center justify-center flex-shrink-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary text-xs font-semibold">
                      {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 backdrop-blur-xl bg-background/95 border-white/10 shadow-2xl rounded-2xl z-50" 
                align="end" 
                forceMount
                sideOffset={8}
              >
                <div className="flex items-center gap-3 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url} alt={profile.full_name || user.email} />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-semibold">
                      {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none min-w-0 flex-1">
                    {profile.full_name && (
                      <p className="font-semibold text-sm text-foreground truncate">{profile.full_name}</p>
                    )}
                    <p className="text-xs text-muted-foreground truncate max-w-full">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={() => navigate('/my-profile')}
                  className="cursor-pointer hover:bg-primary/10 transition-colors m-1 rounded-lg flex items-center py-3 px-3"
                >
                  <User className="mr-3 h-4 w-4" />
                  <span className="font-medium">My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/my-chats')}
                  className="cursor-pointer hover:bg-primary/10 transition-colors m-1 rounded-lg flex items-center py-3 px-3"
                >
                  <MessageSquare className="mr-3 h-4 w-4" />
                  <span className="font-medium">My Chats</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors m-1 rounded-lg flex items-center py-3 px-3"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login" className="flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="backdrop-blur-[20px] bg-white/20 hover:bg-white/30 text-muted-foreground hover:text-foreground transition-all duration-300 h-10 whitespace-nowrap"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
          
          {/* Hamburger Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="backdrop-blur-[20px] bg-white/20 hover:bg-white/30 transition-all duration-300 p-2 h-10 w-10 flex-shrink-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[280px] backdrop-blur-xl bg-background/95 border-white/10"
            >
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex items-center gap-2 pb-4 border-b border-white/10">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Unfold India 🌏
                  </span>
                </div>
                
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative group"
                  >
                    <motion.span
                      whileHover={{ x: 4 }}
                      className={`text-base font-medium transition-colors duration-300 ${
                        location.pathname === item.path
                          ? 'text-primary'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item.name}
                    </motion.span>
                    
                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="activeMobileNav"
                        className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
