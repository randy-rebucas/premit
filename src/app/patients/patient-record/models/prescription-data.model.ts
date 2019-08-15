export interface PrescriptionData {
  id: string;
  prescriptions: Prescription[];
  created: string;
  complaint: string;
  patient: string;
}

export interface Prescription {
  maintenableFlg: boolean;
  medicine: string;
  preparation: string;
  sig: string;
  quantity: number;
}