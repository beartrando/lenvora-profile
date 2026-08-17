import Id from "../../domain/value-objects/ProfileId.vo";
import AccessToken from "../../domain/common/value-objects/access-token.vo";

export interface TokenService {
    verifyAccessToken(
        token: AccessToken,
    ): Id;
}

export default TokenService;
