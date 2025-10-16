"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPage, updatePage, type PageItem } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Editor = dynamic(() => import("@/components/editor/simple-editor"), {
  ssr: false,
});

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = useMemo(() => Number(params?.id), [params]);
  const [page, setPage] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!id || Number.isNaN(id)) return;
      const data = await getPage(id);
      if (!mounted) return;
      if (data) {
        setPage(data);
        setTitle(data.title || "Untitled");
      } else {
        // fallback if not found
        router.replace("/dashboard");
      }
      setLoading(false);
    }
    run();
    return () => {
      mounted = false;
    };
  }, [id, router]);

  // debounce save title/content
  const saveContent = useMemo(() => {
    let t: any;
    return (payload: Partial<PageItem>) => {
      if (!page) return;
      clearTimeout(t);
      t = setTimeout(async () => {
        setSaving(true);
        const updated = await updatePage(page.id, payload);
        if (updated) setPage(updated);
        setSaving(false);
      }, 500);
    };
  }, [page]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!page) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            saveContent({ title: e.target.value });
          }}
          className="text-2xl font-semibold"
        />
        {saving && (
          <span className="text-sm text-muted-foreground">Saving...</span>
        )}
        <div className="ml-auto" />
      </div>

      <Editor
        initialValue={undefined}
        onChange={(html) => {
          saveContent({ content: html });
        }}
      />

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          Back
        </Button>
      </div>
    </div>
  );
}
