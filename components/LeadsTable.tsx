import React from 'react';
import type { Lead } from '../types';

interface LeadsTableProps {
    leads: Lead[];
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads }) => {
    if (leads.length === 0) {
        return null;
    }

    return (
        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">#</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Nome da Empresa</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Categoria</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Telefone</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">E-mail</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Site</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Endereço</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Avaliação</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Qualidade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 bg-gray-900">
                                {leads.map((lead) => (
                                    <tr key={lead.LeadNumber} className="hover:bg-gray-800/50">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{lead.LeadNumber}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{lead.CompanyName}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{lead.Category || 'N/A'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{lead.Phone || 'N/A'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{lead.Email || 'N/A'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-indigo-400 hover:text-indigo-300">
                                            {lead.Website ? <a href={lead.Website} target="_blank" rel="noopener noreferrer">{lead.Website}</a> : 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300 max-w-xs truncate">{lead.Address || 'N/A'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">{lead.Rating ? `${lead.Rating} (${lead.ReviewCount})` : 'N/A'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                            <div className="flex items-center">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${lead.QualityScore > 75 ? 'bg-green-100 text-green-800' : lead.QualityScore > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                    {lead.QualityScore}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadsTable;