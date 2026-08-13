import { useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { announcements } from '../../data/announcements';
import { Badge } from '../common/Badge';
import { formatDate } from '../../utils/date';
import { Reveal } from './Reveal';

export function AnnouncementsSection() {
  const [showAll, setShowAll] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const published = useMemo(
    () => [...announcements].filter((a) => a.status === 'published').sort((a, b) => (a.date < b.date ? 1 : -1)),
    [],
  );

  const visible = showAll ? published : published.slice(0, 3);

  return (
    <section id="announcements" aria-labelledby="announcements-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-7">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="announcements-heading" className="text-3xl font-extrabold text-ink sm:text-4xl">
          Latest Library Updates
        </h2>
        <p className="mt-3 text-lg text-muted">Stay in the loop with news, reminders, and community programs.</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
        {visible.map((announcement, index) => {
          const isExpanded = expandedId === announcement.id;
          return (
            <Reveal key={announcement.id} delayMs={(index % 3) * 80}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <Badge tone="green">Published</Badge>
                  <span className="text-xs text-muted">{formatDate(announcement.date)}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink">{announcement.title}</h3>
                <p className={`mt-2 flex-1 text-sm text-muted ${isExpanded ? '' : 'line-clamp-3'}`}>{announcement.content}</p>
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : announcement.id)}
                  aria-expanded={isExpanded}
                  className="mt-4 inline-flex items-center gap-1 self-start text-sm font-semibold text-primary-700 hover:text-primary-800"
                >
                  {isExpanded ? 'Show Less' : 'Read More'}
                  {isExpanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <ChevronDown className="h-4 w-4" aria-hidden="true" />}
                </button>
              </article>
            </Reveal>
          );
        })}
      </div>

      {published.length > 3 && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-800"
          >
            {showAll ? 'Show Fewer Updates' : 'View All Announcements'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
