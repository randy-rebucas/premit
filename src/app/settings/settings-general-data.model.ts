export interface SettingsGeneralData {
  id: string;
  license_key: string;
  clinic_name: string;
  clinic_owner: string;
  clinic_address: string;
  clinic_email: string;
  clinic_url: string;
  prc: string;
  ptr: string;
  s2: string;
  clinic_phone: Contact[];
  clinic_hours: Hour[];
}

export interface Contact {
  contact: string;
}

export interface Hour {
  morning_open: string;
  morning_close: string;
  afternoon_open: string;
  afternoon_close: string;
}
