import GetUseCase from './get';
import ProfileRepository from '../../../domain/profile/profile.repository';
import ProfileEntity from '../../../domain/profile/profile.entity';
import ProfileId from '../../../domain/profile/value-objects/profile-id.vo';

describe('GetUseCase', () => {
  let useCase: GetUseCase;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;

  const mockProfileId = new ProfileId('profile-123');

  beforeEach(() => {
    mockProfileRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new GetUseCase(mockProfileRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return profile when found', async () => {
    const mockProfile = ProfileEntity.create({userId: {value: 'user-123', equals: jest.fn()}});
    mockProfileRepository.findById.mockResolvedValue(mockProfile);

    const result = await useCase.execute(mockProfileId);

    expect(mockProfileRepository.findById).toHaveBeenCalledWith(mockProfileId);
    expect(result).toBe(mockProfile);
  });

  it('should throw error when profile not found', async () => {
    mockProfileRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(mockProfileId)).rejects.toThrow('Profile does not exist');
  });
});