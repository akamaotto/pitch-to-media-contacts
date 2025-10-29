import React, { useState } from 'react';
import { ArrowLeft, Archive, MoreVertical, Send, Zap, AlertTriangle } from 'lucide-react';
import MessageBubble from './MessageBubble';
import { useConversations } from '../state/useConversations';
import { Badge, Button, Header, LoadingSpinner, LoadingState, ErrorBoundary, Alert } from '../../../components/ui';
import { useToasts } from '../../../components/ui/Toaster';

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
    const hasCache = seenIdsRef.current.has(id) || (selectedConversation.messages?.length ?? 0) > 0;
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
          if (Math.random() < 0.1) { // 10% chance of error
            reject(new Error('Send operation failed'));
          } else {
            resolve(undefined);
          }
        }, 1500);
      });
      // Send logic would go here
    } catch (error) {
      setReplyError('Failed to send reply. Please try again.');
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
          if (Math.random() < 0.15) { // 15% chance of error
            reject(new Error('AI generation failed'));
          } else {
            resolve(undefined);
          }
        }, 2000);
      });
      // Generation logic would go here
      showSuccess('AI suggested reply generated');
    } catch (error) {
      setGenerateError('Failed to generate AI reply. Please try again.');
      showError('Failed to generate AI reply');
    } finally {
      setGenerateLoading(false);
    }
  };

  return (
    <ErrorBoundary
      onError={(error) => {
        console.error('ConversationDetail error:', error);
      }}
    >
      <div className="flex h-full flex-col">
        <Header variant="default" size="md">
          <Header.Content className="flex items-center gap-3">
            <Button
              onClick={() => setIsMobileDetailView(false)}
              variant="ghost"
              size="sm"
              className="lg:hidden"
              disabled={selectionLoading}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <div className="text-lg font-semibold text-foreground">
                {selectedConversation.contact.name}
                {selectionLoading && <LoadingSpinner size="sm" className="ml-2 inline" ariaLabel="Loading..." />}
              </div>
              <p className="text-xs text-muted-foreground">
                To: {selectedConversation.contact.email}
              </p>
            </div>
          </Header.Content>
          <Header.Actions>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleArchive}
              disabled={archiveLoading}
              className="flex items-center gap-2"
            >
              {archiveLoading ? (
                <LoadingSpinner size="sm" ariaLabel="Archiving..." />
              ) : (
                <Archive className="h-4 w-4" />
              )}
              Archive
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
              More
            </Button>
          </Header.Actions>
        </Header>
        {/* Subject row tucked under header to feel connected */}
        <div className="px-6 pb-4 pt-0">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {selectedConversation.subject}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedConversation.contact.outlet}</span>
            <Badge variant="subtle" className="capitalize">
              {selectedConversation.contact.type}
            </Badge>
          </div>
        </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {selectedConversation.messages.map((message, idx) => (
          <MessageBubble key={idx} message={message} />
        ))}

        <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50 px-4 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
            <Zap className="h-4 w-4" />
            AI Suggestion
          </p>
          <p className="mt-2 text-sm text-amber-700">
            This contact is asking for screenshots and a deadline. Would you like a suggested reply that confirms the details and asks for their preferred image format?
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
                <LoadingSpinner size="sm" className="mr-2" ariaLabel="Generating..." />
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

      <footer className="border-t border-border px-6 py-4">
        {replyError && (
          <Alert className="mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-danger" />
              <span className="text-sm text-danger">{replyError}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSendReply}
                disabled={replyLoading}
                className="ml-auto"
              >
                Retry
              </Button>
            </div>
          </Alert>
        )}
        <textarea
          rows={3}
          placeholder={`Reply to ${selectedConversation.contact.name}...`}
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          disabled={replyLoading}
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Reply as Paul Otto</span>
          <Button
            size="sm"
            onClick={handleSendReply}
            disabled={replyLoading}
            className="flex items-center gap-2"
          >
            {replyLoading ? (
              <>
                <LoadingSpinner size="sm" ariaLabel="Sending..." />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Reply
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
    </ErrorBoundary>
  );
};

export default ConversationDetail;
