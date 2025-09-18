import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getConditionText(condition: string): string {
  const conditionMap: { [key: string]: string } = {
    'new': 'Mới 100%',
    'like_new': 'Như mới',
    'good': 'Tốt',
    'fair': 'Khá',
  };
  return conditionMap[condition] || condition;
}

export function getCategoryText(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'vintage': 'Vintage',
    'y2k': 'Y2K',
    'streetwear': 'Streetwear',
    'casual': 'Casual',
    'formal': 'Formal',
  };
  return categoryMap[category] || category;
}

export function getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'shipping': 'Đang giao',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy',
  };
  return statusMap[status] || status;
}
