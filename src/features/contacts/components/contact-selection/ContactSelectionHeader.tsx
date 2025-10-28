import { Header } from '../../../../components/ui';

type ContactSelectionHeaderProps = {
  // Header stripped per UX clean-up; kept for spacing consistency if needed
};

export const ContactSelectionHeader = (_: ContactSelectionHeaderProps) => (
  <Header variant="section" size="md">
    <Header.Content />
  </Header>
);
