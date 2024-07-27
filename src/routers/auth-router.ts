import {Request, Response, Router} from "express";
import {usersService} from "../services/users-service";
import {CodeResponsesEnum} from "../utils/utils";
import {
    authMiddleware, rateLimitMiddleware,
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
import {OutputUserType} from "../utils/types";
import {usersRepository} from "../repositories/users-repository";
import {tokensService} from "../services/tokens-service";
import {usersQueryRepository} from "../repositories/query-repositories/users-query-repository";
import {devicesService} from "../services/devices-service";

export const authRouter = Router({});

authRouter.post('/login', validateAuthRequests, rateLimitMiddleware, validateErrorsMiddleware, async (req: Request, res: Response) => {
    const user = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) {
        return res.sendStatus(CodeResponsesEnum.Unauthorized_401)
    }
    const ip = req.ip!
    const deviceTitle =  req.headers['user-agent'] || "browser not found"
    const token = await jwtService.createJWT(user);
    const lastActiveDate = jwtService.getLastActiveDateFromToken(token.refreshToken);
    const deviceId =  jwtService.getDeviceIdFromToken(token.refreshToken)
    const session = await devicesService.createDevice(user.id, ip, deviceTitle , lastActiveDate, deviceId)
    res
        .cookie('refreshToken', token.refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 20 * 1000,
            sameSite: 'strict'
        })
        .status(CodeResponsesEnum.OK_200)
        .send(token.accessToken);

});

authRouter.post('/refresh-token', validationRefreshToken, async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const userId = await jwtService.getUserIdByToken(refreshToken);
    if (userId) {
        await tokensService.createNewBlacklistedRefreshToken(refreshToken);
        const user = await usersQueryRepository.findUserByID(userId);
        const newAccessToken = (await jwtService.createJWT(user)).accessToken;
        const newRefreshToken = (await jwtService.createJWT(user)).refreshToken;
        const newRefreshTokenObj = await jwtService.verifyToken(
            newRefreshToken
        );
        const newIssuedAt = newRefreshTokenObj!.iat;
        const deviceId = newRefreshTokenObj!.deviceId;
        const ip = req.ip!;
        await devicesService.updateDevice(ip, deviceId, newIssuedAt);

        res
            .cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
            })
            .status(200)
            .json(newAccessToken);
    } else {
        console.log('here')
        res.sendStatus(401);
    }
});

authRouter.post('/registration',
    validateUsersRequests,
    validationUserUnique("email"),
    validationUserUnique("login"),
    validateErrorsMiddleware,
    async (req: Request, res: Response) => {
        const userAccount: OutputUserType | null = await usersService.createUser(req.body.login, req.body.email, req.body.password);
        if (!userAccount) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }
        const gmailResponse = await emailService.sendEmail(userAccount, userAccount.emailConfirmation.confirmationCode);
        if (!gmailResponse) {
            return res.sendStatus(CodeResponsesEnum.Not_found_404)
        }
        res.sendStatus(CodeResponsesEnum.Not_content_204)
    });
authRouter.post('/registration-confirmation',
    validateRegistrationConfirmationRequests,
    validationEmailConfirm,
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
    const cookieRefreshToken = req.cookies.refreshToken;
    const cookieRefreshTokenObj = await jwtService.verifyToken(
        cookieRefreshToken
    );
    await tokensService.createNewBlacklistedRefreshToken(cookieRefreshToken);
    if (cookieRefreshTokenObj) {
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