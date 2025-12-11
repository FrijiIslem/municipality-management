import React from 'react';
import { Link } from 'react-router-dom';

const PublicHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-heading font-bold text-eco-green">
                Urbanova
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-eco-green text-anthracite inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Accueil
              </Link>
            </nav>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <Link
              to="/login"
              className="text-anthracite hover:text-eco-green px-3 py-2 rounded-md text-sm font-medium"
            >
              Connexion
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicHeader;
