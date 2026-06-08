// Edge Function: diario-sync (v2)
// Rotas: POST /push | POST /pull | POST /upload (mídias para Storage)
// Deploy: supabase functions deploy diario-sync --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });

const BUCKET = "diario-media";

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const route = new URL(req.url).pathname.split("/").pop();

    if (route === "push") {
      const { records } = await req.json();
      if (!Array.isArray(records) || !records.length) return json({ ok: true, count: 0 });
      const rows = records.map((r: any) => ({
        id: r.id, owner: r.owner, deleted: !!r.deleted,
        data: r.data ?? {}, updated_at: r.updated_at ?? new Date().toISOString(),
      }));
      const { error } = await supabase.from("diario_recs").upsert(rows, { onConflict: "id" });
      if (error) throw error;
      return json({ ok: true, count: rows.length });
    }

    if (route === "pull") {
      const { since, owner } = await req.json();
      let q = supabase.from("diario_recs").select("*").gte("updated_at", since ?? "1970-01-01");
      if (owner) q = q.eq("owner", owner);
      const { data, error } = await q.order("updated_at", { ascending: true });
      if (error) throw error;
      return json(data ?? []);
    }

    if (route === "upload") {
      const { nome, base64, contentType } = await req.json();
      if (!nome || !base64) return json({ error: "nome e base64 obrigatórios" }, 400);
      // garante o bucket (idempotente)
      await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {});
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const { error } = await supabase.storage.from(BUCKET).upload(nome, bytes, {
        upsert: true, contentType: contentType ?? "application/octet-stream",
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(nome);
      return json({ ok: true, url: data.publicUrl });
    }

    return json({ error: "rota não encontrada" }, 404);
  } catch (e) {
    return json({ error: String((e as Error).message) }, 500);
  }
});
