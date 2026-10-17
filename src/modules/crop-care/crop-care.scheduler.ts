import { BadRequestException } from '@nestjs/common';
import { CareStageDto } from './crop-care.dto';

const DAY = 86400000;
export const localToday = (now = new Date()) =>
  new Date(now.getTime() + 7 * 3600000).toISOString().slice(0, 10);
export function dateValue(date: string): number {
  const value = Date.parse(`${date}T00:00:00Z`);
  if (
    !Number.isFinite(value) ||
    new Date(value).toISOString().slice(0, 10) !== date
  ) {
    throw new BadRequestException('Ngày không hợp lệ, yêu cầu YYYY-MM-DD');
  }
  return value;
}
export const addDays = (date: string, days: number) =>
  new Date(dateValue(date) + days * DAY).toISOString().slice(0, 10);

export function buildCareSchedule(
  stages: CareStageDto[],
  anchor: string,
  from: string,
  days = 30,
) {
  const start = dateValue(from);
  const end = start + days * DAY;
  let offset = 0;
  const entries: {
    key: string;
    date: string;
    stage: string;
    rule: CareStageDto['rules'][number];
  }[] = [];
  for (const [index, stage] of stages.entries()) {
    for (const rule of stage.rules) {
      for (
        let day = rule.day;
        day < stage.durationDays;
        day += rule.repeatEveryDays ?? stage.durationDays
      ) {
        const date = addDays(anchor, offset + day);
        const value = dateValue(date);
        if (value >= start && value < end)
          entries.push({
            key: `${index}:${rule.id}:${date}`,
            date,
            stage: stage.name,
            rule,
          });
      }
    }
    offset += stage.durationDays;
  }
  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

export function weatherDecision(
  action: string,
  time: string,
  rain: number,
  temperature: number,
  rainThreshold?: number,
  heatThreshold?: number,
) {
  if (
    rainThreshold !== undefined &&
    rain >= rainThreshold &&
    ['watering', 'fertilizing', 'pruning'].includes(action)
  ) {
    return {
      blocked: true,
      time,
      note: `Dự báo mưa ${rain} mm: tạm hoãn công việc, kiểm tra điều kiện thực tế.`,
    };
  }
  if (
    action === 'watering' &&
    heatThreshold !== undefined &&
    temperature >= heatThreshold
  ) {
    return {
      blocked: false,
      time: '06:00',
      note: `Dự báo nhiệt độ ${temperature}°C: chuyển tưới sang 06:00, kiểm tra độ ẩm đất.`,
    };
  }
  return { blocked: false, time, note: '' };
}
