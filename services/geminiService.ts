import { GoogleGenAI } from "@google/genai";
import type { Lead, Coordinates } from '../types';

const API_KEY = process.env.API_KEY;

function buildPrompt(query: string, city: string, country: string): string {
    const today = new Date().toISOString().split('T')[0];
    const columns = [
        "GeneratedDate", "SearchCity", "SearchCountry", "LeadNumber", "CompanyName", "Category", 
        "Description", "Address", "City", "Country", "Coordinates", "Phone", "Email", "Website", 
        "LinkedIn", "Facebook", "Instagram", "Rating", "ReviewCount", "BusinessHours", 
        "QualityScore", "QualityReasoning", "Status", "Contacted", "Notes"
    ];

    return `
Você é um assistente especialista em geração de leads. Sua tarefa é encontrar leads de negócios com base nos seguintes critérios:
- Termo de Busca: "${query}"
- Cidade: "${city}"
- País: "${country}"

Use suas capacidades de busca avançada com Google Search e Google Maps para encontrar até 10 empresas relevantes e coletar as seguintes informações para cada lead:
${columns.join(', ')}

Instruções Importantes:
1.  Sua resposta inteira DEVE ser um único array de objetos JSON válido.
2.  Não inclua nenhum texto, explicação ou formatação markdown (como \`\`\`json) fora do array JSON.
3.  Para campos que não estão disponíveis, use null.
4.  Para 'GeneratedDate', use "${today}".
5.  Para 'SearchCity', use "${city}".
6.  Para 'SearchCountry', use "${country}".
7.  Para 'LeadNumber', atribua um número sequencial começando de 1.
8.  Para 'Coordinates', forneça um objeto com as propriedades 'lat' e 'lng'.
9.  Para 'BusinessHours', forneça um objeto com os dias da semana como chaves e os horários de funcionamento como valores.
10. Para 'QualityScore', forneça uma pontuação de 1 a 100 com base na completude e qualidade das informações encontradas.
11. Para 'QualityReasoning', explique brevemente a pontuação em uma frase.
12. Para 'Status', defina como "Novo".
13. Para 'Contacted', defina como false.
14. Para 'Notes', deixe como uma string vazia.

Sua saída final deve ser APENAS o array JSON.
`;
}

function cleanJsonString(jsonString: string): string {
    // Remove markdown backticks and the "json" language identifier
    const cleaned = jsonString.replace(/^```json\s*/, '').replace(/```$/, '');
    return cleaned.trim();
}

export const scrapeLeads = async (
    query: string, 
    city: string, 
    country: string,
    userCoords: Coordinates | null
): Promise<Lead[]> => {
    if (!API_KEY) {
        throw new Error("A variável de ambiente API_KEY não foi definida");
    }
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const prompt = buildPrompt(query, city, country);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }, { googleMaps: {} }],
                ...(userCoords && {
                    toolConfig: {
                        retrievalConfig: {
                            latLng: userCoords
                        }
                    }
                })
            },
        });
        
        const rawText = response.text;
        if (!rawText) {
            throw new Error("Recebida uma resposta vazia da API.");
        }
        
        const cleanedJson = cleanJsonString(rawText);
        const leads: Lead[] = JSON.parse(cleanedJson);
        
        return leads;
    } catch (error) {
        console.error("Erro ao extrair leads:", error);
        if (error instanceof SyntaxError) {
            throw new Error("Falha ao analisar a resposta da IA. Pode não ser um JSON válido.");
        }
        throw new Error("Ocorreu um erro ao se comunicar com a API Gemini.");
    }
};