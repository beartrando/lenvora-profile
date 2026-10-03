import ProfileHandler from './profile.handler';
import GetUseCase from '../../../application/use-cases/profile/get';
import GetOrCreateUseCase from '../../../application/use-cases/profile/get-or-create';
import GetByUserUseCase from '../../../application/use-cases/profile/get-by-user';
import AuthService from '../../auth/service';
import ProfileId from '../../../domain/profile/value-objects/profile-id.vo';
import UserId from '../../../domain/user/value-objects/user-id.vo';
import ProfileEntity from '../../../domain/profile/profile.entity';
import SessionAccessToken from '../../../domain/session/value-objects/session-access-token.vo';
import {NotFoundError} from '@shared/errors';
import AuthHelper from '../helpers/auth.helper';

jest.mock('../helpers/auth.helper');

describe('ProfileHandler', () => {
    let handler: ProfileHandler;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockGetOrCreateUseCase: jest.Mocked<GetOrCreateUseCase>;
    let mockGetByUserUseCase: jest.Mocked<GetByUserUseCase>;
    let mockGetUseCase: jest.Mocked<GetUseCase>;
    let mockCallback: jest.Mock;

    beforeEach(() => {
        mockAuthService = {
            verifyAccessToken: jest.fn(),
        } as unknown as jest.Mocked<AuthService>;

        mockGetOrCreateUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<GetOrCreateUseCase>;

        mockGetByUserUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<GetByUserUseCase>;

        mockGetUseCase = {
            execute: jest.fn(),
        } as unknown as jest.Mocked<GetUseCase>;

        handler = new ProfileHandler(
            mockAuthService,
            mockGetOrCreateUseCase,
            mockGetByUserUseCase,
            mockGetUseCase,
        );

        (AuthHelper.getAccessToken as jest.Mock).mockReturnValue(new SessionAccessToken('test-token'));

        mockCallback = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getOrCreate', () => {
        it('should verify access token and return profile', async () => {
            const mockProfile = ProfileEntity.create({userId: new UserId('user-123')});
            mockAuthService.verifyAccessToken.mockReturnValue(new UserId('user-123'));
            mockGetOrCreateUseCase.execute.mockResolvedValue(mockProfile);

            const mockCall = {
                request: {userId: 'user-123'},
                metadata: new Map([['authorization', 'Bearer access-token']]),
            };

            await handler.getOrCreate(mockCall as any, mockCallback);

            expect(AuthHelper.getAccessToken).toHaveBeenCalled();
            expect(mockAuthService.verifyAccessToken).toHaveBeenCalled();
            expect(mockGetOrCreateUseCase.execute).toHaveBeenCalledWith(expect.any(UserId));
            expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
                profile: expect.any(Object),
            }));
        });

        it('should call callbackError on error', async () => {
            (AuthHelper.getAccessToken as jest.Mock).mockImplementation(() => {
                throw new Error('Invalid token');
            });

            const mockCall = {
                request: {userId: 'user-123'},
                metadata: new Map([['authorization', 'Bearer invalid-token']]),
            };

            await handler.getOrCreate(mockCall as any, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({code: expect.any(Number), details: 'Invalid token'}),
                null
            );
        });
    });

    describe('get', () => {
        it('should return profile by id', async () => {
            const mockProfile = ProfileEntity.create({userId: new UserId('user-123')});
            mockGetUseCase.execute.mockResolvedValue(mockProfile);

            const mockCall = {
                request: {profileId: 'profile-123'},
            };

            await handler.get(mockCall as any, mockCallback);

            expect(mockGetUseCase.execute).toHaveBeenCalledWith(expect.any(ProfileId));
            expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
                profile: expect.any(Object),
            }));
        });

        it('should throw NotFoundError when profile not found', async () => {
            mockGetUseCase.execute.mockRejectedValue(new Error('Profile does not exist'));

            const mockCall = {
                request: {profileId: 'profile-123'},
            };

            await handler.get(mockCall as any, mockCallback);

            expect(mockCallback).toHaveBeenCalledWith(
                expect.objectContaining({code: expect.any(Number), details: 'Profile does not exist'}),
                null
            );
        });
    });

    describe('getByUser', () => {
        it('should return profile by user id', async () => {
            const mockProfile = ProfileEntity.create({userId: new UserId('user-123')});
            mockGetByUserUseCase.execute.mockResolvedValue(mockProfile);

            const mockCall = {
                request: {userId: 'user-123'},
            };

            await handler.getByUser(mockCall as any, mockCallback);

            expect(mockGetByUserUseCase.execute).toHaveBeenCalledWith(expect.any(UserId));
            expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
                profile: expect.any(Object),
            }));
        });

        it('should call callbackError on NotFoundError', async () => {
            mockGetByUserUseCase.execute.mockRejectedValue(new NotFoundError('Profile'));

            const mockCall = {
                request: {userId: 'user-123'},
            };

            await handler.getByUser(mockCall as any, mockCallback);

            // callbackError returns gRPC error format as second argument
            expect(mockCallback).toHaveBeenCalledWith(
                null,
                expect.objectContaining({error: expect.objectContaining({code: expect.any(Number)})})
            );
        });
    });
});
