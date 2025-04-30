// types/next-connect.d.ts
import type { NextApiRequest, NextApiResponse } from 'next';

declare module 'next-connect' {
  import { IncomingMessage, ServerResponse } from 'http';
  import { NextHandler } from 'next-connect';

  type Middleware<Req = IncomingMessage, Res = ServerResponse> = (
    req: Req,
    res: Res,
    next: (err?: any) => void
  ) => void;

  export default function nextConnect<
    Req = NextApiRequest,
    Res = NextApiResponse
  >(
    options?: any
  ): {
    use: (...middlewares: Middleware<Req, Res>[]) => any;
    get: (...handlers: Middleware<Req, Res>[]) => any;
    post: (...handlers: Middleware<Req, Res>[]) => any;
    put: (...handlers: Middleware<Req, Res>[]) => any;
    delete: (...handlers: Middleware<Req, Res>[]) => any;
    patch: (...handlers: Middleware<Req, Res>[]) => any;
    all: (...handlers: Middleware<Req, Res>[]) => any;
    handler: Middleware<Req, Res>;
  };
}
