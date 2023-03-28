import { useTranslation } from 'react-i18next'

import { BreadCrumbs } from '@components/Breadcrumbs/Breadcrumps'
import { ScrollLayout } from '@components/Layout/ScrollLayout'
import { SortMenu } from '@components/SortMenu/SortMenu'
import { Filters } from '@components/SubjectFilters/Filters'
import { filters } from '@constants/filters'
import { tableColumnHeaders } from '@constants/pages'
import { useSearchPage } from '@hooks/useSearchPage'
import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import Head from 'next/head'

const FunnelIcon = dynamic(() => import('@heroicons/react/20/solid/FunnelIcon'))
const Squares2X2Icon = dynamic(() => import('@heroicons/react/20/solid/Squares2X2Icon'))
const Bars3Icon = dynamic(() => import('@heroicons/react/20/solid/Bars3Icon'))
const FilterDrawer = dynamic(() => import('@components/SubjectFilters/FilterDrawer').then(mod => mod.FilterDrawer))
const SubjectGrid = dynamic(() => import('@components/SubjectGrid/SubjectGrid').then(mod => mod.SubjectGrid))
const SubjectList = dynamic(() => import('@components/SubjectList/SubjectList').then(mod => mod.SubjectList))

const breadcrumbs = [
  {
    title: 'routes.search',
  },
]

const SearchPage: NextPage = () => {
  const {
    page,
    sortType,
    gridView,
    isLoading,
    searchTerm,
    creditRange,
    totalResults,
    semesterRange,
    elementsPerPage,
    checkboxFilters,
    preReqSearchTerm,
    mobileFiltersOpen,
    displayedSubjects,
    setGridView,
    setSearchTerm,
    handleNextPage,
    setCreditRange,
    handlePrevPage,
    setSemesterRange,
    setCheckboxFilters,
    setPreReqSearchTerm,
    setMobileFiltersOpen,
    handleSetSortedSubjects,
  } = useSearchPage()

  const { t } = useTranslation()

  return (
    <ScrollLayout>
      <Head>
        <title>{`IK-Tracker - ${t('routes.search')}`}</title>
      </Head>
      {/* Mobile filter drawer */}
      <FilterDrawer
        mobileFiltersOpen={mobileFiltersOpen}
        filters={filters}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        preReqSearchTerm={preReqSearchTerm}
        setPreReqSearchTerm={setPreReqSearchTerm}
        setMobileFiltersOpen={setMobileFiltersOpen}
        checkboxFilters={checkboxFilters}
        setCheckboxFilters={setCheckboxFilters}
        creditRange={creditRange}
        setCreditRange={setCreditRange}
        semesterRange={semesterRange}
        setSemesterRange={setSemesterRange}
      />

      <div className="w-full max-w-screen-2xl px-2 sm:px-4 lg:px-8 flex flex-col">
        {/* Header */}
        <div className="flex items-baseline justify-between border-b border-gray-200 pt-12 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{t('search.title')}</h1>
          <div className="flex items-center">
            <SortMenu
              sortType={sortType}
              handleSetSortedSubjects={handleSetSortedSubjects}
              tableColumnHeaders={tableColumnHeaders}
            />
            <button
              type="button"
              className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              onClick={() => setGridView(prev => !prev)}
            >
              <span className="sr-only">View grid</span>
              {gridView ? (
                <Bars3Icon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <span className="sr-only">Filters</span>
              <FunnelIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="mt-6">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <section className="pt-6">
          <div className="flex w-full gap-8">
            {/* Filters */}
            <Filters
              filters={filters}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              preReqSearchTerm={preReqSearchTerm}
              setPreReqSearchTerm={setPreReqSearchTerm}
              setMobileFiltersOpen={setMobileFiltersOpen}
              checkboxFilters={checkboxFilters}
              setCheckboxFilters={setCheckboxFilters}
              creditRange={creditRange}
              setCreditRange={setCreditRange}
              semesterRange={semesterRange}
              setSemesterRange={setSemesterRange}
            />
            {/* Results */}
            {gridView ? (
              <SubjectGrid
                isLoading={isLoading}
                handleSetSortedSubjects={handleSetSortedSubjects}
                sortType={sortType}
                subjects={displayedSubjects}
                page={page}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                elementsPerPage={elementsPerPage}
                totalElements={totalResults}
              />
            ) : (
              <SubjectList
                isLoading={isLoading}
                handleSetSortedSubjects={handleSetSortedSubjects}
                sortType={sortType}
                subjects={displayedSubjects}
                page={page}
                handleNextPage={handleNextPage}
                handlePrevPage={handlePrevPage}
                elementsPerPage={elementsPerPage}
                totalElements={totalResults}
              />
            )}
          </div>
        </section>
      </div>
    </ScrollLayout>
  )
}

export default SearchPage
