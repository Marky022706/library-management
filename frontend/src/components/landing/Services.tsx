import { services } from '../../data/services';
import { Reveal } from './Reveal';

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="mx-auto max-w-7xl px-4 py-20 sm:px-7">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="services-heading" className="text-3xl font-extrabold text-ink sm:text-4xl">
          Library Services
        </h2>
        <p className="mt-3 text-lg text-muted">Digital and in-branch services for every kind of visitor.</p>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <Reveal key={service.id} delayMs={(index % 4) * 80}>
            <div className="group h-full rounded-2xl border border-line bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-colors group-hover:bg-primary-600 group-hover:text-white">
                <service.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{service.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{service.description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
