# Use Case Diagram

```mermaid
flowchart LR
  Admin[Admin] --> UC1[Manage Users]
  Admin --> UC2[Review Incidents]
  Admin --> UC3[Assign Security Staff]
  Admin --> UC4[Generate Reports]

  Security[Security Personnel] --> UC5[Receive Alerts]
  Security --> UC6[Update Incident Status]
  Security --> UC7[Submit Patrol Reports]

  Staff[Staff] --> UC8[Report Incidents]
  Staff --> UC9[Track Report Progress]
  Staff --> UC10[Receive Safety Alerts]

  Visitor[Visitor/User] --> UC11[Register Account]
  Visitor --> UC12[Check Visit Status]
  Visitor --> UC13[Check In / Out]
```

## Main Scenarios

- An admin monitors activity, manages users, and produces reports.
- A security officer receives emergency alerts and updates incident status.
- A staff member reports an incident and tracks the response.
- A visitor or user registers, receives a QR pass, and checks visit status.
