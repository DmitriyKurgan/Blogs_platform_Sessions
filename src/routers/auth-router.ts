import {Request, Response, Router} from "express";
import {usersService} from "../services/users-service";
import {CodeResponsesEnum} from "../utils/utils";
import {
    authMiddleware, requestAttemptsMiddleware,
    validateAuthorization,
    validateAuthRequests,
    validateEmailResendingRequests,
    validateErrorsMiddleware,
    validateRegistrationConfirmationRequests,
    validateUsersRequests,
    validationEmailConfirm,
    validationEmailResend,
    validationRefreshToken,
    validationUserUnique
} from "../middlewares/middlewares";
import {jwtService} from "../application/jwt-service";
import {authService} from "../services/auth-service";
import {emailService} from "../services/email-service";
import {usersRepository} from "../repositories/users-repository";
import {tokensService} from "../services/tokens-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {devicesService} from "../services/devices-service";
import {randomUUID, UUID} from "crypto";

export const authRouter = Router({});

authRouter.post('/login', validateAuthRequests, requestAttemptsMiddleware, validateErrorsMiddleware, async (req: Request, res: Response) => {

    const {loginOrEmail, password} = req.body
    const user = await usersService.checkCredentials(loginOrEmail, password)

    if (!user) {
        return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
    }

    const deviceId:UUID = randomUUID();
    const ip = req.ip!;
    const deviceTitle =  req.headers['user-agent'] || "browser not found"
    const token = await jwtService.createJWT(user, deviceId);
    const lastActiveDate = jwtService.getLastActiveDateFromToken(token.refreshToken);
    const session = await devicesService.createDevice(user.id, ip, deviceTitle , lastActiveDate, deviceId)

    res.cookie('refreshToken', token.refreshToken, {httpOnly: true, secure: true,})
        .status(CodeResponsesEnum.OK_200)
        .send(token.accessToken);

});

authRouter.post('/refresh-token', validationRefreshToken, async (req: Request, res: Response) => {
    const deviceId = req.deviceId!;
    const userId = req.userId!;
    const user = await usersQueryRepository.findUserByID(userId);
    const {refreshToken, accessToken} = await jwtService.createJWT(user, deviceId);
    await tokensService.createNewBlacklistedRefreshToken(req.cookies.refreshToken);
    const newRefreshTokenObj = await jwtService.verifyToken(
        refreshToken
    );
    const newIssuedAt = newRefreshTokenObj!.iat;
    const ip = req.ip!;
    await devicesService.updateDevice(ip, deviceId, newIssuedAt);
    res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true});
    res.status(CodeResponsesEnum.OK_200).send(accessToken)
});

authRouter.post('/registration',
    validateUsersRequests,
    validationUserUnique("email"),
    validationUserUnique("login"),
    requestAttemptsMiddleware,
    validateErrorsMiddleware,
    async (req: Request, res: Response) => {
        await usersService.createUser(req.body.login, req.body.email, req.body.password);
        const userAccount = await usersRepository.findByLoginOrEmail(req.body.email);
        if (!userAccount) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }
        await emailService.sendEmail(userAccount.accountData.email, userAccount?.emailConfirmation?.confirmationCode);
        res.sendStatus(CodeResponsesEnum.Not_content_204)
    });
authRouter.post('/registration-confirmation',
    validateRegistrationConfirmationRequests,
    validationEmailConfirm,
    requestAttemptsMiddleware,
    validateErrorsMiddleware,
    async (req: Request, res: Response) => {
        const confirmationCode = req.body.code;
        const confirmationResult = authService.confirmRegistration(confirmationCode);
        if (!confirmationResult) {
            return res.sendStatus(CodeResponsesEnum.Incorrect_values_400);
        }
        res.sendStatus(CodeResponsesEnum.Not_content_204);
    });
authRouter.post('/registration-email-resending',
    validateEmailResendingRequests,
    validationEmailResend,
    requestAttemptsMiddleware,
    validateErrorsMiddleware, async (req: Request, res: Response) => {
        const userEmail = req.body.email;
        const confirmationCodeUpdatingResult = await authService.resendEmail(userEmail);
        if (!confirmationCodeUpdatingResult) return;
        res.sendStatus(CodeResponsesEnum.Not_content_204);
    });

authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const myID = req.userId
    if (!myID) {
        return res.sendStatus(CodeResponsesEnum.Unauthorized_401);
    }
    const user = await usersRepository.findUserByID(myID);
    if (!user) {
        return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
    }
    res.status(CodeResponsesEnum.OK_200).send({
        email: user.accountData.email,
        login: user.accountData.userName,
        userId: myID
    })
});

authRouter.post('/logout', validationRefreshToken, async (req: Request, res: Response) => {

    const cookieRefreshToken = req.cookies.refreshToken!;
    const { deviceId } = await jwtService.verifyToken(
        cookieRefreshToken
    );

    const clearTokensPair =  await tokensService.createNewBlacklistedRefreshToken(cookieRefreshToken);

    if (!clearTokensPair) return res.sendStatus(CodeResponsesEnum.Unauthorized_401)

    if (deviceId) {
        await devicesService.deleteDevice(deviceId);
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
});

authRouter.delete("/tokens",validateAuthorization, async (req: Request, res: Response) => {
    const isDeleted = await tokensService.deleteAll();
    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});