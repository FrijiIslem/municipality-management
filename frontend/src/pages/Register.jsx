import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { Leaf, ShieldCheck, Clock, Smartphone, Mail, MapPin, User, Lock } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  // Styles
  const inputClass = "w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700";
  const buttonClass = `w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#4CAF50] hover:bg-[#43A047] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4CAF50] transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'shadow-md hover:shadow-lg'}`;
  const errorClass = "text-red-500 text-sm mt-1 flex items-center";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }

    try {
      setError('');
      setLoading(true);
      await register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        adresse: formData.adresse,
        password: formData.password,
        role: 'CITOYEN'
      });
      navigate('/citoyen');
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Left Side - Illustration */}
            <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] p-10 text-white">
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center mb-6">
                    <Leaf className="h-8 w-8 mr-2" />
                    <span className="text-2xl font-bold font-['Poppins']">Urbanova</span>
                  </div>
                  <h2 className="text-3xl font-bold font-['Poppins'] mb-4">Rejoignez la ville intelligente</h2>
                  <p className="text-blue-50 mb-8">
                    Créez votre compte pour participer à la gestion intelligente des déchets de votre ville.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Sécurité garantie</h4>
                      <p className="text-sm text-blue-50">Vos données sont protégées et sécurisées</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Gain de temps</h4>
                      <p className="text-sm text-blue-50">Accédez rapidement aux services de collecte</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Form */}
            <div className="p-8 md:w-1/2">
              <div className="md:hidden mb-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Leaf className="h-8 w-8 mr-2 text-[#4CAF50]" />
                  <span className="text-2xl font-bold font-['Poppins'] text-[#263238]">Urbanova</span>
                </div>
                <h2 className="text-2xl font-bold font-['Poppins'] text-[#263238]">Créer un compte citoyen</h2>
              </div>
              
              <div className="hidden md:block mb-8">
                <h2 className="text-2xl font-bold font-['Poppins'] text-[#263238] mb-2">Créer un compte</h2>
                <p className="text-gray-500">Rejoignez notre communauté éco-responsable</p>
              </div>
        
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6 flex items-start">
                  <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-3 text-sm text-red-700">{error}</p>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="prenom" className={labelClass}>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-500" />
                          Prénom
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="prenom"
                          name="prenom"
                          type="text"
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="Votre prénom"
                          value={formData.prenom}
                          onChange={handleChange}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="nom" className={labelClass}>
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1 text-gray-500" />
                          Nom
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="nom"
                          name="nom"
                          type="text"
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="Votre nom"
                          value={formData.nom}
                          onChange={handleChange}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
            
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      <span className="flex items-center">
                        <Mail className="h-4 w-4 mr-1 text-gray-500" />
                        Adresse email
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className={`${inputClass} pl-10`}
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
            
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="telephone" className={labelClass}>
                        <span className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-1 text-gray-500" />
                          Téléphone
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="telephone"
                          name="telephone"
                          type="tel"
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="06 12 34 56 78"
                          value={formData.telephone}
                          onChange={handleChange}
                        />
                        <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
            
                    <div>
                      <label htmlFor="adresse" className={labelClass}>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          Adresse
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="adresse"
                          name="adresse"
                          type="text"
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="Votre adresse complète"
                          value={formData.adresse}
                          onChange={handleChange}
                        />
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
            
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="password" className={labelClass}>
                        <span className="flex items-center">
                          <Lock className="h-4 w-4 mr-1 text-gray-500" />
                          Mot de passe
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
            
                    <div>
                      <label htmlFor="confirmPassword" className={labelClass}>
                        <span className="flex items-center">
                          <Lock className="h-4 w-4 mr-1 text-gray-500" />
                          Confirmer le mot de passe
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          className={`${inputClass} pl-10`}
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button & Links */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={buttonClass}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Création du compte...
                        </>
                      ) : (
                        <>
                          <span>Créer mon compte</span>
                          <svg className="ml-2 -mr-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Vous avez déjà un compte ?{' '}
                      <Link to="/login" className="font-medium text-[#2196F3] hover:text-[#1976D2] transition-colors">
                        Connectez-vous ici
                      </Link>
                    </p>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 text-center">
                      En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
