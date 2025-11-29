import React, { useState } from "react";
import {
  ArrowLeft,
  Archive,
  MoreVertical,
  Send,
  Zap,
  AlertTriangle,
} from "lucide-react";
import MessageBubble from "./MessageBubble";
import { useConversations } from "../state/useConversations";
import {
  Badge,
  Button,
  Header,
  LoadingSpinner,
  LoadingState,
  ErrorBoundary,
  Alert,
} from "../../../components/ui";
import { useToasts } from "../../../components/ui/Toaster";

const ConversationDetail: React.FC = () => {
  const {
    selectedConversation,
    setIsMobileDetailView,
    selectionLoading,
    handleArchiveConversation,
  } = useConversations();
  const [replyLoading, setReplyLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [generateLoading, setGenerateLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const seenIdsRef = React.useRef<Set<number>>(new Set());
  const { showSuccess, showError } = useToasts();

  // Show shimmer only for first-time uncached selections; otherwise load instantly
  React.useEffect(() => {
    if (!selectedConversation) return;
    const id = selectedConversation.id;
    const hasCache =
      seenIdsRef.current.has(id) ||
      (selectedConversation.messages?.length ?? 0) > 0;
    if (hasCache) {
      setDetailLoading(false);
      seenIdsRef.current.add(id);
      return;
    }
    setDetailLoading(true);
    const timer = setTimeout(() => {
      setDetailLoading(false);
      seenIdsRef.current.add(id);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedConversation]);

  if (!selectedConversation) {
    return (
      <div className="flex flex-1 items-center justify-center p-10 text-sm text-muted-foreground">
        Select a conversation thread to view details.
      </div>
    );
  }

  if (detailLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b border-border/80 bg-surface">
          <Header variant="default" size="md" className="pb-2">
            <Header.Content className="flex items-center gap-3">
              <LoadingState type="action" />
            </Header.Content>
          </Header>
        </div>
        <div className="flex-1">
          <LoadingState type="detail" />
        </div>
      </div>
    );
  }

  const handleArchive = async () => {
    if (!selectedConversation) return;

    try {
      setArchiveLoading(true);

      // Use optimistic update function from state
      const success = await handleArchiveConversation(selectedConversation.id);

      if (!success) {
        // Archive failed, but error is handled by the state
      }
    } catch (error) {
      // Archive failed, but error is handled by the state
    } finally {
      setArchiveLoading(false);
    }
  };

  const handleSendReply = async () => {
    try {
      setReplyLoading(true);
      setReplyError(null);
      // Simulate send operation with potential error
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.1) {
            // 10% chance of error
            reject(new Error("Send operation failed"));
          } else {
            resolve(undefined);
          }
        }, 1500);
      });
      // Send logic would go here
    } catch (error) {
      setReplyError("Failed to send reply. Please try again.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleGenerateReply = async () => {
    try {
      setGenerateLoading(true);
      setGenerateError(null);
      // Simulate AI generation with potential error
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() < 0.15) {
            // 15% chance of error
            reject(new Error("AI generation failed"));
          } else {
            resolve(undefined);
          }
        }, 2000);
      });
      // Generation logic would go here
      showSuccess("AI suggested reply generated");
    } catch (error) {
      setGenerateError("Failed to generate AI reply. Please try again.");
      showError("Failed to generate AI reply");
    } finally {
      setGenerateLoading(false);
    }
  };

  return (
    <ErrorBoundary
      onError={() => {
        // Keep detail surface stable; user sees a concise fallback via ErrorBoundary UI.
      }}
    >
      {/* Root: 3-zone vertical layout inside the Inbox pane */}
      <div className="flex h-full min-h-0 flex-col bg-surface">
        {/* Zone A: Calm, compact fixed header band */}
        <Header
          variant="default"
          size="md"
          className="border-b border-border/60 bg-muted/60 px-6 py-4"
        >
          <Header.Content className="flex items-start gap-3">
            <Button
              onClick={() => setIsMobileDetailView(false)}
              variant="ghost"
              size="icon"
              className="mt-0.5 h-7 w-7 lg:hidden"
              disabled={selectionLoading}
              aria-label="Back to conversation list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-start gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="truncate text-base font-semibold leading-snug text-foreground">
                      {selectedConversation.contact.name}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="truncate">
                      {selectedConversation.contact.outlet}
                      {selectedConversation.contact.email && (
                        <> &bull; {selectedConversation.contact.email}</>
                      )}
                    </span>
                    {selectedConversation.contact.type && (
                      <span className="rounded-full border border-border/60 px-2 py-[2px] text-[9px] uppercase tracking-wide text-muted-foreground">
                        {selectedConversation.contact.type}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right-aligned status pill */}
                <div className="ml-auto flex items-start">
                  <span className="inline-flex items-center rounded-full bg-emerald-500/8 px-2.5 py-1 text-[9px] font-medium text-emerald-700">
                    {selectedConversation.status || "Awaiting response"}
                  </span>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground">
                Context for this pitch and reply history.
              </p>

              {/* Subject / meta row */}
              <div className="mt-1 flex flex-wrap items-baseline gap-2 text-xs">
                <span className="line-clamp-1 font-medium text-foreground">
                  {selectedConversation.subject}
                </span>
              </div>
            </div>
          </Header.Content>

          <Header.Actions className="ml-2 flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleArchive}
              disabled={archiveLoading}
              className="flex items-center gap-1.5 text-[11px]"
            >
              {archiveLoading ? (
                <LoadingSpinner size="sm" ariaLabel="Archiving..." />
              ) : (
                <Archive className="h-3.5 w-3.5" />
              )}
              Archive
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="More actions"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </Header.Actions>
        </Header>

        {/* Zone B: Scrollable messages list */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-3 pb-24">
          {selectedConversation.messages.map((message, idx) => (
            <MessageBubble key={idx} message={message} />
          ))}

          {/* AI suggestion callout remains within the scrollable thread */}
          <div className="mt-2 rounded-xl border border-dashed border-amber-200/90 bg-amber-50/90 px-4 py-4 shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
              <Zap className="h-4 w-4" />
              AI Suggestion
            </p>
            <p className="mt-2 text-sm text-amber-700">
              Use AI to draft a clear, on-voice reply so you can respond faster
              and keep a clean record of the outcome.
            </p>

            {generateError && (
              <Alert className="mt-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-danger" />
                  <span className="text-sm text-danger">{generateError}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateReply}
                    disabled={generateLoading}
                    className="ml-auto"
                  >
                    Retry
                  </Button>
                </div>
              </Alert>
            )}

            <Button
              variant="default"
              size="sm"
              className="mt-3"
              onClick={handleGenerateReply}
              disabled={generateLoading}
            >
              {generateLoading ? (
                <>
                  <LoadingSpinner
                    size="sm"
                    className="mr-2"
                    ariaLabel="Generating..."
                  />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Suggested Reply
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Zone C: Fixed composer at the bottom */}
        <footer className="border-t border-border/60 bg-background px-6 py-4">
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Reply
              </span>
              <span className="text-[10px] text-muted-foreground">
                Reply as Paul Otto
              </span>
            </div>

            {/* Subtle card-like input area */}
            <div className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5">
              {replyError && (
                <Alert className="mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-danger" />
                    <span className="text-xs text-danger">{replyError}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendReply}
                      disabled={replyLoading}
                      className="ml-auto h-6 px-2 text-[10px]"
                    >
                      Retry
                    </Button>
                  </div>
                </Alert>
              )}

              <textarea
                rows={3}
                placeholder={`Write a clear, concise reply to ${selectedConversation.contact.name}...`}
                className="w-full resize-none border-0 bg-transparent px-1 py-0.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
                disabled={replyLoading}
              />

              {/* Actions aligned to the right */}
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateReply}
                  disabled={generateLoading}
                  className="flex items-center gap-1.5 text-[11px]"
                >
                  {generateLoading ? (
                    <>
                      <LoadingSpinner size="sm" ariaLabel="Generating..." />
                      AI drafting...
                    </>
                  ) : (
                    <>
                      <Zap className="h-3.5 w-3.5" />
                      AI Suggest
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  onClick={handleSendReply}
                  disabled={replyLoading}
                  className="flex items-center gap-1.5 text-[11px]"
                >
                  {replyLoading ? (
                    <>
                      <LoadingSpinner size="sm" ariaLabel="Sending..." />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default ConversationDetail;
