import {
  addDays,
  buildCareSchedule,
  dateValue,
  localToday,
  weatherDecision,
} from './crop-care.scheduler';

const stages = [
  {
    name: 'Giai đoạn 1',
    durationDays: 5,
    rules: [
      {
        id: 'water',
        action: 'watering',
        day: 0,
        repeatEveryDays: 2,
        guidance: 'Kiểm tra độ ẩm',
        time: '07:00',
      },
    ],
  },
  {
    name: 'Giai đoạn 2',
    durationDays: 3,
    rules: [
      {
        id: 'harvest',
        action: 'harvesting',
        day: 1,
        guidance: 'Kiểm tra trước thu hoạch',
        time: '08:00',
      },
    ],
  },
];

describe('Care scheduling', () => {
  it('schedules repeats and offsets subsequent stages', () => {
    const entries = buildCareSchedule(stages, '2026-10-01', '2026-10-01');
    expect(entries.map((item) => item.date)).toEqual([
      '2026-10-01',
      '2026-10-03',
      '2026-10-05',
      '2026-10-07',
    ]);
    expect(entries[3].stage).toBe('Giai đoạn 2');
  });
  it('omits past tasks and respects the exclusive horizon boundary', () => {
    expect(
      buildCareSchedule(stages, '2026-10-01', '2026-10-03', 2).map(
        (item) => item.date,
      ),
    ).toEqual(['2026-10-03']);
  });
  it('produces stable unique keys on repeated syncs', () => {
    const first = buildCareSchedule(stages, '2026-10-01', '2026-10-01');
    expect(buildCareSchedule(stages, '2026-10-01', '2026-10-01')).toEqual(
      first,
    );
    expect(new Set(first.map((item) => item.key)).size).toBe(first.length);
  });
  it('rejects impossible calendar dates', () => {
    expect(() => dateValue('2026-02-30')).toThrow();
    expect(() => dateValue('invalid')).toThrow();
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
  });
  it('uses Vietnam calendar date around UTC midnight', () => {
    expect(localToday(new Date('2026-10-06T18:00:00Z'))).toBe('2026-10-07');
  });
  it('ends after the last growth stage', () => {
    expect(buildCareSchedule(stages, '2026-10-01', '2026-11-01')).toEqual([]);
  });
});

describe('Weather adjustments', () => {
  it.each(['watering', 'fertilizing', 'pruning'])(
    'blocks %s at configured rain threshold',
    (action) => {
      expect(weatherDecision(action, '08:00', 10, 30, 10).blocked).toBe(true);
    },
  );
  it('restores a previously blocked schedule when rain subsides', () => {
    expect(weatherDecision('watering', '08:00', 0, 30, 10)).toEqual({
      blocked: false,
      time: '08:00',
      note: '',
    });
  });
  it('moves watering earlier at the configured heat threshold', () => {
    expect(weatherDecision('watering', '08:00', 0, 35, 10, 35).time).toBe(
      '06:00',
    );
  });
  it('does not impose weather thresholds that the template does not specify', () => {
    expect(weatherDecision('watering', '08:00', 20, 40)).toEqual({
      blocked: false,
      time: '08:00',
      note: '',
    });
  });
  it('does not block harvesting automatically', () => {
    expect(weatherDecision('harvesting', '08:00', 20, 40, 10, 35).blocked).toBe(
      false,
    );
  });
});
