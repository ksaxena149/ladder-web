import { NextRequest, NextResponse } from 'next/server';
import { ApiRequest, ApiResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: ApiRequest = await request.json();
    
    if (!body.bill_id || !body.query) {
      return NextResponse.json(
        { error: 'Missing required fields: bill_id or query' },
        { status: 400 }
      );
    }
    
    // This is a mock implementation
    // In a real implementation, you would call the model API here
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock responses based on query
    const mockResponses: Record<string, string> = {
      'summarize this bill': `This bill proposes changes to ${body.bill_id} that would impact various sectors. The main provisions include funding allocations, regulatory changes, and implementation timelines. It aims to address current challenges while setting a framework for future improvements.`,
      'what is the purpose of this bill': `The purpose of ${body.bill_id} is to establish a comprehensive framework for addressing key issues in its domain. It seeks to improve outcomes through targeted interventions, resource allocation, and policy modifications.`,
    };
    
    // Default response for any other query
    const response: ApiResponse = {
      response: mockResponses[body.query.toLowerCase()] || 
        `I've analyzed ${body.bill_id}. Regarding your question "${body.query}", the bill contains relevant provisions that address this matter through a combination of regulatory changes, funding mechanisms, and implementation guidelines.`
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 