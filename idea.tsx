import React, { useState, useEffect, useMemo } from 'react';
import { Check, ChevronDown, ChevronRight, Mail, Clock, AlertCircle, Loader2, Send, X, Filter, Search, MessageSquare, Eye, ArrowLeft, Archive, RefreshCw, PlusCircle, TrendingUp, Users, MapPin, Slash, Zap } from 'lucide-react';

// --- Internal UI Components (Replacing External Shadcn/UI Imports) ---

// Simple Alert Component
const Alert = ({ children, className = '' }) => (
  <div className={`p-4 rounded-xl bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500 flex items-start gap-3 ${className}`}>
    {children}
  </div>
);

const AlertDescription = ({ children, className = '' }) => (
  <p className={`text-sm ${className}`}>{children}</p>
);

// KPI Card Component - Simplified for less prominence
const KPICard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col justify-start">
    <Icon className={`w-5 h-5 mb-1 ${colorClass} opacity-80`} />
    <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-1">{title}</p>
  </div>
);

// New Contact Modal Component
const NewContactModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [outlet, setOutlet] = useState('');
  const [email, setEmail] = useState('');
  const [beats, setBeats] = useState('');

  const handleSubmit = () => {
    if (name && outlet && email) {
      onSubmit({ name, outlet, email, beats });
      setName('');
      setOutlet('');
      setEmail('');
      setBeats('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-xl font-bold mb-6">Add New Media Contact</h2>
        <div className="space-y-4">
          <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-black focus:border-black" />
          <input type="text" placeholder="Outlet/Publication" value={outlet} onChange={e => setOutlet(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-black focus:border-black" />
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-black focus:border-black" />
          <input type="text" placeholder="Beats (e.g., AI, SaaS, Funding)" value={beats} onChange={e => setBeats(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-black focus:border-black" />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={handleSubmit} disabled={!name || !outlet || !email} className="px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add Contact
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Application Component ---

const PoblyshPitchUI = () => {
  const [mainView, setMainView] = useState('contacts');
  const [selectedTab, setSelectedTab] = useState('recommended');
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedPitches, setGeneratedPitches] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedPitch, setExpandedPitch] = useState(null);
  const [sendingStatus, setSendingStatus] = useState('idle');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isMobileDetailView, setIsMobileDetailView] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  // Initial Data with 'userAdded' flag
  const initialContactsData = [
    { id: 1, initials: 'TJ', name: 'Temitayo Jaiyeola', outlet: 'BusinessDay', email: 'temitayoj@gmail.com', type: 'Journalist', language: 'EN', country: 'Nigeria', beats: 'SaaS, Startups, Funding', matchScore: 98, recommended: true, pitched: true, userAdded: false },
    { id: 2, initials: 'SW', name: 'Sam Wakoba', outlet: 'Tech Moran', email: 'wakobasam@gmail.com', type: 'Podcaster', language: 'EN', country: 'Nigeria', beats: 'AI, B2B Software', matchScore: 95, recommended: true, pitched: false, userAdded: false },
    { id: 3, initials: 'FE', name: 'Frank Eleanya', outlet: 'TechCabal', email: 'frankelean1283@gmail.com', type: 'Journalist', language: 'EN', country: 'Nigeria', beats: 'Enterprise Tech, Cloud', matchScore: 92, recommended: true, pitched: false, userAdded: false },
    { id: 4, initials: 'FC', name: 'Florence Chikezie', outlet: 'Entrepreneurs.ng', email: 'business@entrepreneurs.ng', type: 'Blogger', language: 'EN', country: 'Kenya', beats: 'Entrepreneurship, Growth', matchScore: 89, recommended: true, pitched: false, userAdded: false },
    { id: 5, initials: 'SA', name: 'Samson Akintaro', outlet: 'Naira Metrics', email: 'samsonakintaro@yahoo.com', type: 'Youtuber', language: 'EN', country: 'Nigeria', beats: 'Finance, Analytics', matchScore: 85, recommended: true, pitched: false, userAdded: false },
    { id: 6, initials: 'ST', name: 'Steve T', outlet: 'Owogram', email: 'steve@owogram.com', type: 'Podcaster', language: 'EN', country: 'Ghana', beats: 'Tech Stories, Innovation', matchScore: 82, recommended: true, pitched: false, userAdded: false },
    { id: 7, initials: 'ZK', name: 'Zainab Kabir', outlet: 'TechByte', email: 'zainab@techbyte.com', type: 'Journalist', language: 'EN', country: 'Nigeria', beats: 'Hardware, Gadgets', matchScore: 90, recommended: true, pitched: true, userAdded: false },
    { id: 8, initials: 'LM', name: 'Lebo Mashaba', outlet: 'Digital Africa', email: 'lebo@digitalafrica.co.za', type: 'Journalist', language: 'EN', country: 'South Africa', beats: 'Fintech, VC', matchScore: 94, recommended: true, pitched: true, userAdded: false },
  ];
  const [mediaContacts, setMediaContacts] = useState(initialContactsData);

  // Mock initial conversations
  const mockInitialConversations = [
      {
        id: 1,
        contact: initialContactsData.find(c => c.id === 1),
        subject: "Poblysh's AI cuts PR time by 70%",
        lastMessage: "Need screenshots by tomorrow.",
        timestamp: '2h ago',
        status: 'awaitingResponse',
        unread: true,
        messages: [
          { sender: 'You', text: "Hi Temitayo,\n\nI noticed your recent coverage of SaaS in Nigeria and thought you'd be interested in Poblysh's launch...", timestamp: '10:00 AM' },
          { sender: initialContactsData[0].name, text: "This sounds interesting! Can you send me screenshots and a high-res logo by tomorrow?", timestamp: '12:00 PM', isReply: true }
        ]
      },
      {
        id: 3,
        contact: initialContactsData.find(c => c.id === 3),
        subject: "Poblysh's AI cuts PR time by 70%",
        lastMessage: "Pitch sent, waiting for open...",
        timestamp: 'Just now',
        status: 'sent',
        unread: false,
        messages: [
          { sender: 'You', text: "Hi Frank,\n\nI noticed your recent coverage of Enterprise Tech in Nigeria and thought you'd be interested in Poblysh's launch...", timestamp: '10:00 AM' },
        ]
      },
      {
        id: 7,
        contact: initialContactsData.find(c => c.id === 7),
        subject: "Regarding your coverage of Hardware",
        lastMessage: "Thanks, but not covering new platforms this quarter.",
        timestamp: '1d ago',
        status: 'rejected',
        unread: false,
        messages: [
          { sender: 'You', text: "Hi Zainab, your focus on Hardware is why I'm reaching out...", timestamp: '10:00 AM' },
          { sender: initialContactsData[6].name, text: "Thanks, but not covering new platforms this quarter.", timestamp: '11:00 AM', isReply: true }
        ]
      },
      {
        id: 8,
        contact: initialContactsData.find(c => c.id === 8),
        subject: "Coverage opportunity: Fintech AI",
        lastMessage: "Happy to cover, please send rate card.",
        timestamp: '3d ago',
        status: 'requestingPay',
        unread: false,
        messages: [
          { sender: 'You', text: "Hi Lebo, I saw your article on Fintech VC...", timestamp: '10:00 AM' },
          { sender: initialContactsData[7].name, text: "Happy to cover, please send rate card for sponsored content.", timestamp: '11:00 AM', isReply: true }
        ]
      },
      {
        id: 100,
        contact: { initials: 'ME', name: 'Draft Contact', outlet: 'Draft Outlet', email: 'draft@email.com', type: 'Blogger', country: 'Nigeria' },
        subject: "[DRAFT] New AI Tool",
        lastMessage: "Draft in progress...",
        timestamp: '5m ago',
        status: 'draft',
        unread: false,
        messages: [
          { sender: 'You', text: "Hi [Contact Name], I'm drafting a pitch about...", timestamp: '10:00 AM' },
        ]
      },
    ];

  const [conversations, setConversations] = useState(mockInitialConversations);

  // --- Derived State and Filtering Logic ---

  const contactsToDisplay = useMemo(() => {
    switch (selectedTab) {
      case 'recommended':
        return mediaContacts.filter(c => c.recommended && !c.pitched);
      case 'all':
        return mediaContacts.filter(c => !c.pitched);
      case 'myContacts':
        return mediaContacts.filter(c => c.userAdded && !c.pitched);
      case 'pitched':
      default:
        return [];
    }
  }, [selectedTab, mediaContacts]);

  const totalPitchesSent = mediaContacts.filter(c => c.pitched).length;
  const showPitchedTab = totalPitchesSent > 0;

  useEffect(() => {
    if (!showPitchedTab && selectedTab === 'recommended') {
        const recommendedIds = mediaContacts.filter(c => c.recommended).map(c => c.id);
        setSelectedContacts(new Set(recommendedIds));
    }
  }, [showPitchedTab, mediaContacts, selectedTab]);

  // --- Handlers ---

  const handleAddContact = (newContact) => {
    const maxId = mediaContacts.length > 0 ? Math.max(...mediaContacts.map(c => c.id)) : 0;
    const newId = maxId + 1;
    const contactWithDefaults = {
      ...newContact,
      id: newId,
      initials: newContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??',
      type: 'Journalist',
      country: 'Nigeria',
      language: 'EN',
      matchScore: 0,
      recommended: false,
      pitched: false,
      userAdded: true,
    };
    setMediaContacts(prev => [...prev, contactWithDefaults]);
  };

  const updateContactsAsPitched = (contactIds) => {
    setMediaContacts(prevContacts =>
      prevContacts.map(contact =>
        contactIds.includes(contact.id) ? { ...contact, pitched: true } : contact
      )
    );
  };

  const handleGeneratePitches = () => {
    if (selectedContacts.size === 0) return;
    setMainView('generating');
    setGenerationProgress(0);
    const contacts = Array.from(selectedContacts).map(id =>
      mediaContacts.find(c => c.id === id)
    );

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        const newProgress = prev + Math.random() * 8 + 2;
        if (newProgress >= 100) {
          clearInterval(interval);

          const pitches = contacts.map((contact) => ({
            id: contact.id,
            contact: contact,
            subject: `Poblysh's AI cuts PR time by 70% for ${contact.country === 'Nigeria' ? 'Nigerian startups' : 'emerging markets'}`,
            preview: `Hi ${contact.name.split(' ')[0]}, your focus on ${contact.beats.split(',')[0].trim()} is why I'm reaching out about our new AI platform...`,
            body: `Hi ${contact.name.split(' ')[0]},\n\nI noticed your recent coverage of ${contact.beats.split(',')[0].trim().toLowerCase()} in ${contact.country} and thought you'd be interested in Poblysh's launch.\n\nPoblysh is an AI-powered PR platform that reduces the entire media workflow from weeks to minutes, directly addressing the pain point of decision paralysis in contact selection.\n\nKey highlights:\n• Reduces PR workflow from 15 days to 7 minutes\n• AI-generated pitches personalized to each journalist\n• **98% Match Score** because you cover ${contact.beats}\n\nWould you be interested in covering this story? The press release is attached.\n\nBest regards,\nPaul Otto\nFounder, Poblysh`,
            status: 'ready',
            edited: false
          }));

          setGeneratedPitches(pitches);
          setTimeout(() => setMainView('review'), 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handleSendPitches = () => {
    setSendingStatus('sending');
    setTimeout(() => {
      setSendingStatus('sent');

      const pitchedIds = generatedPitches.map(p => p.id);
      updateContactsAsPitched(pitchedIds);

      const newConv = generatedPitches.map((pitch, idx) => ({
        id: pitch.id,
        contact: pitch.contact,
        subject: pitch.subject,
        lastMessage: idx % 3 === 0 ? "Pitch sent, waiting for open..." :
                     idx % 3 === 1 ? "Thanks for reaching out. I'm passing on this one." :
                     "Pitch sent, waiting for open...",
        timestamp: idx % 3 === 0 ? 'Just now' : idx % 3 === 1 ? '1d ago' : 'Just now',
        status: idx % 3 === 0 ? 'sent' : idx % 3 === 1 ? 'rejected' : 'sent',
        unread: false,
        messages: [
          { sender: 'You', text: pitch.body, timestamp: '10:00 AM' },
          ...((idx % 3) === 1 ? [{
              sender: pitch.contact.name,
              text: "Thanks for reaching out. I'm passing on this one, but keep me posted on future AI/SaaS news.",
              timestamp: '11:00 AM',
              isReply: true
          }] : []),
        ]
      }));

      setConversations(prev => [...prev, ...newConv.filter(c => c.status !== 'rejected')]);

      setTimeout(() => {
        setSendingStatus('idle');
        setMainView('contacts');
        setSelectedTab('pitched');
        setSelectedContacts(new Set());
      }, 2000);
    }, 3000);
  };

  const toggleContact = (id) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContacts(newSelected);
  };

  const toggleAll = (select) => {
    const currentContactIds = contactsToDisplay.map(c => c.id);
    if (select) {
      setSelectedContacts(new Set(currentContactIds));
    } else {
      setSelectedContacts(new Set());
    }
  };

  // --- Contact Card Component ---
  const ContactCard = ({ contact, showMatch = true }) => {
    const isSelected = selectedContacts.has(contact.id);

    const getCardClasses = () => {
        let classes = 'border rounded-xl p-4 transition-all flex items-start gap-4 cursor-pointer hover:shadow-md ';
        if (isSelected) {
            classes += 'border-black ring-2 ring-black bg-gray-50';
        } else {
            classes += 'border-gray-200 bg-white';
        }
        return classes;
    };

    return (
      <div
        className={getCardClasses()}
        onClick={() => toggleContact(contact.id)}
      >
        <input type="checkbox" checked={isSelected} readOnly className="w-4 h-4 mt-1" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-medium text-base truncate">{contact.name}</h3>
              <p className="text-sm text-gray-500">{contact.outlet}</p>
            </div>
            {contact.recommended && showMatch && (
              <span className="text-xs px-2 py-1 bg-black text-white rounded-full font-medium whitespace-nowrap">
                {contact.matchScore}% Match
              </span>
            )}
            {contact.userAdded && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium whitespace-nowrap">
                User Added
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700">{contact.type}</span>
            <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-700">{contact.country}</span>
          </div>

          {showMatch && (
            <p className="text-xs text-gray-600 mt-2">
              <span className="font-medium">Beats:</span> {contact.beats}
            </p>
          )}
        </div>
      </div>
    );
  };

  // --- RENDERING COMPONENTS ---

  const ContactSelectionView = () => (
    <div className="border rounded-xl p-4 sm:p-6 mb-8 bg-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          🎯 Select Contacts for Pitch
        </h2>
        <button
            onClick={() => setShowAddContactModal(true)}
            className="text-sm flex items-center gap-1 px-3 py-2 border rounded-xl hover:bg-black hover:text-white transition-colors text-black font-medium"
        >
            <PlusCircle className="w-4 h-4" /> Add New Contact
        </button>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className='flex gap-2'>
            <button
                onClick={() => toggleAll(true)}
                className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-100"
            >
                Select All ({contactsToDisplay.length})
            </button>
            <button
                onClick={() => toggleAll(false)}
                className="text-sm px-3 py-1 border rounded-lg hover:bg-gray-100"
            >
                Deselect All
            </button>
        </div>
        <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm flex items-center gap-1 px-3 py-1 border rounded-xl hover:bg-gray-100 transition-colors"
        >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4 border-t pt-4">
          <select className="text-sm border rounded-lg px-3 py-2 bg-white">
            <option>All Countries</option>
            <option>Nigeria</option>
            <option>Kenya (Phase 2)</option>
          </select>
          <select className="text-sm border rounded-lg px-3 py-2 bg-white">
            <option>All Beats</option>
            <option>SaaS, Startups, Funding</option>
            <option>AI, B2B Software</option>
          </select>
        </div>
      )}

      <div className="space-y-3">
        {contactsToDisplay.map(contact => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
        {contactsToDisplay.length === 0 && (
            <div className='text-center p-8 text-gray-500 border-dashed border-2 rounded-lg'>
                <p className='font-medium'>No unpitched contacts available in this view.</p>
            </div>
        )}
      </div>
    </div>
  );

  const PitchedDashboard = () => {
      const [filterStatus, setFilterStatus] = useState('all');
      const [filterMediaType, setFilterMediaType] = useState('all');
      const [filterCountry, setFilterCountry] = useState('all');

      const STATUS_FILTERS = [
        { id: 'all', name: 'Inbox (All)', icon: Mail, color: 'text-black' },
        { id: 'sent', name: 'Sent', icon: Send, color: 'text-blue-600' },
        { id: 'awaitingResponse', name: 'Awaiting Response', icon: Clock, color: 'text-yellow-600' },
        { id: 'draft', name: 'Drafts', icon: Archive, color: 'text-gray-500' },
        { id: 'rejected', name: 'Rejected', icon: Slash, color: 'text-red-600' },
        { id: 'requestingPay', name: 'Requesting Pay', icon: TrendingUp, color: 'text-green-600' },
      ];

      const availableMediaTypes = useMemo(() => {
          const types = new Set(conversations.map(c => c.contact.type).filter(Boolean));
          return ['all', ...Array.from(types).sort()];
      }, [conversations]);

      const availableCountries = useMemo(() => {
          const countries = new Set(conversations.map(c => c.contact.country).filter(Boolean));
          return ['all', ...Array.from(countries).sort()];
      }, [conversations]);

      const filteredConversations = useMemo(() => {
          let list = conversations;

          if (filterStatus !== 'all') {
              list = list.filter(c => c.status === filterStatus);
          }

          if (filterMediaType !== 'all') {
              list = list.filter(c => c.contact.type === filterMediaType);
          }

          if (filterCountry !== 'all') {
              list = list.filter(c => c.contact.country === filterCountry);
          }

          return list.sort((a, b) => b.unread - a.unread);

      }, [conversations, filterStatus, filterMediaType, filterCountry]);

      const sidebarClasses = useMemo(() => {
          let classes = 'w-full md:w-56 flex-shrink-0 bg-gray-50 p-4 space-y-6 overflow-y-auto border-r border-gray-200 ';
          if (selectedConversation && isMobileDetailView) {
              classes += 'hidden';
          }
          return classes;
      }, [selectedConversation, isMobileDetailView]);

      const conversationListClasses = useMemo(() => {
          let classes = 'w-full md:w-80 flex-shrink-0 border-r border-gray-200 overflow-y-auto ';
          if (selectedConversation && isMobileDetailView) {
              classes += 'hidden';
          }
          return classes;
      }, [selectedConversation, isMobileDetailView]);

      const detailPanelClasses = useMemo(() => {
          let classes = 'flex-1 flex flex-col ';

          if (!selectedConversation) {
              classes += 'hidden md:flex items-center justify-center text-gray-400';
          } else if (isMobileDetailView) {
              classes += 'w-full';
          } else {
              classes += 'hidden md:flex';
          }

          return classes;
      }, [selectedConversation, isMobileDetailView]);

      const getStatusClasses = (status) => {
          switch (status) {
              case 'awaitingResponse': return 'bg-yellow-100 text-yellow-700';
              case 'rejected': return 'bg-red-100 text-red-700';
              case 'requestingPay': return 'bg-green-100 text-green-700';
              default: return 'bg-gray-100 text-gray-700';
          }
      };

      const getConversationCardClasses = (convo) => {
          let classes = 'p-4 cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ';
          if (selectedConversation?.id === convo.id) {
              classes += 'bg-gray-100 ';
          } else {
              classes += 'hover:bg-gray-50 ';
          }
          if (convo.unread) {
              classes += 'bg-blue-50 border border-blue-200 ';
          }
          return classes.trim();
      };

      const getUnreadTextClasses = (convo) => {
          const nameClass = convo.unread ? 'font-extrabold text-black' : 'font-medium text-gray-900';
          const previewClass = convo.unread ? 'font-bold text-red-600' : 'text-gray-500';

          return { nameClass, previewClass };
      };

      const handleSelectConversation = (convo) => {
        setSelectedConversation(convo);
        setIsMobileDetailView(true);
        setConversations(prev => prev.map(c => c.id === convo.id ? { ...c, unread: false } : c));
      };

      const MessageBubble = ({ message }) => {
        const isReply = message.isReply;

        const getBubbleClasses = () => {
            let classes = 'max-w-[80%] rounded-xl p-3 shadow-sm ';
            if (isReply) {
                classes += 'bg-gray-100 text-gray-800 rounded-tl-sm';
            } else {
                classes += 'bg-black text-white rounded-br-sm';
            }
            return classes;
        };

        return (
          <div className={`flex ${isReply ? 'justify-start' : 'justify-end'}`}>
            <div className={getBubbleClasses()}>
              <p className="font-bold text-sm mb-1">{message.sender}</p>
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              <span className={`block text-right mt-1 text-xs ${isReply ? 'text-gray-500' : 'text-gray-300'}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        );
      };

      const kpis = {
          totalPitchesSent: totalPitchesSent,
          repliesReceived: conversations.filter(c => ['awaitingResponse', 'rejected', 'requestingPay'].includes(c.status)).length,
          unreadReplies: conversations.filter(c => c.unread).length,
          openRate: '65%',
      };

      const getStatusLabel = (status) => {
          const filter = STATUS_FILTERS.find(f => f.id === status);
          return filter ? filter.name : status;
      };


      return (
          <div className='mb-8'>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <KPICard title="Pitches Sent" value={kpis.totalPitchesSent} icon={Mail} colorClass="text-black" />
                <KPICard title="Replies Received" value={kpis.repliesReceived} icon={Check} colorClass="text-green-600" />
                <KPICard title="Unread Replies" value={kpis.unreadReplies} icon={MessageSquare} colorClass="text-red-600" />
                <KPICard title="Open Rate" value={kpis.openRate} icon={Eye} colorClass="text-blue-600" />
              </div>

              <div className="flex flex-col md:flex-row border border-gray-200 rounded-xl shadow-lg h-[80vh] w-full overflow-hidden bg-white">

                  <div className={sidebarClasses}>

                      <div>
                          <div className='px-2 pt-1 pb-2'>
                            <h3 className="text-sm font-semibold uppercase text-gray-600">Dashboard</h3>
                          </div>

                          <div className="space-y-1">
                              {STATUS_FILTERS.map(filter => {
                                  const count = filter.id === 'all'
                                    ? conversations.length
                                    : conversations.filter(c => c.status === filter.id).length;

                                  if (count === 0 && filter.id !== 'all' && filterStatus !== filter.id) return null;

                                  let buttonClasses = 'w-full flex items-center justify-between p-2 rounded-lg transition-colors text-sm font-medium ';
                                  let iconClasses = 'w-4 h-4 ';
                                  let countClasses = 'text-xs font-semibold ';

                                  if (filterStatus === filter.id) {
                                      buttonClasses += 'bg-black text-white';
                                      iconClasses += 'text-white';
                                      countClasses += 'bg-white text-black px-2 py-0.5 rounded-full';
                                  } else {
                                      buttonClasses += 'hover:bg-gray-200 text-gray-800';
                                      iconClasses += filter.color;
                                      countClasses += 'text-gray-500';
                                  }

                                  return (
                                      <button
                                          key={filter.id}
                                          onClick={() => {
                                              setFilterStatus(filter.id);
                                              setSelectedConversation(null);
                                              setFilterMediaType('all');
                                              setFilterCountry('all');
                                          }}
                                          className={buttonClasses}
                                      >
                                          <span className="flex items-center gap-2">
                                              <filter.icon className={iconClasses} />
                                              {filter.name}
                                          </span>
                                          <span className={countClasses}>
                                              {count}
                                          </span>
                                      </button>
                                  );
                              })}
                          </div>
                      </div>

                      <hr className="border-gray-200" />

                      <div className='space-y-4'>
                          <div>
                              <div className='px-2 pt-1 pb-2'>
                                  <h3 className="text-sm font-semibold uppercase text-gray-600 flex items-center gap-1">
                                    <Users className='w-3 h-3' /> Media Type
                                  </h3>
                              </div>
                              <div className="space-y-1">
                                {availableMediaTypes.map(type => (
                                  <button
                                    key={type}
                                    onClick={() => { setFilterMediaType(type); setSelectedConversation(null); }}
                                    className={`w-full text-left text-sm p-2 rounded-lg transition-colors capitalize font-medium ${
                                      filterMediaType === type
                                      ? 'bg-gray-200 text-black'
                                      : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {type === 'all' ? 'All Media Types' : type}
                                  </button>
                                ))}
                              </div>
                          </div>

                          <div>
                              <div className='px-2 pt-1 pb-2'>
                                  <h3 className="text-sm font-semibold uppercase text-gray-600 flex items-center gap-1">
                                    <MapPin className='w-3 h-3' /> Country
                                  </h3>
                              </div>
                              <div className="space-y-1">
                                {availableCountries.map(country => (
                                  <button
                                    key={country}
                                    onClick={() => { setFilterCountry(country); setSelectedConversation(null); }}
                                    className={`w-full text-left text-sm p-2 rounded-lg transition-colors font-medium ${
                                      filterCountry === country
                                      ? 'bg-gray-200 text-black'
                                      : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                  >
                                    {country === 'all' ? 'All Countries' : country}
                                  </button>
                                ))}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className={conversationListClasses}>
                      <div className='p-4 sticky top-0 bg-white border-b border-gray-200 z-10'>
                          <div className="relative">
                              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Search conversations..."
                                className="w-full p-2 pl-10 border rounded-lg text-sm focus:ring-black focus:border-black"
                              />
                          </div>
                      </div>

                      {filteredConversations.length === 0 ? (
                          <div className='p-8 text-center text-gray-500'>
                              No threads match your filters.
                          </div>
                      ) : (
                          filteredConversations.map(convo => {
                            const textClasses = getUnreadTextClasses(convo);

                            return (
                                <div
                                key={convo.id}
                                onClick={() => handleSelectConversation(convo)}
                                className={getConversationCardClasses(convo)}
                                >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <h3 className={`text-sm truncate ${textClasses.nameClass}`}>
                                        {convo.contact.name}
                                    </h3>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{convo.timestamp}</span>
                                </div>

                                <p className="text-sm font-medium text-gray-800 mb-1 truncate">
                                    Re: {convo.subject}
                                </p>

                                <p className={`text-xs line-clamp-2 leading-tight ${textClasses.previewClass}`}>
                                    {convo.unread ? 'NEW REPLY: ' : ''}
                                    {convo.lastMessage}
                                </p>

                                <div className='flex justify-end mt-2'>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${getStatusClasses(convo.status)}`}>
                                        {getStatusLabel(convo.status)}
                                    </span>
                                </div>
                                </div>
                            );
                        })
                      )}
                  </div>

                  <div className={detailPanelClasses}>

                        {!selectedConversation && (
                            <p className='text-lg'>Select a conversation thread to view details.</p>
                        )}

                        {selectedConversation && (
                          <>
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsMobileDetailView(false)} className="md:hidden p-1 rounded-full hover:bg-gray-100">
                                        <ArrowLeft className="w-5 h-5" />
                                    </button>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">{selectedConversation.contact.name}</h2>
                                        <p className='text-xs text-gray-500'>To: {selectedConversation.contact.email}</p>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button title='Archive' className='text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100'>
                                        <Archive className='w-5 h-5' />
                                    </button>
                                    <button title='More Actions' className='text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100'>
                                        <ChevronDown className='w-5 h-5' />
                                    </button>
                                </div>
                            </div>

                            <div className='p-6 border-b border-gray-200 w-full'>
                                <h3 className='text-xl font-bold mb-1 text-gray-900'>{selectedConversation.subject}</h3>
                                <div className='flex items-center gap-3 text-sm text-gray-600'>
                                    <span className='font-medium'>{selectedConversation.contact.outlet}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        selectedConversation.contact.type === 'Journalist' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {selectedConversation.contact.type}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 w-full">
                              {selectedConversation.messages.map((message, idx) => (
                                <MessageBubble key={idx} message={message} />
                              ))}

                              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                                <p className="font-bold text-sm mb-2 text-purple-800 flex items-center gap-2"><Zap className='w-4 h-4'/> AI Suggestion</p>
                                <p className="text-sm text-purple-700">
                                    This contact is asking for screenshots and a deadline. Would you like a suggested reply that confirms the details and asks for their preferred image format?
                                </p>
                                <button className="mt-2 text-xs px-3 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 font-medium">
                                    Generate Suggested Reply
                                </button>
                              </div>
                            </div>

                            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
                              <textarea
                                rows="3"
                                placeholder={`Reply to ${selectedConversation.contact.name}...`}
                                className="w-full p-3 border rounded-lg focus:ring-black focus:border-black resize-none"
                              ></textarea>
                              <div className="flex justify-between items-center mt-3">
                                <div className='text-xs text-gray-500'>
                                    Reply as Paul Otto
                                </div>
                                <button className="px-4 py-2 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 flex items-center gap-2">
                                  <Send className="w-4 h-4" /> Send Reply
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                  </div>
                </div>
          </div>
      );
  };

  useEffect(() => {
    if (!showPitchedTab && selectedTab === 'pitched') {
        setSelectedTab('recommended');
    }
  }, [showPitchedTab, selectedTab]);


  if (mainView === 'generating') {
    const contacts = Array.from(selectedContacts).map(id => mediaContacts.find(c => c.id === id));
    const completedCount = Math.floor((generationProgress / 100) * contacts.length);

    return (
      <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <RefreshCw className="w-12 h-12 text-black animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">⚙️ Generating Pitches...</h2>
            <p className="text-gray-600">
              <span className="font-semibold">{completedCount}</span> of {contacts.length} completed ({Math.floor(generationProgress)}%)
            </p>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-8 overflow-hidden">
            <div
              className="bg-black h-2 rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (mainView === 'review') {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
        <button onClick={() => setMainView('contacts')} className='text-sm text-gray-600 mb-4 flex items-center gap-1 hover:text-black'>
            <ArrowLeft className='w-4 h-4'/> Back to Selection
        </button>
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">📧 Review & Edit Pitches</h1>
          <p className="text-sm text-gray-600">Ready to send {generatedPitches.length} personalized pitches.</p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4 mt-1" />
          <AlertDescription>
            Most pitches (AI-generated for each contact's beat) are ready to send. <span className="font-bold">Focus on editing only the outliers</span> to save time.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mb-20 sm:mb-6">
          {generatedPitches.map(pitch => (
            <div key={pitch.id} className="border rounded-xl p-4 bg-white shadow-sm">
              <div className="flex items-start gap-4">
                <input type="checkbox" defaultChecked className="w-4 h-4 mt-1 shrink-0" />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className='min-w-0'>
                      <h3 className="font-semibold text-base truncate">{pitch.contact.name}</h3>
                      <p className="text-xs text-gray-500">{pitch.contact.outlet}</p>
                    </div>
                    <button className="text-xs px-3 py-1 border rounded-lg bg-gray-50 hover:bg-gray-100 font-medium whitespace-nowrap">
                      Edit Pitch
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs text-gray-600 mb-1 font-medium">Subject:</p>
                    <p className="text-sm font-medium mb-2 text-gray-800">{pitch.subject}</p>
                    <p className="text-xs text-gray-600 mb-1 font-medium">Preview (First Line):</p>
                    <p className="text-sm text-gray-700">{pitch.preview}</p>
                  </div>

                  <button
                    onClick={() => setExpandedPitch(expandedPitch === pitch.id ? null : pitch.id)}
                    className="mt-2 text-xs text-black hover:underline flex items-center gap-1 font-medium"
                  >
                    <Eye className="w-3 h-3" />
                    {expandedPitch === pitch.id ? 'Hide Full Pitch' : 'View Full Pitch'}
                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedPitch === pitch.id ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedPitch === pitch.id && (
                    <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg text-xs whitespace-pre-wrap font-mono text-gray-700">
                      {pitch.body}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs px-2 py-1 bg-black text-white rounded-full font-medium">
                      {pitch.contact.matchScore}% AI Match
                    </span>
                    {pitch.edited && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        Edited
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-2xl flex justify-between items-center z-10 sm:static sm:p-0 sm:border-0 sm:shadow-none">
          <button className="text-sm text-gray-600 hover:text-black font-medium">
            <Clock className="w-4 h-4 inline-block mr-1" /> Save Drafts
          </button>

          <button
            onClick={handleSendPitches}
            disabled={sendingStatus !== 'idle'}
            className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-lg"
          >
            {sendingStatus === 'sending' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {sendingStatus === 'sending' ? 'Sending...' : `Send All (${generatedPitches.length})`}
          </button>
        </div>
      </div>
    );
  }

  if (mainView === 'sent') {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen flex items-center justify-center">
        <div className="w-full text-center p-8 border rounded-xl shadow-xl">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">✅ Pitches Sent!</h2>
          <p className="text-gray-600 mb-8">Your {generatedPitches.length} personalized pitches have been delivered. Your engagement dashboard has been updated.</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setMainView('contacts');
                setSelectedTab('pitched');
                setGeneratedPitches([]);
                setSendingStatus('idle');
              }}
              className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              View Pitched Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabList = [
    ...(showPitchedTab ? [{ id: 'pitched', name: 'Inbox' }] : []),
    { id: 'recommended', name: 'AI Recommended' },
    { id: 'all', name: 'All Contacts' },
    { id: 'myContacts', name: 'My Contacts' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
              Pitch to Media Contacts
          </h1>
          <p className="text-sm text-gray-600">Article: Poblysh Launches AI Platform...</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          {tabList.map(tab => {
              let buttonClasses = 'px-4 py-2 text-sm font-semibold transition-colors relative ';

              if (selectedTab === tab.id) {
                  buttonClasses += 'text-black border-b-2 border-black';
              } else {
                  buttonClasses += 'text-gray-500 hover:text-black';
              }

              return (
                  <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={buttonClasses}
                  >
                      {tab.name}
                      {tab.id === 'pitched' && conversations.filter(c => c.unread).length > 0 && (
                          <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              {conversations.filter(c => c.unread).length}
                          </span>
                      )}
                  </button>
              );
          })}
      </div>

      {selectedTab === 'pitched' ? (
        <PitchedDashboard />
      ) : (
        <ContactSelectionView />
      )}

      {selectedTab !== 'pitched' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-2xl flex justify-between items-center z-10 sm:static sm:p-0 sm:border-0 sm:shadow-none">
            <p className="text-sm text-gray-600 font-medium">
              {selectedContacts.size} contacts selected
            </p>
            <button
              onClick={handleGeneratePitches}
              disabled={selectedContacts.size === 0}
              className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition-colors shadow-lg"
            >
              Generate Pitches ({selectedContacts.size})
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
      )}

      <NewContactModal isOpen={showAddContactModal} onClose={() => setShowAddContactModal(false)} onSubmit={handleAddContact} />
    </div>
  );
};

const App = () => (
    <div className="font-['Inter'] antialiased bg-gray-50">
        <PoblyshPitchUI />
    </div>
);

export default App;
