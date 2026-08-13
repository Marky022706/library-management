import { Clock, ExternalLink, Globe, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { Button } from '../common/Button';
import { Reveal } from './Reveal';

const DETAILS = [
  { icon: MapPin, label: 'Location', value: 'Osmeña Street, Poblacion, Balingasag, Misamis Oriental, Philippines' },
  { icon: Clock, label: 'Opening Hours', value: 'Mon–Fri, 8:00 AM – 5:00 PM · Closed on holidays' },
  { icon: Phone, label: 'Contact Number', value: '(088) 000-0000' },
  { icon: Mail, label: 'Email', value: 'library@balingasag.gov.ph' },
];

// Osmeña St., Poblacion — the specific unlabeled building immediately south
// of Bahay Silangan (OSM way 849058581, center 8.7435663, 124.7756470) and
// east of Saint Rita's Parish Church, per the building circled by the user.
// OSM has no name/POI for this building — it's plain `building=yes`.
const LAT = 8.7434;
const LON = 124.77563;
const BBOX_DELTA = 0.0016;
const MAP_EMBED_SRC = `https://www.openstreetmap.org/export/embed.html?bbox=${(LON - BBOX_DELTA).toFixed(4)}%2C${(LAT - BBOX_DELTA).toFixed(4)}%2C${(LON + BBOX_DELTA).toFixed(4)}%2C${(LAT + BBOX_DELTA).toFixed(4)}&layer=mapnik&marker=${LAT}%2C${LON}`;
const MAP_VIEW_URL = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=19/${LAT}/${LON}`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LON}`;
const CONTACT_EMAIL = 'library@balingasag.gov.ph';

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="bg-bg py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-7">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="contact-heading" className="text-3xl font-extrabold text-ink sm:text-4xl">
            Visit the Balingasag Municipal Public Library
          </h2>
          <p className="mt-3 text-lg text-muted">We'd love to see you — in person or online.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal direction="left" className="flex flex-col gap-6 rounded-2xl border border-line bg-white p-8 shadow-sm">
            <dl className="flex flex-col gap-5">
              {DETAILS.map((detail) => (
                <div key={detail.label} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                    <detail.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{detail.label}</dt>
                    <dd className="mt-0.5 text-sm font-medium text-ink">{detail.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <p className="text-xs text-muted">Sample contact details shown for preview — replace with official information.</p>

            <div className="flex items-center gap-2 border-t border-line pt-5">
              <span className="text-sm font-semibold text-ink">Follow us:</span>
              <a href="#contact" aria-label="Library social updates" className="rounded-full p-2 text-muted hover:bg-gray-100 hover:text-primary-700">
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#contact" aria-label="Library website" className="rounded-full p-2 text-muted hover:bg-gray-100 hover:text-primary-700">
                <Globe className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                icon={<Navigation className="h-4 w-4" aria-hidden="true" />}
                onClick={() => window.open(DIRECTIONS_URL, '_blank', 'noopener,noreferrer')}
              >
                Get Directions
              </Button>
              <Button
                variant="outline"
                icon={<Mail className="h-4 w-4" aria-hidden="true" />}
                onClick={() => window.location.assign(`mailto:${CONTACT_EMAIL}`)}
              >
                Contact Us
              </Button>
            </div>
          </Reveal>

          <Reveal direction="right" delayMs={120} className="flex flex-col gap-2">
            <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-2xl border border-line shadow-sm">
              <iframe
                title="Map showing the Balingasag Municipal Public Library building on Osmeña Street, Poblacion"
                src={MAP_EMBED_SRC}
                loading="lazy"
                className="absolute inset-0 h-full w-full"
                style={{ border: 0 }}
              />
            </div>
            <a
              href={MAP_VIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 self-end text-xs font-medium text-muted hover:text-primary-700"
            >
              View larger map
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
