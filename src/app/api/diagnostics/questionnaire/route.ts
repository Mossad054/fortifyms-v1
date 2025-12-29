import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Type definitions
type Question = {
  id: string;
  type: string;
  question: string;
  unit?: string;
  expectedRange?: { min: number; max: number };
  help: string;
  required: boolean;
  branching?: Record<string, { condition: string; nextQuestions: string[] }>;
  options?: string[];
  conditional?: { field: string; value: any };
};

type QuestionnaireCategory = {
  [key: string]: {
    title: string;
    questions: Question[];
  };
};

type Questionnaires = {
  [key: string]: QuestionnaireCategory;
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { category, subcategory, cropType, equipmentType } = await request.json();

    // Sample questionnaire templates based on category
    const questionnaires: Questionnaires = {
      rice_parboiling: {
        soaking: {
          title: 'Rice Parboiling - Soaking Process Diagnostic',
          questions: [
            {
              id: 'soak_temp',
              type: 'numeric',
              question: 'Enter soaking bath temperature in °C:',
              unit: '°C',
              expectedRange: { min: 65, max: 75 },
              help: 'Measure water temperature at multiple points in the soaking tank',
              required: true,
              branching: {
                'out_of_range': {
                  condition: 'value < 65 || value > 75',
                  nextQuestions: ['temp_alarm_check', 'heating_system_check']
                }
              }
            },
            {
              id: 'soak_time',
              type: 'numeric',
              question: 'Enter soaking time in hours:',
              unit: 'hours',
              expectedRange: { min: 4, max: 8 },
              help: 'Total time from when rice enters to when it leaves soaking tank',
              required: true,
              branching: {
                'insufficient': {
                  condition: 'value < 4',
                  nextQuestions: ['bottleneck_analysis', 'capacity_planning']
                },
                'excessive': {
                  condition: 'value > 8',
                  nextQuestions: ['throughput_analysis', 'process_efficiency']
                }
              }
            }
          ]
        },
        steaming: {
          title: 'Rice Parboiling - Steaming Process Diagnostic',
          questions: [
            {
              id: 'steam_temp',
              type: 'numeric',
              question: 'Enter steam temperature in °C:',
              unit: '°C',
              expectedRange: { min: 100, max: 110 },
              help: 'Measure temperature at multiple points in the steaming chamber',
              required: true
            },
            {
              id: 'steam_time',
              type: 'numeric',
              question: 'Enter steaming time in minutes:',
              unit: 'minutes',
              expectedRange: { min: 15, max: 30 },
              help: 'Total steaming duration',
              required: true
            }
          ]
        }
      }
    };

    // Use type assertion to safely access the questionnaire
    const selectedQuestionnaire = (questionnaires as any)[category]?.[subcategory] as 
      { title: string; questions: Question[] } | undefined;
    
    if (!selectedQuestionnaire) {
      return NextResponse.json(
        { error: 'Questionnaire not found for selected category/subcategory' },
        { status: 404 }
      );
    }

    // Rest of your existing code...
    const diagnosticResult = await db.diagnosticResult.create({
      data: {
        // ... your existing data
      }
    });

    return NextResponse.json({
      success: true,
      data: diagnosticResult,
      questions: selectedQuestionnaire.questions
    });

  } catch (error) {
    console.error('Error in questionnaire route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}