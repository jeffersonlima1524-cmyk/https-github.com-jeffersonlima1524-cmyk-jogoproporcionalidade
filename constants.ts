
import { ProportionType } from './types';

export const TOTAL_QUESTIONS_PER_TYPE = 3;

export const CONCEPTS = [
  {
    type: ProportionType.DIRECT,
    title: 'Proporcionalidade Direta',
    explanation: 'Quando uma coisa aumenta, a outra aumenta junto! Se uma diminui, a outra também diminui. Elas se movem na mesma direção, como o volume e o número de instrumentos tocando.',
    imageUrl: 'https://picsum.photos/seed/directproportionality/600/300',
  },
  {
    type: ProportionType.INVERSE,
    title: 'Proporcionalidade Inversa',
    explanation: 'Aqui é o oposto! Quando uma coisa aumenta, a outra diminui. Elas se movem em direções opostas, como acelerar o ritmo (BPM) de uma música faz sua duração diminuir.',
    imageUrl: 'https://picsum.photos/seed/inverseproportionality/600/300',
  },
];
