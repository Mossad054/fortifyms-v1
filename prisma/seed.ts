import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create system admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fortifymis.org' },
    update: {},
    create: {
      email: 'admin@fortifymis.org',
      name: 'System Administrator',
      role: 'ADMIN',
    },
  })

  // Create program manager
  const programManager = await prisma.user.upsert({
    where: { email: 'pm@fwga.org' },
    update: {},
    create: {
      email: 'pm@fwga.org',
      name: 'Sarah Program Manager',
      role: 'PROGRAM_MANAGER',
    },
  })

  // Create mill operator
  const operator = await prisma.user.upsert({
    where: { email: 'operator@mill1.com' },
    update: {},
    create: {
      email: 'operator@mill1.com',
      name: 'Jane Operator',
      role: 'MILL_OPERATOR',
    },
  })

  // Create inspector
  const inspector = await prisma.user.upsert({
    where: { email: 'inspector@fwga.org' },
    update: {},
    create: {
      email: 'inspector@fwga.org',
      name: 'Robert Inspector',
      role: 'INSPECTOR',
    },
  })

  // Create user profiles
  await prisma.userProfile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      phone: '+1234567890',
      department: 'IT',
      position: 'System Administrator',
      employeeId: 'ADMIN001',
    },
  })

  await prisma.userProfile.upsert({
    where: { userId: programManager.id },
    update: {},
    create: {
      userId: programManager.id,
      phone: '+1234567891',
      department: 'Operations',
      position: 'Program Manager',
      employeeId: 'PM001',
    },
  })

  // Create sample mill
  const mill = await prisma.mill.upsert({
    where: { code: 'KEN001' },
    update: {},
    create: {
      name: 'Nairobi Fortified Foods Mill',
      code: 'KEN001',
      registrationNumber: 'KE-MILL-001',
      country: 'Kenya',
      region: 'Nairobi',
      address: '123 Industrial Area, Nairobi',
      phone: '+254-123-456789',
      email: 'info@nairobimill.com',
      certificationStatus: 'CERTIFIED',
      certificationDate: new Date('2024-01-15'),
    },
  })

  // Update program manager and operator with mill
  await prisma.user.update({
    where: { id: programManager.id },
    data: { millId: mill.id },
  })

  await prisma.user.update({
    where: { id: operator.id },
    data: { millId: mill.id },
  })

  // Create sample equipment
  await prisma.equipment.createMany({
    data: [
      {
        millId: mill.id,
        name: 'Doser Unit 1',
        type: 'Volumetric Doser',
        manufacturer: 'FortiTech',
        model: 'FT-2000',
        serialNumber: 'FT2000-001',
        installationDate: new Date('2023-06-15'),
        location: 'Line 1',
        lastCalibration: new Date('2024-10-01'),
        nextCalibrationDue: new Date('2025-01-01'),
      },
      {
        millId: mill.id,
        name: 'Mixer Unit 1',
        type: 'Batch Mixer',
        manufacturer: 'MixPro',
        model: 'MP-500',
        serialNumber: 'MP500-001',
        installationDate: new Date('2023-06-15'),
        location: 'Line 1',
        lastCalibration: new Date('2024-10-15'),
        nextCalibrationDue: new Date('2025-01-15'),
      },
    ],
  })

  // Create sample training course
  const course = await prisma.trainingCourse.create({
    data: {
      title: 'Introduction to Food Fortification',
      description: 'Basic principles and practices of food fortification',
      category: 'Process Training',
      difficulty: 'Beginner',
      duration: 30,
      language: 'en',
    },
  })

  // Create training module
  await prisma.trainingModule.create({
    data: {
      courseId: course.id,
      title: 'Module 1: Understanding Fortification',
      content: 'This module covers the basics of food fortification...',
      order: 1,
    },
  })

  // Create sample compliance template
  await prisma.complianceTemplate.create({
    data: {
      name: 'Kenya Rice Fortification Standard',
      version: '1.0',
      commodity: 'Rice',
      country: 'Kenya',
      standardReference: 'KS 05-2023',
      sections: JSON.stringify([
        {
          id: 'premix',
          title: 'Premix Storage & Handling',
          items: [
            {
              id: 'premix_1',
              question: 'Is the premix stored in a cool, dry location away from direct sunlight?',
              type: 'YES_NO',
              criticality: 'CRITICAL',
              points: 10,
            },
          ],
        },
      ]),
      scoringRules: JSON.stringify({
        passingScore: 75,
        criticalFailure: 'any_critical_no',
      }),
    },
  })

  // Create sample batch
  const batch = await prisma.batchLog.create({
    data: {
      millId: mill.id,
      operatorId: operator.id,
      batchId: 'KEN001-L1-20250105-0001',
      productionLine: 'Line 1',
      cropType: 'Parboiled Rice',
      productType: 'Fortified Parboiled Rice',
      inputWeight: 10000,
      outputWeight: 9500,
      premixType: 'Rice Premix Standard',
      premixBatchNumber: 'PM-2025-001',
      targetFortification: JSON.stringify({
        iron: 30,
        vitaminA: 750,
        vitaminB1: 15,
      }),
      actualPremixUsed: 20,
      expectedPremix: 20,
      variance: 0,
      status: 'QC_PENDING',
    },
  })

  // Create sample QC test
  await prisma.qCTest.create({
    data: {
      batchId: batch.id,
      testerId: operator.id,
      testType: 'Iron Content',
      result: 29.5,
      unit: 'ppm',
      target: 30,
      tolerance: 3,
      status: 'PASS',
    },
  })

  // Create sample maintenance task
  const equipment = await prisma.equipment.findFirst({
    where: { millId: mill.id },
  })

  if (equipment) {
    await prisma.maintenanceTask.create({
      data: {
        equipmentId: equipment.id,
        millId: mill.id,
        assignedTo: operator.id,
        type: 'CALIBRATION',
        frequency: 'QUARTERLY',
        scheduledDate: new Date('2025-01-15'),
        status: 'SCHEDULED',
        notes: 'Quarterly calibration of doser unit',
      },
    })
  }



  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })