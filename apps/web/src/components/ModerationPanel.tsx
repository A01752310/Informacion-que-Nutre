"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch, ApiError } from "@/lib/api";
import type { RecipeSubmission, RecipeVideo, SubmissionStatus, VideoStatus } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";
import Icon from "@/components/ui/Icon";

type Tab = "recetas" | "videos";

function statusBadgeVariant(status: string): "pending" | "approved" | "rejected" {
  if (status === "approved" || status === "published") return "approved";
  if (status === "rejected") return "rejected";
  return "pending";
}

function statusLabel(status: string): string {
  if (status === "pending_review") return "Pendiente";
  if (status === "approved") return "Aprobado";
  if (status === "rejected") return "Rechazado";
  if (status === "published") return "Publicado";
  return status;
}

export default function ModerationPanel() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>("recetas");
  const [submissions, setSubmissions] = useState<RecipeSubmission[]>([]);
  const [videos, setVideos] = useState<RecipeVideo[]>([]);
  const [loadingSub, setLoadingSub] = useState(true);
  const [loadingVid, setLoadingVid] = useState(true);

  /* Review drawer */
  const [reviewTarget, setReviewTarget] = useState<{ type: "submission" | "video"; id: string; title: string } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/auth");
  }, [isLoading, isAuthenticated, router]);

  const fetchSubmissions = useCallback(async () => {
    try {
      const data = await apiFetch<RecipeSubmission[]>("/api/v1/recipes/submissions/pending");
      setSubmissions(data);
    } catch { /* forbidden for non-editors */ }
    finally { setLoadingSub(false); }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const data = await apiFetch<RecipeVideo[]>("/api/v1/recipes/videos/pending");
      setVideos(data);
    } catch { /* forbidden for non-editors */ }
    finally { setLoadingVid(false); }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchVideos();
    }
  }, [isAuthenticated, fetchSubmissions, fetchVideos]);

  const handleReview = async () => {
    if (!reviewTarget || !reviewAction) return;
    setReviewing(true);
    setReviewError(null);

    const newStatus: SubmissionStatus | VideoStatus =
      reviewAction === "approve" ? "approved" : "rejected";

    try {
      if (reviewTarget.type === "submission") {
        await apiFetch(`/api/v1/recipes/submissions/${reviewTarget.id}/review`, {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus, review_notes: reviewNotes || undefined }),
        });
        await fetchSubmissions();
      } else {
        await apiFetch(`/api/v1/recipes/videos/${reviewTarget.id}/review`, {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus, review_notes: reviewNotes || undefined }),
        });
        await fetchVideos();
      }
      setReviewTarget(null);
      setReviewNotes("");
      setReviewAction(null);
    } catch (err) {
      setReviewError(err instanceof ApiError ? err.message : "Error al procesar revisión.");
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="relative">
      {/* ── Tabs ── */}
      <div className="flex gap-2 mb-10 border-b border-outline-variant/15">
        <button
          onClick={() => setTab("recetas")}
          className={`px-6 py-3 font-bold -mb-px transition-colors ${
            tab === "recetas"
              ? "border-b-2 border-primary text-primary"
              : "text-on-surface-variant"
          }`}
        >
          <Icon name="article" className="mr-2 text-lg align-middle" />
          Recetas ({submissions.length})
        </button>
        <button
          onClick={() => setTab("videos")}
          className={`px-6 py-3 font-bold -mb-px transition-colors ${
            tab === "videos"
              ? "border-b-2 border-primary text-primary"
              : "text-on-surface-variant"
          }`}
        >
          <Icon name="videocam" className="mr-2 text-lg align-middle" />
          Videos ({videos.length})
        </button>
      </div>

      {/* ── Submissions Table ── */}
      {tab === "recetas" && (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
          {loadingSub ? (
            <div className="p-12 animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-surface-container-highest rounded" />
              ))}
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              <Icon name="check_circle" className="text-4xl text-primary mb-4 block mx-auto" />
              <p className="font-medium">No hay recetas pendientes de revisión.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/10">
                  <th className="text-left p-4">Título</th>
                  <th className="text-left p-4 hidden md:table-cell">Estado</th>
                  <th className="text-left p-4 hidden md:table-cell">Fecha</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((s) => (
                  <tr key={s.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50 transition-colors">
                    <td className="p-4 font-medium">{s.title}</td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant={statusBadgeVariant(s.status)}>
                        {statusLabel(s.status)}
                      </Badge>
                    </td>
                    <td className="p-4 hidden md:table-cell text-on-surface-variant">
                      {new Date(s.created_at).toLocaleDateString("es-MX")}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setReviewTarget({ type: "submission", id: s.id, title: s.title })}
                        className="text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Videos Table ── */}
      {tab === "videos" && (
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
          {loadingVid ? (
            <div className="p-12 animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-surface-container-highest rounded" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              <Icon name="check_circle" className="text-4xl text-primary mb-4 block mx-auto" />
              <p className="font-medium">No hay videos pendientes de revisión.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-on-surface-variant uppercase tracking-wider border-b border-outline-variant/10">
                  <th className="text-left p-4">YouTube URL</th>
                  <th className="text-left p-4 hidden md:table-cell">Estado</th>
                  <th className="text-left p-4 hidden md:table-cell">Fecha</th>
                  <th className="text-right p-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className="border-b border-outline-variant/5 hover:bg-surface-container/50 transition-colors">
                    <td className="p-4 font-medium truncate max-w-[200px]">
                      <a href={v.youtube_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {v.youtube_url}
                      </a>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge variant={statusBadgeVariant(v.status)}>
                        {statusLabel(v.status)}
                      </Badge>
                    </td>
                    <td className="p-4 hidden md:table-cell text-on-surface-variant">
                      {new Date(v.created_at).toLocaleDateString("es-MX")}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setReviewTarget({ type: "video", id: v.id, title: v.youtube_url })}
                        className="text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                      >
                        Revisar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ── Review Drawer ── */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setReviewTarget(null)}
          />
          {/* Drawer */}
          <div className="relative w-full max-w-md bg-surface shadow-xl border-l border-outline-variant/15 overflow-y-auto p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline font-bold text-xl text-primary">
                Revisar {reviewTarget.type === "submission" ? "Receta" : "Video"}
              </h3>
              <button onClick={() => setReviewTarget(null)}>
                <Icon name="close" className="text-on-surface-variant text-2xl" />
              </button>
            </div>

            <div className="p-4 bg-surface-container-low rounded-lg">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                {reviewTarget.type === "submission" ? "Título" : "URL"}
              </p>
              <p className="font-medium break-all">{reviewTarget.title}</p>
            </div>

            <Textarea
              label="Notas de Revisión"
              placeholder="Opcional — agrega feedback para el autor..."
              rows={4}
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
            />

            {reviewError && (
              <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm">
                {reviewError}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                variant="primary"
                onClick={() => { setReviewAction("approve"); }}
                className={`flex-1 py-3 text-sm ${reviewAction === "approve" ? "ring-2 ring-primary" : ""}`}
              >
                <Icon name="check" /> Aprobar
              </Button>
              <Button
                variant="secondary"
                onClick={() => { setReviewAction("reject"); }}
                className={`flex-1 py-3 text-sm ${reviewAction === "reject" ? "ring-2 ring-secondary" : ""}`}
              >
                <Icon name="close" /> Rechazar
              </Button>
            </div>

            <Button
              onClick={handleReview}
              isLoading={reviewing}
              disabled={!reviewAction}
              className="w-full py-4"
            >
              Confirmar Decisión
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
