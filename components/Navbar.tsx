import Image from "next/image"
import Link from "next/link"

const navIcons = [
  {src: '/assets/icons/search.svg', alt: 'search'},
  {src: '/assets/icons/black-heart.svg', alt: 'heart'},
  {src: '/assets/icons/user.svg', alt: 'user'},
]

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image 
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="Navbar logo"
          />

          <p className="nav-logo">
            Price<span className="text-primary">Wise</span>
          </p>s
        </Link>

        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <Image 
              key={icon.alt}
              src={icon.src}
              alt={icon.alt}
              height={28}
              width={28}
              className="object-contain"
            />
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar