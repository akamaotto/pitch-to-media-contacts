import { useCallback, useMemo, useState } from 'react';
import { MediaContact, Pitch } from '../../../types';

export type SendingStatus = 'idle' | 'sending' | 'sent';

export const usePitchesState = (preloadedData?: { pitches: Pitch[] }) => {
  const [generatedPitches, setGeneratedPitches] = useState<Pitch[]>(() =>
    preloadedData?.pitches || []
  );
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationCurrent, setGenerationCurrent] = useState(0);
  const [generationTotal, setGenerationTotal] = useState(0);
  const [generationMessage, setGenerationMessage] = useState<string | null>(null);
  const [sendingStatus, setSendingStatus] = useState<SendingStatus>('idle');
  const [expandedPitch, setExpandedPitch] = useState<number | null>(null);

  const generatePitches = useCallback(
    (
      selectedContacts: Set<number>,
      mediaContacts: MediaContact[],
      onComplete: () => void
    ) => {
      if (selectedContacts.size === 0) return;

      setGenerationProgress(0);
      const contacts = Array.from(selectedContacts)
        .map(id => mediaContacts.find(c => c.id === id))
        .filter(Boolean) as MediaContact[];

      const interval = setInterval(() => {
        setGenerationProgress(prev => {
          const newProgress = prev + Math.random() * 8 + 2;
          if (newProgress >= 100) {
            clearInterval(interval);

            const pitches: Pitch[] = contacts.map(contact => ({
              id: contact.id,
              contact,
              subject: `Poblysh's AI cuts PR time by 70% for ${
                contact.country === 'Nigeria' ? 'Nigerian startups' : 'emerging markets'
              }`,
              preview: `Hi ${contact.name.split(' ')[0]}, your focus on ${
                contact.beats.split(',')[0].trim()
              } is why I'm reaching out about our new AI platform...`,
              body: `Hi ${contact.name.split(' ')[0]},\n\nI noticed your recent coverage of ${
                contact.beats.split(',')[0].trim().toLowerCase()
              } in ${contact.country} and thought you'd be interested in Poblysh's launch.\n\nPoblysh is an AI-powered PR platform that reduces the entire media workflow from weeks to minutes, directly addressing the pain point of decision paralysis in contact selection.\n\nKey highlights:\n• Reduces PR workflow from 15 days to 7 minutes\n• AI-generated pitches personalized to each journalist\n• **98% Match Score** because you cover ${contact.beats}\n\nWould you be interested in covering this story? The press release is attached.\n\nBest regards,\nPaul Otto\nFounder, Poblysh`,
              status: 'ready',
              edited: false,
            }));

            setGeneratedPitches(pitches);
            setTimeout(() => onComplete(), 500);
            return 100;
          }
          return newProgress;
        });
      }, 500);
    },
    []
  );

  const sendPitches = useCallback(
    (
      pitches: Pitch[],
      updateContactsAsPitched: (contactIds: number[]) => void,
      addConversations: (conversations: any[]) => void,
      onComplete: () => void
    ) => {
      setSendingStatus('sending');
      setTimeout(() => {
        setSendingStatus('sent');

        const pitchedIds = pitches.map(p => p.id);
        updateContactsAsPitched(pitchedIds);

        const newConv = pitches.map((pitch, idx) => ({
          id: pitch.id,
          contact: pitch.contact,
          subject: pitch.subject,
          lastMessage:
            idx % 3 === 0
              ? 'Pitch sent, waiting for open...'
              : idx % 3 === 1
              ? "Thanks for reaching out. I'm passing on this one."
              : 'Pitch sent, waiting for open...',
          timestamp:
            idx % 3 === 0 ? 'Just now' : idx % 3 === 1 ? '1d ago' : 'Just now',
          status: idx % 3 === 0 ? 'sent' : idx % 3 === 1 ? 'rejected' : 'sent',
          unread: false,
          messages: [
            { sender: 'You', text: pitch.body, timestamp: '10:00 AM' },
            ...(idx % 3 === 1
              ? [
                  {
                    sender: pitch.contact.name,
                    text: "Thanks for reaching out. I'm passing on this one, but keep me posted on future AI/SaaS news.",
                    timestamp: '11:00 AM',
                    isReply: true,
                  },
                ]
              : []),
          ],
        }));

        addConversations(newConv.filter(c => c.status !== 'rejected'));

        setTimeout(() => {
          setSendingStatus('idle');
          onComplete();
        }, 2000);
      }, 3000);
    },
    []
  );

  // Sequential generator: yields one draft at a time
  const generatePitchesSequential = useCallback(
    async (
      selectedContacts: Set<number>,
      mediaContacts: MediaContact[],
      addDraftConversation: (conversation: any) => void,
      notify: (message: string) => void,
      onFirstDraftReady?: () => void,
    ) => {
      if (selectedContacts.size === 0) return;
      const contacts = Array.from(selectedContacts)
        .map(id => mediaContacts.find(c => c.id === id))
        .filter(Boolean) as MediaContact[];

      setGenerationProgress(0);
      setGenerationCurrent(0);
      setGenerationTotal(contacts.length);
      setSendingStatus('sending');

      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        // Simulate work per contact
        await new Promise(r => setTimeout(r, 900 + Math.random() * 800));

        const pitch: Pitch = {
          id: contact.id,
          contact,
          subject: `Poblysh's AI cuts PR time by 70% for ${
            contact.country === 'Nigeria' ? 'Nigerian startups' : 'emerging markets'
          }`,
          preview: `Hi ${contact.name.split(' ')[0]}, your focus on ${
            contact.beats.split(',')[0].trim()
          } is why I'm reaching out about our new AI platform...`,
          body: `Hi ${contact.name.split(' ')[0]},\n\nI noticed your recent coverage of ${
            contact.beats.split(',')[0].trim().toLowerCase()
          } in ${contact.country} and thought you'd be interested in Poblysh's launch.\n\nPoblysh is an AI-powered PR platform that reduces the entire media workflow from weeks to minutes, directly addressing the pain point of decision paralysis in contact selection.\n\nKey highlights:\n• Reduces PR workflow from 15 days to 7 minutes\n• AI-generated pitches personalized to each journalist\n• **98% Match Score** because you cover ${contact.beats}\n\nWould you be interested in covering this story? The press release is attached.\n\nBest regards,\nPaul Otto\nFounder, Poblysh`,
          status: 'draft',
          edited: false,
        };

        setGeneratedPitches(prev => [...prev, pitch]);

        // Add to inbox as a draft conversation
        addDraftConversation({
          id: pitch.id,
          contact: pitch.contact,
          subject: pitch.subject,
          lastMessage: 'Draft in progress...',
          timestamp: 'Just now',
          status: 'draft',
          unread: false,
          messages: [
            { sender: 'You', text: pitch.body, timestamp: '10:00 AM' },
          ],
        });

        const left = contacts.length - (i + 1);
        setGenerationCurrent(i + 1);
        setGenerationProgress(Math.round(((i + 1) / contacts.length) * 100));
        setGenerationMessage(
          `Generated personalized message for ${contact.name} (${left} of ${contacts.length} left)`
        );

        notify(
          `Added draft for ${contact.name}. ${left} message${left === 1 ? '' : 's'} left`
        );

        if (i === 0 && onFirstDraftReady) {
          onFirstDraftReady();
        }
      }

      setSendingStatus('idle');
      setTimeout(() => setGenerationMessage(null), 1500);
    },
    []
  );

  // Generate and immediately send
  const generateAndSend = useCallback(
    async (
      selectedContacts: Set<number>,
      mediaContacts: MediaContact[],
      updateContactsAsPitched: (contactIds: number[]) => void,
      addConversations: (conversations: any[]) => void,
      notify?: (message: string) => void,
      onComplete?: () => void,
    ) => {
      if (selectedContacts.size === 0) return;
      const contacts = Array.from(selectedContacts)
        .map(id => mediaContacts.find(c => c.id === id))
        .filter(Boolean) as MediaContact[];

      setGenerationProgress(0);
      setGenerationCurrent(0);
      setGenerationTotal(contacts.length);

      // Simulate generation burst
      const pitches: Pitch[] = contacts.map((contact, idx) => ({
        id: contact.id,
        contact,
        subject: `Poblysh's AI cuts PR time by 70% for ${
          contact.country === 'Nigeria' ? 'Nigerian startups' : 'emerging markets'
        }`,
        preview: `Hi ${contact.name.split(' ')[0]}, your focus on ${
          contact.beats.split(',')[0].trim()
        } is why I'm reaching out about our new AI platform...`,
        body: `Hi ${contact.name.split(' ')[0]},\n\nI noticed your recent coverage of ${
          contact.beats.split(',')[0].trim().toLowerCase()
        } in ${contact.country} and thought you'd be interested in Poblysh's launch.\n\nPoblysh is an AI-powered PR platform that reduces the entire media workflow from weeks to minutes, directly addressing the pain point of decision paralysis in contact selection.\n\nKey highlights:\n• Reduces PR workflow from 15 days to 7 minutes\n• AI-generated pitches personalized to each journalist\n• **98% Match Score** because you cover ${contact.beats}\n\nWould you be interested in covering this story? The press release is attached.\n\nBest regards,\nPaul Otto\nFounder, Poblysh`,
        status: 'ready',
        edited: false,
      }));

      setGeneratedPitches(pitches);
      setGenerationProgress(100);
      setGenerationCurrent(contacts.length);
      setGenerationMessage('Generated personalized messages. Sending...');

      notify?.(`Generated ${contacts.length} messages. Sending now...`);

      // Immediately send
      sendPitches(pitches, updateContactsAsPitched, addConversations, () => {
        setGenerationMessage(null);
        onComplete?.();
      });
    },
    [sendPitches]
  );

  const toggleExpandedPitch = useCallback(
    (pitchId: number) => {
      setExpandedPitch(prev => (prev === pitchId ? null : pitchId));
    },
    []
  );

  return useMemo(
    () => ({
      generatedPitches,
      setGeneratedPitches,
      generationProgress,
      generationCurrent,
      generationTotal,
      generationMessage,
      setGenerationProgress,
      sendingStatus,
      setSendingStatus,
      expandedPitch,
      setExpandedPitch,
      generatePitches,
      generatePitchesSequential,
      sendPitches,
      generateAndSend,
      toggleExpandedPitch,
    }),
    [
      generatedPitches,
      generationProgress,
      generationCurrent,
      generationTotal,
      generationMessage,
      sendingStatus,
      expandedPitch,
      generatePitches,
      generatePitchesSequential,
      sendPitches,
      generateAndSend,
      toggleExpandedPitch,
    ]
  );
};

export type PitchesState = ReturnType<typeof usePitchesState>;
