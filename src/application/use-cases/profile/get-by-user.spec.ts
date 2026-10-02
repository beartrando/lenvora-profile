import GetByUserUseCase from './get-by-user';
import ProfileRepository from '../../../domain/profile/profile.repository';
import ProfileEntity from '../../../domain/profile/profile.entity';
import UserId from '../../../domain/user/value-objects/user-id.vo';
import {NotFoundError} from '@shared/errors';

describe('GetByUserUseCase', () => {
  let useCase: GetByUserUseCase;
  let mockProfileRepository: jest.Mocked<ProfileRepository>;

  const mockUserId = new UserId('user-123');

  beforeEach(() => {
    mockProfileRepository = {
      findByUserId: jest.fn(),
    } as unknown as jest.Mocked<ProfileRepository>;

    useCase = new GetByUserUseCase(mockProfileRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return profile when found', async () => {
    const mockProfile = ProfileEntity.create({userId: mockUserId});
    mockProfileRepository.findByUserId.mockResolvedValue(mockProfile);

    const result = await useCase.execute(mockUserId);

    expect(mockProfileRepository.findByUserId).toHaveBeenCalledWith(mockUserId);
    expect(result).toBe(mockProfile);
  });

  it('should throw NotFoundError when profile not found', async () => {
    mockProfileRepository.findByUserId.mockResolvedValue(null);

    await expect(useCase.execute(mockUserId)).rejects.toThrow(NotFoundError);
    await expect(useCase.execute(mockUserId)).rejects.toThrow('Profile');
  });
});
