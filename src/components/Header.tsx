import React, { useState } from 'react';
import { Search, MessageCircle, User, Home, Heart, Star, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePoints } from '../hooks/usePoints';
import { AuthModal } from './AuthModal';

interface HeaderProps {
  onNavigateToQuestions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigateToQuestions }) => {
  const { user, signOut } = useAuth();
  const { userPoints } = usePoints();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-gradient-to-r from-blue-100 to-indigo-100 shadow-sm border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">キキコミ</h1>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium hidden sm:block">みんなで作る、やさしいレビュー</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4 flex-shrink-0">
            {/* ポイント表示 */}
            {user && userPoints && (
              <div className="flex items-center bg-gradient-to-r from-yellow-100 to-orange-100 px-2 py-1 rounded-full shadow-sm border border-yellow-200">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 mr-1" />
                <span className="text-xs sm:text-sm font-bold text-yellow-700">
                  {userPoints.total_points.toLocaleString()}P
                </span>
              </div>
            )}
            
            <button className="p-1.5 sm:p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button className="p-1.5 sm:p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200">
              <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button 
              onClick={onNavigateToQuestions}
              className="p-1.5 sm:p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-100 relative transition-all duration-200"
              title="レビュー質問"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-[9px] sm:text-[10px] md:text-xs rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 flex items-center justify-center animate-pulse">
                3
              </span>
            </button>
                               {user ? (
                     <div className="flex items-center space-x-2">
                       <div className="text-sm font-medium text-gray-700 hidden sm:block">
                         {user.user_metadata?.name || user.email}
                       </div>
                       <button
                         onClick={handleSignOut}
                         className="p-1.5 sm:p-2 rounded-full text-gray-700 hover:text-red-600 hover:bg-red-100 transition-all duration-200"
                         title="ログアウト"
                       >
                         <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                       </button>
                     </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="p-1.5 sm:p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200"
                title="ログイン"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </header>
  );
};