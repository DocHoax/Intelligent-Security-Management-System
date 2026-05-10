import { PrismaClient, RoleName, IncidentType, IncidentPriority, IncidentStatus, AlertStatus, VisitorStatus, NotificationChannel, ReportFormat, MessageKind, AuditAction } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.message.deleteMany(),
    prisma.report.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.incident.deleteMany(),
    prisma.emergencyAlert.deleteMany(),
    prisma.visitor.deleteMany(),
    prisma.securityStaff.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
    prisma.cctvLog.deleteMany()
  ]);

  const roles = await Promise.all(
    [RoleName.ADMIN, RoleName.SECURITY_PERSONNEL, RoleName.STAFF, RoleName.VISITOR].map((name) =>
      prisma.role.create({
        data: {
          name,
          description: `${name.replace(/_/g, " ")} role`
        }
      })
    )
  );

  const roleMap = Object.fromEntries(roles.map((role) => [role.name, role]));
  const passwordHash = await bcrypt.hash("Admin@1234", 12);

  const admin = await prisma.user.create({
    data: {
      fullName: "System Administrator",
      email: "admin@isms.local",
      phoneNumber: "08010000001",
      passwordHash,
      emailVerifiedAt: new Date(),
      roleId: roleMap[RoleName.ADMIN].id
    }
  });

  const securityUser = await prisma.user.create({
    data: {
      fullName: "Chief Security Officer",
      email: "security@isms.local",
      phoneNumber: "08010000002",
      passwordHash,
      emailVerifiedAt: new Date(),
      roleId: roleMap[RoleName.SECURITY_PERSONNEL].id
    }
  });

  const staffUser = await prisma.user.create({
    data: {
      fullName: "Staff Representative",
      email: "staff@isms.local",
      phoneNumber: "08010000003",
      passwordHash,
      emailVerifiedAt: new Date(),
      roleId: roleMap[RoleName.STAFF].id
    }
  });

  const visitorUser = await prisma.user.create({
    data: {
      fullName: "Guest Visitor",
      email: "visitor@isms.local",
      phoneNumber: "08010000004",
      passwordHash,
      emailVerifiedAt: new Date(),
      roleId: roleMap[RoleName.VISITOR].id
    }
  });

  await prisma.securityStaff.create({
    data: {
      userId: securityUser.id,
      fullName: securityUser.fullName,
      rank: "Supervisor",
      phoneNumber: securityUser.phoneNumber ?? undefined,
      assignedZone: "Main Gate",
      dutyShift: "Morning",
      attendanceCount: 24,
      performanceScore: 92
    }
  });

  const incidentOne = await prisma.incident.create({
    data: {
      reporterId: staffUser.id,
      type: IncidentType.FIRE,
      title: "Library wing smoke alert",
      description: "Smoke was observed in the library service corridor and needs urgent review.",
      location: "Main Library",
      priority: IncidentPriority.HIGH,
      status: IncidentStatus.IN_REVIEW,
      occurredAt: new Date("2026-05-10T08:30:00.000Z"),
      assignedToId: securityUser.id
    }
  });

  const incidentTwo = await prisma.incident.create({
    data: {
      reporterId: visitorUser.id,
      type: IncidentType.UNAUTHORIZED_ACCESS,
      title: "Restricted lab access attempt",
      description: "A visitor tried to enter the engineering lab without approval.",
      location: "Engineering Block",
      priority: IncidentPriority.CRITICAL,
      status: IncidentStatus.OPEN,
      occurredAt: new Date("2026-05-10T09:10:00.000Z")
    }
  });

  await prisma.emergencyAlert.create({
    data: {
      createdById: admin.id,
      title: "Panic button test",
      message: "Simulated emergency broadcast for security readiness.",
      location: "Campus Gate A",
      status: AlertStatus.BROADCASTED,
      panicLevel: 3,
      acknowledgedById: securityUser.id
    }
  });

  await prisma.visitor.createMany({
    data: [
      {
        fullName: "Chinedu Okafor",
        phoneNumber: "08020000001",
        email: "chinedu@example.com",
        hostUserId: admin.id,
        hostName: admin.fullName,
        purpose: "Department meeting",
        qrCode: "QR-ISM-001",
        checkInAt: new Date("2026-05-10T10:15:00.000Z"),
        status: VisitorStatus.CHECKED_IN
      },
      {
        fullName: "Grace Taylor",
        phoneNumber: "08020000002",
        email: "grace@example.com",
        hostUserId: admin.id,
        hostName: admin.fullName,
        purpose: "Vendor onboarding",
        qrCode: "QR-ISM-002",
        status: VisitorStatus.PENDING
      }
    ]
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: admin.id,
        incidentId: incidentOne.id,
        title: "Incident review queue updated",
        message: "Library wing smoke alert is waiting for final review.",
        channel: NotificationChannel.IN_APP,
        readAt: null
      },
      {
        userId: securityUser.id,
        incidentId: incidentTwo.id,
        title: "New urgent incident assigned",
        message: "Unauthorized access attempt has been escalated.",
        channel: NotificationChannel.WEB_SOCKET,
        readAt: null
      }
    ]
  });

  await prisma.report.createMany({
    data: [
      {
        generatedById: admin.id,
        title: "Monthly Incident Report",
        format: ReportFormat.PDF,
        fileUrl: "/exports/monthly-incident-report.pdf"
      },
      {
        generatedById: admin.id,
        title: "Staff Performance Report",
        format: ReportFormat.EXCEL,
        fileUrl: "/exports/staff-performance-report.xlsx"
      }
    ]
  });

  await prisma.message.createMany({
    data: [
      {
        senderId: securityUser.id,
        recipientId: admin.id,
        kind: MessageKind.CHAT,
        content: "Patrol team is covering the engineering block now.",
        threadId: "thread-admin-security"
      },
      {
        senderId: admin.id,
        recipientId: staffUser.id,
        kind: MessageKind.ANNOUNCEMENT,
        content: "Please review the latest incident handling protocol.",
        threadId: "thread-admin-staff"
      }
    ]
  });

  await prisma.cctvLog.createMany({
    data: [
      {
        cameraName: "Gate A Camera",
        activityType: "motion-detected",
        motionDetected: true,
        confidence: 0.86,
        snapshotUrl: "/cctv/gate-a-001.png"
      },
      {
        cameraName: "Library Hall Camera",
        activityType: "routine-scan",
        motionDetected: false,
        confidence: 0.12,
        snapshotUrl: "/cctv/library-hall-001.png"
      }
    ]
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: AuditAction.CREATE,
      entityType: "Seed",
      entityId: "seed-run",
      metadata: {
        users: 4,
        incidents: 2,
        visitors: 2
      }
    }
  });

  console.log("Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });