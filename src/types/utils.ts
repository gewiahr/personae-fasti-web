//import { Record, Session } from "./request";

export interface SelectKeyValue {
  key: any;
  value: string;
}

export type AuthStorage = {
  accesskey: any;
}

// export const StructToKeyValue = (struct : any, keyField : string, valueField : string) : SelectKeyValue => {
//     return { 
//         key : struct[keyField], 
//         value : struct[valueField] 
//     }
// }

// export const groupRecordsBySession = (records: Record[], sessions: Session[]) => {
//   // Handle case when no sessions exist
//   if (sessions.length === 0) {
//     return [{
//       sessionNumber: 0,
//       isCurrent: true,
//       records: records.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()),
//       endTime: new Date()
//     }];
//   }

//   // Sort sessions by most recent first (current session comes first)
//   const sortedSessions = [...sessions].sort((a, b) => {
//     if (!a.endTime) return -1; // Current session first
//     if (!b.endTime) return 1;
//     return new Date(b.endTime).getTime() - new Date(a.endTime).getTime();
//   });

//   // Group records by session
//   const sessionGroups = sortedSessions.map(session => {
//     const sessionRecords = records.filter(record => {
//       // Records for current session (no endTime)
//       if (!session.endTime) {
//         return !sessions.some(s => s.endTime && new Date(record.created) <= new Date(s.endTime));
//       }
//       // Records for completed sessions
//       return new Date(record.created) <= new Date(session.endTime) &&
//         !sessions.some(s => s.endTime && new Date(record.created) <= new Date(s.endTime) &&
//           new Date(s.endTime) < new Date(session.endTime));
//     });

//     return {
//       sessionNumber: session.number,
//       isCurrent: !session.endTime,
//       endTime: session.endTime,
//       records: sessionRecords.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
//     };
//   });

//   // Handle records that don't belong to any session
//   const unassignedRecords = records.filter(record =>
//     !sessionGroups.some(group => group.records.includes(record))
//   );

//   if (unassignedRecords.length > 0) {
//     sessionGroups.push({
//       sessionNumber: 0,
//       isCurrent: false,
//       endTime: new Date(),
//       records: unassignedRecords.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
//     });
//   }

//   return sessionGroups;
// };