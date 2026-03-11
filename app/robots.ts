import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/perfil/', '/progresso/', '/goals/', '/tarefas/', '/equilibrio/'],
    },
    sitemap: 'https://maisumporcento.com.br/sitemap.xml',
  }
}