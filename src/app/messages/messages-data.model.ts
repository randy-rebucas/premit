export interface MessagesData {
  id: string;
  subject: string;
  message: string;
  patientId: string;
  practitionerId: string;
  created: string;
}

// msg = {
//   from: "Joe",
//   to: ["Bob", "Jane"]
//   sent: new Date()
//   message: "Hi!",
// }

// //Send a message
// for (recipient in msg.to){
//   msg.recipient = msg.to[recipient]
//   db.inbox.insert(msg);
// }
