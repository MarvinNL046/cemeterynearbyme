import { Map, Phone } from 'lucide-react';

interface CemeteryActionsProps {
  cemetery: {
    naam_begraafplaats: string;
    gemeente: string;
    google_address?: string;
    openingstijden?: string;
    telefoon?: string;
    google_phone?: string;
    slug: string;
  };
  googleMapsUrl: string | null;
}

export default function CemeteryActions({ cemetery, googleMapsUrl }: CemeteryActionsProps) {
  return (
    <section className="mb-8 bg-primary/5 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Plan uw bezoek</h3>
      <p className="text-muted-foreground mb-6">
        Wilt u {cemetery.naam_begraafplaats} bezoeken? We hebben alle informatie voor u verzameld.
      </p>
      {googleMapsUrl && (
        <div className="mb-4">
          <a 
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md px-6 py-3 hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            <Map className="w-5 h-5" />
            Plan uw route via Google Maps
          </a>
        </div>
      )}
      {(cemetery.telefoon || cemetery.google_phone) && (
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-2">Heeft u vragen?</p>
          <a 
            href={`tel:${cemetery.google_phone || cemetery.telefoon}`}
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Phone className="w-4 h-4" />
            Bel direct: {cemetery.google_phone || cemetery.telefoon}
          </a>
        </div>
      )}
    </section>
  );
}