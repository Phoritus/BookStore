import { format, parseISO, differenceInHours } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy');
};

export const formatTime = (date: Date | string): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'HH:mm');
};

export const formatDateTime = (date: Date | string): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy HH:mm');
};

export const calculateBookingDuration = (startDate: Date, endDate: Date): number => {
  return differenceInHours(endDate, startDate);
};

export const calculateBookingPrice = (duration: number, hourlyRate: number): { total: number; discount: number; finalPrice: number } => {
  const total = duration * hourlyRate;
  const discount = duration >= 5 ? total * 0.15 : 0; // 15% discount for 5+ hours
  const finalPrice = total - discount;
  
  return { total, discount, finalPrice };
};

export const generateTimeSlots = (startHour: number = 8, endHour: number = 22): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Thai phone number validation (basic)
  const phoneRegex = /^(\+66|0)[0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

export const validateNationalId = (nationalId: string): boolean => {
  // Thai national ID validation (13 digits)
  const cleanId = nationalId.replace(/\s|-/g, '');
  if (!/^\d{13}$/.test(cleanId)) return false;
  
  // Check digit validation for Thai national ID
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleanId[i]) * (13 - i);
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(cleanId[12]);
};

export const formatThaiPhone = (phone: string): string => {
  const clean = phone.replace(/\D/g, '');
  if (clean.length === 10 && clean.startsWith('0')) {
    return `${clean.slice(0, 3)}-${clean.slice(3, 6)}-${clean.slice(6)}`;
  }
  return phone;
};

export const formatThaiNationalId = (nationalId: string): string => {
  const clean = nationalId.replace(/\D/g, '');
  if (clean.length === 13) {
    return `${clean.slice(0, 1)}-${clean.slice(1, 5)}-${clean.slice(5, 10)}-${clean.slice(10, 12)}-${clean.slice(12)}`;
  }
  return nationalId;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const generateBookingId = (): string => {
  return `BK${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

export const getThaiDate = (): Date => {
  const now = new Date();
  const thaiOffset = 7 * 60; // GMT+7 in minutes
  const localOffset = now.getTimezoneOffset();
  const thaiTime = new Date(now.getTime() + (thaiOffset + localOffset) * 60000);
  return thaiTime;
};
