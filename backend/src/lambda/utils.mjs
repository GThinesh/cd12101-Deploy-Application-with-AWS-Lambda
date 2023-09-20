import {parseUserId} from '../auth/utils.mjs'
import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import cors from "@middy/http-cors";

export function  getUserId(event) {
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    return parseUserId(jwtToken)
}

export function corsEnabled() {
    return middy()
        .use(httpErrorHandler())
        .use(
            cors({
                credentials: true
            })
        )
}