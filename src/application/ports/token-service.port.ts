import Id from "../../domain/common/value-objects/id.vo";
import AccessToken from "../../domain/common/value-objects/access-token.vo";
import UserId from "../../domain/user/value-objects/user-id.vo";

export interface TokenService {
    verifyAccessToken(
        token: AccessToken,
    ): UserId;
}

export default TokenService;
