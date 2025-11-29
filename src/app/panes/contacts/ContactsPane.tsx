import { useEffect } from "react";
import { useApp } from "../../../hooks/useApp";
import { useContacts } from "../../../features/contacts";
import { usePitches } from "../../../features/pitches";
import { useConversations } from "../../../features/conversations/state/useConversations";
import { useRouter } from "@tanstack/react-router";
import { useToasts } from "../../../components/ui/Toaster";
import ContactSelectionView from "../../../features/contacts/components/contact-selection";
import { cx } from "../../../utils/cx";
import { Button, Panel } from "../../../components/ui";
import { StepNarrative } from "../../../components/ui/StepNarrative";

export type ContactsPaneProps = {
  className?: string;
  onNavigate: (surface: "contacts" | "inbox" | "composer") => void;
  tab?: "recommended" | "all" | "myContacts" | "pitched";
  preloadedData?: {
    contacts: any[];
    tab?: string;
  };
};

export const ContactsPane = ({
  className,
  tab,
  preloadedData,
}: ContactsPaneProps) => {
  const { selectedTab } = useApp();

  // Use tab from prop if provided, otherwise use from router state
  const currentTab = tab || selectedTab;
  const {
    selectedContacts,
    showPitchedTab,
    autoSelectRecommended,
    mediaContacts,
    updateContactsAsPitched,
  } = useContacts();
  const router = useRouter();
  const { showToast } = useToasts();
  const { addConversations } = useConversations();
  const {
    generatePitchesSequential,
    generateAndSend,
    sendingStatus,
    generationMessage,
    generationCurrent,
    generationTotal,
  } = usePitches();

  useEffect(() => {
    autoSelectRecommended();
  }, [autoSelectRecommended]);

  const selectedCount = selectedContacts.size;
  const totalGenerationCount = generationTotal || selectedCount || 0;
  const completedCount =
    typeof generationCurrent === "number" ? generationCurrent : 0;

  const getProgressLabel = () => {
    if (sendingStatus === "sending") {
      if (totalGenerationCount > 0) {
        return `Preparing tailored pitches for ${totalGenerationCount} contacts… (${completedCount} of ${totalGenerationCount} completed)`;
      }
      return "Preparing tailored pitches for your selected contacts…";
    }
    if (sendingStatus === "idle") {
      return null;
    }
    if (sendingStatus === "sent") {
      return "We could not complete all pitches. Please try again.";
    }
    return generationMessage || null;
  };

  const progressLabel = getProgressLabel();

  return (
    <div className={cx("space-y-4", className)}>
      <StepNarrative activeStep={1} />

      {progressLabel && (
        <Panel
          padding="sm"
          className="flex items-center justify-between gap-3 border-primary/15 bg-primary/3 text-[10px] text-muted-foreground shadow-sm"
        >
          <div className="flex-1 leading-snug text-foreground">
            {progressLabel}
          </div>
          {sendingStatus === "sending" && totalGenerationCount > 0 && (
            <div className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-medium text-primary">
              {completedCount}/{totalGenerationCount}
            </div>
          )}
        </Panel>
      )}

      <ContactSelectionView />

      {/* Elevated selection action bar */}
      <Panel
        padding="md"
        className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface/98 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-baseline gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Pitch list ready
            </span>
            <span className="text-sm">
              <span className="font-semibold text-foreground">
                {selectedCount}
              </span>{" "}
              contacts selected
            </span>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Generate polished drafts for this curated set, then send instantly
            or refine first — without redoing your selection.
          </div>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button
            onClick={() =>
              generatePitchesSequential(
                selectedContacts,
                mediaContacts,
                (conv) => addConversations([conv]),
                (msg) => showToast(msg),
                () =>
                  router.navigate({
                    to: "/contacts/pitched",
                    search: { status: "draft" } as any,
                  }),
              )
            }
            disabled={selectedCount === 0}
            className="gap-2 transition-all duration-150 hover:shadow-sm"
          >
            Generate & Review ({selectedCount})
          </Button>
          <Button
            onClick={() =>
              generateAndSend(
                selectedContacts,
                mediaContacts,
                updateContactsAsPitched,
                addConversations,
                (msg) => showToast(msg),
                () => router.invalidate(),
              )
            }
            disabled={selectedCount === 0}
            className="gap-2 transition-all duration-150 hover:border-primary/40 hover:bg-primary/5"
            variant="outline"
          >
            Generate & Send ({selectedCount})
          </Button>
        </div>
      </Panel>
    </div>
  );
};
