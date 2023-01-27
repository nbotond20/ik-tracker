import Image from 'next/image'

export const HeaderLogo = () => {
  return (
    <div className="relative mr-3 h-7 w-7 sm:h-9 sm:w-9">
      <Image src="https://flowbite.com/docs/images/logo.svg" alt="Flowbite Logo" fill style={{ objectFit: 'cover' }} />
    </div>
  )
}
