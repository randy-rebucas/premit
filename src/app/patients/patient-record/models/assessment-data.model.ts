export interface AssessmentData {
  id: string;
  created: string;
  complaintId: string;
  diagnosis: Diagnosis[];
  treatments: Treatments[];
}

export interface Diagnosis {
  diagnose: string;
}

export interface Treatments {
  treatment: string;
}
