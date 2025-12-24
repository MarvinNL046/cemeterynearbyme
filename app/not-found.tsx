import Link from 'next/link'
import { Search, Home, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4">Pagina niet gevonden</h2>
        <p className="text-lg text-muted-foreground mb-8">
          De pagina die u zoekt bestaat niet of is mogelijk verplaatst. 
          Geen zorgen, we helpen u graag verder!
        </p>
        
        <div className="grid gap-4 sm:grid-cols-3 mb-12">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Homepage
            </Button>
          </Link>
          <Link href="/zoeken">
            <Button variant="default" className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Zoek begraafplaats
            </Button>
          </Link>
          <Link href="/provincie/limburg">
            <Button variant="outline" className="w-full">
              <MapPin className="mr-2 h-4 w-4" />
              Bekijk provincies
            </Button>
          </Link>
        </div>
        
        <div className="bg-muted rounded-lg p-6">
          <h3 className="font-semibold mb-3">Populaire begraafplaatsen</h3>
          <div className="grid gap-2 text-sm">
            <Link href="/gemeente/beek" className="text-primary hover:underline">
              Begraafplaatsen in Beek
            </Link>
            <Link href="/gemeente/beekdaelen" className="text-primary hover:underline">
              Begraafplaatsen in Beekdaelen
            </Link>
            <Link href="/gemeente/brunssum" className="text-primary hover:underline">
              Begraafplaatsen in Brunssum
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-muted-foreground">
          <p>Kwam u hier via een oude link? Laat het ons weten via</p>
          <a href="mailto:info@begraafplaatsindebuurt.nl" className="text-primary hover:underline">
            info@begraafplaatsindebuurt.nl
          </a>
        </div>
      </div>
    </div>
  )
}