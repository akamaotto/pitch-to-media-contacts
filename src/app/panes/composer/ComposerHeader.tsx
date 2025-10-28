import { RefreshCw } from 'lucide-react';
import { Button, Header } from '../../../components/ui';

type ComposerHeaderProps = {
  onBack: () => void;
};

export const ComposerHeader = ({ onBack }: ComposerHeaderProps) => (
  <Header variant="page" size="lg">
    <Header.Breadcrumb>
      <span className="flex items-center gap-2">
        <RefreshCw className="h-4 w-4" />
        Pitch Composer
      </span>
    </Header.Breadcrumb>
    <Header.Content>
      <Header.Title>Review & Personalize Drafts</Header.Title>
      <Header.Subtitle>
        Fine tune AI generated copy before sending. Drafts stay active for 24 hours.
      </Header.Subtitle>
    </Header.Content>
    <Header.Actions>
      <Button variant="outline" size="sm" onClick={onBack}>
        Back to Contacts
      </Button>
    </Header.Actions>
  </Header>
);
