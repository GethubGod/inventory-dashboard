export const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const jsonHeaders: Record<string, string> = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

export function handleCors(): Response {
  return new Response("ok", { headers: corsHeaders });
}

export function ok<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ data, error: null }), {
    status,
    headers: jsonHeaders,
  });
}

export function err(message: string, status = 400): Response {
  return new Response(JSON.stringify({ data: null, error: message }), {
    status,
    headers: jsonHeaders,
  });
}
