import GetOrCreateUseCase from './get-or-create';
import ProfileRepository from '../../../domain/profile/profile.repository';
import ProfileEntity from '../../../domain/profile/profile.entity';
import JobService from '../../../infrastructure/job/service';
import ProfileProtoMapper from '../../../infrastructure/grpc/mappers/profile.proto.mapper';
import UserId from '../../../domain/user/value-objects/user-id.vo';

describe('GetOrCreateUseCase', () => {
  let useCase: GetOrCreateUseCase;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;
  let mockJobService: jest.Mocked<JobService>;
  let mockProfileProtoMapper: jest.Mocked<typeof ProfileProtoMapper>;

  const mockUserId = new UserId('user-123');
  const profileCreatedTopic = 'profile.created';

  beforeEach(() => {
    mockProfileRepository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    mockJobService = {
      enqueue: jest.fn(),
    } as unknown as jest.Mocked<JobService>;

    mockProfileProtoMapper = {
      toProto: jest.fn().mockReturnValue({id: 'profile-123', userId: 'user-123'}),
    } as unknown as jest.Mocked<typeof ProfileProtoMapper>;

    useCase = new GetOrCreateUseCase(mockProfileRepository, mockJobService, profileCreatedTopic);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return existing profile when found', async () => {
    const existingProfile = ProfileEntity.create({userId: mockUserId});
    mockProfileRepository.findByUserId.mockResolvedValue(existingProfile);

    const result = await useCase.execute(mockUserId);

    expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
    expect(mockProfileRepository.save).not.toHaveBeenCalled();
    expect(mockJobService.enqueue).not.toHaveBeenCalled();
    expect(result).toBe(existingProfile);
  });

  it('should create new profile when not found', async () => {
    const newProfile = ProfileEntity.create({userId: mockUserId});
    mockProfileRepository.findByUserId.mockResolvedValue(null);
    mockProfileRepository.save.mockResolvedValue(undefined);
    mockJobService.enqueue.mockResolvedValue(undefined);

    const result = await useCase.execute(mockUserId);

    expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
    expect(mockProfileRepository.save).toHaveBeenCalled();
    expect(mockJobService.enqueue).toHaveBeenCalledWith(profileCreatedTopic, expect.any(Object));
    expect(result).toBeInstanceOf(ProfileEntity);
    expect(result.userId).toEqual(mockUserId);
  });
});