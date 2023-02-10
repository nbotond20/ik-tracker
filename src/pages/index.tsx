import { type NextPage } from 'next'
import Link from 'next/link'

import { MacBookSVG } from '@components'
import {
  CalculatorIcon,
  PresentationChartLineIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid'

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
              <MacBookSVG />
            </div>
            <div className="mr-auto place-self-center lg:col-span-7">
              <div className="block">
                <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight dark:text-white md:text-5xl xl:text-6xl">
                  Track your progress with us
                </h1>
              </div>
              <p className="mb-6 max-w-2xl font-light text-gray-500 dark:text-gray-400 md:text-lg lg:mb-8 lg:text-xl">
                Use our app to track your progress and get the most out of your college experience. Be in control of
                your future.
              </p>
              <Link
                href="/login"
                className="mr-3 mb-3 inline-flex items-center justify-center rounded-lg bg-primary-700 px-5 py-3 text-center text-base font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
              >
                Get started
                <svg
                  className="ml-2 -mr-1 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-3 text-center text-base font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Go to login
              </Link>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 animate-bounce" style={{ translate: '-50%' }}>
            <Link href="#features">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 fill-black stroke-black dark:fill-white dark:stroke-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
              </svg>
            </Link>
          </div>
        </section>
      </div>
      <div
        id="features"
        className="relative grid min-h-[calc(100vh-64px)] w-full snap-start snap-always flex-col items-center justify-center overflow-auto"
      >
        {/* Features */}
        <div className="max-w-screen-xl space-y-16 px-4 py-8 pb-20 md:grid md:grid-cols-2 md:gap-12 md:space-y-0 lg:grid-cols-3 lg:py-16">
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <PresentationChartLineIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">Tracking</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Track your progress with us. We will help you keep track of your grades, assignments, and more. Be on top
              of your game.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <AcademicCapIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">Planning</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Plan your next semester with ease. Use our requirements checker to make sure you are on track to graduate
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <CalculatorIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">Calculator</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Use our calculator to calculate your GPA and more. We will help you achieve your goals.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <MagnifyingGlassIcon className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6" />
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">Search</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Not sure what to take? Use our search feature to find the perfect course for you. Filter based on your
              needs and requirements.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <svg
                className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">Enterprise Design</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Craft beautiful, delightful experiences for both marketing and product with real cross-company
              collaboration.
            </p>
          </div>
          <div>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 lg:h-12 lg:w-12">
              <svg
                className="h-5 w-5 text-primary-600 dark:text-primary-300 lg:h-6 lg:w-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">Operations</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Keep your company’s lights on with customizable, iterative, and structured workflows built for all
              efficient teams and individual.
            </p>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 animate-bounce" style={{ translate: '-50%' }}>
          <Link href="#top">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 fill-black stroke-black dark:fill-white dark:stroke-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19.5v-15m0 0l-6.75 6.75M12 4.5l6.75 6.75" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
