// app/page.tsx
import { PrismaClient, Event, User } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  // Pridobi dogodke iz baze skupaj z uporabnikom
  const events: (Event & { user: User })[] = await prisma.event.findMany({
    include: { user: true },
    orderBy: { date: 'asc' },
  })

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navigacija */}
      <header className="bg-white shadow">
        <nav className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="text-2xl font-bold">MeetZone</div>
          <ul className="flex gap-6 text-gray-700">
            <li><a href="#" className="hover:text-blue-600">Domov</a></li>
            <li><a href="#" className="hover:text-blue-600">Dogodki</a></li>
            <li><a href="#" className="hover:text-blue-600">Skupnosti</a></li>
            <li><a href="#" className="hover:text-blue-600">O nas</a></li>
            <li><a href="#" className="hover:text-blue-600">Prijava</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero sekcija */}
      <section className="bg-gray-100 py-20 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-4">Najdi dogodke v tvoji bližini</h1>
          <p className="text-gray-700 mb-6">
            Pridruži se ljudem s podobnimi interesi in odkrij nove priložnosti.
          </p>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Išči po interesih ali lokaciji"
              className="border rounded-l-lg px-4 py-2 w-64"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg">
              Išči
            </button>
          </div>
        </div>
      </section>

      {/* Seznam dogodkov */}
      <section className="container mx-auto py-16 px-6">
        <h2 className="text-2xl font-semibold mb-8 text-center">Prihajajoči dogodki</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event: Event & { user: User }) => (
            <div key={event.id} className="bg-white shadow rounded-xl overflow-hidden">
              <img
                src={event.imageUrl || '/default.jpg'}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p className="text-gray-600">
                  {new Date(event.date).toLocaleDateString('sl-SI')} • {event.location}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Ustvaril: {event.user?.name || 'Neznan uporabnik'}
                </p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                  Več o dogodku
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA sekcija */}
      <section className="bg-blue-50 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ustvari svojo skupnost</h2>
        <p className="text-gray-700 mb-6">
          Organiziraj dogodke, povabi člane in zgradi mrežo.
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Začni zdaj
        </button>
      </section>

      {/* Noga */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>© 2025 MeetZone. Vse pravice pridržane.</p>
      </footer>
    </main>
  )
}
