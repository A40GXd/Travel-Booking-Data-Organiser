import React from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEvent: (category: string, eventId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectEvent,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Baggage Route Tag Synced',
      time: '12m ago',
      desc: 'Baggage #0205847 confirmed on NH107 carousel BELT 04 at Tokyo Haneda Terminal 3.',
      icon: 'luggage',
      color: 'text-[#c3f400]',
      category: 'flight',
      eventId: 'flight-nh107',
    },
    {
      id: 'notif-2',
      title: 'TableCheck Reservation Verified',
      time: '1h ago',
      desc: 'Uobei Sushi Dogenzaka reservation #TC-8812 confirmed for party of 4 at 20:00 JST.',
      icon: 'restaurant',
      color: 'text-[#abd600]',
      category: 'dine',
      eventId: 'dine-uobei',
    },
    {
      id: 'notif-3',
      title: 'Currency Peg Shift Alert',
      time: '3h ago',
      desc: 'USD/JPY reached 152.40 on live interbank exchange. Favorable cash conversion rate.',
      icon: 'currency_yen',
      color: 'text-[#7df4ff]',
      category: 'general',
      eventId: '',
    },
    {
      id: 'notif-4',
      title: 'teamLab Digital Entry Window',
      time: 'Yesterday',
      desc: 'Strict entry window active between 10:00 and 10:30 JST tomorrow. 4 passes attached.',
      icon: 'confirmation_number',
      color: 'text-[#ddb7ff]',
      category: 'activity',
      eventId: 'activity-teamlab',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <aside className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-[#1a1c20] border-l border-[#282a2e] z-50 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#282a2e]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c3f400]">notifications</span>
              <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#e2e2e8]">
                Expedition Feed
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#c4c9ac] hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-140px)]">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.eventId) {
                    onSelectEvent(n.category, n.eventId);
                    onClose();
                  }
                }}
                className="bg-[#1e2024] hover:bg-[#282a2e] p-3.5 rounded-xl border border-[#282a2e] flex flex-col gap-1.5 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`material-symbols-outlined text-base ${n.color}`}>
                      {n.icon}
                    </span>
                    <span className="font-['Space_Grotesk'] text-xs font-bold text-[#e2e2e8]">
                      {n.title}
                    </span>
                  </div>
                  <span className="font-['Space_Mono'] text-[10px] text-[#c4c9ac]">{n.time}</span>
                </div>
                <p className="font-['DM_Sans'] text-xs text-[#c4c9ac] leading-relaxed">
                  {n.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#282a2e] hover:bg-[#37393e] text-[#e2e2e8] font-['DM_Sans'] text-xs font-bold transition-colors"
        >
          Dismiss Feed
        </button>
      </aside>
    </>
  );
};
