import { ConnectButton } from '@rainbow-me/rainbowkit'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Create', href: '/create' },
  { name: 'Learn', href: '/learn' },
]

export default function Header() {
  return (
    <header>
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-brand-500 py-6 lg:border-none">
          <div className="flex items-center">
            <a href="#">
              <span className="sr-only">Thoth</span>
              <img
                className="h-10 w-auto"
                src="https://as1.ftcdn.net/v2/jpg/02/97/82/60/1000_F_297826012_dxX393FswDyua3aCqvYMBpAODW5j90Zd.jpg"
                alt=""
              />
            </a>
            <div className="ml-10 hidden space-x-8 lg:block">
              {navigation.map((link) => (
                <a key={link.name} href={link.href} className="text-base font-medium text-white hover:text-brand-50">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4">
            <ConnectButton />
          </div>
        </div>
        <div className="flex flex-wrap justify-center space-x-6 py-4 lg:hidden">
          {navigation.map((link) => (
            <a key={link.name} href={link.href} className="text-base font-medium text-white hover:text-brand-50">
              {link.name}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}
