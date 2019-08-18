export interface ComplaintData {
  id: string;
  created: string;
  patient: string;
  complaints: Complaints[];
}

export interface Complaints {
  complaint: string;
}
