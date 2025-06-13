import api from './api';

export interface Effect {
  _id: string;
  name: string;
  description: string;
  type: 'positive' | 'negative';
  category: string;
  severity?: 'mild' | 'moderate' | 'severe';
  frequency: 'rare' | 'uncommon' | 'common' | 'very_common';
  isCommon: boolean;
}

// Description: Seed the database with initial effects and side effects data
// Endpoint: POST /api/seed/effects
// Request: {}
// Response: { success: boolean, message: string, data: { count: number, effects: Array<{ id: string, name: string, type: string, category: string }> } }
export const seedEffects = async () => {
  try {
    return await api.post('/api/seed/effects');
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Clear all effects data from the database
// Endpoint: DELETE /api/seed/effects
// Request: {}
// Response: { success: boolean, message: string, data: { deletedCount: number } }
export const clearEffects = async () => {
  try {
    return await api.delete('/api/seed/effects');
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};

// Description: Get list of all effects
// Endpoint: GET /api/effects
// Request: { type?: 'positive' | 'negative', category?: string }
// Response: { effects: Effect[] }
export const getEffects = (filters?: { type?: 'positive' | 'negative'; category?: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allEffects: Effect[] = [
        {
          _id: '1',
          name: 'Faster healing',
          description: 'Accelerated wound healing and tissue repair',
          type: 'positive',
          category: 'Recovery',
          frequency: 'very_common',
          isCommon: true
        },
        {
          _id: '2',
          name: 'Better sleep quality',
          description: 'Improved depth and quality of sleep',
          type: 'positive',
          category: 'Sleep',
          frequency: 'common',
          isCommon: true
        },
        {
          _id: '3',
          name: 'Increased energy',
          description: 'Higher overall energy levels throughout the day',
          type: 'positive',
          category: 'Metabolic',
          frequency: 'common',
          isCommon: true
        },
        {
          _id: '4',
          name: 'Improved recovery time',
          description: 'Shorter time needed between training sessions',
          type: 'positive',
          category: 'Recovery',
          frequency: 'common',
          isCommon: true
        },
        {
          _id: '5',
          name: 'Enhanced muscle growth',
          description: 'Increased lean muscle mass and hypertrophy',
          type: 'positive',
          category: 'Physical Performance',
          frequency: 'common',
          isCommon: true
        },
        {
          _id: '6',
          name: 'Injection site irritation',
          description: 'Redness, swelling, or discomfort at injection site',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        },
        {
          _id: '7',
          name: 'Nausea',
          description: 'Feelings of sickness and stomach discomfort',
          type: 'negative',
          category: 'Side Effect',
          severity: 'moderate',
          frequency: 'common',
          isCommon: true
        },
        {
          _id: '8',
          name: 'Water retention',
          description: 'Mild fluid retention and bloating',
          type: 'negative',
          category: 'Side Effect',
          severity: 'mild',
          frequency: 'common',
          isCommon: true
        }
      ];

      const filteredEffects = filters?.type
        ? allEffects.filter(effect => effect.type === filters.type)
        : allEffects;

      resolve({
        effects: filteredEffects
      });
    }, 500);
  });
};