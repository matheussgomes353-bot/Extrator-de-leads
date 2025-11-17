import React, { useState, useEffect, useCallback } from 'react';
import type { Lead, Coordinates } from './types';
import LeadForm from './components/LeadForm';
import LeadsTable from './components/LeadsTable';
import { scrapeLeads } from './services/geminiService';
import { sendLeadsToWebhook } from './services/webhookService';

type WebhookStatus = 'idle' | 'sending' | 'success' | 'error';

const App: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [webhookStatus, setWebhookStatus] = useState<WebhookStatus>('idle');
    const [webhookError, setWebhookError] = useState<string | null>(null);
    const [userCoords, setUserCoords] = useState<Coordinates | null>(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setUserCoords({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            },
            (err) => {
                console.warn(`Não foi possível obter a localização do usuário: ${err.message}`);
            }
        );
    }, []);

    const handleScrapeLeads = useCallback(async (query: string, city: string, country: string) => {
        setIsLoading(true);
        setError(null);
        setLeads([]);
        setWebhookStatus('idle');
        setWebhookError(null);

        try {
            const scrapedLeads = await scrapeLeads(query, city, country, userCoords);
            setLeads(scrapedLeads);

            if (scrapedLeads.length > 0) {
                setWebhookStatus('sending');
                try {
                    await sendLeadsToWebhook(scrapedLeads);
                    setWebhookStatus('success');
                } catch (webhookErr: any) {
                    setWebhookStatus('error');
                    setWebhookError(webhookErr.message || 'Ocorreu um erro desconhecido.');
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [userCoords]);
    
    const StatusMessage: React.FC = () => {
        if (isLoading && leads.length === 0) {
            return (
                <div className="text-center p-4 bg-gray-800 rounded-lg mt-4">
                    <p>A IA está extraindo os leads... isso pode levar um momento.</p>
                </div>
            );
        }
        if (error) {
            return (
                <div className="text-center p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg mt-4">
                    <p className="font-bold">Erro na Extração</p>
                    <p>{error}</p>
                </div>
            );
        }
        if (webhookStatus === 'sending' && !webhookError) {
             return (
                <div className="text-center p-4 bg-blue-900/50 border border-blue-700 text-blue-300 rounded-lg mt-4">
                    <p>Leads extraídos. Enviando para o webhook...</p>
                </div>
            );
        }
        if (webhookStatus === 'success') {
            return (
                <div className="text-center p-4 bg-green-900/50 border border-green-700 text-green-300 rounded-lg mt-4">
                    <p>Enviados {leads.length} leads para o webhook com sucesso!</p>
                </div>
            );
        }
        if (webhookStatus === 'error' && webhookError) {
             return (
                <div className="text-center p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg mt-4">
                     <p className="font-bold">Erro no Webhook</p>
                    <p>{webhookError}</p>
                </div>
            );
        }

        return null;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">
                     <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
                        Extrator de Leads com IA
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                        Esta aplicação inteligente utiliza o poder do Gemini, integrado com Google Search e Maps, para descobrir e qualificar leads de negócios em qualquer cidade. Insira seus critérios de busca e receba uma lista detalhada de contatos, que é automaticamente enviada para o seu webhook para agilizar seu fluxo de trabalho.
                    </p>
                </div>

                <div className="mt-10">
                    <LeadForm onSubmit={handleScrapeLeads} isLoading={isLoading} />
                </div>
                
                <div className="mt-4">
                   <StatusMessage />
                </div>

                <LeadsTable leads={leads} />
            </main>
        </div>
    );
};

export default App;