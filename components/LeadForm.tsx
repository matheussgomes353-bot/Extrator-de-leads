import React, { useState } from 'react';
import Spinner from './Spinner';

interface LeadFormProps {
    onSubmit: (query: string, city: string, country:string) => void;
    isLoading: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmit, isLoading }) => {
    const [query, setQuery] = useState('restaurantes italianos');
    const [city, setCity] = useState('São Paulo');
    const [country, setCountry] = useState('Brasil');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query && city && country) {
            onSubmit(query, city, country);
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-6 bg-gray-800 rounded-lg shadow-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="query" className="block text-sm font-medium text-gray-300 mb-1">Termo de Busca</label>
                    <input
                        type="text"
                        id="query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="ex: restaurantes italianos"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">Cidade</label>
                    <input
                        type="text"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="ex: São Paulo"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">País</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="ex: Brasil"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <Spinner className="w-5 h-5" /> : 'Extrair Leads'}
            </button>
        </form>
    );
};

export default LeadForm;