import { Fragment } from 'react';
import { Reveal } from './Reveal';

const STEPS = [
  { number: '01', title: 'Create Your Account', description: 'Register for a Balingasag Municipal Public Library account.' },
  { number: '02', title: 'Find a Book', description: 'Search the catalog and explore available titles.' },
  { number: '03', title: 'Reserve & Read', description: 'Submit your request, visit the library, and enjoy your book.' },
];

export function HowItWorks() {
  return (
    <section id="how-to-access" aria-labelledby="how-it-works-heading" className="bg-bg py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-7">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="how-it-works-heading" className="text-3xl font-extrabold text-ink sm:text-4xl">
            How to Access the Library
          </h2>
          <p className="mt-3 text-lg text-muted">Three simple steps from sign-up to your next great read.</p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-start md:gap-0">
          {STEPS.map((step, index) => (
            <Fragment key={step.number}>
              <Reveal delayMs={index * 120} className="flex-1">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-extrabold text-white shadow-md shadow-primary-600/20">
                    {step.number}
                  </span>
                  <h3 className="text-lg font-bold text-ink">{step.title}</h3>
                  <p className="max-w-[220px] text-sm text-muted">{step.description}</p>
                </div>
              </Reveal>
              {index < STEPS.length - 1 && (
                <div className="mt-7 hidden h-0.5 flex-1 bg-primary-200 md:block" aria-hidden="true" />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
