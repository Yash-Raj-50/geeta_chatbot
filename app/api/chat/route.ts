import { NextRequest } from 'next/server';
import {
  BedrockAgentRuntimeClient,
  RetrieveAndGenerateStreamCommand,
} from '@aws-sdk/client-bedrock-agent-runtime';

// Initialize the Bedrock Agent Runtime client for knowledge base access
const bedrockAgentRuntime = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// In-memory store for conversation history
const conversationStore = new Map<string, any[]>();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { messages } = await request.json();
    
    // Get the latest user message (the query to search in the knowledge base)
    const latestUserMessage = messages[messages.length - 1].content;
    
    // Log the request for debugging
    console.log('Processing request with knowledge base ID:', process.env.AWS_BEDROCK_KNOWLEDGE_BASE_ID);
    console.log('User message:', latestUserMessage);
    
    // Verify knowledge base ID is available
    if (!process.env.AWS_BEDROCK_KNOWLEDGE_BASE_ID) {
      throw new Error('Knowledge base ID is not configured. Please set AWS_BEDROCK_KNOWLEDGE_BASE_ID in your environment variables.');
    }
    
    // Set up the RetrieveAndGenerateStreamCommand similar to the example code
    const command = new RetrieveAndGenerateStreamCommand({
      input: {
        text: latestUserMessage
      },
      retrieveAndGenerateConfiguration: {
        type: 'KNOWLEDGE_BASE',
        knowledgeBaseConfiguration: {
          knowledgeBaseId: process.env.AWS_BEDROCK_KNOWLEDGE_BASE_ID,
          modelArn: process.env.AWS_BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0', // Simplified modelArn format
          retrievalConfiguration: {
            vectorSearchConfiguration: {
              numberOfResults: 5
            }
          }
          // Removed the prompt template as it's not used in your example
        }
      }
    });
    
    // Execute the command
    console.log('Sending request to Bedrock...');
    const response = await bedrockAgentRuntime.send(command);
    console.log('Received response from Bedrock');
    
    // Verify we got a stream back
    if (!response.stream) {
      throw new Error('No stream in response from Bedrock');
    }
    
    // Create a stream for the response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let completeResponse = '';
        
        try {
          // Process the stream like in your example code
          for await (const item of response.stream!) {
            // Check for output format (as in your example)
            if (item.output) {
              console.log('Received output:', item.output);
              const text = item.output.text || '';
              if (text) {
                completeResponse += text;
                try {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                } catch (enqueueError) {
                  console.warn('Error enqueueing data:', enqueueError);
                }
              }
            }
            // Also handle retrievalResult for debugging
            else if ('retrievalResult' in item && item.retrievalResult) {
              console.log('Retrieval result:', item.retrievalResult);
            }
            // Handle chunk format as a fallback
            else if ('chunk' in item && item.chunk && (item.chunk as any).bytes) {
              const decoder = new TextDecoder();
              const jsonString = decoder.decode((item.chunk as any).bytes);
              console.log('Chunk data:', jsonString.substring(0, 100) + '...');
              
              try {
                const data = JSON.parse(jsonString);
                let text = '';
                if (data.delta?.text) {
                  text = data.delta.text;
                } else if (data.text) {
                  text = data.text;
                }
                
                if (text) {
                  completeResponse += text;
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                }
              } catch (parseError) {
                console.error('Error parsing chunk data:', parseError);
              }
            }
            // Log any other event types for debugging
            else {
              console.log('Unknown event type:', Object.keys(item));
            }
          }
          
          // Handle empty responses
          if (!completeResponse) {
            console.warn('No response text was generated from knowledge base');
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              text: "I couldn't find specific information about this in the Bhagavad Gita. Could you try rephrasing your question?"
            })}\n\n`));
          }
          
          // Signal the end of the stream
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Error processing stream:', error);
          controller.error(error);
        }
      }
    });
    
    // Return the stream as SSE
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process your request with the Bhagavad Gita knowledge base', 
      details: error instanceof Error ? error.message : String(error) 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: NextRequest) {
  // Get the session ID from the URL parameters
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  if (sessionId) {
    conversationStore.delete(sessionId);
  }
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}