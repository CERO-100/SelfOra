"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createTemplate,
  deleteTemplate,
  listTemplates,
  TemplateItem,
  updateTemplate,
  useTemplate,
} from "@/lib/api";
import { Plus, Pencil, Trash2, Copy, Save, X } from "lucide-react";

export default function TemplatesPage() {
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TemplateItem | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    is_global: false,
    category: "",
    tags: "",
  });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return items.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q) ||
        (t.category || "").toLowerCase().includes(q)
    );
  }, [items, query]);

  const load = async () => {
    setLoading(true);
    const data = await listTemplates();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      content: "",
      is_global: false,
      category: "",
      tags: "",
    });
    setShowModal(true);
  };

  const openEdit = (item: TemplateItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || "",
      content: JSON.stringify(item.content ?? {}, null, 2),
      is_global: item.is_global,
      category: item.category || "",
      tags: (item.tags || []).join(", "),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    const payload = {
      title: form.title.trim() || "Untitled",
      description: form.description.trim(),
      content: safeParseJSON(form.content) ?? {},
      is_global: form.is_global,
      category: form.category.trim(),
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    } as Partial<TemplateItem>;

    if (editing) {
      const res = await updateTemplate(editing.id, payload);
      if (res) {
        setShowModal(false);
        load();
      }
    } else {
      const res = await createTemplate(payload);
      if (res) {
        setShowModal(false);
        load();
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this template?")) return;
    const ok = await deleteTemplate(id);
    if (ok) load();
  };

  const handleUse = async (id: number) => {
    const res = await useTemplate(id);
    if (res) {
      // Optionally navigate to an editor page using res.id
      await load();
      alert("Template copied to your library.");
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="text-sm text-muted-foreground">
            Browse, create, and manage templates. Admins can create global
            templates.
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Search templates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-60"
          />
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> New Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <p>Loading...</p>}
        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-sm text-muted-foreground">
            No templates found.
          </div>
        )}
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-lg border p-4 bg-card text-card-foreground shadow-sm flex flex-col"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-medium leading-tight">
                  {t.title}
                  {t.is_global && (
                    <span className="ml-2 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                      Global
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {t.description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleUse(t.id)}
                  title="Use template"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(t)}
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(t.id)}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Updated {new Date(t.updated_at).toLocaleString()} by{" "}
              {t.owner_username || "System"}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-background border shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium">
                {editing ? "Edit Template" : "New Template"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm">Title</label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Template title"
                  />
                </div>
                <div>
                  <label className="text-sm">Category</label>
                  <Input
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, category: e.target.value }))
                    }
                    placeholder="e.g. Notes, Project, Study"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm">Description</label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Short description"
                />
              </div>
              <div>
                <label className="text-sm">Tags (comma separated)</label>
                <Input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tags: e.target.value }))
                  }
                  placeholder="tag1, tag2"
                />
              </div>
              <div>
                <label className="text-sm">Content (JSON)</label>
                <Textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder='{"type":"doc","content":[]}'
                  className="min-h-48"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: Paste JSON from the editor. We'll integrate the rich
                  editor next.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" /> Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function safeParseJSON(s: string): any | null {
  try {
    return s ? JSON.parse(s) : {};
  } catch (e) {
    console.warn("Invalid JSON content, saving empty object.");
    return {};
  }
}
