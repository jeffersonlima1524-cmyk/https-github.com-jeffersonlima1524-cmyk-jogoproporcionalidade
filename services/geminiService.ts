import { GoogleGenAI, Type } from "@google/genai";
import { ProportionType, Question } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: "O texto da pergunta." },
        options: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
            description: "Uma lista de 3 opções numéricas INCORRETAS."
        },
        answer: { type: Type.NUMBER, description: "A resposta numérica correta." },
        explanation: { type: Type.STRING, description: "Uma explicação curta e simples do porquê a resposta está correta." }
    },
    required: ["question", "options", "answer", "explanation"]
};

export async function generateQuestions(type: ProportionType, count: number): Promise<Question[]> {
  try {
    const prompt = `
      Você é um assistente de IA criando um jogo educativo sobre matemática para alunos do 8º ano, incluindo um aluno com deficiência intelectual. O tema do jogo é música.

      Crie uma lista de ${count} perguntas de múltipla escolha sobre proporcionalidade ${type}.

      REGRAS GERAIS PARA TODAS AS PERGUNTAS:
      1. Use linguagem muito simples, clara e direta. Frases curtas.
      2. O problema deve usar um exemplo do mundo da música (ex: tempo em BPM, duração da música, número de instrumentos, notas tocadas por segundo).
      3. A resposta correta DEVE ser um número inteiro.
      4. Os números no problema devem ser fáceis de calcular (ex: o dobro, a metade, o triplo).
      5. Forneça a pergunta, três opções de resposta incorretas e a resposta correta. A lista \`options\` deve conter APENAS as opções incorretas. As opções devem ser números inteiros e plausíveis. Inclua uma opção que seria a resposta se a proporcionalidade fosse do tipo oposto.
      6. Forneça uma explicação curta e simples (1-2 frases) do porquê a resposta está correta, usando a analogia musical.

      Retorne APENAS um objeto JSON contendo uma chave "questions" que é um array de objetos de pergunta, sem nenhum texto adicional.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    questions: {
                        type: Type.ARRAY,
                        items: questionSchema
                    }
                },
                required: ["questions"]
            },
            temperature: 0.8,
        }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    
    if (result && result.questions) {
      return result.questions.map((q: Question) => ({
        ...q,
        options: [...q.options, q.answer].sort(() => Math.random() - 0.5)
      }));
    } else {
      throw new Error("Resposta da API em formato inválido");
    }
  } catch (error) {
    console.error("Erro ao gerar perguntas com Gemini:", error);
    // Fallback para perguntas mockadas em caso de erro na API
    return generateMockQuestions(type, count);
  }
}

function generateMockQuestions(type: ProportionType, count: number): Question[] {
    const mocks: Record<ProportionType, Question[]> = {
        [ProportionType.DIRECT]: [
            {
                question: "Um guitarrista toca 20 notas em 10 segundos. Mantendo o ritmo, quantas notas ele tocará em 20 segundos?",
                options: [10, 30, 20],
                answer: 40,
                explanation: "Proporção direta! Se o tempo dobra, as notas também dobram. O dobro de 20 é 40."
            },
            {
                question: "Para uma gravação, 3 microfones captam 6 canais de áudio. Quantos canais seriam captados por 6 microfones?",
                options: [3, 9, 6],
                answer: 12,
                explanation: "Proporção direta! Se o número de microfones dobra, o número de canais também dobra. O dobro de 6 é 12."
            },
            {
                question: "Se 1 alto-falante consome 50 watts de energia, quantos watts 4 alto-falantes consumirão?",
                options: [100, 150, 50],
                answer: 200,
                explanation: "Proporção direta! Mais alto-falantes precisam de mais energia. 4 vezes 50 watts são 200 watts."
            }
        ],
        [ProportionType.INVERSE]: [
            {
                question: "Uma música a 50 BPM dura 6 minutos. Se a velocidade aumentar para 100 BPM, quanto tempo ela durará?",
                options: [12, 6, 9],
                answer: 3,
                explanation: "Proporção inversa! Se a velocidade dobra, o tempo cai pela metade. Metade de 6 é 3."
            },
            {
                question: "Dois músicos levam 4 horas para montar um palco. Se 4 músicos ajudarem, quanto tempo levarão?",
                options: [8, 4, 1],
                answer: 2,
                explanation: "Proporção inversa! Com o dobro de pessoas trabalhando, o tempo necessário cai pela metade. Metade de 4 é 2."
            },
            {
                question: "Uma banda tem 10 dias de comida em turnê. Se o número de pessoas na equipe dobrar, para quantos dias a comida durará?",
                options: [20, 10, 15],
                answer: 5,
                explanation: "Proporção inversa! Com mais gente para alimentar, a comida acaba mais rápido. Metade dos dias!"
            }
        ]
    };
    const selectedMocks = mocks[type];
    return selectedMocks.slice(0, count).map(q => ({
        ...q,
        options: [...q.options, q.answer].sort(() => Math.random() - 0.5)
    }));
}