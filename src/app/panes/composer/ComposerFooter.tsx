import { Button, Panel } from '../../../components/ui';

type ComposerFooterProps = {
  sendingStatus: string;
};

export const ComposerFooter = ({ sendingStatus }: ComposerFooterProps) => (
  <Panel
    padding="md"
    className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between shadow-sm"
  >
    <span className="text-sm text-muted-foreground">
      Sending status:{' '}
      <strong className="uppercase text-foreground">{sendingStatus}</strong>
    </span>
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="outline" size="sm" disabled>
        Schedule Follow-up
      </Button>
      <Button size="sm" disabled>
        Send Selected Drafts
      </Button>
    </div>
  </Panel>
);
