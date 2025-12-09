"use client"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-6">
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <h4 className="font-semibold text-white mb-2">The people platform</h4>
          <ul className="space-y-1 text-sm">
            <li>Create your own Meetup group.</li>
            <li className="mt-2"><button className="text-blue-400">Get Started</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-2">Your Account</h4>
          <ul className="space-y-1 text-sm">
            <li>Settings</li>
            <li className="text-red-500">Log out</li>
            <li>Help</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-2">Discover</h4>
          <ul className="space-y-1 text-sm">
            <li>Groups</li>
            <li>Events</li>
            <li>Topics</li>
            <li>Cities</li>
            <li>Online Events</li>
            <li>Local Guides</li>
            <li>Make Friends</li>
            <li>Meetup</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-2">About</h4>
          <ul className="space-y-1 text-sm">
            <li>Blog</li>
            <li>Meetup Pro</li>
            <li>Careers</li>
            <li>Apps</li>
            <li>Podcast</li>
            <li>Follow us</li>
            <li className="mt-2">Get the App</li>
            <li>Download on Google Play</li>
            <li>Download on App Store</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs py-4 border-t border-gray-800">
        © 2025 Meetup · Terms of Service · Privacy Policy · Cookie Settings · Cookie Policy · License Attribution · Help
      </div>
    </footer>
  )
}
