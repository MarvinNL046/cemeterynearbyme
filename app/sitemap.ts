import { MetadataRoute } from 'next'
import { getAllCemeteries, getAllProvinces, getAllMunicipalities, createMunicipalitySlug } from '@/lib/data'

// This function runs at build time and generates the sitemap automatically
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.begraafplaatsindebuurt.nl'
  
  // Get all data
  const cemeteries = await getAllCemeteries()
  const provinces = await getAllProvinces()
  const municipalities = await getAllMunicipalities()
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/zoeken`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/vergelijk`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/over-ons`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]
  
  // Province pages - automatically generated
  const provincePages = provinces
    .filter(province => province !== 'Onbekend')
    .map(province => ({
      url: `${baseUrl}/provincie/${province.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  
  // Municipality pages - automatically generated
  const municipalityPages = municipalities.map(municipality => ({
    url: `${baseUrl}/gemeente/${createMunicipalitySlug(municipality)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // Cemetery pages - automatically generated
  const cemeteryPages = cemeteries.map(cemetery => ({
    url: `${baseUrl}/begraafplaats/${cemetery.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Get unique places from cemeteries
  const uniquePlaces = [...new Set(cemeteries
    .map(c => c.plaats)
    .filter((p): p is string => Boolean(p))
  )]
  
  // Place pages - automatically generated
  const placePages = uniquePlaces.map(plaats => ({
    url: `${baseUrl}/plaats/${plaats.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  // Cemetery type pages
  const typePages = [
    'algemene-begraafplaats',
    'bijzondere-begraafplaats',
    'joodse-begraafplaats',
    'islamitische-begraafplaats',
    'natuurbegraafplaats'
  ].map(type => ({
    url: `${baseUrl}/type/${type}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  // Combine all pages
  return [
    ...staticPages,
    ...provincePages,
    ...municipalityPages,
    ...cemeteryPages,
    ...placePages,
    ...typePages,
  ]
}