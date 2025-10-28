import { Conversation, MediaContact } from '../../../types';

export const buildInitialConversations = (mediaContacts: MediaContact[]): Conversation[] => [
  {
    id: 1,
    contact: mediaContacts.find(c => c.id === 1) || mediaContacts[0],
    subject: "Poblysh's AI cuts PR time by 70%",
    lastMessage: 'Need screenshots by tomorrow.',
    timestamp: '2h ago',
    status: 'awaitingResponse',
    unread: true,
    messages: [
      {
        sender: 'You',
        text: "Hi Temitayo,\n\nI noticed your recent coverage of SaaS in Nigeria and thought you'd be interested in Poblysh's launch...",
        timestamp: '10:00 AM',
      },
      {
        sender: mediaContacts[0]?.name || 'Temitayo Jaiyeola',
        text: 'This sounds interesting! Can you send me screenshots and a high-res logo by tomorrow?',
        timestamp: '12:00 PM',
        isReply: true,
      },
    ],
  },
  {
    id: 3,
    contact: mediaContacts.find(c => c.id === 3) || mediaContacts[2],
    subject: "Poblysh's AI cuts PR time by 70%",
    lastMessage: 'Pitch sent, waiting for open...',
    timestamp: 'Just now',
    status: 'sent',
    unread: false,
    messages: [
      {
        sender: 'You',
        text: "Hi Frank,\n\nI noticed your recent coverage of Enterprise Tech in Nigeria and thought you'd be interested in Poblysh's launch...",
        timestamp: '10:00 AM',
      },
    ],
  },
  {
    id: 7,
    contact: mediaContacts.find(c => c.id === 7) || mediaContacts[6],
    subject: 'Regarding your coverage of Hardware',
    lastMessage: 'Thanks, but not covering new platforms this quarter.',
    timestamp: '1d ago',
    status: 'rejected',
    unread: false,
    messages: [
      {
        sender: 'You',
        text: "Hi Zainab, your focus on Hardware is why I'm reaching out...",
        timestamp: '10:00 AM',
      },
      {
        sender: mediaContacts[6]?.name || 'Zainab Kabir',
        text: 'Thanks, but not covering new platforms this quarter.',
        timestamp: '11:00 AM',
        isReply: true,
      },
    ],
  },
  {
    id: 8,
    contact: mediaContacts.find(c => c.id === 8) || mediaContacts[7],
    subject: 'Coverage opportunity: Fintech AI',
    lastMessage: 'Happy to cover, please send rate card.',
    timestamp: '3d ago',
    status: 'requestingPay',
    unread: false,
    messages: [
      {
        sender: 'You',
        text: "Hi Lebo, I saw your article on Fintech VC...",
        timestamp: '10:00 AM',
      },
      {
        sender: mediaContacts[7]?.name || 'Lebo Mashaba',
        text: 'Happy to cover, please send rate card for sponsored content.',
        timestamp: '11:00 AM',
        isReply: true,
      },
    ],
  },
  {
    id: 100,
    contact: {
      initials: 'ME',
      name: 'Draft Contact',
      outlet: 'Draft Outlet',
      email: 'draft@email.com',
      type: 'Blogger',
      country: 'Nigeria',
    } as MediaContact,
    subject: '[DRAFT] New AI Tool',
    lastMessage: 'Draft in progress...',
    timestamp: '5m ago',
    status: 'draft',
    unread: false,
    messages: [
      {
        sender: 'You',
        text: "Hi [Contact Name], I'm drafting a pitch about...",
        timestamp: '10:00 AM',
      },
    ],
  },
];
