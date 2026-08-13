import { useCountUp } from '../../hooks/useCountUp';
import { Reveal } from './Reveal';

function formatCount(value: number): string {
  return `${value.toLocaleString()}+`;
}

export function CommunityStats() {
  const books = useCountUp(5000);
  const members = useCountUp(1000);
  const programs = useCountUp(30);

  return (
    <section aria-labelledby="community-stats-heading" className="bg-deep py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-7">
        <h2 id="community-stats-heading" className="sr-only">
          Community impact
        </h2>
        <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          <div ref={books.ref}>
            <Reveal delayMs={0}>
              <p className="text-4xl font-extrabold text-mint sm:text-5xl">{formatCount(books.value)}</p>
              <p className="mt-2 text-sm text-primary-50 sm:text-base">Books &amp; Titles</p>
            </Reveal>
          </div>
          <div ref={members.ref}>
            <Reveal delayMs={80}>
              <p className="text-4xl font-extrabold text-mint sm:text-5xl">{formatCount(members.value)}</p>
              <p className="mt-2 text-sm text-primary-50 sm:text-base">Registered Members</p>
            </Reveal>
          </div>
          <div ref={programs.ref}>
            <Reveal delayMs={160}>
              <p className="text-4xl font-extrabold text-mint sm:text-5xl">{formatCount(programs.value)}</p>
              <p className="mt-2 text-sm text-primary-50 sm:text-base">Community Programs</p>
            </Reveal>
          </div>
          <Reveal delayMs={240}>
            <p className="text-4xl font-extrabold text-mint sm:text-5xl">Since 1991</p>
            <p className="mt-2 text-sm text-primary-50 sm:text-base">Serving Balingasag</p>
          </Reveal>
        </div>
        <p className="mt-8 text-center text-xs text-primary-100/80">
          Figures shown are illustrative preview data, not confirmed official totals.
        </p>
      </div>
    </section>
  );
}
