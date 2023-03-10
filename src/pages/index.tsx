import { type NextPage } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const DynamicMacBookSVG = dynamic(() => import('@components/SVG/MacBookSVG').then(mod => mod.MacBookSVG))
const CalculatorIcon = dynamic(() => import('@heroicons/react/24/solid/CalculatorIcon'))
const PresentationChartLineIcon = dynamic(() => import('@heroicons/react/24/solid/PresentationChartLineIcon'))
const AcademicCapIcon = dynamic(() => import('@heroicons/react/24/solid/AcademicCapIcon'))
const MagnifyingGlassIcon = dynamic(() => import('@heroicons/react/24/solid/MagnifyingGlassIcon'))
const UserCircleIcon = dynamic(() => import('@heroicons/react/24/solid/UserCircleIcon'))
const ArrowDownCircleIcon = dynamic(() => import('@heroicons/react/24/solid/ArrowDownCircleIcon'))

const ArrowDownIcon = dynamic(() => import('@heroicons/react/24/outline/ArrowDownIcon'))
const ArrowUpIcon = dynamic(() => import('@heroicons/react/24/outline/ArrowUpIcon'))
const ArrowSmallRightIcon = dynamic(() => import('@heroicons/react/24/outline/ArrowSmallRightIcon'))

const HomePage: NextPage = () => {
  return (
    <div className="hideScrollbar relative max-h-[calc(100vh-64px)] w-screen snap-none overflow-auto scroll-smooth md:snap-y md:snap-mandatory">
      <div
        id="top"
        className="flex min-h-[calc(100vh-64px)] w-full snap-center snap-always flex-col items-center justify-center"
      >
        <section className="bg-white dark:bg-gray-900">
          <div className="mx-auto flex max-w-screen-xl px-4 lg:grid-cols-12 lg:gap-8 xl:gap-0">
            <div className="relative hidden h-1/2 w-1/2 lg:col-span-5 lg:mt-0 lg:flex">
              <DynamicMacBookSVG />
            </div>
            <div className="mr-auto place-self-center lg:col-span-7">
              <div className="block">
                <h1
                  className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl"
                  data-testid="home-title"
                >
                  Track your progress with us
                </h1>
              </div>
              <p
                className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl"
                data-testid="home-subtitle"
              >
                Use our app to track your progress and get the most out of your college experience. Be in control of
                your future.
              </p>
              <Link
                href="/login"
                className="mr-3 mb-3 inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
                data-testid="home-get-started-link"
              >
                Get started
                <ArrowSmallRightIcon className="ml-2 -mr-1 h-5 w-5 fill-white stroke-white stroke-2" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                data-testid="home-login-link"
              >
                Go to login
              </Link>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 animate-bounce" style={{ translate: '-50%' }}>
            <Link href="#features" aria-label="Jump to the features section" data-testid="home-features-link">
              <ArrowDownIcon className="h-6 w-6 fill-black stroke-black dark:fill-white dark:stroke-white" />
            </Link>
          </div>
        </section>
      </div>
      <div
        id="features"
        className="relative grid min-h-[calc(100vh-64px)] w-full snap-start snap-always flex-col items-center justify-center overflow-auto"
      >
        {/* Features */}
        <div
          className="max-w-screen-xl space-y-16 px-4 py-8 pb-20 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3 lg:py-16"
          data-testid="home-feature-section"
        >
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <PresentationChartLineIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold dark:text-white">Tracking</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Track your progress with us. We will help you keep track of your grades, assignments, and more. Be on top
              of your game.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <AcademicCapIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold dark:text-white">Planning</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Plan your next semester with ease. Use our requirements checker to make sure you are on track to graduate
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <CalculatorIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold dark:text-white">Calculator</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Use our calculator to calculate your GPA and more. We will help you achieve your goals.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <MagnifyingGlassIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold dark:text-white">Search</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Not sure what to take? Use our search feature to find the perfect course for you. Filter based on your
              needs and requirements.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <UserCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold dark:text-white">Save your data</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Login safely with <span className="font-bold">Google</span>, <span className="font-bold">Discord</span> or{' '}
              <span className="font-bold">Github</span> to save your data. We will keep your data safe and secure. You
              can access your progress from anywhere.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <ArrowDownCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold dark:text-white">Download our app</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Download our app to access your data from your phone. You can also use our app to track your progress on
              the go.
            </p>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 animate-bounce" style={{ translate: '-50%' }}>
          <Link href="#top" aria-label="Jump to the top" data-testid="home-top-link">
            <ArrowUpIcon className="h-6 w-6 fill-black stroke-black dark:fill-white dark:stroke-white" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
