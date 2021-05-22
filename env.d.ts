declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: string;
        DEBUG: string;
        PORT: string;
        DB_URL: string;
        DB_PORT: string;
        REDIS_HOST: string;
        REDIS_PORT: string;
        REDIS_FAMILY: string;
        REDIS_DB: string;
        REDIS_PASS: string;
        SESSION_SECRET: string;
        FACEBOOK_APP_ID: string;
        FACEBOOK_APP_SECRET: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
    }
}
