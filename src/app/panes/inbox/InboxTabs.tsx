import React from 'react';
import { ContactTab } from '../../../types';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui';

type InboxTab = {
  id: ContactTab;
  name: string;
};

type InboxTabsProps = {
  tabs: InboxTab[];
  activeTab: ContactTab;
  onSelect: (tab: ContactTab) => void;
};

export const InboxTabs = React.memo(({ tabs, activeTab, onSelect }: InboxTabsProps) => (
  <div className="w-full overflow-x-auto">
    <Tabs value={activeTab} onValueChange={value => onSelect(value as ContactTab)}>
      <TabsList className="w-full min-w-max sm:w-auto">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  </div>
));

InboxTabs.displayName = 'InboxTabs';
