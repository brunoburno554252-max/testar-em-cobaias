import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { POLOS_DATA, MODALIDADES_CURSOS } from "../_shared/mock-data.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationRequest {
  phase: 'modalidades' | 'polos' | 'cursos' | 'vinculos';
  offset: number;
  batchSize: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const body: MigrationRequest = await req.json();
    const { phase, offset = 0, batchSize = 100 } = body;

    console.log(`[migrate-mock-data] Phase: ${phase}, Offset: ${offset}, BatchSize: ${batchSize}`);

    let result;

    switch (phase) {
      case 'modalidades':
        result = await migrateModalidades(supabase, offset, batchSize);
        break;
      case 'polos':
        result = await migratePolos(supabase, offset, batchSize);
        break;
      case 'cursos':
        result = await migrateCursos(supabase, offset, batchSize);
        break;
      case 'vinculos':
        result = await migrateVinculos(supabase, offset, batchSize);
        break;
      default:
        throw new Error(`Fase desconhecida: ${phase}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[migrate-mock-data] Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// ============= MIGRAÇÃO DE MODALIDADES =============
async function migrateModalidades(supabase: any, offset: number, batchSize: number) {
  const modalidades = Object.keys(MODALIDADES_CURSOS);
  const total = modalidades.length;
  const batch = modalidades.slice(offset, offset + batchSize);
  
  console.log(`[modalidades] Total: ${total}, Processing: ${batch.length} from offset ${offset}`);
  
  const data = batch.map(nome => ({ nome }));
  
  const { error, data: inserted } = await supabase
    .from('modalidades')
    .upsert(data, { onConflict: 'nome', ignoreDuplicates: true })
    .select();
  
  const stats = { inserted: inserted?.length || 0, errors: error ? 1 : 0 };
  
  if (error) {
    console.error('[modalidades] Error:', error);
  } else {
    console.log(`[modalidades] Inserted/updated: ${stats.inserted}`);
  }
  
  const hasMore = offset + batchSize < total;
  
  return {
    success: !error,
    phase: 'modalidades',
    processed: Math.min(offset + batchSize, total),
    total,
    hasMore,
    nextOffset: hasMore ? offset + batchSize : 0,
    message: `Modalidades: ${Math.min(offset + batchSize, total)}/${total} processadas`,
    stats,
  };
}

// ============= MIGRAÇÃO DE POLOS =============
async function migratePolos(supabase: any, offset: number, batchSize: number) {
  const total = POLOS_DATA.length;
  const batch = POLOS_DATA.slice(offset, offset + batchSize);
  
  console.log(`[polos] Total: ${total}, Processing: ${batch.length} from offset ${offset}`);
  
  const { error, data: inserted } = await supabase
    .from('polos')
    .upsert(batch, { onConflict: 'nome', ignoreDuplicates: true })
    .select();
  
  const stats = { inserted: inserted?.length || 0, errors: error ? 1 : 0 };
  
  if (error) {
    console.error('[polos] Error:', error);
  } else {
    console.log(`[polos] Inserted/updated: ${stats.inserted}`);
  }
  
  const hasMore = offset + batchSize < total;
  
  return {
    success: !error,
    phase: 'polos',
    processed: Math.min(offset + batchSize, total),
    total,
    hasMore,
    nextOffset: hasMore ? offset + batchSize : 0,
    message: `Polos: ${Math.min(offset + batchSize, total)}/${total} processados`,
    stats,
  };
}

// ============= MIGRAÇÃO DE CURSOS =============
async function migrateCursos(supabase: any, offset: number, batchSize: number) {
  // Extrair cursos únicos de todas as modalidades
  const allCursos = new Set<string>();
  for (const cursos of Object.values(MODALIDADES_CURSOS)) {
    for (const curso of cursos) {
      allCursos.add(curso);
    }
  }
  
  const cursosArray = Array.from(allCursos).sort();
  const total = cursosArray.length;
  const batch = cursosArray.slice(offset, offset + batchSize);
  
  console.log(`[cursos] Total unique: ${total}, Processing: ${batch.length} from offset ${offset}`);
  
  const data = batch.map(nome => ({ nome }));
  
  const { error, data: inserted } = await supabase
    .from('cursos')
    .upsert(data, { onConflict: 'nome', ignoreDuplicates: true })
    .select();
  
  const stats = { inserted: inserted?.length || 0, errors: error ? 1 : 0 };
  
  if (error) {
    console.error('[cursos] Error:', error);
  } else {
    console.log(`[cursos] Inserted/updated: ${stats.inserted}`);
  }
  
  const hasMore = offset + batchSize < total;
  
  return {
    success: !error,
    phase: 'cursos',
    processed: Math.min(offset + batchSize, total),
    total,
    hasMore,
    nextOffset: hasMore ? offset + batchSize : 0,
    message: `Cursos: ${Math.min(offset + batchSize, total)}/${total} processados`,
    stats,
  };
}

// ============= MIGRAÇÃO DE VÍNCULOS =============
async function migrateVinculos(supabase: any, offset: number, batchSize: number) {
  // Primeiro, buscar todas as modalidades e cursos do banco
  const { data: modalidades } = await supabase.from('modalidades').select('id, nome');
  const { data: cursos } = await supabase.from('cursos').select('id, nome');
  
  if (!modalidades || !cursos) {
    throw new Error('Não foi possível carregar modalidades ou cursos do banco');
  }
  
  // Criar mapas para lookup rápido
  const modalidadeMap = new Map(modalidades.map((m: any) => [m.nome, m.id]));
  const cursoMap = new Map(cursos.map((c: any) => [c.nome, c.id]));
  
  // Gerar todos os vínculos necessários
  const vinculos: { modalidade_id: string; curso_id: string }[] = [];
  
  for (const [modalidadeNome, cursosNomes] of Object.entries(MODALIDADES_CURSOS)) {
    const modalidadeId = modalidadeMap.get(modalidadeNome) as string | undefined;
    if (!modalidadeId) continue;
    
    for (const cursoNome of cursosNomes) {
      const cursoId = cursoMap.get(cursoNome) as string | undefined;
      if (cursoId) {
        vinculos.push({ modalidade_id: modalidadeId, curso_id: cursoId });
      }
    }
  }
  
  const total = vinculos.length;
  const batch = vinculos.slice(offset, offset + batchSize);
  
  console.log(`[vinculos] Total: ${total}, Processing: ${batch.length} from offset ${offset}`);
  
  // Usar upsert para evitar duplicatas
  const { error, data: inserted } = await supabase
    .from('curso_modalidades')
    .upsert(batch, { onConflict: 'curso_id,modalidade_id', ignoreDuplicates: true })
    .select();
  
  const stats = { inserted: inserted?.length || 0, errors: error ? 1 : 0 };
  
  if (error) {
    console.error('[vinculos] Error:', error);
  } else {
    console.log(`[vinculos] Inserted/updated: ${stats.inserted}`);
  }
  
  const hasMore = offset + batchSize < total;
  
  return {
    success: !error,
    phase: 'vinculos',
    processed: Math.min(offset + batchSize, total),
    total,
    hasMore,
    nextOffset: hasMore ? offset + batchSize : 0,
    message: `Vínculos: ${Math.min(offset + batchSize, total)}/${total} processados`,
    stats,
  };
}
