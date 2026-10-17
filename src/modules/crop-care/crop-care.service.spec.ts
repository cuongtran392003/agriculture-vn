import { CropCareService } from './crop-care.service';

describe('CropCareService', () => {
  let service: CropCareService;
  let templates: any;
  let plans: any;
  let tasks: any;
  let farms: any;
  let plots: any;
  let weather: any;
  beforeEach(() => {
    templates = { findOne: jest.fn(), create: jest.fn() };
    plans = { findOne: jest.fn(), create: jest.fn(), updateOne: jest.fn() };
    tasks = {
      bulkWrite: jest.fn(),
      find: jest.fn().mockResolvedValue([]),
      updateOne: jest.fn(),
    };
    farms = { exists: jest.fn().mockResolvedValue(true) };
    plots = { exists: jest.fn().mockResolvedValue(true) };
    weather = { forecast: jest.fn().mockResolvedValue(new Map()) };
    service = new CropCareService(
      templates,
      plans,
      tasks,
      farms,
      plots,
      weather,
    );
  });
  it('rejects another account farm before writing', async () => {
    farms.exists.mockResolvedValue(null);
    await expect(
      service.createPlan('user', { farmId: 'farm' } as any),
    ).rejects.toThrow('Nông trại');
    expect(plans.create).not.toHaveBeenCalled();
  });
  it('rejects a plot outside the selected farm', async () => {
    plots.exists.mockResolvedValue(null);
    await expect(
      service.createPlan('user', { farmId: 'farm', plotId: 'plot' } as any),
    ).rejects.toThrow('Mảnh đất');
    expect(plots.exists).toHaveBeenCalledWith({
      _id: 'plot',
      farmId: 'farm',
      userId: 'user',
    });
  });
  it('scopes plan access to the current user', async () => {
    plans.findOne.mockResolvedValue(null);
    const id = '507f1f77bcf86cd799439011';
    await expect(service.detail(id, 'user')).rejects.toThrow('Không tìm thấy');
    expect(plans.findOne).toHaveBeenCalledWith({ _id: id, userId: 'user' });
  });
  it('rejects rules scheduled beyond the stage duration', async () => {
    await expect(
      service.createTemplate('user', {
        cropName: 'Test',
        region: 'Test',
        source: 'Test',
        stages: [
          {
            name: 'Stage',
            durationDays: 5,
            rules: [{ id: 'a', day: 5 } as any],
          },
        ],
      }),
    ).rejects.toThrow('ngày vượt quá');
    expect(templates.create).not.toHaveBeenCalled();
  });
  it('keeps task generation available if the weather provider fails', async () => {
    const date = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
    const template = {
      _id: 'template',
      cropName: 'Test',
      region: 'Test',
      stages: [
        {
          name: 'Stage',
          durationDays: 10,
          rules: [
            {
              id: 'a',
              action: 'watering',
              day: 0,
              time: '08:00',
              guidance: 'Test',
            },
          ],
        },
      ],
    };
    templates.findOne.mockResolvedValue(template);
    plans.create.mockImplementation(async (data) => ({
      ...data,
      _id: 'plan',
      active: true,
    }));
    weather.forecast.mockRejectedValue(new Error('offline'));
    const result = await service.createPlan('user', {
      farmId: 'farm',
      templateId: 'template',
      plantingDate: date,
      latitude: 10,
      longitude: 106,
    });
    expect(result.data.weatherStatus).toBe('unavailable');
    const operation = tasks.bulkWrite.mock.calls[0][0][0].updateOne;
    expect(operation.upsert).toBe(true);
    expect(operation.update.$setOnInsert.status).toBe('pending');
    expect(operation.filter).toEqual({
      carePlanId: 'plan',
      careKey: `0:a:${date}`,
    });
  });
});
