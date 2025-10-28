import Alert from '../../../components/ui/Alert';
import AlertDescription from '../../../components/ui/AlertDescription';
import { Panel, Card, Badge } from '../../../components/ui';
import { Pitch } from '../../../types';

type ComposerDraftListProps = {
  pitches: Pitch[];
};

export const ComposerDraftList = ({ pitches }: ComposerDraftListProps) => (
  <Panel padding="lg" className="space-y-5 shadow-sm">
    {pitches.length === 0 ? (
      <Alert>
        <AlertDescription>
          Generate pitches from the Contacts surface to populate this workspace. Selected drafts will appear here ready for editing.
        </AlertDescription>
      </Alert>
    ) : (
      <div className="space-y-4">
        {pitches.map(pitch => (
          <Card key={pitch.id} className="space-y-4 bg-muted/40 p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">{pitch.contact.name}</p>
                <p className="text-xs text-muted-foreground">{pitch.contact.outlet}</p>
              </div>
              <Badge className="border-transparent bg-foreground text-accent-foreground">
                {pitch.contact.matchScore}% Match
              </Badge>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Subject
              </p>
              <p className="text-sm text-foreground">{pitch.subject}</p>
            </div>
            <div className="rounded-md border border-border bg-surface px-4 py-4 text-sm text-muted-foreground whitespace-pre-wrap">
              {pitch.body}
            </div>
          </Card>
        ))}
      </div>
    )}
  </Panel>
);
