export interface PrescriptionData {
  id: string;
  complaint: string;
  created: string;
  patient: string;
  prescriptions: Prescription[];
}

export interface Prescription {
  maintenableFlg: boolean;
  medicine: string;
  preparation: string;
  sig: string;
  quantity: number;
}
