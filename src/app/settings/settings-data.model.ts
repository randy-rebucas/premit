export interface SettingsData {
  id: string;
  clinic_name: string;
  clinic_address: string;
  clinic_url: string;
  clinic_phone: Contact[];
  clinic_hours: Hour[];
}

export interface Contact {
  contact: string;
}

export interface Hour {
  morning: string;
  afternoon: string;
}