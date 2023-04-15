import { mockSubjects } from 'src/mock/mockSubjects'

import { prisma } from '../src/server/db'

async function main() {
  const subjects = mockSubjects.success ? mockSubjects.data : []

  for (const subject of subjects) {
    await prisma.subject.create({
      data: {
        code: subject.code,
        consultation: subject.consultation,
        courseName: subject.courseName,
        credit: subject.credit,
        assessmentType: subject.assessmentType,
        labor: subject.labor,
        lecture: subject.lecture,
        practice: subject.practice,
        practiceGradeType: subject.practiceGradeType,
        preRequirements: { create: subject.preRequirements },
        semester: subject.semester,
        specialisation: subject.specialisation,
        subjectGroupType: subject.subjectGroupType,
        subjectType: subject.subjectType,
      },
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    // eslint-disable-next-line no-console
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
