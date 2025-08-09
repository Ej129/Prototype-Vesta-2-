
import React, { useState } from 'react';
import { User } from '../types';
import { VestaLogo } from '../components/Icons';
import { CenteredLayout } from '../components/Layout';
import * as auth from '../api/auth';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let user: User | null;
      if (isLoginView) {
        user = await auth.login(email, password);
      } else {
        user = await auth.signUp(name, email, password);
      }
      onLoginSuccess(user);
    } catch (err) {
      setError((err as Error).message);
    } finally {
        setIsLoading(false);
    }
  };
  
  const inputClasses = "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-vesta-secondary bg-white dark:bg-gray-700 text-vesta-text dark:text-gray-100 placeholder:text-vesta-text-light dark:placeholder:text-gray-400";

  return (
    <CenteredLayout>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
        <VestaLogo className="w-24 h-24 mx-auto" />
        <h1 className="text-4xl font-bold text-vesta-primary dark:text-white mt-4">Vesta</h1>
        <p className="text-vesta-text-light dark:text-gray-400 mt-2 mb-8">
            {isLoginView ? 'Welcome Back' : 'Create Your Account'}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginView && (
                 <input 
                    type="text" 
                    placeholder="Full Name"
                    id="nameInput"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={inputClasses}
                />
            )}
            <input 
                type="email" 
                placeholder="Corporate Email"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClasses}
            />
            <input 
                type="password"
                placeholder="Password"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClasses}
            />
        
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-vesta-primary text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:bg-opacity-50"
            >
              {isLoading ? 'Processing...' : (isLoginView ? 'Login Securely' : 'Create Account')}
            </button>
        </form>
        <div className="mt-6 text-sm">
            <span
                onClick={() => { setIsLoginView(!isLoginView); setError(''); }}
                className="text-vesta-secondary hover:underline cursor-pointer font-medium"
            >
                {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </span>
        </div>
      </div>
    </CenteredLayout>
  );
};

export default LoginScreen;