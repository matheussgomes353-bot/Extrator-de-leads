import type { Lead } from '../types';

const WEBHOOK_URL = 'https://webhookeditor.nudigital.com.br/webhook/leads-google-scraper';

export const sendLeadsToWebhook = async (leads: Lead[]): Promise<void> => {
    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leads),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`Webhook falhou com o status ${response.status}: ${errorBody}`);
        }
        
        console.log('Leads enviados para o webhook com sucesso.');

    } catch (error) {
        console.error("Erro ao enviar leads para o webhook:", error);
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            throw new Error(
                `Não foi possível conectar ao webhook em ${WEBHOOK_URL}. Este é um problema comum que pode ser causado por duas coisas principais: (1) O servidor local не está em execução, ou (2) uma política de CORS (Cross-Origin Resource Sharing) no servidor está bloqueando a solicitação. Verifique se o seu servidor está em execução e configurado corretamente.`
            );
        }
        throw new Error('Falha ao enviar leads para o webhook. Verifique o console para mais detalhes.');
    }
};