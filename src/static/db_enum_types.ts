// For some reason, pgEnum (in the schema definition) doesnt like when i convert
// the enum into a str[]. So we'll just directly define a string arr at the end.

// enum ArchiveStatus {
//     BOOKED = "booked", // Room is currently booked
//     RENTING = "renting", // Room is currently being rented
//     COMPLETED = "completed", // Room was booked/rented, then checked out by customer
//     CANCELLED = "cancelled" // Room was booked then cancelled
// } 

// enum ProblemStatus {
//     ONGOING = "ongoing", // Problem is currently ongoing
//     RESOLVED = "resolved" // Problem has been resolved
// }

// enum ProblemType {
//     // list problem types here
//     ELECTRONIC = "electronic", // some electrical device in the room is non-functional
//     INFRASTRUCTURE = "infrastructure", // some infrastructure is malfunctioning ex air conditioning, plumbing, water in the room
//     INFESTATION = "infestation", // room is infested. Note: make room inaccessible if theres a problem like this?
// REMOVED    MISSING_AMENITY = "missing_amenity", // room is missing some required amenity (ies)
// REMOVED    UNCLEAN = "unclean", // room for whatever reason is unclean and cannot be cleaned by staff
// REMOVED    NOISE = "noise", // room has a lot of noise and inadequate sound proofing
// }
const archiveStatusStrArr = ["booked", "renting", "completed", "cancelled"] as const;

const problemStatusStrArr = ["ongoing", "resolved"] as const;
const problemTypeStrArr = ["electronic", "infrastructure", "infestation"] as const;

const roomViewTypes = ['mountain', 'sea'] as const

const employeeRoles = [
    'General Manager', 'Assistant Manager', 'Sales and Marketing Manager', 'Human Resources Manager',
    'Receptionist', 'Concierge', 'Bellhop', 'Night Auditor', 'Doorkeeper',
    'Executive Housekeeper', 'Room Attendant', 'Houseman', 'Maintenance Technician',
    'Restaurant Manager', 'Cook', 'Server', 'Bartender', 
    'Security Officer'
] as const

const allTypes = [archiveStatusStrArr, problemStatusStrArr, problemTypeStrArr, roomViewTypes, employeeRoles];
const allTypeNames = ["archive_status", "problem_status", "problem_type", "room_view", "employee_role"];

export {
    archiveStatusStrArr, 
    problemStatusStrArr, problemTypeStrArr, 
    roomViewTypes,
    employeeRoles,
    allTypes, allTypeNames
}